#!/usr/bin/env node
import { renderHyperframes, renderRemotion } from './render-adapter.mjs';

function flag(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
function has(args, name) {
  return args.includes(name);
}

async function main(args) {
  const [renderer, ...rest] = args;
  const projectDirectory = flag(rest, '--project');
  if (!projectDirectory) throw new Error('Usage: render.mjs hyperframes|remotion --project <directory> --approved [options]');
  let result;
  if (renderer === 'hyperframes') {
    result = await renderHyperframes({
      projectDirectory,
      outputPath: flag(rest, '--output') ?? 'renders/final.mp4',
      approved: has(rest, '--approved'),
      rendererRoot: flag(rest, '--renderer-root')
    });
  } else if (renderer === 'remotion') {
    result = await renderRemotion({
      projectDirectory,
      entryPoint: flag(rest, '--entry-point'),
      compositionId: flag(rest, '--composition-id'),
      outputPath: flag(rest, '--output') ?? 'renders/final.mp4',
      propsPath: flag(rest, '--props'),
      approved: has(rest, '--approved'),
      licenseAcknowledged: has(rest, '--license-acknowledged'),
      freeLicenseEligible: has(rest, '--free-license-eligible'),
      rendererRoot: flag(rest, '--renderer-root') ?? projectDirectory
    });
  } else {
    throw new Error('Renderer must be hyperframes or remotion');
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write('ERROR: ' + error.message + '\n');
  process.exitCode = 1;
});
