# River Ways — Website

A responsive, conversion-focused agency website for River Ways, positioned around creative demand engineering: connecting strategy, discovery, creative, digital experiences and business systems to help organisations create purposeful demand.

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
- `src/styles.css` — existing responsive styles.
- `src/shaped-current.css` — SHAPED CURRENT visual layer.
- `index.html` — metadata, social sharing tags and Organization JSON-LD.
- `public/robots.txt` and `public/sitemap.xml` — crawler files.
- `docs/design/` — design direction, resource library and evidence standards.
- `docs/ops/OPERATIONAL_READINESS.md` — operational gates and implementation sequence.

## Current implementation truth

- The site is a React + Vite frontend; production hosting and routing must be verified against the active deployment before changes.
- The enquiry form currently opens a prefilled email draft. It does **not** submit data to a server or store a lead.
- Server-side lead capture, durable storage, email notification, CRM handoff, automated follow-up and analytics are not claimed as live until each is implemented and end-to-end tested.
- Portfolio names, testimonials and performance claims require evidence and publication permission. Use `docs/design/CASE_STUDY_EVIDENCE_TEMPLATE.md` to record them.

## Before production release

1. Verify the active hosting configuration, canonical domain and deployment branch.
2. Implement and test secure server-side enquiry capture, persistence and notification.
3. Define lead ownership, response expectations and follow-up workflow.
4. Add privacy information and consent-aware analytics only after provider and data practices are selected.
5. Test the actual deployment preview for accessibility, responsive behavior, performance, headers, SEO and form behavior.
6. Confirm all public claims, imagery, client references and permissions.
7. Obtain explicit approval before merging or deploying to production.

A passing build is necessary but is not evidence that the live website or acquisition operations are ready.
