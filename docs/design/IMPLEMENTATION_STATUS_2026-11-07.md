# River Ways — Implementation Status

**Snapshot:** 7 November 2026  
**Working branch:** `build/river-ways-execution`  
**Snapshot commit:** `b259dcf9796748ee0462f52ec50e1e2bf723acae`  
**Base:** `design/we-engineer-demand-homepage`  
**Production deployment:** not performed  
**Preview for this branch:** not created; no pull request opened

## Executive position

The work has moved from resource research and baseline audit into a consolidated implementation branch. The branch is 20 commits ahead of its base and contains the AI development resources, canonical portfolio foundation, static route generation, enquiry hardening, D1 operations schema, and desktop/mobile browser test harness.

The latest browser run is being rechecked after the last reported accessibility issue was corrected. Do not describe the current exact head as fully green until the workflow for `b259dcf` completes successfully.

## Implemented

| Area | Current implementation |
|---|---|
| AI development resources | Five project skills under `.agents/skills/`, source manifest, skill validator, regression tests and third-party notices |
| Design governance | Updated root instructions, current route/portfolio contracts and operational checklists |
| Portfolio | One canonical project source, validation/schema, selectors, gallery components and five public records |
| Creative Studio | Three original local SVG capability-study compositions, explicitly labelled as illustrative rather than client proof |
| Site routes | 11 generated HTML documents: About, Services, Work index, five project details, Contact, Insights and Terms |
| Existing experiences | Homepage, Growth Diagnostic, Field Guide, Privacy and custom 404 preserved |
| SEO/route hygiene | 15-URL sitemap, canonical route metadata, robots controls, route/link validator |
| Enquiry pipeline | Same-origin JSON endpoint, D1 persistence, duplicate/rate-limit controls, bounded attribution and Resend notification state |
| Lead operations | Three D1 migrations, assignment/follow-up fields, indexes, update triggers and `ops_open_leads` view |
| Attribution | Growth Diagnostic now preserves approved UTM fields and original landing path; answers and score remain in-browser |
| Browser quality | Playwright + axe desktop/mobile Chromium checks integrated into topic and PR CI workflows |

## CI evidence

### Earlier verified green baseline

Commit `55927352aa7443530d6bd9a8c1e46b08c2a7e100` completed the non-browser pipeline successfully:

- Agent Skills validation and validator regression tests passed.
- D1 migrations passed in-memory SQLite validation.
- Vite build and static route generation passed.
- Enquiry API and portfolio test suites passed (69 tests combined).
- Public portfolio data validation passed.
- Dependency audit reported no high-severity vulnerability.

This is a verified earlier commit, not the current exact head.

### Browser test integration and remediation

- First browser run: the harness exposed stale selectors and real homepage accessibility issues. Seven failures included strict locator collisions, an incorrect filter assertion and two contrast/name issues.
- Second browser run: 20 of 22 desktop/mobile checks passed. The only remaining failure was a low-contrast eyebrow label in the Growth Diagnostic sidebar, repeated across desktop and mobile.
- Fix committed at `b259dcf`: the sidebar eyebrow now uses the approved light sky token on its dark surface.
- The exact-head CI run must finish before the browser suite can be called green.

## Release blockers — do not bypass

1. **Cloudflare environment is unverified.** Preview/Production D1 IDs and `LEADS_DB` bindings are not verified.
2. **D1 migrations are not applied remotely.** SQLite validation proves migration syntax/behavior in memory only.
3. **Resend is not verified.** API key, sender identity, provider acceptance and actual inbox delivery remain untested.
4. **No automated retention/deletion schedule exists yet.** Establish and implement a retention policy before production lead capture.
5. **Legal review remains required.** Privacy and Terms documents are practical drafts, not legal approval.
6. **External resources remain.** Homepage imagery loads from Unsplash and typefaces from Google Fonts; the Privacy notice now discloses these requests. Self-hosting remains a possible later privacy/performance decision.
7. **Cloudflare 404 behavior is unverified.** The 404 document exists and is noindex, but the real unknown-route HTTP status must be checked on Cloudflare Pages.
8. **Manual visual and accessibility review remains.** Axe scans do not replace keyboard, screen-reader, zoom/reflow, motion and device review.
9. **The separate local visual candidate has not been reconciled.** The reported `build/shaped-current-homepage` candidate at `fcdcbef` is not present in the accessible remote branch list. Preserve and compare it before selecting the final release base.
10. **The Media Manifest remains isolated.** The separately verified `f94028b` Media Manifest package is governance-only; production integration remains blocked. This branch does not authorise its integration.
11. **No deployment is authorised by this work.** The current branch has no PR because PR activity automatically triggers Cloudflare Preview. Wait for explicit owner approval before opening one.

## Next execution order

1. Finish the exact-head CI run and resolve every browser/axe failure without weakening the tests.
2. Add structured data and validate page metadata against the canonical route inventory.
3. Establish Lighthouse CI baselines and performance budgets on the generated static output.
4. Reconcile the reported local visual candidate and all remaining branch/PR ancestry.
5. Conduct manual desktop/mobile, keyboard, reduced-motion and assistive-technology review.
6. Prepare a single consolidated review PR only after the owner authorises Preview.
7. Configure and verify Cloudflare Preview, D1 migrations and Resend in a controlled environment.
8. Request explicit production release approval only after every gate passes.

## What this status does not claim

- No current production or Preview deployment.
- No remote D1 migration or real enquiry test.
- No confirmed email delivery.
- No verified client case studies or outcomes.
- No approval to integrate the isolated Media Manifest.
- No claim of full WCAG 2.2 AA conformance or production readiness.
