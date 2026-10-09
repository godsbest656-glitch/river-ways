import { validateContactPayload } from './contact-validation.js';

const MAX_BODY_BYTES = 12_000;
const CONTACT_PATH = '/api/contact';

function secureHeaders(headers = new Headers()) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' mailto:; img-src 'self' data: https://images.unsplash.com https://challenges.cloudflare.com; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; upgrade-insecure-requests"
  );
  return headers;
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  const headers = secureHeaders(new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  }));
  return new Response(JSON.stringify(payload), { status, headers });
}

function secureAssetResponse(response) {
  const headers = secureHeaders(new Headers(response.headers));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function verifyTurnstile(token, secret, remoteIp) {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  if (!response.ok) return false;
  const result = await response.json().catch(() => null);
  return Boolean(result?.success);
}

async function sendContactEmail(env, payload) {
  const subjectValue = (payload.company || payload.name)
    .replace(/[\r\n\u0000-\u001f\u007f]/g, ' ')
    .slice(0, 120)
    .trim();

  const text = [
    'New enquiry from the River Ways website',
    '',
    'Name: ' + payload.name,
    'Email: ' + payload.email,
    'Company / brand: ' + (payload.company || 'Not provided'),
    'Primary goal: ' + payload.goal,
    '',
    'Context:',
    payload.details || 'Not provided',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: payload.email,
      subject: 'Website enquiry — ' + subjectValue,
      text,
    }),
  });

  if (!response.ok) {
    // Do not expose provider response bodies or credentials to the browser.
    return false;
  }
  const result = await response.json().catch(() => null);
  return Boolean(result?.id);
}

async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, message: 'Use POST to submit an enquiry.' }, 405, {
      Allow: 'POST',
    });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowedOrigins = new Set([
    requestUrl.origin,
    ...(env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
  ]);

  if (!origin || !allowedOrigins.has(origin)) {
    return jsonResponse({ ok: false, message: 'This request could not be verified.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, message: 'Send the enquiry as JSON.' }, 415);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: 'The enquiry is too large. Please shorten it and try again.' }, 413);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: 'The enquiry is too large. Please shorten it and try again.' }, 413);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, message: 'The enquiry could not be read. Please review it and try again.' }, 400);
  }

  // Honeypot submissions are quietly discarded without sending an email.
  if (typeof body?.website_confirm === 'string' && body.website_confirm.trim()) {
    return jsonResponse({ ok: true, message: 'Your enquiry has been received.' }, 202);
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return jsonResponse({ ok: false, message: validation.message }, 400);
  }

  // Fail closed until all required provider bindings and secrets are configured.
  if (!env.RESEND_API_KEY || !env.RESEND_API_KEY.trim()
    || !env.CONTACT_FROM || !env.CONTACT_FROM.trim()
    || !env.CONTACT_TO || !env.CONTACT_TO.trim()
    || !env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_SECRET_KEY.trim()) {
    return jsonResponse({
      ok: false,
      code: 'CONTACT_NOT_CONFIGURED',
      message: 'Direct enquiry submission is not available yet. Please use the email option below.',
    }, 503);
  }

  if (typeof body.turnstileToken !== 'string' || !body.turnstileToken.trim()) {
    return jsonResponse({ ok: false, message: 'Complete the verification step before submitting.' }, 400);
  }

  let verified = false;
  try {
    verified = await verifyTurnstile(
      body.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('CF-Connecting-IP') || ''
    );
  } catch {
    return jsonResponse({ ok: false, message: 'Verification is temporarily unavailable. Please try again.' }, 503);
  }

  if (!verified) {
    return jsonResponse({ ok: false, message: 'Verification expired or failed. Please complete it again.' }, 400);
  }

  try {
    const delivered = await sendContactEmail(env, validation.value);
    if (!delivered) {
      return jsonResponse({
        ok: false,
        message: 'We could not deliver the enquiry right now. Please use the email option below.',
      }, 502);
    }
  } catch {
    return jsonResponse({
      ok: false,
      message: 'We could not deliver the enquiry right now. Please use the email option below.',
    }, 502);
  }

  return jsonResponse({
    ok: true,
    message: 'Thanks — your enquiry has been sent to River Ways.',
  }, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === CONTACT_PATH) {
      return handleContact(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ ok: false, message: 'This endpoint does not exist.' }, 404);
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return jsonResponse({ ok: false, message: 'The website asset service is not available.' }, 503);
    }

    return secureAssetResponse(await env.ASSETS.fetch(request));
  },
};
