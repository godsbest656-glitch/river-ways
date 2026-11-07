#!/usr/bin/env node
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(MODULE_DIR, '..');
const MODEL_REGISTRY = path.join(ROOT_DIR, 'config', 'models.json');

export function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function validateBrief(brief, { production = false } = {}) {
  const errors = [];
  const requiredText = [
    ['schemaVersion', brief?.schemaVersion],
    ['client.name', brief?.client?.name],
    ['campaign.name', brief?.campaign?.name],
    ['objective', brief?.objective],
    ['audience', brief?.audience],
    ['primaryMessage', brief?.primaryMessage]
  ];

  for (const [field, value] of requiredText) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push(field + ' must be a non-empty string');
    }
  }

  if (brief?.schemaVersion !== '1.0') {
    errors.push('schemaVersion must equal "1.0"');
  }
  if (!Array.isArray(brief?.platforms) || brief.platforms.length === 0) {
    errors.push('platforms must be a non-empty array');
  }
  if (!Array.isArray(brief?.deliverables) || brief.deliverables.length === 0) {
    errors.push('deliverables must be a non-empty array');
  } else {
    brief.deliverables.forEach((item, index) => {
      if (!item || typeof item.type !== 'string' || !item.type.trim()) {
        errors.push('deliverables[' + index + '].type must be a non-empty string');
      }
      if (item?.quantity !== undefined && (!Number.isInteger(item.quantity) || item.quantity < 1)) {
        errors.push('deliverables[' + index + '].quantity must be a positive integer');
      }
      if (item?.durationSeconds !== undefined && (!Number.isFinite(item.durationSeconds) || item.durationSeconds <= 0)) {
        errors.push('deliverables[' + index + '].durationSeconds must be a positive number');
      }
    });
  }

  const approval = brief?.approval?.status;
  if (!['draft', 'approved', 'rejected'].includes(approval)) {
    errors.push('approval.status must be draft, approved or rejected');
  }
  if (approval === 'approved' && (!brief?.approval?.approvedBy || !brief?.approval?.approvedAt)) {
    errors.push('approved briefs must include approval.approvedBy and approval.approvedAt');
  }
  if (production && approval !== 'approved') {
    errors.push('production validation requires an approved brief');
  }
  if (production && brief?.rights?.clientAssetsApprovedForGeneration !== true) {
    errors.push('production validation requires explicit client asset generation permission');
  }
  if (production && brief?.rights?.modelLicenseReviewed !== true) {
    errors.push('production validation requires model license review');
  }

  return { valid: errors.length === 0, errors };
}

async function readJson(filePath) {
  const raw = await readFile(path.resolve(filePath), 'utf8');
  return JSON.parse(raw);
}

async function validateCommand(args) {
  const production = args.includes('--production');
  const briefPath = args.find((item) => !item.startsWith('--'));
  if (!briefPath) throw new Error('Usage: validate <brief.json> [--production]');
  const brief = await readJson(briefPath);
  const result = validateBrief(brief, { production });
  if (!result.valid) {
    for (const error of result.errors) process.stderr.write('ERROR: ' + error + '\n');
    process.exitCode = 1;
    return;
  }
  process.stdout.write('Brief valid' + (production ? ' for production review' : '') + ': ' + brief.campaign.name + '\n');
}

