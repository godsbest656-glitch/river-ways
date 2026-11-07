import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { run, validateBrief, slugify } from '../bin/creative.mjs';
import { assertLocalComfyUrl, queueWorkflow, waitForPrompt, saveComfyOutput } from '../bin/comfyui-adapter.mjs';

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
