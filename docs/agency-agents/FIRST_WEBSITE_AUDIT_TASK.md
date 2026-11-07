# First Mission — River Ways Website Readiness Audit

Run this task against the **latest actual River Ways website worktree**, not automatically against the branch that introduced these agent files.

## Worktree alignment — mandatory

The agent definitions have been ported to `build/river-ways-execution-agency-agents`, a topic branch created from the remote website implementation candidate `build/river-ways-execution`. The latest recorded status snapshot for that candidate is `c78a796a85dc6b18b5fc2230d0e95f5763815927`; verify the actual branch HEAD locally rather than trusting this recorded value.

A separately reported local visual candidate (`build/shaped-current-homepage` at `fcdcbef` in the most recent report, previously `059b084`) was not found in the remote branch listing. It may still exist in the user's local workspace and may contain newer visual work. Preserve and compare it before choosing a release candidate.

Before the audit:
1. Inspect `git status`, `git worktree list`, local branches, remotes and recent commits. Confirm the actual HEAD of `build/river-ways-execution-agency-agents` and the latest local website worktree.
2. Preserve uncommitted work and existing worktrees. Do not reset, clean, force-checkout, overwrite, or discard local candidate work.
3. If the local visual candidate or another worktree is newer than the remote base, create a separate integration worktree from that exact local HEAD and bring across only `.codex/agents/`, `.codex/config.toml`, `docs/agency-agents/`, `third_party/agency-agents/LICENSE`, `scripts/validate_codex_agents.py`, `tests/test_validate_codex_agents.py`, and the additive agent section in `AGENTS.md`. Merge carefully; preserve all newer source and instructions.
4. Confirm the selected integration worktree contains the newest website source and all agent files. Run `git diff --check`, `python scripts/validate_codex_agents.py .codex/agents`, and the Python unittest suite.
5. Keep this work on a topic branch. Do not open or update a PR yet: the repository's pull-request workflows automatically deploy a Cloudflare Preview. Wait for explicit owner authorisation before any PR/Preview action. Do not merge or deploy.

## Assignment

Use the `website-orchestrator` custom agent. Delegate independent, read-only investigations to the relevant project specialists. Do not simulate delegation: if Codex does not expose real subagent tools or cannot load the custom agents, stop and report the exact blocker.

## Phase A — Verify the environment

First follow `docs/agency-agents/CODEX_ACTIVATION_AND_VALIDATION.md` and record the client/version, project trust, loaded agent list, parent permission mode, and real subagent evidence. Do not proceed by assuming the TOML files were loaded.

1. Confirm the active branch and HEAD commit.
2. Confirm the working tree is clean before starting.
3. Confirm this project is trusted by Codex and that project-local custom agents are loaded.
4. List the available custom agents and run a harmless discovery task with at least one specialist.
5. Confirm multi-agent delegation works by spawning independent read-only agents.
6. Do not modify code during this phase.

## Phase B — Audit the actual website

Inspect the current checkout, not stale reports or screenshots alone. First read `docs/design/README.md` and the binding `docs/design/RIVER_WAYS_MASTER_DESIGN.md`, followed by the design constitution, creative direction, design-system architecture, agent protocol and acceptance gates. Also inspect the dated implementation status, route inventory, AI developer kickoff, living-portfolio architecture/contracts and production-environment checklist. Treat dated snapshots as context to re-verify; the implementation refinement audit is historical and must not be reported as current evidence.

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

- Do not open/update a PR, deploy or merge. Pull-request activity automatically triggers a Cloudflare Preview; wait for explicit owner approval.
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
