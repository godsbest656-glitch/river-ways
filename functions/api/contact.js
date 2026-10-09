const MAX_BODY_BYTES = 12_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_GOALS = new Set([
  "Generate more qualified demand",
  "Improve search and AI visibility",
  "Increase website conversion",
  "Build a Demand Intelligence system",
  "Connect marketing and measurement",
  "Something else",
]);

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

function clean(value, max) {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max) : "";
}

async function hash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  const requestUrl = new URL(request.url);
  if (origin && new URL(origin).origin !== requestUrl.origin) return json({ error: "Request origin is not allowed." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ error: "Expected JSON request." }, 415);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);
  if (!env.LEADS_DB) return json({ error: "Enquiry service is not configured yet. Please email oluwafemi@riverwayse.com instead." }, 503);

  let raw;
  try {
    raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);
  } catch {
    return json({ error: "Could not read request." }, 400);
  }

  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: "Invalid request body." }, 400); }
  // Honeypot: acknowledge bots without storing or notifying anyone.
  if (clean(body.website, 200)) return json({ ok: true });
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const company = clean(body.company, 160);
  const goal = clean(body.goal, 100);
  const details = clean(body.details, 3000);
  if (!name || !EMAIL_RE.test(email) || !ALLOWED_GOALS.has(goal)) return json({ error: "Please provide your name, a valid email, and select a listed goal." }, 400);
  if (details.length > 3000) return json({ error: "Please shorten your project context." }, 400);

  // Hash the platform-provided client IP before using it for short-window rate limiting.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await hash(ip + (env.RATE_LIMIT_SALT || "riverways-contact-v1"));
  const now = new Date().toISOString();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  try {
    const recent = await env.LEADS_DB.prepare(
      "SELECT COUNT(*) AS total FROM leads WHERE ip_hash = ? AND created_at >= ?"
    ).bind(ipHash, since).first();
    if ((recent?.total || 0) >= 5) return json({ error: "Too many enquiries from this connection. Please try again later or email us directly." }, 429);

    const result = await env.LEADS_DB.prepare(
      "INSERT INTO leads (name, email, company, goal, details, source, ip_hash, created_at, notification_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
    ).bind(name, email, company || null, goal, details || null, "website-contact", ipHash, now).run();
    const leadId = result.meta?.last_row_id;

    let notificationStatus = "not_configured";
    if (env.RESEND_API_KEY && env.LEAD_NOTIFICATION_EMAIL && env.RESEND_FROM_EMAIL) {
      const mail = {
        from: env.RESEND_FROM_EMAIL,
        to: [env.LEAD_NOTIFICATION_EMAIL],
        subject: "New River Ways project enquiry",
        text: [
          "A new project enquiry was submitted through riverwayse.com.",
          "",
          "Name: " + name,
          "Email: " + email,
          "Company: " + (company || "Not provided"),
          "Goal: " + goal,
          "",
          "Context:",
          details || "Not provided",
          "",
          "Lead ID: " + (leadId ?? "recorded"),
        ].join("\n"),
        reply_to: email,
      };
      try {
        const mailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
          body: JSON.stringify(mail),
        });
        notificationStatus = mailResponse.ok ? "sent" : "failed";
      } catch {
        notificationStatus = "failed";
      }
      if (leadId != null) {
        await env.LEADS_DB.prepare("UPDATE leads SET notification_status = ? WHERE id = ?")
          .bind(notificationStatus, leadId).run();
      }
    }
    // A saved lead remains successful even if email notification is temporarily unavailable.
    return json({ ok: true, notification: notificationStatus });
  } catch (error) {
    console.error("Contact submission failed", error instanceof Error ? error.message : "unknown error");
    return json({ error: "We couldn't save your enquiry right now. Please try again or email oluwafemi@riverwayse.com." }, 503);
  }
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { allow: "POST, OPTIONS", "cache-control": "no-store" } });
  return json({ error: "Method not allowed." }, 405);
}
