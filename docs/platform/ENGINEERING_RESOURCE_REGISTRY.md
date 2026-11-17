# River Ways — Engineering Resource Registry

**Status:** Research baseline; recommendations are not adoption approvals  
**Reviewed:** 10 November 2026

## Decision rules

- Prefer the current verified stack and existing account capacity before adding infrastructure.
- "Open source" does not mean zero operating cost. Compute, storage, bandwidth, model downloads, maintenance and human time still count.
- No new subscription, paid API, metered service, paid template, paid asset or silent paid fallback without explicit written owner approval.
- Do not rebuild mature commodity infrastructure unless there is a demonstrated capability gap or a verified cost/portability advantage.
- Tutorials are learning material, not production dependencies.
- Verify exact versions, licenses, dependencies, model/asset terms and commercial rights before adoption.
- Research or a passing prototype does not mean a resource is implemented, verified or deployed.

## Priority summary

| Priority | Resource | River Ways use | Decision |
|---|---|---|---|
| P0 | Build Your Own X | Engineering learning and implementation patterns | Keep as reference |
| P1 | Existing Cloudflare + D1 foundation | Public site, enquiry intake and initial operational data | Preserve and audit |
| P2 | Meilisearch | Prospect, audit, client and knowledge search | Evaluate only if SQL search is insufficient |
| P3 | Temporal | Durable multi-step workflows and long-running agent jobs | Prototype only if simpler jobs cannot recover safely |
| P4 | NATS JetStream | Cross-service event transport | Defer until independently deployed services need it |
| P5 | n8n | Internal third-party integrations | Conditional; licensing and hosting economics first |
| P6 | Creative/media tools and models | Local graphics/video production | Evaluate tool/model/hardware/license individually |

## 1. Build Your Own X

- **Source:** https://github.com/codecrafters-io/build-your-own-x
- **Purpose:** Curated tutorials for databases, search engines, neural networks, distributed systems, web servers, bots, Git, Docker, browsers and graphics/renderers.
- **River Ways mapping:** Rebuilder crawling/search concepts; Revenue OS data and workflow concepts; agent architecture; creative rendering; developer enablement.
- **Decision:** Keep as a curated learning source. Extract only tutorials that unlock a defined backlog item.
- **License:** The collection README identifies a CC0 dedication for the collection. This does not relicense linked tutorials, code, datasets or assets. Check each tutorial's own license and terms.
- **Compatibility/cost:** No runtime dependency. Tutorials may use languages and infrastructure unlike our React/Vite, Node/Bun, Cloudflare and SQLite/D1 stack.
- **Gate:** Record exact tutorial URL, upstream date/commit, tutorial license, target capability, decision and verification evidence before copying code.

## 2. Existing Cloudflare, D1 and SQLite foundation

- **Sources:** https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/d1/ · https://www.sqlite.org/
- **Purpose:** Existing hosting, serverless functions and relational data foundation.
- **Mapping:** Public website, enquiry capture, initial lead records and lightweight API workflows.
- **Decision:** Preserve and inspect Pages Functions + D1 before selecting another database or job service. Review existing migrations and lead schema rather than replacing them.
- **Cost/compatibility:** Cloudflare is a hosted service, not a self-hosted open-source substitute. Verify current plan quotas and billing in the owner's account. Workers are not general-purpose long-running servers; do not assume Meilisearch, Temporal Server, NATS or n8n can run inside a Worker.
- **Gate:** Verify deployment source, bindings, D1 IDs, migration state, secrets, quotas and Preview/Production separation. No production deployment or migration is authorized by this evaluation.

## 3. Meilisearch

- **Source:** https://github.com/meilisearch/meilisearch
- **Release evidence:** Upstream releases list v1.56.2 on 9 November 2026. v1.56.1 notes important security fixes and recommends upgrading from v1.56.0.
- **Purpose:** Full-text, semantic and hybrid search.
- **Mapping:** Rebuilder prospect/audit search; Revenue OS lead/account retrieval; internal knowledge search; future Avenize knowledge retrieval.
- **Decision:** Evaluate, do not immediately adopt. Define real queries, corpus size, filters, access boundaries, freshness and relevance metrics. Compare against current D1/SQLite and a local SQLite FTS prototype.
- **License:** Community Edition is MIT. Enterprise features have separate commercial or BUSL 1.1 terms; do not assume every feature is MIT for production.
- **Cost/compatibility:** Self-hosting requires separate compute, storage and maintenance. It is not a Cloudflare Worker runtime dependency. Managed hosting may cost money.
- **Gate:** Benchmark representative, non-sensitive data. Test tenant filtering, deletion, backup/restore, index rebuild, rate limits and failure behavior. Adopt only if materially better than the simpler current solution.

