# River Ways Demand Intelligence — implementation and operations

**Status:** Implemented behind an owner-controlled feature gate; preview/runtime activation not yet verified.

## What exists

- Public React diagnostic experience mounted in the Demand Intelligence section.
- Cloudflare Pages Function at `POST /api/ai/demand-intelligence`.
- Structured assessment response: headline, summary, observations, priorities, questions and limitations.
- Cloudflare Workers AI binding adapter. The model name can be overridden with `AI_MODEL`; default is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- Daily per-IP request limit of five, using a salted SHA-256 hash and D1 counter. Raw IP addresses and visitor prompt content are not persisted.
- Same-origin validation, bounded input, website string validation, no-store responses and safe failure states.
- Automated API tests for validation, feature gating, quota handling, structured output and model failure.

## Important boundary

This is an initial assessment from visitor-supplied context. It does not crawl a website, query search engines, inspect analytics, verify a market or save a conversation. The model is instructed not to claim that it performed those actions. The next implementation increment will add evidence-gathering tools and a controlled internal operations workflow.

## Runtime activation

The feature deliberately returns `503 feature_not_enabled` unless all of the following are true:

1. The Preview Pages environment has an `AI` Workers AI binding.
2. The Preview Pages environment has the existing `LEADS_DB` D1 binding.
3. `RATE_LIMIT_SALT` is configured and at least 32 characters.
4. `AI_DEMAND_ENABLED` is set to `true` only after the account's current Workers AI pricing, included allocation, usage limits and billing controls have been checked and approved.
5. Migration `0005_ai_demand_usage.sql` has been applied to the Preview D1 database.

Do not enable the feature or run live inference until the cost decision is explicit. A binding does not imply free or unlimited inference. Do not put model credentials in browser code or chat.

Set `AI_MODEL` only to a model identifier supported by the connected Workers AI account. Keep `AI_DEMAND_ENABLED` false in production until the Preview acceptance checks pass and production activation is separately approved.

## Preview acceptance

- [ ] Apply migrations 0001–0005 to the Preview D1 database.
- [ ] Confirm the `AI` binding resolves in the Pages Function runtime.
- [ ] Keep `AI_DEMAND_ENABLED=false`; verify the endpoint returns 503 `feature_not_enabled` without invoking the model.
- [ ] Verify missing binding, missing D1 and missing salt produce safe 503 responses.
- [ ] Review current model pricing and account limits; record owner approval before enabling.
- [ ] Enable only in Preview, submit a clearly labelled test brief and inspect the structured output for unsupported claims.
- [ ] Confirm the daily quota blocks the sixth request from the same hashed IP/day.
- [ ] Confirm no prompt, email, raw IP or other visitor personal data is written to D1.
- [ ] Test keyboard operation, mobile layout, loading, error and successful-result states.
- [ ] Keep production disabled until a separate release approval.

## Operations and next increments

1. **Evidence tools:** user-authorized website fetch, robots/sitemap inspection, metadata and page-structure extraction; every observation must retain its source and timestamp.
2. **Internal review queue:** store approved diagnostic records only after explicit visitor consent; keep public prospect data separate from private internal notes.
3. **Agent planning:** convert an approved assessment into proposed tasks with owner, rationale, evidence, priority and expected result.
4. **Approval and execution:** require human approval for outreach, CRM mutation, publishing, spending, or any external side effect.
5. **Durable workflows:** introduce a background job system only after comparing the existing Cloudflare capabilities and zero-additional-cost constraint. Do not add both Inngest and Trigger.dev.
6. **Audit and evaluation:** retain action records, model/version metadata, input provenance and outcome review without storing unnecessary sensitive content.

## Safety rules

- AI suggestions are not verified facts.
- No autonomous outbound messages, public publishing, spend, deletion or production changes.
- No private social scraping or bypassing access controls.
- No client data access without authorization and tenant isolation.
- All external side effects require explicit human approval.
