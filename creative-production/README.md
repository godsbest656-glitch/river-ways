# River Ways Creative Production Engine

**Status:** isolated implementation foundation; model inference and renderer execution remain gated pending local hardware and exact-version verification.

This module establishes a local-first production workspace for River Ways. It is deliberately separate from the public Cloudflare Pages runtime: video models, GPU workloads, media files and rendering belong on an authorised workstation or private production machine, not in a public website request handler.

## What is implemented

- A dependency-free Node.js CLI to validate a campaign brief and initialise a structured production project, including a SHAPED CURRENT motion starter composition.
- Explicit draft/approved/rejected brief state. Initialising a project never implies client approval.
- Separate generated, approved and rejected asset folders; separate HyperFrames and Remotion composition folders.
- A doctor command to detect local Node, Python, FFmpeg, ffprobe and NVIDIA tooling.
- A machine-readable registry of the named model and renderer candidates with license and hardware gates.
- A human approval boundary before a project is considered ready for client delivery.
- A loopback-only ComfyUI adapter for queueing API-format workflows, polling job history and saving validated outputs; covered by mocked API tests.

## Local render commands

Install the pinned local HyperFrames CLI from this folder with `npm install`. It is a local dependency; do not use HyperFrames cloud render, publish, or other paid/remote services.

HyperFrames (after a human has reviewed and approved the composition):

```bash
npm run render -- hyperframes --project ../production/<client-campaign>/compositions/hyperframes --output renders/final.mp4 --approved
```

Remotion is deliberately not installed by default. Only install and use its CLI after confirming the current Remotion free-license eligibility and accepting its terms. Its render command requires all three explicit flags: `--approved --license-acknowledged --free-license-eligible`.

The render adapters run local CLIs without a shell, require explicit approval, refuse to overwrite existing outputs, and verify that a non-empty file was produced. Renderer tests use mocked CLI processes; a real render has not yet been performed.

## What is not yet implemented

- No model weights are downloaded or bundled.
- No model inference is invoked by this CLI.
- A loopback-only ComfyUI API adapter is implemented and unit-tested against mocked API responses; no live ComfyUI server or model inference has been verified. No model-specific workflow adapter is enabled.
- No HyperFrames or Remotion render is claimed as tested.
- No remote GPU service, public upload endpoint, client portal, automated publishing or unattended client delivery is enabled.
- No generated media is automatically published or sent to a client.

These are intentional gates, not hidden capabilities.

## Requirements

- Node.js 22+ (required by the pinned HyperFrames CLI; the brief/ComfyUI modules use built-in Node APIs).
- FFmpeg and ffprobe are recommended for subsequent media validation.
- Python and NVIDIA tooling are optional at this stage.
- GPU/model requirements vary by checkpoint. See `config/models.json` and the upstream model documentation before downloading weights.

## Commands

From the repository root:

```bash
node creative-production/bin/creative.mjs help
node creative-production/bin/creative.mjs doctor
node creative-production/bin/creative.mjs validate creative-production/examples/sample-brief.json
node creative-production/bin/creative.mjs init --brief creative-production/examples/sample-brief.json --out ./production
node --test creative-production/test/*.test.mjs
cd creative-production && npm install
npm run render -- hyperframes --project ../production/<client-campaign>/compositions/hyperframes --output renders/final.mp4 --approved
```

The ComfyUI adapter only permits loopback URLs and rejects unsafe output paths. It does not expose a public inference endpoint. The sample brief is explicitly marked as a fictional internal test fixture. It is not a client brief or a case study.

## Project structure created by `init`

```text
production/<client-campaign>/
  project.json
  brief/
    draft-brief.json | approved-brief.json
  assets/
    generated/
    approved/
    rejected/
  compositions/
    hyperframes/
    remotion/
  renders/
  qa/
  delivery/
```

## Architecture

