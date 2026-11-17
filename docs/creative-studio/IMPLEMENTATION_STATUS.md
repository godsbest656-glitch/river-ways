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
- Added D1 migration `0004_creative_studio.sql` for client-scoped clients, projects, jobs, asset metadata, approval history and audit events, including bounded retry/lease metadata.
- Extended the migration validator to exercise the schema, queue index, foreign keys and cross-client relationship rejection.
- Added a Cloudflare Access JWT verifier for the Studio API, including signature, issuer, audience and expiry checks plus an exact staff email allowlist and separate worker audience.
- Added D1-backed client, project and job APIs; atomic queue claims; worker heartbeats, lease expiry/recovery and bounded retries; worker completion/failure; immutable approval events tied to exact asset hashes.
- Added private R2 upload and authenticated asset streaming endpoints. Uploads are size-limited, content-type allowlisted and hashed server-side; registration verifies the stored object metadata matches the worker/client/project/job and SHA-256.
- Added an internal `/studio/` workspace UI for client workspaces, draft projects, job queue and production status. It is noindex/no-store and makes no claim that a worker is connected.

## Architecture boundary

The public River Ways site is a React/Vite static experience deployed to Cloudflare Pages. Local GPU inference and video rendering must not run inside public Pages request handlers. The local creative engine remains a workstation/private production process. The secure job/control API and internal Studio UI are now present in code. The remaining bridge is a local worker daemon that claims jobs, executes approved local workflows and submits results to the platform.

D1 stores metadata and audit records, not media bytes. Media storage must be private and client-scoped. A client must not be able to access another client's brief, job, asset or approval record.

## Not yet implemented

- Cloudflare Access application/policies and Preview environment configuration.
- Client-facing reviewer identity/approval portal; current approval route is staff-only.
- A complete local worker daemon that connects the queue to the CLI, persists project files, runs approved work and uploads resulting media.
- Worker integration tests against a live Cloudflare Access service token and R2 bucket.
- Visual annotation, side-by-side revision comparison and client-facing reviewer portal; the current UI lists registered assets, provides authenticated previews and records agency review decisions.
- End-to-end integration tests across browser, API, D1 and local worker.
- Live ComfyUI, GPU, model inference or real renderer verification.
- Social publishing integrations and campaign analytics.

## Next implementation order

1. Build the local worker daemon and adapt the existing CLI to execute queued project tasks, heartbeat, retry and upload assets.
2. Add asset listing, preview, revision comparison and staff/client review controls to the Studio UI.
3. Add client reviewer identity and scoped approval permissions; keep agency and client approval as distinct events.
4. Add end-to-end tests across browser, Access JWT, D1, R2 and local worker.
5. Configure Cloudflare Access and Preview D1/R2 bindings only after owner-side environment access and approval.
6. Connect social publishing and analytics only after platform credentials and explicit publishing approvals exist.

## Safeguards

- Never set a client brief to approved by default.
- Never infer client asset-generation permission from an uploaded logo or brief.
- Never mark a generated asset approved because technical QA passed.
- Never publish or deliver without approval for the exact asset version and usage scope.
- Never enable a model, accept paid terms, or spend money automatically.
- Never fabricate product capabilities, case studies, testimonials, endorsements or commercial results.
- Report generated, QA-passed, internally approved, client-approved and delivered as separate states.
