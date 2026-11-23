#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderHyperframes, renderRemotion } from './render-adapter.mjs';

function value(args, name, fallback = '') {
  const index = args.indexOf(name);
  return index >= 0 ? (args[index + 1] || '') : fallback;
}

export function parseRenderArgs(args) {
  return {
    help: args.includes('--help') || args.includes('-h'),
    renderer: value(args, '--renderer', 'hyperframes'),
    project: value(args, '--project'),
    output: value(args, '--output', 'renders/final.mp4'),
    entry: value(args, '--entry'),
    compositionId: value(args, '--composition-id'),
    props: value(args, '--props'),
    approved: args.includes('--approved'),
    licenseAcknowledged: args.includes('--license-acknowledged'),
    freeLicenseEligible: args.includes('--free-license-eligible')
  };
}

export async function runRender(args, adapters = { renderHyperframes, renderRemotion }) {
  const options = parseRenderArgs(args);
  if (options.help) {
    return { help: 'Usage: node bin/render.mjs --project <directory> [--renderer hyperframes|remotion] --approved [renderer-specific options]' };
  }
  if (!options.project) throw new Error('--project is required');
  const projectDirectory = path.resolve(options.project);
  if (options.renderer === 'hyperframes') {
    return adapters.renderHyperframes({
      projectDirectory,
      outputPath: options.output,
      approved: options.approved
    });
  }
  if (options.renderer === 'remotion') {
    if (!options.entry || !options.compositionId) {
      throw new Error('Remotion requires --entry and --composition-id');
    }
    return adapters.renderRemotion({
      projectDirectory,
      entryPoint: options.entry,
      compositionId: options.compositionId,
      outputPath: options.output,
      propsPath: options.props || undefined,
      approved: options.approved,
      licenseAcknowledged: options.licenseAcknowledged,
      freeLicenseEligible: options.freeLicenseEligible
    });
  }
  throw new Error('Unsupported renderer: ' + options.renderer);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  runRender(process.argv.slice(2)).then((result) => {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  }).catch((error) => {
    process.stderr.write('RENDER ERROR: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
