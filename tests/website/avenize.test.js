import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

test('Avenize is introduced as a distinct in-development ecosystem product', () => {
  assert.match(app, /href="#avenize"[^>]*>Avenize</);
  assert.match(app, /id="avenize"/);
  assert.match(app, /IN DEVELOPMENT/);
  assert.match(app, /Not yet available for general release/);
  assert.match(app, /Explore Avenize \/ business operations/);
});

test('Avenize system map labels its six planned capability areas', () => {
  for (const label of [
    'Business identity',
    'Customer relationships',
    'People & operations',
    'AI assistant',
    'Pulse & intelligence',
    'Marketplace & workflows'
  ]) assert.ok(app.includes(label), `Missing Avenize capability: ${label}`);
});
