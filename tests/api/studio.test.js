import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../../functions/api/studio/[[path]].js";

const encoder = new TextEncoder();
let privateKey;
let publicJwk;
const originalFetch = globalThis.fetch;

function b64url(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

async function assertion({ audience = "staff-aud", email = "operator@riverways.example", commonName } = {}) {
  const header = b64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test-key" })));
  const claims = b64url(Buffer.from(JSON.stringify({
    iss: "https://riverways.cloudflareaccess.com",
    aud: audience,
    email,
    ...(commonName ? { common_name: commonName } : {}),
    exp: Math.floor(Date.now() / 1000) + 300,
    iat: Math.floor(Date.now() / 1000)
  })));
  const input = header + "." + claims;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(input));
  return input + "." + b64url(new Uint8Array(signature));
}

function makeDb() {
  const clients = new Map();
  const projects = new Map();
  const jobs = new Map();
  const assets = new Map();
  const approvals = [];
  const audits = [];

  function statement(sql, values = []) {
    return {
      bind(...args) { return statement(sql, args); },
      async first() {
        if (sql.includes("FROM creative_clients WHERE id = ? AND status = 'active'")) {
          const client = clients.get(values[0]);
          return client?.status === "active" ? client : null;
        }
        if (sql.includes("FROM creative_projects WHERE id = ? AND client_id = ?") || sql.includes("FROM creative_projects p JOIN creative_clients c")) {
          const project = projects.get(values[0]);
          if (project?.client_id !== values[1]) return null;
          if (sql.includes("brief_json")) return { slug: project.slug, name: project.name, brief_json: project.brief_json, brief_version: 1, client_slug: clients.get(project.client_id)?.slug };
          return { id: project.id, status: project.status };
        }
        if (sql.includes("FROM creative_jobs WHERE id = ?") && sql.includes("worker_id")) {
          const job = jobs.get(values[0]);
          return job ? { id: job.id, client_id: job.client_id, project_id: job.project_id, status: job.status, worker_id: job.worker_id, lease_expires_at: job.lease_expires_at } : null;
        }
        if (sql.includes("FROM creative_assets WHERE id = ?")) {
          const asset = assets.get(values[0]);
          return asset ? { id: asset.id, client_id: asset.client_id, project_id: asset.project_id, filename: asset.filename, media_type: asset.media_type, storage_key: asset.storage_key, sha256: asset.sha256, status: asset.status } : null;
        }
        if (sql.includes("UPDATE creative_jobs") && sql.includes("RETURNING")) {
          const allowedTypes = values.slice(6);
          const job = [...jobs.values()].filter((item) => item.status === "queued" && allowedTypes.includes(item.job_type)).sort((a,b) => a.created_at.localeCompare(b.created_at))[0];
          if (!job) return null;
          job.status = "claimed";
          job.worker_id = values[0];
          job.claimed_at = values[1];
          job.heartbeat_at = values[2];
          job.lease_expires_at = values[3];
          job.attempt_count += 1;
          job.updated_at = values[4];
          return { id: job.id, client_id: job.client_id, project_id: job.project_id, job_type: job.job_type, payload_json: job.payload_json, attempt_count: job.attempt_count, max_attempts: job.max_attempts, lease_expires_at: job.lease_expires_at };
        }
        return null;
      },
      async all() {
        if (sql.includes("FROM creative_clients")) return { results: [...clients.values()] };
        if (sql.includes("FROM creative_projects WHERE client_id = ?")) return { results: [...projects.values()].filter((item) => item.client_id === values[0]) };
        if (sql.includes("FROM creative_jobs WHERE client_id = ?")) return { results: [...jobs.values()].filter((item) => item.client_id === values[0] && (!values[1] || item.project_id === values[1])) };
        if (sql.includes("FROM creative_assets WHERE client_id = ?")) return { results: [...assets.values()].filter((item) => item.client_id === values[0] && (!values[1] || item.project_id === values[1])) };
        return { results: [] };
      },
      async run() {
        if (sql.startsWith("INSERT INTO creative_clients")) {
          const [id, slug, name, brand_profile_json, created_at, updated_at] = values;
          if ([...clients.values()].some((item) => item.slug === slug)) throw new Error("duplicate slug");
          clients.set(id, { id, slug, name, brand_profile_json, status: "active", created_at, updated_at });
        } else if (sql.startsWith("INSERT INTO creative_projects")) {
          const [id, client_id, slug, name, objective, status, brief_json, created_at, updated_at] = values.length === 9 ? values : [values[0],values[1],values[2],values[3],values[4],"draft",values[5],values[6],values[7]];
          projects.set(id, { id, client_id, slug, name, objective, status, brief_json, created_at, updated_at });
        } else if (sql.startsWith("INSERT INTO creative_jobs")) {
          const [id, client_id, project_id, job_type, payload_json, available_at, created_at, updated_at] = values;
          jobs.set(id, { id, client_id, project_id, job_type, payload_json, available_at, created_at, updated_at, status: "queued", attempt_count: 0, max_attempts: 3, worker_id: null });
        } else if (sql.startsWith("UPDATE creative_jobs SET status = 'running'")) {
          const [started_at, heartbeat_at, lease_expires_at, updated_at, id, worker_id] = values;
          const job = jobs.get(id);
          if (job?.worker_id === worker_id) Object.assign(job, { status: "running", started_at, heartbeat_at, lease_expires_at, updated_at });
        } else if (sql.startsWith("UPDATE creative_jobs SET status = ?, result_json")) {
          const [status, result_json, last_error, finished_at, updated_at, id, worker_id] = values;
          const job = jobs.get(id);
          if (job?.worker_id === worker_id) Object.assign(job, { status, result_json, last_error, finished_at, lease_expires_at: null, updated_at });
        } else if (sql.startsWith("INSERT INTO creative_assets")) {
          const [id, client_id, project_id, job_id, version, asset_type, media_type, filename, storage_key, sha256, provenance_json, created_at, updated_at] = values;
          assets.set(id, { id, client_id, project_id, job_id, version, asset_type, media_type, filename, storage_key, sha256, provenance_json, created_at, updated_at, status: "generated" });
        } else if (sql.startsWith("INSERT INTO creative_approval_events")) {
          approvals.push(values);
        } else if (sql.startsWith("UPDATE creative_assets SET status")) {
          const [status, updated_at, id, sha256] = values;
          const asset = assets.get(id);
          if (asset?.sha256 === sha256) Object.assign(asset, { status, updated_at });
        } else if (sql.startsWith("INSERT INTO creative_audit_events")) {
          audits.push(values);
        }
        return { success: true };
      }
    };
  }

  return {
    clients, projects, jobs, assets, approvals, audits,
    prepare(sql) { return statement(sql); },
    async batch(statements) { for (const item of statements) await item.run(); return []; }
  };
}