function parseFlag(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

async function initCommand(args) {
  const briefPath = parseFlag(args, '--brief');
  const outputRoot = parseFlag(args, '--out') ?? './production';
  if (!briefPath) throw new Error('Usage: init --brief <brief.json> [--out <directory>]');

  const brief = await readJson(briefPath);
  const result = validateBrief(brief);
  if (!result.valid) throw new Error('Invalid brief: ' + result.errors.join('; '));

  const projectSlug = slugify(brief.campaign.slug || (brief.client.name + '-' + brief.campaign.name));
  if (!projectSlug) throw new Error('Brief does not produce a safe project slug');

  const target = path.resolve(outputRoot, projectSlug);
  const relative = path.relative(path.resolve(outputRoot), target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Resolved project path escapes output root');
  }
  try {
    await access(target);
    throw new Error('Project already exists; refusing to overwrite: ' + target);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  const directories = [
    'brief',
    'assets/generated',
    'assets/approved',
    'assets/rejected',
    'compositions/hyperframes',
    'compositions/remotion',
    'renders',
    'qa',
    'delivery'
  ];
  await mkdir(target, { recursive: true });
  for (const directory of directories) await mkdir(path.join(target, directory), { recursive: true });
  const starterTemplate = path.join(ROOT_DIR, 'templates', 'hyperframes');
  await copyFile(path.join(starterTemplate, 'index.html'), path.join(target, 'compositions', 'hyperframes', 'index.html'));
  await copyFile(path.join(starterTemplate, 'style.css'), path.join(target, 'compositions', 'hyperframes', 'style.css'));

  const approvalStatus = brief.approval.status;
  const briefFile = approvalStatus === 'approved' ? 'approved-brief.json' : 'draft-brief.json';
  await writeFile(path.join(target, 'brief', briefFile), JSON.stringify(brief, null, 2) + '\n', { flag: 'wx' });

  const project = {
    schemaVersion: '1.0',
    projectId: projectSlug,
    createdAt: new Date().toISOString(),
    status: approvalStatus === 'approved' ? 'brief-approved' : 'brief-draft',
    approvalRequiredBeforeGeneration: approvalStatus !== 'approved',
    approvalRequiredBeforeDelivery: true,
    defaultRenderer: 'hyperframes',
    alternateRenderer: 'remotion',
    enabledModelAdapters: [],
    enabledRendererAdapters: [],
    briefFile: 'brief/' + briefFile,
    deliverables: brief.deliverables.map((item) => ({
      type: item.type,
      aspectRatio: item.aspectRatio ?? null,
      durationSeconds: item.durationSeconds ?? null,
      quantity: item.quantity ?? 1,
      status: 'not-started'
    })),
    provenance: {
      model: null,
      checkpoint: null,
      prompt: null,
      seed: null,
      licenseReviewed: false,
      humanApproved: false
    }
  };
  await writeFile(path.join(target, 'project.json'), JSON.stringify(project, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write('Created local production project: ' + target + '\n');
  process.stdout.write('Status: ' + project.status + '. No media was generated.\n');
}

function commandExists(command, args = ['--version']) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 5000, windowsHide: true });
  return !result.error && result.status === 0;
}

async function doctorCommand() {
  const checks = [
    ['node', process.version],
    ['ffmpeg', commandExists('ffmpeg') ? 'available' : 'missing'],
    ['ffprobe', commandExists('ffprobe') ? 'available' : 'missing'],
    ['python3', commandExists('python3') ? 'available' : 'missing'],
    ['python', commandExists('python') ? 'available' : 'missing'],
    ['nvidia-smi', commandExists('nvidia-smi') ? 'available' : 'missing']
  ];
  for (const [name, status] of checks) process.stdout.write(name.padEnd(12) + status + '\n');
  process.stdout.write('\nThis checks executable presence only; it does not prove model compatibility or usable VRAM.\n');
}

async function modelsCommand() {
  const registry = await readJson(MODEL_REGISTRY);
  for (const model of registry.videoModels) {
    process.stdout.write(model.id.padEnd(24) + model.role + ' | ' + model.licenseGate + '\n');
  }
  process.stdout.write('\nAll model adapters are disabled until license, hardware and inference smoke tests pass.\n');
}

function help() {
  process.stdout.write([
    'River Ways Creative Production CLI',
    '',
    '  doctor',
    '  models',
    '  validate <brief.json> [--production]',
    '  init --brief <brief.json> [--out <directory>]',
    '',
    'This foundation creates project structure and validates briefs; it does not generate or render media.'
  ].join('\n') + '\n');
}

export async function run(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (!command || command === 'help' || command === '--help') return help();
  if (command === 'doctor') return doctorCommand();
  if (command === 'models') return modelsCommand();
  if (command === 'validate') return validateCommand(args);
  if (command === 'init') return initCommand(args);
  throw new Error('Unknown command: ' + command);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  run().catch((error) => {
    process.stderr.write('ERROR: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
