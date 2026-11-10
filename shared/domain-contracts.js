/**
 * Dependency-free domain contracts shared by River Ways server and application code.
 *
 * These validators describe the current inbound-lead vocabulary and the proposed
 * version-1 domain-event envelope. They do not perform authentication, tenant
 * authorization, persistence, or side effects.
 */

export const LEAD_STAGES = Object.freeze([
  "new",
  "qualified",
  "meeting",
  "proposal",
  "won",
  "lost",
  "nurture"
]);

export const LEAD_NOTIFICATION_STATUSES = Object.freeze([
  "pending",
  "sent",
  "failed",
  "not_configured"
]);

export const LEAD_SOURCES = Object.freeze([
  "website",
  "campaign",
  "referral"
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EVENT_TYPE_PATTERN = /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)+$/;
const AGGREGATE_TYPE_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function isIsoTimestamp(value) {
  return (
    typeof value === "string" &&
    ISO_TIMESTAMP_PATTERN.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

export function isMoney(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Number.isSafeInteger(value.amount_minor) &&
    value.amount_minor >= 0 &&
    typeof value.currency === "string" &&
    /^[A-Z]{3}$/.test(value.currency)
  );
}

export function isLeadStage(value) {
  return LEAD_STAGES.includes(value);
}

export function isLeadNotificationStatus(value) {
  return LEAD_NOTIFICATION_STATUSES.includes(value);
}

export function isLeadSource(value) {
  return LEAD_SOURCES.includes(value);
}

/**
 * Return a list of contract violations for a version-1 domain event.
 * An empty list means the envelope is structurally valid, not authorized.
 */
export function validateDomainEvent(event) {
  const errors = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return ["event must be an object"];
  }

  if (!isUuid(event.event_id)) errors.push("event_id must be a UUID");
  if (
    typeof event.event_type !== "string" ||
    !EVENT_TYPE_PATTERN.test(event.event_type)
  ) {
    errors.push("event_type must be a namespaced lowercase event name");
  }
  if (!Number.isSafeInteger(event.schema_version) || event.schema_version < 1) {
    errors.push("schema_version must be a positive integer");
  }
  if (!isIsoTimestamp(event.occurred_at)) {
    errors.push("occurred_at must be an ISO 8601 timestamp with timezone");
  }

  const actorTypes = ["human", "agent", "system"];
  if (
    !event.actor ||
    typeof event.actor !== "object" ||
    Array.isArray(event.actor) ||
    !actorTypes.includes(event.actor.type) ||
    typeof event.actor.id !== "string" ||
    !event.actor.id.trim()
  ) {
    errors.push("actor must contain a supported type and non-empty id");
  }

  if (event.tenant_id !== null && !isUuid(event.tenant_id)) {
    errors.push("tenant_id must be null or a UUID");
  }

  if (
    !event.aggregate ||
    typeof event.aggregate !== "object" ||
    Array.isArray(event.aggregate) ||
    typeof event.aggregate.type !== "string" ||
    !AGGREGATE_TYPE_PATTERN.test(event.aggregate.type) ||
    typeof event.aggregate.id !== "string" ||
    !event.aggregate.id.trim()
  ) {
    errors.push("aggregate must contain a valid type and non-empty id");
  }

  if (!isUuid(event.correlation_id)) {
    errors.push("correlation_id must be a UUID");
  }
  if (event.causation_id !== null && !isUuid(event.causation_id)) {
    errors.push("causation_id must be null or a UUID");
  }
  if (
    typeof event.idempotency_key !== "string" ||
    !event.idempotency_key.trim() ||
    event.idempotency_key.length > 200
  ) {
    errors.push("idempotency_key must be 1-200 characters");
  }
  if (
    !event.data ||
    typeof event.data !== "object" ||
    Array.isArray(event.data)
  ) {
    errors.push("data must be an object");
  }

  return errors;
}
