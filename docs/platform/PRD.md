# River Ways Agency Operating Platform — Product Requirements

**Status:** Proposed product specification  
**Version:** 1.0  
**Date:** 2 November 2026  
**Owner:** River Ways  
**Scope:** Public website, internal agency workspace, client workspace, evidence-based reporting, and zero-additional-cost creative production.

## 1. Product vision

River Ways is building a digital agency whose website is also a dependable part of its operating infrastructure. The platform must help River Ways attract and qualify opportunities, convert them into paid engagements, deliver work, create exceptional creative assets, report what happened, learn from outcomes, and present approved work as a growing catalogue of brilliance.

The product has two connected outcomes:

1. **External trust and growth:** a distinctive public experience that explains River Ways, demonstrates capability through truthful work, and converts qualified global prospects.
2. **Internal operational leverage:** a secure, auditable system for managing prospects, clients, projects, tasks, creative production, approvals, deliverables, reporting, and learning.

The public website is the front door. It is not the whole operating system.

## 2. Product principles and constraints

- Brand name is **River Ways** (two words); domain remains `riverwayse.com`.
- Preserve the current approved SHAPED CURRENT direction and current mark provisionally. Logo/identity redesign is out of scope unless separately approved.
- The River philosophy is a strategic foundation: the River has a way, life, environment, seasons and people; people are ecosystems in which the River participates; the River's end goal is the ocean. Apply this as a source of strategic and creative thinking, not as literal decoration in every interface.
- Initial acquisition market is global; acquisition strategy is hybrid inbound and outbound.
- **Zero additional cost is a hard product constraint.** No new subscriptions, paid APIs, metered services, paid templates, paid stock assets, or services that can silently create a bill. Prefer existing infrastructure, open-source software, local processing, free assets with verified commercial rights, and manual import/export where integrations are not free.
- Do not confuse free software with free compute, unlimited model use, or free social-platform API access. The product must expose limits and fall back safely.
- Never fabricate client work, testimonials, metrics, credentials, campaign outcomes, reports, or integrations.
- Preserve existing working application behavior, enquiry capture, SEO, security, deployment assumptions and verified project history. Do not make production or DNS changes through this documentation work.

## 3. Users and roles

### Internal roles
- **Founder / administrator:** full agency oversight, commercial decisions, access control and approvals.
- **Project manager / account lead:** client onboarding, scope, plans, tasks, deadlines, status and reporting.
- **Strategist:** research, brief interpretation, campaign strategy and measurement plans.
- **Designer / creative producer:** visual concepts, graphics, video, revisions, asset metadata and exports.
- **Developer:** website, integrations, technical delivery, tests and deployment evidence.
- **Finance role:** invoices, payment status, approved expenses and project financial reporting.
- **Read-only reviewer:** limited access to assigned projects and evidence.

Roles may be combined in the early agency, but permissions must remain explicit.

### Client role
A client can access only their own organization and authorized projects, briefs, review items, reports and deliverables. Clients must never see internal notes, other clients' data, prospect records, internal financial margins, credentials or unapproved work.

## 4. Product surfaces

### 4.1 Public website
- Explain River Ways, Demand Engineering, services, engagement paths and global positioning.
- Present a curated catalogue of original demonstrations and authorized client work.
- Distinguish client work, internal experiments, speculative concepts and prototypes.
- Publish case studies only with client permission and verified claims.
- Provide accessible enquiry and consultation journeys.
- Support search discovery with accurate metadata and structured data.
- Keep the primary conversion path clear and reliable.

### 4.2 Internal agency workspace
- Agency dashboard and operational overview.
- CRM for prospects, organizations, contacts, opportunities and interactions.
- Client onboarding, scope, payment verification and project creation.
- Projects, milestones, deliverables, tasks, dependencies, owners and deadlines.
- Time or effort records only where useful and actually captured.
- Creative Studio for briefs, research inputs, strategy, batch plans, asset jobs, reviews and exports.
- Document and asset library with versions, provenance, permissions and retention.
- Evidence-based reports and audit history.
- Finance records for quotes, invoices, payments, refunds, approved expenses and project margin where data exists.
- Notifications and follow-up queues using existing free channels or in-app notifications.

### 4.3 Client workspace
- Secure project overview and status.
- Brief submission and brand asset upload.
- Milestone and deliverable visibility.
- Creative batch plan review and approval.
- Asset preview, feedback, revision history and final downloads.
- Reports with source, period, generated date and clear metric definitions.
- Payment and invoice visibility where safely supported.
- No access to internal operations or another client's records.

