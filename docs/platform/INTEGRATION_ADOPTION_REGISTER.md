# River Ways — Integration Adoption Register

**Status:** Repository discovery and architecture decisions; installation is not implied  
**Reviewed:** 23 November 2026  
**Owner:** River Ways  
**Working branch:** `docs/river-ways-ecosystem-convergence`

## 1. Adoption rules

A repository is not an integration merely because it exists or appears in a social-media list.

Every candidate must pass:
1. exact repository identity and upstream activity check;
2. capability and use-case fit;
3. code and dependency review;
4. licence and commercial-use review;
5. operating-system, hardware and runtime compatibility;
6. security, data access and tenant-isolation review;
7. cost and maintenance review;
8. isolated proof of concept;
9. acceptance tests and rollback plan.

Do not install all candidates at once. Prefer the smallest complete set that supports a real River Ways workflow. Record the exact commit/tag selected at adoption time.

## 2. Status vocabulary

- **Existing foundation:** code or architecture is already present in the inspected River Ways branch.
- **Adopt candidate:** strong fit; implementation is still gated by review and tests.
- **Evaluate:** plausible fit; do not install or depend on it yet.
- **Reference only:** useful patterns, prompts or documentation; not a runtime dependency.
- **Defer:** no current use case or infrastructure justification.
- **Blocked:** a known compatibility, rights, cost or missing-information issue prevents adoption.

## 3. Film and creative production repositories

All 13 repository identities below were checked against GitHub on 23 November 2026. This confirms that the repositories exist. It does not establish that every feature claim in the social post is accurate or that the repository is safe and ready for production.

