# River Ways release handoff

## Branch and review

- Repository: `godsbest656-glitch/river-ways`
- Candidate branch: `feat/enquiry-foundation`
- Review: [PR #19 — Enquiry Foundation](https://github.com/godsbest656-glitch/river-ways/pull/19)
- Production site: https://riverwayse.com/
- Accessible enquiry notification inbox: `akinsify0511@gmail.com`

## Included in the candidate

- Cloudflare Pages Function at `functions/api/contact.js`
- D1 lead/rate-limit schema and attribution migration
- Form submission through `POST /api/contact` with explicit loading, success, and failure states
- Duplicate protection, bounded field validation, honeypot, salted IP hashing for rate limits, and campaign attribution
- Service links that preselect the relevant enquiry goal
- Growth Diagnostic handoff into the project brief
- Privacy notice, 404 page, sitemap updates, baseline security headers, CI checks, and operations notes
- Replacement for the previously reported unavailable Search & AI Discovery image
- Cloudflare Pages project build configuration in `wrangler.toml`

## Not yet proven

- The candidate branch has not been deployed to a verified preview in this handoff.
- D1 binding and migrations are not confirmed in either Cloudflare environment.
- Resend credentials, verified sender, and inbox delivery are not confirmed.
- Production still requires rechecking for the older build, 405 on `POST /api/contact`, and homepage soft-404 behaviour.
- Do not expose an internal lead dashboard before authentication and authorization are implemented.

## Release sequence

1. Review PR #19 and wait for CI.
2. Configure Cloudflare Preview bindings and secrets without sharing secret values.
3. Deploy preview and verify one D1 row plus one received notification email.
4. Test duplicate handling, attribution, 404 status, image response, and accessibility.
5. Configure Production separately, merge only after review, deploy, and repeat smoke tests.
