# GodMode integration — River Ways

**Status:** Integration foundation committed; local Codex installation and live acceptance remain pending.
**Selected upstream:** [NoobyGains/godmode](https://github.com/NoobyGains/godmode)
**Alternative assessed:** [arbazkhan971/godmode](https://github.com/arbazkhan971/godmode)

## 1. Decision

Use **NoobyGains/godmode** as the primary workflow plugin for River Ways.

The deciding factors are its explicit Codex installation path, project-level `AGENTS.md` bootstrap, current-source grounding, rationale and intent discovery, small verifiable task plans, persistent delegated-execution ledger, test-first execution, two-stage review, cross-model review, and evidence-based completion gate.

The alternative from `arbazkhan971` has a broader catalogue (135 skills and 7 specialist agents) and useful measure/modify/verify/revert workflows. It is not installed alongside the selected project. Running both would duplicate planning, review, and completion controls and would increase instruction conflicts.

This is an engineering-workflow integration. GodMode is not a runtime dependency of the River Ways website and must not be added to `package.json`.

## 2. Installation on the Codex workstation

Run these commands in the River Ways development environment after confirming the Codex CLI is available:

```bash
codex plugin marketplace add https://github.com/NoobyGains/godmode
codex plugin add godmode@godmode
```

Start a new Codex session. Run `$godmode:doctor` and resolve any reported setup issue. Use `/skills` to confirm that the skills are discoverable.

The plugin repository documents that Codex does not use its session-start hook. The root `AGENTS.md` is therefore the project bootstrap and remains authoritative if the plugin is not installed. Do not claim the plugin is active until the workstation checks pass.

## 3. Operating sequence

Apply the following sequence to each substantial River Ways workstream:

1. **Rationale:** State the user/business problem, expected value, scope, and why existing functionality cannot solve it.
2. **Intent and requirements:** Resolve material ambiguity. Write requirements with one clear obligation per statement.
3. **Grounding:** Verify changing platform, API, framework, and deployment facts against current authoritative sources. Record sources in the plan.
4. **Plan:** Create small tasks. Each task names the files, inputs, outputs, dependencies, test, command, and expected result.
5. **Build test-first:** Establish a failing test or a reproducible baseline before implementation. Make atomic changes on a topic branch.
6. **Review:** Check specification compliance, then code quality and security. Use a second model family where available; record when it is not available.
7. **Verify:** Run the exact checks for the affected area. Preserve command output and commit identity.
8. **Close:** Mark a task complete only when its acceptance criteria and evidence are present. Record deferred work and blockers.

## 4. ASD-STE100-compatible writing rules

Use controlled, direct English in requirements and task records:

- Use one instruction or requirement per sentence.
- Use a named actor and an observable action.
- Use present tense and active voice.
- Use approved, familiar words where practical.
- Define technical terms and abbreviations before use.
- Avoid vague terms such as "properly", "seamlessly", "robust", "intuitive", and "complete" unless a measurable criterion defines them.
- State conditions, limits, failure behavior, and expected results.
- Give each requirement a unique identifier and a verification method.

ASD-STE100 is a controlled-language method. It does not replace product judgement, software specifications, safety analysis, or the repository's existing design authority.

## 5. River Ways non-negotiable controls

- Follow the root `AGENTS.md` and all applicable design, engineering, privacy, and operations documents.
- Preserve the approved SHAPED CURRENT direction. Do not restart route exploration.
- Preserve enquiry capture, D1 behavior, notifications, SEO, analytics, routes, accessibility, and existing release assumptions.
- Do not invent client evidence, performance claims, credentials, or project status.
- Never commit secrets or customer data.
- Do not modify production DNS, Cloudflare settings, D1 production data, or deployment configuration without explicit owner approval.
- Work on topic branches. Do not push unreviewed changes to `main`.
- Do not open or update a pull request until the owner authorises Preview review. Pull-request activity can trigger a Cloudflare Pages Preview.
- Never claim a test, review, preview, deployment, or integration succeeded without fresh evidence from the exact candidate commit.

## 6. Verification and completion record

For each implementation cycle, record:

| Field | Required evidence |
|---|---|
| Requirement | Unique ID and approved statement |
| Baseline | Current behavior and reproduction or test |
| Change | Files changed and commit SHA |
| Verification | Exact command and observed result |
| Review | Spec review and quality review |
| Risk | Regression, security, privacy, and deployment impact |
| Outcome | Pass, fail, blocked, or deferred |
| Next action | Named task or explicit owner decision |

Use the repository's existing checks. For website changes, consult the route, browser, accessibility, API, portfolio, migration, and release requirements in `AGENTS.md`. A passing build alone does not prove browser behavior, Cloudflare behavior, D1 migration state, or email delivery.

## 7. Acceptance gates for this integration

- [x] Select one upstream workflow plugin and document the reason.
- [x] Add the integration rules to the repository's agent instructions.
- [ ] Install the plugin in the user's Codex environment.
- [ ] Pass `$godmode:doctor` and confirm skill discovery.
- [ ] Run a low-risk test task and confirm rationale, planning, test-first execution, review, and completion evidence.
- [ ] Confirm that the plugin does not conflict with River Ways' project skills or release controls.

**Current state:** The GitHub integration branch contains the written integration foundation. The local plugin is not installed or verified by this change. No website code, production configuration, or deployment was changed.
