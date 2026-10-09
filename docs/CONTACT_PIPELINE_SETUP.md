# Contact Pipeline Setup and Launch Checklist

**Status:** Implementation scaffolded; production submission is not active until the required provider configuration and DNS/terms review are complete.  
**Never change existing DNS, Google Workspace MX/TXT, nameservers or DNSSEC without a separately approved plan.**

## What is implemented in this branch

- Same-origin `POST /api/contact` on a Cloudflare Worker.
- Server-side validation, allowed-goal checks, field normalisation, request size limits and safe error responses.
- Origin check and Cloudflare Turnstile Siteverify validation.
- Email delivery through the Resend REST API.
- Honeypot field; submissions that fill it are discarded.
- The site does not report success until Resend returns an accepted email ID.
- If provider configuration is missing, the API fails closed and the interface offers the direct email fallback.
- A client-side growth readiness diagnostic does not transmit answers.
- `public/privacy/index.html` is an initial notice template; verify it against the actual final data flow and applicable law before enabling live capture.
- `.github/workflows/cloudflare-preview.yml` runs tests/builds on the implementation branch and can deploy only to a dedicated preview Worker, when the required GitHub secrets exist.

## Provider setup required

### 1. Create and configure Turnstile
1. Create a Cloudflare Turnstile widget for the test hostname only.
2. Add the **site key** as a build-time variable named `VITE_TURNSTILE_SITE_KEY` in the Cloudflare test project's build environment. If the preview is built by GitHub Actions, add this as a repository **variable** in GitHub Settings → Secrets and variables → Actions.
3. Add the corresponding **secret key** to the test Worker's secret store as `TURNSTILE_SECRET_KEY`.
4. Keep the secret out of GitHub variables, frontend variables, source files and screenshots.
5. Verify in preview that the widget renders, the token is sent, and invalid/expired tokens are rejected.

References:
- https://developers.cloudflare.com/turnstile/get-started/
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

### 2. Configure transactional email with Resend
1. Create a Resend account and choose a sender identity.
2. Add and verify an approved sending domain/sending subdomain in Resend. **Review required DNS changes before applying anything to the live zone.** Do not overwrite existing MX, SPF, DKIM, DMARC, Google Workspace, verification or DNSSEC records. Use a purpose-built sending subdomain if appropriate and approve its DNS records separately.
3. Store the API key in the Cloudflare Worker secret store as `RESEND_API_KEY`.
4. Add a `CONTACT_FROM` non-secret Worker variable such as `River Ways Website <enquiries@YOUR-VERIFIED-SENDING-DOMAIN>` only after the sender is verified.
5. The default `CONTACT_TO` value in Wrangler is `oluwafemi@riverwayse.com`; change it only if the owner approves another recipient.
6. Run a test using an agreed test mailbox, then verify successful receipt, reply-to address, spam placement, and failure handling. Check Resend's usage, privacy and retention terms before production.

References:
- Cloudflare's Resend Worker guide: https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
- Resend + Cloudflare: https://resend.com/cloudflare
- Resend API docs: https://resend.com/docs/api-reference/emails/send-email

### 3. Deploy an isolated Cloudflare preview
The GitHub Actions workflow `.github/workflows/cloudflare-preview.yml` builds and tests the branch, then deploys a separate Worker named `river-ways-pr-3-preview` on `workers.dev` when Cloudflare credentials are configured. It does not add a custom domain, change DNS/nameservers/DNSSEC, or overwrite the existing `river-ways` Worker.

To enable the deployment:
1. Open the repository's **Settings → Secrets and variables → Actions**.
2. Add repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. Create a scoped Cloudflare API token with only the permissions needed to deploy Workers; do not put the token in source code or this chat.
3. Optionally add `VITE_TURNSTILE_SITE_KEY` as a repository **variable** (it is a public site key, not a secret). Without it, the contact form should remain unavailable for direct submission and show the email fallback.
4. Push a new commit to `feat/river-ways-implementation` to run the workflow, or use **Actions → Cloudflare isolated preview** to re-run it once that workflow is available in the default branch.
5. Open the workflow run and use the deployment URL shown by Wrangler. Confirm the Worker name is `river-ways-pr-3-preview` before testing.

Contact form delivery remains intentionally fail-closed until the preview Worker's `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` and verified `CONTACT_FROM` are configured. These provider settings are not needed to preview the visual site, but live form delivery must not be claimed until it passes the acceptance tests below.

Commands for local verification:
- Build/test: `npm run check`
- Local Vite preview: `npm run preview`
- Standard deploy command: `npm run deploy` (review the resolved Wrangler configuration first; **do not use this command against the existing Worker** for the initial preview).

### 4. Rate limiting and logging
- Turnstile reduces automated abuse, but is not a replacement for edge rate limiting.
- Add a Cloudflare rate limiting rule for `POST /api/contact` in the test deployment before enabling public submission; decide the threshold based on expected traffic and avoid blocking legitimate users.
- Check Workers logs for status/error counts but do not log form bodies, emails, names or provider secrets.
- Do not add analytics/session replay to the form without a separate privacy review.

## Required acceptance tests
- Missing provider bindings -> clear non-success response and no email sent.
- Wrong/missing Origin -> 403 and no email sent.
- GET request -> 405.
- Malformed JSON / unsupported content type / oversized body -> rejected safely.
- Empty name / invalid email / invalid goal / oversized details -> rejected server-side.
- Honeypot filled -> discarded, no email sent.
- Missing, expired, reused or invalid Turnstile token -> rejected, no email sent.
- Valid test request -> one email delivered, reply-to matches validated visitor email, message contains expected fields.
- Resend failure/timeout -> non-success message; visitor receives a direct email fallback link.
- No form values exposed in public URL, browser analytics, or application logs.
- Security headers checked on preview via browser/network tooling.

## Approval boundary
Completing this document does not verify the domain in Resend, add Turnstile secrets, create a live delivery path or approve DNS records. Those are separate configuration and release steps.
