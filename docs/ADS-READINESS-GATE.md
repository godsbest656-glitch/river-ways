# River Ways — Ads Readiness Gate

**Status: NOT PASSED. Do not spend on paid media until the evidence below is recorded.**

This is a hard release gate, not a recommendation to launch ads automatically. It distinguishes the ability to build a landing page from the ability to capture, attribute, respond to, and learn from paid leads.

## Current verified blockers

- The production domain `https://riverwayse.com/api/contact` returned **HTTP 405** to a non-persisting POST probe. The production enquiry endpoint is not active.
- The current Pages preview's `POST /api/contact` returned **HTTP 503** with the message that the enquiry service is not configured. The function exists, but its D1 binding is unavailable or missing in that preview.
- The Cloudflare Workers build bot has reported failed builds on the Pages integration pull request. The repository's Pages deployment workflow and the existing Worker build integration are separate paths; do not interpret these build failures as proof of slow visitor performance.
- The latest supplied mobile Lighthouse report recorded LCP at **3.9–4.9 seconds under simulated throttling**. Re-measure the actual candidate landing page before approving spend.

Re-run these checks after configuration; do not infer that a previous result has changed.

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

- [ ] The intended D1 database is bound as `LEADS_DB` in the preview and its schema migrations `0001_leads.sql` then `0002_campaign_attribution.sql` have been applied exactly once.
- [ ] A unique, private `RATE_LIMIT_SALT` of at least 32 characters is present in the preview environment.
- [ ] One labelled end-to-end test from the preview creates exactly one D1 row.
- [ ] The row contains the correct goal, original landing path and submitted UTM values.
- [ ] A real notification arrives at `akinsify0511@gmail.com` from a verified sender; the record reports notification success.
- [ ] Duplicate handling, rate limiting, malformed inputs, cross-origin requests, and missing-configuration states behave as intended.
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
