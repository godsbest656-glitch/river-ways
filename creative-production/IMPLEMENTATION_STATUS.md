# River Ways Creative Production — Implementation Status

**Snapshot:** 7 November 2026  
**Working branch:** `feat/creative-production-engine-final`  
**Base snapshot:** `build/river-ways-execution-agency-agents` at `f96bb8a37a6144a0e9d29ce4dd1646800e848621` (GitHub compare: 22 commits ahead, 0 behind at branch reconciliation)  
**Production / Preview:** not deployed; no PR opened

## Implemented in the repository

- Local-first creative-production module isolated from the public Cloudflare Pages runtime.
- Dependency-free Node.js CLI for brief validation, project initialisation, environment checks and model registry inspection.
- Draft/approved/rejected brief state, client-asset rights gates, model-license review gate and no-overwrite project creation.
- Project scaffold with separate generated/approved/rejected assets, HyperFrames/Remotion compositions, renders, QA and delivery folders.
- SHAPED CURRENT 8-second HyperFrames starter project (manifest, local instructions, GSAP seekable timeline, CSS and HTML) copied into each new project.
- Approval-gated ComfyUI production runner validates approved brief, asset rights, model licence review, an explicitly enabled registry model and exact checkpoint presence in the workflow; queues API-format workflows, persists queued/running/completed/failed job state, polls job history, saves outputs into isolated per-node folders and records model/checkpoint/workflow SHA-256, prompt/seed, duration and output-size provenance.
- Workstation doctor reports GPU model/VRAM/driver, OS, CPU, RAM, free disk, CUDA compiler, Python, FFmpeg and ffprobe.
- Generation jobs sample `nvidia-smi` for peak GPU memory use, utilization and temperature and persist available telemetry with job metrics.
- FFprobe-based media QA validates container, duration, video/audio streams, codecs, dimensions and frame rate against campaign specs.
- Loopback-only ComfyUI adapter rejects remote inference endpoints and unsafe filenames/paths.
- Local renderer adapters for HyperFrames and optional Remotion. Both require explicit human approval, refuse overwrites, constrain output paths and verify a non-empty render output.
- FFprobe-based media QA validates non-empty media files, video stream, codec/container, duration, dimensions, frame rate and optional audio/spec requirements; it emits SHA-256-bound QA reports.
- Local delivery approval command verifies the exact generation output and passing QA report, requires owner/rights/brand approvals, copies the asset into approved/delivery folders, writes an approval receipt and updates the generation manifest without publishing.
- Repeatable model benchmark validator/scorer with fixed weighted rubric and minimum three runs before ranking.
- Disabled model candidates can only run in explicit benchmark-only mode after hardware compatibility review; benchmark outputs cannot be approved for client delivery.
- HunyuanVideo 1.5 territory exclusions are enforced by the generation runner using the approved brief's target territories.
- HyperFrames pinned to version 0.9.19 in the isolated creative-production package. Cloud rendering, publishing and paid/remote features are not used.
- Remotion remains optional and gated by explicit Free License eligibility. Free License applies to individuals/teams/companies up to three people and permits automation; agencies delivering only finished videos do not count their clients as Remotion users. Paid Automators use ($0.01 per successful render, $100/month minimum) is blocked until the required Company License telemetry integration is implemented. HyperFrames is the default.
- Model registry for Wan 2.2 TI2V-5B, HunyuanVideo 1.5 and LTX-2.5 with current hardware/licence gates, benchmark-only eligibility and production disabled by default.
- Per-model installation, ComfyUI workflow handoff, benchmark and activation runbook.
- Agency agent workflow with role contracts, stage gates, parallel execution rules and evidence-based reporting.
- Four original project-scoped Codex agents: creative producer, video model specialist, motion designer and media QA reviewer. The required agent roster and website orchestrator delegation map include all four; local Codex runtime discovery is not yet verified.
- Tests included in the repository test script and GitHub Actions CI workflow.
- Updated `AGENTS.md` and design index with local creative-production boundaries and documentation.

## Local test evidence

Current committed test suite: **27 tests**. The 27-test creative suite and full repository CI passed in run `42405199419` on commit `9c631402aba77fd54279ba72e359441e07f7b5cb`. This run also validated all 13 Codex agent definitions, the Python validator suite, HyperFrames CLI lint/browser check, creative doctor/model/brief smoke commands, website build, browser journeys/accessibility, Lighthouse, API, portfolio and dependency audit.

