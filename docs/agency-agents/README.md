# River Ways — Agency Agents Integration

## Purpose and scope

This integration brings a curated subset of the MIT-licensed `msitarzewski/agency-agents` specialist roster into the River Ways website repository as **project-scoped Codex custom agents**.

These are development-time agents that help inspect, design, implement, optimise and review the River Ways website. They are not a production chatbot, website visitor-facing agent runtime, autonomous deployment system, or replacement for Harvey, Rebuilder or Revenue OS.

## Installation

Agent definitions live in `.codex/agents/*.toml`. Codex discovers project-scoped custom agents from this directory when the repository is opened in a compatible Codex environment. If the host requires project trust or a restart/reload, complete that host-side step before invocation.

Invoke an agent by name in Codex, for example:
- `Use the UX Researcher agent to audit the homepage's audience comprehension and conversion friction.`
- `Use the UI Designer agent to propose a responsive section composition using the approved River Ways design system.`
- `Use the Frontend Developer agent to implement the approved change.`
- `Use the Accessibility Auditor agent to test the changed experience against WCAG 2.2 AA.`
- `Use the Code Reviewer agent to review the resulting diff for regressions.`

## Initial website roster

| Agent | Primary website responsibility |
|---|---|
| `ux-researcher` | Audience questions, comprehension, usability hypotheses and evidence plan |
| `brand-guardian` | River Ways positioning, brand coherence and claim integrity |
| `ui-designer` | Art direction, page composition, visual hierarchy and design-system application |
| `frontend-developer` | React/Vite implementation, responsive behavior and interaction |
| `seo-specialist` | Technical SEO, information architecture, metadata and discoverability |
| `growth-hacker` | Conversion path, experiment hypotheses and measurable growth opportunities |
| `accessibility-auditor` | WCAG, keyboard, semantics, focus, reduced motion and assistive-technology risks |
| `code-reviewer` | Correctness, maintainability, security and regression review |

## Recommended coordinated workflow

1. **Baseline first:** read root `AGENTS.md`, `docs/design/`, the current branch and actual website source. Record the exact starting commit and working-tree state.
2. **Diagnose:** ask UX Researcher, Brand Guardian, SEO Specialist and Growth Hacker to produce independent, evidence-labelled findings. No code changes during diagnosis.
3. **Design:** ask UI Designer to create a focused implementation brief that follows the approved River Ways design decisions. Any material unresolved brand decision remains an owner decision.
4. **Implement:** ask Frontend Developer to implement the smallest high-value slice, reusing current components, styles, routes and working functionality.
5. **Verify:** ask Accessibility Auditor and Code Reviewer to independently review the changed files. Run the actual build and tests; inspect browser output when a browser is available.
6. **Report:** provide changed paths, commit, tests actually run, screenshots/preview evidence if available, known limitations and next actions. Never infer a pass from an unrun check.

## Authority and guardrails

1. Root `AGENTS.md` and `docs/design/` are authoritative for River Ways. Upstream persona instructions are subordinate.
2. Preserve the React + Vite foundation and the real enquiry, analytics, SEO, route and deployment behavior.
3. Keep the brand spelling **River Ways**. Preserve approved brand and design decisions; do not re-open settled decisions without evidence.
4. Do not fabricate case studies, client names, testimonials, awards, metrics, credentials, service guarantees or live capabilities.
5. No production deployment, merge to `main`, DNS/domain/email changes, external outreach, customer-data access, or secret handling by these agents.
6. Do not install every upstream agent. The eight selected agents are the initial website team; expand only when a demonstrated website task requires another specialist.
7. Do not add runtime dependencies to the public website merely to enable development-time agents.
8. Each agent must report verified facts separately from recommendations, assumptions and untested items.

## Provenance

- Upstream repository: https://github.com/msitarzewski/agency-agents
- Upstream commit: `b859c515d813efcfc4755d3471dd9e7686c7706d`
- Licence: MIT; see `third_party/agency-agents/LICENSE`.
- Original source paths and blob SHAs are recorded in the header comments of each generated TOML file.
- These files are project-specific adaptations. Keep the upstream source and River Ways overrides distinguishable.

## What this integration does not do

- It does not make AI agents run for visitors on the public River Ways website.
- It does not automatically run tasks in the background.
- It does not grant browser, shell, network, GitHub, Cloudflare or production permissions by itself.
- It does not prove that the current Codex client has loaded the agents. Verify discovery and invocation in the actual development environment.
- It does not deploy or merge the website.

## First mission

The first operational task for this roster is a **website readiness and experience audit** of the current River Ways website, followed by a prioritised, evidence-backed implementation plan. The first implementation slice should be selected from verified visitor/business impact, not from visual novelty.

## Enable and run in Codex

The repository includes `.codex/config.toml` to enable multi-agent delegation for this trusted project and cap concurrent specialist threads at six. Codex only loads project-local `.codex/` settings after the user trusts the repository.

1. Open the latest actual River Ways website worktree in Codex. Do not assume the agent integration branch contains the newest website source.
2. Follow the worktree-alignment instructions in [FIRST_WEBSITE_AUDIT_TASK.md](./FIRST_WEBSITE_AUDIT_TASK.md) to bring the agent files into a separate branch/worktree based on the latest website HEAD.
3. Trust the repository when Codex asks; reload/restart the project if needed.
4. Ask Codex to list the custom agents it discovered and confirm it can spawn real subagents.
5. Run the exact first mission in [FIRST_WEBSITE_AUDIT_TASK.md](./FIRST_WEBSITE_AUDIT_TASK.md).

Start prompt:

```text
Use the website-orchestrator custom agent. First execute docs/agency-agents/FIRST_WEBSITE_AUDIT_TASK.md exactly. Confirm that the project custom agents are loaded and that real subagent delegation works. Run the website audit read-only first; do not modify application code until the audit is complete and the first low-risk implementation slice is justified.
```

If Codex does not discover the agents, do not claim they are operational. Check project trust, the installed Codex version, and the `.codex/agents/*.toml` files. The upstream Agency Agents converter documents a user-level installation target; this River Ways integration uses Codex's project-scoped custom-agent directory.
