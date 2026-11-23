import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRenderArgs, runRender } from '../bin/render.mjs';

test('render CLI defaults to HyperFrames and requires an explicit project', async () => {
  assert.equal(parseRenderArgs(['--project', './project']).renderer, 'hyperframes');
  await assert.rejects(() => runRender([]), /--project is required/);
});

test('HyperFrames render passes explicit approval and output path to its adapter', async () => {
  let received;
  const result = await runRender(['--project', './project', '--approved', '--output', 'renders/campaign.mp4'], {
    renderHyperframes: async (options) => { received = options; return { ok: true }; },
    renderRemotion: async () => { throw new Error('unexpected renderer'); }
  });
  assert.equal(result.ok, true);
  assert.equal(received.approved, true);
  assert.equal(received.outputPath, 'renders/campaign.mp4');
});

test('Remotion requires composition inputs and forwards license gates', async () => {
  await assert.rejects(() => runRender(['--project', './project', '--renderer', 'remotion']), /--entry and --composition-id/);
  let received;
  await runRender([
    '--project', './project', '--renderer', 'remotion',
    '--entry', 'src/index.jsx', '--composition-id', 'Campaign',
    '--approved', '--license-acknowledged', '--free-license-eligible'
  ], {
    renderHyperframes: async () => { throw new Error('unexpected renderer'); },
    renderRemotion: async (options) => { received = options; return { ok: true }; }
  });
  assert.equal(received.approved, true);
  assert.equal(received.licenseAcknowledged, true);
  assert.equal(received.freeLicenseEligible, true);
});
