import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { run, validateBrief, slugify, collectEnvironment } from '../bin/creative.mjs';
import { assertLocalComfyUrl, queueWorkflow, waitForPrompt, saveComfyOutput } from '../bin/comfyui-adapter.mjs';
import { runHyperframesChecks, renderHyperframes, renderRemotion } from '../bin/render-adapter.mjs';
import { probeMedia, validateMediaSpec } from '../bin/media-qa.mjs';
import { validateBenchmark, scoreRun, summarizeBenchmarks } from '../bin/benchmark.mjs';
import { runComfyProduction, readGpuTelemetry } from '../bin/generate.mjs';

const validBrief = {
  schemaVersion: '1.0',
  client: { name: 'Example Client' },
  campaign: { name: 'Spring Campaign', slug: 'spring-campaign' },
  objective: 'Test project creation.',
  audience: 'Internal reviewers',
  primaryMessage: 'A useful message',
  platforms: ['website'],
  deliverables: [{ type: 'hero-video', aspectRatio: '16:9', durationSeconds: 8, quantity: 1 }],
  approval: { status: 'draft', approvedBy: null, approvedAt: null },
  rights: { clientAssetsApprovedForGeneration: false, modelLicenseReviewed: false }
};

test('validates a well-formed draft brief without treating it as approved', () => {
  const result = validateBrief(validBrief);
  assert.equal(result.valid, true);
  assert.equal(validateBrief(validBrief, { production: true }).valid, false);
});

test('requires explicit approval and rights before production validation', () => {
  const approved = {
    ...validBrief,
    approval: { status: 'approved', approvedBy: 'Creative Director', approvedAt: '2026-11-07T10:00:00Z' },
    rights: { clientAssetsApprovedForGeneration: true, modelLicenseReviewed: true }
  };
  assert.equal(validateBrief(approved, { production: true }).valid, true);
});

test('rejects missing objective and empty deliverables', () => {
  const invalid = { ...validBrief, objective: '', deliverables: [] };
  const result = validateBrief(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.includes('objective')));
  assert.ok(result.errors.some((item) => item.includes('deliverables')));
});

test('slugifies unsafe names into a bounded filesystem-safe identifier', () => {
  assert.equal(slugify('../../Client Name — Campaign!'), 'client-name-campaign');
  assert.equal(slugify('***'), '');
});

