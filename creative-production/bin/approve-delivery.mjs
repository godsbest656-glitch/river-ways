#!/usr/bin/env node
import { access, copyFile, mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { constants as fsConstants, createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function safeChild(root, requested) {
  if (!requested || typeof requested !== 'string' || path.isAbsolute(requested)) {
    throw new Error('Project-relative paths are required');
  }
  const base = path.resolve(root);
  const target = path.resolve(base, requested);
  const relative = path.relative(base, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Path escapes the production project');
  }
  return target;
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest('hex');
}

async function exists(filePath) {
  try { await access(filePath); return true; } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

export async function approveDelivery({
  projectDirectory,
  generationManifestPath,
  mediaPath,
  qaReportPath,
  approved = false,
  approvedBy,
  approvalReference,
  rightsApproved = false,
  brandApproved = false,
  deliveryName
}) {
  if (approved !== true) throw new Error('Delivery requires explicit human approval');
  if (!approvedBy?.trim() || !approvalReference?.trim()) {
    throw new Error('Approver identity and an approval reference are required');
  }
  if (rightsApproved !== true || brandApproved !== true) {
    throw new Error('Rights clearance and brand review must both be explicitly approved');
  }

  const root = path.resolve(projectDirectory);
  const manifestPath = safeChild(root, generationManifestPath);
  const sourcePath = safeChild(root, mediaPath);
  const qaPath = safeChild(root, qaReportPath);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const qaReport = JSON.parse(await readFile(qaPath, 'utf8'));
  if (manifest.approval?.generationApproved !== true) throw new Error('Generation manifest is not approved for generation');
  if (manifest.approval?.benchmarkOnly === true) throw new Error('Benchmark-only output cannot be approved for client delivery');
  if (manifest.approval?.deliveryApproved === true) throw new Error('This generation manifest already has delivery approval');
  if (manifest.provenance?.licenseReviewed !== true || !manifest.provenance?.model?.id) {
    throw new Error('Model provenance and licence review are required before delivery');
  }

  const matchingOutput = (manifest.outputs ?? []).find((output) => {
    const expectedPath = [
      manifest.outputDirectory,
      'node-' + output.nodeId,
      output.filename
    ].join('/');
    return expectedPath === mediaPath && ['videos', 'gifs'].includes(output.mediaType);
  });
  if (!matchingOutput) throw new Error('Selected media is not a video/GIF output recorded in this generation manifest');

  const sourceStats = await stat(sourcePath);
  if (!sourceStats.isFile() || sourceStats.size === 0) throw new Error('Delivery source must be a non-empty regular file');
  const sourceSha256 = await sha256File(sourcePath);
  if (qaReport.validation?.valid !== true || qaReport.metadata?.file !== mediaPath) {
    throw new Error('A passing media QA report for this exact asset is required');
  }
  if (qaReport.metadata?.sha256 !== sourceSha256 || qaReport.metadata?.bytes !== sourceStats.size) {
    throw new Error('Media QA report is stale or does not match the exact source file');
  }

  const filename = deliveryName ?? path.basename(mediaPath);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(filename)) {
    throw new Error('Delivery filename must be a safe basename');
  }
  const approvedDirectory = path.join(root, 'assets', 'approved');
  const deliveryDirectory = path.join(root, 'delivery');
  await mkdir(approvedDirectory, { recursive: true });
  await mkdir(deliveryDirectory, { recursive: true });
  const approvedPath = path.join(approvedDirectory, filename);
  const deliveryPath = path.join(deliveryDirectory, filename);
  const approvalRecordPath = path.join(deliveryDirectory, filename + '.approval.json');
  for (const target of [approvedPath, deliveryPath, approvalRecordPath]) {
    if (await exists(target)) throw new Error('Refusing to overwrite existing approved/delivery artifact: ' + target);
  }

  const approvedAt = new Date().toISOString();
  const approvalRecord = {
    schemaVersion: '1.0',
    approved: true,
    approvedAt,
    approvedBy: approvedBy.trim(),
    approvalReference: approvalReference.trim(),
    rightsApproved: true,
    brandApproved: true,
    generationManifest: path.relative(root, manifestPath).split(path.sep).join('/'),
    source: mediaPath,
    sourceSha256,
    qaReport: qaReportPath,
    delivery: path.relative(root, deliveryPath).split(path.sep).join('/'),
    model: manifest.provenance.model,
    checkpoint: manifest.provenance.checkpoint,
    workflowSha256: manifest.provenance.workflowSha256
  };

  let copiedApproved = false;
  let copiedDelivery = false;
  let wroteRecord = false;
  try {
    await copyFile(sourcePath, approvedPath, fsConstants.COPYFILE_EXCL);
    copiedApproved = true;
    await copyFile(sourcePath, deliveryPath, fsConstants.COPYFILE_EXCL);
    copiedDelivery = true;
    await writeFile(approvalRecordPath, JSON.stringify(approvalRecord, null, 2) + '\n', { flag: 'wx' });
    wroteRecord = true;
    const updatedManifest = {
      ...manifest,
      approval: {
        ...manifest.approval,
        deliveryApproved: true,
        deliveryApprovedAt: approvedAt,
        deliveryApprovedBy: approvedBy.trim(),
        approvalReference: approvalReference.trim(),
        rightsApproved: true,
        brandApproved: true,
        qaReport: qaReportPath,
        deliveredFile: path.relative(root, deliveryPath).split(path.sep).join('/'),
        deliveredSha256: sourceSha256
      }
    };
    await writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2) + '\n');
  } catch (error) {
    if (wroteRecord) await unlink(approvalRecordPath).catch(() => {});
    if (copiedDelivery) await unlink(deliveryPath).catch(() => {});
    if (copiedApproved) await unlink(approvedPath).catch(() => {});
    throw error;
  }

  return {
    approvedPath,
    deliveryPath,
    approvalRecordPath,
    sourceSha256,
    approvedBy: approvedBy.trim(),
    approvedAt
  };
}

async function main(args) {
  const value = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const projectDirectory = value('--project');
  const generationManifestPath = value('--manifest');
  const mediaPath = value('--media');
  const qaReportPath = value('--qa-report');
  if (!projectDirectory || !generationManifestPath || !mediaPath || !qaReportPath || !value('--approved-by') || !value('--approval-reference')) {
    throw new Error('Usage: node bin/approve-delivery.mjs --project <project> --manifest <generation-manifest.json> --media <project-relative-video> --qa-report <project-relative-qa.json> --approved --approved-by <name> --approval-reference <approval-id> --rights-approved --brand-approved');
  }
  const result = await approveDelivery({
    projectDirectory,
    generationManifestPath,
    mediaPath,
    qaReportPath,
    approved: args.includes('--approved'),
    approvedBy: value('--approved-by'),
    approvalReference: value('--approval-reference'),
    rightsApproved: args.includes('--rights-approved'),
    brandApproved: args.includes('--brand-approved'),
    deliveryName: value('--delivery-name')
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
