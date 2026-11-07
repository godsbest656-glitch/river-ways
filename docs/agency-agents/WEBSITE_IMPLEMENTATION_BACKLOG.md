# River Ways Website Implementation Backlog

**Baseline:** `build/river-ways-execution`  
**Working branch:** `build/river-ways-execution-agency-agents`  
**Source audit:** [WEBSITE_READINESS_AUDIT.md](./WEBSITE_READINESS_AUDIT.md)  
**Rule:** Work in small, reviewable slices. Do not create/update a PR until the owner authorises Cloudflare Preview activity.

## Priority model

- **P0 — baseline integrity:** work that must happen before choosing or changing the release candidate.
- **P1 — release-critical:** required to establish safe, trustworthy enquiry and public-site behavior.
- **P2 — quality and growth:** important improvements after the baseline and release blockers are under control.
- **P3 — later capability:** valuable work that should not displace current release readiness.

## P0 — Reconcile and verify the exact candidate

| Item | Acceptance criteria | Dependencies | Risk | Verification | Owner approval |
|---|---|---|---|---|---|
| P0.1 Recover the local SHAPED CURRENT candidate | Locate the actual local `build/shaped-current-homepage` worktree/branch; record exact HEAD and dirty state; preserve all uncommitted files and immutable bundles; compare source and route outputs with `build/river-ways-execution`; document the final source-of-truth decision without a blind merge. | User's local AI-dev workspace | High: uncommitted work loss or wrong release base | `git status`, `git worktree list`, branch/commit graph, file-level diff, hashes for bundles, route-registry/build-output comparison | Owner chooses final visual/release candidate |
| P0.2 Verify Agency Agents in real Codex | Trust the project, reload if required, confirm all nine custom agents are listed, invoke at least one specialist, and prove real named-agent delegation; record client/version and exact output. If named agents cannot be selected, report the actual runtime limitation without claiming activation. | Local Codex project open on the selected worktree | Medium | Codex agent listing, harmless discovery task, subagent thread evidence | Owner grants project trust |
| P0.3 Run exact-head repository checks | Run the new TOML validator, Python unittest suite, Vite build/static route generation, API tests, portfolio tests, route/portfolio validators, Playwright/axe and Lighthouse against the exact selected candidate SHA. Fix only reproducible failures. | P0.1; local Node/Python dependencies | Medium | CI or local logs tied to exact SHA; retain test counts and artifacts | No deployment approval required |
| P0.4 Reconcile release controls | Confirm which workflow triggers Preview, which branches trigger Production, and that no PR/Preview event occurs before approval. Preserve the current no-PR state. | P0.1 | High | Workflow source review and branch protection/release settings | Owner approval required before any PR/Preview |

## P1 — Release-critical operational verification

| Item | Acceptance criteria | Dependencies | Risk | Verification | Owner approval |
|---|---|---|---|---|---|
| P1.1 Preview D1 configuration | A dedicated Preview D1 database is identified; `LEADS_DB` binding and `RATE_LIMIT_SALT` are configured in the Preview environment; IDs/secrets are never committed. | P0 baseline; Cloudflare access | High: lead loss or unintended data writes | Inspect bindings; run ordered migrations against Preview only; inspect schema, indexes, triggers and views | Explicit approval before Preview configuration or migrations |
| P1.2 Resend notification readiness | Verified sender identity, API key and intended notification recipient are configured in Preview; a controlled enquiry is saved once; Resend acceptance and actual inbox receipt are separately recorded. | P1.1 | High: missed or misrouted enquiries | Controlled test lead, D1 row, provider response, inbox receipt; remove/test-data retention per policy | Explicit approval for sending a test email |
| P1.3 Lead retention and privacy | Define retention period, deletion/anonymisation behavior, backup implications and request handling; implement a tested scheduled/operational deletion process before production lead capture. Update Privacy notice to match actual behavior. | P1.1; legal review | High: privacy and compliance exposure | Retention tests, documented runbook, privacy notice review | Owner and legal approval |
| P1.4 Legal review | Privacy Notice and Terms are reviewed for actual data flows, jurisdictions, service scope, cookies/analytics, third-party requests and enquiry processing. | P1.1–P1.3 | High | Written legal/owner sign-off | Legal/owner approval |
| P1.5 Real Cloudflare 404 behavior | A random unknown path returns the expected HTTP 404 and branded noindex document on Cloudflare Pages; no catch-all SPA fallback masks it. | Preview authorised | Medium | Request a random nonexistent URL on the Preview host and record status/body/headers | Explicit Preview approval |
| P1.6 Production-readiness decision | All Preview gates pass; rollback and incident owner are named; release marker matches exact candidate; owner explicitly approves production release. | P1.1–P1.5 and P2.1 | High | Signed release checklist and exact deployment evidence | Explicit production approval |