## 5. Core workflows

### 5.1 Prospect to client
1. Capture inbound enquiry or researched outbound prospect.
2. Record source, lawful public business contact channel, observation, consent/opt-out state and next action.
3. Qualify against an explicit rubric; preserve source evidence.
4. Record discovery, proposal, agreed scope, price and decision.
5. Verify payment from an authorized record or provider confirmation; never infer payment from a client message.
6. Create client organization and project from the approved scope.
7. Preserve the link from prospect → opportunity → client → project → invoice/payment.

### 5.2 Paid brief to creative batch
1. Confirm approved scope, payment eligibility and production budget.
2. Receive a structured brief: objective, offer, audience, geography, channels, dates, deliverables, constraints, brand assets, claims and CTA.
3. Ingest client-authorized social analytics exports and other permitted evidence. Record source, account, date range, timezone, retrieval time, metric definitions and data limitations.
4. Analyze content history and available signals; do not assume unavailable platform metrics.
5. Produce a campaign strategy and a proposed asset plan with rationale, hypotheses, formats, quantities, variants, dimensions, production route and estimated local resource requirements.
6. Require internal approval of the batch plan before expensive-in-compute generation or bulk rendering. There is no paid generation spend, but compute and time remain finite.
7. Generate assets in batches using local models, open-source tools and reusable templates where hardware permits.
8. Run brand, spelling, claims, dimensions, accessibility, file integrity and rights checks.
9. Send review versions to the client; track approval, rejection and revision requests.
10. Deliver approved exports and editable sources where included in scope.
11. If the client authorizes public display, mark eligible work for portfolio review. Publishing is a separate permission and editorial decision.

### 5.3 Work reporting
- Record work through tasks, milestone events, deliverable states, comments, commits, test evidence, approvals and deployment references where available.
- Generate daily, weekly, project, campaign, creative-production, client-account and agency-operation reports from these records.
- Every report includes period, generated-at timestamp, owner, source records, metric definitions and evidence links.
- Clearly distinguish verified measurements, manually entered facts, estimates, hypotheses and unavailable data.
- Completion percentages derive from defined task or milestone weights, never arbitrary manual optimism.
- Reports must expose blockers, overdue work, scope changes, decisions needed and next actions.

### 5.4 Work to public catalogue
- Candidate work is private by default.
- A catalogue entry requires ownership/rights review, client permission where relevant, final asset approval, accurate project description and claim verification.
- Internal experiments are labelled as concepts or studio explorations.
- Client outcomes are published only when supported by approved evidence and a defined measurement period.
- The public catalogue can show the creative process and craft without implying an unverified commercial result.

## 6. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | Secure authentication and role-based authorization | P0 |
| FR-002 | Tenant isolation for client organizations and project data | P0 |
| FR-003 | Auditable records for consequential actions | P0 |
| FR-004 | Prospect, organization, contact and opportunity records | P1 |
| FR-005 | Payment-eligible client onboarding and project creation | P1 |
| FR-006 | Projects, milestones, deliverables, tasks and dependencies | P1 |
| FR-007 | Evidence-linked daily, weekly and project reporting | P1 |
| FR-008 | Structured creative brief and brand profile | P2 |
| FR-009 | Social analytics import with provenance and metric definitions | P2 |
| FR-010 | AI-assisted strategy and proposed batch plan | P2 |
| FR-011 | Batch graphics generation through local/open tooling | P2 |
| FR-012 | Batch video assembly and export through local/open tooling | P2 |
| FR-013 | Internal and client review, approvals and revision history | P2 |
| FR-014 | Private client deliverable library | P2 |
| FR-015 | Permissioned public catalogue and case studies | P3 |
| FR-016 | Campaign outcome reporting and learning loop | P3 |
| FR-017 | Financial summaries based only on recorded transactions | P3 |
| FR-018 | Optional social publishing integrations only when free, authorized and feasible | P3 |

## 7. Non-functional requirements

