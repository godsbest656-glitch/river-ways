# River Ways website

The public River Ways website is a React 18 + Vite 6 experience for the Creative Demand Engineering agency. It follows the approved SHAPED CURRENT / Route 2 — Editorial Intelligence direction and uses the positioning **We engineer demand.**

## Run locally

```bash
npm install
npm run dev
```

## Build and verify

```bash
npm run build
npm run test:api
npm run test:portfolio
npm run test:lighthouse
npm run validate:portfolio
python scripts/validate_migrations.py
```

Browser and accessibility checks require the Playwright Chromium browser:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite tests desktop and mobile Chromium journeys against the generated static output and runs axe accessibility scans on key routes. Lighthouse CI measures mobile performance, accessibility, best practices and SEO on six important routes. Reports are stored locally and retained as private GitHub Actions artifacts for seven days; they are not uploaded to public Lighthouse storage. Automated scans do not replace manual WCAG 2.2 AA review. CI installs Chromium and runs the full suite on topic-branch pushes.

## Architecture

- `src/App.jsx` and `src/styles.css` — React homepage, interactions and visual system.
- `src/portfolio/` — canonical project records, validation, selectors and reusable portfolio components.
- `scripts/generate-static-pages.mjs` — build-time generation of About, Services, Work, project detail, Contact, Insights and Terms pages.
- `scripts/validate-static-pages.mjs` — route output, metadata, sitemap, 404 and internal-link checks.
- `public/growth-diagnostic/`, `public/field-guide/`, `public/privacy/` — maintained static experiences and notice.
- `functions/api/contact.js` — validated same-origin enquiry endpoint.
- `migrations/0001_leads.sql` through `0003_lead_operations.sql` — UUID lead storage, attribution and operational follow-up schema.
- `docs/design/` — master design, architecture, project skills and acceptance gates.
- `docs/ops/PRODUCTION_ENVIRONMENT_CHECKLIST.md` — Cloudflare D1, Resend and release-readiness requirements.

## Important operational boundaries

- The portfolio currently contains illustrative capability studies and River Ways-owned demonstrations; do not imply they are commissioned client case studies or verified client outcomes.
- The Growth Diagnostic keeps answers and scores in the browser. Only the approved journey/engagement identifiers and source attribution may accompany the enquiry handoff.
- D1 migrations are validated locally in CI, but this does not mean they have been applied to Cloudflare Preview or Production.
- Resend provider acceptance does not prove inbox delivery.
- No production deployment, DNS change, production D1 migration or secret change is authorised by a passing build or test run.
- Open a pull request only when the owner authorises a Preview review, because PR activity triggers automatic Cloudflare Preview deployment.
