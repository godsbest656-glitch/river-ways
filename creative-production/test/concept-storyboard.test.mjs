import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareDraftArtifact } from '../bin/draft-adapters.mjs';

const brief = {
  client: { name: 'Avenize' },
  campaign: { name: 'Market entry', targetTerritories: ['Nigeria'], launchMarket: 'Lagos' },
  objective: 'Build qualified awareness and demo interest.',
  audience: 'SME owners and directors',
  primaryMessage: 'The state of your business in seconds.',
  platforms: ['LinkedIn', 'Instagram'],
  deliverables: [
    { type: 'short-video', aspectRatio: '9:16', durationSeconds: 20, quantity: 2 },
    { type: 'carousel', quantity: 1 }
  ],
  approval: { status: 'draft', approvedBy: null, approvedAt: null },
  constraints: ['No paid media without approval.']
};

test('concept adapter creates reviewable territories without inventing product proof', async () => {
  const result = await prepareDraftArtifact('concept', brief);
  assert.equal(result.artifactType, 'creative-concept-draft');
  assert.equal(result.status, 'draft');
  assert.equal(result.productionAllowed, false);
  assert.equal(result.conceptOptions.length, 3);
  assert.equal(result.messageAnchor, brief.primaryMessage);
  assert.ok(result.conceptOptions.every(option => option.proofRequired.length > 0));
  assert.ok(result.constraints.includes('No paid media without approval.'));
  assert.deepEqual(result.source, { type: 'saved-project-brief', client: 'Avenize', campaign: 'Market entry' });
});

test('storyboard adapter creates a bounded outline and leaves evidence and CTA unfilled', async () => {
  const result = await prepareDraftArtifact('storyboard', brief);
  assert.equal(result.artifactType, 'storyboard-outline-draft');
  assert.equal(result.productionAllowed, false);
  assert.equal(result.videoDeliverables.length, 1);
  assert.equal(result.videoDeliverables[0].scenes.length, 4);
  assert.match(result.videoDeliverables[0].scenes[2].visualDirection, /Placeholder/);
  assert.match(result.videoDeliverables[0].scenes[3].visualDirection, /Placeholder/);
});

test('storyboard adapter does not invent video scenes when no video deliverable exists', async () => {
  const result = await prepareDraftArtifact('storyboard', { ...brief, deliverables: [{ type: 'static-post' }] });
  assert.equal(result.videoDeliverables.length, 0);
  assert.match(result.note, /No video or motion deliverable/);
});

test('draft adapters reject approved briefs and unsupported job types', async () => {
  await assert.rejects(prepareDraftArtifact('concept', { ...brief, approval: { status: 'approved' } }), /draft brief/);
  await assert.rejects(prepareDraftArtifact('image', brief), /Unsupported draft adapter/);
  await assert.rejects(prepareDraftArtifact('copy', { ...brief, platforms: null }), /required source fields/);
});
