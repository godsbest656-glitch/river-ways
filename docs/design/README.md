# River Ways — Design Source of Truth

> **Current approved direction:** SHAPED CURRENT · Route 2 — Editorial Intelligence · “We engineer demand.”

## Read and follow in this order

1. [Implementation Status](./IMPLEMENTATION_STATUS_2026-11-07.md) — current branch, verified implementation, CI evidence and release blockers.
2. [Master Website Design](./RIVER_WAYS_MASTER_DESIGN.md) — **binding current decision** for brand, experience, narrative, routes, evidence, implementation boundaries, and consolidation.
3. [Design Constitution](./DESIGN_CONSTITUTION.md) — enduring quality principles and decision hierarchy.
4. [Creative Direction Brief](./CREATIVE_DIRECTION_BRIEF.md) — audience, positioning, art direction, and experience intent.
5. [Design System Architecture](./DESIGN_SYSTEM_ARCHITECTURE.md) — how the approved system is expressed in code.
6. [Design Agent Protocol](./DESIGN_AGENT_PROTOCOL.md) — required audit, implementation, and review process.
7. [Design Acceptance Gates](./DESIGN_ACCEPTANCE_GATES.md) — evidence required before approval or release.
8. [AI Developer Kickoff](./AI_DEVELOPER_KICKOFF.md) — current consolidation and refinement assignment.
9. [Implementation Refinement Audit](./IMPLEMENTATION_REFINEMENT_AUDIT.md) — observed gaps, completed changes, and evidence still required.

## Decision status

The visual route is no longer open for exploration. SHAPED CURRENT and Route 2 — Editorial Intelligence are the approved direction. The headline is “We engineer demand.” The existing mark remains provisional; logo redesign is not a blocker.

Older route comparisons, palette studies, standalone prototypes, and competing visual branches are historical research. They may inform a specific improvement, but they do not reopen settled decisions. Do not create another route comparison or parallel redesign without an explicit request to reconsider the direction.

## Required working sequence

**Audit the integrated implementation → reconcile decisions and duplicate work → refine the existing system → test the real experience → document evidence → propose release only when gates pass.**

Do not begin with another blank-slate redesign. Do not treat a screenshot, prototype, successful build, or deployed URL as proof that all release requirements pass.

## Project facts and boundaries

- Brand: River Ways. Domain: `riverwayse.com`.
- Positioning: Creative Demand Engineering. Primary message: **We engineer demand.**
- Current implementation foundation: React 18 + Vite 6; preserve the existing Cloudflare Pages architecture and working enquiry/API behavior.
- Initial target market: global.
- The public River Ways website is the scope. Avenize and Revenue OS are separate products/projects.
- Never invent client work, results, testimonials, awards, customer logos, or capability claims.
- No paid tools, subscriptions, external APIs, or unapproved asset licensing without explicit approval.
- No production merge, deployment, DNS, secrets, or infrastructure changes without explicit approval.

If another document conflicts with the Master Website Design, the master document governs current creative decisions. The Constitution continues to govern enduring quality, truth, accessibility, privacy, and visitor care.


## Portfolio system
10. [Living Portfolio Architecture](./LIVING_PORTFOLIO_ARCHITECTURE.md) — canonical project schema, data source, evidence rules and integration sequence.
11. [Living Portfolio Component Contracts](./LIVING_PORTFOLIO_COMPONENT_CONTRACTS.md) — shared media/badge/disclaimer primitives and gallery interaction contracts.


## Route architecture
12. [Route Inventory and Static Page Generation](./ROUTE_INVENTORY_2026-11-07.md) — verified current routes, target route patterns, build-time generation and 404/sitemap controls.


## Creative production
14. [Local Creative Production Engine](../../creative-production/README.md) — local-first creative production, ComfyUI generation, model licensing, media QA and approval gates. [Implementation status](../../creative-production/IMPLEMENTATION_STATUS.md).

## Operations
13. [Production Environment Readiness Checklist](../ops/PRODUCTION_ENVIRONMENT_CHECKLIST.md) — D1 migration sequence, Cloudflare bindings, Resend configuration, end-to-end acceptance and release blockers.


## Browser and accessibility regression
The adapted Playwright harness runs desktop and mobile Chromium journeys against the generated static output. Automated axe checks cover key routes. See `tests/e2e/website.spec.js` and `playwright.config.js`. Browser checks do not replace Cloudflare Preview verification or manual WCAG 2.2 AA review.
