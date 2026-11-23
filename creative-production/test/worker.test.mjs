import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { workerConfig, prepareProject, prepareDraftJob, processClaimedJob, runWorker, apiRequest } from '../bin/worker.mjs';

const brief = {
  schemaVersion: '1.0',
  client: { name: 'Avenize' },
  campaign: { name: 'Market entry', slug: 'market-entry' },
  objective: 'Prepare a draft project workspace.',
  audience: 'SME owners and directors',
  primaryMessage: 'The state of your business in seconds.',
  platforms: ['LinkedIn'],
  deliverables: [{ type: 'campaign-concept', quantity: 1 }],
  approval: { status: 'draft', approvedBy: null, approvedAt: null },
  rights: { clientAssetsApprovedForGeneration: false, modelLicenseReviewed: false }
};
const job = {
  id: 'job-12345678',
  client_id: 'client-12345678',
  project_id: 'project-12345678',
  job_type: 'project_init',
  project: { slug: 'market-entry', client_slug: 'avenize', brief }
};

test('worker config requires service credentials and keeps production root local', () => {
  assert.throws(() => workerConfig({}), /CF_ACCESS_CLIENT_ID/);
  assert.throws(() => workerConfig({ CF_ACCESS_CLIENT_ID: 'id', CF_ACCESS_CLIENT_SECRET: 'secret' }), /STUDIO_API_BASE is required/);
  assert.throws(() => workerConfig({ CF_ACCESS_CLIENT_ID: 'id', CF_ACCESS_CLIENT_SECRET: 'secret', STUDIO_API_BASE: 'http://example.com' }), /must use HTTPS/);
  const config = workerConfig({
    CF_ACCESS_CLIENT_ID: 'client-id',
    CF_ACCESS_CLIENT_SECRET: 'client-secret',
    STUDIO_API_BASE: 'https://studio.example/api/studio/',
    RIVER_WAYS_PRODUCTION_ROOT: './tmp-production',
    STUDIO_WORKER_POLL_MS: '250'
  });
  assert.equal(config.apiBase, 'https://studio.example/api/studio');
  assert.equal(config.pollMs, 1000);
  assert.equal(path.isAbsolute(config.productionRoot), true);
});

test('worker prepares an isolated draft project without generating media', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-worker-'));
  try {
    const result = await prepareProject(job, { productionRoot: root });
    assert.equal(result.status, 'prepared');
    assert.equal(result.mediaGenerated, false);
    assert.equal(result.productionGenerationEnabled, false);
    const project = JSON.parse(await readFile(path.join(result.localProjectPath, 'project.json'), 'utf8'));
    assert.equal(project.status, 'brief-draft');
    assert.equal(project.approvalRequiredBeforeGeneration, true);
    assert.equal(project.source.studioProjectId, job.project_id);
    assert.equal(project.source.studioJobId, job.id);
    await assert.rejects(prepareProject(job, { productionRoot: root }), /refusing to overwrite/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('worker refuses non-setup jobs and non-draft briefs', async () => {
  await assert.rejects(prepareProject({ ...job, job_type: 'video' }, { productionRoot: '/tmp' }), /Unsupported worker job type/);
  await assert.rejects(prepareProject({
    ...job, project: { ...job.project, brief: { ...brief, approval: { status: 'approved', approvedBy: 'A', approvedAt: 'now' } } }
  }, { productionRoot: '/tmp' }), /draft briefs only/);
});

test('worker heartbeats, executes and reports completion through the API', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), method: options.method, body: options.body && JSON.parse(options.body) });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const config = { apiBase: 'https://studio.example/api/studio', clientId: 'id', clientSecret: 'secret', productionRoot: '/tmp' };
  const result = await processClaimedJob(job, config, {
    fetchImpl,
    prepare: async () => ({ operation: 'project_init', status: 'prepared', mediaGenerated: false })
  });
  assert.equal(result.status, 'completed');
  assert.deepEqual(calls.map(call => call.body?.outcome), ['heartbeat', 'completed']);
  assert.equal(calls[0].method, 'POST');
});

test('worker claims only project setup jobs and exits after one empty poll', async () => {
  let request;
  const config = { apiBase: 'https://studio.example/api/studio', clientId: 'id', clientSecret: 'secret', productionRoot: '/tmp', pollMs: 1000 };
  const result = await runWorker({
    config, once: true,
    fetchImpl: async (url, options) => {
      request = { url: String(url), body: JSON.parse(options.body), headers: options.headers };
      return new Response(JSON.stringify({ ok: true, job: null }), { status: 200 });
    },
    log: () => {}
  });
  assert.equal(result.processed, 0);
  assert.deepEqual(request.body.jobTypes, ['project_init', 'strategy', 'copy', 'concept', 'storyboard']);
  assert.equal(request.headers.get('CF-Access-Client-Id'), 'id');
  assert.equal(request.headers.get('CF-Access-Client-Secret'), 'secret');
});

test('API helper rejects non-success responses without exposing credentials', async () => {
  const config = { apiBase: 'https://studio.example/api/studio', clientId: 'private-id', clientSecret: 'private-secret' };
  await assert.rejects(apiRequest(config, 'worker/claim', { method: 'POST', body: {} }, async () => (
    new Response(JSON.stringify({ error: 'authentication_required' }), { status: 401 })
  )), /Studio API 401: authentication_required/);
});

