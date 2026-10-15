# River Ways deployment control

## Non-negotiable release rule

A change is not "done" because it exists in a coding session or passes a local build. It is done only when the exact commit is in GitHub, checks pass, the deployment provider reports a successful deployment, and the deployed version is verified.

## Source of truth

- Repository: `godsbest656-glitch/river-ways`
- Production branch: `main`
- Current hosting target: Cloudflare Pages project `riverwayse-website`
- Production domain: `https://riverwayse.com`
- Temporary enquiry inbox: `akinsify0511@gmail.com`

Do not treat a local branch, an old Worker deployment, or a preview URL as production. Never report deployment success without checking the deployed commit/version.

## Standard change-to-production path

1. Commit and push all changes to a named branch. No release work may remain only in a local agent session.
2. Open/update a pull request to `main`.
3. GitHub Actions must pass the build, API tests and dependency audit. A failed or skipped required check is not approval.
4. Review the actual Cloudflare Pages preview for the PR commit. Test desktop and mobile, navigation, forms, console/network errors, accessibility and relevant security headers.
5. Confirm the change is ready, then merge the PR into `main`. Do not merge around failed checks.
6. The production workflow runs against the merged `main` commit, repeats build/tests/audit, deploys to Cloudflare Pages, and checks the deployment.
7. Verify the stable Pages hostname and the custom domain both serve the exact release SHA. If the Pages hostname is current but the custom domain is stale, mark the release **deployment incomplete** and fix routing; do not call it launched.
8. For changes to the enquiry system, complete the controlled end-to-end test in `docs/ENQUIRY-OPERATIONS.md`: D1 row, deduplication, notification delivery to the accessible inbox, and failure handling. Never use a real prospect's data as a test.

## GitHub configuration required once

In repository Settings:

- Create a GitHub Actions environment named `production`.
- Add environment secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. The token should be scoped to the correct account and Pages deployment permissions only. Never put credentials in source code, workflow logs, issues or chat.
- Add a required reviewer to the `production` environment if approval gating is available for this repository plan.
- Protect `main`: require pull requests and the `River Ways checks / build-and-api-tests` check; block direct pushes and force pushes where repository settings permit.
- Confirm the Cloudflare Pages project is `riverwayse-website`, production branch is `main`, and the production domain is attached to this Pages project. Resolve any overlapping Worker route before declaring the custom domain live.

The workflow intentionally fails closed if the deployment credentials or project are not configured. A failed deployment is a blocker to fix, not a reason to report success manually.

## Required release evidence

For each release, record:
- merged PR and commit SHA;
- GitHub Actions check and production workflow URLs;
- Pages deployment URL and status;
- release SHA returned by the Pages hostname;
- release SHA returned by `https://riverwayse.com`;
- browser smoke-test result;
- for enquiry changes, D1/email end-to-end evidence without exposing lead details or secrets.

## Rollback

If a release breaks the site, stop further releases, redeploy the last known-good commit through the same controlled workflow, and verify both the Pages hostname and custom domain. Do not make an untracked hotfix directly in the Cloudflare dashboard; commit it to GitHub and follow the same checks.