## 4. Temporal

- **Source:** https://github.com/temporalio/temporal
- **Release evidence:** Upstream releases list v1.32.2 on 2 November 2026 with security fixes for the 1.32 minor release.
- **Purpose:** Durable workflow execution and orchestration.
- **Mapping:** Multi-stage prospect research; onboarding; payment-gated project activation; creative batch generation/review; long-running agent assignments.
- **Decision:** Prototype only after documenting a workflow that currently loses state or cannot recover safely. Compare with an application-owned job table, idempotent handlers and supported platform queue/scheduling features.
- **License:** MIT for the Temporal server repository; verify SDKs, UI, deployment distribution and dependencies separately.
- **Cost/compatibility:** Server requires a separate persistent system, backups, upgrades and monitoring. Temporal Cloud is commercial. Do not add under the zero-additional-cost rule without verifying available capacity.
- **Gate:** Demonstrate restart recovery, versioning, retries, timeouts, cancellation, observability and backup/restore in non-production.

## 5. NATS and JetStream

- **Source:** https://github.com/nats-io/nats-server
- **Purpose:** Messaging, publish/subscribe and persistent streaming.
- **Mapping:** Event transport between independently deployed Rebuilder, Revenue OS, agent workers, creative workers and Avenize services.
- **Decision:** Defer. Start with explicit domain events and an application-owned transactional outbox where the current deployment supports it. Add a broker only when service boundaries and delivery needs justify it.
- **License:** Upstream server is Apache-2.0; verify the exact release, client libraries and bundled components before adoption.
- **Cost/compatibility:** Persistent NATS requires a suitable runtime, storage, monitoring and backup. It cannot run as a long-lived daemon inside a Cloudflare Worker.
- **Gate:** Define delivery guarantees, replay/retention, ordering scope, dead-letter handling, tenant-safe payloads, deduplication and recovery. Verify current release/security advisories at selection time; no version is pinned here.

## 6. n8n

- **Source:** https://github.com/n8n-io/n8n
- **Purpose:** Workflow automation and third-party application integrations.
- **Mapping:** Internal notifications, email/CRM synchronization and administrative integrations.
- **Decision:** Conditional evaluation for internal-only use. Prefer native integrations when simpler. Do not make n8n the source of truth for business records.
- **License:** Source-available under n8n's Sustainable Use License, not an OSI-approved open-source license. Internal business use and customer-facing hosted/workflow-builder use have different boundaries. Review the current license and official usage guidance before deployment or resale.
- **Cost/compatibility:** Self-hosting requires persistent runtime, database, updates, secrets management and monitoring. Hosted offerings may be paid.
- **Gate:** Confirm the use case is permitted by the current license; document data flows and credentials; test retries, duplicate prevention, export and recovery.

## 7. Agency Agents

- **Upstream:** https://github.com/msitarzewski/agency-agents
- **River Ways integration:** Project-scoped Codex agents, operating rules and validators on `build/river-ways-execution-agency-agents`.
- **Decision:** Preserve the existing nine-agent development-time integration. Do not treat it as a production customer-facing agent service.
- **License:** Existing upstream attribution records MIT. Keep upstream source and River Ways adaptations distinguishable.
- **Verification boundary:** Repository files and CI validation do not prove local Codex runtime discovery or real subagent delegation. Follow `docs/agency-agents/CODEX_ACTIVATION_AND_VALIDATION.md`.

## 8. Creative and media production resources

