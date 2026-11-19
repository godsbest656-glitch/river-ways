import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { requireStudioActor } from "../../functions/api/studio/_auth.js";

const originalFetch = globalThis.fetch;
let privateKey;
let publicJwk;

function b64url(value) {
  return Buffer.from(value).toString("base64url");
}

async function token(audience, email = "reviewer@example.com") {
  const header = b64url(JSON.stringify({ alg: "RS256", kid: "studio-auth-test" }));
  const claims = b64url(JSON.stringify({
    iss: "https://riverways.cloudflareaccess.com",
    aud: audience,
    email,
    exp: Math.floor(Date.now() / 1000) + 300,
    iat: Math.floor(Date.now() / 1000)
  }));
  const input = header + "." + claims;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(input));
  return input + "." + b64url(signature);
}

function request(assertion) {
  return new Request("https://riverwayse.com/api/studio/portal/clients", {
    headers: { "Cf-Access-Jwt-Assertion": assertion }
  });
}

const env = {
  CF_ACCESS_TEAM_DOMAIN: "riverways.cloudflareaccess.com",
  CF_ACCESS_AUD: "staff-aud",
  STUDIO_WORKER_AUD: "worker-aud",
  STUDIO_CLIENT_AUD: "client-aud",
  STUDIO_ALLOWED_EMAILS: "operator@riverways.example"
};

before(async () => {
  const pair = await crypto.subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  }, true, ["sign", "verify"]);
  privateKey = pair.privateKey;
  publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  publicJwk.kid = "studio-auth-test";
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [publicJwk] }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
});

after(() => { globalThis.fetch = originalFetch; });

test("client reviewer identity requires the dedicated client Access audience", async () => {
  const staffToken = await token("staff-aud");
  const denied = await requireStudioActor(request(staffToken), env, { role: "client" });
  assert.equal(denied.response.status, 403);

  const clientToken = await token("client-aud", "  REVIEWER@Example.com ");
  const allowed = await requireStudioActor(request(clientToken), env, { role: "client" });
  assert.equal(allowed.actor.id, "reviewer@example.com");
  assert.equal(allowed.actor.role, "client_reviewer");
});

test("staff access requires the staff audience and allowlisted email", async () => {
  const clientToken = await token("client-aud", "operator@riverways.example");
  const denied = await requireStudioActor(request(clientToken), env, { role: "staff" });
  assert.equal(denied.response.status, 403);

  const staffToken = await token("staff-aud", "not-allowlisted@example.com");
  const deniedEmail = await requireStudioActor(request(staffToken), env, { role: "staff" });
  assert.equal(deniedEmail.response.status, 403);
});

test("worker identity cannot use staff or client roles", async () => {
  const workerToken = await token("worker-aud", "operator@riverways.example");
  const staff = await requireStudioActor(request(workerToken), env, { role: "staff" });
  const client = await requireStudioActor(request(workerToken), env, { role: "client" });
  assert.equal(staff.response.status, 403);
  assert.equal(client.response.status, 403);
});
