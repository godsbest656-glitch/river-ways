# First Mission — River Ways Website Readiness Audit

Run this task from the River Ways repository root on branch `feat/river-ways-agency-agents`.

## Assignment

Use the `website-orchestrator` custom agent. Delegate independent, read-only investigations to the relevant project specialists. Do not simulate delegation: if Codex does not expose real subagent tools or cannot load the custom agents, stop and report the exact blocker.

## Phase A — Verify the environment

1. Confirm the active branch and HEAD commit.
2. Confirm the working tree is clean before starting.
3. Confirm this project is trusted by Codex and that project-local custom agents are loaded.
4. List the available custom agents and run a harmless discovery task with at least one specialist.
5. Confirm multi-agent delegation works by spawning independent read-only agents.
6. Do not modify code during this phase.

## Phase B — Audit the actual website

Inspect the current checkout, not stale reports or screenshots alone.

Delegate these independent read-only reviews:
- UX Researcher + Growth Hacker: audience comprehension, offer clarity, conversion path, enquiry friction and experiment opportunities.
- Brand Guardian + UI Designer: brand coherence, art direction, page hierarchy, visual consistency and fidelity to approved direction.
- SEO Specialist: route inventory, metadata, canonical URLs, robots/sitemap, structured data, semantic content and indexability.
- Accessibility Auditor: semantic structure, keyboard access, focus, contrast, reduced motion, touch and responsive behavior.
- Code Reviewer: route behavior, React/Vite quality, security, dependencies, enquiry flow, analytics and regression risks.

Each specialist must return:
- verified observations with exact file/path references
- severity and visitor/business impact
- recommendation
- evidence source
- unknowns and tests not performed

## Phase C — Consolidate

The orchestrator must:
1. Reconcile conflicting findings.
2. Separate verified defects from subjective opportunities.
3. Identify missing evidence rather than filling gaps with assumptions.
4. Rank findings by visitor impact, commercial impact, severity, effort and regression risk.
5. Identify what is already working and must not be disturbed.
6. Recommend one first implementation slice.

## Phase D — Deliverable

Create or update only:
- `docs/agency-agents/WEBSITE_READINESS_AUDIT.md`
- `docs/agency-agents/WEBSITE_IMPLEMENTATION_BACKLOG.md`

The audit must cover:
- positioning and audience comprehension
- information architecture and route completeness
- design and responsive behavior
- content credibility and proof gaps
- enquiry/contact journey and form states
- SEO and indexability
- accessibility
- performance and asset provenance
- analytics and operational readiness
- build, test and deployment assumptions

The backlog must contain prioritised work with acceptance criteria, dependencies, risk, verification method and owner-approval requirements.

## Phase E — First implementation

After the audit and backlog exist, implement the highest-value **low-risk** website fix only if:
- the issue is verified in the current source;
- acceptance criteria are clear;
- it does not require a brand identity decision or production change;
- it does not risk enquiry capture, analytics, SEO, routing or deployment behavior.

If no safe first fix meets those conditions, stop after the audit and explain what approval or evidence is needed.

## Hard boundaries

- Do not deploy or merge.
- Do not change production DNS, Cloudflare, Vercel, email, secrets or environment variables.
- Do not send emails, outreach or public posts.
- Do not invent proof, clients, metrics, testimonials or capabilities.
- Do not install additional packages just to run the audit.
- Do not replace the homepage wholesale.
- Do not report a test or visual inspection as passed unless it was actually run.
- Preserve all existing work and produce a reviewable diff.

## Completion report

Report:
- exact branch and starting/ending commits
- custom agents actually discovered and invoked
- whether real subagent delegation worked
- audit and backlog paths
- implementation files changed, if any
- commands/tests run and actual results
- screenshots or preview evidence, if available
- remaining blockers and owner decisions
