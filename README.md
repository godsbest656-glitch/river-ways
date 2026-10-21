# River Ways Website

A responsive, conversion-focused agency website built with React and Vite. It introduces River Ways' Demand Engineering approach, services, Demand Intelligence workflow, editorial field guide, and project enquiry flow.

## Run locally

```bash
npm install
npm run dev
```

Build and run the API checks:

```bash
npm run build
npm run test:api
npm run preview
```

## Project structure

- `src/App.jsx` — page sections, interactive workflow, and enquiry form.
- `src/styles.css` — responsive design system, motion, and reduced-motion handling.
- `index.html` — metadata, social sharing tags, and Organization JSON-LD.
- `public/_headers` and `public/_redirects` — Cloudflare Pages response headers and SPA fallback.
- `public/field-guide/index.html` — lightweight editorial Demand Engineering guide.
- `public/privacy/index.html` and `docs/PRIVACY-NOTICE.md` — public privacy notice and its source document.
- `functions/api/contact.js` — server-side enquiry validation, rate limiting, D1 persistence, and optional Resend notification.
- `migrations/0001_leads.sql`, `migrations/0002_campaign_attribution.sql`, and `migrations/0003_submission_idempotency.sql` — D1 enquiry schema and first-party campaign attribution.
- `tests/api/contact.test.js` — automated API validation and abuse-control tests.
- `docs/ARCHITECTURE.md` — system architecture and integration plan.
- `docs/DESIGN-CONSTITUTION.md` — editorial art direction and interface standards.

## Cloudflare Pages deployment

- Repository: `godsbest656-glitch/river-ways`.
- Build command: `npm run build`; output directory: `dist`; production branch: `main`.
- The `functions/api/contact.js` endpoint is a Pages Function at `/api/contact`. It is not ready to accept real enquiries until its D1 binding and required runtime secret are configured in the target Cloudflare environment.
- Do not put secrets in browser-exposed variables prefixed with `VITE_`.
- Preview the feature branch and verify response headers, redirects, the field guide, privacy page, and contact endpoint before any production promotion.

## Contact endpoint configuration

The endpoint intentionally returns a configuration error rather than storing an enquiry if the D1 database binding or a sufficiently strong rate-limit salt is missing.

1. Create or select the Cloudflare Pages project for the site. Keep the production branch set to `main`; test this feature branch as a preview.
2. Create a D1 database and apply `migrations/0001_leads.sql`, followed by `migrations/0002_campaign_attribution.sql` and `migrations/0003_submission_idempotency.sql`.
3. Add a D1 binding named `LEADS_DB` to the Pages Function environment. Configure preview and production bindings separately and verify each database target.
4. Add `RATE_LIMIT_SALT` as a secret containing a long, randomly generated value (at least 32 characters). Do not reuse a public value.
5. For email notifications, configure `RESEND_API_KEY` as a secret, `RESEND_FROM_EMAIL` as a verified sender, and `LEAD_NOTIFICATION_EMAIL` as the destination inbox. Without these three values, a saved enquiry is still recorded but no email notification is sent.
6. After changing a preview secret or binding, trigger a **new preview deployment** and test that new deployment's URL. Existing preview deployments may continue using their earlier configuration; a successful build alone does not prove the runtime secret is available.
7. Test valid and invalid submissions, cross-origin requests, oversized payloads, the honeypot, rate limiting, idempotent retries using the same submission key, and missing configuration. Confirm records are saved in D1 and notifications arrive when configured.
8. Set access controls and retention/deletion procedures before collecting real enquiries. Review Cloudflare and Resend account security and provider terms.

The endpoint stores a lead before attempting notification. Notification delivery problems do not delete a saved lead. Check the D1 `notification_status` field and Cloudflare logs during setup. The contact endpoint does not itself activate CRM, analytics, or social-listening integrations.

## Scope and launch checklist

- Demand Intelligence is currently a strategy and workflow experience; global social listening, automatic qualification, CRM sync, and alerts are not claimed to be live.
- Confirm the canonical production domain, brand naming, public email, and all service claims.
- Verify the privacy notice against actual retention, access, and provider settings.
- Run `npm run test:api` and `npm run build`, then validate desktop/mobile behavior, accessibility, performance, CSP, and response headers on a Cloudflare preview.
- Do not merge or promote to production until the preview, database bindings, sender identity, and enquiry path have been verified.
