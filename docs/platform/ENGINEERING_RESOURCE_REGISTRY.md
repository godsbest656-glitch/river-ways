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