- **Candidate sources:** https://www.remotion.dev/ · https://ffmpeg.org/ · https://github.com/Wan-Video/Wan2.2 · https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5 · https://github.com/Lightricks/LTX-Video
- **Mapping:** Local-first graphics/video production, repeatable templates, campaign batches, previews, review and exports.
- **Decision:** Prefer deterministic template-based graphics and Remotion/FFmpeg for repeatable production. Evaluate generative models individually and only against hardware actually available.
- **License caveats:** Remotion has company-size/commercial licensing terms; FFmpeg licensing depends on build configuration and enabled components; model code, weights, datasets and outputs may have different terms. Public repositories or downloadable weights do not imply blanket commercial permission.
- **Cost/compatibility:** Local generation avoids per-call API charges but still consumes compute, memory, storage, electricity and time. Cloud generation is excluded if it can incur charges without approval.
- **Gate:** Record exact release/weight version, hardware requirements, code and weight licenses, commercial-use terms, input/output restrictions, reproducibility, quality checks and fallback.

## Deferred infrastructure decisions

| Candidate | Why deferred | Reconsider when |
|---|---|---|
| PostgreSQL migration | Existing D1/SQLite work exists; no proven scale or capability gap | Multi-service transactions, volume, query/locking limits or portability need demonstrated by tests |
| Vector database | Corpus size and retrieval gap not measured | RAG evaluation proves SQL/full-text search insufficient |
| Temporal | Adds a separate persistent operational system | Critical long-running workflows need durable replay beyond simpler facilities |
| NATS | Adds broker operations and distributed failure modes | Independent services require durable pub/sub, replay or fan-out |
| n8n | License and hosting constraints | A permitted internal integration has clear maintenance advantage |
| Managed AI/search | Variable spend and data transfer | Explicit budget and data-processing approval |

## Next evaluation work

1. Inventory current services, plans, quotas, dependencies, licenses, data stores and deployment bindings.
2. Define real search queries and representative non-sensitive fixtures before evaluating Meilisearch.
3. Select one recoverable multi-step workflow before evaluating Temporal.
4. Define domain event envelopes and transactional consistency before considering NATS.
5. Record exact tool/model license evidence before creative production integration.
6. Update this registry only when a source is rechecked; preserve previous decisions and rejection/defer reasons.

## Status vocabulary

- **Research:** source inspected; no implementation implied.
- **Evaluating:** a bounded test is defined or in progress.
- **Adopted:** owner-approved architectural choice with a recorded decision.
- **Implemented:** code exists on a named commit.
- **Verified:** acceptance tests or operational evidence passed on the exact candidate.
- **Deployed:** runtime evidence exists for the named environment.
- **Deferred/Rejected:** decision and rationale are recorded.

No resource is marked Adopted, Implemented, Verified or Deployed merely because it appears here.

## 9. Recovered repository portfolio — River Ways agency

This section records repositories explicitly surfaced in the recovered River Ways work and additional engineering references found during that research. A listing is not an adoption, dependency, integration or security endorsement. The public agency website, internal agency operating platform, Rebuilder and Revenue OS remain distinct work areas with explicit contracts; Avenize is a separate product and is not part of this register's ownership scope.

### 9.1 User-requested repositories

| Resource | Exact source | Intended River Ways capability | Current disposition |
|---|---|---|---|
| GitHub Spec Kit | https://github.com/github/spec-kit | Specification-first feature planning and implementation discipline | Evaluate against existing PRD, task and agent workflows; avoid duplicate process |
| PentAGI | https://github.com/vxcontrol/pentagi | Security research and controlled penetration-testing support | Security-lab evaluation only; isolate, review permissions and never point at production without explicit scope |
| n8n workflow collection | https://github.com/Zie619/n8n-workflows | Patterns for internal workflow automation and integrations | Reference only; inspect each workflow, credentials, external calls and license before reuse |
| FreeLLMAPI | Exact repository not confirmed | Low-cost model access and provider fallback research | Identity unresolved; do not adopt a similarly named repository by assumption |
| Cloudflare security repository | Exact repository not confirmed | Security posture and vulnerability-checking patterns for Cloudflare-hosted services | Identity unresolved; use official Cloudflare guidance and current project controls until identified |
| Design-cloning repository | Exact repository not confirmed | Website/design reference analysis and implementation acceleration | Identity unresolved; do not copy third-party proprietary assets or code |
| SkillTree OS | https://skilltreeos.ai/plan/ | Reference for structured skills, roles and operating-system design for the agency | Product/reference research only; not a repository or a dependency |

The three unresolved repository identities must be matched to the original GitHub URLs before any clone, code review or adoption decision. Do not silently substitute golapkamal/Free-LLM-API, Cloudflare Flan Scan, or bienhoang/design-clone; those were only possible matches, not confirmed user selections.

