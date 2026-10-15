# Enquiry flow operations

The website posts project briefs to `/api/contact`. The endpoint validates and bounds input, applies a salted IP-based rate limit, stores the lead in D1, prevents identical briefs from creating duplicate rows for two minutes, records basic source/referrer/UTM attribution, assigns new leads to the `new` pipeline stage, and attempts a Resend notification.

## Required Cloudflare Pages configuration

Configure the following in both Preview and Production; never paste secrets into source control or chat.

- D1 database binding: `LEADS_DB`, pointing to the correct environment's database.
- Secret `RATE_LIMIT_SALT`: at least 32 characters. Check the existing value before changing it.
- Secret `RESEND_API_KEY`.
- Variable `RESEND_FROM_EMAIL`: a sender verified with Resend.
- Variable `LEAD_NOTIFICATION_EMAIL`: `akinsify0511@gmail.com` (the currently accessible enquiry inbox).

Apply `migrations/0001_leads.sql` first, then `migrations/0002_lead_pipeline_attribution.sql`, to the correct D1 database before enabling the latest endpoint. Migration 0002 adds lead stage and attribution fields. For a partial/recovered migration, inspect `PRAGMA table_info(leads)` and apply only missing columns/indexes; SQLite does not support `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` in the same way as some other databases. Run each migration once per environment.

## What is captured

- Lead contact details and selected service goal.
- Initial pipeline stage (`new`) and notification status.
- Landing path, document referrer, and UTM source, medium, campaign, content and term when present.
- A salted hash of the client IP for rate limiting; the raw IP is not written to the lead record.

UTM values and referrers are bounded and treated as attribution hints, not verified proof of identity or campaign performance. No ad pixels or analytics trackers are introduced by this change.

## Controlled verification

1. Confirm the Pages Function is deployed and the D1 binding is present.
2. Apply both migrations in order to the target environment.
3. Submit a clearly labelled test enquiry from the deployed site, including a test URL with UTM parameters.
4. Confirm exactly one row exists in D1 and that the stage, landing page and UTM fields are correct.
5. Confirm the notification arrived in `akinsify0511@gmail.com`.
6. Submit the exact same brief again within two minutes and confirm the row count does not increase.
7. Change the brief and confirm a new row is created.
8. Verify invalid input, rate limiting and missing-configuration responses.
9. Repeat separately in Preview and Production.

A successful build or HTTP response does not prove D1 and email delivery are configured. Do not call the live enquiry flow production-ready until the controlled test above passes.

## Troubleshooting

- `503` before save: check `LEADS_DB`, both migrations and `RATE_LIMIT_SALT`.
- `503` with `saved: true`: the brief was stored, but the email handoff failed or is not configured. Check the Resend key, verified sender and notification recipient, then use the manual email fallback.
- `429`: wait for the rate window to reset; do not rotate the salt to bypass the limit.
- Missing attribution: check whether the original landing URL carried UTM tags and remember that referrers may be omitted by browsers or privacy settings.
- No email: inspect the Resend response/logs and verify sender-domain status. Never log full enquiry bodies or raw client IP addresses.
