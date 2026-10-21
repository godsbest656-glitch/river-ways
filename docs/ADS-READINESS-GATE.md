# River Ways — Ads Readiness Gate

**Status: NOT PASSED. Do not spend on paid media until the evidence below is recorded.**

This is a hard release gate, not a recommendation to launch ads automatically. It distinguishes the ability to build a landing page from the ability to capture, attribute, respond to, and learn from paid leads.

## Current verified blockers

- The production domain `https://riverwayse.com/api/contact` returned **HTTP 405** to a non-persisting POST probe. The production enquiry endpoint is not active.
- The current Pages preview's non-mutating `GET /api/contact` readiness probe returned **HTTP 503** with code `missing_database_binding`. The branch's automated Preview setup then reported Cloudflare `Authentication error [code: 10000]` when attempting to list D1 databases. The current GitHub Actions `CLOUDFLARE_API_TOKEN` can deploy Pages but needs account-scoped **D1:Edit** access before the workflow can provision/bind the dedicated Preview database. The setup step is allowed to fail without blocking static preview deployment; the Ads Gate must still fail while the database is absent.
- The Preview secrets step generated `RATE_LIMIT_SALT` and sets the notification destination to `akinsify0511@gmail.com`. The Resend API check returned HTTP 400 with `API key is invalid`. The updated workflow does not store that invalid key in Preview. The GitHub Actions `RESEND_API_KEY` secret must be replaced with a valid key; a sender is only configured when its domain is confirmed as verified.
- The Cloudflare Pages deployment workflow and the existing Worker build integration are separate paths; do not interpret a Worker build failure as proof that Cloudflare is making visitor page loads slow.
- The latest supplied mobile Lighthouse report recorded LCP at **3.9–4.9 seconds under simulated throttling**. Re-measure the actual candidate landing page before approving spend.

### Exact Preview unblock steps

1. In Cloudflare, open **Profile → API Tokens** and edit the token used by GitHub Actions. Preserve existing Pages deployment permissions and add account-scoped **D1:Edit**. Update the GitHub Actions secret `CLOUDFLARE_API_TOKEN` with that token; never paste its value into code or chat.
2. Replace the GitHub Actions secret `RESEND_API_KEY` with a newly issued, valid Resend API key (the current value returned HTTP 400, `API key is invalid`). In Resend, confirm the intended sending domain has `verified` status under Domains. Set `RESEND_FROM_EMAIL` to an address on a verified domain; never paste the key into the repository or chat.
3. Rerun the Preview workflow. Require `GET /api/contact` to return HTTP 405 with `x-river-ways-api-schema: submission-key-v1`, then verify a labelled test enquiry stores one D1 row with UTMs and delivers a real notification.

These steps are Preview-only. Do not add a production database binding, change production secrets, or alter DNS until the candidate is proven and a cutover is approved.

## The first test offer

Use the existing **Growth Diagnostic** as the initial campaign destination: a roughly four-minute, ten-question self-assessment. The answers and score stay in the visitor's browser. The assessment is directional, not an audit of live analytics or a promise of outcomes.

The intended path is:

1. Paid ad with campaign tags.
2. `/growth-diagnostic/` with the tags intact.
3. Visitor completes the assessment locally.
4. “Discuss this with River Ways” carries the UTM tags and the original landing path to the main enquiry form.
5. The server saves the enquiry and its attribution to D1; the team receives a notification through the configured email provider.
6. River Ways responds, records qualification/outcome, and uses that evidence to decide whether to continue spending.

Do not describe the self-assessment as a bespoke audit, guarantee of leads, or free consulting engagement unless that service has been explicitly defined and approved.

## Must-pass checks

### A. Site and release integrity

- [ ] The candidate release is based on an up-to-date, reviewable branch; the Pages preview serves the exact source commit indicated by `river-ways-release`.
- [ ] The preview's homepage, `/growth-diagnostic/`, its external `diagnostic.js`, `/privacy/`, and `/field-guide/` all return the intended content and HTTP 200.
- [ ] `/growth-diagnostic/` works with the deployed Content-Security-Policy, including its assessment interaction.
- [ ] HTTPS, canonical URLs, mobile navigation, keyboard interactions, and security headers are verified on the actual Pages preview.
- [ ] The live domain remains untouched until the production cutover plan has a tested rollback.

### B. Enquiry capture — hard blocker

- [ ] The intended D1 database is bound as `LEADS_DB` in the preview and its schema migrations `0001_leads.sql`, `0002_campaign_attribution.sql`, then `0003_submission_idempotency.sql` have been applied exactly once.
- [ ] The non-mutating `GET /api/contact` preflight returns HTTP 405 only when the D1 binding, private rate-limit salt, and latest idempotency schema are ready; HTTP 503 means a configuration or migration is still missing.
- [ ] A unique, private `RATE_LIMIT_SALT` of at least 32 characters is present in the preview environment.
- [ ] One labelled end-to-end test from the preview creates exactly one D1 row.
- [ ] The row contains the correct goal, original landing path and submitted UTM values.
- [ ] A real notification arrives at `akinsify0511@gmail.com` from a verified sender; the record reports notification success.
- [ ] Retrying the same submission key returns the existing result without creating a second D1 row, including concurrent retries; a new key creates a new enquiry.
- [ ] Rate limiting, malformed inputs, cross-origin requests, and missing-configuration states behave as intended.
- [ ] The operator confirms how new leads will be reviewed and responded to. Never accept a UI success message as proof of durable storage or email receipt.

### C. Measurement and privacy

- [ ] A test URL such as `/growth-diagnostic/?utm_source=google&utm_medium=cpc&utm_campaign=rw-diagnostic-test` retains the tags through the final form submission.
- [ ] UTM fields are checked in the D1 record and included in the notification.
- [ ] The public privacy notice accurately describes first-party attribution and the fact that diagnostic answers remain in the browser.
- [ ] No advertising pixels, retargeting cookies, or third-party analytics are assumed to be active. Add them only after choosing the platforms, reviewing applicable consent requirements, updating the notice, and testing the consent path.
- [ ] A lead can be joined back to its campaign without needing to purchase or infer personal data.

### D. Landing page and offer

- [ ] Run a fresh mobile performance and accessibility audit against the exact candidate preview. Resolve blocking errors and large avoidable payloads; investigate LCP before paid traffic.
- [ ] Review the diagnostic and form on a small phone screen as well as desktop.
- [ ] Confirm copy, CTA, follow-up expectations, and the boundaries of what the diagnostic does.
- [ ] Use only real, authorised portfolio evidence. No invented testimonials, results, logos, rankings, or guarantees.

### E. Campaign economics and operations

- [ ] Choose one target segment, geography, platform and campaign objective for the first test.
- [ ] Define a maximum test budget and duration explicitly before spend. Neither is assumed in this document.
- [ ] Set a baseline and review cadence for clicks, completed diagnostics, submitted enquiries, qualified leads, booked conversations and closed work. Do not equate clicks or form submissions with revenue.
- [ ] Name the person responsible for reviewing leads, set an acceptable response window, and define what happens when email notification fails.
- [ ] Confirm how the campaign will be paused if tracking, form delivery, spend or lead quality breaks its thresholds.

## Stop condition

**Ads stay on hold** until sections A–E are evidenced and the business owner approves the first campaign's offer, audience, platform, budget cap and start date. The current verified production 405 and preview 503 already fail section B. No ad campaigns or spend have been initiated by this work.