- **Security:** least privilege, tenant isolation, secure sessions, server-side authorization, secret management, validation, rate limits, audit trails, safe file handling and tested backup/restore.
- **Privacy:** data minimization, clear purpose, client authorization, retention and deletion rules, exportability, and no private scraping.
- **Reliability:** retries for recoverable background jobs, idempotency, visible failure states, resumable batch work and no silent loss.
- **Accessibility:** WCAG 2.2 AA target; semantic HTML, keyboard access, focus, contrast, labels and reduced motion.
- **Performance:** responsive on mid-range mobile devices and imperfect connections; progressive enhancement for heavy media and local AI features.
- **Maintainability:** preserve React/Vite baseline unless an ADR justifies a change; modular boundaries and documented schemas.
- **Portability:** export business records and files in practical open formats; avoid proprietary lock-in.
- **Cost:** no new paid dependencies or usage charges. Any proposed exception requires explicit owner approval and a revised cost decision.

## 8. Success measures

Track actual operational outcomes:
- enquiry-to-qualified-opportunity conversion;
- qualified-opportunity-to-paid-client conversion;
- time from payment confirmation to project kickoff;
- on-time milestone and deliverable rate;
- revision rate and approval turnaround;
- creative batch completion and failed-job rate;
- percentage of reports with traceable evidence;
- campaign outcomes where reliable data is available;
- project revenue, recorded direct cost and contribution margin;
- client retention and repeat engagements;
- catalogue entries with complete rights and proof records.

Do not set numerical targets until a baseline exists.

## 9. MVP acceptance

The first useful release is complete when an authorized internal user can create a prospect, convert it into a paid client using a verified payment record, create a scoped project, assign and complete work with evidence, generate a traceable report, prepare a creative brief and proposed batch plan, and deliver an approved file through a client-isolated workspace.

The MVP must work without paid APIs or subscriptions. If local AI generation is beyond available hardware, the workflow must still support manual/template-based production and clearly report the limitation.

## 10. Out of scope until separately approved

- Paid AI or social listening subscriptions.
- Unbounded autonomous publishing or spending.
- Scraping private or access-controlled social data.
- Full accounting, payroll, tax filing or banking integrations.
- Guaranteed campaign outcomes or automated business decisions without human review.
- Replacing Avenize or the separate Revenue OS with this public website.
- Production DNS, registrar, email routing or hosting migration as part of product specification.

## 11. Open decisions

Record and resolve before implementation: exact identity provider/session approach; current production database and hosting bindings; local machine GPU/RAM capacity; client file storage/backup capacity; supported social data export formats; payment verification source; reporting timezone policy; retention periods; client permission language; and the precise MVP team roles. Unknowns are blockers or assumptions, not facts.


## 12. Product-wide UI/UX state requirements

Every product surface must implement the applicable ten essential states: **Loading; Skeleton; Empty / First-use; Success; Error; Saving / Processing; Refreshing; No results; Offline; Permission denied.**

These are functional requirements because the platform handles client records, payments, uploads, approvals, long-running creative jobs and evidence-based reports. Misleading feedback can cause duplicate work, lost briefs, incorrect payment assumptions or unauthorized disclosure.

- Loading and skeleton states must make waiting understandable without causing avoidable layout shifts.
- First-use empty states must explain the collection and its next setup/create action.
- Success states must follow confirmed outcomes, not optimistic assumptions.
- Error states must preserve recoverable input and provide an actionable recovery path.
- Saving/processing states must prevent accidental duplicate submissions and show truthful progress.
- Refreshing must retain existing valid data and identify stale data if refresh fails.
- No-results states must identify active search/filter context and allow recovery.
- Offline states must distinguish local drafts, queued operations, unsent work and server-confirmed changes.
- Permission-denied states must explain the access boundary and safe next step without leaking protected information.

Required coverage:
- Enquiry: submitting, success, validation/server failure, offline and duplicate-submit handling.
- CRM/projects: initial load, skeleton, first-use empty, no results, refresh failure and permission denial.
- Briefs/uploads/deliverables: processing, progress, validation, partial failure, retry, cancellation and confirmed completion.
- Creative Studio: queued, running, partial completion, failed item, retry, cancelled and completed batch.
- Client review: awaiting review, saving feedback, approved, changes requested and unauthorized/expired access.
- Reporting: no data for period, partial source coverage, stale data, refresh, source failure and access denial.
- Finance: pending/unverified, processing, verified success and failure. A client statement or optimistic UI is not proof of payment.

**Acceptance:** every screen has a state-coverage checklist; applicable states are tested under slow, failed, empty, filtered, offline and unauthorized conditions; no state falsely implies persistence or action completion.
