# Postiz social publishing integration

**Status:** Architecture and implementation foundation  
**Upstream:** https://github.com/gitroomhq/postiz-app  
**Upstream licence:** AGPL-3.0  
**Decision:** Integrate Postiz as a separately deployed publishing service. Do not merge or vendor the Postiz application into the River Ways website repository.

## Product intent

River Ways Creative Studio should become the client-facing control surface for campaign content and publishing. Postiz supplies the social-channel connection, publishing, scheduling and analytics engine. River Ways remains responsible for client relationships, campaign briefs, creative production, review/approval, permissions and reporting context.

The intended workflow is:

1. A client/campaign workspace is created in River Ways.
2. Creative assets and platform-specific copy are prepared and attached to a campaign.
3. A reviewer approves the exact platform variants and schedule.
4. River Ways submits approved posts to Postiz through a server-side integration.
5. Postiz publishes through official platform integrations and reports post state.
6. River Ways reconciles delivery status and available analytics into its campaign view.

**No post may be published solely because AI generated it.** Publishing must require an explicit human approval for the exact content, media, destination accounts and scheduled time.

## System boundary

- **River Ways website:** React 18 + Vite 6 on Cloudflare Pages. Cloudflare Pages Functions are the integration boundary, not the Postiz runtime.
- **Postiz:** separate service on infrastructure that supports its full runtime and dependencies. The upstream project documents a Next.js/NestJS monorepo using PostgreSQL, Prisma and Temporal; the self-hosted deployment also requires supporting services such as Redis and media storage.
- **Credentials:** Postiz API credentials stay in server-side secrets. Never place them in Vite-prefixed client variables, browser storage, source code, HTML, logs or client responses.
- **Social authentication:** connect accounts through Postiz's official OAuth/provider flows. Do not collect social passwords or scrape websites to publish.
- **Persistence:** River Ways stores its own campaign, approval, external-post mapping and audit events. Postiz remains the publishing system of record for channel integrations and delivery state.

## Integration contract

Use the Postiz Public API, with a configurable base URL:

- Cloud: https://api.postiz.com/public/v1
- Self-hosted: https://<POSTIZ_HOST>/api/public/v1

The API uses the Authorization header. Relevant documented operations include:

- GET /integrations — connected channels.
- POST /upload — upload media.
- POST /posts — create immediate, draft or scheduled posts.
- GET /posts — list posts.
- DELETE /posts/:id — delete a post.
- Analytics endpoints — available platform/post analytics, subject to provider scopes.

The API distinguishes the platform-specific settings using a settings.__type discriminator. Each destination needs a valid Postiz integration ID and provider-specific settings. Do not assume one generic payload works across all channels. Validate each supported provider's settings and media constraints.

Official API reference: https://docs.postiz.com/public-api

## Security and tenant isolation

This repository currently has no verified user authentication, role/permission model or client-workspace isolation. Therefore the publishing API **must not be exposed to anonymous visitors or called directly from the browser**.

Before enabling client-facing publishing, implement and test:

