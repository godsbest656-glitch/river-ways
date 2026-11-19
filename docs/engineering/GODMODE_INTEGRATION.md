# GodMode integration — River Ways

**Status:** Project rules are committed on this branch. Local Codex installation and live acceptance remain pending.  
**Selected upstream:** [NoobyGains/godmode](https://github.com/NoobyGains/godmode)  
**Alternative assessed:** [arbazkhan971/godmode](https://github.com/arbazkhan971/godmode)

## 1. Decision

Use **NoobyGains/godmode** as the primary workflow plugin for River Ways.

The deciding factors are its Codex installation path, project-level `AGENTS.md` bootstrap, rationale and intent discovery, source grounding, small task plans, test-first execution, review stages and evidence-based completion.

The alternative has a broader skill catalogue and specialist agents. Do not install both packages. Their overlapping planning and review rules can conflict.

GodMode is a development workflow. It is not a River Ways website dependency. Do not add it to `package.json`.

## 2. Installation

Run these commands in the River Ways Codex environment:

```bash
codex plugin marketplace add https://github.com/NoobyGains/godmode
codex plugin add godmode@godmode
```

Restart Codex after installation. Run `$godmode:doctor`. Use `/skills` to confirm that the required skills are available.

Do not report the plugin as active until both checks pass. If the plugin is not available, follow the workflow in this document and in the root `AGENTS.md`.

## 3. Required execution sequence

1. **Rationale:** State the user problem, expected value, scope and reason for the change.
2. **Intent:** Resolve material ambiguity. Write one obligation in each requirement.
3. **Grounding:** Inspect the current source. Verify changing platform facts against authoritative documentation.
4. **Plan:** Name the files, inputs, outputs, dependencies, tests, commands and expected results for each task.
5. **Baseline:** Run a test or record current behavior before code changes.
6. **Implementation:** Make one coherent change at a time on a topic branch.
7. **Review:** Check requirement compliance, code quality, security, privacy and regression risk.
8. **Verification:** Run the exact checks for the changed area. Record the command, result and commit SHA.
9. **Close:** Mark a requirement complete only when its acceptance criteria and evidence pass. Record blockers and deferred work.

## 4. ASD-STE100 writing rules

- Use short, direct sentences.
- Use active voice and present tense.
- Name the actor when an instruction needs an actor.
- Use one requirement or instruction in each sentence.
- Use familiar words. Define technical terms before use.
- Avoid vague terms unless a measurable limit defines them.
- State the condition, action, limit and expected result.
- Give each requirement a unique ID and a verification method.

ASD-STE100 supports clear technical communication. It does not replace product judgement, software specifications, security analysis or the River Ways design authority.

## 5. River Ways controls

- Follow the root `AGENTS.md` and the canonical design documents.
- Preserve SHAPED CURRENT / Route 2 — Editorial Intelligence.
- Preserve enquiry capture, D1 behavior, notifications, SEO, analytics, routes, accessibility and release assumptions.
- Do not invent client evidence, performance claims, credentials or project status.
- Never commit secrets or customer data.
- Do not change production DNS, Cloudflare settings, D1 production data or deployment settings without owner approval.
- Do not open or update a pull request until the owner authorises Preview review.
- Do not merge or deploy without owner approval.
- Do not claim a test, review, Preview or deployment succeeded without evidence from the exact commit.

## 6. Completion record

Record these fields for each material task:

| Field | Required evidence |
|---|---|
| Requirement | Unique ID and approved statement |
| Baseline | Current behavior and test or reproduction |
| Change | Files and commit SHA |
| Verification | Exact command and observed result |
| Review | Requirement, quality and security review |
| Risk | Regression, security, privacy and deployment impact |
| Outcome | Pass, fail, blocked or deferred |
| Next action | Named task or owner decision |

Use the existing project checks. A passing build does not prove browser behavior, Cloudflare routing, remote D1 state, email delivery or production readiness.

## 7. Acceptance gates

- [x] Select one upstream plugin.
- [x] Record the selection and the reason.
- [x] Add the workflow and ASD-STE100 rules to `AGENTS.md`.
- [x] Record the current branch and pull-request reconciliation.
- [ ] Install the plugin in the user's Codex environment.
- [ ] Pass `$godmode:doctor` and confirm skill discovery.
- [ ] Run a low-risk task through the plugin.
- [ ] Confirm that the plugin does not conflict with River Ways project skills or release controls.

**Current result:** The repository workflow is documented and committed. The local plugin is not installed or verified by this change. No website runtime code, production configuration or deployment changed.