| # | Repository | Verified capability from upstream README | Licence / operating note | River Ways decision |
|---|---|---|---|---|
| 1 | [JuneYaooo/rea-video](https://github.com/JuneYaooo/rea-video) | Reverse-engineers videos shot by shot and produces structured `VIDEO.md` reports for agents | README identifies Python 3.10+; root licence is Apache-2.0 | **Adopt candidate** for reference intelligence; sandbox before processing client footage |
| 2 | [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) | Prompt/reference collection; README lists 703 prompts and 418 live remakes | Root licence is MIT; original video and prompt attribution/rights still need checking individually | **Reference library**; index prompts and sources, do not treat every source video as reusable media |
| 3 | [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | README presents 99 code-generated film styles and example films for coding agents | Custom project licence; rights and commercial-use scope require legal review | **Evaluate / curate**; use as style research, not a default production dependency |
| 4 | [storytold/effectcraft](https://github.com/storytold/effectcraft) | Rust motion-graphics and VFX compositor; README describes compositions, layers, keyframes, effects, 3D cameras/lights and render queue | README advertises MIT OR Apache-2.0; root common licence filenames were not found in this check. Verify exact licence files, maturity and build requirements | **Evaluate** as a possible local motion/VFX alternative |
| 5 | [patch-gg/pixelfx](https://github.com/patch-gg/pixelfx) | README lists 244 pixel-art effects and animations, browser gallery, sprite-sheet export and an agent skill | Root licence is MIT; inspect asset provenance and generated content terms | **Optional specialist** for pixel-art and game-oriented campaigns |
| 6 | [Comfy-Org/ComfyUI](https://github.com/Comfy-Org/ComfyUI) | Node-graph visual generation engine for images, video, 3D and audio workflows | Root licence is GPL-3.0; model/checkpoint licences are separate. Keep as a private local service and review distribution obligations | **Existing Creative Studio candidate**; local-only adapter already exists in the River Ways codebase |
| 7 | [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | React-based programmatic video composition and rendering | Remotion has its own proprietary/source-available licence and conditional use terms; it is not OSI open source. Review current company and automation terms | **Optional renderer**; do not make it the default without a licence and cost decision |
| 8 | [remotion-dev/skills](https://github.com/remotion-dev/skills) | Official Remotion agent skills for composition and video-production practices | Repository-specific licence and skill compatibility need checking | **Reference / optional skill**; do not install if it conflicts with existing River Ways agent rules |
| 9 | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | HTML/CSS/JavaScript-based programmatic video composition and rendering | Root licence is Apache-2.0; confirm CLI version, local rendering path and bundled media obligations | **Preferred renderer candidate** already represented by a local River Ways template and adapter |
| 10 | [mrdoob/three.js](https://github.com/mrdoob/three.js) | JavaScript 3D library with WebGL and WebGPU renderers | Root licence is MIT; WebGL/WebGPU browser support and bundle size need testing | **Adopt selectively** for interactive web/3D experiences |
| 11 | [greensock/GSAP](https://github.com/greensock/GSAP) | JavaScript animation and timeline library | Review current GSAP licence and plugin terms for the exact version and features; do not assume every plugin has identical terms | **Adopt selectively** for motion and composition; avoid a duplicate animation stack |
| 12 | [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) | MCP bridge for controlling Blender through an agent | Licence, Blender version support, exposed operations and security require source audit | **Evaluate** in a local sandbox; no unrestricted desktop or filesystem access |
| 13 | [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | Multimedia processing, encoding, transcoding and packaging | FFmpeg is LGPL by default, but GPL-enabled components/build options can change the effective obligations. Audit the exact binary configuration and linked libraries | **Core media utility**; verify the actual binary build and licence notices |

### 3.1 Important corrections to the original social post

- The 703-prompt repository README currently states that 418 entries have live remakes. The number in the post should not be interpreted as 703 production-ready video templates.
- Lemo-Opuscar describes 99 styles. Its project licence is custom and needs commercial-use review.
- EffectCraft's README describes 308 effects, not merely a free effects pack. It is a young Rust application, so assess build stability and export interoperability before adoption.
- PixelFX is a specialised pixel-art effects library, not a general-purpose motion graphics compositor.
- ComfyUI is GPL-3.0 software. Individual model weights and workflows can have different licences.
- Remotion's licence is not equivalent to MIT or Apache open source.
- A free repository does not provide free GPU compute, model inference, Adobe subscriptions, cloud rendering, stock media or unlimited exports.

## 4. Adobe ecosystem candidates

See [ADOBE_ECOSYSTEM_REGISTER.md](../integrations/ADOBE_ECOSYSTEM_REGISTER.md) for the detailed application map, source checks, adapter design and acceptance gates.

| Resource | Role | Decision |
|---|---|---|
| Adobe UXP | Official plugin and scripting platform for supported applications | Preferred integration path where APIs support the required operation |
| Adobe Creative Cloud developer-resource index | Community resource discovery | Reference only; each listing needs independent review |
| Adobe Premiere UXP samples | Official Premiere implementation examples | Adopt as a development reference |
| dcc-mcp/adobepy | Shared local broker and Python SDK candidate | High-priority evaluation; licence and platform checks remain open |
| cavi-ai/adobe-mcp | Multi-application MCP servers | Blocked for current Windows workstation by its stated macOS requirement |
| Jonohobs/adobe-mcp | Windows Adobe COM/ExtendScript automation candidate | Evaluate in sandbox; audit command, path and application identity controls |
| Other Adobe MCP projects | App-specific After Effects, Lightroom and Photoshop/Premiere tools | Evaluate only against a real production need |

Adobe desktop software, application subscriptions and generative credits remain separate commercial costs. No Adobe connector is installed or enabled by this register.

## 5. Other ecosystem foundations

| Capability | Candidate | Decision | Boundary |
|---|---|---|---|
| AI workforce management | Paperclip | Evaluate | May manage roles, goals and task assignments; does not replace the existing agent execution runtime |
| Agent UI event protocol | AG-UI | Evaluate | Interaction and event streaming; not an agent orchestrator or permission system |
| Agent tool interface | MCP | Adopt as an adapter protocol where useful | Must sit behind River Ways identity, policy and audit controls |
| CRM | Twenty | Evaluate | CRM system of record must be selected before duplicate client/contact stores are created |
| Social publishing | [Postiz](https://github.com/gitroomhq/postiz-app) | Architecture foundation exists in a separate branch | Separate service; AGPL-3.0 review; official OAuth, tenant isolation and exact-content approval required |
| Workflow automation | n8n | Conditional evaluation | Source-available Sustainable Use License; verify permitted use and deployment costs |
| Search | Meilisearch | Evaluate only if SQL/SQLite search is insufficient | Separate compute and operations; do not add before representative relevance tests |
| Durable workflows | Temporal | Defer | Use only if current job/lease/retry model cannot meet recovery requirements |
| Event broker | NATS JetStream | Defer | Introduce only when independent services need durable event transport |
| Design source | Figma | Use existing design workflow | Keep source components and design tokens aligned with code |
| Deployment | Cloudflare Pages / Vercel | Preserve verified project deployment boundaries | Verify current production project, bindings and release source before action |
| Email | Resend | Existing project integration candidate | Verify sender, secret, delivery and failure states in a controlled environment |
| Acquisition intelligence | Rebuilder / Revenue OS | Separate workstream | Send qualified evidence-backed opportunities into CRM through a documented contract |

## 6. Integration contracts

Each adopted integration must have:
- a stable internal adapter interface;
- exact upstream URL, release/tag/commit and licence record;
- documented input and output schemas;
- explicit identity and capability scopes;
- client/workspace isolation tests;
- bounded timeouts, retries and idempotency;
- cancellation and unknown-outcome recovery;
- structured, redacted audit events;
- health/readiness checks;
- unit and contract tests;
- a documented deactivation and rollback procedure.

Do not couple the River Ways UI directly to the schema of a community MCP server. The internal adapter owns translation and validation.

## 7. Immediate implementation priorities

| Priority | Work item | Completion evidence |
|---|---|---|
| P0 | Reconcile the Creative Studio branch with the latest website/GodMode work | Exact ancestry, overlap and merge plan |
| P0 | Correct the Creative Studio worker documentation conflict | Source-backed capability statement and passing tests |
| P1 | Establish shared integration manifest/schema | Validated records for each enabled adapter |
| P1 | Complete Adobe source/licence/security review | Approved Windows pilot candidate and capability list |
| P1 | Prove Creative Studio Preview Access, D1, R2 and local worker connection | Non-production end-to-end evidence |
| P1 | Benchmark HyperFrames locally and select the first renderer | Real MP4, source composition, QA report and timing |
| P2 | Evaluate Rea-Video against a rights-cleared reference clip | Structured report, source attribution and repeatability |
| P2 | Curate Opus and Lemo prompt/style references | Searchable metadata, source links and reuse permissions |
| P2 | Evaluate EffectCraft and Blender MCP in isolation | Reproducible build, security review and interoperability test |
| P3 | Connect social publishing after identity and approval gates | Draft, review, schedule and failure-recovery tests |

## 8. External inspiration and missing source material

- **Code & Chill Facebook page:** the exact page/post URL has not been supplied. Do not infer the account or copy code from an unrelated page. Once the exact source is available, record its post, code source, licence and intended River Ways feature.
- Social-media screenshots are visual references, not reusable source code.
- Do not copy proprietary interface code or assets without permission. Rebuild the interaction using River Ways components and original implementation where the source is not licensed for reuse.

## 9. Adoption rule

No candidate becomes an active production dependency until its row records:
- selected version or commit;
- licence decision;
- owner approval where cost or client data is involved;
- environment and hardware requirements;
- integration tests;
- operational owner;
- rollback path.

The register is a decision tool. It is not a list of software that has been installed.