1. **Brief and strategy:** a human-approved brief defines audience, objective, message, channels, deliverables and constraints.
2. **Creative direction:** a creative agent proposes concepts, shot lists, prompts and storyboards. Human review is required before generation.
3. **Asset generation:** model adapters run locally through a versioned backend such as ComfyUI or Diffusers. Model choice is made per task, license territory and available hardware.
4. **Composition:** HyperFrames is the preferred open-source HTML/CSS/GSAP renderer for new template-led motion work. Remotion remains an optional React composition path subject to its separate license terms. Do not assume one can be substituted for the other without migration review.
5. **Finishing:** FFmpeg/ffprobe validate and package renders; audio, captions, dimensions, duration, codec and file integrity are checked.
6. **Approval and delivery:** a human reviews creative, rights, brand, spelling, accessibility and technical QA before anything is marked approved or delivered.

## Decisions and licensing gates

- **Wan 2.2:** Apache-2.0 repository/model license per upstream repository; the TI2V-5B checkpoint is the practical first candidate for a 24GB-class NVIDIA GPU. Verify the exact checkpoint card and its license before use.
- **HunyuanVideo 1.5:** Tencent Hunyuan Community License, not a generic OSI open-source license. Its published territory excludes the EU, UK and South Korea and has additional third-party service disclosure and acceptable-use conditions. Do not use it for globally distributed client deliverables until counsel has reviewed the territory and distribution obligations.
- **LTX-2.5:** the LTX-2 repository code is Apache-2.0, but model weights are under the separate LTX-2.x Community License. The current license permits commercial production without a paid license only for entities below USD 10 million annual revenue; entities at or above that threshold need a paid commercial agreement. Verify the current license, revenue threshold, restrictions and any separate text-encoder license before activation.
- **HyperFrames:** Apache-2.0; preferred default renderer for new HTML/CSS/GSAP compositions. Confirm FFmpeg and bundled third-party license obligations in the deployed build.
- **Remotion:** source-available under a proprietary license, not OSI open source. Free use is conditional; companies with more than three people require a Company License under the published licensing terms. Keep it optional until River Ways' eligibility is confirmed.

## Security and data handling

- Keep model servers bound to localhost or a private authenticated network. Never expose ComfyUI, model APIs or a render daemon directly to the public internet.
- Never put provider keys, client assets, private prompts or model weights in Git.
- Keep client assets in access-controlled storage with an agreed retention/deletion policy.
- Record asset provenance, model/checkpoint/version, prompt, seed, generation parameters, license, and approval status.
- Do not use client assets to train or fine-tune models without explicit written permission.
- Do not imitate identifiable people, client competitors' protected brand assets, or third-party creative work without rights and authorization.
- Human approval is mandatory before client delivery, paid media use or publication.

## Next engineering gates

1. Capture the production workstation OS, GPU model, VRAM, RAM, free disk and CUDA/driver versions.
2. Install one local inference backend and run a reproducible smoke test with a small/low-cost checkpoint.
3. Benchmark Wan 2.2 TI2V-5B, LTX-2.5 and HunyuanVideo 1.5 only where license territory and hardware allow.
4. Adopt a single renderer for the first production template pack; compare HyperFrames and Remotion on identical, deterministic compositions before any dual-engine investment.
5. Add adapters behind a stable job contract with timeout, cancellation, progress, retry, provenance and output validation.
6. Integrate the internal Creative Studio UI only after the local service has authentication, file boundaries, audit events and human approval.
7. Keep all deployment and public website changes behind the existing River Ways release gates.

## Upstream references

- Wan 2.2: https://github.com/Wan-Video/Wan2.2
- HunyuanVideo 1.5: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- LTX Video (legacy repo; points to LTX-2.5): https://github.com/Lightricks/LTX-Video
- LTX-2.5: https://github.com/Lightricks/LTX-2
- HyperFrames: https://github.com/heygen-com/hyperframes
- Remotion terms: https://www.remotion.dev/docs/terms
- Remotion licensing: https://www.remotion.pro/license