Earlier Node.js v22 isolated harness: **13/13 tests passed** for the initial foundation. The current committed suite contains **24 tests**; the subsequent tests are awaiting exact-branch GitHub Actions completion. Coverage includes brief validation, safe project initialisation, HyperFrames project scaffolding, mocked ComfyUI queue/history/output operations, model/territory gates, job persistence, renderer approval, media QA, benchmark scoring and hardware telemetry.

**Important qualification:** the test harness ran from an isolated local copy of the module logic because this execution environment could not clone the GitHub repository. It is not a checkout-based run of the exact GitHub branch. GitHub Actions has been triggered for the branch. HyperFrames 0.9.19 installation, lint, browser setup and `check` passed in run `42403510977`; the full website/browser/creative test job is still in progress. No live renderer or model inference test has been performed.

## Licensing and architecture decisions

- **HyperFrames:** Apache-2.0; default local renderer for new HTML/CSS/GSAP compositions.
- **Remotion:** source-available under a proprietary license, not OSI open source. Free-use eligibility is conditional; a company with more than three people requires a Company License under the published terms. It is not installed by default.
- **Wan 2.2:** upstream repository/model license is Apache-2.0. TI2V-5B is the first benchmark candidate; upstream recommends at least 24GB VRAM for its 720p single-GPU use.
- **HunyuanVideo 1.5:** Tencent Hunyuan Community License excludes the EU, UK and South Korea and carries additional service disclosure and acceptable-use terms. It is blocked for global client delivery pending legal review.
- **LTX-2.5:** repository code is Apache-2.0, while weights use the LTX-2.x Community License. Commercial production is allowed without a paid license only below USD 10 million annual entity revenue; at or above that threshold a paid agreement is required. Confirm the applicable entity threshold and current terms before activation.

## Not implemented / not verified

1. No model weights downloaded, installed or run.
2. No live ComfyUI server or model-specific workflow has been tested.
3. No HyperFrames or Remotion real MP4 render has been performed; renderer adapter tests use mocked render subprocesses. HyperFrames lint and browser check have passed in CI.
4. No GPU, VRAM, RAM, CUDA/driver, storage or OS compatibility assessment has been captured.
5. HyperFrames 0.9.19 and all transitive npm dependencies are locked in `creative-production/package-lock.json`; CI installs with `npm ci`.
6. No internal Creative Studio UI, database-backed job store, authentication, multi-user permissions, client portal, publishing integration or automated batch approval workflow exists yet. Local one-at-a-time human delivery approval is implemented in the CLI.
7. No client assets may be submitted to a model or used for fine-tuning without explicit written permission.
8. The public website has not been changed to claim this is an operational, production-proven service.
9. No Preview, production deployment, merge or PR has been initiated.

## Next execution gates

1. Capture the actual production workstation GPU/VRAM, RAM, OS, free disk, driver and CUDA versions.
2. Produce a real 8-second local MP4 on the target workstation using the pinned HyperFrames CLI; inspect it visually and run FFprobe QA.
3. Install/configure local ComfyUI and test a low-cost workflow before downloading any large model weights.
4. Benchmark Wan 2.2 TI2V-5B and LTX-2.5 using identical prompts, duration, aspect ratio, seed strategy and quality rubric. Hunyuan remains conditional on territory and legal review.
5. Record generation time, peak VRAM, peak RAM, output size, failure rate, temporal consistency, text fidelity, image quality and commercial license status.
6. Select the first model backend based on actual hardware and measured quality; keep other model adapters disabled until they pass.
7. Add cancellation, retries, access control, multi-user permissions and a client approval portal before building an internal Creative Studio UI. Basic local JSON job persistence, progress, provenance and one-at-a-time human delivery approval are already implemented.
8. Run the exact branch CI and review the complete diff. Keep the branch unmerged and do not open a PR until the owner authorises Preview, because PR activity triggers Cloudflare Preview.

## Current owner input needed

The next hardware-dependent step cannot be selected responsibly without the GPU model and dedicated VRAM of the machine that will run generation. Do not download multi-gigabyte checkpoints before that is known.


## Branch reconciliation

This working branch was created directly from the latest observed agency-agent integration branch. GitHub compare reports **0 commits behind**; the agency-agent baseline is retained without ancestry divergence. No PR, Preview, merge or deployment has been initiated.
