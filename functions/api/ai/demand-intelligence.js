const MAX_BODY_BYTES = 6_000;
const MAX_FIELD = 1_200;
const DEFAULT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DAILY_LIMIT = 5;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function clean(value, max = MAX_FIELD) {
  return typeof value === "string"
    ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max)
    : "";
}

async function hash(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseModelResponse(result) {
  const raw = typeof result?.response === "string" ? result.response : "";
  if (!raw) throw new Error("empty_model_response");
  const candidate = raw.trim().replace(/^\uFEFF/, "");
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("invalid_model_response");
  const value = JSON.parse(candidate.slice(start, end + 1));
  const text = (input, max = 500) => typeof input === "string" ? input.trim().slice(0, max) : "";
  const list = (input, maxItems, mapper) => Array.isArray(input) ? input.slice(0, maxItems).map(mapper) : [];
  return {
    headline: text(value.headline, 120) || "A starting point for clearer demand",
    summary: text(value.summary, 900),
    observations: list(value.observations, 4, (item) => ({
      point: text(item?.point, 240),
      basis: text(item?.basis, 240),
      confidence: ["low", "medium"].includes(item?.confidence) ? item.confidence : "low",
    })).filter((item) => item.point),
    priorities: list(value.priorities, 3, (item) => ({
      action: text(item?.action, 180),
      rationale: text(item?.rationale, 280),
      effort: ["small", "medium", "large"].includes(item?.effort) ? item.effort : "medium",
    })).filter((item) => item.action),
    questions: list(value.questions, 3, (item) => text(item, 220)).filter(Boolean),
    limitations: text(value.limitations, 500) || "This is an initial assessment based only on the information supplied, not an independently verified audit.",
  };
}

export async function onRequestGet() {
  return new Response(null, {
    status: 405,
    headers: { allow: "POST, OPTIONS", "cache-control": "no-store" },
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  const requestUrl = new URL(request.url);
  if (origin) {
    try {
      if (new URL(origin).origin !== requestUrl.origin) return json({ error: "Request origin is not allowed." }, 403);
    } catch {
      return json({ error: "Request origin is not allowed." }, 403);
    }
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ error: "Expected a JSON request." }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);
  let raw;
  try {
    raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);
  } catch {
    return json({ error: "Could not read the request." }, 400);
  }
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid request." }, 400);

  const business = clean(body.business, 160);
  const website = clean(body.website, 240);
  const market = clean(body.market, 160);
  const challenge = clean(body.challenge, 1_200);
  const goal = clean(body.goal, 240);
  if (!business || !market || !challenge) {
    return json({ error: "Add your business, market and main growth challenge to continue." }, 400);
  }
  if (website && !/^(https?:\/\/)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/[^\s]*)?$/i.test(website)) {
    return json({ error: "Enter a valid public website address, or leave it blank." }, 400);
  }

  // The model is opt-in at deployment time. No inference occurs until the owner
  // has verified the binding, model availability, account limits and cost controls.
  if (env.AI_DEMAND_ENABLED !== "true") {
    return json({ error: "Demand Intelligence is being prepared. Please try again soon.", code: "feature_not_enabled" }, 503);
  }
  if (!env.AI || !env.LEADS_DB || !env.RATE_LIMIT_SALT || env.RATE_LIMIT_SALT.length < 32) {
    return json({ error: "Demand Intelligence is not fully configured yet.", code: "missing_runtime_configuration" }, 503);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await hash(ip + env.RATE_LIMIT_SALT);
  const dayKey = new Date().toISOString().slice(0, 10);
  try {
    // Keep only a short rolling window of salted usage hashes.
    const retentionFloor = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    await env.LEADS_DB.prepare("DELETE FROM ai_demand_usage WHERE day_key < ?").bind(retentionFloor).run();
    const quota = await env.LEADS_DB.prepare(
      "INSERT INTO ai_demand_usage (day_key, ip_hash, request_count, updated_at) VALUES (?, ?, 1, datetime('now')) ON CONFLICT(day_key, ip_hash) DO UPDATE SET request_count = request_count + 1, updated_at = datetime('now') WHERE request_count < ? RETURNING request_count"
    ).bind(dayKey, ipHash, DAILY_LIMIT).first();
    if (!quota) return json({ error: "You have reached today's diagnostic limit. Please contact River Ways if you need help sooner.", code: "daily_limit_reached" }, 429);
  } catch (error) {
    console.error("Demand diagnostic quota check failed", error instanceof Error ? error.message : "unknown error");
    return json({ error: "Demand Intelligence is temporarily unavailable.", code: "quota_check_failed" }, 503);
  }

  const system = [
    "You are River Ways Demand Intelligence, a careful business growth analyst.",
    "Produce a useful first-pass assessment from only the visitor-provided facts.",
    "Do not claim to have visited, crawled, measured, researched or verified a website or market.",
    "Do not invent competitors, market statistics, traffic, conversion rates, revenue, customer behaviour or performance.",
    "Separate supplied facts from hypotheses. Mark confidence low unless the input directly supports a point.",
    "Give practical, prioritised next steps. Ask useful questions where important context is missing.",
    "Return only valid JSON with keys: headline, summary, observations (array of {point,basis,confidence}), priorities (array of {action,rationale,effort}), questions (array of strings), limitations."
  ].join(" ");
  const user = [
    "Business: " + business,
    "Website: " + (website || "Not supplied"),
    "Market: " + market,
    "Growth objective: " + (goal || "Not specified"),
    "Main challenge: " + challenge,
    "Create a concise first-pass demand assessment. Make unknowns explicit."
  ].join("\n");

  try {
    const result = await env.AI.run(env.AI_MODEL || DEFAULT_MODEL, {
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      max_tokens: 1_000,
      temperature: 0.2,
    });
    const assessment = parseModelResponse(result);
    return json({ ok: true, assessment, generatedAt: new Date().toISOString(), source: "visitor-supplied-context" });
  } catch (error) {
    console.error("Demand Intelligence inference failed", error instanceof Error ? error.message : "unknown error");
    return json({ error: "We couldn't complete the assessment. Your information has not been saved; please try again later.", code: "inference_failed" }, 502);
  }
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { allow: "POST, OPTIONS", "cache-control": "no-store" } });
  if (request.method === "GET") return onRequestGet({ request, env });
  if (request.method === "POST") return onRequestPost({ request, env });
  return json({ error: "Method not allowed." }, 405);
}
