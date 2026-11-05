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
