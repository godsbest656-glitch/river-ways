# Roadmap and Implementation Backlog
**Version:** 1.0 | **Prepared:** 9 October 2026  
**Purpose:** Turn the constitution and resource pool into a staged, testable implementation programme.

## 1. Operating rule

Preserve the currently live site, domain, mail service, nameservers, DNS and DNSSEC while the redesign is tested. Use a version-specific preview, review the exact commit/deployment, and keep a rollback route. Documentation and implementation work should not silently change production routing.

Prioritisation uses P0 (must close before production), P1 (high value next), P2 (differentiation), P3 (later/conditional). A phase is complete only when its acceptance evidence is attached.

## 2. Workstreams

### WS0 — Governance and brand
**Status:** Strategy standard being established.  
**Tasks**
- [ ] Confirm River Ways as the public brand name and standardise two-word spelling in UI, metadata, documentation and assets.
- [ ] Approve logo variants, colour tokens, type scale, spacing, motion grammar and accessibility-tested combinations.
- [ ] Maintain a claims/evidence register for case studies, metrics, client names, testimonials, awards and credentials.
- [ ] Adopt website constitution, reference library, interaction playbook and release gates.
- [ ] Assign owner for every production service and integration.

**Acceptance:** Brand system file exists; public-facing name consistent; no unsupported claims; documented review/approval roles.

### WS1 — Deployment and operational safety (P0)
**Tasks**
- [ ] Identify the actual serving architecture: current Cloudflare Worker/Pages setup, old Vercel origin, Netlify config or any combination. Verify actual production and preview paths.
- [ ] Confirm which URL is the preview under test and record commit/deployment IDs.
- [ ] Verify React/Vite build, eliminate blank-screen/runtime errors, inspect console and network.
- [ ] Ensure the preview is not accidentally competing in search or leaking a staging-only tool.
- [ ] Record rollback process and how to distinguish the redesign from the existing live site.
- [ ] Keep DNS, DNSSEC, MX/TXT and legacy domain routing unchanged.

**Acceptance:** documented architecture map, successful reproducible build, browser smoke test, direct preview URL, no blocking errors, rollback verified. No production domain switch until the production gate passes.

### WS2 — Enquiry pipeline and conversion (P0)
**Tasks**
- [ ] Replace or explicitly retain the current mailto draft only as a temporary fallback; do not call it confirmed server-side lead capture.
- [x] Implement a same-origin Cloudflare Worker enquiry endpoint with server-side validation, origin checks, body limits, honeypot handling and Turnstile verification. (The endpoint is code-complete but still requires provider setup and review.)
- [ ] Connect one approved delivery destination (email/CRM) with secrets stored server-side.
- [ ] Add idempotency/deduplication where needed, a clear success/error state, retry path and alert for delivery failures.
- [ ] Add a spam quarantine and owner for lead follow-up.
- [ ] Publish privacy notice and data handling/retention details before collecting data.
- [ ] Add consent-aware, minimised conversion measurement.

**Acceptance:** Test submission reaches the approved destination; provider error is observable; sensitive data does not enter URLs/analytics/logs; end-to-end evidence exists.

### WS3 — UX, mobile, accessibility and motion (P0)
**Tasks**
- [ ] Audit existing hero, nav, service cards, workflow tabs, FAQs and contact form.
- [ ] Test phone width, narrow devices, tablet, desktop, large text and browser zoom.
- [ ] Add keyboard focus, logical tab order, semantic labels and state announcements.
- [ ] Test reduced-motion alternative for all animation; avoid motion as the only feedback.
- [ ] Validate color contrast on forest/paper/lime combinations, controls, placeholder text and focus states.
- [ ] Give charts/diagrams accessible text descriptions and status information.
- [ ] Review every icon-only control and menu toggle.
- [ ] Test images/fonts missing and third-party assets blocked.

**Acceptance:** QA checklist and screenshots/traces; all critical accessibility/usability issues closed or assigned with explicit approved exceptions.

