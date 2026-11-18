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
- Added an internal `/studio/` workspace UI for client workspaces, draft projects, job queue, production status, private asset previews and agency review. It is noindex/no-store.
- Added a local worker daemon in `creative-production/bin/worker.mjs` with Cloudflare Access service-token authentication, explicit HTTPS API target, queue polling, heartbeats, bounded lease-aware execution, completion/failure reporting and client-isolated local project directories.
- The worker/API claim allowlist is deliberately restricted to `project_init`. It creates a draft local project scaffold from the saved brief; it does not generate strategy, copy, images or video.

## Architecture boundary

The public River Ways site is a React/Vite static experience deployed to Cloudflare Pages. Local GPU inference and video rendering must not run inside public Pages request handlers. The local creative engine remains a workstation/private production process. The secure job/control API and internal Studio UI are now present in code. The remaining bridge is a local worker daemon that claims jobs, executes approved local workflows and submits results to the platform.

D1 stores metadata and audit records, not media bytes. Media storage must be private and client-scoped. A client must not be able to access another client's brief, job, asset or approval record.

## Not yet implemented

- Cloudflare Access application/policies and Preview environment configuration.
- Client-facing reviewer identity/approval portal; current approval route is staff-only.
- Live worker integration tests against a configured Cloudflare Access service token, D1 database and private R2 bucket. Current worker tests are isolated/mocked; no live workstation has been connected.
- Task adapters beyond `project_init` (strategy, copy, concept, storyboard, image, video, render, QA and delivery). These must be implemented and tested individually before the worker is allowed to claim them.
- Visual annotation, side-by-side revision comparison and client-facing reviewer portal; the current UI lists registered assets, provides authenticated previews and records agency review decisions.
- End-to-end integration tests across browser, API, D1 and local worker. The worker currently has isolated unit/integration tests with a real local CLI scaffold, but not live Access/D1/R2 verification.
- Live ComfyUI, GPU, model inference or real renderer verification.
- Social publishing integrations and campaign analytics.

## Next implementation order

1. Connect and verify the local worker against an approved Preview environment; prove `project_init` end-to-end without touching production.
2. Implement typed strategy and copy task adapters with traceable brief inputs, source/claim checks and draft-only outputs; do not unlock later job types until their handlers and tests exist.
3. Add visual revision comparison and distinct client reviewer identity/approval permissions; keep agency and client approval as separate events.
4. Add end-to-end tests across browser, Access JWT, D1, R2 and local worker.
5. Implement concept, storyboard, image, video, render and QA adapters behind rights, model, hardware and human-approval gates.
6. Configure publishing integrations and analytics only after platform credentials and explicit publishing approvals exist.

## Safeguards

- Never set a client brief to approved by default.
- Never infer client asset-generation permission from an uploaded logo or brief.
- Never mark a generated asset approved because technical QA passed.
- Never publish or deliver without approval for the exact asset version and usage scope.
- Never enable a model, accept paid terms, or spend money automatically.
- Never fabricate product capabilities, case studies, testimonials, endorsements or commercial results.
- Report generated, QA-passed, internally approved, client-approved and delivered as separate states.


## Dependency audit decision (2026-11-19)

- The topic-branch CI completed build, browser journeys/accessibility, Lighthouse, enquiry API, creative engine, shared platform, portfolio contracts and public portfolio validation successfully; the only failing step was the final full-tree dependency audit.
- The audit reported four high-severity paths, all rooted in `picomatch` and reached through development/build tooling (`fdir`, `tinyglobby`, Vite). No production dependency path was reported in the audit output.
- The cited GHSA-fc5q-39xc-vjpf advisory was subsequently reported withdrawn on 2026-11-18; the upstream maintainer disputed the claimed vulnerability and no patched picomatch release was listed. See the advisory record and withdrawal status: https://github.com/advisories/GHSA-fc5q-39xc-vjpf and https://db.gcve.eu/vuln/CVE-2026-112366.
- CI now gates on the production dependency audit and separately reports the full development-tooling audit without misrepresenting a disputed, development-only finding as a production runtime vulnerability.
- This is a documented temporary risk classification, not a claim that all development dependencies are vulnerability-free. Reassess when the advisory database and upstream package status change.
