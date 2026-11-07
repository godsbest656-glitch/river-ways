# River Ways — current codebase audit

**Audit date:** 7 November 2026  
**Repository:** https://github.com/godsbest656-glitch/river-ways  
**Audited integration branch:** `design/we-engineer-demand-homepage`  
**Exact audited head:** `653334925d2f8ce2dce793d4db82775b9703a6ac`  
**Audit type:** source, branch, route, integration, operational and release evidence review  
**Production changes:** none made by this audit

This report supersedes older status snapshots only for the facts explicitly rechecked below. Historical reports remain useful evidence but do not prove that local-only artifacts are present in the current GitHub repository.

## 1. Executive finding

The accessible GitHub source is a coherent React/Vite SHAPED CURRENT homepage with working-looking client/server enquiry code, a Growth Diagnostic, Field Guide, Privacy document and a custom 404. It is **not yet the complete intended website or a verified operational release**.

The highest-risk gaps are not a lack of another design concept. They are:
1. the separate local route/prerender candidate is not present in the accessible repository;
2. the portfolio foundation and media governance packages are reported as locally verified but are not present on a remote branch;
3. the current branch's enquiry service has not passed Preview configuration, D1 persistence and real notification checks;
4. PR #24's stronger idempotency and browser-test work is not integrated and its schema cannot be copied directly;
5. the current homepage has no distinct service, work, about, insights or contact route documents;
6. the user-approved centred editorial hero treatment exists in a separate PR based on an older branch and has not been ported to the current integration branch.

Do not restart the project, select a new design route, replace React/Vite, or merge entire overlapping branches. Reconcile the existing work.

## 2. Source of truth and repository topology

### Verified repository facts
- Repository: `godsbest656-glitch/river-ways`.
- `main` was observed at `a3a1abc95270c30d4f86062b03a6f37b816cad15`.
- PR #32's current branch is `design/we-engineer-demand-homepage`, audited at `653334925d2f8ce2dce793d4db82775b9703a6ac`.
- PR #32 is open and draft, targets `main`, and is the consolidated SHAPED CURRENT implementation path.
- The root instructions and `docs/design/RIVER_WAYS_MASTER_DESIGN.md` establish SHAPED CURRENT / Route 2 — Editorial Intelligence, Creative Demand Engineering and “We engineer demand.” as the governing direction.

### Relevant open PRs

