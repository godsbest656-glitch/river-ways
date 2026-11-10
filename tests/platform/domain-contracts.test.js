import test from "node:test";
import assert from "node:assert/strict";
import {
  LEAD_STAGES,
  LEAD_NOTIFICATION_STATUSES,
  LEAD_SOURCES,
  isUuid,
  isIsoTimestamp,
  isMoney,
  isLeadStage,
  isLeadNotificationStatus,
  isLeadSource,
  validateDomainEvent
} from "../../shared/domain-contracts.js";

const uuid = "8b9f7b2a-5b20-4b9d-8f4c-1f5c2d8a9e31";

const validEvent = () => ({
  event_id: uuid,
  event_type: "lead.created",
  schema_version: 1,
  occurred_at: "2026-11-10T08:00:00.000Z",
  actor: { type: "system", id: "contact-api" },
  tenant_id: null,
  aggregate: { type: "lead", id: uuid },
  correlation_id: uuid,
  causation_id: null,
  idempotency_key: "contact-submit:" + uuid,
  data: { source: "website", stage: "new" }
});

test("lead vocabularies match the existing D1 schema and contact handler", () => {
  assert.deepEqual(LEAD_STAGES, [
    "new", "qualified", "meeting", "proposal", "won", "lost", "nurture"
  ]);
  assert.deepEqual(LEAD_NOTIFICATION_STATUSES, [
    "pending", "sent", "failed", "not_configured"
  ]);
  assert.deepEqual(LEAD_SOURCES, ["website", "campaign", "referral"]);
  for (const stage of LEAD_STAGES) assert.equal(isLeadStage(stage), true);
  for (const status of LEAD_NOTIFICATION_STATUSES) {
    assert.equal(isLeadNotificationStatus(status), true);
  }
  for (const source of LEAD_SOURCES) assert.equal(isLeadSource(source), true);
  assert.equal(isLeadStage("payment_verified"), false);
  assert.equal(isLeadSource("outbound_scrape"), false);
});

test("UUID validation accepts canonical UUIDs and rejects arbitrary strings", () => {
  assert.equal(isUuid(uuid), true);
  assert.equal(isUuid("lead-123"), false);
  assert.equal(isUuid(""), false);
  assert.equal(isUuid(null), false);
});

test("timestamps require an explicit timezone and a parseable date", () => {
  assert.equal(isIsoTimestamp("2026-11-10T08:00:00.000Z"), true);
  assert.equal(isIsoTimestamp("2026-11-10T09:00:00+01:00"), true);
  assert.equal(isIsoTimestamp("2026-11-10 08:00:00"), false);
  assert.equal(isIsoTimestamp("not-a-date"), false);
});

test("money uses integer minor units and an uppercase ISO-style currency code", () => {
  assert.equal(isMoney({ amount_minor: 12500, currency: "NGN" }), true);
  assert.equal(isMoney({ amount_minor: 0, currency: "USD" }), true);
  assert.equal(isMoney({ amount_minor: 12.5, currency: "USD" }), false);
  assert.equal(isMoney({ amount_minor: -1, currency: "USD" }), false);
  assert.equal(isMoney({ amount_minor: 100, currency: "usd" }), false);
  assert.equal(isMoney(null), false);
});

test("a valid version-1 event envelope passes", () => {
  assert.deepEqual(validateDomainEvent(validEvent()), []);
});

test("event envelope rejects missing identity, actor, tenant and correlation fields", () => {
  const event = validEvent();
  event.event_id = "evt-1";
  event.actor = { type: "robot", id: "" };
  event.tenant_id = "not-a-uuid";
  event.correlation_id = null;
  const errors = validateDomainEvent(event);
  assert.ok(errors.includes("event_id must be a UUID"));
  assert.ok(errors.includes("actor must contain a supported type and non-empty id"));
  assert.ok(errors.includes("tenant_id must be null or a UUID"));
  assert.ok(errors.includes("correlation_id must be a UUID"));
});

test("event envelope rejects invalid type, version, timestamp and data shape", () => {
  const event = validEvent();
  event.event_type = "Lead Created";
  event.schema_version = 0;
  event.occurred_at = "2026-11-10 08:00:00";
  event.aggregate = [];
  event.data = [];
  const errors = validateDomainEvent(event);
  assert.ok(errors.includes("event_type must be a namespaced lowercase event name"));
  assert.ok(errors.includes("schema_version must be a positive integer"));
  assert.ok(errors.includes("occurred_at must be an ISO 8601 timestamp with timezone"));
  assert.ok(errors.includes("aggregate must contain a valid type and non-empty id"));
  assert.ok(errors.includes("data must be an object"));
});

test("non-object events fail safely", () => {
  assert.deepEqual(validateDomainEvent(null), ["event must be an object"]);
  assert.deepEqual(validateDomainEvent([]), ["event must be an object"]);
});
