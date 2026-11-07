# River Ways — Route Inventory and Static Page Generation

**Audit date:** 7 November 2026  
**Repository:** `godsbest656-glitch/river-ways`  
**Working branch:** `build/river-ways-execution`

## Verified current state before this increment

The repository did not contain a 12-page site or a React router. `src/` contained the homepage app and the portfolio module only. The following public page outputs existed:

| URL | Source | State |
|---|---|---|
| `/` | Vite React app | Existing homepage |
| `/growth-diagnostic/` | `public/growth-diagnostic/index.html` + `diagnostic.js` | Existing static experience |
| `/field-guide/` | `public/field-guide/index.html` | Existing static editorial page |
| `/privacy/` | `public/privacy/index.html` | Existing static privacy notice |
| Unknown paths | `public/404.html` | Cloudflare Pages fallback |

The source sitemap listed only those four indexable URLs. No About, Services, Work, project-detail, Contact, Insights or Terms pages existed. The homepage links to the Field Guide and Privacy page; the remaining route requirements were not implemented as separate pages.

## Target route patterns

The route plan contains 12 patterns, including the platform's genuine 404 fallback:

| # | Route pattern | Source/output |
|---:|---|---|
| 1 | `/` | Vite homepage |
| 2 | `/about/` | Generated static page |
| 3 | `/services/` | Generated static page |
| 4 | `/work/` | Generated project index |
| 5 | `/work/:slug/` | Generated detail page for each public portfolio record |
| 6 | `/contact/` | Generated contact page linking to the working homepage enquiry form |
| 7 | `/growth-diagnostic/` | Existing static experience |
| 8 | `/field-guide/` | Existing static editorial page |
| 9 | `/insights/` | Generated editorial page |
| 10 | `/privacy/` | Existing static privacy notice |
| 11 | `/terms/` | Generated website-use terms |
| 12 | Cloudflare Pages 404 fallback | Existing `404.html`, noindex |

The dynamic project route generates one concrete page for every public, published portfolio record. The sitemap therefore lists the actual project detail URLs in addition to the route patterns.

## Build architecture

- New pages are generated at build time by `scripts/generate-static-pages.mjs`.
- The generator reads the canonical portfolio source; it does not maintain a second hand-written project list.
- Shared static page styles and navigation behaviour live in `public/site-pages.css` and `public/site-pages.js`.
- The Work index filter and deterministic shuffle live in `public/work/work.js`.
- The build overwrites `dist/sitemap.xml` from the current public project records.
- `scripts/validate-static-pages.mjs` checks route outputs, canonical metadata, project detail pages, sitemap uniqueness, internal `href`/`src` references, static assets and the 404 fallback.
- Existing Growth Diagnostic, Field Guide and Privacy pages remain intact. No catch-all SPA rewrite is added; unknown paths must continue to resolve to the actual Cloudflare Pages 404 document.

## Truth and publication rules

- Capability studies are explicitly illustrative, not client case studies.
- Internal demonstrations are labelled as River Ways-owned work, not external client engagements.
- Client proof, results and testimonials are only rendered when their permission and evidence rules pass in the canonical portfolio model.
- The Contact page points to the existing homepage enquiry form; it does not create a second unverified form pipeline.
- Terms are a general website-use notice, not a substitute for a reviewed client services agreement; owner/legal review is required before production publication.

## Release boundary

The generator and route validation are part of the topic-branch build. This work does not configure Cloudflare, alter DNS, deploy a preview or publish production. HTTP status behaviour for the unknown-route fallback still requires a later preview/production-host verification.


## Current implementation on `build/river-ways-execution`

The baseline above describes the repository before route implementation. The current execution branch now contains:

- 11 generated HTML documents: About, Services, Work index, five project details, Contact, Insights and Terms.
- The homepage plus maintained Growth Diagnostic, Field Guide and Privacy documents.
- A 15-URL sitemap generated from the canonical public project records.
- Shared static-page header/footer, responsive CSS and navigation behavior.
- Work filters and deterministic shuffle powered by the canonical portfolio data.
- A route validator that checks generated outputs, canonical metadata, sitemap uniqueness, local asset references, internal links and the 404 document.
- Playwright desktop/mobile route checks against the generated output.

The 404 document is present and marked `noindex`. Its real unknown-route HTTP status still requires a Cloudflare Pages Preview check; Vite preview is not proof of Cloudflare routing behavior.

See [Implementation Status](./IMPLEMENTATION_STATUS_2026-11-07.md) for exact commit and CI evidence.
