# River Ways growth-engine pilot

This directory contains the first, deliberately conservative configuration for evaluating [Harvey](https://github.com/ethanplusai/harvey) as River Ways' prospect-research and sales-workflow engine. It is kept separate from the public website: the agent is a local operational tool, not browser code and not a public Cloudflare endpoint.

## Current state

- [x] Reviewed Harvey's public repository, README, MIT licence and current `harvey.yaml` shape.
- [x] Added a River Ways-specific configuration starting point.
- [x] Email and LinkedIn sending are disabled by default.
- [ ] Install and run Harvey locally in a separate checkout.
- [ ] Validate this configuration against the exact Harvey version installed.
- [ ] Run a research-only pilot on the existing, manually curated prospect list.
- [ ] Review evidence, scores, drafts, duplicates and opt-out handling.
- [ ] Configure a suitable sending mailbox/domain and compliance review before enabling any sending.
- [ ] Connect outcomes to a durable pipeline only after the local pilot is reliable.

## Why Harvey stays separate

The website is a React/Vite app; Harvey is a Python application with its own runtime, database, dashboard and integrations. Do not bundle Harvey into the website, expose its local dashboard publicly, or put its database, mailbox credentials or model-session credentials in the frontend repository.

The upstream project currently describes a local agent that can discover and profile businesses, score fit, draft outreach, manage an approval outbox and handle replies. We will adopt the workflow concepts, not blindly transplant its internals into the website.

## First pilot: research-only

1. Install Python 3.11+ and the required model CLI/runtime documented by the installed Harvey version. Use only an account and subscription you are authorised to use.
2. Clone Harvey into a separate local directory; inspect its current README, `CLAUDE.md`, `harvey.yaml`, dependency lockfiles and tests before running it.
3. Copy `sales-engine/harvey.yaml` to the Harvey checkout's root as `harvey.yaml`. Check every field against the installed version's schema before starting. Do not commit credentials or local `.env` files.
4. Keep both channels disabled. Run only the discovery/profile/qualification steps and manually review each result.
5. Start with the existing `docs/INITIAL-PROSPECT-RESEARCH.md`; verify each live site and record a concrete, current observation before drafting anything.
6. Evaluate 20 prospects maximum across no more than two segments. Record evidence quality, fit score, useful insight, duplicate rate and whether the proposed service is genuinely deliverable.
7. Only after review, test draft generation with sending still disabled. Every factual claim must trace to a public source and every draft must have a human reviewer.

## Hard safety gates

- No autonomous sending in this pilot. Configuration explicitly disables email and LinkedIn.
- Do not use private, purchased or leaked personal data; use appropriate public business channels and minimise retained personal data.
- Honour opt-outs immediately and maintain a do-not-contact list that takes precedence over every other workflow.
- Do not automate LinkedIn actions unless the specific workflow is permitted by LinkedIn's current terms.
- Do not invent a prospect's problem, performance data, customer count, urgency or expected ROI.
- Do not promise guaranteed rankings, leads or revenue. Do not send deceptive follow-ups or pretend to have a relationship.
- Before any outbound email, confirm sender identity, applicable Nigerian and recipient-country requirements, mailbox/domain authentication and deliverability. The accessible inbox in this file is for current River Ways contact, not proof that it is suitable for cold outreach.
- Keep API keys, OAuth tokens, mailbox credentials and model-session files out of Git. Do not expose Harvey's local dashboard to the public internet.
- Pause on unexpected volume, bounce spikes, unclear consent/legal basis, unhandled replies, or any data-handling uncertainty.

## Acceptance criteria for the research pilot

- 20 or fewer records, each with company, official site, public source URL, observation, date checked, fit score, rationale and next action.
- No duplicate companies or do-not-contact matches.
- No unverified claims in notes or drafts.
- Every score can be explained using the River Ways qualification rubric in `docs/INITIAL-PROSPECT-RESEARCH.md`.
- No messages sent and no external account actions taken.
- A human-readable report recommends whether to proceed, revise the ICP, or stop.

## Next integration decision

Do not connect this local agent directly to the website's enquiry endpoint or production database. First determine the minimal shared data contract (company, contact channel, evidence URLs, consent/legal status, stage, next action, suppression state) and choose a controlled import/export path. Any future write integration must be authenticated, auditable, idempotent and least-privilege.
