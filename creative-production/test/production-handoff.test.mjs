import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareDraftArtifact } from '../bin/draft-adapters.mjs';
import { createProductionHandoffManifest, validateProductionHandoffManifest } from '../bin/production-handoff.mjs';

const brief = {
  client: { name: 'Internal Test Client' },
  campaign: { name: 'Launch Campaign' },
  objective: 'Explain a verified product capability.',
  audience: 'Business owners',
  primaryMessage: 'A clear operating picture.',
  approval: { status: 'draft' },
  constraints: []
};

test('storyboard provides shot-level asset requirements and prompt templates', async () => {
  const storyboard = await prepareDraftArtifact('storyboard', brief);
  assert.equal(storyboard.scenes.length, 6);
  for (const scene of storyboard.scenes) {
    assert.ok(scene.assetRequirements.length >= 2);
    assert.ok(scene.assetRequirements.every(asset => asset.rightsStatus === 'not-reviewed'));
    assert.equal(scene.promptSpec.status, 'template-needs-approved-inputs');
    assert.equal(scene.promptSpec.subject, null);
    assert.ok(scene.promptSpec.requiredInputs.includes('approved reference assets'));
    assert.equal(scene.generationStatus, 'blocked-pending-approval');
  }
  assert.ok(storyboard.scenes[2].assetRequirements.some(asset => asset.role === 'product-proof'));
});

test('handoff manifest maps shot timings, assets and approval gates', async () => {
  const storyboard = await prepareDraftArtifact('storyboard', brief);
  const manifest = createProductionHandoffManifest(storyboard, {
    clientName: brief.client.name,
    campaignName: brief.campaign.name,
    projectId: 'launch-campaign',
    conceptId: 'concept-01'
  });
  assert.equal(manifest.artifactType, 'creative-production-handoff');
  assert.equal(manifest.shots.length, 6);
  assert.deepEqual(manifest.shots.map(shot => shot.timeline.startSeconds), [0, 5, 10, 15, 20, 25]);
  assert.equal(manifest.shots[0].timeline.durationSeconds, 5);
  assert.equal(manifest.releaseGate.generationAllowed, false);
  assert.equal(manifest.releaseGate.deliveryAllowed, false);
  assert.equal(validateProductionHandoffManifest(manifest).valid, false);
  assert.ok(validateProductionHandoffManifest(manifest).errors.some(error => error.includes('unapproved assets')));
});

test('handoff rejects unsafe identifiers and malformed shot specifications', async () => {
  const storyboard = await prepareDraftArtifact('storyboard', brief);
  assert.throws(() => createProductionHandoffManifest(storyboard, {
    clientName: 'Client', campaignName: 'Campaign', projectId: '../escape'
  }), /safe identifier/);
  const malformed = structuredClone(storyboard);
  malformed.scenes[0].promptSpec = null;
  assert.throws(() => createProductionHandoffManifest(malformed, {
    clientName: 'Client', campaignName: 'Campaign'
  }), /blocked prompt specification/);
});

test('handoff rejects missing, non-string and unsafe asset identifiers', async () => {
  const storyboard = await prepareDraftArtifact('storyboard', brief);
  const cases = [undefined, null, '', 42, '../escape'];
  for (const assetId of cases) {
    const malformed = structuredClone(storyboard);
    malformed.scenes[0].assetRequirements[0].assetId = assetId;
    assert.throws(() => createProductionHandoffManifest(malformed, {
      clientName: 'Client', campaignName: 'Campaign'
    }), /assetId must be a safe identifier/);
  }
});