const env = (db) => {
  const objects = new Map();
  return {
    LEADS_DB: db,
    CREATIVE_ASSETS: {
      async put(key, value, options) { objects.set(key, { body: value, size: value.byteLength, httpMetadata: options?.httpMetadata || {}, customMetadata: options?.customMetadata || {} }); },
      async get(key) { return objects.get(key) || null; },
      async head(key) { const object = objects.get(key); return object ? { size: object.size, customMetadata: object.customMetadata } : null; }
    },
    CF_ACCESS_TEAM_DOMAIN: "riverways.cloudflareaccess.com",
    CF_ACCESS_AUD: "staff-aud",
    STUDIO_WORKER_AUD: "worker-aud",
    STUDIO_ALLOWED_EMAILS: "operator@riverways.example"
  };
};

async function send(path, { method = "GET", body, token, origin = "https://riverwayse.com" } = {}, environment) {
  const headers = {};
  if (token) headers["Cf-Access-Jwt-Assertion"] = token;
  if (body !== undefined) headers["content-type"] = "application/json";
  if (origin) headers.Origin = origin;
  const request = new Request("https://riverwayse.com/api/studio/" + path, {
    method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  return onRequest({ request, env: environment });
}

before(async () => {
  const pair = await crypto.subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5", modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256"
  }, true, ["sign", "verify"]);
  privateKey = pair.privateKey;
  publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  publicJwk.kid = "test-key";
  publicJwk.alg = "RS256";
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [publicJwk] }), {
    status: 200, headers: { "content-type": "application/json" }
  });
});

after(() => { globalThis.fetch = originalFetch; });

test("Creative Studio API rejects requests without a valid Cloudflare Access assertion", async () => {
  const response = await send("clients", {}, env(makeDb()));
  assert.equal(response.status, 401);
});

test("Creative Studio API rejects cross-origin mutations", async () => {
  const token = await assertion();
  const response = await send("clients", {
    method: "POST", token, origin: "https://attacker.example",
    body: { name: "Avenize", slug: "avenize" }
  }, env(makeDb()));
  assert.equal(response.status, 403);
});

