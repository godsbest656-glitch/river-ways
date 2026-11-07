# River Ways — AI development resource integration

**Status:** Project-level resources implemented on a topic branch; integration into the consolidated website branch is awaiting review and CI.

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
| Playwright | Apache-2.0 | Real-browser, responsive and end-to-end testing across Chromium, Firefox and WebKit | Adopt as the preferred browser harness when PR #24's existing E2E configuration is reconciled; do not add a competing setup |
| axe-core | MPL-2.0 | Automated accessibility checks inside browser tests | Use with Playwright when the harness is restored; automated checks do not replace manual WCAG review |
| Lighthouse CI | Apache-2.0 | Repeatable performance, accessibility, SEO and best-practice measurements | Introduce after route inventory and production-like build are stable; establish baselines before enforcing thresholds |
| Node `node:test` | Node.js built-in | Existing API/unit tests | Keep using the current test runner; no additional test framework is needed for API tests |

Primary sources:
- https://github.com/microsoft/playwright
- https://github.com/dequelabs/axe-core
- https://github.com/GoogleChrome/lighthouse-ci
- https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx

### Why the browser tools are not installed in this increment

The current consolidated branch's package manifest contains React 18, Vite 6 and the Node API test runner, but no Playwright configuration. PR #24 contains an existing Playwright configuration and browser suite, but those tests target an older homepage and older selectors. The correct next step is to adapt that harness to the current routes and interactions, not install a competing framework. This increment installs reusable project skills and a validator without changing application dependencies.

Lighthouse CI is deferred until the intended routes and production-like preview are stable. Public temporary report storage is not enabled by this project; any report upload destination must be reviewed for privacy first.

## How agents must use the skills

1. Read root `AGENTS.md` and the canonical master design.
2. Use `codebase-audit` when source-of-truth or implementation history is unclear.
3. Use `redesign-existing-projects` for existing UI and `landing-page-design` for new page work.
4. Use `figma-designer` only when an actual Figma file is in scope; load the installed Figma prerequisite skills first.
5. Use `website-quality-engineering` for verification and release-candidate checks.
6. Inspect the actual files and dependencies before applying instructions.
7. Validate skills with `python scripts/validate_skills.py .agents/skills` and `python -m unittest discover -s tests -p "test_*.py"`.

## Deployment boundary discovered during implementation

The current repository's `deploy-preview.yml` workflow runs on pull-request activity and automatically deploys a Cloudflare Pages Preview. Opening PR #46 therefore published a non-production preview at `https://pr-46.riverwayse-website.pages.dev/` and verified the exact source marker. Its final non-persisting contact readiness probe returned HTTP 503. No production deployment, DNS change, production secret change, D1 mutation or real enquiry occurred.

When the owner says deployment is deferred, continue committing to a topic branch without opening or updating a PR until a Preview review is authorised. Do not invoke workflow dispatch or production deployment.

## Boundaries

- No npm dependency was added in the resource increment.
- No production workflow, DNS, secret, database or production setting was changed.
- The repository automatically deployed a non-production PR preview when PR #46 was opened; this was an existing workflow side effect, not a production release.
- Skills are procedural aids, not proof that any website task has been completed.
