#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { slugify, validateBrief } from './creative.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const CLI = path.join(DIR, 'creative.mjs');
export function workerConfig(env = process.env) {
  if (!env.CF_ACCESS_CLIENT_ID?.trim() || !env.CF_ACCESS_CLIENT_SECRET?.trim()) {
    throw new Error('CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET are required');
  }
  const apiBase = (env.STUDIO_API_BASE || '').trim();
  if (!apiBase) throw new Error('STUDIO_API_BASE is required; set the intended Preview or approved environment explicitly');
  const parsedApi = new URL(apiBase);
  if (parsedApi.protocol !== 'https:' && !(parsedApi.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsedApi.hostname))) {
    throw new Error('STUDIO_API_BASE must use HTTPS (HTTP is allowed only for localhost)');
  }
  return {
    apiBase: apiBase.replace(/[/]+$/, ''),
    clientId: env.CF_ACCESS_CLIENT_ID.trim(),
    clientSecret: env.CF_ACCESS_CLIENT_SECRET.trim(),
    productionRoot: path.resolve(env.RIVER_WAYS_PRODUCTION_ROOT || path.join(ROOT, 'production')),
    pollMs: Math.max(1000, Math.min(60000, Number(env.STUDIO_WORKER_POLL_MS) || 5000))
  };
}

export async function apiRequest(config, route, { method = 'GET', body } = {}, fetchImpl = fetch) {
  const headers = new Headers({
    'CF-Access-Client-Id': config.clientId,
    'CF-Access-Client-Secret': config.clientSecret,
    accept: 'application/json'
  });
  if (body !== undefined) headers.set('content-type', 'application/json');
  const response = await fetchImpl(config.apiBase + '/' + route.replace(/^\//, ''), {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store', signal: AbortSignal.timeout(30000)
  });
  let result;
  try { result = await response.json(); } catch { result = { error: 'invalid_server_response' }; }
  if (!response.ok) throw new Error('Studio API ' + response.status + ': ' + (result.error || 'request_failed'));
  return result;
}

function runCommand(command, args, { cwd, timeoutMs = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.stdout.on('data', chunk => { stdout = (stdout + chunk).slice(-12000); });
    child.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-12000); });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error('Creative CLI exited ' + code + (signal ? ' (' + signal + ')' : '') + ': ' + (stderr || stdout).slice(-3000)));
      resolve({ stdout, stderr });
    });
  });
}

export async function prepareProject(job, {
  productionRoot, run = runCommand, now = () => new Date().toISOString()
} = {}) {
  if (job?.job_type !== 'project_init') throw new Error('Unsupported worker job type: ' + String(job?.job_type));
  if (!job.project?.brief || !job.project?.slug || !job.client_id || !job.project_id || !job.id) {
    throw new Error('Claimed job is missing its scoped project brief');
  }
  const brief = structuredClone(job.project.brief);
  const validation = validateBrief(brief);
  if (!validation.valid) throw new Error('Project brief is invalid: ' + validation.errors.join('; '));
  if (brief.approval?.status !== 'draft') throw new Error('Project setup accepts draft briefs only');
  const clientSlug = slugify(job.project.client_slug || brief.client.name);
  const projectSlug = slugify(job.project.slug);
  if (!clientSlug || !projectSlug) throw new Error('Client or project slug is invalid');
  const uniqueSlug = slugify((clientSlug + '-' + projectSlug + '-' + job.project_id.slice(0, 8)).slice(0, 64));
  brief.campaign = { ...brief.campaign, slug: uniqueSlug };
  const root = path.resolve(productionRoot);
  const clientRoot = path.join(root, clientSlug);
  const target = path.join(clientRoot, uniqueSlug);
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Project path escapes production root');
  await mkdir(clientRoot, { recursive: true });
  const temp = await mkdtemp(path.join(os.tmpdir(), 'river-ways-studio-'));
  try {
    const briefFile = path.join(temp, 'brief.json');
    await writeFile(briefFile, JSON.stringify(brief, null, 2) + '\n', { flag: 'wx' });
    const executed = await run(process.execPath, [CLI, 'init', '--brief', briefFile, '--out', clientRoot], { cwd: ROOT });
    const metadataPath = path.join(target, 'project.json');
    const project = JSON.parse(await readFile(metadataPath, 'utf8'));
    project.source = {
      studioClientId: job.client_id, studioProjectId: job.project_id,
      studioJobId: job.id, preparedAt: now()
    };
    await writeFile(metadataPath, JSON.stringify(project, null, 2) + '\n');
    return {
      operation: 'project_init', status: 'prepared', localProjectPath: target,
      briefStatus: brief.approval.status, mediaGenerated: false,
      productionGenerationEnabled: false, cliOutput: executed.stdout.trim().slice(-3000)
    };
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

export async function processClaimedJob(job, config, {
  fetchImpl = fetch, prepare = prepareProject, log = () => {}
} = {}) {
  const route = 'worker/jobs/' + encodeURIComponent(job.id);
  let heartbeatError = null;
  const heartbeat = async () => {
    try { await apiRequest(config, route, { method: 'POST', body: { outcome: 'heartbeat' } }, fetchImpl); }
    catch (error) { heartbeatError = error; log('heartbeat failed: ' + error.message); }
  };
  await heartbeat();
  const timer = setInterval(heartbeat, 60000);
  timer.unref?.();
  try {
    if (heartbeatError) throw heartbeatError;
    const result = await prepare(job, { productionRoot: config.productionRoot });
    if (heartbeatError) throw heartbeatError;
    await apiRequest(config, route, { method: 'POST', body: { outcome: 'completed', result } }, fetchImpl);
    return { jobId: job.id, status: 'completed', result };
  } catch (error) {
    try {
      await apiRequest(config, route, {
        method: 'POST',
        body: { outcome: 'failed', error: error.message.slice(0, 1200), result: { operation: job.job_type } }
      }, fetchImpl);
    } catch (reportError) { log('could not report job failure: ' + reportError.message); }
    return { jobId: job.id, status: 'failed', error: error.message };
  } finally { clearInterval(timer); }
}

export async function runWorker({
  config = workerConfig(), fetchImpl = fetch, once = false, signal,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  log = message => process.stdout.write(message + '\n')
} = {}) {
  let processed = 0;
  while (!signal?.aborted) {
    const claim = await apiRequest(config, 'worker/claim', {
      method: 'POST', body: { jobTypes: ['project_init'] }
    }, fetchImpl);
    if (claim.job) {
      log('Claimed project setup job ' + claim.job.id);
      const result = await processClaimedJob(claim.job, config, { fetchImpl, log });
      processed += 1;
      log('Job ' + result.jobId + ': ' + result.status);
    } else if (once) break;
    else await sleep(config.pollMs);
    if (once) break;
  }
  return { processed };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const controller = new AbortController();
  process.on('SIGINT', () => controller.abort());
  process.on('SIGTERM', () => controller.abort());
  try { await runWorker({ config: workerConfig(), once: process.argv.includes('--once'), signal: controller.signal }); }
  catch (error) { process.stderr.write('CREATIVE WORKER ERROR: ' + error.message + '\n'); process.exitCode = 1; }
}