- Authenticated sessions and server-side authorization on every /api/social/* route.
- Roles such as agency administrator, campaign editor, approver and read-only client.
- Tenant/workspace ownership checks for every campaign, asset, Postiz integration and external post.
- Explicit account grants mapping each River Ways workspace to allowed Postiz channels.
- Approval records that bind the approved content/media/channel/time to a content hash; any subsequent edit invalidates approval.
- CSRF/origin protection for cookie-authenticated mutation routes, rate limiting and request-size limits.
- Audit events for account connection, draft creation, approval, scheduling, publishing, cancellation and failures.
- Secret redaction and no access tokens in logs or client-visible payloads.
- Webhook signature/secret validation where supported, plus idempotent event processing.

Do not implement a single global Postiz API key as a substitute for tenant isolation. For a first internal pilot, one agency-owned Postiz workspace may be used only behind an authenticated agency-admin surface. Client workspaces must not be allowed to see one another's channels, media or posts.

## Proposed River Ways API surface

All routes are server-side Cloudflare Pages Functions. These are proposed contracts, not currently implemented endpoints.

- GET /api/social/status — feature readiness and connection health, no secrets.
- GET /api/social/channels — channels visible to the authorized workspace.
- POST /api/social/media — validate and upload approved campaign media.
- POST /api/social/posts — create a draft or schedule a previously approved post.
- GET /api/social/posts — list workspace posts by date/status.
- POST /api/social/posts/:id/approve — record an approval bound to the exact content hash.
- POST /api/social/posts/:id/cancel — cancel where supported.
- POST /api/social/webhooks/postiz — receive and reconcile publishing events.

The server must map River Ways workspace IDs to authorized Postiz credentials and channel IDs. Never accept an arbitrary Postiz integration ID from an untrusted browser request without checking the workspace grant.

## Environment configuration

Names reserved for the server-side deployment:

- POSTIZ_BASE_URL
- POSTIZ_API_KEY (agency-only pilot; never expose to client)
- SOCIAL_PUBLISHING_ENABLED (default false)
- SOCIAL_WEBHOOK_SECRET
- SOCIAL_MEDIA_MAX_BYTES

These are not configured in any environment by this change. Do not add real secrets to .env, GitHub, or this repository.

## Delivery plan

### Phase 0 — Foundation (this change)
- Record the system boundary, API contract, licence, security requirements and release gates.
- Keep the publishing feature disabled and do not change production.

### Phase 1 — Deploy and prove Postiz independently
- Choose a VPS/container host; Cloudflare Pages is not the Postiz application host.
- Deploy the official upstream Docker setup with PostgreSQL, Redis, Temporal and durable media storage as required by the current upstream deployment guide.
- Pin a reviewed upstream release/image; establish backups, TLS, health checks, update and restore procedures.
- Create provider developer applications and complete OAuth/provider approval for the first selected channels.
- Verify channel connect, image/video upload, draft, scheduled publish, cancellation, webhook and analytics manually.

### Phase 2 — Secure River Ways server integration
- Select and implement the authentication/session and workspace authorization model first.
- Implement a small server-side Postiz client with timeout, schema validation, bounded retries and idempotency.
- Persist campaign/post mappings and approval hashes in a migration designed for the current database schema.
- Add API contract tests with mocked Postiz responses and negative authorization tests.
- Add signed/secret-validated webhook reconciliation and duplicate-event handling.

### Phase 3 — Creative Studio interface
- Add campaign calendar, channel picker, platform-specific preview/editor, media library, approval queue and delivery states.
- Make drafts, scheduled, published, failed and cancelled states distinguishable.
- Provide retry only for retryable failures and avoid duplicate posts.
- Show analytics only where the connected provider exposes them.

### Phase 4 — Controlled rollout
- Start with River Ways-owned accounts and one or two approved channels.
- Run end-to-end tests in a non-production workspace.
- Expand to client workspaces only after isolation, consent and approval tests pass.
- Enable production only after explicit owner approval.

## Licensing review

Postiz's upstream repository declares AGPL-3.0. Using the unmodified service internally is different from modifying and offering it as a network-accessible part of a commercial service. Before distributing a modified Postiz fork or providing a modified network service to clients, obtain a review of the applicable AGPL source-offer and corresponding-source obligations. Prefer operating Postiz as a separate upstream service and integrating via its public API; this is an architectural choice, not a legal conclusion or a guarantee that no obligations apply.

Upstream licence: https://github.com/gitroomhq/postiz-app/blob/main/LICENSE

## Acceptance gates

- [ ] Postiz runs on a separately managed host with durable storage and tested backup/restore.
- [ ] At least one provider account connects using official OAuth.
- [ ] API key remains server-only and is absent from browser bundles, network responses and logs.
- [ ] Anonymous requests cannot read channels, upload media, approve or publish.
- [ ] Workspace A cannot access Workspace B channels, posts, media or webhooks.
- [ ] An edit after approval invalidates the previous approval.
- [ ] Duplicate requests/events do not create duplicate posts.
- [ ] Scheduled and immediate publishing, cancellation and failure recovery are tested.
- [ ] Platform-specific media/copy constraints are validated before scheduling.
- [ ] Feature flag defaults off; production enablement requires explicit approval.

## Current truth

This document is the first integration foundation only. It does **not** claim that Postiz is deployed, that social accounts are connected, that River Ways has a publishing UI, or that automatic publishing is live. No external credentials or production infrastructure have been provisioned.
