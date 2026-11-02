# River Ways Agency Operating Platform — Implementation Tasks

**Status:** Prioritized implementation backlog  
**Version:** 1.0 · 2 November 2026  
**Rule:** This is a planned backlog. A task is not complete until implementation evidence is recorded.

## 1. Execution strategy

Build the smallest dependable operating foundation first. Do not attempt to implement the entire platform in one pass. Preserve existing website behavior and work in reviewable branches. Use the repository's current active release branch only after inspecting it; this document branch is documentation work, not a production release.

Every task must have: owner, outcome, dependencies, acceptance criteria, test evidence, cost impact and status. Use statuses: `Proposed`, `Ready`, `In progress`, `Blocked`, `Review`, `Verified`, `Deferred`.

## 2. P0 — Baseline, security and cost verification

### P0.1 Repository and deployment baseline
- [ ] Identify active development/release branch and reconcile open PRs.
- [ ] Inspect current package manifest, source, functions, D1 schema, bindings, environment configuration and deployment source.
- [ ] Record production vs preview vs local differences.
- [ ] Confirm current enquiry path and run safe end-to-end test where authorized.
- [ ] Preserve live domain, DNS, email and production routing.
- **Acceptance:** a dated current-state audit identifies verified facts, unknowns, blockers and exact tested commit.

### P0.2 Zero-cost dependency audit
- [ ] Inventory current services, plans, quotas and billing behavior.
- [ ] Inventory dependencies, external APIs, fonts, media, plugins and model downloads.
- [ ] Flag paid, metered, trial-only or unclear-license resources.
- [ ] Add an automated or reviewable check preventing new unapproved paid dependencies.
- **Acceptance:** no new service can create a bill; all retained external dependencies have documented cost and rights status.

### P0.3 Security and data boundaries
- [ ] Define roles and permission matrix.
- [ ] Define organization/tenant ownership model.
- [ ] Threat-model authentication, public forms, files, background jobs and imported AI inputs.
- [ ] Define secrets handling, rate limits, audit events, retention, export and deletion.
- [ ] Define backup and tested restore procedure.
- **Acceptance:** authorization is enforced server-side and cross-tenant access tests pass before client data is introduced.

## 3. P1 — Operational foundation

### P1.1 Data model and migrations
- [ ] Define schema for users, roles, memberships, organizations, contacts, prospects, opportunities, clients and projects.
- [ ] Add migrations with rollback/recovery plan.
- [ ] Define immutable IDs, timestamps, timezone policy and status enums.
- [ ] Add indexes and uniqueness/idempotency constraints.
- **Acceptance:** schema is documented, migration is repeatable and data integrity tests pass.

### P1.2 Authentication and authorization
- [ ] Select a zero-additional-cost identity/session approach after capability and security review.
- [ ] Implement secure sessions and role-based permissions.
- [ ] Enforce tenant isolation for every client-owned record.
- [ ] Add permission-denied and session-expired states.
- **Acceptance:** automated tests prove unauthorized and cross-tenant reads/writes are denied.

### P1.3 CRM and client lifecycle
- [ ] Model inbound enquiries separately from outbound prospect research.
- [ ] Link organizations, contacts, opportunities, proposals, payment records and projects.
- [ ] Record contact history, next actions, opt-outs and evidence.
- [ ] Add conversion from qualified opportunity to client.
- **Acceptance:** a prospect can be traced through qualification, proposal, verified payment and client onboarding without duplicate records.

### P1.4 Project and task delivery
- [ ] Create project templates by engagement type.
- [ ] Add milestones, deliverables, tasks, owners, due dates, dependencies and status events.
- [ ] Add scope-change records and approval.
- [ ] Attach evidence to completion events.
- [ ] Add client-visible versus internal-only notes.
- **Acceptance:** a real project can be planned, assigned, updated, blocked, completed and accepted with an auditable timeline.

## 4. P2 — Evidence-based reporting

### P2.1 Work event capture
- [ ] Record task status changes, milestone events, deliverable versions, approvals and blockers.
- [ ] Capture actor, timestamp, source and evidence reference.
- [ ] Define what constitutes completed, accepted and published work.
- **Acceptance:** report facts can be traced to source records.

### P2.2 Report engine
- [ ] Define report schemas for daily, weekly, project, client, creative and agency reports.
- [ ] Add period and timezone handling.
- [ ] Define metric formulas and data-quality states.
- [ ] Generate versioned report snapshots.
- [ ] Export accessible PDF/CSV/HTML using free local tooling or existing capacity.
- **Acceptance:** rerunning a report with the same source snapshot produces the same figures; caveats and sources are visible.

### P2.3 Operational dashboard
- [ ] Show upcoming deadlines, blocked work, overdue items, approvals waiting and project health.
- [ ] Avoid vanity metrics and fabricated completion values.
- [ ] Provide drill-through to the records behind every number.
- **Acceptance:** a manager can identify the next operational action without relying on unsupported summary metrics.

