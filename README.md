# Riverwayse Website

A responsive, conversion-focused agency website built with React and Vite. It introduces Riverwayse's demand-led growth approach, services, Demand Intelligence workflow, operating method, FAQs and consultation brief.

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Project structure

- `src/App.jsx` — page sections and interactive components.
- `src/styles.css` — responsive design system, animation and reduced-motion handling.
- `index.html` — metadata, social sharing tags and Organization JSON-LD.
- `public/robots.txt` and `public/sitemap.xml` — crawler files.
- `functions/api/contact.js` — validated enquiry endpoint for Cloudflare Pages.
- `migrations/0001_leads.sql` — lead storage and rate-limit tables.
- `tests/api/contact.test.js` — API validation and duplicate-submission tests.
- `netlify.toml` — SPA fallback and baseline response security headers.
- `docs/ARCHITECTURE.md` — architecture and future integration plan.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Confirm the public contact email. The enquiry form posts to a Cloudflare Pages Function at `/api/contact`. Before production use, configure the D1 binding and Resend variables documented in `docs/ENQUIRY-OPERATIONS.md` and verify a controlled submission.
3. Add a privacy notice and consent-aware analytics only after selecting relevant providers.
4. Configure the server-side enquiry endpoint, D1 migration and Resend notification; follow `docs/ENQUIRY-OPERATIONS.md`.
5. Test CSP and security headers on the actual hosting provider.
6. Review all claims, service descriptions, imagery and brand details with Riverwayse.
7. Run `npm run build` and `npm run test:api`, then run browser accessibility/performance checks on the deployment preview.

## Current scope

The Demand Intelligence section explains the workflow and user experience. Real-time global social listening, lead qualification, notifications and CRM follow-up require selected data sources, a backend, credentials and compliance review; these integrations are not represented as already connected.