### 9.2 Additional engineering references discovered during research

| Repository | Intended capability | Initial disposition |
|---|---|---|
| https://github.com/vercel/ai | Model/provider integration patterns | Reference; compare with existing provider adapters before reuse |
| https://github.com/supabase-community/vercel-ai-chatbot | Chat UX and AI application patterns | Reference; do not import a full application or Supabase assumptions |
| https://github.com/PostHog/posthog | Product analytics and event design | Reference; preserve privacy and avoid introducing a paid/hosted dependency without approval |
| https://github.com/getsentry/sentry | Error monitoring and observability | Reference; evaluate current low-cost monitoring before adding a provider |
| https://github.com/vercel/next.js | Framework engineering patterns | Reference only; River Ways website currently uses React + Vite, not Next.js |
| https://github.com/vercel/nextjs-subscription-payments | Subscription/payment reference implementation | Archived reference; do not use as a production payment foundation |
| https://github.com/shadcn-ui/ui | Accessible component implementation patterns | Reference; selectively adapt patterns to the current design system, do not wholesale replace it |
| https://github.com/microsoft/playwright | Browser automation and end-to-end testing | Preferred browser test reference; use the repository's existing Playwright harness |
| https://github.com/vitest-dev/vitest | Unit-test tooling | Reference only; prefer the existing Node test runner unless a demonstrated gap justifies a change |
| https://github.com/naptha/tesseract.js | OCR and text extraction | Evaluate only for a concrete document/media ingestion task |

### 9.3 Required repository intake gate

Before any resource is integrated, record:

1. Exact canonical repository URL, owner, repository name, upstream commit/tag and retrieval date.
2. Whether it was user-requested, research-discovered or independently recommended.
3. License for the exact code, assets, models, datasets and dependencies to be reused; identify commercial-use restrictions.
4. Maintenance activity, security advisories, dependency health and known vulnerabilities.
5. Runtime, hardware, storage, bandwidth, provider and ongoing human-maintenance costs.
6. The River Ways capability/backlog item it addresses and the existing implementation it would replace or complement.
7. A bounded proof using synthetic/non-sensitive data, measurable acceptance criteria and a rollback path.
8. Final disposition: reference, evaluating, adopted, implemented, verified, deferred or rejected—with exact commit and test evidence where applicable.

Do not clone or vendor a repository merely to make the register look complete. Prefer extracting a small, license-compatible pattern over importing a second framework or parallel platform. No additional spend, production access, external outreach or customer-data access is authorised by this register.


## 10. Open-source alternatives and agent skills — November 2026 review

This section records the user's requested alternatives and the initial River Ways fit assessment. These are **research dispositions**, not approvals to install, deploy, subscribe, spend, or connect customer data. The aim is to strengthen the existing agency operating platform, not create a collection of disconnected replacement apps.

### 10.1 Priority engineering and design skills

| Resource | Source | River Ways use | Disposition |
|---|---|---|---|
| Ponytail | https://github.com/DietrichGebert/ponytail | Simplification-first engineering, focused changes, review discipline | **Pilot first** as a lightweight review method; retain security, accessibility and data-loss protections |
| RTK | https://github.com/rtk-ai/rtk | Reduce noisy CLI output and agent context overhead | **Pilot** in the coding environment; measure output reduction and correctness, not headline savings claims |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Design-system direction, interface patterns and UI quality | **Pilot** against River Ways design constitution and current component system; avoid competing design tokens |
| Corey Haines marketingskills | https://github.com/coreyhaines31/marketingskills | SEO, GEO, CRO, positioning, landing pages, cold outreach, analytics, RevOps and sales enablement | **High-priority pilot** for the growth/acquisition and content workflows |
| Matt Pocock skills | https://github.com/mattpocock/skills | Requirements clarification, architecture review, triage, specs and PR quality | **High-priority pilot** for engineering workflow; keep requirements questions short and evidence-led |
| Emil Kowalski skills | https://github.com/emilkowalski/skills | Interaction design, motion, animation engineering, prototypes and UI polish | **High-priority pilot** for the public website and creative interfaces; motion must remain performant and accessible |
| Graphify | https://github.com/Graphify-Labs/graphify | Queryable map of code, docs and schemas for repository understanding | **Evaluate** only if repository navigation remains a measured bottleneck; start with local/code-only mode |
| Humanizer | https://github.com/blader/humanizer | Editorial review for repetitive or generic AI-writing patterns | **Optional editorial check**; never let it erase River Ways' voice or replace human review |

