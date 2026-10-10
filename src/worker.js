import { onRequest as contactMethodNotAllowed, onRequestPost } from "../functions/api/contact.js";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' mailto:; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self'; upgrade-insecure-requests",
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function notFound() {
  return Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" || url.pathname === "/api/contact/") {
      const response = request.method === "POST"
        ? await onRequestPost({ request, env })
        : await contactMethodNotAllowed({ request, env });
      return withSecurityHeaders(response);
    }

    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(notFound());
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response);
  },
};
