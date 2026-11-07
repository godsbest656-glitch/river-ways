import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

export function assertLocalComfyUrl(baseUrl) {
  const url = new URL(baseUrl);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('ComfyUI URL must use HTTP or HTTPS');
  }
  if (!LOCAL_HOSTS.has(url.hostname)) {
    throw new Error('ComfyUI adapter only permits loopback hosts; remote inference is disabled');
  }
  return url.origin;
}

async function parseJsonResponse(response, operation) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(operation + ' failed (' + response.status + '): ' + body.slice(0, 500));
  }
  return response.json();
}

export async function queueWorkflow({ baseUrl = 'http://127.0.0.1:8188', workflow, clientId, fetchImpl = fetch }) {
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)) {
    throw new Error('workflow must be a ComfyUI API-format object');
  }
  const origin = assertLocalComfyUrl(baseUrl);
  const response = await fetchImpl(origin + '/prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, ...(clientId ? { client_id: clientId } : {}) })
  });
  const result = await parseJsonResponse(response, 'ComfyUI queue');
  if (!result.prompt_id || typeof result.prompt_id !== 'string') {
    throw new Error('ComfyUI queue response did not include prompt_id');
  }
  return { promptId: result.prompt_id, number: result.number ?? null };
}

export async function getPromptHistory({ baseUrl = 'http://127.0.0.1:8188', promptId, fetchImpl = fetch }) {
  if (!promptId || !/^[a-zA-Z0-9_-]{1,128}$/.test(promptId)) {
    throw new Error('promptId contains unsupported characters');
  }
  const origin = assertLocalComfyUrl(baseUrl);
  const response = await fetchImpl(origin + '/history/' + encodeURIComponent(promptId));
  return parseJsonResponse(response, 'ComfyUI history');
}

export async function waitForPrompt({
  baseUrl = 'http://127.0.0.1:8188',
  promptId,
  timeoutMs = 30 * 60 * 1000,
  pollIntervalMs = 2000,
  fetchImpl = fetch,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  onProgress = () => {}
}) {
  const startedAt = Date.now();
  while (Date.now() - startedAt <= timeoutMs) {
    const history = await getPromptHistory({ baseUrl, promptId, fetchImpl });
    const result = history[promptId];
    if (result?.outputs && Object.keys(result.outputs).length > 0) {
      return { promptId, status: 'completed', outputs: result.outputs, meta: result };
    }
    const status = result?.status?.status_str;
    if (status === 'error' || status === 'failed') {
      throw new Error('ComfyUI prompt failed: ' + JSON.stringify(result.status).slice(0, 1000));
    }
    onProgress({ promptId, status: status ?? 'queued' });
    await sleepImpl(pollIntervalMs);
  }
  throw new Error('Timed out waiting for ComfyUI prompt ' + promptId);
}

export async function saveComfyOutput({
  baseUrl = 'http://127.0.0.1:8188',
  output,
  destinationDirectory,
  fetchImpl = fetch
}) {
  if (!output || typeof output.filename !== 'string' || !output.filename) {
    throw new Error('ComfyUI output must include a filename');
  }
  const safeName = path.basename(output.filename);
  if (safeName !== output.filename || /[\\/]/.test(output.filename) || safeName === '.' || safeName === '..') {
    throw new Error('ComfyUI output filename is not a safe basename');
  }
  const subfolder = output.subfolder ?? '';
  if (path.isAbsolute(subfolder) || /^[\\/]|^[A-Za-z]:/.test(subfolder) || subfolder.split(/[\\/]+/).some((part) => part === '..')) {
    throw new Error('ComfyUI output subfolder is not a safe relative path');
  }
  const outputType = output.type ?? 'output';
  if (!['output', 'temp', 'input'].includes(outputType)) {
    throw new Error('ComfyUI output type is not supported');
  }
  const origin = assertLocalComfyUrl(baseUrl);
  const url = new URL(origin + '/view');
  url.searchParams.set('filename', safeName);
  url.searchParams.set('subfolder', subfolder);
  url.searchParams.set('type', outputType);
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error('ComfyUI output download failed (' + response.status + ')');
  await mkdir(destinationDirectory, { recursive: true });
  const destination = path.join(destinationDirectory, safeName);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()), { flag: 'wx' });
  return destination;
}
