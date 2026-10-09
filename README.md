# River Ways Website

A responsive, conversion-focused agency website built with React and Vite. It introduces River Ways's demand-led growth approach, services, Demand Intelligence workflow, operating method, FAQs and consultation brief.

## Run locally

```bash
npm install
npm run dev
```

Build, test and preview:

```bash
npm test
npm run build
npm run preview
```

Deploy using the configured Cloudflare Worker after checking the preview and release gates:

```bash
npm run deploy
```

## Project structure

- `src/App.jsx` — page sections, accessible workflow tabs and the secure enquiry UI.
- `src/GrowthDiagnostic.jsx` — client-side growth readiness diagnostic; responses are not submitted or stored.
- `src/styles.css` — responsive design system, animation and reduced-motion handling.
- `index.html` — metadata, canonical/social sharing tags and Organization JSON-LD.
- `src/worker.js` — Cloudflare Worker entry point, security headers and contact API.
- `src/contact-validation.js` — server-side contact input validation.
- `wrangler.jsonc` — Worker/static asset routing configuration.
- `public/robots.txt` and `public/sitemap.xml` — initial crawler files.
- `netlify.toml` — SPA fallback and baseline response security headers.
- `docs/ARCHITECTURE.md` — architecture and future integration plan.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Confirm the public contact email. The current enquiry form uses a `mailto:` draft as a no-backend fallback; it does not transmit data directly.
3. Add a privacy notice and consent-aware analytics only after selecting relevant providers.
4. Replace the mailto flow with a secured server-side form endpoint if direct submission, spam protection, storage or CRM integration is required.
5. Test CSP and security headers on the actual hosting provider.
6. Review all claims, service descriptions, imagery and brand details with River Ways.
7. Run CI and accessibility/performance checks on the deployment preview.

## Current scope

The Demand Intelligence section explains the workflow and user experience. Real-time global social listening, lead qualification, notifications and CRM follow-up require selected data sources, a backend, credentials and compliance review; these integrations are not represented as already connected.


## Secure contact pipeline

The direct enquiry endpoint requires Cloudflare Turnstile and a configured Resend sender identity. Until the site key and Worker secrets are configured, the website shows the email fallback and the API fails closed rather than pretending to submit an enquiry.

Follow [the contact pipeline setup guide](docs/CONTACT_PIPELINE_SETUP.md) before enabling live submission. Resend sender verification can require DNS records; do not modify existing DNS, DNSSEC or email records without a separately approved plan.

## Before a production cutover

The Cloudflare Worker implementation is being tested separately. Verify Worker build/deploy behavior, response headers, privacy notice, form delivery, accessibility and the preview URL before attaching the production domain. Preserve existing DNS and mail configuration during routine app changes.
