import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet, onRequestPost } from "../../functions/api/ai/demand-intelligence.js";

const SALT = "test-only-rate-limit-salt-that-is-long-enough";
const payload = {
  business: "Example Studio",
  website: "https://example.com",
  market: "B2B software in the UK",
  goal: "Increase qualified demos",
  challenge: "We get website visits but few qualified enquiries.",
};

function makeRequest(body, options = {}) {
  const headers = new Headers(options.headers || { "content-type": "application/json" });
  if (options.origin) headers.set("origin", options.origin);
  return new Request("https://riverwayse.example/api/ai/demand-intelligence", {
    method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function fakeDb({ allowed = true } = {}) {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return { bind(...values) { calls.push({ sql, values }); return { async first() { return allowed ? { request_count: 1 } : null; }, async run() { return { success: true }; } }; } };
    },
  };
}

const modelOutput = {
  response: JSON.stringify({
    headline: "Clarify the path from interest to qualified enquiry",
    summary: "The supplied context suggests a conversion and qualification question, but there is not enough evidence to identify the cause.",
    observations: [{ point: "There may be friction between visits and enquiries.", basis: "The visitor reports visits but few qualified enquiries.", confidence: "medium" }],
    priorities: [{ action: "Map the journey from landing page to enquiry.", rationale: "This will locate where evidence is missing.", effort: "small" }],
    questions: ["Which pages receive the most qualified traffic?"],
    limitations: "No website or analytics data was independently inspected.",
  }),
};

test("GET is method-not-allowed", async () => {
  const response = await onRequestGet({ env: {} });
  assert.equal(response.status, 405);
});

test("rejects cross-origin requests", async () => {
  const response = await onRequestPost({ request: makeRequest(payload, { origin: "https://attacker.example" }), env: {} });
  assert.equal(response.status, 403);
});

test("rejects missing required fields before accessing services", async () => {
  const response = await onRequestPost({ request: makeRequest({ business: "Example" }), env: {} });
  assert.equal(response.status, 400);
});

test("rejects invalid website addresses", async () => {
  const response = await onRequestPost({ request: makeRequest({ ...payload, website: "javascript:alert(1)" }), env: {} });
  assert.equal(response.status, 400);
});

test("does not call a model until the owner enables the feature", async () => {
  let called = false;
  const response = await onRequestPost({
    request: makeRequest(payload),
    env: { AI: { run: async () => { called = true; return modelOutput; } }, LEADS_DB: fakeDb(), RATE_LIMIT_SALT: SALT },
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "feature_not_enabled");
  assert.equal(called, false);
});

test("requires AI, D1 and a strong rate-limit salt", async () => {
  const response = await onRequestPost({ request: makeRequest(payload), env: { AI_DEMAND_ENABLED: "true" } });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "missing_runtime_configuration");
});

test("enforces the daily request limit before inference", async () => {
  let called = false;
  const response = await onRequestPost({
    request: makeRequest(payload),
    env: {
      AI_DEMAND_ENABLED: "true", AI: { run: async () => { called = true; return modelOutput; } },
      LEADS_DB: fakeDb({ allowed: false }), RATE_LIMIT_SALT: SALT,
    },
  });
  assert.equal(response.status, 429);
  assert.equal(called, false);
});

test("returns a structured assessment and does not persist visitor prompt content", async () => {
  const db = fakeDb();
  let model;
  const response = await onRequestPost({
    request: makeRequest(payload),
    env: {
      AI_DEMAND_ENABLED: "true", AI_MODEL: "test/model",
      AI: { run: async (name, input) => { model = { name, input }; return modelOutput; } },
      LEADS_DB: db, RATE_LIMIT_SALT: SALT,
    },
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.ok, true);
  assert.equal(result.assessment.headline, "Clarify the path from interest to qualified enquiry");
  assert.equal(model.name, "test/model");
  assert.equal(db.calls.length, 2);
  assert.match(db.calls[0].sql, /DELETE FROM ai_demand_usage/);
  assert.equal(JSON.stringify(db.calls).includes(payload.challenge), false);
});

test("fails safely when model output is not valid JSON", async () => {
  const response = await onRequestPost({
    request: makeRequest(payload),
    env: {
      AI_DEMAND_ENABLED: "true", AI: { run: async () => ({ response: "not json" }) },
      LEADS_DB: fakeDb(), RATE_LIMIT_SALT: SALT,
    },
  });
  assert.equal(response.status, 502);
  assert.equal((await response.json()).code, "inference_failed");
});
