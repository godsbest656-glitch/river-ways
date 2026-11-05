# River Ways — Implementation Refinement Audit

**Audit basis:** source inspection of `design/we-engineer-demand-homepage` and rendered text/metadata extracted from the existing PR #31 Cloudflare preview.  
**Important:** the inspected public preview was PR #31 at commit `4228f76493f922e4a3233b60d73304639e773730`, not the newer PR #32 branch. It still displayed the older headline “Make demand move.” The PR #32 candidate must be inspected separately before approval.

## What is already strong

- The offer is understandable: River Ways connects strategy, creative, digital experiences, and growth systems.
- The homepage has a coherent narrative from disconnected activity to connected demand.
- The service set covers strategy, digital experiences, search/AI discovery, brand/creative, performance, content/campaigns, and demand intelligence.
- Founder, growth-team, and established-organisation pathways are represented.
- Demand Intelligence copy includes a useful scope disclaimer and human-review framing.
- The methodology is clear and avoids guaranteed outcomes.
- The contact form uses the existing `POST /api/contact` path and preserves UTM/referrer attribution in the React implementation.
- The design includes semantic headings, skip navigation, keyboard-operable hero cards, and reduced-motion handling in the existing stylesheet.

## Gaps found and actions taken

### 1. Creative Studio was not tangible enough
The existing page listed brand and content capabilities but did not give Creative Studio a clear, memorable expression. The homepage also lacked a distinct studio navigation entry.

**Action:** added a dedicated Creative Studio section to `src/App.jsx`, with three original editorial capability studies: Brand Worlds, Campaign Worlds, and Digital & Motion. Added responsive visual compositions in `src/styles.css` and a Creative Studio navigation link. The section explicitly labels these as illustrative studies, not client case studies.

### 2. Creative proof must remain honest
The existing page does not contain verified client case studies. Generic service photography should not be mistaken for proof of River Ways' work.

**Decision:** the new studio visuals are labelled as capability studies. Do not add client logos, named projects, testimonials, results, or portfolio claims until the source assets and permissions are verified. A real Work page needs evidence, not invented case studies.

### 3. The homepage still needs a real browser review
Rendered text extraction confirms the PR #31 page structure and content, but it cannot establish visual balance, animation quality, mobile behavior, contrast, or keyboard interaction in the browser.

**Next verification:** inspect PR #32's exact deployed preview at desktop, tablet, and mobile sizes; capture evidence; test keyboard navigation, touch behavior, reduced motion, image loading, and page performance.

### 4. Preview enquiry configuration is a release blocker
The prior PR #31 preview deployed and served its exact commit, but the workflow's non-persisting `/api/contact` configuration probe returned HTTP 503 with the response indicating missing Preview configuration (likely `LEADS_DB` or `RATE_LIMIT_SALT`).

**Decision:** do not weaken validation or change the form to a mailto-only fallback to make the check pass. Configure the Preview environment correctly, then test a controlled end-to-end enquiry including D1 persistence, attribution, spam controls, and notification delivery.

### 5. Stacked pull-request preview routing needed support
The preview workflow originally accepted pull requests targeting only `main`. PR #32 targets `design/shaped-current-rebuild`, so it would not receive a Cloudflare preview under that filter.

**Action:** updated `.github/workflows/deploy-preview.yml` on the PR #31 base branch to accept PRs targeting either `main` or `design/shaped-current-rebuild`. Confirm that a new PR #32 synchronize/ready event now creates a PR #32 preview and that its release marker matches the exact head SHA.

## Remaining refinement priorities

1. Review the new Creative Studio section in the actual browser and tune its compositions, spacing, and responsive behavior.
2. Review the hero as a complete first-screen experience: clear commercial promise first, dimensional interaction second, no spectacle that delays comprehension.
3. Reassess the three generic service images; replace only with licensed, art-directed assets that support the actual capability story. Do not imply they are client work.
4. Ensure the full route architecture (services, work, approach, about, insights, contact, diagnostic, privacy, 404) is internally linked and that each route is a distinct, useful document.
5. Review the page length and section transitions for repetition. Keep the River metaphor purposeful rather than repeating “current” language as filler.
6. Verify all visible controls and CTAs lead to a working action. Remove inert controls.
7. Complete accessibility, performance, SEO, security-header, and enquiry acceptance gates against the exact release candidate.

## Current test record

- GitHub Actions **River Ways checks** for commit `e13aa239afa0b3e7d49462691f2f1c78da96fb7a`: completed successfully. Build, API tests, and dependency audit all passed.
- No current PR #32 Cloudflare preview has yet been verified.
- No desktop/mobile browser inspection of the PR #32 candidate has yet been completed.
- No end-to-end Preview D1 persistence or Resend notification test has yet been completed.
- Production has not been changed.

