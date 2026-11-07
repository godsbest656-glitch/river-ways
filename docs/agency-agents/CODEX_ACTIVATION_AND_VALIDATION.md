# Codex Activation and Runtime Validation

## What this repository provides

- Nine project-scoped custom agent definitions in `.codex/agents/*.toml`.
- Project-local multi-agent settings in `.codex/config.toml`.
- Repository-wide instructions in `AGENTS.md`.
- A Python validator and regression tests that check the agent TOML metadata and required fields.

These are **development-time Codex agents**. They are not a deployed website feature, visitor-facing chatbot, autonomous production operator, or proof that the current Codex client has loaded the definitions.

## Requirements from the current Codex documentation

1. Project-scoped agents are defined as individual TOML files under `.codex/agents/`.
2. Every custom agent TOML must contain non-empty `name`, `description`, and `developer_instructions` fields.
3. Project-level `.codex/config.toml` is loaded only after the user trusts the project.
4. The `[agents]` table controls multi-agent behavior. River Ways sets `enabled = true` and `max_concurrent_threads_per_session = 6`.
5. Spawned agents inherit the parent session's permissions, provider, and MCP servers. An instruction saying “read-only” is not a security sandbox or a separate permission boundary. Set appropriate parent-session approval and sandbox controls before starting work.

Official references:
- https://learn.chatgpt.com/docs/agent-configuration/subagents
- https://learn.chatgpt.com/docs/config-file/config-basic
- https://learn.chatgpt.com/docs/config-file/config-reference

## Owner activation procedure

Run these steps in the local Codex app, IDE extension, or CLI using the intended River Ways worktree:

1. Open the intended worktree, not a stale clone or the older agent-only branch.
2. Verify the active branch and HEAD. Preserve uncommitted work and compare the local visual candidate before selecting a website baseline.
3. Trust the repository when Codex prompts for project trust. Do not trust an unexpected or unverified checkout.
4. Reload/restart the Codex session if the project configuration or agent files were added while the session was already open.
5. Ask Codex to enumerate the project custom agents it has actually loaded. Confirm the names match the nine files in `.codex/agents/`.
6. Ask it to run a small, read-only task with `ux-researcher`, then a second independent read-only task with `seo-specialist`. Confirm the selected custom identities and returned work are visible in the Codex session.
7. Request a coordinated read-only run from `website-orchestrator`, explicitly asking it to delegate separate work to UX Researcher, Brand Guardian, SEO Specialist, Growth Hacker, Accessibility Auditor and Code Reviewer. Confirm real subagent activity/results; a written claim without visible runtime evidence is not sufficient.
8. Run `docs/agency-agents/FIRST_WEBSITE_AUDIT_TASK.md` against the latest reconciled website worktree.
9. Only after runtime activation and the audit are verified should implementation work proceed in small reviewed slices.

## Release and safety gates

- Keep all work on a topic branch.
- Do not open or update a PR until the owner authorises Preview review; PR activity triggers the Cloudflare Pages Preview workflow.
- Do not merge, deploy, alter DNS, change production configuration, expose secrets, access customer records, or send external outreach.
- Parent-session permissions govern the spawned agents. Use the least privilege and approval controls appropriate to the task.
- A passing TOML validator or CI run proves file structure and repository checks only. It does not prove that Codex loaded the agents, that subagents were actually spawned, that the local worktree is current, or that the live website is ready.

## Evidence record

Record the following in the audit report:
- Codex client and version.
- Worktree path, branch, and exact HEAD SHA.
- Whether project trust was confirmed and whether a reload was required.
- Exact list of agents discovered by Codex.
- Which specialist tasks were actually spawned and their returned results.
- Parent permission/sandbox mode used.
- Commands, test results, browser evidence, unresolved issues, and owner decisions.

Never fill an evidence field from assumption. Use “not verified” when no evidence exists.
