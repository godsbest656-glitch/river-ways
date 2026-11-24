# River Ways — Repository Installation and Deployment Programme

**Status:** Active execution register  
**Owner:** River Ways engineering  
**Baseline:** feat/studio-on-shaped-current  
**Scope:** The 22 integrations in the ecosystem convergence register.  
**Rule:** A repository reference is not an installed dependency, running service, approved integration or deployment.

## 1. Completion definition

An integration is complete only when its correct deployment mode has been applied and verified. Do not use "deployed" as a generic label for every repository.

| Deployment mode | Completion evidence |
|---|---|
| Web dependency | Pinned dependency, licence record, build, tests and production bundle verification |
| Local CLI / private worker | Pinned source or release, isolated install, checksum/version record, smoke test and worker adapter |
| Local desktop plugin | Host application/version match, reviewed package, least-privilege permissions and a non-destructive host test |
| Separate service | Isolated deployment, authentication, tenant boundary, health check, backup/restore and monitoring |
| Protocol/library | Pinned package, compatibility tests, authenticated integration and event/error handling |
| Curated reference library | Source/attribution metadata and rights review; no runtime deployment is implied |
| Developer reference | Version-matched sample, licence review and reproducible proof of concept |

## 2. Repository register

This is the implementation register for the 22 candidates. The machine-readable source register is integrations/registry.json. Validate it with npm run validate:integrations; run npm run test:platform for its regression tests.

| Repository | Intended mode | Current decision | Next execution gate |
|---|---|---|---|
| Rea-Video | Private local tool | Evaluate | Rights-cleared sample analysis and provenance test |
| Awesome Opus video library | Curated reference | Reference only | Curate metadata and rights-cleared links |
| Lemo-Opuscar | Curated reference | Evaluate | Full commercial licence and attribution review |
| EffectCraft | Local desktop tool | Evaluate | Pin commit; isolated build and deterministic export |
| PixelFX | Curated specialist reference | Reference only | Validate one sprite-sheet workflow |
| ComfyUI | Private local service | Existing foundation; not runtime-verified | Inspect workstation, pin install, local-only smoke test |
| Remotion | Private local CLI | Evaluate | Licence/cost eligibility and benchmark |
| Remotion Skills | Project skill | Reference only | Review skill content and policy compatibility |
| HyperFrames | Private local CLI | Existing foundation; pinned 0.9.18; renderer not verified | CI install/lint, then real internal test MP4 |
| Three.js | Public web dependency | Existing dependency; runtime use unverified | Confirm component usage, then bounded scene and mobile/reduced-motion tests |
| GSAP | Web/local dependency | Evaluate | Confirm licence; test one bounded interaction |
| Blender MCP | Private desktop bridge | Evaluate | Tool, filesystem and subprocess audit; read-only sandbox test |
| FFmpeg | Private local CLI | Existing foundation; binary not verified | Record build configuration and licence; media QA test |
| Adobe UXP | Local desktop plugin platform | Adopt candidate | Inventory installed hosts and match exact UXP runtime |
| adobepy | Local broker | Evaluate | Licence, Windows support, authentication and allowlist audit |
| Cavi Adobe MCP | Local desktop bridge | Blocked | Requires a supported macOS worker; not a Windows install target |
| Jonohobs Adobe MCP | Local desktop bridge | Reject current candidate | Arbitrary PowerShell/ExtendScript and broad filesystem access are too permissive |
| Premiere UXP samples | Developer reference | Reference only | Match sample to installed Premiere version and review licence |
| Postiz | Separate service | Evaluate | AGPL review, tenant/auth integration and exact-content approval |
| Paperclip | Private separate service | Evaluate | Compare with existing agent runtime; avoid duplicate orchestration |
| AG-UI | Private application protocol | Evaluate | Authenticated event-stream proof behind Agent Gateway |
| Twenty CRM | Private separate service | Evaluate | Map current lead schema and select one CRM system of record |

## 3. Execution waves

### Wave 0 — Workstation and platform inventory