### WS4 — Performance and reliability (P0/P1)
**Tasks**
- [ ] Establish baseline Lighthouse/DevTools results and device/network conditions.
- [ ] Establish image, font, JavaScript, animation and third-party request budgets.
- [ ] Reserve image dimensions; responsive formats/sizes; lazy-load appropriate noncritical assets.
- [ ] Load interactive/3D libraries only where needed and after intent if suitable.
- [ ] Test LCP/INP/CLS field data when enough traffic exists; keep field metrics distinct from lab scores.
- [ ] Add basic error monitoring after privacy/retention review.
- [ ] Add CI checks for build, links, critical interactions and accessibility where feasible.

**Acceptance:** named budgets, reproducible audit results, no avoidable heavy dependency, documented fallbacks.

### WS5 — Discoverability and SEO foundations (P0)
**Tasks**
- [ ] Confirm canonical live domain (maintaining current riverwayse.com unless a separate migration is approved).
- [ ] Update README, architecture and content docs to refer to River Ways as the public brand.
- [ ] Review title, meta description, OG/Twitter sharing metadata, favicon and Organization JSON-LD for accurate brand/domain.
- [ ] Validate robots.txt and sitemap.xml against actual canonical pages.
- [ ] Add noindex/auth protection to staging as appropriate; verify production is indexable.
- [ ] Create verified Search Console/Bing Webmaster properties and submit sitemap when ready.
- [ ] Add conversion tracking with no PII/sensitive payload.
- [ ] Ensure new future pages have a page purpose, human-reviewed copy, internal linking and evidence.

**Acceptance:** metadata/schema validation, correct URL/redirect behavior, verified crawler files and post-release URL inspection.

### WS6 — Information architecture and authority (P1)
**Tasks**
- [ ] Publish a services index with clear service definitions, scope and outcomes.
- [ ] Build individual service pages when the content is complete and materially distinct.
- [ ] Publish an About/point-of-view page explaining River Ways' approach in human language.
- [ ] Add a case-study template with evidence/provenance fields; do not invent proof.
- [ ] Create Insights/resources taxonomy, authors/reviewers and content maintenance schedule.
- [ ] Implement internal link relationships and navigation breadcrumbs where useful.
- [ ] Build first niche playbooks only for markets with capability, proof and plausible demand.

**Acceptance:** every page has a user job, a clear message, verified content and useful CTA. No empty or repetitive landing pages.

### WS7 — Creative interactive experiences (P1/P2)
**Tasks**
- [x] Build the first accessible Demand Engineering Explorer with six stages, input/output explanations and a decision checkpoint for each stage. Browser/mobile acceptance review remains pending.
- [x] Build the five-question Growth Readiness Diagnostic with transparent local scoring and suggested priorities; answers remain in the browser. Usability validation remains pending.
- [ ] Build Service Fit Navigator and downloadable project brief.
- [ ] Build interactive case study framework with evidence and static/text path.
- [ ] Build a clearly labelled synthetic-data Demand Intelligence Sandbox.
- [ ] Set interaction budget and reusable component/state library.
- [ ] Add share/save/export only where useful and privacy-safe.
- [ ] Run small hypotheses-led experiments before committing to complex 3D or full-screen storytelling.

**Acceptance:** each tool has a purpose, completion result, accessible path, privacy review, performance budget and success metric.

### WS8 — Demand Intelligence productisation (P2)
**Tasks**
- [ ] Map real source permissions and platform/vendor coverage by region/language.
- [ ] Compare providers by source coverage, API terms, latency, historic data, export, storage/retention, cost and reliability.
- [ ] Design signal schema: source ID/URL, timestamp, keyword version, language, context, relevance, fit, confidence, review status and outcome.
- [ ] Implement deduplication, language handling, false-positive feedback and human review.
- [ ] Connect alerts/CRM only with explicit permission and audit trail.
- [ ] Prohibit sensitive targeting, restricted scraping, unsolicited auto-DMs and fabricated source records.
- [ ] Establish deletion, retention, provider failure, escalation and opt-out handling.

