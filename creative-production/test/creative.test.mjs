import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { run, validateBrief, slugify } from '../bin/creative.mjs';
import { assertLocalComfyUrl, queueWorkflow, waitForPrompt, saveComfyOutput } from '../bin/comfyui-adapter.mjs';
import { runHyperframesChecks, renderHyperframes, renderRemotion } from '../bin/render-adapter.mjs';
import { runComfyProduction } from '../bin/generate.mjs';

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
      '1': { class_type: 'SaveVideo', inputs: {} }
    }));
    const result = await runComfyProduction({
      projectDirectory: root,
      workflowPath: 'workflows/api.json',
      approved: true,
      pollIntervalMs: 0,
      sleepImpl: async () => {},
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
    assert.equal(result.outputs.length, 1);
    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8'));
    assert.equal(manifest.approval.deliveryApproved, false);
    assert.match(manifest.provenance.workflowSha256, /^[a-f0-9]{64}$/);
    const saved = path.join(root, 'assets', 'generated', 'test_job_1', 'node-7', 'final.mp4');
    assert.equal((await readFile(saved)).length, 4);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