- Record Windows version, CPU, RAM, GPU and available disk.
- Record installed Adobe applications and exact versions.
- Record Node.js, Python, Git, FFmpeg and Blender versions.
- Do not collect secrets, environment variable values, personal files or client assets.
- Use scripts/windows/inspect-creative-workstation.ps1 to collect a read-only inventory.
- Do not install software until compatibility, licence, storage and hardware requirements are known.

### Wave 1 — Existing local creative foundation

The current code pins HyperFrames 0.9.18. Upstream v0.9.91 was released on 24 November 2026. Keep the pinned version until the adapter passes a compatibility test against the newer release. ComfyUI v0.46.0 removes DirectML support; do not select it for a Windows machine until its GPU backend is confirmed.

1. FFmpeg: verify binary build and codec/licence configuration.
2. HyperFrames: install a pinned release in an isolated project environment and render a synthetic internal test.
3. ComfyUI: install only on a compatible local workstation; bind to loopback; use a synthetic test workflow and approved model licences.
4. Rea-Video: test a rights-cleared clip in an isolated environment.
5. Record versions, hashes, test outputs and resource use.

### Wave 2 — Creative and web capabilities

Three.js and React Three Fiber are already declared in the root website package. Their use in a shipped route or component is not verified. Do not add a second 3D stack.

1. Three.js and GSAP: licence and bundle review, then one progressive-enhancement prototype.
2. EffectCraft and PixelFX: separate specialist tests; do not treat either as a universal editor.
3. Remotion: no installation until commercial/automation eligibility is confirmed.
4. Blender MCP: install only after the tool and filesystem audit passes.
5. Curate reference libraries separately from executable software.

### Wave 3 — Adobe workstation integration

- Use Adobe UXP for supported host applications and versions.
- Treat UXP support as host-version-specific. Do not assume one plugin package works in every Adobe application.
- Use Adobe's current support matrix before building or loading a plugin.
- Do not install the audited Jonohobs server as-is.
- Do not install the macOS-only Cavi candidate on Windows.
- Start with one host and a read-only/non-destructive command. Add export or file mutation only after explicit operation-level approval.

### Wave 4 — Agency services and protocols

- Postiz: separate service, AGPL review, tenant isolation, OAuth custody and client-content approval.
- Paperclip: evaluate only if it adds a distinct capability beyond the current agent runtime.
- AG-UI: protocol adapter, not a replacement for authentication or orchestration.
- Twenty: decide whether it becomes the sole CRM system of record before deployment. Do not create duplicate contacts/deals.
- Keep Avenize as a separate tenant/product and do not reuse its credentials or private records.

## 4. Security and release gates

Every executable integration must pass:

1. Source provenance and pinned version.
2. Licence and dependency review.
3. Secret handling and credential separation.
4. Filesystem, network and process allowlists.
5. Tenant and client-data isolation.
6. Authentication and authorisation tests.
7. Failure, retry, cancellation and audit tests.
8. Resource and cost limits.
9. Reproducible smoke test.
10. Rollback and uninstall procedure.

No integration receives client data or production credentials during a sandbox test. No publishing, client delivery, destructive file changes or paid usage is enabled by installation alone.

## 5. Current deployment boundary

The Creative Studio branch has a tested draft workflow and production hand-off manifest. It does not prove that a renderer, Adobe host, ComfyUI server, FFmpeg binary, Postiz service, CRM service or external agent service is installed or running.

GitHub CI verifies repository code. The topic workflow now installs the pinned HyperFrames CLI in its isolated runner and lints the starter composition. This is CI installation only; it does not install software on the user's Windows workstation or provision external services.

Production deployment remains a separate release action. Before enabling it, verify the target environment, required secrets, database migrations, object storage, access policies, health checks and rollback. Keep public website deployment separate from private creative workers.

## 6. Evidence log

For each integration, record:

- upstream repository and pinned commit/release;
- licence decision and dependency notices;
- install target and deployment mode;
- environment and host versions;
- configuration schema (never secret values);
- smoke-test command and result;
- test artifact checksum and storage location;
- security review and outstanding risks;
- owner, timestamp and rollback procedure.

An entry is installed only after the local/service install is verified. It is integrated only after River Ways can invoke it through an authenticated adapter. It is deployed only after the target environment health check passes. It is production-enabled only after all release gates and approvals pass.
