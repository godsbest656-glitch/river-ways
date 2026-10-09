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
- `public/robots.txt` and `public/sitemap.xml` — initial crawler files.
- `public/_headers` and `public/_redirects` — Cloudflare Pages response headers and SPA fallback.
- `public/field-guide/index.html` — lightweight editorial Demand Engineering guide; static, accessible, and dependency-free.
- `netlify.toml` — retained for the existing Netlify configuration; Cloudflare Pages is the target hosting path.
- `docs/ARCHITECTURE.md` — architecture and future integration plan.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Confirm the public contact email. The current enquiry form uses a `mailto:` draft as a no-backend fallback; it does not transmit data directly.
3. Add a privacy notice and consent-aware analytics only after selecting relevant providers.
4. Replace the mailto flow with a secured server-side form endpoint if direct submission, spam protection, storage or CRM integration is required.
5. Deploy a preview on Cloudflare Pages and verify CSP, headers, redirects, and cache behavior in the browser/network panel.
6. Review all claims, service descriptions, imagery and brand details with Riverwayse.
7. Run CI and accessibility/performance checks on the deployment preview.

## Cloudflare Pages deployment

- Connect the `godsbest656-glitch/river-ways` repository to Cloudflare Pages.
- Build command: `npm run build`; output directory: `dist`; production branch: `main`.
- The `public/_headers` and `public/_redirects` files are copied into `dist` by Vite. Confirm the resulting deployed response headers and fallback behavior before promoting the deployment.
- Do not add secrets to Vite variables prefixed with `VITE_`; these are exposed to browser code. The current static site has no server-side lead endpoint.
- The contact form remains a `mailto:` draft. Durable lead storage, email delivery, CRM, global listening, and alerts are not live until their backend and provider configuration are implemented and tested.

## Current scope

The Demand Intelligence section explains the workflow and user experience. Real-time global social listening, lead qualification, notifications and CRM follow-up require selected data sources, a backend, credentials and compliance review; these integrations are not represented as already connected.
