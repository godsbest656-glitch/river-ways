import { json, requireStudioActor } from "./_auth.js";

const JOB_TYPES = new Set(["project_init", "strategy", "copy", "concept", "storyboard", "image", "video", "render", "qa", "delivery"]);
const WORKER_JOB_TYPES = new Set(["project_init", "strategy", "copy"]);
const ID = /^[a-zA-Z0-9_-]{8,80}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256 = /^[a-f0-9]{64}$/;

function clean(value, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validJson(value, maxBytes = 64000) {
  try {
    const raw = JSON.stringify(value);
    return typeof raw === "string" && raw.length <= maxBytes;
  } catch {
    return false;
  }
}

async function bodyOf(request) {
  const type = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return { error: json(415, { ok: false, error: "json_required" }) };
  const raw = await request.text();
  if (raw.length > 64000) return { error: json(413, { ok: false, error: "payload_too_large" }) };
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid");
    return { body };
  } catch {
    return { error: json(400, { ok: false, error: "invalid_json" }) };
  }
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function id() {
  return crypto.randomUUID();
}

async function audit(db, { clientId, projectId = null, actorId, eventType, entityType, entityId, details = {} }) {
  await db.prepare(
    "INSERT INTO creative_audit_events (id, client_id, project_id, actor_id, event_type, entity_type, entity_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id(), clientId, projectId, actorId, eventType, entityType, entityId, JSON.stringify(details), new Date().toISOString()).run();
}

async function handleClients(request, env, actor, method, parts) {
  if (parts.length !== 1) return json(404, { ok: false, error: "not_found" });
  if (method === "GET") {
    const { results = [] } = await env.LEADS_DB.prepare(
      "SELECT id, slug, name, status, brand_profile_json, created_at, updated_at FROM creative_clients ORDER BY name"
    ).all();
    return json(200, { ok: true, clients: results });
  }
  if (method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const parsed = await bodyOf(request);
  if (parsed.error) return parsed.error;
  const name = clean(parsed.body.name, 120);
  const slug = clean(parsed.body.slug, 80).toLowerCase();
  const profile = parsed.body.brandProfile ?? {};
  if (!name || !SLUG.test(slug) || !validJson(profile, 12000)) return json(422, { ok: false, error: "invalid_client" });
  const clientId = id();
  const now = new Date().toISOString();
  try {
    await env.LEADS_DB.prepare(
      "INSERT INTO creative_clients (id, slug, name, brand_profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(clientId, slug, name, JSON.stringify(profile), now, now).run();
  } catch {
    return json(409, { ok: false, error: "client_slug_conflict" });
  }
  await audit(env.LEADS_DB, { clientId, actorId: actor.id, eventType: "client.created", entityType: "client", entityId: clientId });
  return json(201, { ok: true, client: { id: clientId, slug, name, status: "active", brandProfile: profile } });
}

async function handleProjects(request, env, actor, method, parts, url) {
  if (parts.length === 1 && method === "GET") {
    const clientId = clean(url.searchParams.get("clientId"), 80);
    if (!ID.test(clientId)) return json(400, { ok: false, error: "client_id_required" });
    const { results = [] } = await env.LEADS_DB.prepare(
      "SELECT id, client_id, slug, name, objective, status, brief_version, brief_json, created_at, updated_at FROM creative_projects WHERE client_id = ? ORDER BY updated_at DESC"
    ).bind(clientId).all();
    return json(200, { ok: true, projects: results });
  }
  if (parts.length !== 1 || method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const parsed = await bodyOf(request);
  if (parsed.error) return parsed.error;
  const { clientId } = parsed.body;
  const name = clean(parsed.body.name, 160);
  const slug = clean(parsed.body.slug, 80).toLowerCase();
  const objective = clean(parsed.body.objective, 1200);
  const brief = parsed.body.brief;
  if (!ID.test(clientId) || !name || !SLUG.test(slug) || !objective || !validJson(brief, 48000)) {
    return json(422, { ok: false, error: "invalid_project" });
  }
  if (brief?.approval?.status !== "draft") return json(422, { ok: false, error: "new_briefs_must_be_draft" });
  if (!brief?.client?.name || !brief?.campaign?.name || !brief?.objective || !brief?.audience || !brief?.primaryMessage) {
    return json(422, { ok: false, error: "brief_missing_required_fields" });
  }
  const client = await env.LEADS_DB.prepare("SELECT id, name FROM creative_clients WHERE id = ? AND status = 'active'").bind(clientId).first();
  if (!client) return json(404, { ok: false, error: "client_not_found" });
  if (String(brief.client.name).trim().toLowerCase() !== client.name.toLowerCase()) {
    return json(422, { ok: false, error: "brief_client_mismatch" });
  }
  const projectId = id();
  const now = new Date().toISOString();
  try {
    await env.LEADS_DB.prepare(
      "INSERT INTO creative_projects (id, client_id, slug, name, objective, status, brief_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?)"
    ).bind(projectId, clientId, slug, name, objective, JSON.stringify(brief), now, now).run();
  } catch {
    return json(409, { ok: false, error: "project_slug_conflict" });
  }
  await audit(env.LEADS_DB, { clientId, projectId, actorId: actor.id, eventType: "project.created", entityType: "project", entityId: projectId });
  return json(201, { ok: true, project: { id: projectId, clientId, slug, name, objective, status: "draft", briefVersion: 1 } });
}

async function handleJobs(request, env, actor, method, parts, url) {
  if (parts.length === 1 && method === "GET") {
    const clientId = clean(url.searchParams.get("clientId"), 80);
    const projectId = clean(url.searchParams.get("projectId"), 80);
    if (!ID.test(clientId)) return json(400, { ok: false, error: "client_id_required" });
    const query = projectId
      ? env.LEADS_DB.prepare("SELECT id, client_id, project_id, job_type, status, payload_json, result_json, worker_id, attempt_count, created_at, updated_at FROM creative_jobs WHERE client_id = ? AND project_id = ? ORDER BY created_at DESC LIMIT 100").bind(clientId, projectId)
      : env.LEADS_DB.prepare("SELECT id, client_id, project_id, job_type, status, payload_json, result_json, worker_id, attempt_count, created_at, updated_at FROM creative_jobs WHERE client_id = ? ORDER BY created_at DESC LIMIT 100").bind(clientId);
    const { results = [] } = await query.all();
    return json(200, { ok: true, jobs: results });
  }
  if (parts.length === 1 && method === "POST") {
    const parsed = await bodyOf(request);
    if (parsed.error) return parsed.error;
    const { clientId, projectId, jobType } = parsed.body;
    const payload = parsed.body.payload ?? {};
    if (!ID.test(clientId) || !ID.test(projectId) || !JOB_TYPES.has(jobType) || !validJson(payload, 24000)) {
      return json(422, { ok: false, error: "invalid_job" });
    }
    const project = await env.LEADS_DB.prepare(
      "SELECT id, status FROM creative_projects WHERE id = ? AND client_id = ?"
    ).bind(projectId, clientId).first();
    if (!project) return json(404, { ok: false, error: "project_not_found" });
    if (["paused", "cancelled", "delivered"].includes(project.status)) return json(409, { ok: false, error: "project_not_accepting_jobs" });
    const jobId = id();
    const now = new Date().toISOString();
    await env.LEADS_DB.prepare(
      "INSERT INTO creative_jobs (id, client_id, project_id, job_type, payload_json, available_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(jobId, clientId, projectId, jobType, JSON.stringify(payload), now, now, now).run();
    await audit(env.LEADS_DB, { clientId, projectId, actorId: actor.id, eventType: "job.queued", entityType: "job", entityId: jobId, details: { jobType } });
    return json(202, { ok: true, job: { id: jobId, clientId, projectId, jobType, status: "queued", createdAt: now } });
  }
  return json(405, { ok: false, error: "method_not_allowed" });
}

async function handleWorker(request, env, actor, method, parts) {
  if (method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  if (parts.length === 2 && parts[1] === "claim") {
    const parsed = await bodyOf(request);
    if (parsed.error) return parsed.error;
    const requestedTypes = parsed.body.jobTypes ?? ["project_init"];
    if (!Array.isArray(requestedTypes) || requestedTypes.length < 1 || requestedTypes.length > JOB_TYPES.size ||
        requestedTypes.some((type) => !WORKER_JOB_TYPES.has(type))) return json(422, { ok: false, error: "invalid_worker_job_types" });
    const placeholders = requestedTypes.map(() => "?").join(", ");
    const now = new Date().toISOString();
    const leaseUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const workerId = clean(actor.id, 120);
    await env.LEADS_DB.prepare(
      "UPDATE creative_jobs SET status = CASE WHEN attempt_count >= max_attempts THEN 'failed' ELSE 'queued' END, worker_id = NULL, lease_expires_at = NULL, last_error = CASE WHEN attempt_count >= max_attempts THEN 'Worker lease expired after maximum attempts' ELSE last_error END, finished_at = CASE WHEN attempt_count >= max_attempts THEN ? ELSE NULL END, updated_at = ? WHERE status IN ('claimed', 'running') AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?"
    ).bind(now, now, now).run();
    const job = await env.LEADS_DB.prepare(
      "UPDATE creative_jobs SET status = 'claimed', worker_id = ?, claimed_at = ?, heartbeat_at = ?, lease_expires_at = ?, attempt_count = attempt_count + 1, updated_at = ? WHERE id = (SELECT id FROM creative_jobs WHERE status = 'queued' AND available_at <= ? AND attempt_count < max_attempts AND job_type IN (" + placeholders + ") ORDER BY created_at ASC LIMIT 1) AND status = 'queued' RETURNING id, client_id, project_id, job_type, payload_json, attempt_count, max_attempts, lease_expires_at"
    ).bind(workerId, now, now, leaseUntil, now, now, ...requestedTypes).first();
    if (!job) return json(200, { ok: true, job: null });
    const project = await env.LEADS_DB.prepare("SELECT p.slug, p.name, p.brief_json, p.brief_version, c.slug AS client_slug FROM creative_projects p JOIN creative_clients c ON c.id = p.client_id WHERE p.id = ? AND p.client_id = ?").bind(job.project_id, job.client_id).first();
    if (!project) return json(409, { ok: false, error: "job_project_missing" });
    job.project = { ...project, brief: JSON.parse(project.brief_json) };
    await audit(env.LEADS_DB, { clientId: job.client_id, projectId: job.project_id, actorId: workerId, eventType: "job.claimed", entityType: "job", entityId: job.id });
    return json(200, { ok: true, job });
  }
  if (parts.length === 4 && parts[1] === "jobs" && ID.test(parts[2]) && parts[3] === "assets") {
    const parsed = await bodyOf(request);
    if (parsed.error) return parsed.error;
    const jobId = parts[2];
    const job = await env.LEADS_DB.prepare(
      "SELECT id, client_id, project_id, status, worker_id, lease_expires_at FROM creative_jobs WHERE id = ?"
    ).bind(jobId).first();
    if (!job || job.worker_id !== actor.id || !["claimed", "running"].includes(job.status) || !job.lease_expires_at || Date.parse(job.lease_expires_at) <= Date.now()) {
      return json(409, { ok: false, error: "job_lease_not_owned" });
    }
    const assetType = clean(parsed.body.assetType, 80);
    const mediaType = clean(parsed.body.mediaType, 120);
    const filename = clean(parsed.body.filename, 180);
    const storageKey = clean(parsed.body.storageKey, 500);
    const sha256 = clean(parsed.body.sha256, 64).toLowerCase();
    const version = Number(parsed.body.version);
    const provenance = parsed.body.provenance ?? {};
    if (!assetType || !/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(mediaType) ||
        !filename || filename.includes("/") || filename.includes("\\\\") ||
        !storageKey.startsWith("clients/" + job.client_id + "/") ||
        storageKey.includes("..") || !SHA256.test(sha256) ||
        !Number.isInteger(version) || version < 1 || !validJson(provenance, 12000)) {
      return json(422, { ok: false, error: "invalid_asset_metadata" });
    }
    if (!env.CREATIVE_ASSETS) return json(503, { ok: false, error: "creative_asset_storage_unavailable" });
    const storedObject = await env.CREATIVE_ASSETS.head(storageKey);
    if (!storedObject || storedObject.customMetadata?.sha256 !== sha256 ||
        storedObject.customMetadata?.clientId !== job.client_id ||
        storedObject.customMetadata?.projectId !== job.project_id ||
        storedObject.customMetadata?.jobId !== job.id) {
      return json(409, { ok: false, error: "uploaded_object_provenance_mismatch" });
    }
    const assetId = id();
    const now = new Date().toISOString();
    await env.LEADS_DB.prepare(
      "INSERT INTO creative_assets (id, client_id, project_id, job_id, version, asset_type, media_type, filename, storage_key, sha256, provenance_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(assetId, job.client_id, job.project_id, job.id, version, assetType, mediaType, filename, storageKey, sha256, JSON.stringify(provenance), now, now).run();
    await audit(env.LEADS_DB, { clientId: job.client_id, projectId: job.project_id, actorId: actor.id, eventType: "asset.registered", entityType: "asset", entityId: assetId, details: { jobId, sha256 } });
    return json(201, { ok: true, asset: { id: assetId, clientId: job.client_id, projectId: job.project_id, jobId, version, assetType, status: "generated", sha256 } });
  }
  if (parts.length === 3 && parts[1] === "jobs" && ID.test(parts[2])) {
    const parsed = await bodyOf(request);
    if (parsed.error) return parsed.error;
    const jobId = parts[2];
    const outcome = clean(parsed.body.outcome, 24);
    const result = parsed.body.result ?? {};
    const job = await env.LEADS_DB.prepare(
      "SELECT id, client_id, project_id, status, worker_id, lease_expires_at FROM creative_jobs WHERE id = ?"
    ).bind(jobId).first();
    if (!job || job.worker_id !== actor.id || !["claimed", "running"].includes(job.status) || !job.lease_expires_at || Date.parse(job.lease_expires_at) <= Date.now()) {
      return json(409, { ok: false, error: "job_lease_not_owned" });
    }
    const now = new Date().toISOString();
    if (outcome === "heartbeat") {
      const leaseUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      await env.LEADS_DB.prepare(
        "UPDATE creative_jobs SET status = 'running', started_at = COALESCE(started_at, ?), heartbeat_at = ?, lease_expires_at = ?, updated_at = ? WHERE id = ? AND worker_id = ? AND status IN ('claimed', 'running')"
      ).bind(now, now, leaseUntil, now, jobId, actor.id).run();
      return json(200, { ok: true, jobId, status: "running", leaseExpiresAt: leaseUntil });
    }
    if (!["completed", "failed"].includes(outcome) || !validJson(result, 24000)) {
      return json(422, { ok: false, error: "invalid_job_result" });
    }
    const errorMessage = outcome === "failed" ? clean(parsed.body.error, 1200) : null;
    await env.LEADS_DB.prepare(
      "UPDATE creative_jobs SET status = ?, result_json = ?, last_error = ?, finished_at = ?, lease_expires_at = NULL, updated_at = ? WHERE id = ? AND worker_id = ? AND status IN ('claimed', 'running')"
    ).bind(outcome, JSON.stringify(result), errorMessage, now, now, jobId, actor.id).run();
    await audit(env.LEADS_DB, { clientId: job.client_id, projectId: job.project_id, actorId: actor.id, eventType: "job." + outcome, entityType: "job", entityId: jobId });
    return json(200, { ok: true, jobId, status: outcome });
  }
  return json(404, { ok: false, error: "not_found" });
}

async function handleAssets(request, env, method, parts, url) {
  if (method !== "GET" || parts.length !== 1) return json(405, { ok: false, error: "method_not_allowed" });
  const clientId = clean(url.searchParams.get("clientId"), 80);
  const projectId = clean(url.searchParams.get("projectId"), 80);
  if (!ID.test(clientId)) return json(400, { ok: false, error: "client_id_required" });
  const query = projectId
    ? env.LEADS_DB.prepare("SELECT id, client_id, project_id, job_id, version, asset_type, media_type, filename, sha256, status, provenance_json, created_at, updated_at FROM creative_assets WHERE client_id = ? AND project_id = ? ORDER BY created_at DESC LIMIT 100").bind(clientId, projectId)
    : env.LEADS_DB.prepare("SELECT id, client_id, project_id, job_id, version, asset_type, media_type, filename, sha256, status, provenance_json, created_at, updated_at FROM creative_assets WHERE client_id = ? ORDER BY created_at DESC LIMIT 100").bind(clientId);
  const { results = [] } = await query.all();
  return json(200, { ok: true, assets: results });
}

async function handleAssetFile(request, env, actor, method, parts) {
  if (method !== "GET" || parts.length !== 3 || parts[2] !== "file" || !ID.test(parts[1])) {
    return json(404, { ok: false, error: "not_found" });
  }
  if (!env.CREATIVE_ASSETS) return json(503, { ok: false, error: "creative_asset_storage_unavailable" });
  const asset = await env.LEADS_DB.prepare(
    "SELECT id, client_id, filename, media_type, storage_key, sha256, status FROM creative_assets WHERE id = ?"
  ).bind(parts[1]).first();
  if (!asset) return json(404, { ok: false, error: "asset_not_found" });
  const object = await env.CREATIVE_ASSETS.get(asset.storage_key);
  if (!object) return json(404, { ok: false, error: "asset_file_not_found" });
  const safeFilename = asset.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160) || "creative-asset";
  return new Response(object.body, {
    status: 200,
    headers: {
      "content-type": asset.media_type || object.httpMetadata?.contentType || "application/octet-stream",
      "content-length": String(object.size),
      "content-disposition": 'inline; filename="' + safeFilename + '"',
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "x-creative-asset-sha256": asset.sha256,
      "x-creative-asset-status": asset.status
    }
  });
}

async function handleWorkerUpload(request, env, actor, parts) {
  if (request.method !== "POST" || parts.length !== 4 || parts[1] !== "jobs" || !ID.test(parts[2]) || parts[3] !== "upload") {
    return json(404, { ok: false, error: "not_found" });
  }
  if (!env.CREATIVE_ASSETS) return json(503, { ok: false, error: "creative_asset_storage_unavailable" });
  const job = await env.LEADS_DB.prepare(
    "SELECT id, client_id, project_id, status, worker_id, lease_expires_at FROM creative_jobs WHERE id = ?"
  ).bind(parts[2]).first();
  if (!job || job.worker_id !== actor.id || !["claimed", "running"].includes(job.status) || !job.lease_expires_at || Date.parse(job.lease_expires_at) <= Date.now()) {
    return json(409, { ok: false, error: "job_lease_not_owned" });
  }
  const length = Number(request.headers.get("content-length") || 0);
  const maximum = 25 * 1024 * 1024;
  if (!Number.isFinite(length) || length <= 0 || length > maximum) return json(413, { ok: false, error: "asset_size_out_of_range" });
  const mediaType = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm", "application/pdf", "application/json"]);
  if (!allowedTypes.has(mediaType)) return json(415, { ok: false, error: "asset_media_type_not_allowed" });
  const rawFilename = clean(request.headers.get("x-asset-filename"), 180);
  const filename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "");
  if (!filename) return json(422, { ok: false, error: "asset_filename_required" });
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength !== length || bytes.byteLength > maximum) return json(400, { ok: false, error: "asset_body_length_mismatch" });
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const key = "clients/" + job.client_id + "/projects/" + job.project_id + "/" + job.id + "/" + crypto.randomUUID() + "-" + filename;
  await env.CREATIVE_ASSETS.put(key, bytes, { httpMetadata: { contentType: mediaType }, customMetadata: { sha256, clientId: job.client_id, projectId: job.project_id, jobId: job.id } });
  await audit(env.LEADS_DB, { clientId: job.client_id, projectId: job.project_id, actorId: actor.id, eventType: "asset.uploaded", entityType: "job", entityId: job.id, details: { storageKey: key, sha256, bytes: length, mediaType } });
  return json(201, { ok: true, storageKey: key, filename, mediaType, sha256, bytes: length });
}

async function handleApproval(request, env, actor, method, parts) {
  if (method !== "POST" || parts.length !== 3 || parts[2] !== "approval" || !ID.test(parts[1])) {
    return json(404, { ok: false, error: "not_found" });
  }
  const parsed = await bodyOf(request);
  if (parsed.error) return parsed.error;
  const decision = clean(parsed.body.decision, 24);
  const usageScope = clean(parsed.body.usageScope, 240);
  const notes = clean(parsed.body.notes, 2000);
  const expectedSha = clean(parsed.body.assetSha256, 64).toLowerCase();
  if (!["approved", "changes_requested", "rejected"].includes(decision) || !usageScope || !SHA256.test(expectedSha)) {
    return json(422, { ok: false, error: "approval_requires_decision_scope_and_asset_hash" });
  }
  const asset = await env.LEADS_DB.prepare(
    "SELECT id, client_id, project_id, sha256, status FROM creative_assets WHERE id = ?"
  ).bind(parts[1]).first();
  if (!asset) return json(404, { ok: false, error: "asset_not_found" });
  if (asset.sha256 !== expectedSha) return json(409, { ok: false, error: "asset_version_changed" });
  if (["delivered"].includes(asset.status)) return json(409, { ok: false, error: "delivered_asset_is_immutable" });
  const now = new Date().toISOString();
  const approvalId = id();
  const nextStatus = decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "review_required";
  await env.LEADS_DB.batch([
    env.LEADS_DB.prepare(
      "INSERT INTO creative_approval_events (id, client_id, project_id, asset_id, reviewer_id, decision, usage_scope, notes, asset_sha256, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(approvalId, asset.client_id, asset.project_id, asset.id, actor.id, decision, usageScope, notes, expectedSha, now),
    env.LEADS_DB.prepare(
      "UPDATE creative_assets SET status = ?, updated_at = ? WHERE id = ? AND sha256 = ?"
    ).bind(nextStatus, now, asset.id, expectedSha),
    env.LEADS_DB.prepare(
      "INSERT INTO creative_audit_events (id, client_id, project_id, actor_id, event_type, entity_type, entity_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id(), asset.client_id, asset.project_id, actor.id, "asset." + decision, "asset", asset.id, JSON.stringify({ approvalId, assetSha256: expectedSha, usageScope }), now)
  ]);
  return json(201, { ok: true, approvalId, assetId: asset.id, status: nextStatus, assetSha256: expectedSha });
}

export async function onRequest({ request, env }) {
  if (!env.LEADS_DB) return json(503, { ok: false, error: "studio_database_unavailable" });
  const url = new URL(request.url);
  if (!sameOrigin(request)) return json(403, { ok: false, error: "same_origin_required" });
  const parts = url.pathname.replace(/^\/api\/studio\/?/, "").split("/").filter(Boolean);
  const isWorker = parts[0] === "worker";
  const auth = await requireStudioActor(request, env, { role: isWorker ? "worker" : "staff" });
  if (auth.response) return auth.response;
  const actor = auth.actor;
  try {
    if (parts[0] === "clients") return await handleClients(request, env, actor, request.method, parts);
    if (parts[0] === "projects") return await handleProjects(request, env, actor, request.method, parts, url);
    if (parts[0] === "jobs") return await handleJobs(request, env, actor, request.method, parts, url);
    if (parts[0] === "worker" && parts[1] === "jobs" && parts[3] === "upload") return await handleWorkerUpload(request, env, actor, parts);
    if (parts[0] === "worker") return await handleWorker(request, env, actor, request.method, parts);
    if (parts[0] === "assets" && parts.length === 1) return await handleAssets(request, env, request.method, parts, url);
    if (parts[0] === "assets" && parts[2] === "file") return await handleAssetFile(request, env, actor, request.method, parts);
    if (parts[0] === "assets") return await handleApproval(request, env, actor, request.method, parts);
    return json(404, { ok: false, error: "not_found" });
  } catch {
    return json(500, { ok: false, error: "studio_operation_failed" });
  }
}
