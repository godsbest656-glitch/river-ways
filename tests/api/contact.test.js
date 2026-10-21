import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet, onRequestPost } from "../../functions/api/contact.js";

const RATE_LIMIT_SALT = "test-only-salt-that-is-long-enough-123";
const validBody = {
  name: "Ada Example",
  email: "ada@example.com",
  company: "Example Co",
  goal: "Generate more qualified demand",
  details: "We want to improve qualified enquiries.",
  website: "",
  submissionKey: "11111111-1111-4111-8111-111111111111",
};

function request(body, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  if (options.origin) headers.set("origin", options.origin);
  return new Request("https://riverwayse.example/api/contact", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function fakeDatabase({ recentCount = 0, existingSubmission = null, conflictOnInsert = false, schemaMissing = false } = {}) {
  const calls = [];
  let submissionLookups = 0;
  const db = {
    prepare(sql) {
      return {
        bind(...values) {
          calls.push({ sql, values });
          return {
            async first() {
              if (sql.includes("WHERE submission_key = ?")) {
                if (schemaMissing) throw new Error("no such column: submission_key");
                submissionLookups += 1;
                if (conflictOnInsert && submissionLookups === 1) return null;
                return existingSubmission;
              }
              if (sql.includes("SELECT COUNT(*) AS total")) return { total: recentCount };
              return null;
            },
            async run() {
              if (sql.startsWith("INSERT")) {
                if (conflictOnInsert) throw new Error("UNIQUE constraint failed: leads.submission_key");
                return { meta: { last_row_id: 17 } };
              }
              return { meta: {} };
            },
          };
        },
      };
    },
  };
  return { db, calls };
}

async function readJson(response) {
  return response.json();
}


test("GET preflight returns method-not-allowed only when runtime config and latest schema are present", async () => {
  const { db } = fakeDatabase();
  const ready = await onRequestGet({ env: { LEADS_DB: db, RATE_LIMIT_SALT } });
  assert.equal(ready.status, 405);
  assert.equal(ready.headers.get("allow"), "POST, OPTIONS");

  const missingSalt = await onRequestGet({ env: { LEADS_DB: db } });
  assert.equal(missingSalt.status, 503);

  const { db: oldSchemaDb } = fakeDatabase({ schemaMissing: true });
  const missingMigration = await onRequestGet({ env: { LEADS_DB: oldSchemaDb, RATE_LIMIT_SALT } });
  assert.equal(missingMigration.status, 503);
});

test("rejects non-JSON submissions", async () => {
  const response = await onRequestPost({
    request: request("name=Ada", { headers: { "content-type": "text/plain" } }),
    env: { LEADS_DB: {} },
  });
  assert.equal(response.status, 415);
});

test("rejects cross-origin submissions", async () => {
  const response = await onRequestPost({
    request: request(validBody, { origin: "https://attacker.example" }),
    env: { LEADS_DB: {} },
  });
  assert.equal(response.status, 403);
});

test("rejects malformed JSON", async () => {
  const response = await onRequestPost({
    request: request("{not-json"),
    env: { LEADS_DB: {} },
  });
  assert.equal(response.status, 400);
});

test("rejects oversized request bodies", async () => {
  const response = await onRequestPost({
    request: request({ ...validBody, details: "x".repeat(13_000) }),
    env: { LEADS_DB: {} },
  });
  assert.equal(response.status, 413);
});

test("validates email and allowed goal before database writes", async () => {
  const { db, calls } = fakeDatabase();
  const response = await onRequestPost({
    request: request({ ...validBody, email: "not-an-email", goal: "admin" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test("honeypot submissions receive a neutral response and are not stored", async () => {
  const { db, calls } = fakeDatabase();
  const response = await onRequestPost({
    request: request({ ...validBody, website: "spam payload" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await readJson(response), { ok: true });
  assert.equal(calls.length, 0);
});

test("refuses to store enquiries without a strong rate-limit salt", async () => {
  const { db, calls } = fakeDatabase();
  const response = await onRequestPost({
    request: request(validBody),
    env: { LEADS_DB: db },
  });
  assert.equal(response.status, 503);
  assert.equal(calls.length, 0);
});

test("stores a valid enquiry when notifications are not configured", async () => {
  const { db, calls } = fakeDatabase();
  const response = await onRequestPost({
    request: request(validBody, { origin: "https://riverwayse.example" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await readJson(response), { ok: true, notification: "not_configured" });
  assert.equal(calls.filter((call) => call.sql.includes("WHERE submission_key = ?")).length, 1);
  assert.equal(calls.filter((call) => call.sql.includes("SELECT COUNT(*) AS total")).length, 1);
  assert.equal(calls.filter((call) => call.sql.startsWith("INSERT")).length, 1);
  assert.equal(calls.find((call) => call.sql.startsWith("INSERT")).values.at(-1), validBody.submissionKey);
  assert.equal(calls.find((call) => call.sql.startsWith("INSERT")).values[0], "Ada Example");
});

test("rate-limits repeated enquiries from the same connection", async () => {
  const { db, calls } = fakeDatabase({ recentCount: 5 });
  const response = await onRequestPost({
    request: request(validBody),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 429);
  assert.equal(calls.some((call) => call.sql.startsWith("INSERT")), false);
});


test("returns the existing result when a submission key is retried", async () => {
  const { db, calls } = fakeDatabase({
    existingSubmission: { id: 17, notification_status: "sent" },
  });
  const response = await onRequestPost({
    request: request(validBody, { origin: "https://riverwayse.example" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await readJson(response), { ok: true, notification: "sent", duplicate: true });
  assert.equal(calls.filter((call) => call.sql.startsWith("INSERT")).length, 0);
  assert.equal(calls.filter((call) => call.sql.includes("SELECT COUNT(*) AS total")).length, 0);
});

test("handles simultaneous duplicate submissions using the unique database index", async () => {
  const { db, calls } = fakeDatabase({
    existingSubmission: { id: 17, notification_status: "sent" },
    conflictOnInsert: true,
  });
  const response = await onRequestPost({
    request: request(validBody, { origin: "https://riverwayse.example" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await readJson(response), { ok: true, notification: "sent", duplicate: true });
  assert.equal(calls.filter((call) => call.sql.startsWith("INSERT")).length, 1);
});

test("persists first-party campaign attribution and normalizes the landing path", async () => {
  const { db, calls } = fakeDatabase();
  const response = await onRequestPost({
    request: request({
      ...validBody,
      landingPage: "//attacker.example/fake",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "rw-diagnostic-test",
      utmContent: "search-ad-a",
      utmTerm: "demand engineering",
    }, { origin: "https://riverwayse.example" }),
    env: { LEADS_DB: db, RATE_LIMIT_SALT },
  });
  assert.equal(response.status, 200);
  const insert = calls.find((call) => call.sql.startsWith("INSERT"));
  assert.ok(insert, "enquiry must be inserted");
  assert.deepEqual(insert.values.slice(8), [
    "/",
    "google",
    "cpc",
    "rw-diagnostic-test",
    "search-ad-a",
    "demand engineering",
    validBody.submissionKey,
  ]);
});
