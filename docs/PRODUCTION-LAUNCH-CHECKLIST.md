# Production launch checklist

This checklist is a release gate for the River Ways website. A successful GitHub build or Pages preview does **not** mean the enquiry service is production-ready.

## 1. Configure Cloudflare Pages runtime

In Cloudflare, open **Workers & Pages → riverwayse-website → Settings**.

Configure the following for both **Preview** and **Production** environments:

- D1 database binding: variable name `LEADS_DB`, connected to the River Ways enquiry database.
- Secret `RATE_LIMIT_SALT`: a randomly generated secret of at least 32 characters. Use a different value from test/dev environments. Do not commit it or put it in client-side Vite variables.

Apply `migrations/0001_leads.sql`, `migrations/0002_campaign_attribution.sql`, then `migrations/0003_submission_idempotency.sql`, to the selected D1 database using the D1 console or Wrangler migration workflow. Confirm the `leads` table, attribution columns, and indexes exist before testing the form. Apply each migration once per environment.

Example generation command (run locally; keep the output private):

```bash
openssl rand -hex 32
```

## 2. Configure enquiry notification email

Add these as **server-side environment variables/secrets** in Cloudflare Pages for Preview and Production:

- Secret `RESEND_API_KEY`: a restricted API key with permission to send email.
- Variable `RESEND_FROM_EMAIL`: a sender address on a domain verified in Resend.
- Variable `LEAD_NOTIFICATION_EMAIL`: the inbox that should receive enquiry notifications (currently intended: `akinsify0511@gmail.com`).

Never prefix these values with `VITE_`; Vite-prefixed variables can be exposed in browser bundles. Redeploy after changing Pages bindings or variables.

## 3. Verify the preview safely

1. Open the preview URL linked from the latest successful **Cloudflare Pages preview** workflow.
2. Confirm the homepage, `/privacy/`, `/field-guide/`, and `/growth-diagnostic/` load and have the expected River Ways branding. Confirm `/growth-diagnostic/diagnostic.js` returns HTTP 200 and the assessment functions under the production Content-Security-Policy.
3. Confirm `GET /api/contact` returns HTTP 405 only after its non-mutating runtime check verifies the D1 binding, rate-limit salt and `submission_key` schema. HTTP 503 means the runtime configuration or migrations are incomplete.
4. Submit one clearly labelled internal test enquiry from the preview form.
5. Confirm the enquiry appears in D1 and the notification arrives in the intended inbox. Verify notification status and reply-to address.
6. Check that invalid input and cross-origin requests are rejected, repeated submissions are rate-limited, and a retry using the same submission key does not create a second row.
7. Delete the test enquiry in line with the retention policy after confirming the workflow.

Do not run real customer enquiries through the preview while storage or email is unconfigured. The form should clearly report that the service is unavailable and provide the direct email fallback.

## 4. Production release gates

- [ ] Latest build, API tests, browser tests, and preview smoke tests all pass.
- [ ] Production D1 binding and migration verified.
- [ ] Production `RATE_LIMIT_SALT` configured.
- [ ] Resend sender domain verified and notification delivery tested.
- [ ] Public privacy notice reviewed for actual data handling and retention practice.
- [ ] Canonical URLs, sitemap, robots directives, metadata, and redirects checked against the production domain.
- [ ] Mobile layout, navigation, form states, keyboard focus, and accessibility smoke-tested.
- [ ] Rollback plan documented and current live website preserved until cutover is verified.

Only after all gates are checked should the production domain be attached/switched and DNS changes be considered. Do not delete the existing Vercel project or alter DNSSEC as part of preview testing.

## 5. Ads-readiness gate

Do not launch paid campaigns until every must-pass condition in [the Ads Readiness Gate](./ADS-READINESS-GATE.md) is evidenced. Passing a build or loading the landing page does not count as proof of lead capture, notification delivery, or campaign attribution.
