#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { queueWorkflow, waitForPrompt, saveComfyOutput } from './comfyui-adapter.mjs';

function flag(args, name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function safeChild(root, requested) {
  if (!requested || path.isAbsolute(requested)) throw new Error('Project-relative paths are required');
  const base = path.resolve(root);
  const target = path.resolve(base, requested);
  const relative = path.relative(base, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Path escapes the production project');
  return target;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function runComfyProduction({
  projectDirectory,
  workflowPath,
  approved = false,
  baseUrl = 'http://127.0.0.1:8188',
  timeoutMs = 30 * 60 * 1000,
  pollIntervalMs = 2000,
  fetchImpl = fetch,
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
  const workflowFile = path.resolve(workflowPath);
  const workflow = await readJson(workflowFile);
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow) || Object.keys(workflow).length === 0) {
    throw new Error('Workflow must be a non-empty ComfyUI API-format object');
  }

  const queued = await queueWorkflow({ baseUrl, workflow, fetchImpl });
  onProgress({ phase: 'queued', promptId: queued.promptId, queueNumber: queued.number });
  const completed = await waitForPrompt({
    baseUrl,
    promptId: queued.promptId,
    timeoutMs,
    pollIntervalMs,
    fetchImpl,
    ...(sleepImpl ? { sleepImpl } : {}),
    onProgress: (progress) => onProgress({ phase: 'generating', ...progress })
  });

  const outputDirectory = path.join(projectRoot, 'assets', 'generated', queued.promptId);
  await mkdir(outputDirectory, { recursive: true });
  const saved = [];
  for (const [nodeId, nodeOutput] of Object.entries(completed.outputs)) {
    for (const outputType of ['videos', 'gifs', 'images']) {
      for (const item of nodeOutput?.[outputType] ?? []) {
        const filePath = await saveComfyOutput({
          baseUrl,
          output: item,
          destinationDirectory: outputDirectory,
          fetchImpl
        });
        saved.push({
          nodeId,
          mediaType: outputType,
          filename: path.basename(filePath),
          source: { filename: item.filename, subfolder: item.subfolder ?? '', type: item.type ?? 'output' }
        });
      }
    }
  }
  if (saved.length === 0) throw new Error('ComfyUI completed without any supported video, GIF or image outputs');

  const record = {
    schemaVersion: '1.0',
    promptId: queued.promptId,
    createdAt: new Date().toISOString(),
    briefFile: project.briefFile,
    workflowFile,
    outputDirectory: path.relative(projectRoot, outputDirectory).split(path.sep).join('/'),
    outputs: saved,
    approval: { generationApproved: true, deliveryApproved: false },
    provenance: {
      model: null,
      checkpoint: null,
      workflowSha256: null,
      prompt: null,
      seed: null,
      licenseReviewed: true,
      humanApproved: false
    }
  };
  const manifestPath = path.join(outputDirectory, 'generation-manifest.json');
  await writeFile(manifestPath, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
  return { promptId: queued.promptId, outputDirectory, manifestPath, outputs: saved };
}

async function main(args) {
  const projectDirectory = flag(args, '--project');
  const workflowPath = flag(args, '--workflow');
  if (!projectDirectory || !workflowPath) {
    throw new Error('Usage: node bin/generate.mjs --project <project-dir> --workflow <api-workflow.json> --approved');
  }
  const result = await runComfyProduction({
    projectDirectory,
    workflowPath,
    approved: args.includes('--approved'),
    baseUrl: flag(args, '--comfy-url', 'http://127.0.0.1:8188')
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
