import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

test('Avenize is introduced as a distinct in-development ecosystem product', () => {
  assert.match(app, /href="\/avenize\/"[^>]*>Avenize</);
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

const productPage = readFileSync(new URL('../../public/avenize/index.html', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8');

test('Avenize has a distinct crawlable overview page with honest release status', () => {
  assert.match(productPage, /<title>Avenize/);
  assert.match(productPage, /IN DEVELOPMENT · NOT GENERALLY AVAILABLE/);
  assert.match(productPage, /Business identity &amp; graph|Business identity & graph/);
  assert.match(productPage, /Customer relationships/);
  assert.match(productPage, /People &amp; operations|People & operations/);
  assert.match(productPage, /AI assistant/);
  assert.match(productPage, /Pulse &amp; intelligence|Pulse & intelligence/);
  assert.match(productPage, /Marketplace &amp; workflows|Marketplace & workflows/);
  assert.match(productPage, /\/?interest=avenize#contact/);
  assert.match(sitemap, /https:\/\/riverwayse\.com\/avenize\//);
});

test('Avenize enquiry handoff preselects the matching contact goal', () => {
  assert.match(app, /new URLSearchParams\(window\.location\.search\)\.get\('interest'\) === 'avenize'/);
});
