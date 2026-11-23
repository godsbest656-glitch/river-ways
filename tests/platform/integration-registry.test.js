import test from "node:test";
import assert from "node:assert/strict";
import { loadRegistry, validateRegistry } from "../../scripts/validate-integration-registry.mjs";

test("the committed integration registry is valid", () => {
  const registry = loadRegistry();
  assert.deepEqual(validateRegistry(registry), []);
  assert.equal(registry.integrations.length, 22);
});

test("the validator rejects duplicate integration identifiers", () => {
  const registry = structuredClone(loadRegistry());
  registry.integrations.push(structuredClone(registry.integrations[0]));
  assert.ok(validateRegistry(registry).some(error => error.includes("Duplicate integration id")));
});

test("the validator rejects invalid source URLs and statuses", () => {
  const registry = structuredClone(loadRegistry());
  registry.integrations[0].source = "javascript:alert(1)";
  registry.integrations[0].status = "installed-and-live";
  const errors = validateRegistry(registry);
  assert.ok(errors.some(error => error.includes(".source must be a valid HTTPS URL")));
  assert.ok(errors.some(error => error.includes(".status is not an allowed status")));
});

test("the validator rejects secret-like fields", () => {
  const registry = structuredClone(loadRegistry());
  registry.integrations[0].api_key = "must-not-be-stored";
  assert.ok(validateRegistry(registry).some(error => error.includes("prohibited secret-like keys")));
});

test("the validator requires explicit licensing and production gates", () => {
  const registry = structuredClone(loadRegistry());
  registry.policy.owner_approval_required_for_paid_usage = false;
  registry.integrations[0].license.status = "unknown";
  const errors = validateRegistry(registry);
  assert.ok(errors.some(error => error.includes("Paid usage must require owner approval")));
  assert.ok(errors.some(error => error.includes(".license must include a valid status")));
});
