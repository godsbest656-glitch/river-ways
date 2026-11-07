#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WEIGHTS = {
  visualQuality: 0.25,
  motionCoherence: 0.25,
  promptFidelity: 0.15,
  temporalStability: 0.15,
  artifactCleanliness: 0.10,
  reliability: 0.10
};

export function validateBenchmark(dataset) {
  const errors = [];
  if (dataset?.schemaVersion !== '1.0') errors.push('schemaVersion must equal 1.0');
  if (typeof dataset?.benchmarkId !== 'string' || !dataset.benchmarkId.trim()) errors.push('benchmarkId is required');
  if (!dataset?.testProfile || typeof dataset.testProfile.prompt !== 'string' || !dataset.testProfile.prompt.trim()) {
    errors.push('testProfile.prompt is required');
  }
  if (!Array.isArray(dataset?.runs) || dataset.runs.length === 0) {
    errors.push('runs must contain at least one measured run');
    return { valid: false, errors };
  }
  dataset.runs.forEach((run, index) => {
    const prefix = 'runs[' + index + ']';
    for (const field of ['modelId', 'checkpoint', 'workflowSha256']) {
      if (typeof run?.[field] !== 'string' || !run[field].trim()) errors.push(prefix + '.' + field + ' is required');
    }
    if (!/^[a-f0-9]{64}$/i.test(run?.workflowSha256 ?? '')) errors.push(prefix + '.workflowSha256 must be a SHA-256 hex digest');
    if (!run?.hardware?.gpuName || !Number.isFinite(run?.hardware?.vramGb) || !Number.isFinite(run?.hardware?.ramGb)) {
      errors.push(prefix + '.hardware must include GPU name, VRAM and RAM');
    }
    for (const field of ['generationSeconds', 'peakVramGb', 'peakRamGb', 'outputBytes']) {
      if (!Number.isFinite(run?.metrics?.[field]) || run.metrics[field] <= 0) errors.push(prefix + '.metrics.' + field + ' must be positive');
    }
    for (const field of Object.keys(WEIGHTS).filter((key) => key !== 'reliability')) {
      const value = run?.scores?.[field];
      if (!Number.isInteger(value) || value < 1 || value > 5) errors.push(prefix + '.scores.' + field + ' must be an integer from 1 to 5');
    }
    if (typeof run?.passed !== 'boolean') errors.push(prefix + '.passed must be boolean');
    if (!run.passed && (typeof run.failureReason !== 'string' || !run.failureReason.trim())) {
      errors.push(prefix + '.failureReason is required for failed runs');
    }
  });
  return { valid: errors.length === 0, errors };
}

export function scoreRun(run) {
  const weighted = Object.entries(WEIGHTS).reduce((total, [field, weight]) => {
    const score = field === 'reliability' ? (run.passed ? 5 : 0) : run.scores[field];
    return total + score * weight;
  }, 0);
  return Number((weighted * 20).toFixed(2));
}

export function summarizeBenchmarks(dataset, { minimumRuns = 3 } = {}) {
  const validation = validateBenchmark(dataset);
  if (!validation.valid) throw new Error('Invalid benchmark: ' + validation.errors.join('; '));
  const groups = new Map();
  for (const run of dataset.runs) {
    const group = groups.get(run.modelId) ?? [];
    group.push(run);
    groups.set(run.modelId, group);
  }
  return [...groups.entries()].map(([modelId, runs]) => {
    const scores = runs.map(scoreRun).sort((a, b) => a - b);
    const times = runs.map((run) => run.metrics.generationSeconds).sort((a, b) => a - b);
    const median = (values) => values.length % 2
      ? values[(values.length - 1) / 2]
      : (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
    const passCount = runs.filter((run) => run.passed).length;
    return {
      modelId,
      runs: runs.length,
      eligibleForRanking: runs.length >= minimumRuns,
      meanScore: Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(2)),
      medianScore: median(scores),
      medianGenerationSeconds: median(times),
      maxPeakVramGb: Math.max(...runs.map((run) => run.metrics.peakVramGb)),
      passRate: Number((passCount / runs.length).toFixed(3))
    };
  }).sort((a, b) => {
    if (a.eligibleForRanking !== b.eligibleForRanking) return a.eligibleForRanking ? -1 : 1;
    return b.meanScore - a.meanScore;
  });
}

async function main(args) {
  const command = args[0];
  const input = args[1];
  if (!['validate', 'compare'].includes(command) || !input) {
    throw new Error('Usage: node bin/benchmark.mjs validate|compare <benchmark-results.json>');
  }
  const dataset = JSON.parse(await readFile(path.resolve(input), 'utf8'));
  const validation = validateBenchmark(dataset);
  if (!validation.valid) {
    process.stderr.write(validation.errors.join('\n') + '\n');
    process.exitCode = 1;
    return;
  }
  const report = {
    benchmarkId: dataset.benchmarkId,
    validated: true,
    scoringWeights: WEIGHTS,
    comparisons: summarizeBenchmarks(dataset)
  };
  const outputPath = args.includes('--out') ? path.resolve(args[args.indexOf('--out') + 1]) : null;
  const serialized = JSON.stringify(report, null, 2) + '\n';
  if (outputPath) await writeFile(outputPath, serialized, { flag: 'wx' });
  process.stdout.write(serialized);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
