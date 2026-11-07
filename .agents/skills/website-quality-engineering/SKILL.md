---
name: website-quality-engineering
description: "Plans and executes evidence-led quality checks for the River Ways website, including build, API, route, browser, accessibility, responsive, performance and release-boundary verification. Use before accepting substantial website changes or preparing a release candidate."
---

# Website quality engineering

## Authority
Read `AGENTS.md`, `docs/design/RIVER_WAYS_MASTER_DESIGN.md`, `docs/design/DESIGN_ACCEPTANCE_GATES.md` and the current release-control documents. This skill does not authorize deployment, merging, production configuration changes or customer contact.

## Establish the test surface
1. Confirm exact branch and commit.
2. Read `package.json`, CI workflows, Vite configuration, route inventory, API handlers, migrations and existing tests.
3. Reuse the current test framework and existing E2E coverage before adding tools.
4. Identify which checks can run locally, in CI, against a preview, or only with owner-controlled configuration.
5. Never assume a route, secret, binding, browser, test runner or deployment exists.

## Verification layers
Run and report each layer independently:
- Static/build: install from the lockfile, run the production build and relevant lint/type checks if configured.
- Unit/API: run existing tests, including validation, privacy, idempotency and failure paths.
- Route integrity: verify each intended route has a distinct response/document, correct status, canonical metadata, sitemap membership and a genuine 404.
- Browser: inspect desktop, tablet and narrow mobile; test navigation, forms, interactions, console and network failures.
- Accessibility: combine automated checks with manual keyboard, focus, zoom/reflow, contrast and reduced-motion review.
- Performance: measure real production-like output; inspect image/video weight, fonts, JavaScript, layout shift and caching.
- Backend: use synthetic test records in an isolated preview; verify persistence and provider delivery separately.
- Release: verify exact candidate SHA, preview source marker, rollback material and owner approval gates.

## Tool selection
- Prefer the repository's existing Node test runner for unit/API checks.
- Use Playwright for browser and end-to-end testing when its configuration and the PR #24 E2E foundation have been reconciled. Do not create a second competing E2E harness.
- Use axe-core as an automated accessibility aid where it can run in the real browser test harness. Automated scans do not establish WCAG conformance.
- Use Lighthouse or Lighthouse CI only after a stable production-like route set exists. Keep reports private; do not upload project URLs or reports to public temporary storage without approval.
- Check license, version, maintenance, Node compatibility, CI runtime and bundle impact before adding any dependency.

## Evidence rules
A build pass is not a route pass. A route pass is not a browser pass. A browser pass is not an accessibility pass. A preview response is not proof of database persistence or inbox delivery. A provider API acceptance is not proof of email arrival.

For each check record: exact SHA, command or procedure, environment, result, evidence and limitations. Mark checks Pass, Fail, Blocked or Not tested. Do not combine distinct claims into one green status.

## Test safety
Use synthetic data and isolated preview resources. Do not submit real customer enquiries, mutate production D1, change secrets, send customer email, alter DNS or deploy production. Stop when an environment is missing required configuration; report the exact missing evidence rather than bypassing the gate.

## Completion
Provide one consolidated quality report with critical blockers first, followed by warnings, completed checks, untested checks and the smallest safe next action. Include reproducible commands and artifact locations.
