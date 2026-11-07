# River Ways Creative Production — Implementation Status

**Snapshot:** 7 November 2026  
**Working branch:** `feat/creative-production-engine-rebased`  
**Base snapshot:** `build/river-ways-execution-agency-agents` at `240475d0c35ffd93b5dc908dcb6c5a9b388a876a` (file-level updates synchronized; Git ancestry remains diverged)  
**Production / Preview:** not deployed; no PR opened

## Implemented in the repository

- Local-first creative-production module isolated from the public Cloudflare Pages runtime.
- Dependency-free Node.js CLI for brief validation, project initialisation, environment checks and model registry inspection.
- Draft/approved/rejected brief state, client-asset rights gates, model-license review gate and no-overwrite project creation.
- Project scaffold with separate generated/approved/rejected assets, HyperFrames/Remotion compositions, renders, QA and delivery folders.
- SHAPED CURRENT 8-second HyperFrames starter composition copied into each new project.
- Loopback-only ComfyUI adapter for queueing API-format workflows, polling job history and saving outputs.
- Local renderer adapters for HyperFrames and optional Remotion. Both require explicit human approval, refuse overwrites, constrain output paths and verify a non-empty render output.
- HyperFrames pinned to version 0.9.18 in the isolated creative-production package. Cloud rendering, publishing and paid/remote features are not used.
- Remotion remains optional and gated by explicit license acknowledgement and confirmed free-license eligibility.
- Model registry for Wan 2.2 TI2V-5B, HunyuanVideo 1.5 and LTX-2.5 with license/hardware notes and all model adapters disabled by default.
- Tests included in the repository test script and GitHub Actions CI workflow.
- Updated `AGENTS.md` and design index with local creative-production boundaries and documentation.

## Local test evidence

Node.js v22.16.0 isolated harness: **13/13 tests passed** across brief validation, safe project initialisation, starter-template copying, mocked ComfyUI queue/history/output operations, renderer approval, renderer output validation and path containment.

**Important qualification:** the test harness ran from an isolated local copy of the module logic because this execution environment could not clone the GitHub repository. It is not a checkout-based run of the exact GitHub branch. GitHub Actions has not yet been run for this feature branch, and no live renderer or model inference test has been performed.

## Licensing and architecture decisions

- **HyperFrames:** Apache-2.0; default local renderer for new HTML/CSS/GSAP compositions.
- **Remotion:** source-available under a proprietary license, not OSI open source. Free-use eligibility is conditional; a company with more than three people requires a Company License under the published terms. It is not installed by default.
- **Wan 2.2:** upstream repository/model license is Apache-2.0. TI2V-5B is the first benchmark candidate; upstream recommends at least 24GB VRAM for its 720p single-GPU use.
- **HunyuanVideo 1.5:** Tencent Hunyuan Community License excludes the EU, UK and South Korea and carries additional service disclosure and acceptable-use terms. It is blocked for global client delivery pending legal review.
- **LTX-2.5:** repository code is Apache-2.0, while weights use the LTX-2.x Community License. Commercial production is allowed without a paid license only below USD 10 million annual entity revenue; at or above that threshold a paid agreement is required. Confirm the applicable entity threshold and current terms before activation.

## Not implemented / not verified

1. No model weights downloaded, installed or run.
2. No live ComfyUI server or model-specific workflow has been tested.
3. No HyperFrames or Remotion real render has been performed; renderer tests use mocked CLI processes.
4. No GPU, VRAM, RAM, CUDA/driver, storage or OS compatibility assessment has been captured.
5. No internal Creative Studio UI, job database, authentication, multi-user permissions, client portal, publishing integration or automated batch approval workflow exists yet.
6. No client assets may be submitted to a model or used for fine-tuning without explicit written permission.
7. The public website has not been changed to claim this is an operational, production-proven service.
8. No Preview, production deployment, merge or PR has been initiated.

## Next execution gates

1. Capture the actual production workstation GPU/VRAM, RAM, OS, free disk, driver and CUDA versions.
2. Install the pinned local HyperFrames CLI in `creative-production/`, run its real `lint` and `check` against the starter, and produce a real 8-second local MP4.
3. Install/configure local ComfyUI and test a low-cost workflow before downloading any large model weights.
4. Benchmark Wan 2.2 TI2V-5B and LTX-2.5 using identical prompts, duration, aspect ratio, seed strategy and quality rubric. Hunyuan remains conditional on territory and legal review.
5. Record generation time, peak VRAM, peak RAM, output size, failure rate, temporal consistency, text fidelity, image quality and commercial license status.
6. Select the first model backend based on actual hardware and measured quality; keep other model adapters disabled until they pass.
7. Add job persistence, cancellation, retries, progress, provenance, access control and client approval before building an internal Creative Studio UI.
8. Run the exact branch CI and review the complete diff. Keep the branch unmerged and do not open a PR until the owner authorises Preview, because PR activity triggers Cloudflare Preview.

## Current owner input needed

The next hardware-dependent step cannot be selected responsibly without the GPU model and dedicated VRAM of the machine that will run generation. Do not download multi-gigabyte checkpoints before that is known.


## Branch reconciliation note

The working branch was recreated from the agency-agent integration branch after that branch advanced. The latest observed base-only changes to the orchestrator prompt, Codex agent configuration, first-audit task and agency-agent status were synchronized into this branch. GitHub compare still reports four commits of ancestry divergence; no rebase or merge was performed. Reconcile ancestry before opening a PR. The feature branch remains unmerged and undeployed.