This audit is a living record. Update it with evidence from the exact candidate SHA; do not convert a recommendation into a completed item without verification.


## Browser review — partial, not a release pass

A live browser QA run inspected `https://pr-32.riverwayse-website.pages.dev/` after the Creative Studio section was deployed. The extracted page metadata showed the approved title “River Ways — We Engineer Demand.” and the page contained the three new Creative Studio capability studies.

Observed:
- The hero headline, supporting copy, and primary/secondary actions were legible and aligned in the desktop browser view.
- The Creative Studio studies rendered with their distinct brand, campaign, and digital/motion compositions.
- The contact form labels, fields, dropdown, submit control, and privacy note were present and structurally clear.
- Keyboard tabbing reached the skip link and header navigation controls.
- The browser agent reported no obvious clipping or horizontal overflow in its narrow-view framing.

Limitations:
- The browser automation could not programmatically resize the viewport; the reported mobile view used narrow screenshot framing rather than a confirmed exact 390px browser viewport. Do not treat this as a verified 390px responsive test.
- The automation did not provide independently inspectable screenshot files in this audit record.
- The actual open/close behavior of the mobile menu was not conclusively demonstrated.
- The contact form was not submitted; no D1 write or Resend notification was tested.
- The preview's release marker was `a81e7e17ab326b6a73f79564f2e395a039ef9273`, while the branch later advanced to workflow/documentation commits. The rendered application code is the same as the tested code-bearing commit, but the preview is not the exact current branch head.

Therefore: **partial visual inspection only**. A proper device/browser pass at fixed desktop, tablet, and mobile viewport dimensions remains open, along with screenshot evidence and end-to-end enquiry verification.


## Cross-branch consolidation findings

The public GitHub design branch is not the whole release story. A comparison of open PRs and the prior release report found these separate workstreams:

### A. Newer local release candidate — must be preserved
- Reported branch: `build/shaped-current-homepage`
- Reported commit: `4fd62fc`
- Reported artifact: 42 commits / 63 files, restore-tested in the separate developer workspace.
- Reported additions: route registry, prerendering, route-specific documents, sitemap/redirect handling, and unknown-path 404 behavior.
- **Unresolved discrepancy:** report says 12 sitemap URLs; build summary says 10 route documents plus `404.html`. Do not repeat “12 routes” as verified until the route registry, built output, sitemap, and 404 are reconciled.
- This branch is not present in the accessible GitHub branch list. Do not overwrite it or treat PR #31/#32 as a complete replacement.

### B. PR #24 — operational release foundation
PR #24 (`feat/ads-gate-readiness`) contains D1 migrations 0001–0004, idempotent contact submissions, lead operations, Playwright E2E tests, privacy, Growth Diagnostic, and a Demand Engineering field guide. PR #31's changed-file set contains only migrations 0001–0002 and does not include the field guide or Playwright E2E suite. The visual redesign must not accidentally discard these stronger operational capabilities. Integrate by file-level comparison and preserve existing contracts.

### C. PR #30 — gated AI Demand Intelligence
PR #30 (`feat/river-ways-ai-demand-intelligence`) is stacked on PR #24 and adds a React assessment component, Pages Function, migration 0005, API tests, and an `AI_DEMAND_ENABLED` feature gate. It is limited to visitor-supplied context; it does not crawl external sources or create leads. Keep disabled pending explicit owner cost approval and verified Preview bindings/migration. Do not conflate this with Avenize.

### D. Other workstreams
- PR #29 is the internal agency operating platform, not the public website redesign.
- PR #21 is an earlier layered-current-card experiment; PR #31 already has a layered interactive hero, so compare rather than stack.
- PR #25's design governance has been reconciled into PR #32; PR #27 and #28 remain historical/overlapping explorations.

### E. Route reality
The PR #32 branch currently has a three-URL sitemap (home, Growth Diagnostic, privacy), plus a custom 404. It does not contain separate Services, Work, About, Approach, Insights, or Contact route documents. The newer local candidate reportedly adds route registry/prerendering, but its count discrepancy remains open. The final route map must be based on verified build output, not the intended IA alone.

## Updated test and deployment record

- The code-bearing commit `e13aa239afa0b3e7d49462691f2f1c78da96fb7a` passed GitHub Actions: production build, enquiry API tests, and dependency audit.
- The PR #32 preview at `https://pr-32.riverwayse-website.pages.dev/` renders the approved headline and Creative Studio studies. Its release marker remains `a81e7e17ab326b6a73f79564f2e395a039ef9273`, not the latest branch head after later documentation/workflow commits.
- A live browser QA run observed the desktop hero, Creative Studio, methodology, and contact form. No obvious desktop clipping was reported. The tool could not confirm an exact mobile viewport resize, so mobile QA remains partial.
- PR #31's earlier Preview contact configuration probe returned HTTP 503, likely due missing `LEADS_DB` or `RATE_LIMIT_SALT`. End-to-end D1 persistence and Resend notification remain unverified.
- Production has not been changed.

