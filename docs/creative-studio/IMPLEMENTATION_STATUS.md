# Creative Studio — integration status

**Working branch:** `feat/river-ways-creative-studio-foundation`  
**Website base:** `build/river-ways-execution-agency-agents`  
**Purpose:** integrate River Ways' existing local creative-production engine into the agency platform without putting GPU inference or rendering in public Cloudflare Pages requests.

## Completed in this slice

- Ported the existing `creative-production/` module into the website branch without merging its divergent branch history.
- Preserved the brief validator, project scaffold, rights and approval gates, model registry, ComfyUI loopback adapter, provenance records, renderer adapters, HyperFrames starter and FFprobe media QA.
- Added a draft Avenize market-entry brief as a production input. It is deliberately unapproved; asset-generation rights and model-license review are false, so production generation remains blocked.
- Added `npm run test:creative` and included it in the root `npm test` suite.
- Added the creative-engine test to GitHub Actions.
- Added feature-branch push CI triggers. This runs repository checks only; it does not create a Cloudflare Preview or deployment.
- Added D1 migration `0004_creative_studio.sql` for client-scoped clients, projects, jobs, asset metadata, approval history and audit events.
- Extended the migration validator to exercise the schema, queue index, foreign keys and cross-client relationship rejection.

## Architecture boundary

The public River Ways site is a React/Vite static experience deployed to Cloudflare Pages. Local GPU inference and video rendering must not run inside public Pages request handlers. The local creative engine remains a workstation/private production process. The intended connection is a secure job/control API and an authenticated Creative Studio UI; a local worker will claim jobs, execute approved local workflows, and submit metadata/results back to the agency platform.

D1 stores metadata and audit records, not media bytes. Media storage must be private and client-scoped. A client must not be able to access another client's brief, job, asset or approval record.

## Not yet implemented

- Authenticated Creative Studio route and interface.
- Cloudflare Access/JWT verification and role-based permissions.
- D1-backed API endpoints for client/project/job/asset/approval lifecycle.
- Atomic job claiming, worker leases, retries and stale-job recovery.
- Private object storage adapter and signed, short-lived asset delivery.
- Local worker/agent bridge that polls or receives queued jobs and calls the existing CLI.
- End-to-end integration tests across browser, API, D1 and local worker.
- Live ComfyUI, GPU, model inference or real renderer verification.
- Client-facing review portal and explicit approval UI.
- Social publishing integrations and campaign analytics.

## Next implementation order

1. Build the authenticated Creative Studio API (client/project/job/asset/approval) with tenant-scoped queries and audit events.
2. Add a secure local-worker protocol: claim/heartbeat/complete/fail, idempotency, lease expiry, bounded retries and signed artifact upload.
3. Add the internal Creative Studio interface with queue, brief, production, review and delivery states.
4. Add exact-version approval records and immutable asset provenance.
5. Connect publishing and performance measurement only after channel credentials and explicit publishing approvals exist.
6. Run end-to-end tests; only then assess Preview readiness.

## Safeguards

- Never set a client brief to approved by default.
- Never infer client asset-generation permission from an uploaded logo or brief.
- Never mark a generated asset approved because technical QA passed.
- Never publish or deliver without approval for the exact asset version and usage scope.
- Never enable a model, accept paid terms, or spend money automatically.
- Never fabricate product capabilities, case studies, testimonials, endorsements or commercial results.
- Report generated, QA-passed, internally approved, client-approved and delivered as separate states.