test("client → project → job → worker claim → asset metadata → approval lifecycle", async () => {
  const db = makeDb();
  const e = env(db);
  const staff = await assertion();
  const clientResponse = await send("clients", {
    method: "POST", token: staff,
    body: { name: "Avenize", slug: "avenize", brandProfile: { palette: ["obsidian", "electric-lime"] } }
  }, e);
  assert.equal(clientResponse.status, 201);
  const client = (await clientResponse.json()).client;

  const brief = {
    schemaVersion: "1.0",
    client: { name: "Avenize", id: "avenize" },
    campaign: { name: "Market entry", slug: "market-entry" },
    objective: "Generate qualified product demonstrations",
    audience: "Business owners and operators",
    primaryMessage: "The state of your business in seconds.",
    platforms: ["LinkedIn"],
    deliverables: [{ type: "launch-campaign-concept", quantity: 1 }],
    approval: { status: "draft", approvedBy: null, approvedAt: null }
  };
  const projectResponse = await send("projects", {
    method: "POST", token: staff,
    body: { clientId: client.id, name: "Market entry", slug: "market-entry", objective: brief.objective, brief }
  }, e);
  assert.equal(projectResponse.status, 201);
  const project = (await projectResponse.json()).project;

  const jobResponse = await send("jobs", {
    method: "POST", token: staff,
    body: { clientId: client.id, projectId: project.id, jobType: "project_init", payload: { deliverable: "campaign-concept" } }
  }, e);
  assert.equal(jobResponse.status, 202);
  const job = (await jobResponse.json()).job;
  const deferredResponse = await send("jobs", {
    method: "POST", token: staff,
    body: { clientId: client.id, projectId: project.id, jobType: "concept", payload: { deliverable: "future-concept-adapter" } }
  }, e);
  assert.equal(deferredResponse.status, 202);
  const deferredJob = (await deferredResponse.json()).job;

  const worker = await assertion({ audience: "worker-aud", email: undefined, commonName: "studio-worker-01" });
  const claimResponse = await send("worker/claim", { method: "POST", token: worker, body: { jobTypes: ["project_init"] } }, e);
  assert.equal(claimResponse.status, 200);
  const claimed = (await claimResponse.json()).job;
  assert.equal(claimed.id, job.id);
  assert.equal(claimed.project.brief.client.name, "Avenize");
  assert.equal(db.jobs.get(deferredJob.id).status, "queued");
  const heartbeat = await send("worker/jobs/" + job.id, {
    method: "POST", token: worker, body: { outcome: "heartbeat" }
  }, e);
  assert.equal(heartbeat.status, 200);
  assert.equal((await heartbeat.json()).status, "running");

  const uploadToken = worker;
  const uploadRequest = new Request("https://riverwayse.com/api/studio/worker/jobs/" + job.id + "/upload", {
    method: "POST",
    headers: {
      "Cf-Access-Jwt-Assertion": uploadToken,
      "content-type": "image/png",
      "content-length": "8",
      "x-asset-filename": "concept.png"
    },
    body: Buffer.from("fake-png")
  });
  const uploadResponse = await onRequest({ request: uploadRequest, env: e });
  assert.equal(uploadResponse.status, 201);
  const uploaded = await uploadResponse.json();
  assert.equal(uploaded.bytes, 8);
  const digest = uploaded.sha256;
  const wrongWorker = await assertion({ audience: "worker-aud", commonName: "other-worker" });
  const deniedAsset = await send("worker/jobs/" + job.id + "/assets", {
    method: "POST", token: wrongWorker,
    body: {
      assetType: "concept", mediaType: "application/json", filename: "concept.json",
      storageKey: "clients/" + client.id + "/projects/" + project.id + "/denied.json",
      sha256: digest, version: 1, provenance: { source: "test" }
    }
  }, e);
  assert.equal(deniedAsset.status, 409);
  const assetResponse = await send("worker/jobs/" + job.id + "/assets", {
    method: "POST", token: worker,
    body: {
      assetType: "concept", mediaType: uploaded.mediaType, filename: uploaded.filename,
      storageKey: uploaded.storageKey,
      sha256: digest, version: 1, provenance: { source: "test" }
    }
  }, e);
  assert.equal(assetResponse.status, 201);
  const asset = (await assetResponse.json()).asset;
  const assetList = await send("assets?clientId=" + encodeURIComponent(client.id), { token: staff }, e);
  assert.equal(assetList.status, 200);
  assert.equal((await assetList.json()).assets.length, 1);

  const staleApproval = await send("assets/" + asset.id + "/approval", {
    method: "POST", token: staff,
    body: { decision: "approved", usageScope: "internal review only", assetSha256: "b".repeat(64) }
  }, e);
  assert.equal(staleApproval.status, 409);
  const approvalResponse = await send("assets/" + asset.id + "/approval", {
    method: "POST", token: staff,
    body: { decision: "approved", usageScope: "internal review only", assetSha256: digest }
  }, e);
  assert.equal(approvalResponse.status, 201);
  assert.equal((await approvalResponse.json()).status, "approved");
  assert.equal(db.assets.get(asset.id).status, "approved");
  const preview = await send("assets/" + asset.id + "/file", { token: staff }, e);
  assert.equal(preview.status, 200);
  assert.equal(await preview.text(), "fake-png");
  assert.equal(db.approvals.length, 1);
  const completed = await send("worker/jobs/" + job.id, {
    method: "POST", token: worker, body: { outcome: "completed", result: { assetId: asset.id } }
  }, e);
  assert.equal(completed.status, 200);
  assert.equal(db.jobs.get(job.id).status, "completed");
  assert.ok(db.audits.length >= 4);
});

test("approval is bound to the exact immutable asset hash", async () => {
  const db = makeDb();
  const e = env(db);
  const staff = await assertion();
  const response = await send("assets/00000000-0000-4000-8000-000000000000/approval", {
    method: "POST", token: staff,
    body: { decision: "approved", usageScope: "social", assetSha256: "b".repeat(64) }
  }, e);
  assert.equal(response.status, 404);
});