## Priority order revised

1. Preserve and recover the local 42-commit release candidate; obtain its exact route registry and source tree in a GitHub-accessible branch without overwriting it.
2. Reconcile route registry, prerendered output, sitemap, redirects, and 404; resolve the 12-vs-10 route discrepancy.
3. Merge the best SHAPED CURRENT / Route 2 visual implementation into that verified route/release foundation.
4. Reconcile PR #24's contact idempotency, lead operations, field guide, and Playwright tests; preserve the D1/API contract.
5. Keep PR #30 AI Demand Intelligence gated until explicit cost approval and Preview verification.
6. Continue visual browser QA at fixed desktop/tablet/mobile viewport sizes, with screenshot evidence.
7. Verify Preview D1 persistence and Resend notification before any release approval.


## Contact schema comparison — do not copy migrations blindly

A file-level comparison of PR #24 and PR #32 shows they use different but partially compatible data models:

- PR #24 `0001_leads.sql` uses an integer autoincrement lead ID and a basic leads table; PR #32 `0001_leads.sql` uses a text UUID primary key, `brief_hash`, notification state constraints, and a `lead_rate_limits` table.
- PR #32 `0002_lead_pipeline_attribution.sql` already adds attribution fields and a constrained `stage` column. PR #24 `0002_campaign_attribution.sql` is a different migration and is absent from PR #32.
- PR #24 `0003_submission_idempotency.sql` adds a stable `submission_key`; PR #32 currently deduplicates by a short-window brief hash and does not persist a client submission key.
- PR #24 `0004_lead_operations.sql` adds `pipeline_status`, assignment/follow-up fields, timestamps, and the `ops_open_leads` view. It expects attribution columns that PR #32's migration 0002 already provides, but it introduces a second lifecycle field alongside PR #32's existing `stage`.
- PR #24's contact function uses `meta.last_row_id` (integer-ID assumption) and includes a non-mutating GET readiness probe. PR #32's function uses UUID IDs and an atomic `lead_rate_limits` upsert, but does not include the same GET diagnostic probe.

**Integration decision:** do not replace PR #32's schema or copy PR #24 migrations as a blind stack. Design one canonical schema and API contract: preserve UUID IDs and atomic rate limiting unless a tested migration proves otherwise; decide whether to consolidate `stage` and `pipeline_status` into one lifecycle; add stable submission-key idempotency if needed; adapt the readiness probe to the chosen schema; and port PR #24's operational view/assignment/follow-up fields without duplicate or contradictory status fields. Re-run migrations against both an empty database and a populated legacy database, then adapt API and E2E tests.

This is a schema design task, not a cosmetic merge. Keep it separate from the visual redesign commit and do not apply any migration to production during consolidation.


## Field Guide restored from the release foundation

The Demand Engineering Field Guide from PR #24 has been restored at `public/field-guide/index.html` and restyled to the approved SHAPED CURRENT blue system (removing the earlier terracotta/forest/warm-paper palette). It retains the practical framework content, accessible disclosure steps, and responsible-use caveats. The homepage footer now links to it, and the sitemap includes `/field-guide/`.

**Current verified route inventory on PR #32:** homepage, Growth Diagnostic, Field Guide, Privacy, and a custom 404 document. The sitemap now lists four indexable URLs (home, Growth Diagnostic, Field Guide, Privacy). This is a factual inventory of the current GitHub branch only; it does not resolve the separate local candidate's route-count discrepancy or satisfy the broader intended information architecture.


## Consolidated PR topology update

PR #32 has now been retargeted from the stacked base `design/shaped-current-rebuild` to `main`. It therefore represents one reviewable PR containing the full PR #31 SHAPED CURRENT implementation plus the PR #32 headline, governance, Creative Studio, Field Guide, and related refinements. PR #31 remains open as the original visual foundation; it should not be treated as a separate final release. No merge to `main` has occurred.

The latest head at the time of this note is `fb8a1a6f84b5714a4c2c5ffdb45ac1db9c4cf6e6`. The last confirmed GitHub Actions build/API/dependency pass remains the earlier code-bearing commit `e13aa239afa0b3e7d49462691f2f1c78da96fb7a`. Later Field Guide, sitemap, footer, and documentation changes still need an exact-head workflow run. The Cloudflare bot's reported Worker build failure on `e8538aa` has not been diagnosed because the linked dashboard requires an authenticated session.
