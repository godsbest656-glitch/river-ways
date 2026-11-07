---
name: codebase-audit
description: "Establishes the verified source of truth and maps the existing River Ways website before implementation. Use when continuing prior work, reconciling branches or PRs, auditing architecture, tracing routes and integrations, or planning large changes."
---

# River Ways codebase audit

## Objective
Build an evidence-based map of the existing product before changing it. The repository is the evidence; conversation history is context, not proof that a file, feature, branch or deployment currently exists.

## Required sequence
1. Confirm repository identity, default branch, permissions, exact target branch and commit.
2. Inspect open PRs, base/head relationships, commit ancestry, changed files and CI status.
3. Inspect root instructions, package manifest, lockfile, source tree, scripts, workflows and deployment configuration.
4. Map entry points, routes, shared components, styles, assets and generated output.
5. Trace critical journeys end to end: navigation, diagnostic, contact submission, API validation, D1 persistence, notifications and follow-up.
6. Inspect migrations in order and compare the schema expected by code with the schema expected by tests.
7. Identify SEO files, sitemap, robots, canonical URLs, metadata, structured data and 404 handling.
8. Identify feature flags, secrets/bindings by name only, external services and cost-bearing features.
9. Compare relevant candidate branches and PRs by exact file changes; do not cherry-pick whole branches without overlap analysis.
10. Produce a dependency map and ranked implementation backlog.

## Evidence classification
Use four labels:
- Verified: directly observed in source, commit metadata, tests, CI or browser evidence.
- Reported: stated in an earlier handoff but not re-verified.
- Inferred: a reasonable interpretation that still needs confirmation.
- Blocked: cannot be established with current access or configuration.

Never turn a reported item into a verified fact by repeating it.

## Change discipline
- Work on a topic branch from the agreed integration base.
- Preserve immutable bundles and isolated work; do not delete historical branches or artifacts.
- Make small coherent commits and retain rollback paths.
- Reuse existing components, schemas and tests when sound.
- Do not introduce a parallel website, duplicate route system, competing lead schema or overlapping design tokens.
- Do not add dependencies until their value, license, maintenance, compatibility and cost are documented.
- Do not alter production infrastructure, secrets, customer data or deployments.

## Deliverable
Return a concise architecture map, exact source-of-truth decision, branch/PR reconciliation, route and integration inventory, dependency graph, risk register and sequenced implementation plan. Then proceed with low-risk, reversible work without asking the owner to repeat known decisions.
