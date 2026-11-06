# AI Developer Kickoff — Consolidation and Refinement

## Mission

Continue the existing River Ways website redesign as one integrated implementation. The creative direction is settled: **SHAPED CURRENT / Route 2 — Editorial Intelligence**, positioned as **Creative Demand Engineering**, with the headline **“We engineer demand.”**

This is not a new blank-slate design assignment. The job is to consolidate overlapping work, refine the strongest existing implementation, and prove it works.

## Required reading

1. `AGENTS.md`
2. `docs/design/RIVER_WAYS_MASTER_DESIGN.md`
3. `docs/design/README.md`
4. `docs/design/DESIGN_CONSTITUTION.md`
5. `docs/design/CREATIVE_DIRECTION_BRIEF.md`
6. `docs/design/DESIGN_SYSTEM_ARCHITECTURE.md`
7. `docs/design/DESIGN_AGENT_PROTOCOL.md`
8. `docs/design/DESIGN_ACCEPTANCE_GATES.md`

## Current consolidation baseline

- PR #31 (`design/shaped-current-rebuild`) is the integrated website redesign foundation.
- PR #32 (`design/we-engineer-demand-homepage`) is the consolidation branch containing the approved headline and master direction.
- PR #25 contains the earlier design-governance documents; their outdated exploratory language must be reconciled with the approved direction, not copied unchanged.
- PR #27 is a historical three-route exploration; route selection is closed.
- PR #28 is an overlapping SHAPED CURRENT visual layer; compare before reusing any changes.
- The standalone static HTML prototype is not the application and must not replace the React/Vite site or its enquiry API.

Verify current PR state, branch ancestry, workflow results, and exact source files before acting. Do not assume prior reports describe the current commit.

## Work sequence

### 1. Establish exact reality
Record branch, commit, working tree, framework, routes, scripts, workflow runs, preview URL, and current contact service configuration status. Separate facts from assumptions.

### 2. Consolidate source of truth
Make the master design document authoritative. Reconcile README, constitution, creative brief, architecture, agent protocol, acceptance gates, kickoff, and AGENTS rules so no file instructs a developer to restart route exploration.

### 3. Audit the actual implementation
Review the homepage and all routes, shared components, styles/tokens, typography, imagery, motion, navigation, forms, metadata, and conversion paths. Identify duplicated patterns, inconsistent visual rules, placeholder content, inert controls, and regressions.

### 4. Refine, do not restart
Prioritize changes by visitor comprehension, brand distinctiveness, conversion value, accessibility, performance, and maintainability. Make focused commits to the consolidation branch. Avoid cosmetic churn and do not add dependencies or paid services without approval.

### 5. Validate the exact candidate
Run build, unit/API tests, dependency audit, route checks, and browser tests. Deploy a real preview and confirm its release marker matches the exact commit. Inspect desktop/tablet/mobile, keyboard, screen reader semantics, contrast, reduced motion, and slow-network behavior.

### 6. Prove the enquiry journey
Verify the Preview runtime bindings and configuration. Test a controlled submission through validation, D1 persistence, attribution, spam protection, and notification delivery. Do not create fake production leads or expose secrets. If Preview credentials are missing, report the precise blocker and request owner configuration rather than weakening the endpoint.

### 7. Report honestly
Provide the exact commit, changed files, tests and outcomes, preview URL, screenshots/browser evidence where available, unresolved blockers, and what remains untested. Keep the PR draft until acceptance gates pass.

## Boundaries

No merge to `main`, production deployment, DNS/routing change, secret rotation, paid service, or destructive branch cleanup without explicit approval. Preserve the current React/Vite architecture, routes, SEO, analytics, D1-backed enquiry contract, and notification behavior.
