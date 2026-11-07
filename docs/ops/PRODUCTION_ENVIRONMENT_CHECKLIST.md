# River Ways — Production Environment Readiness Checklist

**Purpose:** deployment preparation only. This document does not authorise a deployment.

## Verified code-side state

- Contact endpoint: `functions/api/contact.js`.
- Initial D1 schema: `migrations/0001_leads.sql`.
- Attribution migration: `migrations/0002_lead_pipeline_attribution.sql`.
- Lead operations migration: `migrations/0003_lead_operations.sql`.
- Browser form posts JSON to same-origin `/api/contact`.
- API validates origin when supplied, content type, body size, required fields, email, control characters, honeypot, duplicate submissions and rate limits.
- Raw client IP is not stored; the endpoint stores a salted SHA-256 hash for rate limiting.
- Notification is sent through Resend when configured. A lead is saved even if the email notification cannot be confirmed; the response clearly reports that state.
- Unit tests cover valid submissions, cross-origin rejection, attribution, duplicate handling, rate limits, honeypot, invalid payloads, provider failure and missing configuration.

## Required Cloudflare Pages configuration

| Setting | Required value | Current evidence |
|---|---|---|
| Build command | `bun run build` (or equivalent `npm run build`) | Build script exists and generates `dist` |
| Build output | `dist` | `wrangler.toml` declares `./dist` |
| Compatibility date | `2026-10-06` | Present in `wrangler.toml` |
| D1 binding | `LEADS_DB` | Not configured in repository; dashboard binding not verified |
| D1 database ID | Exact environment-specific ID | Unknown; do not invent |
| `RATE_LIMIT_SALT` | Secret, at least 32 characters | Not configured/verified |
| `RESEND_API_KEY` | Resend secret | Not configured/verified |
| `RESEND_FROM_EMAIL` | Verified sender identity in Resend | Not selected/verified |
| `LEAD_NOTIFICATION_EMAIL` | `akinsify0511@gmail.com` | Intended notification inbox from project decisions |

Do not put secrets or an unverified database ID into Git. Keep Preview and Production bindings and secrets separate.

## D1 migration procedure

1. Identify the exact Preview D1 database and inspect its current schema.
2. Run `PRAGMA table_info(leads)` and inspect existing indexes, triggers and views.
3. Apply `0001_leads.sql` only if the base schema is absent.
4. Apply `0002_lead_pipeline_attribution.sql` only if its columns are absent. SQLite does not support `ADD COLUMN IF NOT EXISTS`; do not blindly rerun it.
5. Apply `0003_lead_operations.sql` only if its columns, triggers and view are absent.
6. Run the migration validator and a controlled Preview enquiry.
7. Repeat the inspection and migration process for Production only after Preview is verified and the owner authorises it.

The repository migration validator uses an in-memory SQLite database to test migration syntax, required columns, indexes, triggers, the operations view, defaults and constraints. It does not prove that a Cloudflare D1 environment has received these migrations.

## End-to-end acceptance tests before release

- Submit a valid enquiry and confirm one D1 row is created.
- Confirm the row has stage `new` and accurate attribution.
- Confirm the notification reaches the intended inbox from the verified sender.
- Confirm a repeated identical brief within two minutes does not create a duplicate.
- Confirm a sixth attempt in the same rate-limit window is rejected.
- Confirm a honeypot submission is silently discarded.
- Confirm an email-provider failure does not lose the stored lead and is not reported as a sent notification.
- Confirm missing D1 or salt configuration returns a safe service-unavailable response.
- Confirm the Contact page opens the existing homepage form at `/#contact`.
- Confirm the public privacy notice matches the final deployed configuration.

## Release blockers

- Preview and Production D1 IDs/bindings are not verified here.
- Migrations have not been applied to any Cloudflare environment by this work.
- Resend API key, verified sender and delivery have not been verified.
- The production hosting/source-of-truth relationship still requires owner-side confirmation.
- No preview or production deployment was performed.
- Final end-to-end testing and explicit owner release approval remain mandatory.