## 5. P3 — Creative Studio and batch engine

### P3.1 Creative brief and brand profile
- [ ] Capture business objective, offer, audience, geography, channel, dates, scope, CTA, restrictions and success measure.
- [ ] Store brand voice, approved logos, colors, fonts, product facts and prohibited claims.
- [ ] Validate payment/scope eligibility.
- **Acceptance:** a brief is complete enough to plan a campaign and its provenance is recorded.

### P3.2 Social data import
- [ ] Define CSV/JSON import formats and examples.
- [ ] Support client-authorized exports first.
- [ ] Validate source, account, period, timezone, units, duplicates and metric definitions.
- [ ] Store provenance and data limitations.
- [ ] Do not scrape private accounts or assume API access is free.
- **Acceptance:** imported data can be audited and missing metrics are explicitly represented.

### P3.3 Campaign intelligence
- [ ] Build deterministic analysis for available content performance.
- [ ] Add local language-model assistance only after hardware/model/license assessment.
- [ ] Generate content pillars, hypotheses, hooks, formats and rationale.
- [ ] Create a proposed batch matrix constrained by paid scope and production capacity.
- [ ] Require human approval.
- **Acceptance:** every recommendation identifies its evidence or labels itself as a hypothesis.

### P3.4 Batch graphics
- [ ] Evaluate local image-generation feasibility on available hardware.
- [ ] Build SVG/HTML/CSS template-based fallback.
- [ ] Add batch IDs, job queue, previews, quality checks and exports.
- [ ] Register all fonts, images, models and templates with licence evidence.
- **Acceptance:** one approved plan produces a reproducible batch without paid API calls.

### P3.5 Batch video
- [ ] Prototype Remotion/FFmpeg local rendering.
- [ ] Define aspect ratios, subtitles, safe areas, audio and encoding presets.
- [ ] Add render queue, retry, cancellation and partial-batch visibility.
- [ ] Add static/template fallback if AI footage generation is unavailable.
- **Acceptance:** a batch can render locally, validate outputs and provide a manifest without paid services.

### P3.6 Review and delivery
- [ ] Build internal quality review and client approval gallery.
- [ ] Track version, feedback, revision and final approval.
- [ ] Provide authorized downloads and deliverable manifest.
- **Acceptance:** client sees only their own assets and can approve/request changes.

## 6. P4 — Client workspace and public catalogue

### P4.1 Client portal
- [ ] Project overview and milestones.
- [ ] Brief submission and secure file upload.
- [ ] Deliverable review and approval.
- [ ] Reports and final file downloads.
- [ ] Client notification and communication history.
- **Acceptance:** client role cannot access internal notes or another tenant.

### P4.2 Public catalogue
- [ ] Define catalogue entry schema and classification.
- [ ] Add permission/rights publication gate.
- [ ] Support client work, internal experiments, concepts and prototypes with clear labels.
- [ ] Build curated editorial categories and project detail pages.
- [ ] Add case-study evidence and verified outcome fields.
- **Acceptance:** only explicitly approved public-safe records can be rendered.

### P4.3 Homepage integration
- [ ] Preserve SHAPED CURRENT and current mark provisionally.
- [ ] Design the homepage as a curated catalogue of exceptional work.
- [ ] Keep positioning, services, proof and enquiry journey clear.
- [ ] Provide performance-safe media, poster and reduced-motion fallbacks.
- **Acceptance:** responsive, accessible and tested experience with no invented portfolio claims.

## 7. P5 — Campaign analytics and learning

- [ ] Import post-campaign analytics with provenance.
- [ ] Compare outcomes to objectives and historical baselines.
- [ ] Distinguish attribution evidence from correlation.
- [ ] Generate recommendations for the next batch.
- [ ] Store learning and approved strategy changes.
- **Acceptance:** next-cycle recommendations show which evidence informed them and what remains uncertain.

## 8. Release gates

Before any release:
1. Build and automated tests pass.
2. Security and tenant-isolation tests pass for affected modules.
3. No paid or metered dependency has been introduced.
4. Data migration and rollback/recovery are documented.
5. Accessibility and responsive checks pass.
6. Real browser evidence exists for UI changes.
7. Existing enquiry, SEO and deployment behavior is regression-tested.
8. No production DNS/deployment change occurs without separate authorization.
9. PR describes what is implemented, tested, not tested and blocked.

## 9. First execution sequence

1. Complete P0.1 current-state audit.
2. Complete P0.2 zero-cost audit.
3. Complete P0.3 threat model and tenant model.
4. Agree the smallest data model for P1.1.
5. Implement P1.2 authorization before storing client records.
6. Build P1.3 CRM and P1.4 project delivery.
7. Build P2 reporting from real work events.
8. Add creative brief and data import before generation.
9. Add local/template batch production.
10. Add client review and catalogue publication.

Do not start with AI image/video generation before the project, rights, cost, approval and evidence foundations exist.
