# Enquiry flow operations

The website posts project briefs to `/api/contact`. The endpoint validates and bounds input, applies a salted IP-based rate limit, stores the lead in D1, prevents identical briefs from creating duplicate rows for two minutes, records basic source/referrer/UTM attribution, assigns new leads to the `new` pipeline stage, and attempts a Resend notification. Notification requests use a stable per-lead Resend idempotency key and set the reply-to address to the submitted contact email; attribution remains in D1 rather than being copied into the email body.

## Required Cloudflare Pages configuration

Configure the following in both Preview and Production; never paste secrets into source control or chat.

- D1 database binding: `LEADS_DB`, pointing to the correct environment's database.
- Secret `RATE_LIMIT_SALT`: at least 32 characters. Check the existing value before changing it.
- Secret `RESEND_API_KEY`.
- Variable `RESEND_FROM_EMAIL`: a sender verified with Resend.
- Variable `LEAD_NOTIFICATION_EMAIL`: `akinsify0511@gmail.com` (the currently accessible enquiry inbox).

Apply `migrations/0001_leads.sql`, `migrations/0002_lead_pipeline_attribution.sql`, then `migrations/0003_lead_operations.sql` to the correct D1 database before enabling the latest endpoint. Migration 0002 adds the lead stage and attribution fields; migration 0003 adds assignment/follow-up fields, indexes, update triggers and the `ops_open_leads` view. For a partial/recovered migration, inspect `PRAGMA table_info(leads)`, indexes, triggers and views; apply only missing schema changes. SQLite does not support `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. Never blindly rerun migrations 0002 or 0003.

## What is captured

- Lead contact details and selected service goal.
- A validated journey identifier and engagement preference when the same-origin handoff URL supplies them. These minimal values are appended to the existing details field; diagnostic answers, scores and response payloads are never captured.
- Initial pipeline stage (`new`) and notification status.
- Initial landing path (including the original `/growth-diagnostic/` entry when the diagnostic hands off to the homepage), referring page origin/path, and UTM source, medium, campaign, content and term when present. Query strings and fragments are not retained in page references.
- A salted hash of the client IP for rate limiting; the raw IP is not written to the lead record.

UTM values and referrers are bounded and treated as attribution hints, not verified proof of identity or campaign performance. No ad pixels or analytics trackers are introduced by this change.

## Controlled verification

1. Confirm the Pages Function is deployed and the D1 binding is present.
2. Apply both migrations in order to the target environment.
3. Submit a clearly labelled test enquiry from the deployed site, including a test URL with UTM parameters.
4. Confirm exactly one row exists in D1 and that the stage, landing page and UTM fields are correct.
5. Confirm the notification arrived in `akinsify0511@gmail.com`.
6. Confirm the record stores the original landing path and approved UTM/journey/engagement metadata; diagnostic answers and scores remain in the browser.
7. Confirm the `ops_open_leads` view and follow-up fields are available.
8. Submit the exact same brief again within two minutes and confirm the row count does not increase.
9. Change the brief and confirm a new row is created.
10. Verify invalid input, rate limiting and missing-configuration responses.
11. Repeat separately in Preview and Production.

A successful build or HTTP response does not prove D1 and email delivery are configured. A successful Resend API response means the provider accepted the notification request; it does not prove delivery to or receipt in the destination inbox. Verify the Resend event and actual inbox arrival separately.

The visitor-facing endpoint distinguishes these outcomes:
- HTTP 200 with `notification: "sent"`: the lead was saved and the Resend API accepted the notification request.
- HTTP 202 with `saved: true` and `notification: "failed"` or `"not_configured"`: the lead was saved, but the team notification was not confirmed. The response includes a reference and an email fallback; the visitor must not be told the enquiry was lost.
- HTTP 503: the endpoint could not confirm the required save infrastructure/configuration or could not persist the lead. Treat this as an unsuccessful submission and investigate before asking the visitor to retry.

There is no background notification retry worker yet. Review pending/failed/not-configured records operationally. Do not use customer resubmission as the normal recovery process.

Do not call the live enquiry flow production-ready until the controlled test above passes.

## Troubleshooting

- `503` before save: check `LEADS_DB`, both migrations and `RATE_LIMIT_SALT`.
- `202` with `saved: true`: the brief was stored, but the email handoff failed or is not configured. Check the Resend key, verified sender and notification recipient, then use the manual email fallback. Keep the returned reference for reconciliation.
- `429`: wait for the rate window to reset; do not rotate the salt to bypass the limit.
- Missing attribution: check whether the original landing URL carried UTM tags and remember that referrers may be omitted by browsers or privacy settings.
- No email: inspect the Resend response/logs and verify sender-domain status. Never log full enquiry bodies or raw client IP addresses.
