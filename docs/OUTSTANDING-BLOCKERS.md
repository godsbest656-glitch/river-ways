# River Ways — outstanding release blockers

Last reviewed: 2026-10-15

## Current status

The code in this branch is a candidate release, not a verified production release. Local automated tests and GitHub Actions can establish code quality, but they do not prove that Cloudflare Pages has the right production branch, bindings, database migrations, or email credentials.

The live site was previously observed serving an older build: the homepage did not contain the `/api/contact` integration, `POST /api/contact` returned `405`, and unknown paths returned the homepage with `200`. Recheck these observations after a deployment; do not assume they have changed.

## Release gates

- [ ] Confirm Cloudflare Pages project and production branch.
- [ ] Confirm the preview and production environments separately.
- [ ] Create/identify the D1 database and bind it as `LEADS_DB` in both environments.
- [ ] Apply `migrations/0001_leads.sql`, then `migrations/0002_lead_pipeline_attribution.sql`, once per database. Check migration history and table columns before rerunning a partially applied migration.
- [ ] Set `RATE_LIMIT_SALT` to a high-entropy value of at least 32 characters in both environments. If a value already exists, verify it before rotating it.
- [ ] Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL` in both environments. Use the currently accessible notification inbox `akinsify0511@gmail.com`.
- [ ] Confirm the sender identity is verified with Resend. Do not paste credentials into issues, commits, chat, or logs.
- [ ] Deploy a preview and submit one clearly labelled test enquiry.
- [ ] Verify exactly one D1 lead row, correct stage/source/UTM attribution, and a received notification email.
- [ ] Repeat the test for duplicate handling and confirm no duplicate row is created for an identical brief submitted within the duplicate window.
- [ ] Verify a missing email configuration produces a clear, truthful failure state and never claims the team was notified.
- [ ] Verify unknown routes return a real 404 status, not the homepage with status 200.
- [ ] Verify the Search & AI Discovery image responds successfully and that the homepage metadata points to a working social image.
- [ ] Run a production smoke test after approval to merge and deploy.

## DNS and mail policy

No DNS, MX, SPF, DKIM, or DMARC records should be changed as part of this website release. The prior DNS review reported that the apex had a site-verification token and a DKIM key but no SPF record. Adding SPF is a separate mail-deliverability decision and requires reviewing all legitimate senders for the domain first.

## Security boundary

Lead data must not be exposed through an unauthenticated dashboard or read API. Keep the internal pipeline private until access control is designed, implemented, and tested. Public-source demand discovery must respect source terms, privacy requirements, and rate limits; outbound contact remains human-reviewed.

## Definition of done

Do not describe the enquiry system as operational until a deployed test proves both durable D1 storage and actual email receipt. A successful browser message alone is not evidence of either.
