#!/usr/bin/env node
import { access, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

function resolveMedia(projectDirectory, mediaPath) {
  if (!mediaPath || typeof mediaPath !== 'string' || path.isAbsolute(mediaPath)) {
    throw new Error('Media path must be relative to the production project');
  }
  const root = path.resolve(projectDirectory);
  const target = path.resolve(root, mediaPath);
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Media path escapes or aliases the production project');
  }
  return target;
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest('hex');
}

export async function probeMedia({
  projectDirectory,
  mediaPath,
  spawnImpl = spawnSync,
  timeoutMs = 30000
}) {
  const target = resolveMedia(projectDirectory, mediaPath);
  await access(target);
  const fileStats = await stat(target);
  if (!fileStats.isFile() || fileStats.size === 0) throw new Error('Media output must be a non-empty regular file');
  const args = [
    '-v', 'error',
    '-show_entries', 'format=duration,format_name:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels',
    '-of', 'json',
    target
  ];
  const result = spawnImpl('ffprobe', args, {
    encoding: 'utf8',
    timeout: timeoutMs,
    windowsHide: true,
    shell: false,
    maxBuffer: 10 * 1024 * 1024
  });
  if (result.error) throw new Error('ffprobe failed: ' + result.error.message);
  if (result.status !== 0) throw new Error('ffprobe rejected media: ' + String(result.stderr ?? '').slice(0, 1500));
  let metadata;
  try {
    metadata = JSON.parse(result.stdout);
  } catch {
    throw new Error('ffprobe returned invalid JSON');
  }
  const video = (metadata.streams ?? []).find((stream) => stream.codec_type === 'video');
  const audio = (metadata.streams ?? []).find((stream) => stream.codec_type === 'audio') ?? null;
  if (!video || !Number.isFinite(Number(video.width)) || !Number.isFinite(Number(video.height))) {
    throw new Error('Media must contain a valid video stream');
  }
  const durationSeconds = Number(metadata.format?.duration);
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error('Media duration is missing or invalid');
  }
  return {
    file: mediaPath,
    bytes: fileStats.size,
    sha256: await sha256File(target),
    container: metadata.format?.format_name ?? null,
    durationSeconds,
    video: {
      codec: video.codec_name ?? null,
      width: Number(video.width),
      height: Number(video.height),
      frameRate: video.r_frame_rate ?? null
    },
    audio: audio ? {
      codec: audio.codec_name ?? null,
      sampleRate: audio.sample_rate ?? null,
      channels: audio.channels ?? null
    } : null
  };
}

export function validateMediaSpec(metadata, spec = {}) {
  const errors = [];
  if (spec.expectedWidth && metadata.video.width !== spec.expectedWidth) {
    errors.push('Expected width ' + spec.expectedWidth + ' but received ' + metadata.video.width);
  }
  if (spec.expectedHeight && metadata.video.height !== spec.expectedHeight) {
    errors.push('Expected height ' + spec.expectedHeight + ' but received ' + metadata.video.height);
  }
  if (spec.expectedDurationSeconds) {
    const tolerance = spec.durationToleranceSeconds ?? 0.5;
    if (Math.abs(metadata.durationSeconds - spec.expectedDurationSeconds) > tolerance) {
      errors.push('Duration ' + metadata.durationSeconds + 's is outside expected ' + spec.expectedDurationSeconds + 's ± ' + tolerance + 's');
    }
  }
  if (spec.requireAudio === true && !metadata.audio) errors.push('Expected an audio stream but none was found');
  if (spec.requireAudio === false && metadata.audio) errors.push('Audio stream found but the specification requires silent video');
  return { valid: errors.length === 0, errors };
}

async function main(args) {
  const value = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const projectDirectory = value('--project');
  const mediaPath = value('--media');
  if (!projectDirectory || !mediaPath) {
    throw new Error('Usage: node bin/media-qa.mjs --project <project-dir> --media <relative-video-path> [--width 1920 --height 1080 --duration 8]');
  }
  const metadata = await probeMedia({ projectDirectory, mediaPath });
  const spec = {
    expectedWidth: value('--width') ? Number(value('--width')) : undefined,
    expectedHeight: value('--height') ? Number(value('--height')) : undefined,
    expectedDurationSeconds: value('--duration') ? Number(value('--duration')) : undefined
  };
  const validation = validateMediaSpec(metadata, spec);
  const report = { schemaVersion: '1.0', createdAt: new Date().toISOString(), metadata, validation };
  const outputPath = value('--out');
  if (outputPath) {
    const reportPath = resolveMedia(projectDirectory, outputPath);
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  }
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (!validation.valid) process.exitCode = 1;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
