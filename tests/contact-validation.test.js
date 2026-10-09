import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactPayload } from '../src/contact-validation.js';

const valid = {
  name: 'Amina Example',
  email: 'amina@example.com',
  company: 'Example Studio',
  goal: 'Generate more qualified demand',
  details: 'We want to improve our enquiry journey.',
};

test('accepts a valid enquiry and normalises the email', () => {
  const result = validateContactPayload({ ...valid, email: ' AMINA@example.com ' });
  assert.equal(result.ok, true);
  assert.equal(result.value.email, 'amina@example.com');
  assert.equal(result.value.name, 'Amina Example');
});

test('rejects an empty name', () => {
  const result = validateContactPayload({ ...valid, name: '   ' });
  assert.equal(result.ok, false);
  assert.match(result.message, /name/i);
});

test('rejects an invalid email address', () => {
  const result = validateContactPayload({ ...valid, email: 'not-an-email' });
  assert.equal(result.ok, false);
  assert.match(result.message, /email/i);
});

test('rejects goals outside the published options', () => {
  const result = validateContactPayload({ ...valid, goal: 'Send me fake leads' });
  assert.equal(result.ok, false);
  assert.match(result.message, /goal/i);
});

test('removes control characters from header-bound fields', () => {
  const result = validateContactPayload({ ...valid, name: 'Amina\r\nBcc: attacker@example.com' });
  assert.equal(result.ok, true);
  assert.equal(result.value.name.includes('\n'), false);
  assert.equal(result.value.name.includes('\r'), false);
});

test('preserves readable multi-line context while removing unsafe controls', () => {
  const result = validateContactPayload({ ...valid, details: 'Line one\nLine two\u0000' });
  assert.equal(result.ok, true);
  assert.equal(result.value.details, 'Line one\nLine two');
});

test('rejects oversized details before email delivery', () => {
  const result = validateContactPayload({ ...valid, details: 'x'.repeat(8001) });
  assert.equal(result.ok, false);
  assert.match(result.message, /shorten/i);
});

test('rejects arrays and non-object bodies', () => {
  assert.equal(validateContactPayload(null).ok, false);
  assert.equal(validateContactPayload([]).ok, false);
  assert.equal(validateContactPayload('hello').ok, false);
});
