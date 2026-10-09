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
- `public/_headers` — Cloudflare Pages response security headers.
- `public/_redirects` — Cloudflare Pages single-page application fallback.
- `wrangler.toml` — Cloudflare Pages project/build-output configuration.
- `docs/ARCHITECTURE.md` — architecture and integration plan.
- `docs/CREATIVE-ENGINEERING-CONSTITUTION.md` — art-direction, content, accessibility, security and release standards.
- `netlify.toml` — retained legacy configuration; it is not the intended deployment target.

## Cloudflare Pages deployment

1. In Cloudflare, open **Workers & Pages** and create a Pages project connected to this GitHub repository.
2. Select `main` as the production branch only when the production launch is approved. Keep this feature branch for preview validation.
3. Use build command `npm run build` and output directory `dist`. No environment secrets are required for the current static build.
4. Enable preview deployments for branches/pull requests, then test the preview before merging or changing production routing.
5. Do not change DNS or detach the current live domain during the initial preview stage. Verify domain ownership, HTTPS, redirects and response headers before any cutover.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Confirm the public contact email. The current enquiry form uses a `mailto:` draft as a no-backend fallback; it does not transmit data directly.
3. Add a privacy notice and consent-aware analytics only after selecting relevant providers.
4. Replace the mailto flow with a secured server-side form endpoint if direct submission, spam protection, storage or CRM integration is required.
5. Test Content Security Policy and security headers on the actual Cloudflare preview; tighten directives if approved third-party services are added.
6. Review all claims, service descriptions, imagery and brand details with Riverwayse.
7. Run the build and accessibility/performance checks on the deployment preview.

## Current scope

The Demand Intelligence section explains the workflow and user experience. Real-time global social listening, lead qualification, notifications and CRM follow-up require selected data sources, a backend, credentials and compliance review; these integrations are not represented as already connected.
