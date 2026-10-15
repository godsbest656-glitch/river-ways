import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../../functions/api/contact.js";

function makeDb() {
  const leads = [];
  const rates = new Map();
  return {
    leads,
    prepare(sql) {
      let values = [];
      return {
        bind(...args) { values = args; return this; },
        async first() {
          if (sql.includes("RETURNING count")) {
            const key = values[0] + ":" + values[1];
            const count = (rates.get(key) || 0) + 1;
            rates.set(key, count);
            return { count };
          }
          if (sql.startsWith("SELECT id, notification_status")) {
            return leads.find((lead) => lead.email === values[0] && lead.brief_hash === values[1] && lead.created_at >= values[2]) || null;
          }
          return null;
        },
        async run() {
          if (sql.startsWith("INSERT INTO leads")) {
            const [id, name, email, company, goal, details, brief_hash, , created_at] = values;
            leads.push({ id, name, email, company, goal, details, brief_hash, notification_status: "pending", created_at });
          }
          if (sql.startsWith("UPDATE leads")) {
            const [status, attemptedAt, id] = values;
            const lead = leads.find((item) => item.id === id);
            if (lead) { lead.notification_status = status; lead.notification_attempted_at = attemptedAt; }
          }
          return { success: true };
        }
      };
    }
  };
}

function request(body) {
  return new Request("https://riverwayse.com/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "CF-Connecting-IP": "192.0.2.10" },
    body: JSON.stringify(body)
  });
}

const originalFetch = globalThis.fetch;
test.beforeEach(() => {
  globalThis.fetch = async () => new Response(JSON.stringify({ id: "email_test" }), { status: 200 });
});
test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

const envFor = (db) => ({
  LEADS_DB: db,
  RATE_LIMIT_SALT: "a".repeat(40),
  RESEND_API_KEY: "test-key",
  RESEND_FROM_EMAIL: "River Ways <enquiries@example.com>",
  LEAD_NOTIFICATION_EMAIL: "team@example.com"
});

test("rejects malformed and invalid submissions", async () => {
  const db = makeDb();
  const invalid = await onRequestPost({ request: request({ name: "", email: "nope", goal: "Growth" }), env: envFor(db) });
  assert.equal(invalid.status, 422);
  const wrongType = await onRequestPost({ request: new Request("https://riverwayse.com/api/contact", { method: "POST", body: "not json" }), env: envFor(db) });
  assert.equal(wrongType.status, 415);
});

test("stores a valid lead once and reuses an identical brief within two minutes", async () => {
  const db = makeDb();
  const payload = { name: "Ada Example", email: "ADA@example.com", company: "Example Co", goal: "Generate demand", details: "We need a better funnel." };
  const first = await onRequestPost({ request: request(payload), env: envFor(db) });
  const second = await onRequestPost({ request: request(payload), env: envFor(db) });
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(db.leads.length, 1);
  assert.equal(db.leads[0].email, "ada@example.com");
});

test("a changed brief creates a distinct lead", async () => {
  const db = makeDb();
  const base = { name: "Ada Example", email: "ada@example.com", company: "Example Co", goal: "Generate demand", details: "First brief." };
  await onRequestPost({ request: request(base), env: envFor(db) });
  await onRequestPost({ request: request({ ...base, details: "Updated brief." }), env: envFor(db) });
  assert.equal(db.leads.length, 2);
});

test("quietly discards honeypot submissions without storing them", async () => {
  const db = makeDb();
  const response = await onRequestPost({ request: request({ name: "Bot", email: "bot@example.com", goal: "Growth", website: "https://spam.example" }), env: envFor(db) });
  assert.equal(response.status, 202);
  assert.equal(db.leads.length, 0);
});

test("rejects JSON values that are not form objects", async () => {
  const db = makeDb();
  const response = await onRequestPost({
    request: new Request("https://riverwayse.com/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "null" }),
    env: envFor(db)
  });
  assert.equal(response.status, 400);
});

test("returns a safe service error when required configuration is missing", async () => {
  const response = await onRequestPost({ request: request({ name: "Ada Example", email: "ada@example.com", goal: "Growth" }), env: {} });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
