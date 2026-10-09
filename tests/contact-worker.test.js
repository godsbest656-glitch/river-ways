import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const origin = 'https://preview.river-ways.workers.dev';
const validPayload = {
  name: 'Amina Example',
  email: 'amina@example.com',
  company: 'Example Studio',
  goal: 'Generate more qualified demand',
  details: 'We want to improve our enquiry journey.',
};

function request(path, { method = 'POST', payload = validPayload, requestOrigin = origin, headers = {} } = {}) {
  const requestHeaders = {
    Origin: requestOrigin,
    'Content-Type': 'application/json',
    ...headers,
  };
  const body = method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(payload);
  return new Request(origin + path, { method, headers: requestHeaders, body });
}

test('contact endpoint accepts only POST', async () => {
  const response = await worker.fetch(request('/api/contact', { method: 'GET' }), {});
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('contact endpoint rejects cross-origin submissions', async () => {
  const response = await worker.fetch(request('/api/contact', { requestOrigin: 'https://attacker.example' }), {});
  assert.equal(response.status, 403);
});

test('contact endpoint rejects non-JSON content types', async () => {
  const response = await worker.fetch(request('/api/contact', { headers: { 'Content-Type': 'text/plain' } }), {});
  assert.equal(response.status, 415);
});

test('contact endpoint rejects invalid form values on the server', async () => {
  const response = await worker.fetch(request('/api/contact', { payload: { ...validPayload, email: 'bad-email' } }), {});
  assert.equal(response.status, 400);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.match(result.message, /email/i);
});

test('contact endpoint fails closed if delivery and verification are not configured', async () => {
  const response = await worker.fetch(request('/api/contact'), {
    CONTACT_TO: 'test@example.com',
  });
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.equal(result.code, 'CONTACT_NOT_CONFIGURED');
});

test('contact endpoint quietly discards honeypot submissions', async () => {
  const response = await worker.fetch(request('/api/contact', {
    payload: { ...validPayload, website_confirm: 'bot filled this' },
  }), {});
  assert.equal(response.status, 202);
  const result = await response.json();
  assert.equal(result.ok, true);
});

test('unknown API endpoints return JSON 404', async () => {
  const response = await worker.fetch(request('/api/unknown'), {});
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('content-type').includes('application/json'), true);
});
