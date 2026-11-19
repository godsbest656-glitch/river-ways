import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../../functions/api/studio/[[path]].js";

const originalFetch = globalThis.fetch;
let privateKey;
let publicJwk;

function b64url(value) { return Buffer.from(value).toString("base64url"); }

async function staffToken() {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "reviewer-test" }));
  const claims = b64url(JSON.stringify({
    iss: "https://riverways.cloudflareaccess.com",
    aud: "staff-aud",
    email: "operator@riverways.example",
    exp: Math.floor(Date.now() / 1000) + 300,
    iat: Math.floor(Date.now() / 1000)
  }));
  const input = header + "." + claims;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(input));
  return input + "." + b64url(signature);
}

function makeDb() {
  const clientId = "00000000-0000-4000-8000-000000000001";
  const otherClientId = "00000000-0000-4000-8000-000000000002";
  const clients = new Map([
    [clientId, { id: clientId, status: "active" }],
    [otherClientId, { id: otherClientId, status: "active" }]
  ]);
  const memberships = new Map();
  const audits = [];
  function statement(sql, values = []) {
    return {
      bind(...args) { return statement(sql, args); },
      async first() {
        if (sql.includes("FROM creative_clients WHERE id = ? AND status = 'active'")) {
          return clients.get(values[0]) || null;
        }
        return null;
      },
      async all() {
        if (sql.includes("FROM creative_client_memberships WHERE client_id = ?")) {
          return { results: [...memberships.values()].filter((item) => item.client_id === values[0]) };
        }
        return { results: [] };
      },
      async run() {
        if (sql.startsWith("INSERT INTO creative_client_memberships")) {
          const [id, client_id, email, invited_by, created_at, updated_at] = values;
          if ([...memberships.values()].some((item) => item.client_id === client_id && item.email === email)) {
            throw new Error("unique membership conflict");
          }
          memberships.set(id, { id, client_id, email, role: "reviewer", status: "active", invited_by, created_at, updated_at });
          return { meta: { changes: 1 } };
        }
        if (sql.startsWith("UPDATE creative_client_memberships")) {
          const [updated_at, id, client_id] = values;
          const member = memberships.get(id);
          if (!member || member.client_id !== client_id || member.status !== "active") return { meta: { changes: 0 } };
          Object.assign(member, { status: "revoked", updated_at });
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
    clientId, otherClientId, memberships, audits,
    prepare(sql) { return statement(sql); }
  };
}

function environment(db) {
  return {
    LEADS_DB: db,
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
  publicJwk.kid = "reviewer-test";
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [publicJwk] }), {
    status: 200, headers: { "content-type": "application/json" }
  });
});

after(() => { globalThis.fetch = originalFetch; });

test("staff can add, list and revoke a client reviewer without deleting membership history", async () => {
  const db = makeDb();
  const token = await staffToken();
  const path = "clients/" + db.clientId + "/reviewers";
  const added = await send(db, path, {
    method: "POST", token, body: { email: "  REVIEWER@Example.com " }
  });
  assert.equal(added.status, 201);
  const reviewer = (await added.json()).reviewer;
  assert.equal(reviewer.email, "reviewer@example.com");
  assert.equal(reviewer.role, "reviewer");
  assert.equal(reviewer.status, "active");

  const listed = await send(db, path, { token });
  assert.equal(listed.status, 200);
  assert.equal((await listed.json()).reviewers.length, 1);

  const revoked = await send(db, path + "/" + reviewer.id, { method: "DELETE", token });
  assert.equal(revoked.status, 200);
  assert.equal(db.memberships.get(reviewer.id).status, "revoked");

  const listedAgain = await send(db, path, { token });
  assert.equal((await listedAgain.json()).reviewers[0].status, "revoked");
  assert.equal(db.audits.length, 2);
});

test("reviewer management rejects invalid emails, duplicate memberships and cross-client revocation", async () => {
  const db = makeDb();
  const token = await staffToken();
  const path = "clients/" + db.clientId + "/reviewers";
  const invalid = await send(db, path, { method: "POST", token, body: { email: "not-an-email" } });
  assert.equal(invalid.status, 422);

  const first = await send(db, path, { method: "POST", token, body: { email: "reviewer@example.com" } });
  const reviewer = (await first.json()).reviewer;
  const duplicate = await send(db, path, { method: "POST", token, body: { email: "REVIEWER@example.com" } });
  assert.equal(duplicate.status, 409);

  const crossClient = await send(db, "clients/" + db.otherClientId + "/reviewers/" + reviewer.id, {
    method: "DELETE", token
  });
  assert.equal(crossClient.status, 404);
  assert.equal(db.memberships.get(reviewer.id).status, "active");
});

test("reviewer management requires staff authentication", async () => {
  const db = makeDb();
  const response = await send(db, "clients/" + db.clientId + "/reviewers", {});
  assert.equal(response.status, 401);
});
