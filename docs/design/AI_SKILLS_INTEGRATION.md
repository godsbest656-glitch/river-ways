# River Ways — AI development resource integration

**Status:** Five project-level skills, the validator and the browser-quality workflow are integrated on `build/river-ways-execution`. The skill and migration validators pass. The full topic-branch pipeline is green: 22/22 Playwright/axe browser checks, 18/18 API tests, 51/51 portfolio tests, route/data validation and zero dependency vulnerabilities. See `IMPLEMENTATION_STATUS_2026-11-07.md` for exact commit and release boundaries.

## Why this exists

The website work spans design, frontend, backend, content, media, SEO and release engineering. Project skills package repeatable procedures so an AI developer does not have to rediscover the same project rules on every task. These skills supplement, and never override, `AGENTS.md`, `RIVER_WAYS_MASTER_DESIGN.md`, the design constitution or release gates.

## Installed project skills

| Skill | Use it for | Main value |
|---|---|---|
| `codebase-audit` | Continuing work, branch reconciliation, architecture and integration audits | Establishes facts and dependencies before edits |
| `landing-page-design` | New or substantially changed marketing pages | Connects audience intent, page narrative, proof and conversion |
| `redesign-existing-projects` | Improving existing pages and components | Prioritises high-impact fixes without rebuilding |
| `figma-designer` | Actual Figma work | Reuses existing variables, components and responsive foundations |
| `website-quality-engineering` | Acceptance, regression and release-candidate checks | Separates build, API, route, browser, accessibility and backend evidence |

## Upstream research and adaptation decisions

### Elaya Design — AI Design Skills
- Repository: https://github.com/elayadesign/ai-design-skills
- Pinned source commit: `456d9e0d3e2d84c748bb143c6ca3d90c45e16213`
- License: MIT.
- Useful source material: landing-page strategy, Figma workflow, metadata validator, validator tests and CI workflow.
- Decision: adapt the useful workflows, validator concepts and Figma procedures. Do not copy the promotional SlopScan banner. Do not import the upstream fixed font, spacing, radius, color, icon or motion prescriptions because they conflict with the River Ways master design and existing tokens.

### Elaya Design — Redesign Skill
- Repository: https://github.com/elayadesign/redesign-skill
- Pinned source commit: `7df13f6a289f4a7f91c5fe3efd70f51fd584ec28`
- License: MIT.
- Useful source material: inspect-before-editing workflow, design audit categories, missing-state checks, focused fix ordering and completion reporting.
- Decision: adapt these methods to River Ways' current implementation, architecture and evidence requirements. Do not import unrelated design values.

### Agent Skills open specification
- Specification repository: https://github.com/agentskills/agentskills
- Pinned source commit: `83021e2be457a9b6679148719c1f6074f0ad975e`
- License: Apache-2.0 for repository code; documentation is CC-BY-4.0.
- Decision: use the documented folder plus `SKILL.md` frontmatter convention. No specification code or documentation is copied into this project.

## Quality tooling research

| Resource | License | Recommended use | Current decision |
|---|---|---|---|
| Playwright | Apache-2.0 | Real-browser, responsive and end-to-end testing across Chromium, Firefox and WebKit | Adopted as the single desktop/mobile Chromium E2E harness; adapted to current routes and interactions |
| axe-core | MPL-2.0 | Automated accessibility checks inside browser tests | Adopted through `@axe-core/playwright`; scans cover key routes, with manual WCAG review still required |
| Lighthouse CI | Apache-2.0 | Repeatable performance, accessibility, SEO and best-practice measurements | Introduce after route inventory and production-like output are stable; establish measured baselines first |
| Node `node:test` | Node.js built-in | Existing API/unit tests | Keep using the current test runner; no additional API test framework is needed |

Primary sources:
- https://github.com/microsoft/playwright
- https://github.com/dequelabs/axe-core
- https://github.com/GoogleChrome/lighthouse-ci
- https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx

## Project CI resource

`.github/workflows/topic-build.yml` and `.github/workflows/ci.yml` run skill validation, migration validation, the production build, Playwright/axe browser checks, API tests, portfolio tests, public-data validation and the high-severity dependency audit. These workflows do not deploy. The topic workflow runs on non-main branch pushes and avoids the repository's automatic Preview workflow.

## Browser harness adaptation

PR #24 contained a Playwright configuration and older tests tied to an earlier homepage. The existing harness was reconciled rather than replaced. The current tests cover desktop and mobile Chromium, primary navigation, generated routes, portfolio filtering and project detail links, Demand Intelligence controls, enquiry validation and saved-but-unnotified responses, Growth Diagnostic attribution handoff, horizontal overflow, and axe scans on key routes.

The Growth Diagnostic handoff now preserves only approved UTM fields plus a fixed journey, engagement and original landing-path context. It does not send diagnostic answers or scores. Browser tests mock the endpoint; they do not contact Resend or write to D1.

Lighthouse CI remains deferred until the browser baseline is stable and a performance budget can be measured. Public temporary report storage is not enabled; any report destination must be reviewed for privacy first.

## How agents must use the skills

1. Read root `AGENTS.md` and the canonical master design.
2. Use `codebase-audit` when source-of-truth or implementation history is unclear.
3. Use `redesign-existing-projects` for existing UI and `landing-page-design` for new page work.
4. Use `figma-designer` only when an actual Figma file is in scope; load the installed Figma prerequisite skills first.
5. Use `website-quality-engineering` for verification and release-candidate checks.
6. Inspect the actual files and dependencies before applying instructions.
7. Validate skills with `python scripts/validate_skills.py .agents/skills` and `python -m unittest discover -s tests -p "test_*.py"`.

## Deployment boundary

The current repository's `deploy-preview.yml` workflow runs on pull-request activity and automatically deploys a Cloudflare Pages Preview. Opening PR #46 therefore published a non-production preview at `https://pr-46.riverwayse-website.pages.dev/` and verified the exact source marker. Its final non-persisting contact readiness probe returned HTTP 503. No production deployment, DNS change, production secret change, D1 mutation or real enquiry occurred.

When the owner says deployment is deferred, continue committing to a topic branch without opening or updating a PR until a Preview review is authorised. Do not invoke workflow dispatch or production deployment.

## Boundaries

- Browser and accessibility tooling is installed as development-only dependencies; no production runtime dependency was added.
- No production workflow, DNS, secret, database or production setting was changed.
- The repository automatically deployed a non-production PR preview when PR #46 was opened; this was an existing workflow side effect, not a production release.
- Skills are procedural aids, not proof that any website task has been completed. Current execution status and remaining release blockers are tracked in `IMPLEMENTATION_STATUS_2026-11-07.md`.
