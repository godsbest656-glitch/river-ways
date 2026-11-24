import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const REGISTRY_URL = new URL("../integrations/registry.json", import.meta.url);
const ALLOWED_STATUSES = new Set([
  "existing-foundation",
  "adopt-candidate",
  "evaluate",
  "reference-only",
  "defer",
  "blocked"
]);
const LICENSE_STATUSES = new Set([
  "verified",
  "pending",
  "custom",
  "conditional",
  "not-applicable"
]);
const SECRET_KEY = /(secret|token|password|api[_-]?key|credential)/i;

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function findSecretKeys(value, path = "$", found = []) {
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value)) {
    const childPath = path + "." + key;
    if (SECRET_KEY.test(key)) found.push(childPath);
    findSecretKeys(child, childPath, found);
  }
  return found;
}

export function validateRegistry(registry) {
  const errors = [];
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
    return ["Registry must be an object."];
  }
  if (registry.schema_version !== 1) errors.push("schema_version must equal 1.");
  if (typeof registry.registry_updated !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(registry.registry_updated)) {
    errors.push("registry_updated must use YYYY-MM-DD.");
  }
  if (registry.policy?.owner_approval_required_for_paid_usage !== true) {
    errors.push("Paid usage must require owner approval.");
  }
  if (registry.policy?.owner_approval_required_for_production_enablement !== true) {
    errors.push("Production enablement must require owner approval.");
  }
  if (!Array.isArray(registry.integrations) || registry.integrations.length === 0) {
    errors.push("integrations must be a non-empty array.");
    return errors;
  }

  const ids = new Set();
  for (const [index, item] of registry.integrations.entries()) {
    const prefix = `integrations[${index}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${prefix} must be an object.`);
      continue;
    }
    if (typeof item.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) {
      errors.push(`${prefix}.id must be a lowercase kebab-case identifier.`);
    } else if (ids.has(item.id)) {
      errors.push(`Duplicate integration id: ${item.id}.`);
    } else {
      ids.add(item.id);
    }
    for (const field of ["name", "category", "next_gate"]) {
      if (typeof item[field] !== "string" || !item[field].trim()) {
        errors.push(`${prefix}.${field} must be a non-empty string.`);
      }
    }
    if (!ALLOWED_STATUSES.has(item.status)) errors.push(`${prefix}.status is not an allowed status.`);
    if (!isHttpsUrl(item.source)) errors.push(`${prefix}.source must be a valid HTTPS URL.`);
    if (!isHttpsUrl(item.upstream)) errors.push(`${prefix}.upstream must be a valid HTTPS URL.`);
    if (!item.license || !LICENSE_STATUSES.has(item.license.status) || typeof item.license.expression !== "string" || !item.license.expression.trim()) {
      errors.push(`${prefix}.license must include a valid status and expression.`);
    }
    if (!item.deployment || typeof item.deployment.mode !== "string" || !item.deployment.mode.trim() ||
        typeof item.deployment.boundary !== "string" || !item.deployment.boundary.trim()) {
      errors.push(`${prefix}.deployment must include mode and boundary.`);
    }
    for (const field of ["capabilities", "constraints"]) {
      if (!Array.isArray(item[field]) || item[field].some(value => typeof value !== "string" || !value.trim())) {
        errors.push(`${prefix}.${field} must be an array of non-empty strings.`);
      }
    }
  }

  const secretKeys = findSecretKeys(registry);
  if (secretKeys.length) errors.push("Registry contains prohibited secret-like keys: " + secretKeys.join(", ") + ".");
  return errors;
}

export function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_URL, "utf8"));
}

function run() {
  const errors = validateRegistry(loadRegistry());
  if (errors.length) {
    process.stderr.write(errors.map(error => "- " + error).join("\n") + "\n");
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Validated ${loadRegistry().integrations.length} integration records.\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run();
}