**Acceptance:** end-to-end tests using permitted real or sandbox data, documented data rights, human-reviewed outreach and proven failure controls.

### WS9 — MCP/agent operating model (P1)
**Tasks**
- [ ] Keep inventory of connected MCP servers, owners, scopes, versions, endpoints and approval status.
- [ ] Start from read-only design/docs and browser QA workflows.
- [ ] Use Figma MCP only where design-to-code/context needs justify it.
- [ ] Evaluate Playwright MCP/runner and Chrome DevTools MCP using an isolated preview.
- [ ] Document code change, tests, evidence and review after every agent-assisted change.
- [ ] Require explicit approval for production deploys, data deletion, public outreach, credentials, DNS and permission changes.
- [ ] Review tool access periodically and revoke unused scopes.

**Acceptance:** tool register complete; no privileged production action without explicit approval and a recorded release decision.

## 3. Suggested delivery order

1. Governance and safety: WS0, WS1 and preservation of live site.
2. Release correctness: fix verified runtime/build/deployment issues and establish a repeatable preview smoke test.
3. P0 readiness: WS2–WS5; get brand, accessibility, security, lead capture and discoverability right.
4. Authority: WS6; build credible pages and evidence.
5. Differentiation: WS7; develop interactions that prove the methodology.
6. Product capability: WS8; connect real sources and operations once vendor/legal/technical requirements are known.
7. Automation and optimisation: WS9, tests, analytics review and experiments.

## 4. Backlog scoring

Score each item 1–5 for visitor value, strategic distinction, business impact, evidence of demand, implementation cost, maintenance burden, accessibility impact, performance risk, privacy/security risk. Record assumptions and confidence. Prioritise clear, high-value, lower-risk items. Mandatory privacy/security/accessibility obligations cannot be traded away because the impact score is low.

## 5. Release statuses

- **Proposed:** idea recorded, not yet validated.
- **Ready for design:** audience/task and expected value agreed.
- **Ready for build:** design/states, content, acceptance tests and risks defined.
- **In build:** implementation on a branch.
- **In review:** code and design checked; CI/test evidence pending or under review.
- **Preview verified:** specified user paths and gates have evidence on a deployment.
- **Approved for production:** owner has approved exact commit and rollout/rollback.
- **Released:** post-release smoke test passes.
- **Monitoring:** outcome and errors under review.
- **Retired:** removed safely with redirects/data retention reviewed where relevant.

## 6. Architecture decisions to record (ADRs)

Create a short ADR whenever a decision has lasting impact:
- Canonical domain and hosting/serving path.
- Static site vs router/CMS.
- Form processor, storage and CRM integration.
- Analytics/consent model.
- Motion and 3D library strategy.
- Image/media CDN and optimisation.
- Demand Intelligence provider and legal data use.
- MCP/agent access strategy.
- Search/local/international architecture.
- User accounts, saved assessments or personalisation.
Each ADR should include context, options, decision, trade-offs, risks, owner, date and review trigger.

## 7. Definition of excellence

River Ways will be the model not by shipping the most motion or the most tools, but by consistently combining distinctive creative work, genuinely useful interactions, responsible data practice, fast and accessible engineering, credible evidence, well-governed AI assistance, and measurable commercial outcomes. The framework should be reusable for client sites while each execution remains grounded in that client's audience, niche and brand.


## Implementation update — 9 October 2026

The current implementation branch adds the initial Demand Engineering Explorer and Growth Readiness Diagnostic, plus the Cloudflare Worker contact endpoint and automated input/endpoint tests. The latest CI run passed `npm test` and `npm run build`.

Still required before public production launch: configure Turnstile and Resend, verify a sender identity without unreviewed DNS changes, configure edge rate limiting, review the privacy notice, run the complete preview/browser/accessibility/performance/security checklist, and receive a real test enquiry end-to-end. The main domain/DNS has not been switched.
