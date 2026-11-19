import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../../functions/api/studio/[[path]].js";

const originalFetch = globalThis.fetch;
let privateKey;
let publicJwk;
const clientA = "00000000-0000-4000-8000-000000000001";
const clientB = "00000000-0000-4000-8000-000000000002";
const assetA = "00000000-0000-4000-8000-000000000011";
const assetB = "00000000-0000-4000-8000-000000000012";
const digest = "a".repeat(64);

function b64url(value) { return Buffer.from(value).toString("base64url"); }

async function clientToken(email = "reviewer-a@example.com") {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "portal-test" }));
  const claims = b64url(JSON.stringify({
    iss: "https://riverways.cloudflareaccess.com", aud: "client-aud", email,
    exp: Math.floor(Date.now() / 1000) + 300, iat: Math.floor(Date.now() / 1000)
  }));
  const input = header + "." + claims;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(input));
  return input + "." + b64url(signature);
}

function makeDb() {
  const memberships = new Map([
    [clientA + ":reviewer-a@example.com", { client_id: clientA, email: "reviewer-a@example.com", role: "reviewer", status: "active" }],
    [clientB + ":reviewer-b@example.com", { client_id: clientB, email: "reviewer-b@example.com", role: "reviewer", status: "active" }]
  ]);
  const assets = new Map([
    [assetA, { id: assetA, client_id: clientA, project_id: "project-a", filename: "asset-a.png", media_type: "image/png", storage_key: "private/a", sha256: digest, status: "generated" }],
    [assetB, { id: assetB, client_id: clientB, project_id: "project-b", filename: "asset-b.png", media_type: "image/png", storage_key: "private/b", sha256: digest, status: "generated" }]
  ]);
  const reviews = [];
  const comments = [];
  const audits = [];
  function statement(sql, values = []) {
    return {
      bind(...args) { return statement(sql, args); },
      async first() {
        if (sql.includes("FROM creative_client_memberships m JOIN creative_clients")) {
          const member = memberships.get(values[0] + ":" + values[1]);
          return member?.status === "active" ? { id: "membership" } : null;
        }
        if (sql.includes("FROM creative_assets WHERE id = ?")) {
          return assets.get(values[0]) || null;
        }
        return null;
      },
      async all() {
        if (sql.includes("FROM creative_client_comments")) {
          return { results: comments.filter((item) => item.client_id === values[0] && item.asset_id === values[1]) };
        }
        return { results: [] };
      },
      async run() {
        if (sql.startsWith("INSERT INTO creative_client_review_events")) {
          reviews.push(values);
          return { meta: { changes: 1 } };
        }
        if (sql.startsWith("INSERT INTO creative_client_comments")) {
          const [id, client_id, project_id, asset_id, reviewer_email, comment, created_at] = values;
          comments.push({ id, client_id, project_id, asset_id, reviewer_email, comment, created_at });
          return { meta: { changes: 1 } };
        }
        if (sql.startsWith("INSERT INTO creative_audit_events")) {
          audits.push(values);
          return { meta: { changes: 1 } };
        }
        return { meta: { changes: 0 } };
      }
    };
  }
  return {
    memberships, assets, reviews, comments, audits,
    prepare(sql) { return statement(sql); },
    async batch(items) { for (const item of items) await item.run(); return []; }
  };
}

function environment(db) {
  const objects = new Map([
    ["private/a", { body: "asset-a-bytes", size: 14, httpMetadata: { contentType: "image/png" } }],
    ["private/b", { body: "asset-b-bytes", size: 14, httpMetadata: { contentType: "image/png" } }]
  ]);
  return {
    LEADS_DB: db,
    CREATIVE_ASSETS: { async get(key) { return objects.get(key) || null; } },
    CF_ACCESS_TEAM_DOMAIN: "riverways.cloudflareaccess.com",
    CF_ACCESS_AUD: "staff-aud",
    STUDIO_WORKER_AUD: "worker-aud",
    STUDIO_CLIENT_AUD: "client-aud",
    STUDIO_ALLOWED_EMAILS: "operator@riverways.example"
  };
}

async function send(db, path, { method = "GET", body, token } = {}) {
  const headers = { Origin: "https://riverwayse.com", "Cf-Access-Jwt-Assertion": token };
  if (body !== undefined) headers["content-type"] = "application/json";
  const request = new Request("https://riverwayse.com/api/studio/" + path, {
    method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  return onRequest({ request, env: environment(db) });
}

before(async () => {
  const pair = await crypto.subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5", modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"
  }, true, ["sign", "verify"]);
  privateKey = pair.privateKey;
  publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  publicJwk.kid = "portal-test";
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [publicJwk] }), {
    status: 200, headers: { "content-type": "application/json" }
  });
});

after(() => { globalThis.fetch = originalFetch; });

test("client portal requires an active membership for the exact client on every request", async () => {
  const db = makeDb();
  const token = await clientToken();
  const allowed = await send(db, "portal/assets?clientId=" + clientA, { token });
  assert.equal(allowed.status, 200);
  const denied = await send(db, "portal/assets?clientId=" + clientB, { token });
  assert.equal(denied.status, 403);

  const fileAllowed = await send(db, "portal/assets/" + assetA + "/file", { token });
  assert.equal(fileAllowed.status, 200);
  assert.equal(await fileAllowed.text(), "asset-a-bytes");
  const fileDenied = await send(db, "portal/assets/" + assetB + "/file", { token });
  assert.equal(fileDenied.status, 403);

  db.memberships.get(clientA + ":reviewer-a@example.com").status = "revoked";
  const revoked = await send(db, "portal/assets?clientId=" + clientA, { token });
  assert.equal(revoked.status, 403);
});

test("client review is append-only, bound to the exact asset hash and separate from agency asset status", async () => {
  const db = makeDb();
  const token = await clientToken();
  const stale = await send(db, "portal/assets/" + assetA + "/review", {
    method: "POST", token,
    body: { decision: "approved", assetSha256: "b".repeat(64), notes: "Looks good" }
  });
  assert.equal(stale.status, 409);
  const accepted = await send(db, "portal/assets/" + assetA + "/review", {
    method: "POST", token,
    body: { decision: "changes_requested", assetSha256: digest, notes: "Revise the opening frame" }
  });
  assert.equal(accepted.status, 201);
  assert.equal(db.reviews.length, 1);
  assert.equal(db.assets.get(assetA).status, "generated");
  assert.equal(db.audits.length, 1);
});

test("client comments are tenant-scoped and persisted as reviewer feedback", async () => {
  const db = makeDb();
  const token = await clientToken();
  const denied = await send(db, "portal/assets/" + assetB + "/comments", {
    method: "POST", token, body: { comment: "Should not cross clients" }
  });
  assert.equal(denied.status, 403);
  const added = await send(db, "portal/assets/" + assetA + "/comments", {
    method: "POST", token, body: { comment: "Please increase contrast" }
  });
  assert.equal(added.status, 201);
  const listed = await send(db, "portal/assets/" + assetA + "/comments", { token });
  assert.equal(listed.status, 200);
  assert.equal((await listed.json()).comments[0].comment, "Please increase contrast");
});
