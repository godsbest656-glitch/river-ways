# Enquiry flow operations

The website posts project briefs to the Cloudflare Pages Function at \`/api/contact\`. The endpoint validates and bounds input, applies a salted IP-based rate limit, stores the lead in D1, prevents identical submissions from creating duplicate rows for two minutes, and attempts a Resend notification.

## Required Cloudflare Pages configuration

Configure the following in both Preview and Production; never paste secrets into source control or chat.

- D1 database binding: \`LEADS_DB\`, pointing to the correct environment's database.
- Secret \`RATE_LIMIT_SALT\`: at least 32 characters. Check the existing value before changing it.
- Secret \`RESEND_API_KEY\`.
- Variable \`RESEND_FROM_EMAIL\`: a sender verified with Resend.
- Variable \`LEAD_NOTIFICATION_EMAIL\`: \`akinsify0511@gmail.com\` (the currently accessible enquiry inbox).

Apply \`migrations/0001_leads.sql\` to the correct D1 database before enabling submissions. For future migrations that add columns, inspect \`PRAGMA table_info(leads)\` and run each migration once per environment; SQLite does not support \`ALTER TABLE ... ADD COLUMN IF NOT EXISTS\` in the same way as some other databases.

## Controlled verification

1. Confirm the Pages Function is deployed and the D1 binding is present.
2. Submit a clearly labelled test enquiry from the deployed site.
3. Confirm exactly one row exists in D1 for the submission.
4. Confirm the notification arrived in \`akinsify0511@gmail.com\`.
5. Submit the exact same brief again within two minutes and confirm the row count does not increase.
6. Change the brief and confirm a new row is created.
7. Verify invalid input, rate limiting and missing-configuration responses.
8. Repeat separately in Preview and Production.

A successful build or HTTP response does not prove D1 and email delivery are configured. Do not call the live enquiry flow production-ready until the controlled test above passes.

## Troubleshooting

- \`503\` before save: check \`LEADS_DB\` and \`RATE_LIMIT_SALT\`.
- \`503\` with \`saved: true\`: the brief was stored, but the email handoff failed or is not configured. Check the Resend key, verified sender and notification recipient, then use the manual email fallback.
- \`429\`: wait for the rate window to reset; do not rotate the salt to bypass the limit.
- No email: inspect the Resend response/logs and verify sender-domain status. Never log full enquiry bodies or raw client IP addresses.