test('initialises a draft project without generating media and refuses overwrite', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-creative-'));
  try {
    const briefPath = path.join(root, 'brief.json');
    const outputRoot = path.join(root, 'production');
    await writeFile(briefPath, JSON.stringify(validBrief));
    await run(['init', '--brief', briefPath, '--out', outputRoot]);

    const projectPath = path.join(outputRoot, 'spring-campaign', 'project.json');
    const project = JSON.parse(await readFile(projectPath, 'utf8'));
    assert.equal(project.status, 'brief-draft');
    assert.equal(project.approvalRequiredBeforeGeneration, true);
    assert.equal(project.approvalRequiredBeforeDelivery, true);
    const starter = await readFile(path.join(outputRoot, 'spring-campaign', 'compositions', 'hyperframes', 'index.html'), 'utf8');
    assert.match(starter, /We engineer/);
    assert.match(starter, /data-duration/);
    await assert.rejects(
      run(['init', '--brief', briefPath, '--out', outputRoot]),
      /refusing to overwrite/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('ComfyUI adapter refuses non-loopback inference endpoints', () => {
  assert.equal(assertLocalComfyUrl('http://127.0.0.1:8188'), 'http://127.0.0.1:8188');
  assert.throws(() => assertLocalComfyUrl('https://example.com'), /loopback hosts/);
});

test('queues an API-format workflow and returns its prompt identifier', async () => {
  const result = await queueWorkflow({
    workflow: { '1': { class_type: 'CheckpointLoaderSimple', inputs: {} } },
    fetchImpl: async (url, options) => {
      assert.match(String(url), /\/prompt$/);
      assert.equal(options.method, 'POST');
      return new Response(JSON.stringify({ prompt_id: 'job_123', number: 7 }), { status: 200 });
    }
  });
  assert.deepEqual(result, { promptId: 'job_123', number: 7 });
});

test('waits for a completed ComfyUI job and returns outputs', async () => {
  const result = await waitForPrompt({
    promptId: 'job_123',
    pollIntervalMs: 0,
    sleepImpl: async () => {},
    fetchImpl: async () => new Response(JSON.stringify({
      job_123: { outputs: { '7': { videos: [{ filename: 'clip.mp4', subfolder: '', type: 'output' }] } } }
    }), { status: 200 })
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs['7'].videos[0].filename, 'clip.mp4');
});

test('saves ComfyUI output using a safe filename and refuses path traversal', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-comfy-'));
  try {
    const saved = await saveComfyOutput({
      output: { filename: 'clip.mp4', type: 'output' },
      destinationDirectory: root,
      fetchImpl: async () => new Response(new Uint8Array([1, 2, 3]), { status: 200 })
    });
    assert.equal(path.basename(saved), 'clip.mp4');
    await assert.rejects(
      saveComfyOutput({
        output: { filename: '../escape.mp4' },
        destinationDirectory: root,
        fetchImpl: async () => { throw new Error('must not fetch an unsafe filename'); }
      }),
      /safe basename/
    );
    await assert.rejects(
      saveComfyOutput({
        output: { filename: 'clip.mp4', subfolder: '../escape' },
        destinationDirectory: root,
        fetchImpl: async () => { throw new Error('must not fetch an unsafe subfolder'); }
      }),
      /safe relative path/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


async function prepareHyperFramesFixture(root) {
  const project = path.join(root, 'video-project');
  const rendererRoot = path.join(root, 'renderer');
  await mkdir(project, { recursive: true });
  await mkdir(path.join(rendererRoot, 'node_modules', 'hyperframes'), { recursive: true });
  await writeFile(path.join(project, 'index.html'), '<html><body>Test composition</body></html>');
  const packagePath = path.join(rendererRoot, 'node_modules', 'hyperframes', 'package.json');
  const cliPath = path.join(rendererRoot, 'node_modules', 'hyperframes', 'cli.mjs');
  await writeFile(packagePath, JSON.stringify({ bin: { hyperframes: 'cli.mjs' } }));
  await writeFile(cliPath, '');
  return { project, rendererRoot };
}

test('runs HyperFrames lint and browser checks without rendering', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-render-check-'));
  try {
    const { project, rendererRoot } = await prepareHyperFramesFixture(root);
    const commands = [];
    const result = await runHyperframesChecks({
      projectDirectory: project,
      rendererRoot,
      spawnImpl: (_command, args) => {
        commands.push(args[1]);
        return { status: 0, stdout: 'ok', stderr: '' };
      }
    });
    assert.deepEqual(commands, ['lint', 'check']);
    assert.equal(result.check.status, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('requires explicit approval before HyperFrames render and verifies output', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-render-'));
  try {
    const { project, rendererRoot } = await prepareHyperFramesFixture(root);
    await assert.rejects(renderHyperframes({ projectDirectory: project, rendererRoot }), /explicit human approval/);
    const commands = [];
    const result = await renderHyperframes({
      projectDirectory: project,
      rendererRoot,
      approved: true,
      spawnImpl: (_command, args, options) => {
        const command = args[1];
        commands.push(command);
        if (command === 'render') {
          const outputIndex = args.indexOf('--output');
          const destination = path.join(options.cwd, args[outputIndex + 1]);
          const directory = path.dirname(destination);
          mkdirSync(directory, { recursive: true });
          writeFileSync(destination, Buffer.from('mock-render'));
        }
        return { status: 0, stdout: 'ok', stderr: '' };
      }
    });
    assert.deepEqual(commands, ['lint', 'check', 'render']);
    assert.equal(result.bytes, 11);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('keeps Remotion disabled until license acknowledgement and eligibility are explicit', async () => {
  await assert.rejects(
    renderRemotion({
      projectDirectory: process.cwd(),
      entryPoint: 'src/index.ts',
      compositionId: 'Main',
      approved: true
    }),
    /license acknowledgement/
  );
});


test('rejects renderer output paths that escape the project', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-render-path-'));
  try {
    const { project, rendererRoot } = await prepareHyperFramesFixture(root);
    await assert.rejects(
      renderHyperframes({
        projectDirectory: project,
        rendererRoot,
        outputPath: '../../outside.mp4',
        approved: true,
        spawnImpl: () => { throw new Error('must not start renderer'); }
      }),
      /escapes or aliases/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('ComfyUI production runner requires approved brief and rights before contacting the backend', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-generation-gate-'));
  try {
    await mkdir(path.join(root, 'brief'), { recursive: true });
    await writeFile(path.join(root, 'project.json'), JSON.stringify({
      status: 'brief-draft',
      approvalRequiredBeforeGeneration: true,
      briefFile: 'brief/draft-brief.json'
    }));
    await writeFile(path.join(root, 'brief', 'draft-brief.json'), JSON.stringify(validBrief));
    let called = false;
    await assert.rejects(
      runComfyProduction({
        projectDirectory: root,
        workflowPath: 'workflow.json',
        approved: true,
        fetchImpl: async () => { called = true; throw new Error('backend must not be called'); }
      }),
      /approved brief/
    );
    assert.equal(called, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ComfyUI production runner saves generated assets and a provenance manifest', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-generation-'));
  try {
    await mkdir(path.join(root, 'brief'), { recursive: true });
    await mkdir(path.join(root, 'workflows'), { recursive: true });
    const modelRegistryPath = path.join(root, 'models.json');
    await writeFile(modelRegistryPath, JSON.stringify({ videoModels: [{ id: 'wan-2.2-ti2v-5b', name: 'Wan 2.2 TI2V-5B', license: 'Apache-2.0', upstream: 'https://github.com/Wan-Video/Wan2.2', enabled: true }] }));
    const approvedBrief = {
      ...validBrief,
      approval: { status: 'approved', approvedBy: 'Creative Director', approvedAt: '2026-11-07T10:00:00Z' },
      rights: { clientAssetsApprovedForGeneration: true, modelLicenseReviewed: true }
    };
    await writeFile(path.join(root, 'brief', 'approved-brief.json'), JSON.stringify(approvedBrief));
    await writeFile(path.join(root, 'project.json'), JSON.stringify({
      status: 'brief-approved',
      approvalRequiredBeforeGeneration: false,
      briefFile: 'brief/approved-brief.json'
    }));
    await writeFile(path.join(root, 'workflows', 'api.json'), JSON.stringify({
      '1': { class_type: 'UNETLoader', inputs: { unet_name: 'wan2.2_ti2v_5B_fp16.safetensors' } },
      '2': { class_type: 'CLIPTextEncode', inputs: { text: 'A cinematic blue river current', seed: 42 } },
      '3': { class_type: 'SaveVideo', inputs: {} }
    }));
    const result = await runComfyProduction({
      projectDirectory: root,
      workflowPath: 'workflows/api.json',
      modelId: 'wan-2.2-ti2v-5b',
      checkpointFile: 'wan2.2_ti2v_5B_fp16.safetensors',
      modelRegistryPath,
      approved: true,
      pollIntervalMs: 0,
      sleepImpl: async () => {},
      gpuQueryImpl: () => [{ name: 'RTX 4090', memoryTotalMiB: 24564, memoryUsedMiB: 18000, utilizationPercent: 92, temperatureC: 71 }],
      fetchImpl: async (url, options = {}) => {
        const parsed = new URL(String(url));
        if (parsed.pathname === '/prompt') {
          assert.equal(options.method, 'POST');
          return new Response(JSON.stringify({ prompt_id: 'test_job_1', number: 1 }), { status: 200 });
        }
        if (parsed.pathname === '/history/test_job_1') {
          return new Response(JSON.stringify({
            test_job_1: { outputs: { '7': { videos: [{ filename: 'final.mp4', subfolder: '', type: 'output' }] } } }
          }), { status: 200 });
        }
        if (parsed.pathname === '/view') {
          return new Response(new Uint8Array([1, 2, 3, 4]), { status: 200 });
        }
        throw new Error('Unexpected ComfyUI request: ' + parsed.pathname);
      }
    });
    assert.equal(result.promptId, 'test_job_1');
    const jobState = JSON.parse(await readFile(result.jobStatePath, 'utf8'));
    assert.equal(jobState.status, 'completed');
    assert.equal(jobState.outputs.length, 1);
    assert.equal(result.outputs.length, 1);
    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8'));
    assert.equal(manifest.approval.deliveryApproved, false);
    assert.match(manifest.provenance.workflowSha256, /^[a-f0-9]{64}$/);
    assert.equal(manifest.provenance.model.id, 'wan-2.2-ti2v-5b');
    assert.equal(manifest.provenance.checkpoint, 'wan2.2_ti2v_5B_fp16.safetensors');
    assert.deepEqual(manifest.provenance.prompt, ['A cinematic blue river current']);
    assert.deepEqual(manifest.provenance.seed, [42]);
    assert.equal(manifest.metrics.totalOutputBytes, 4);
    assert.equal(manifest.metrics.outputCount, 1);
    assert.equal(manifest.metrics.gpu.peakMemoryUsedMiB, 18000);
    assert.equal(manifest.metrics.gpu.peakUtilizationPercent, 92);
    const saved = path.join(root, 'assets', 'generated', 'test_job_1', 'node-7', 'final.mp4');
    assert.equal((await readFile(saved)).length, 4);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('refuses ComfyUI generation for models disabled in the model registry', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-disabled-model-'));
  try {
    await mkdir(path.join(root, 'brief'), { recursive: true });
    await mkdir(path.join(root, 'workflows'), { recursive: true });
    const approvedBrief = {
      ...validBrief,
      approval: { status: 'approved', approvedBy: 'Creative Director', approvedAt: '2026-11-07T10:00:00Z' },
      rights: { clientAssetsApprovedForGeneration: true, modelLicenseReviewed: true }
    };
    await writeFile(path.join(root, 'brief', 'approved-brief.json'), JSON.stringify(approvedBrief));
    await writeFile(path.join(root, 'project.json'), JSON.stringify({
      status: 'brief-approved', approvalRequiredBeforeGeneration: false, briefFile: 'brief/approved-brief.json'
    }));
    await writeFile(path.join(root, 'workflows', 'api.json'), JSON.stringify({
      '1': { class_type: 'UNETLoader', inputs: { unet_name: 'wan2.2_ti2v_5B_fp16.safetensors' } }
    }));
    await assert.rejects(
      runComfyProduction({
        projectDirectory: root,
        workflowPath: 'workflows/api.json',
        modelId: 'wan-2.2-ti2v-5b',
        checkpointFile: 'wan2.2_ti2v_5B_fp16.safetensors',
        approved: true,
        fetchImpl: async () => { throw new Error('backend must not be called'); }
      }),
      /Model is disabled/
    );
    approvedBrief.rights.hardwareCompatibilityReviewed = true;
    await writeFile(path.join(root, 'brief', 'approved-brief.json'), JSON.stringify(approvedBrief));
    await assert.rejects(
      runComfyProduction({
        projectDirectory: root,
        workflowPath: 'workflows/api.json',
        modelId: 'wan-2.2-ti2v-5b',
        checkpointFile: 'wan2.2_ti2v_5B_fp16.safetensors',
        approved: true,
        benchmarkOnly: true,
        fetchImpl: async () => { throw new Error('mock ComfyUI connection failure'); }
      }),
      /mock ComfyUI connection failure/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('doctor captures GPU model, VRAM, driver, system RAM and disk without enabling models', async () => {
  const report = await collectEnvironment({
    spawnImpl: (command) => {
      const output = command === 'nvidia-smi'
        ? 'NVIDIA GeForce RTX 4090, 24564 MiB, 555.42'
        : command === 'python3' ? 'Python 3.12.4'
        : command === 'nvcc' ? 'Cuda compilation tools, release 12.8'
        : command === 'ffmpeg' ? 'ffmpeg version 7.0'
        : command === 'ffprobe' ? 'ffprobe version 7.0'
        : '';
      return { status: output ? 0 : 1, stdout: output, stderr: '', error: null };
    },
    statfsImpl: async () => ({ bavail: 100, bsize: 1024 })
  });
  assert.equal(report.gpu.detected, true);
  assert.equal(report.gpu.devices[0].name, 'NVIDIA GeForce RTX 4090');
  assert.equal(report.gpu.devices[0].memory, '24564 MiB');
  assert.equal(report.gpu.devices[0].driver, '555.42');
  assert.equal(report.disk.freeBytes, 102400);
  assert.equal(report.python.available, true);
});


test('ffprobe media QA captures stream metadata and validates campaign specs', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-media-qa-'));
  try {
    await mkdir(path.join(root, 'renders'), { recursive: true });
    await writeFile(path.join(root, 'renders', 'hero.mp4'), Buffer.from('mock-video'));
    const metadata = await probeMedia({
      projectDirectory: root,
      mediaPath: 'renders/hero.mp4',
      spawnImpl: (_command, args) => {
        assert.ok(args.includes('renders/hero.mp4') || args.some((item) => item.endsWith('hero.mp4')));
        return {
          status: 0,
          stdout: JSON.stringify({
            format: { duration: '8.000', format_name: 'mov,mp4,m4a,3gp,3g2,mj2' },
            streams: [
              { codec_type: 'video', codec_name: 'h264', width: 1920, height: 1080, r_frame_rate: '30/1' },
              { codec_type: 'audio', codec_name: 'aac', sample_rate: '48000', channels: 2 }
            ]
          }),
          stderr: ''
        };
      }
    });
    assert.equal(metadata.video.codec, 'h264');
    assert.equal(metadata.audio.codec, 'aac');
    assert.equal(validateMediaSpec(metadata, {
      expectedWidth: 1920,
      expectedHeight: 1080,
      expectedDurationSeconds: 8,
      requireAudio: true
    }).valid, true);
    assert.equal(validateMediaSpec(metadata, { expectedWidth: 1080 }).valid, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('media QA rejects project path traversal and missing video streams', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-media-qa-safe-'));
  try {
    await assert.rejects(probeMedia({ projectDirectory: root, mediaPath: '../outside.mp4' }), /escapes/);
    await writeFile(path.join(root, 'audio-only.mp4'), Buffer.from('mock'));
    await assert.rejects(
      probeMedia({
        projectDirectory: root,
        mediaPath: 'audio-only.mp4',
        spawnImpl: () => ({
          status: 0,
          stdout: JSON.stringify({ format: { duration: '3' }, streams: [{ codec_type: 'audio' }] }),
          stderr: ''
        })
      }),
      /valid video stream/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('persists failed ComfyUI generation jobs for diagnosis', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-generation-failed-'));
  try {
    await mkdir(path.join(root, 'brief'), { recursive: true });
    await mkdir(path.join(root, 'workflows'), { recursive: true });
    const modelRegistryPath = path.join(root, 'models.json');
    await writeFile(modelRegistryPath, JSON.stringify({
      videoModels: [{ id: 'wan-2.2-ti2v-5b', name: 'Wan 2.2 TI2V-5B', license: 'Apache-2.0', upstream: 'https://github.com/Wan-Video/Wan2.2', enabled: true }]
    }));
    const approvedBrief = {
      ...validBrief,
      approval: { status: 'approved', approvedBy: 'Creative Director', approvedAt: '2026-11-07T10:00:00Z' },
      rights: { clientAssetsApprovedForGeneration: true, modelLicenseReviewed: true }
    };
    await writeFile(path.join(root, 'brief', 'approved-brief.json'), JSON.stringify(approvedBrief));
    await writeFile(path.join(root, 'project.json'), JSON.stringify({
      status: 'brief-approved', approvalRequiredBeforeGeneration: false, briefFile: 'brief/approved-brief.json'
    }));
    await writeFile(path.join(root, 'workflows', 'api.json'), JSON.stringify({
      '1': { class_type: 'UNETLoader', inputs: { unet_name: 'wan2.2_ti2v_5B_fp16.safetensors' } }
    }));
    await assert.rejects(runComfyProduction({
      projectDirectory: root,
      workflowPath: 'workflows/api.json',
      modelId: 'wan-2.2-ti2v-5b',
      checkpointFile: 'wan2.2_ti2v_5B_fp16.safetensors',
      modelRegistryPath,
      approved: true,
      fetchImpl: async (url, options = {}) => {
        const parsed = new URL(String(url));
        if (parsed.pathname === '/prompt') {
          assert.equal(options.method, 'POST');
          return new Response(JSON.stringify({ prompt_id: 'failed_job_1' }), { status: 200 });
        }
        if (parsed.pathname === '/history/failed_job_1') {
          return new Response(JSON.stringify({
            failed_job_1: { status: { status_str: 'error', messages: ['mock failure'] } }
          }), { status: 200 });
        }
        throw new Error('Unexpected request');
      }
    }), /ComfyUI prompt failed/);
    const state = JSON.parse(await readFile(path.join(root, 'jobs', 'failed_job_1.json'), 'utf8'));
    assert.equal(state.status, 'failed');
    assert.match(state.error, /mock failure/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('benchmark scoring compares repeatable model runs and requires three runs to rank', () => {
  const makeRun = (modelId, seconds, passed = true) => ({
    modelId,
    checkpoint: 'model.safetensors',
    workflowSha256: 'a'.repeat(64),
    hardware: { gpuName: 'RTX 4090', vramGb: 24, ramGb: 64 },
    metrics: { generationSeconds: seconds, peakVramGb: 22, peakRamGb: 40, outputBytes: 1000000 },
    scores: {
      visualQuality: 5,
      motionCoherence: 5,
      promptFidelity: 4,
      temporalStability: 5,
      artifactCleanliness: 5
    },
    passed,
    ...(passed ? {} : { failureReason: 'OOM during final decode' })
  });
  const dataset = {
    schemaVersion: '1.0',
    benchmarkId: 'river-ways-internal-video-benchmark-001',
    testProfile: { prompt: 'A blue current flows through a sculptural glass landscape', seed: 42 },
    runs: [
      makeRun('wan-2.2-ti2v-5b', 120),
      makeRun('wan-2.2-ti2v-5b', 125),
      makeRun('wan-2.2-ti2v-5b', 118),
      makeRun('ltx-2.5', 90)
    ]
  };
  assert.equal(validateBenchmark(dataset).valid, true);
  const comparisons = summarizeBenchmarks(dataset);
  assert.equal(comparisons[0].modelId, 'wan-2.2-ti2v-5b');
  assert.equal(comparisons[0].eligibleForRanking, true);
  assert.equal(comparisons[0].medianGenerationSeconds, 120);
  assert.equal(comparisons[1].eligibleForRanking, false);
  assert.equal(scoreRun(dataset.runs[0]) > 0, true);
});

test('benchmark validation rejects fabricated or incomplete evidence fields', () => {
  const result = validateBenchmark({
    schemaVersion: '1.0',
    benchmarkId: 'bad',
    testProfile: { prompt: 'test' },
    runs: [{
      modelId: 'wan-2.2-ti2v-5b',
      checkpoint: 'model.safetensors',
      workflowSha256: 'not-a-hash',
      hardware: { gpuName: 'GPU' },
      metrics: {},
      scores: {},
      passed: false
    }]
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.includes('workflowSha256')));
  assert.ok(result.errors.some((item) => item.includes('failureReason')));
});


test('GPU telemetry parser captures per-device memory and utilisation samples', () => {
  const samples = readGpuTelemetry(() => ({
    status: 0,
    stdout: 'NVIDIA GeForce RTX 4090, 24564, 18240, 96, 73\\nNVIDIA RTX A4000, 16376, 10240, 65, 68',
    stderr: ''
  }));
  assert.equal(samples.length, 2);
  assert.equal(samples[0].memoryUsedMiB, 18240);
  assert.equal(samples[1].utilizationPercent, 65);
});
