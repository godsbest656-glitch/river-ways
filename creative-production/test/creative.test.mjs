import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { init } from 'node:fs';
import { validateBrief, slugify } from '../bin/creative.mjs';

const validBrief = {
  schemaVersion: '1.0',
  client: { name: 'Example Client' },
  campaign: { name: 'Spring Campaign', slug: 'spring-campaign' },
  objective: 'Test project creation.',
  audience: 'Internal reviewers',
  primaryMessage: 'A useful message',
  platforms: ['website'],
  deliverables: [{ type: 'hero-video', aspectRatio: '16:9', durationSeconds: 8, quantity: 1 }],
  approval: { status: 'draft', approvedBy: null, approvedAt: null },
  rights: { clientAssetsApprovedForGeneration: false, modelLicenseReviewed: false }
};

test('validates a well-formed draft brief without treating it as approved', () => {
  const result = validateBrief(validBrief);
  assert.equal(result.valid, true);
  assert.equal(validateBrief(validBrief, { production: true }).valid, false);
});

test('requires explicit approval and rights before production validation', () => {
  const approved = {
    ...validBrief,
    approval: { status: 'approved', approvedBy: 'Creative Director', approvedAt: '2026-11-07T10:00:00Z' },
    rights: { clientAssetsApprovedForGeneration: true, modelLicenseReviewed: true }
  };
  assert.equal(validateBrief(approved, { production: true }).valid, true);
});

test('rejects missing objective and empty deliverables', () => {
  const invalid = { ...validBrief, objective: '', deliverables: [] };
  const result = validateBrief(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.includes('objective')));
  assert.ok(result.errors.some((item) => item.includes('deliverables')));
});

test('slugifies unsafe names into a bounded filesystem-safe identifier', () => {
  assert.equal(slugify('../../Client Name — Campaign!'), 'client-name-campaign');
  assert.equal(slugify('***'), '');
});
