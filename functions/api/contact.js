const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

const MAX_LENGTHS = { name: 120, email: 254, company: 160, goal: 180, details: 4000 };
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sendNotification(env, lead) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.LEAD_NOTIFICATION_EMAIL) {
    return "not_configured";
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: "Bearer " + env.RESEND_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [env.LEAD_NOTIFICATION_EMAIL],
        subject: "New River Ways enquiry — " + lead.companyOrName,
        text: [
          "A new project enquiry was submitted through riverwayse.com.",
          "",
          "Name: " + lead.name,
          "Email: " + lead.email,
          "Company: " + (lead.company || "Not provided"),
          "Goal: " + lead.goal,
          "",
          "Context:",
          lead.details || "Not provided",
          "",
          "Lead ID: " + lead.id
        ].join("\n")
      })
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.LEADS_DB) {
    return json(503, { ok: false, message: "Enquiry service is temporarily unavailable. Please email akinsify0511@gmail.com." });
  }
  if (!env.RATE_LIMIT_SALT || env.RATE_LIMIT_SALT.length < 32) {
    return json(503, { ok: false, message: "Enquiry service is temporarily unavailable. Please email akinsify0511@gmail.com." });
  }

  let payload;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json(415, { ok: false, message: "Please submit the form using this page." });
    }
    const raw = await request.text();
    if (raw.length > 12000) return json(413, { ok: false, message: "Your brief is too long. Please shorten it and try again." });
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, message: "We couldn't read that submission. Please review the form and try again." });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json(400, { ok: false, message: "We couldn't read that submission. Please review the form and try again." });
  }

  // Quietly discard automated submissions caught by the honeypot.
  if (clean(payload.website, 200)) return json(202, { ok: true, message: "Thank you. Your enquiry has been received." });

  const lead = {
    name: clean(payload.name, MAX_LENGTHS.name),
    email: clean(payload.email, MAX_LENGTHS.email).toLowerCase(),
    company: clean(payload.company, MAX_LENGTHS.company),
    goal: clean(payload.goal, MAX_LENGTHS.goal),
    details: clean(payload.details, MAX_LENGTHS.details)
  };

  if (!lead.name || !validEmail(lead.email) || !lead.goal) {
    return json(422, { ok: false, message: "Add your name, a valid email address and a goal so we can route your enquiry." });
  }
  if (lead.name.length < 2 || /[\u0000-\u001f]/.test(lead.name) || /[\u0000-\u001f]/.test(lead.company + lead.goal + lead.details)) {
    return json(422, { ok: false, message: "Please remove unusual control characters and check your details." });
  }

  const now = Date.now();
  const windowStart = new Date(Math.floor(now / RATE_WINDOW_MS) * RATE_WINDOW_MS).toISOString();
  const clientAddress = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = await sha256(env.RATE_LIMIT_SALT + ":" + clientAddress);
  try {
    const rate = await env.LEADS_DB.prepare(
      "INSERT INTO lead_rate_limits (ip_hash, window_start, count) VALUES (?, ?, 1) ON CONFLICT(ip_hash, window_start) DO UPDATE SET count = count + 1 RETURNING count"
    ).bind(ipHash, windowStart).first();
    if (!rate || rate.count > RATE_LIMIT) {
      return json(429, { ok: false, message: "Too many attempts in a short period. Please wait a little and try again." });
    }
  } catch {
    return json(503, { ok: false, message: "Enquiry service is temporarily unavailable. Please email akinsify0511@gmail.com." });
  }

  const briefHash = await sha256(JSON.stringify([lead.name.toLowerCase(), lead.email, lead.company.toLowerCase(), lead.goal.toLowerCase(), lead.details]));
  const duplicateCutoff = new Date(now - DUPLICATE_WINDOW_MS).toISOString();
  let record;
  try {
    record = await env.LEADS_DB.prepare(
      "SELECT id, notification_status FROM leads WHERE email = ? AND brief_hash = ? AND created_at >= ? ORDER BY created_at DESC LIMIT 1"
    ).bind(lead.email, briefHash, duplicateCutoff).first();

    if (!record) {
      const id = crypto.randomUUID();
      const createdAt = new Date(now).toISOString();
      await env.LEADS_DB.prepare(
        "INSERT INTO leads (id, name, email, company, goal, details, brief_hash, notification_status, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)"
      ).bind(id, lead.name, lead.email, lead.company, lead.goal, lead.details, briefHash, ipHash, createdAt).run();
      record = { id, notification_status: "pending" };
    }
  } catch {
    return json(503, { ok: false, message: "We couldn't save your enquiry just now. Please email akinsify0511@gmail.com." });
  }

  // Retry notification for a recent duplicate only when the original handoff did not succeed.
  let notificationStatus = record.notification_status;
  if (notificationStatus !== "sent") {
    notificationStatus = await sendNotification(env, {
      ...lead,
      id: record.id,
      companyOrName: lead.company || lead.name
    });
    try {
      await env.LEADS_DB.prepare("UPDATE leads SET notification_status = ?, notification_attempted_at = ? WHERE id = ?")
        .bind(notificationStatus, new Date().toISOString(), record.id).run();
    } catch {
      // The lead is already stored. Do not turn a successful save into a false submission failure.
    }
  }

  if (notificationStatus !== "sent") {
    return json(503, {
      ok: false,
      saved: true,
      message: "Your brief was saved, but we couldn't notify the team automatically. Please email akinsify0511@gmail.com and mention your website enquiry."
    });
  }

  return json(200, {
    ok: true,
    message: "Thank you. Your enquiry is with the River Ways team. We'll review the context and follow up by email.",
    reference: record.id
  });
}