The skill/repository names above are not proof that their contents are installed in this repository. Pin the exact upstream revision and inspect each skill's instructions before importing or executing it. Check license and provenance at the exact revision.

### 10.2 Product alternatives mapped to agency operations

| Resource | Source | Potential capability | Disposition and constraints |
|---|---|---|---|
| OpenSEO | https://github.com/every-app/open-seo | Keyword research, rank tracking, competitor insights, backlinks, site audits and AI visibility | **Highest-priority product evaluation** for SEO/keyword intelligence. Requires DataForSEO credentials and usage-based data spend; not a zero-cost data source. Test a narrow workflow and record API cost before any connection. |
| Chatwoot | https://github.com/chatwoot/chatwoot | Shared inbox for website chat, email and supported social/messaging channels | **Evaluate** for client/lead communications only if current platform inbox capabilities are insufficient. Self-hosting needs persistent infrastructure, upgrades, backups and monitoring; confirm edition feature boundaries. |
| Cal.diy | https://github.com/calcom/cal.diy | Booking and scheduling | **Evaluate** for simple discovery-call booking. Community scope may omit team, workflow, SSO and other advanced features; validate routing needs before selection. |
| Cap | https://github.com/CapSoftware/Cap | Screen recordings, walkthroughs and client-facing demos | **Pilot desktop workflow first**. Full self-hosting adds API, database, media-server and object-storage operations. Most code is AGPL-3.0; check component licenses. |
| Open Higgsfield | https://github.com/wide-trace/open-higgsfield | AI image/video generation workspace | **Experimental only**. Small/early repository maturity requires code, provider, model, output-rights and cost review before any use. |
| VoiceStudio | https://github.com/debpalash/VoiceStudio | Voice generation/cloning, dubbing, transcription and dictation | **Evaluate only for a defined production need**. AGPL-3.0 obligations apply to the application; model/voice assets have separate terms. Requires compute and storage. Voice cloning requires informed consent. |
| AppFlowy | https://github.com/AppFlowy-IO/AppFlowy | Docs, workspace, wiki and project management | **Defer**: likely duplicates current River Ways docs and operating platform; avoid a second source of truth. AGPL-3.0. |
| OpenWhispr | https://github.com/OpenWhispr/openwhispr | Desktop dictation and transcription | **Defer**: overlaps VoiceStudio dictation/transcription and is not a core agency platform gap. MIT. |
| OpenProject | https://github.com/opf/openproject | Project and portfolio management | **Defer**: duplicates existing project/operations workflows and introduces a persistent hosted service. GPL-3.0. |
| OpenProject/Asana alternative is not a reason to migrate | — | Preserve existing project records and workflows | Reconsider only after a documented gap and migration-cost comparison. |

### 10.3 Security and unresolved identities

| Resource | Source | Disposition |
|---|---|---|
| PentAGI | https://github.com/pentagi/pentagi | **Security-lab evaluation only**. Isolate it, define explicit authorized targets and scope, review tool permissions and network egress, and never aim it at production or third-party systems without written authorization. |
| Lemo-Opuscar | Exact identity/URL not supplied | **Unresolved**. Do not guess the project or install a similarly named package. |

### 10.4 Initial operating architecture

Use the existing River Ways platform as the system of record. Add a capability only when a bounded proof demonstrates that it closes a real gap.

- **Engineering and design workflow:** Ponytail + RTK + Matt Pocock + UI UX Pro Max + Emil Kowalski; Graphify only if repository comprehension is still slow.
- **Growth and acquisition:** Corey Haines skills; evaluate OpenSEO as a data-backed capability with an explicit per-query/API budget.
- **Creative production:** deterministic templates and existing creative workflows first; evaluate Open Higgsfield, VoiceStudio and Cap individually, with approval and licensing gates.
- **Client success:** retain current CRM/lead records; evaluate Chatwoot for inbox consolidation and Cal.diy for booking only if current flows cannot meet requirements.
- **Knowledge and project execution:** keep current docs and platform authoritative; defer AppFlowy and OpenProject to avoid parallel systems.
- **Security:** use PentAGI only in a segregated, explicitly authorized test environment.

