# River Ways — outstanding release blockers

Last reviewed: 4 November 2026

## Current candidate

- Candidate branch: `design/shaped-current-rebuild`
- Pull request: [#31 — Redesign River Ways around SHAPED CURRENT](https://github.com/godsbest656-glitch/river-ways/pull/31)
- Hosting target: Cloudflare Pages project `riverwayse-website`
- Candidate homepage: React 18 + Vite 6; the existing Growth Diagnostic and Privacy pages remain static documents.
- Verified route inventory for this repository candidate: `/`, `/growth-diagnostic/`, and `/privacy/`. Unknown paths must return a real 404. Do not invent additional routes or imply that the missing multiroute bundle is present.

## Latest verified preview status

The first PR preview deployment succeeded and served the exact source commit `babe82f802093517b68254eaa36617ea1448de2b` at:

`https://pr-31.riverwayse-website.pages.dev/`

On that preview commit:
- Homepage returned HTTP 200 and rendered the new Creative Demand Engineering proposition.
- `/growth-diagnostic/` returned HTTP 200 and rendered all ten assessment questions.
- `/privacy/` returned HTTP 200.
- An unknown path returned HTTP 404 with the River Ways 404 document.
- The build, enquiry API tests, and high-severity dependency audit passed.
- The preview deployment workflow failed its final enquiry readiness probe: a non-persisting POST to `/api/contact` returned HTTP 503 instead of the expected HTTP 415. The response was the endpoint's generic temporary-unavailability message.

The 503 does not identify which binding or secret is missing. Verify the actual Cloudflare Pages Preview environment; do not guess. The latest homepage and static-page styling changes have been pushed after this first preview and must be re-built and re-verified at the updated PR preview SHA.

## Current production observation

The canonical domain has not been changed by this redesign. A live check on 4 November 2026 confirmed:
- `https://riverwayse.com/` still serves the older homepage, not the SHAPED CURRENT candidate.
- A GET request to `https://riverwayse.com/api/contact` returns the homepage HTML with HTTP 200 instead of an API method response. The current production routing/Worker path is therefore not serving the Pages Function at that URL.
- The previously configured catch-all Worker route for `*riverwayse.com/*` is a specific item to inspect in Cloudflare. Confirm whether it is still active and whether it is intercepting the Pages custom domain before release. Do not remove or change it without verifying the intended Pages route and rollback path.

The Pages preview host is separate from the canonical domain. A successful preview deployment does not prove that `riverwayse.com` will serve the same release.

## Required before production

- [ ] Confirm the Preview and Production environments are configured independently.
- [ ] Bind the correct D1 database as `LEADS_DB` in each environment.
- [ ] Apply `migrations/0001_leads.sql`, then `migrations/0002_lead_pipeline_attribution.sql`, once to each environment's database. Inspect migration history and `PRAGMA table_info(leads)` before attempting recovery from a partial migration.
- [ ] Set a high-entropy `RATE_LIMIT_SALT` of at least 32 characters in each environment.
- [ ] Configure `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL=akinsify0511@gmail.com` in each environment.
- [ ] Confirm the current Resend key is valid and the sender domain is verified. An earlier release audit recorded an invalid-key response; do not assume an existing secret is valid without testing it.
- [ ] Re-run the preview readiness probe and require HTTP 415 from the non-persisting invalid-content-type POST.
- [ ] Submit one clearly labelled internal test enquiry in Preview. Confirm exactly one D1 row, correct stage and UTM attribution, and actual receipt of the notification email.
- [ ] Submit the same brief again within the duplicate window and confirm no second row is created.
- [ ] Verify validation, honeypot handling, rate limiting, and truthful failure states.
- [ ] Re-check all three routes, the 404 response, metadata, sitemap, robots directives, mobile navigation, keyboard use, reduced motion, and image loading on the latest preview.
- [ ] Verify the final release SHA on both `riverwayse-website.pages.dev` and `riverwayse.com` after production deployment.

## Production and DNS safety

No production deployment has been made by this redesign work. Do not merge or deploy while the enquiry service is unverified. No DNS, MX, SPF, DKIM, DMARC, DNSSEC or Worker-route changes are part of this release. Preserve the current live deployment until the candidate is proven and the production release can be verified end to end.

## Security boundary

Lead data must not be exposed through an unauthenticated dashboard or read API. Keep the internal pipeline private until access control is designed, implemented and tested. Public-source demand discovery must respect source terms, privacy requirements and rate limits; outbound contact remains human-reviewed.

## Definition of done

The website is not complete merely because it builds or a preview URL exists. Completion requires a verified preview, working D1 persistence and Resend notification, successful quality gates, an approved production release, and confirmation that the live domain serves the exact deployed commit.
