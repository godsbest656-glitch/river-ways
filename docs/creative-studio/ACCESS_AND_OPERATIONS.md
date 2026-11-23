# Creative Studio — access and API contract

## Deployment boundary

The Studio API is implemented as Cloudflare Pages Functions under `/api/studio/*`. It is not ready to expose until the migration is applied to a dedicated Preview D1 database and Cloudflare Access is configured for the Studio route and API.

The API independently verifies the `Cf-Access-Jwt-Assertion` signature against the configured Cloudflare Access team's signing keys. It validates issuer, audience, expiry and signing algorithm. Staff identities are additionally checked against an explicit email allowlist. Worker requests require the separate worker audience.

## Required environment bindings

| Name | Purpose |
|---|---|
| `LEADS_DB` | D1 binding for the existing River Ways operations database; includes migration 0004 after it is reviewed and applied to the correct environment. |
| `CREATIVE_ASSETS` | Private R2 bucket binding for generated media. Configure bucket access only for the Pages Functions worker; do not make the bucket public.
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain, hostname only. |
| `CF_ACCESS_AUD` | Access application audience tag for River Ways Studio staff. |
| `STUDIO_ALLOWED_EMAILS` | Comma-separated exact staff email allowlist. |
| `STUDIO_WORKER_AUD` | Separate Access audience tag for the private production worker service token. |

Do not commit any Access secrets or credentials. The audience values are identifiers, not bearer secrets. Configure the Studio path policy in Cloudflare Access before enabling staff use. The API still rejects requests if the Access JWT is absent or invalid.

## Implemented routes

All routes require a valid Cloudflare Access JWT. Mutations reject cross-origin browser requests.

| Method | Route | Purpose |
|---|---|---|
| GET / POST | `/api/studio/clients` | List and create agency client workspaces. |
| GET / POST | `/api/studio/projects` | List a client's projects and create a draft-brief project. |
| GET / POST | `/api/studio/jobs` | List a client's jobs and queue a production task. |
| POST | `/api/studio/worker/claim` | Atomically claim the oldest available queued job using the worker audience. |
| POST | `/api/studio/worker/jobs/:id` | Renew the five-minute lease with `outcome: heartbeat`, or complete/fail a job owned by that worker identity. |
| POST | `/api/studio/worker/jobs/:id/upload` | Upload a worker-produced file to private R2 (25 MB maximum; content type allowlist; SHA-256 computed server-side). |
| POST | `/api/studio/worker/jobs/:id/assets` | Register metadata/provenance for an uploaded asset. |
| GET | `/api/studio/assets/:id/file` | Stream an asset from private R2 after staff authentication. |
| GET | `/api/studio/assets?clientId=:id` | List metadata for one client's assets. |
| POST | `/api/studio/assets/:id/approval` | Record an agency review decision against the exact asset SHA-256 and usage scope. |

## Current limitations

- The current approval endpoint is agency-staff review. A separate client reviewer role and client-facing approval portal are not implemented yet.
- Private R2 upload and authenticated file streaming are implemented, but no R2 bucket has been provisioned or bound in Preview. Asset URLs are not public or permanent.
- Worker claim, five-minute renewable leases, stale-claim recovery and bounded retry limits are implemented in code; live service-token/worker behavior is not yet verified.
- The local worker daemon is implemented for the `project_init` task only. It claims typed jobs, renews leases, runs the existing CLI without a shell, writes an isolated local project scaffold and reports completion/failure. It does not generate campaign copy, images or video.
- The Studio UI is implemented for client/project/job management and asset preview/agency review.
- The API has no public signup and no client can list or access another client's records without an authorised staff identity. Tenant relationship constraints are enforced in D1; endpoint queries must continue to scope by `client_id`.

## Local worker setup (not yet run against a live Access application)

The worker runs on a River Ways-controlled workstation, not in Cloudflare Pages. Install Node.js 22+ and set these environment variables in the workstation's secret manager or local untracked environment (never commit them):

- `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`: Cloudflare Access service-token credentials for the dedicated worker application.
- `STUDIO_API_BASE`: required explicit HTTPS URL for the intended Preview or approved environment; the worker refuses to start without it to prevent accidental production targeting.
- `RIVER_WAYS_PRODUCTION_ROOT`: optional local output root; defaults to the repository's `production/` directory.
- `STUDIO_WORKER_POLL_MS`: optional polling interval, clamped to 1–60 seconds.

From `creative-production/`, run `npm run worker -- --once` for a single poll or `npm run worker` to keep polling. The current worker claims only `project_init` jobs. It deliberately does not execute strategy, copy, image, video or render jobs until their task adapters, approvals and runtime gates are implemented. A project setup job creates folders and a draft brief only; it does not create marketing assets or approve production.

## Required Preview setup (not performed)

1. Create/identify a dedicated Preview D1 database; do not apply migration 0004 to production.
2. Configure the `LEADS_DB` Preview binding and apply migrations 0001–0004 in order after schema inspection.
3. Create Cloudflare Access applications/policies for the Studio route and API; configure staff identity allowlist and separate worker audience.
4. Provision a private R2 bucket and bind it as `CREATIVE_ASSETS`; configure the environment values above in Preview only.
5. Verify unauthenticated access is rejected and an allowlisted staff identity can create a client/project/job.
6. Verify a worker service token can claim and complete only `project_init` jobs; other queued job types must remain untouched.
7. Verify tenant isolation and exact-asset-hash approval behavior.
8. Configure private object storage and test upload/preview before registering real creative media.
9. Do not open a pull request or create a Cloudflare Preview until the owner explicitly authorises Preview review.
