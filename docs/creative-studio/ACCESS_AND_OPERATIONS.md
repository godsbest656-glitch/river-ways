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
| POST | `/api/studio/worker/jobs/:id` | Complete or fail a job owned by that worker identity. |
| POST | `/api/studio/worker/jobs/:id/upload` | Upload a worker-produced file to private R2 (25 MB maximum; content type allowlist; SHA-256 computed server-side). |
| POST | `/api/studio/worker/jobs/:id/assets` | Register metadata/provenance for an uploaded asset. |
| GET | `/api/studio/assets/:id/file` | Stream an asset from private R2 after staff authentication. |
| POST | `/api/studio/assets/:id/approval` | Record a staff decision against the exact asset SHA-256 and usage scope. |

## Current limitations

- The current approval endpoint is agency-staff review. A separate client reviewer role and client-facing approval portal are not implemented yet.
- Private R2 upload and authenticated file streaming are implemented, but no R2 bucket has been provisioned or bound in Preview. Asset URLs are not public or permanent.
- Worker claim is atomic, but leases, heartbeat, stale-claim recovery and bounded retry policy are not yet implemented.
- The local creative CLI is not yet connected to this API by a worker daemon.
- A Studio UI is not yet implemented.
- The API has no public signup and no client can list or access another client's records without an authorised staff identity. Tenant relationship constraints are enforced in D1; endpoint queries must continue to scope by `client_id`.

## Required Preview setup (not performed)

1. Create/identify a dedicated Preview D1 database; do not apply migration 0004 to production.
2. Configure the `LEADS_DB` Preview binding and apply migrations 0001–0004 in order after schema inspection.
3. Create Cloudflare Access applications/policies for the Studio route and API; configure staff identity allowlist and separate worker audience.
4. Provision a private R2 bucket and bind it as `CREATIVE_ASSETS`; configure the environment values above in Preview only.
5. Verify unauthenticated access is rejected and an allowlisted staff identity can create a client/project/job.
6. Verify a worker service token can claim and complete only its own jobs.
7. Verify tenant isolation and exact-asset-hash approval behavior.
8. Configure private object storage and test upload/preview before registering real creative media.
9. Do not open a pull request or create a Cloudflare Preview until the owner explicitly authorises Preview review.