### 10.5 Existing ChatGPT skill coverage — avoid duplicate setup

A review of the skills currently available in this ChatGPT workspace found relevant existing capabilities for:
- Website/design-system research and implementation guidance.
- SEO audits and video transcript extraction.
- Marketing performance reporting through connected Windsor.ai capabilities.
- Agent-building, Vercel AI SDK/gateway, React quality review and end-to-end verification.
- Figma design-to-code and motion workflows.

These workspace skills are not the same thing as installing the external GitHub repositories above. Reuse the available workspace capability for the task it already covers; do not add a second tool merely because its category sounds similar. The external skills still need a separate bounded evaluation before being copied into the River Ways repository.

### 10.6 Pilot order and acceptance gates

1. **Ponytail + RTK:** apply to one existing, bounded code-change/review cycle. Measure command-output reduction, review time, diff size and whether tests/security checks remain intact.
2. **Matt Pocock + UI UX Pro Max + Emil:** apply to one engineering task and one defined interface/motion task. Verify no duplicate architecture or design system is introduced; run existing checks.
3. **Corey Haines:** map selected skills to the acquisition backlog (positioning, keyword bank, SEO content, outbound, CRO and measurement). Keep outbound human-approved.
4. **OpenSEO:** define a small keyword/competitor/site-audit sample, record DataForSEO usage and cost, and compare outputs with current research before deciding.
5. **Chatwoot or Cal.diy:** do not pilot both at once. Select only the capability with the clearest current operational gap and test with synthetic data.
6. **Creative tools:** inspect one at a time, beginning with desktop Cap or a narrowly scoped Open Higgsfield proof; record hardware, API charges, licenses and output rights.
7. **Graphify:** evaluate only after capturing a baseline for time-to-locate relevant code/docs in a real task.

Every pilot must have a named owner, exact upstream commit, scope, test data, acceptance criteria, cost ceiling (zero unless explicitly approved), rollback path and outcome. No resource becomes Adopted, Implemented, Verified or Deployed until its corresponding evidence is recorded under the status vocabulary in this registry.


## 11. Simplified engineering + RTK pilot — implementation record

**Pilot scope:** repository-level coding-agent guidance and optional local command-output compression.  
**Implementation branch:** `build/river-ways-execution-agency-agents`.  
**Implementation date:** 17 November 2026.

### Changes committed

- Added `.agents/skills/simplified-engineering/SKILL.md`, a River Ways project skill derived from the public Ponytail approach and adapted to this repository's architecture, release gates and quality requirements.
- Updated `AGENTS.md` to make the skill part of routine engineering guidance and document safe, optional RTK use.
- No application runtime code, package dependencies, lockfiles, CI workflow, deployment settings, secrets, customer data or production services were changed.

### Pilot behavior

- The skill requires reading affected code and callers before editing, then choosing the smallest complete solution.
- It prioritizes reuse, native/platform features and existing dependencies before introducing new abstractions or packages.
- It explicitly protects validation, authorization, data-loss handling, privacy, security, accessibility, compatibility and tests.
- It requires focused tests for non-trivial logic and honest reporting of checks not run.
- RTK is documented as optional local tooling. When already installed and initialized, agents may use its command wrappers and `rtk gain`; ordinary commands remain the fallback. Full diagnostics can use `rtk bypass`.
- No RTK installation, Codex plugin marketplace change, global agent hook, telemetry opt-in, proxy or pipeline was performed. Those require access to the user's local development environment and separate review.

### Evidence and limits

| Check | Result |
|---|---|
| Fetch updated `AGENTS.md` from target branch | Pass; new simplified-engineering and RTK instructions read back |
| Fetch new skill from target branch | Pass; metadata and skill content read back |
| Skill validator | Not run in this environment |
| Python regression suite | Not run in this environment |
| Website build and test suites | Not run; no local checkout/runtime available through this GitHub-only edit |
| RTK installation and `rtk gain` baseline | Not run; local developer machine unavailable |
| Ponytail plugin runtime activation | Not run; local Codex plugin manager unavailable |
| CI / deployment | Not triggered; PR workflow publishes Cloudflare Preview and owner has not authorised a Preview review |

**Status:** Repository guidance implemented and read-back verified. The local RTK installation and measured before/after output pilot remain **blocked pending local environment access**. Do not mark either external tool as installed or runtime-verified until that evidence exists.