## P2 — Quality, discoverability and conversion

| Item | Acceptance criteria | Dependencies | Risk | Verification | Owner approval |
|---|---|---|---|---|---|
| P2.1 Manual accessibility and responsive review | Test keyboard-only navigation, visible focus, screen-reader landmarks/labels/status, 200% zoom/reflow, contrast, touch targets, reduced motion and mobile menu behavior at fixed desktop/tablet/mobile viewports. Record defects and retest. | P0.1, exact-head build | Medium | Browser/device matrix with screenshots and issue list; automated axe remains supplemental | No special approval for fixes within design rules |
| P2.2 Performance baseline and budgets | Capture Lighthouse metrics for homepage and representative static routes on the exact build; record LCP, CLS, INP/TBT proxy, image/font weight and mobile results; set budgets from observed baselines, not guesses. | P0.3 | Medium | Lighthouse CI artifacts and repeatable thresholds | Owner approval for paid tools or new services |
| P2.3 Third-party media/font strategy | Inventory every external image/font request, source/license, dimensions, loading behavior and fallback; choose whether to self-host, optimise or retain each resource. Do not replace art direction with arbitrary stock. | P2.2 | Medium | Asset manifest, licence evidence, network waterfall and visual comparison | Approval for paid assets or new providers |
| P2.4 Analytics and measurement trace | Map actual analytics scripts/events, consent/privacy behavior, campaign attribution, diagnostic handoff and enquiry outcomes; identify missing events without collecting diagnostic answers or unnecessary personal data. | P0.1, P1.3 | Medium | Source-to-runtime event map and test events in a non-production environment | Owner approval for new analytics providers or data collection |
| P2.5 Search and structured-data review | Validate every canonical URL, sitemap entry, robots directive, Open Graph/Twitter metadata and JSON-LD node; check Search Console/index coverage after an approved release. | P0.3, P1.5 | Low–medium | Route validator, schema parser, crawler check and Search Console evidence | Owner approval for publication/indexing |
| P2.6 Enquiry conversion review | Test the full form journey on desktop/mobile, all validation/error/202/success states, field usability, privacy language and contact fallback. Measure completed valid enquiries, not button clicks alone. | P1.1, P1.2, P2.4 | Medium | Browser tests and approved analytics event review | Owner approves measurement plan |
| P2.7 Credible portfolio expansion | Add only permissioned client work or verifiable outcomes; capture scope, role, problem, approach, evidence, media provenance and approval. Maintain illustrative/internal truth labels. | Approved source material | High reputational risk | Portfolio schema validation, evidence/permission checklist and editorial review | Explicit approval for each external client proof item |

## P3 — Later improvements

| Item | Acceptance criteria | Dependencies | Risk | Verification | Owner approval |
|---|---|---|---|---|---|
| P3.1 Refine dimensional interactions | Improve one purposeful interaction at a time; preserve comprehension, reduced motion, touch and keyboard support; do not replace the approved SHAPED CURRENT direction. | P0 and P2.1 | Medium | Design acceptance gates and browser evidence | Owner approval for material art-direction changes |
| P3.2 Add approved media-rich case-study formats | Use licensed/original video, motion, 3D or photography with responsive fallbacks, captions/transcripts and performance budgets. | P2.3 and P2.7 | Medium–high | Media provenance, accessibility, performance and browser tests | Approval for paid media, licenses or production integrations |
| P3.3 Growth experiments | Form hypotheses tied to a verified funnel problem; define audience, primary metric, guardrails and sample requirements before testing. | P2.4 and P2.6 | Medium | Experiment plan and measured results | Owner approval before live experiments |

## Immediate execution sequence

1. Open the latest local website worktree and reconcile it against the remote integration branch. Preserve the local visual candidate.
2. Verify the nine agents load and can delegate in the actual Codex client.
3. Run the exact-head validator, Python tests, build and existing browser/API/portfolio checks.
4. Ask the specialists to review the current source read-only and compare their findings with this backlog.
5. Fix verified low-risk issues in small slices. Keep the branch off PR until Preview is authorised.
6. Complete Preview operational gates only after explicit owner approval.

## Non-negotiable controls

- No merge, PR update, Preview deployment, Production deployment, DNS/domain change, remote D1 migration, secret change, outreach or public post without the relevant explicit owner approval.
- Never invent case studies, clients, outcomes, testimonials, credentials, awards, metrics or capabilities.
- Never report an unrun test, unobserved browser state, provider acceptance or inbox delivery as verified.
- Keep Harvey, Rebuilder, Revenue OS and Avenize separate from the public website's development-time Agency Agents.
