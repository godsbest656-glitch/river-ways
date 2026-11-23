# Creative Studio — integration status

**Working branch:** `feat/studio-on-shaped-current`  
**Website base:** `feat/river-ways-liquid-current` (SHAPED CURRENT)  
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
- The worker/API claim allowlist includes `project_init`, `strategy` and `copy`. Copy remains a deterministic, source-traceable brief transform. Strategy now has an opt-in OpenAI-compatible provider adapter with explicit model routing, secret-by-environment-variable handling, structured-output validation, bounded output fields and provenance. No provider key or live inference is configured; the deterministic strategy adapter remains the no-route behavior.

## Architecture boundary

The public River Ways site is a React/Vite static experience deployed to Cloudflare Pages. Local GPU inference and video rendering must not run inside public Pages request handlers. The local creative engine remains a workstation/private production process. The secure job/control API, internal Studio UI and local worker daemon are present in code. The worker claims `project_init`, `strategy` and `copy`. Project setup creates a draft local scaffold. Copy produces a deterministic, source-traceable, non-publishable JSON draft. Strategy uses a deterministic adapter unless an explicit `STUDIO_MODEL_ROUTES_JSON` strategy route is configured. The optional route supports an OpenAI-compatible HTTPS endpoint, requires an explicit model ID and separately supplied API-key environment variable, validates structured output and records provider/model provenance. A configured provider failure fails the job; it does not silently fall back. No provider credentials or live inference have been configured or verified. The worker does not claim concept, storyboard, image, video, render, QA or delivery jobs.

D1 stores metadata and audit records, not media bytes. Media storage must be private and client-scoped. A client must not be able to access another client's brief, job, asset or approval record.

## Not yet implemented

- Cloudflare Access application/policies and Preview environment configuration.
- Client-facing reviewer identity/approval portal; current approval route is staff-only.
- Live worker integration tests against a configured Cloudflare Access service token, D1 database and private R2 bucket. Current worker tests are isolated/mocked; no live workstation has been connected.
- Concept, storyboard, image, video, render, QA and delivery adapters. These must be implemented and tested individually before the worker is allowed to claim them.
- Visual annotation, side-by-side revision comparison and client-facing reviewer portal; the current UI lists registered assets, provides authenticated previews and records agency review decisions.
- End-to-end integration tests across browser, API, D1 and local worker. The worker currently has isolated unit/integration tests with a real local CLI scaffold, but not live Access/D1/R2 verification.
- Live ComfyUI, GPU, model inference or real renderer verification.
- Social publishing integrations and campaign analytics.

## Next implementation order

1. Connect and verify the local worker against an approved Preview environment; prove `project_init` end-to-end without touching production.
2. Verify strategy and copy draft adapters in CI and against an approved Preview worker; then implement concept/storyboard adapters behind the same source and approval gates.
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


## Avenize first-client acceptance checklist

Avenize is configured as the first draft client workspace from the supplied client brief and logo reference. The River Ways website/Studio is responsible for coordinating and producing its campaign assets; this integration does not generate or publish client assets merely because the brief exists.

| Workstream | Current state | Acceptance evidence still required |
|---|---|---|
| Brand foundation | Brief and logo reference recorded | Approved brand kit, exact logo files/variants, colour and typography tokens |
| Product truth | Claims restricted to verified capabilities | Product feature inventory and approved screenshots/demo capture |
| Campaign strategy | Deterministic strategy draft available | Evidence-backed audience/message/channel plan and owner review |
| Copy and sales kit | Deterministic copy foundation draft available | Verified product facts, proof, CTA and approved collateral |
| Creative concepts | Adapter pending | Approved concepts, storyboards and shot lists |
| Image/video | Local generation foundation exists; no live inference verified | Rights-cleared models/assets, hardware validation, sample outputs and human review |
| Render and QA | Local renderer/media QA code exists; no real render verified | Reproducible render, media QA report and visual review |
| Partnerships | Prospects identified in client brief only | Separate non-binding proposals for Niyi Adesanya and LIMBsimple; no implied endorsement |
| Activation | Lagos-first, zero-budget plan in brief | Workshop plan, approved registration CTA and owner-approved event details |
| Publishing | Not connected | Platform account access, content approvals and explicit publish authorization |
| Measurement | Studio job/audit foundation exists | Lead source, qualification, demo, registration, activation, revenue and partnership reporting |
| Commercial funding | No budget assumed | Approved conversion-funded allocation and partner-reward terms |

No line above is considered complete solely because a placeholder, plan, mock, or queue type exists.


## Strategy and copy draft adapters (2026-11-19)

- Added deterministic `strategy` and `copy` worker handlers and enabled only those two additional types in the API worker-claim allowlist.
- Both handlers validate the saved draft brief and verify that the local project metadata belongs to the exact claimed client and project before writing.
- Strategy output preserves brief-supplied objective, audience, market, platforms and deliverables and lists evidence/approval gaps.
- Copy output preserves the supplied primary message and platform list but leaves supporting pillars, feature claims, proof points and calls to action empty until verified inputs are supplied.
- Outputs are stored per job under the client-scoped local project, marked draft/non-publishable, and refuse overwrites.
- Unit tests cover output provenance, claim restrictions and cross-client scope rejection. Topic-branch CI includes the API and creative worker suites; the current run must pass before this integration is accepted.
- These adapters are deterministic scaffolding, not model-generated strategy/copy and not a completed campaign deliverable.


## SHAPED CURRENT integration slice (2026-11-23)

- The Studio foundation was selectively ported onto `feat/river-ways-liquid-current` as `feat/studio-on-shaped-current`; the divergent website branch history was not merged wholesale.
- The port includes the Studio Pages Functions, Access JWT verifier, internal `/studio/` interface, migration 0004, local worker, deterministic strategy/copy adapters and isolated tests.
- Root `package.json` preserves the website's existing React/Three.js dependencies and adds explicit Studio/creative test scripts. Topic-branch CI now runs the creative worker tests.
- The latest observed workflow run is pending; no test pass is claimed yet.
- Cloudflare Access, Preview D1, private R2, service-token connectivity and provider inference remain unconfigured/unverified. No deployment or migration was performed.


## Explicit strategy model route (2026-11-23)

- Added `creative-production/bin/model-strategy-adapter.mjs` for strategy-only OpenAI-compatible inference.
- The adapter is disabled unless `STUDIO_MODEL_ROUTES_JSON.strategy` names a supported provider, public HTTPS base URL, explicit model ID and API-key environment variable. The key itself is read from the worker environment and is never stored in the route JSON or repository.
- The adapter asks for structured JSON, rejects invalid/oversized responses and validates the required strategy fields before saving a draft.
- The saved artifact records provider, model and generation time. It remains draft-only, requires human review and is not publishable.
- If no route exists, the deterministic strategy adapter remains active. If a configured route fails or returns invalid output, the job fails; there is no silent deterministic fallback.
- Added unit tests for missing/invalid routes, endpoint policy, provider errors, malformed output, provenance and worker-level integration.
- This is implementation code and mocked test coverage only. No provider credentials, provider account, live inference, commercial data terms or deployment configuration have been verified.