test('strategy and copy adapters create scoped, traceable draft artifacts only', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-drafts-'));
  try {
    await prepareProject(job, { productionRoot: root });
    for (const jobType of ['strategy', 'copy', 'concept', 'storyboard']) {
      const result = await prepareDraftJob({ ...job, id: 'job-' + jobType + '-1234', job_type: jobType }, { productionRoot: root });
      assert.equal(result.status, 'draft-prepared');
      assert.equal(result.publishable, false);
      const artifact = JSON.parse(await readFile(result.localArtifactPath, 'utf8'));
      assert.equal(artifact.status, 'draft');
      assert.equal(artifact.source.client, 'Avenize');
      assert.ok(artifact.constraints.some(item => item.includes('Do not invent pricing')));
      if (jobType === 'copy') {
        assert.deepEqual(artifact.messageArchitecture.featureClaims, []);
        assert.deepEqual(artifact.messageArchitecture.proofPoints, []);
        assert.equal(artifact.channelInputs.length, brief.platforms.length);
      }
    }
    await assert.rejects(prepareDraftJob({ ...job, id: 'job-strategy-1234', job_type: 'strategy', client_id: 'other-client-123' }, { productionRoot: root }), /scope does not match/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('strategy worker uses the explicit model route and records model provenance', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-model-strategy-'));
  try {
    await prepareProject(job, { productionRoot: root });
    const env = {
      STUDIO_MODEL_ROUTES_JSON: JSON.stringify({
        strategy: {
          provider: 'openai-compatible',
          baseUrl: 'https://api.example.test/v1',
          model: 'strategy-test-v1',
          apiKeyEnv: 'STRATEGY_TEST_KEY'
        }
      }),
      STRATEGY_TEST_KEY: 'test-secret'
    };
    const model = {
      positioning: 'A clear operational visibility proposition.',
      audienceSegments: ['Owners seeking operational clarity'],
      channelStrategy: [{
        channel: 'LinkedIn', role: 'Decision-maker education',
        action: 'Publish evidence-led explainers', metric: 'Qualified demo requests'
      }],
      measurementPlan: ['Track qualified demo requests'],
      risks: ['Audience fit needs validation'],
      assumptions: ['A demo route exists']
    };
    const result = await prepareDraftJob(
      { ...job, id: 'job-model-strategy-1234', job_type: 'strategy' },
      {
        productionRoot: root,
        env,
        fetchImpl: async (url, options) => {
          assert.equal(String(url), 'https://api.example.test/v1/chat/completions');
          assert.equal(options.headers.authorization, 'Bearer test-secret');
          return new Response(JSON.stringify({
            choices: [{ message: { content: JSON.stringify(model) } }]
          }), { status: 200 });
        }
      }
    );
    assert.equal(result.generatedBy, 'configured-model-route');
    const artifact = JSON.parse(await readFile(result.localArtifactPath, 'utf8'));
    assert.equal(artifact.provenance.model, 'strategy-test-v1');
    assert.equal(artifact.status, 'draft');
    assert.equal(result.publishable, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('copy worker uses only its separate explicit model route and writes a review-only artifact', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-model-copy-'));
  try {
    await prepareProject(job, { productionRoot: root });
    const env = {
      STUDIO_MODEL_ROUTES_JSON: JSON.stringify({
        copy: {
          provider: 'openai-compatible',
          baseUrl: 'https://copy.example.test/v1',
          model: 'copy-test-v1',
          apiKeyEnv: 'COPY_TEST_KEY'
        }
      }),
      COPY_TEST_KEY: 'copy-secret'
    };
    const copy = {
      channelCopy: [{
        platform: 'LinkedIn',
        hook: 'Understand your business faster.',
        body: 'The state of your business in seconds.',
        callToAction: null,
        hashtags: [],
        claimReferences: ['The state of your business in seconds.'],
        reviewNotes: ['Confirm the conversion destination.']
      }],
      assumptions: ['The audience understands the need for business visibility.']
    };
    const result = await prepareDraftJob(
      { ...job, id: 'job-model-copy-1234', job_type: 'copy' },
      {
        productionRoot: root,
        env,
        fetchImpl: async (url, options) => {
          assert.equal(String(url), 'https://copy.example.test/v1/chat/completions');
          assert.equal(options.headers.authorization, 'Bearer copy-secret');
          return new Response(JSON.stringify({
            choices: [{ message: { content: JSON.stringify(copy) } }]
          }), { status: 200 });
        }
      }
    );
    assert.equal(result.generatedBy, 'configured-model-route');
    assert.equal(result.publishable, false);
    const artifact = JSON.parse(await readFile(result.localArtifactPath, 'utf8'));
    assert.equal(artifact.artifactType, 'channel-copy-draft');
    assert.equal(artifact.provenance.model, 'copy-test-v1');
    assert.equal(artifact.status, 'draft');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('concept and storyboard jobs produce structured draft-only creative plans', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'river-ways-creative-plans-'));
  try {
    await prepareProject(job, { productionRoot: root });
    for (const jobType of ['concept', 'storyboard']) {
      const result = await prepareDraftJob(
        { ...job, id: 'job-' + jobType + '-5678', job_type: jobType },
        { productionRoot: root, env: {} }
      );
      assert.equal(result.status, 'draft-prepared');
      assert.equal(result.publishable, false);
      const artifact = JSON.parse(await readFile(result.localArtifactPath, 'utf8'));
      assert.equal(artifact.status, 'draft');
      if (jobType === 'concept') {
        assert.equal(artifact.concepts.length, 3);
        assert.equal(artifact.selectionRequired, true);
      } else {
        assert.equal(artifact.scenes.length, 6);
        assert.ok(artifact.scenes.every(scene => scene.generationStatus === 'blocked-pending-approval'));
        assert.equal(artifact.audio.rightsStatus, 'not-reviewed');
      }
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
