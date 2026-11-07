#!/usr/bin/env node
import { access, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { queueWorkflow, waitForPrompt, saveComfyOutput } from './comfyui-adapter.mjs';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MODEL_REGISTRY = path.join(MODULE_DIR, '..', 'config', 'models.json');

function flag(args, name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function safeChild(root, requested) {
  if (!requested || typeof requested !== 'string' || path.isAbsolute(requested)) {
    throw new Error('Project-relative paths are required');
  }
  const base = path.resolve(root);
  const target = path.resolve(base, requested);
  const relative = path.relative(base, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Path escapes the production project');
  }
  return target;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export function readGpuTelemetry(spawnImpl = spawnSync) {
  const result = spawnImpl('nvidia-smi', [
    '--query-gpu=name,memory.total,memory.used,utilization.gpu,temperature.gpu',
    '--format=csv,noheader,nounits'
  ], { encoding: 'utf8', timeout: 5000, windowsHide: true, shell: false });
  if (result.error || result.status !== 0) return null;
  return String(result.stdout ?? '').split(/\r?\n/).filter(Boolean).map((line) => {
    const [name, total, used, utilization, temperature] = line.split(',').map((part) => part.trim());
    return {
      name,
      memoryTotalMiB: Number(total),
      memoryUsedMiB: Number(used),
      utilizationPercent: Number(utilization),
      temperatureC: Number(temperature)
    };
  }).filter((gpu) => gpu.name && Number.isFinite(gpu.memoryTotalMiB) && Number.isFinite(gpu.memoryUsedMiB));
}

function summarizeGpuTelemetry(samples) {
  const devices = samples.flat();
  if (devices.length === 0) return null;
  return {
    sampleCount: samples.length,
    devices: [...new Set(devices.map((gpu) => gpu.name))],
    peakMemoryUsedMiB: Math.max(...devices.map((gpu) => gpu.memoryUsedMiB)),
    totalMemoryMiB: Math.max(...devices.map((gpu) => gpu.memoryTotalMiB)),
    peakUtilizationPercent: Math.max(...devices.map((gpu) => Number.isFinite(gpu.utilizationPercent) ? gpu.utilizationPercent : 0)),
    peakTemperatureC: Math.max(...devices.map((gpu) => Number.isFinite(gpu.temperatureC) ? gpu.temperatureC : 0))
  };
}

async function writeJobState(file, state) {
  await writeFile(file, JSON.stringify({ schemaVersion: '1.0', updatedAt: new Date().toISOString(), ...state }, null, 2) + '\n');
}

export async function runComfyProduction({
  projectDirectory,
  workflowPath,
  modelId,
  checkpointFile,
  modelRegistryPath = DEFAULT_MODEL_REGISTRY,
  approved = false,
  benchmarkOnly = false,
  baseUrl = 'http://127.0.0.1:8188',
  timeoutMs = 30 * 60 * 1000,
  pollIntervalMs = 2000,
  fetchImpl = fetch,
  gpuQueryImpl = readGpuTelemetry,
  sleepImpl,
  onProgress = () => {}
}) {
  if (approved !== true) throw new Error('Generation requires explicit human approval of the brief and workflow');
  const projectRoot = path.resolve(projectDirectory);
  const project = await readJson(path.join(projectRoot, 'project.json'));
  if (!['brief-approved', 'production-approved'].includes(project.status)) {
    throw new Error('Project must have an approved brief before generation');
  }
  if (project.approvalRequiredBeforeGeneration) throw new Error('Project approval flag still blocks generation');
  const briefPath = safeChild(projectRoot, project.briefFile);
  await access(briefPath);
  const brief = await readJson(briefPath);
  if (brief.approval?.status !== 'approved' || !brief.approval?.approvedBy || !brief.approval?.approvedAt) {
    throw new Error('Approved brief must include approver and timestamp');
  }
  if (brief.rights?.clientAssetsApprovedForGeneration !== true || brief.rights?.modelLicenseReviewed !== true) {
    throw new Error('Generation requires explicit client-asset permission and model-license review');
  }

  const workflowFile = safeChild(projectRoot, workflowPath);
  const workflowBytes = await readFile(workflowFile);
  const workflowSha256 = createHash('sha256').update(workflowBytes).digest('hex');
  const workflow = JSON.parse(workflowBytes.toString('utf8'));
  if (!modelId || !checkpointFile || path.basename(checkpointFile) !== checkpointFile) {
    throw new Error('A registered model ID and exact checkpoint filename are required');
  }
  const registry = await readJson(modelRegistryPath);
  const model = registry.videoModels?.find((candidate) => candidate.id === modelId);
  if (!model) throw new Error('Model ID is not present in the approved model registry: ' + modelId);
  if (model.enabled !== true && !(benchmarkOnly === true && model.benchmarkAllowed === true)) {
    throw new Error('Model is disabled for production; only an explicitly approved, hardware-cleared benchmark is permitted: ' + modelId);
  }
  if (benchmarkOnly === true && brief.rights?.hardwareCompatibilityReviewed !== true) {
    throw new Error('Benchmark-only generation requires explicit hardware compatibility review');
  }
  if (!workflowBytes.toString('utf8').includes(checkpointFile)) {
    throw new Error('The selected checkpoint filename was not found in the supplied ComfyUI workflow');
  }
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow) || Object.keys(workflow).length === 0) {
    throw new Error('Workflow must be a non-empty ComfyUI API-format object');
  }

  const generationStartedAt = Date.now();
  const gpuSamples = [];
  const sampleGpu = () => {
    const sample = gpuQueryImpl();
    if (Array.isArray(sample) && sample.length > 0) gpuSamples.push(sample);
  };
  sampleGpu();
  const queued = await queueWorkflow({ baseUrl, workflow, fetchImpl });
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(queued.promptId)) {
    throw new Error('ComfyUI returned an unsafe prompt identifier');
  }
  const jobsDirectory = path.join(projectRoot, 'jobs');
  await mkdir(jobsDirectory, { recursive: true });
  const jobStatePath = path.join(jobsDirectory, queued.promptId + '.json');
  const initialState = {
    promptId: queued.promptId,
    queueNumber: queued.number,
    status: 'queued',
    phase: 'queued',
    modelId: model.id,
    checkpoint: checkpointFile,
    mode: benchmarkOnly ? 'benchmark-only' : 'production',
    workflowSha256,
    progress: null,
    error: null
  };
  await writeJobState(jobStatePath, initialState);
  await onProgress({ phase: 'queued', promptId: queued.promptId, queueNumber: queued.number });

  try {
    const completed = await waitForPrompt({
      baseUrl,
      promptId: queued.promptId,
      timeoutMs,
      pollIntervalMs,
      fetchImpl,
      ...(sleepImpl ? { sleepImpl } : {}),
      onProgress: async (progress) => {
        sampleGpu();
        await writeJobState(jobStatePath, { ...initialState, status: 'running', phase: 'generating', progress });
        await onProgress({ phase: 'generating', ...progress });
      }
    });

    const outputDirectory = path.join(projectRoot, 'assets', 'generated', queued.promptId);
    await mkdir(outputDirectory, { recursive: true });
    const saved = [];
    for (const [nodeId, nodeOutput] of Object.entries(completed.outputs)) {
      if (!/^[a-zA-Z0-9_-]{1,128}$/.test(nodeId)) {
        throw new Error('ComfyUI returned an unsafe output node identifier');
      }
      for (const outputType of ['videos', 'gifs', 'images']) {
        for (const item of nodeOutput?.[outputType] ?? []) {
          const filePath = await saveComfyOutput({
            baseUrl,
            output: item,
            destinationDirectory: path.join(outputDirectory, 'node-' + nodeId),
            fetchImpl
          });
          const outputStats = await stat(filePath);
          saved.push({
            nodeId,
            bytes: outputStats.size,
            mediaType: outputType,
            filename: path.basename(filePath),
            source: { filename: item.filename, subfolder: item.subfolder ?? '', type: item.type ?? 'output' }
          });
        }
      }
    }
    if (saved.length === 0) throw new Error('ComfyUI completed without any supported video, GIF or image outputs');

    sampleGpu();
    const generationSeconds = Number(((Date.now() - generationStartedAt) / 1000).toFixed(2));
    const promptValues = [];
    const seedValues = [];
    for (const node of Object.values(workflow)) {
      for (const [key, value] of Object.entries(node?.inputs ?? {})) {
        if (/^(prompt|text|positive_prompt)$/i.test(key) && typeof value === 'string' && value.trim()) promptValues.push(value);
        if (/^(seed|noise_seed)$/i.test(key) && (typeof value === 'string' || typeof value === 'number')) seedValues.push(value);
      }
    }
    const record = {
      schemaVersion: '1.0',
      promptId: queued.promptId,
      createdAt: new Date().toISOString(),
      briefFile: project.briefFile,
      workflowFile: path.relative(projectRoot, workflowFile).split(path.sep).join('/'),
      outputDirectory: path.relative(projectRoot, outputDirectory).split(path.sep).join('/'),
      outputs: saved,
      metrics: {
        generationSeconds,
        outputCount: saved.length,
        totalOutputBytes: saved.reduce((sum, item) => sum + item.bytes, 0),
        gpu: summarizeGpuTelemetry(gpuSamples)
      },
      approval: { generationApproved: true, benchmarkOnly, deliveryApproved: false },
      provenance: {
        model: { id: model.id, name: model.name, license: model.license, upstream: model.upstream },
        checkpoint: checkpointFile,
        workflowSha256,
        prompt: promptValues,
        seed: seedValues,
        licenseReviewed: true,
        humanApproved: false
      }
    };
    const manifestPath = path.join(outputDirectory, 'generation-manifest.json');
    await writeFile(manifestPath, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
    await writeJobState(jobStatePath, {
      ...initialState,
      status: 'completed',
      phase: 'completed',
      outputDirectory: path.relative(projectRoot, outputDirectory).split(path.sep).join('/'),
      manifestPath: path.relative(projectRoot, manifestPath).split(path.sep).join('/'),
      outputs: saved,
      metrics: { generationSeconds, totalOutputBytes: saved.reduce((sum, item) => sum + item.bytes, 0), gpu: summarizeGpuTelemetry(gpuSamples) },
      error: null
    });
    return { promptId: queued.promptId, outputDirectory, manifestPath, jobStatePath, outputs: saved };
  } catch (error) {
    await writeJobState(jobStatePath, {
      ...initialState,
      status: 'failed',
      phase: 'failed',
      error: String(error?.message ?? error).slice(0, 2000)
    });
    throw error;
  }
}

async function main(args) {
  const projectDirectory = flag(args, '--project');
  const workflowPath = flag(args, '--workflow');
  const modelId = flag(args, '--model-id');
  const checkpointFile = flag(args, '--checkpoint');
  if (!projectDirectory || !workflowPath || !modelId || !checkpointFile) {
    throw new Error('Usage: node bin/generate.mjs --project <project-dir> --workflow <api-workflow.json> --model-id <registered-id> --checkpoint <exact-filename> --approved');
  }
  const result = await runComfyProduction({
    projectDirectory,
    workflowPath,
    modelId,
    checkpointFile,
    approved: args.includes('--approved'),
    benchmarkOnly: args.includes('--benchmark-only'),
    baseUrl: flag(args, '--comfy-url', 'http://127.0.0.1:8188')
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
