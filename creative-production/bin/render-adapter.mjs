import { access, mkdir, stat } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const MODULE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function safeProjectPath(projectDirectory, requestedPath) {
  if (!requestedPath || typeof requestedPath !== 'string') {
    throw new Error('A project-relative path is required');
  }
  if (path.isAbsolute(requestedPath)) {
    throw new Error('Renderer paths must be relative to the project directory');
  }
  const root = path.resolve(projectDirectory);
  const target = path.resolve(root, requestedPath);
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Renderer path escapes or aliases the project directory');
  }
  return { root, target, relative: relative.split(path.sep).join('/') };
}

async function resolveCli(renderer, rendererRoot) {
  const packagePath = renderer === 'hyperframes'
    ? path.join(rendererRoot, 'node_modules', 'hyperframes', 'package.json')
    : path.join(rendererRoot, 'node_modules', '@remotion', 'cli', 'package.json');
  let packageJson;
  try {
    packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  } catch {
    throw new Error(renderer + ' CLI is not installed in ' + rendererRoot + '; install the local renderer package first');
  }
  const bin = typeof packageJson.bin === 'string'
    ? packageJson.bin
    : packageJson.bin?.[renderer === 'hyperframes' ? 'hyperframes' : 'remotion'];
  if (!bin) throw new Error(renderer + ' package does not expose its expected CLI binary');
  const cliPath = path.resolve(path.dirname(packagePath), bin);
  await access(cliPath);
  return cliPath;
}

function execute(cliPath, args, cwd, spawnImpl, timeoutMs) {
  const result = spawnImpl(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    windowsHide: true,
    maxBuffer: 20 * 1024 * 1024,
    shell: false
  });
  if (result.error) throw new Error('Renderer process failed: ' + result.error.message);
  if (result.status !== 0) {
    throw new Error('Renderer command failed (' + result.status + '): ' + String(result.stderr ?? '').slice(0, 2000));
  }
  return { stdout: result.stdout ?? '', stderr: result.stderr ?? '', status: result.status };
}

export async function runHyperframesChecks({
  projectDirectory,
  rendererRoot = MODULE_ROOT,
  spawnImpl = spawnSync,
  timeoutMs = 10 * 60 * 1000
}) {
  const { root } = safeProjectPath(projectDirectory, 'index.html');
  await access(path.join(root, 'index.html'));
  const cliPath = await resolveCli('hyperframes', rendererRoot);
  const lint = execute(cliPath, ['lint'], root, spawnImpl, timeoutMs);
  const check = execute(cliPath, ['check'], root, spawnImpl, timeoutMs);
  return { lint, check };
}

export async function renderHyperframes({
  projectDirectory,
  outputPath = 'renders/final.mp4',
  approved = false,
  rendererRoot = MODULE_ROOT,
  spawnImpl = spawnSync,
  timeoutMs = 4 * 60 * 60 * 1000
}) {
  if (approved !== true) throw new Error('HyperFrames rendering requires explicit human approval');
  const { root, target, relative } = safeProjectPath(projectDirectory, outputPath);
  await access(path.join(root, 'index.html'));
  try {
    await access(target);
    throw new Error('Refusing to overwrite existing render: ' + target);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  const cliPath = await resolveCli('hyperframes', rendererRoot);
  const checks = await runHyperframesChecks({ projectDirectory: root, rendererRoot, spawnImpl, timeoutMs: Math.min(timeoutMs, 10 * 60 * 1000) });
  await mkdir(path.dirname(target), { recursive: true });
  const render = execute(cliPath, ['render', '--output', relative], root, spawnImpl, timeoutMs);
  const outputStats = await stat(target).catch(() => null);
  if (!outputStats || outputStats.size === 0) {
    throw new Error('HyperFrames exited successfully but did not produce a non-empty output file');
  }
  return { renderer: 'hyperframes', outputPath: target, bytes: outputStats.size, checks, render };
}

export async function renderRemotion({
  projectDirectory,
  entryPoint,
  compositionId,
  outputPath = 'renders/final.mp4',
  propsPath,
  approved = false,
  licenseAcknowledged = false,
  freeLicenseEligible = false,
  rendererRoot = projectDirectory,
  spawnImpl = spawnSync,
  timeoutMs = 4 * 60 * 60 * 1000
}) {
  if (approved !== true) throw new Error('Remotion rendering requires explicit human approval');
  if (licenseAcknowledged !== true || freeLicenseEligible !== true) {
    throw new Error('Remotion requires explicit license acknowledgement and confirmed free-license eligibility');
  }
  if (!compositionId || !/^[a-zA-Z0-9_-]{1,128}$/.test(compositionId)) {
    throw new Error('compositionId contains unsupported characters');
  }
  const project = path.resolve(projectDirectory);
  const entry = safeProjectPath(project, entryPoint);
  await access(entry.target);
  const output = safeProjectPath(project, outputPath);
  try {
    await access(output.target);
    throw new Error('Refusing to overwrite existing render: ' + output.target);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  const args = ['render', entry.relative, compositionId, output.relative, '--overwrite=false'];
  if (propsPath) {
    const props = safeProjectPath(project, propsPath);
    await access(props.target);
    args.push('--props', props.relative);
  }
  const cliPath = await resolveCli('remotion', rendererRoot);
  await mkdir(path.dirname(output.target), { recursive: true });
  const render = execute(cliPath, args, project, spawnImpl, timeoutMs);
  const outputStats = await stat(output.target).catch(() => null);
  if (!outputStats || outputStats.size === 0) {
    throw new Error('Remotion exited successfully but did not produce a non-empty output file');
  }
  return { renderer: 'remotion', outputPath: output.target, bytes: outputStats.size, render };
}