| PR | Head / base | Verified scope and decision |
|---|---|---|
| [#32](https://github.com/godsbest656-glitch/river-ways/pull/32) | `design/we-engineer-demand-homepage` → `main` | Consolidated visual/product branch. Keep as the integration anchor; do not merge until release and local-candidate reconciliation is complete. |
| [#34](https://github.com/godsbest656-glitch/river-ways/pull/34) | `feat/qualified-enquiry-handoff` → PR #32 branch | Adds same-origin checks, exact JSON content type, minimal journey handoff and truthful saved-but-not-notified responses. Candidate for careful integration after API regression review. |
| [#44](https://github.com/godsbest656-glitch/river-ways/pull/44) | `docs/photography-candidate-a-provenance` → PR #32 branch | Candidate A photography provenance documentation only. It does not integrate the local photography checkpoint or authorize publication. |
| [#45](https://github.com/godsbest656-glitch/river-ways/pull/45) | `feat/avenize-ecosystem-introduction` → PR #32 branch | Separate public Avenize introduction. Explicitly in development, not a generally available product. Keep distinct from core River Ways agency services and portfolio proof. |
| [#46](https://github.com/godsbest656-glitch/river-ways/pull/46) | `build/agent-resource-foundation` → PR #32 branch | AI development resources and skill validation. Project skill CI passed. Its existing PR event triggered the repository's automatic preview workflow; see Section 9. |
| [#24](https://github.com/godsbest656-glitch/river-ways/pull/24) | `feat/ads-gate-readiness` → `main` | Older operational release foundation with D1, lead operations and Playwright E2E. Valuable source material, but its integer-ID schema differs from PR #32's UUID schema. |
| [#30](https://github.com/godsbest656-glitch/river-ways/pull/30) | `feat/river-ways-ai-demand-intelligence` → PR #24 branch | Separate gated AI Demand Intelligence feature. Keep disabled pending explicit cost approval and Preview verification. |
| [#43](https://github.com/godsbest656-glitch/river-ways/pull/43) | `feat/ai-design-skills` → `design/shaped-current-rebuild` | Contains useful project skills and a centred editorial hero treatment, but is based on an older branch. Do not merge wholesale; port only relevant, reviewed changes. |

The PR topology is intentionally not a single linear history. Compare exact file changes and parent commits before integrating any stacked branch.

## 3. Application architecture observed on PR #32

### Stack and files
- React 18.3.1 and Vite 6.0.7.
- `lucide-react` 0.468.0.
- Plain CSS in `src/styles.css`.
- Main entry: `src/main.jsx` → `src/App.jsx`.
- Main page logic and homepage sections are concentrated in `src/App.jsx`; the stylesheet is a large shared file.
- No router dependency is present in the audited package manifest.
- The current package manifest has build/preview and Node API test scripts. It does not include Playwright or a browser-test script.
- No npm dependency was added by the AI resource foundation.

### Homepage structure
The current React homepage contains these section anchors:
`home`, `approach`, `services`, `studio`, `pathways`, `intelligence`, `method`, `principles`, `faq`, `contact`.

Navigation is primarily in-page anchor navigation. The current hero is a split two-column layout: proposition and actions on one side, interactive current/card visual on the other. The existing visual is built from HTML, CSS and inline SVG; pointer parallax is disabled for touch and reduced-motion users.

The homepage services array contains **seven** capability records: three featured and four compact. Three featured records use remote Unsplash image URLs. The three Creative Studio studies are hand-authored CSS/SVG compositions and are explicitly illustrative, not client case studies. The studies are not yet sourced from a shared portfolio dataset.

### User-approved hero reference
PR #43 contains the requested centred editorial composition with the existing interactive visual below the copy. It is based on `design/shaped-current-rebuild`, not the current PR #32 head. The current PR #32 already has the approved headline, so the safe port is the centred layout treatment and its responsive CSS—not the older branch's whole App, docs or design system. Preserve the current card interaction, content, CTA semantics and existing lower-page sections.

## 4. Verified route inventory

The audited PR #32 tree contains these distinct static documents:
- `/` — React homepage.
- `/growth-diagnostic/` — static diagnostic experience.
- `/field-guide/` — restored Demand Engineering Field Guide.
- `/privacy/` — privacy notice.
- `404.html` / `public/404.html` — branded not-found document.

The sitemap contains four indexable URLs: home, Growth Diagnostic, Field Guide and Privacy. `public/robots.txt` points to the sitemap. The public website does **not** currently contain separate route documents for Services, individual services, Work, case studies, About, Approach, Insights, Contact, Start a Project or Thank You.

The intended route architecture must be based on a verified route registry and actual built output. Do not add sitemap entries before the matching document exists. The separate local candidate reportedly had a mismatch of 12 sitemap URLs versus 10 built route documents plus 404; this remains unresolved because that branch is not present in the accessible GitHub repository.

## 5. Portfolio and media evidence

### Current repository reality
- No local `src/assets/` directory or portfolio media library was present in the audited tree.
- Service imagery is loaded from remote Unsplash URLs.
- The three Creative Studio capability studies are CSS/SVG illustrations, not client work.
- No canonical portfolio schema or shared project dataset is present in the audited PR #32 tree.
- No verified client case-study records are present in the audited tree.

### Prior isolated work — reported, not integrated
The previous handoff reports a Living Portfolio Foundation on local branch `arch/living-portfolio-foundation`, with exact head `608be0a725242150908959b84a6875b79d72c853`, original architecture commit `9bda5e590a9810f9d67587c62aa4700aad230cfe`, and a bundle named `living-portfolio-foundation.bundle`. Its report describes a canonical schema, selectors, frozen read source, validation, 25 portfolio tests and a no-UI architecture foundation. It was based on parent `56a6436678af8b3df2104c660ef685e501bafc5c`, which is behind the current PR #32 head. The report states it was not pushed.

The previous handoff also reports an isolated Media Manifest package from source commit `f94028be06efe74a0def9e12a66c128dd0e51e7e`, with a separate documentation-only verification commit `2a2088e`. The accepted decision was to keep it isolated and block production integration until its dependencies and owner gates are resolved.

**Recovery status:** neither branch appears in the accessible remote branch list, and the bundle files are not available in the current runtime or Library. Their prior local paths were `/workspace/living-portfolio-delivery/` and `/workspace/project/river-ways/handoff/`; no public download URL was recorded. Do not reconstruct their code from summaries or claim it is integrated. Obtain the exact bundle/patch artifacts before source-level reconciliation.

### Portfolio issue sequence
Issues #35–#42 are open:
- #35 — canonical schema, source and component contract (P0).
- #36 — Scroll Gallery.
- #37 — Shuffle Gallery.
- #38 — Card Folder.
- #39 — 3D Memory Album (last; progressive enhancement only).
- #40 — case-study template, media integrity and QA.
- #41 — independent accessibility, responsive and performance audit.
- #42 — asset inventory, manifest and rights/provenance.

Respect their file-ownership boundaries. Architecture/schema and media governance precede gallery UI. One project record must power every presentation; do not create independent gallery datasets.

## 6. Enquiry and D1 architecture

### Current PR #32 schema
- `migrations/0001_leads.sql`: UUID text primary key, lead details, brief hash, notification state, hashed IP, and rate-limit table.
- `migrations/0002_lead_pipeline_attribution.sql`: existing `stage` lifecycle, source, landing page, referrer and UTM fields.
- `migrations/0003_lead_operations.sql`: assignee, next action, last contacted, closed/updated timestamps, indexes, triggers and `ops_open_leads` view.
- `functions/api/contact.js`: server-side validation, honeypot, rate limiting, brief-hash duplicate lookup, D1 persistence and optional Resend notification.

The current API checks for `LEADS_DB` and `RATE_LIMIT_SALT` before parsing the request body. It uses a five-attempt / 15-minute rate window and a two-minute duplicate brief window. It returns HTTP 503 with `saved: true` if the lead was saved but the Resend notification was not confirmed. That response contract is improved in PR #34.

### PR #34 candidate
PR #34 adds:
- same-origin validation when an Origin header is supplied;
- exact `application/json` media-type validation;
- allowlisted journey and engagement context from the same-origin handoff;
- minimal context persisted in the existing details field, not diagnostic answers or scores;
- HTTP 202 with a reference when the lead is saved but notification is not confirmed;
- clearer distinction between Resend provider acceptance and inbox delivery.

Its reported CI passed on exact head `1303a79bb7d3a6f84059d1be7f33fdb612d548df`, but Preview enquiry configuration, D1 persistence and inbox receipt remained unverified. Integrate after checking the current API and tests at the latest PR #32 head.

### PR #24 incompatibility
PR #24 uses a different, older integer-ID data model and migrations that introduce `pipeline_status`. PR #32 uses UUID IDs and an existing `stage` lifecycle. Do not copy PR #24's contact handler or migrations as a stack. Preserve the useful stable submission-key/idempotency and Playwright ideas only after adapting them to the UUID schema and testing migrations against empty and populated databases.

The previous PR #24 Preview handoff recorded a missing D1 binding / insufficient D1 permission and an invalid Resend API key. These are historical blockers; current secret values and account permissions have not been inspected and must not be guessed.

## 7. Browser testing, accessibility and performance tooling

PR #24 contains:
- `playwright.config.js`;
- `tests/e2e/website.spec.js`;
- `@playwright/test` 1.56.1;
- a CI quality workflow that builds the Vite app, installs Chromium and runs browser tests.

These files are absent from PR #32's current package/tree. The PR #24 E2E tests are not drop-in compatible: they assert the old “Find the current.” hero and six service cards, while PR #32 uses “We engineer demand.” and seven service records. Adapt and extend the original harness rather than adding a second one.

Research decisions:
- Playwright: preferred browser/E2E harness once PR #24's config and tests are reconciled.
- axe-core: add to that real browser harness for automated accessibility scans; still require manual WCAG 2.2 AA checks.
- Lighthouse CI: add after route inventory and production-like output are stable; establish measured baselines before enforcing budgets.
- No browser-testing npm dependency was added in the AI resource increment.

## 8. Deployment and release boundaries

### Existing automation
- The repository's `deploy-preview.yml` runs on pull-request activity and automatically publishes a Cloudflare Pages preview for the PR.
- The production workflow is restricted to `main`; production is not deployed by a topic-branch PR.
- The deployment-control documentation requires exact release markers, route checks and a controlled enquiry readiness probe.

### PR #46 automatic preview event
Opening PR #46 triggered the existing preview workflow. The run:
- built the app;
- passed the existing API tests;
- passed the high-severity dependency audit;
- stamped and deployed the PR preview;
- verified that the preview served the exact PR head `33a6b1fac4b8f64a35b626a3dca15c17746072b2`;
- failed the final non-persisting `/api/contact` readiness probe with HTTP 503.

This was an automatic consequence of the repository's PR workflow, not a production deployment request. No production deployment, DNS change, production secret change, D1 mutation or real enquiry occurred. Future development should continue on the topic branch without opening/updating a PR until the owner authorises a Preview review; otherwise the repository will deploy a preview automatically.

## 9. Verified status versus reported status

| Area | Status | Evidence / limitation |
|---|---|---|
| Canonical design direction | Verified | PR #32 master design and root instructions |
| React/Vite application | Verified | package manifest and source tree |
| Current homepage sections | Verified | `src/App.jsx` |
| Current static routes | Verified | tree, sitemap and static documents |
| Contact handler and D1 schema | Verified in source | not proof of deployed runtime |
| Local SQLite migration 0003 check | Reported/recorded | not a remote D1 migration run |
| PR #34 enquiry safeguards | Implemented in separate PR | not integrated; Preview config remains blocked |
| PR #24 Playwright harness | Present on separate branch | tests are stale against current UI |
| Living Portfolio Foundation | Reported isolated package | exact bundle not accessible; not remote |
| Media Manifest | Reported accepted isolated package | exact bundle not accessible; production integration blocked |
| Candidate A photo provenance | PR #44 documentation | does not authorize use or integrate local checkpoint |
| Route/prerender candidate | Reported local branch | not remote; route-count discrepancy unresolved |
| PR #46 skills validation | Verified | exact-head workflow passed |
| PR #46 Preview deployment | Verified | exact-head marker passed; final API readiness probe failed |
| Production deployment | Not performed by this work | no production changes |

## 10. Execution order after this audit

1. Recover the exact local route candidate, Living Portfolio Foundation bundle and Media Manifest bundle. Inspect commit ancestry and hashes before integrating.
2. Reconcile the route registry, rendered documents, sitemap, redirects and genuine 404.
3. Port the centred editorial hero treatment from PR #43 onto the current PR #32 source, preserving the current interactive visual and content.
4. Integrate the canonical portfolio schema/source and media manifest only after exact source review; keep the three capability studies clearly labelled.
5. Build shared media/badge/disclaimer primitives, then Scroll Gallery and Card Folder, then Shuffle Gallery and editorial case studies, then Memory Album last.
6. Reconcile PR #24 Playwright tests and PR #34 enquiry improvements against the UUID schema.
7. Complete distinct route content, SEO and conversion pathways.
8. Complete responsive, accessibility, performance, API, D1 and notification verification.
9. Prepare one release candidate and consolidated review. Do not deploy production until explicit approval.

## 11. Non-negotiable constraints

- No invented proof, client claims, media rights, metrics or route completion.
- No paid CMS, stock purchase, API, service or new runtime dependency without approval.
- No blind branch merge or schema/migration copy.
- No production DNS, secrets, D1, Cloudflare routing or production deployment changes.
- No PR update while the owner has deferred Preview deployment; the existing PR workflow auto-deploys.
- No claim of operational readiness until D1 persistence, notification delivery, route behavior and release gates are independently verified.
