const encoder = new TextEncoder();
let cachedKeys = null;
let cachedAt = 0;
let cachedDomain = null;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

function decodeBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function loadKeys(teamDomain, fetchImpl) {
  const now = Date.now();
  if (cachedKeys && cachedDomain === teamDomain && now - cachedAt < 5 * 60 * 1000) return cachedKeys;
  const response = await fetchImpl("https://" + teamDomain + "/cdn-cgi/access/certs", {
    headers: { accept: "application/json" }
  });
  if (!response.ok) throw new Error("Cloudflare Access signing keys are unavailable");
  const payload = await response.json();
  if (!Array.isArray(payload.keys) || payload.keys.length === 0) throw new Error("Cloudflare Access returned no signing keys");
  cachedKeys = payload.keys;
  cachedDomain = teamDomain;
  cachedAt = now;
  return cachedKeys;
}

export async function verifyAccessAssertion(assertion, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (typeof assertion !== "string" || assertion.length > 12000) return null;
  const teamDomain = String(env.CF_ACCESS_TEAM_DOMAIN || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const expectedAudiences = [env.CF_ACCESS_AUD, env.STUDIO_WORKER_AUD, env.STUDIO_CLIENT_AUD]
    .filter((value) => typeof value === "string" && value.trim());
  if (!teamDomain || expectedAudiences.length === 0) return null;

  const parts = assertion.split(".");
  if (parts.length !== 3) return null;
  let header, claims;
  try {
    header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || typeof header.kid !== "string") return null;
  if (claims.iss !== "https://" + teamDomain) return null;
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!expectedAudiences.some((audience) => audiences.includes(audience))) return null;
  const nowSeconds = Math.floor(now / 1000);
  if (!Number.isFinite(claims.exp) || claims.exp <= nowSeconds) return null;
  if (Number.isFinite(claims.nbf) && claims.nbf > nowSeconds + 60) return null;
  if (Number.isFinite(claims.iat) && claims.iat > nowSeconds + 60) return null;

  try {
    const keys = await loadKeys(teamDomain, fetchImpl);
    const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA");
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    }, false, ["verify"]);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      decodeBase64Url(parts[2]),
      encoder.encode(parts[0] + "." + parts[1])
    );
    return valid ? claims : null;
  } catch {
    return null;
  }
}

export async function requireStudioActor(request, env, { role = "staff", fetchImpl = fetch } = {}) {
  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  const claims = await verifyAccessAssertion(assertion, env, { fetchImpl });
  if (!claims) return { response: json(401, { ok: false, error: "authentication_required" }) };

  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (role === "worker") {
    if (!env.STUDIO_WORKER_AUD || !audiences.includes(env.STUDIO_WORKER_AUD)) {
      return { response: json(403, { ok: false, error: "worker_access_required" }) };
    }
    return { actor: { id: String(claims.common_name || claims.email || "creative-worker"), role: "worker" } };
  }

  if (role === "client") {
    if (!env.STUDIO_CLIENT_AUD || !audiences.includes(env.STUDIO_CLIENT_AUD)) {
      return { response: json(403, { ok: false, error: "client_access_required" }) };
    }
    const email = String(claims.email || "").trim().toLowerCase();
    if (!email) return { response: json(403, { ok: false, error: "client_identity_required" }) };
    return { actor: { id: email, email, role: "client_reviewer" } };
  }

  if (!env.CF_ACCESS_AUD || !audiences.includes(env.CF_ACCESS_AUD)) {
    return { response: json(403, { ok: false, error: "staff_access_required" }) };
  }
  const email = String(claims.email || "").trim().toLowerCase();
  const allowed = String(env.STUDIO_ALLOWED_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (!email || !allowed.includes(email)) return { response: json(403, { ok: false, error: "studio_access_denied" }) };
  return { actor: { id: email, role: "staff" } };
}

export { json };
