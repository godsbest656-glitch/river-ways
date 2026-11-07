# River Ways Website Readiness Audit

**Review date:** 7 November 2026  
**Repository:** `godsbest656-glitch/river-ways`  
**Integration branch:** `build/river-ways-execution-agency-agents`  
**Website baseline:** `build/river-ways-execution` at recorded head `7eef0ea9cdb4dcd4c344b3fbe99ebd2aacd2bd2d`  
**Integration head at audit creation:** `fb66b122923890ad0b26765bd31b807f278d8f8e`  
**Review type:** Static source and repository evidence review

## 1. Scope and evidence limits

This is a source-grounded baseline review of the remote website implementation candidate and its Agency Agents integration. The repository files, branch comparison, workflow definitions, tests and commit metadata were inspected.

**This is not a completed Codex multi-agent audit.** This ChatGPT environment cannot open the user's local Codex worktree, prove that project-local custom agents were loaded by Codex, or spawn those named project agents in the user's local session. No specialist delegation is claimed. The new validator and test suite have been committed but have not been executed in this environment. No current-HEAD build, test run, browser inspection, Cloudflare Preview, live D1 enquiry or Resend inbox delivery was performed for this audit.

Evidence labels:
- **Verified in source:** directly observed in the inspected repository files or commit metadata.
- **Recorded evidence:** a result stated in a repository status report or historical CI run, but not rerun against the exact current branch head here.
- **Open / blocked:** requires the user's local worktree, external account configuration, live environment, manual review or owner approval.
- **Recommendation:** proposed next action, not a claim that a defect has already been demonstrated.

## 2. Source-of-truth and branch position

- The remote website candidate is `build/river-ways-execution`. Its current comparison base commit is `7eef0ea9cdb4dcd4c344b3fbe99ebd2aacd2bd2d`, with commit message "hardening: stabilize Resend retries and resolve Lighthouse security findings".
- The Agency Agents integration branch was created from that website branch, not from the older design-skills branch.
- GitHub compare reports the integration branch as 19 commits ahead and 0 behind the website baseline. Its 19 changed paths are confined to the nine agent definitions, Codex config, Agency Agents documentation/licence, the validator and tests, root guidance, and two CI workflow updates. No website application source, portfolio data, contact handler, route generator, migrations, or deployment configuration was changed by this integration.
- A separately reported local branch `build/shaped-current-homepage` at `fcdcbef` may contain newer visual/route work. It is not in the remote branch list. It must be recovered and compared from the user's actual local worktree before release selection; do not overwrite or discard it.
- The recorded implementation status document describes snapshot `c78a796`, which predates the current website baseline commit `7eef0ea`. Treat its test evidence as historical until the current candidate is rerun.

## 3. Visitor proposition and information architecture

**Verified in source**
- The homepage proposition is "We engineer demand." Supporting copy connects strategy, creative, digital experiences and growth systems.
- The homepage presents seven capability families and three audience pathways: founders/operators, growing teams, and established organisations.
- Primary homepage navigation links to Approach, Capabilities, Work, Insights, About and the enquiry section.
- The generated static site has ten fixed route outputs: Home, About, Services, Work, Contact, Growth Diagnostic, Field Guide, Insights, Privacy and Terms.
- Five public project detail pages are generated from the canonical portfolio source. The sitemap contains 15 indexable URLs (ten fixed outputs plus five project details).
- The route validator checks route documents, canonical URLs, JSON-LD schema, internal references, sitemap and the 404 document. The intended route-pattern count of 12 includes the dynamic work-detail pattern and the 404 fallback; it is not the count of sitemap URLs.

**Assessment**
The information architecture is materially more complete than the earlier homepage-only candidate. Contact reuses the homepage enquiry form rather than introducing a second submission pipeline. The route inventory, sitemap and generated output must continue to be changed together.

**Open**
- The actual HTTP status for an unknown path on Cloudflare Pages has not been verified. A `404.html` file and a browser test of `/404.html` do not prove that a random unknown URL returns HTTP 404.
- The local visual candidate and its route registry remain unreconciled.
- A browser-level navigation and fixed-viewport check against the exact current branch head is still required.

## 4. Brand, content and proof integrity

**Verified in source**
- The governing design document defines SHAPED CURRENT / Route 2 — Editorial Intelligence, Creative Demand Engineering and "We engineer demand." It explicitly rejects the prior terracotta/near-black/warm-parchment directions and generic agency/SaaS templates.
- The canonical portfolio contains five public records: three illustrative capability studies and two River Ways-owned internal demonstrations.
- The records have no client, outcome, result or testimonial data. The capability studies are not presented as commissioned client case studies.
- The website copy states that Demand Intelligence coverage depends on source access, platform policies, language and available integrations; it does not claim that every source is already connected.
- The FAQ does not guarantee leads or revenue and describes outreach as contextual, human-reviewed and respectful.

**Assessment**
The portfolio model and visible truth labels provide a sound foundation for proof integrity. The website still lacks verified external client case studies and outcomes in the inspected public dataset.

**Open**
- Any future external case study requires client permission, source media provenance, scope, evidence and approved outcome claims.
- The separate Media Manifest remains isolated and is not authorised for production integration by this audit.

## 5. Enquiry journey and operational behavior

**Verified in source**
- The homepage form collects name, work email, company, goal and optional context. It includes a honeypot, inline validation, error and success messaging, a disabled submitting state, and a privacy reminder.
- The browser posts JSON to same-origin `/api/contact`. The form forwards bounded campaign/referral metadata and does not send Growth Diagnostic answers or scores.
- The Pages Function checks Origin when supplied, JSON content type, request size, required fields, email format, control characters and honeypot input.
- The endpoint requires `LEADS_DB` and a `RATE_LIMIT_SALT` of at least 32 characters. It hashes the client address for rate limiting rather than storing the raw IP, limits attempts, deduplicates identical briefs within a short window, and persists the lead before notification.
- Resend notification requests use a per-lead idempotency key and the validated lead email as reply-to. A saved lead whose notification is not confirmed receives HTTP 202 with a reference and an honest fallback message; HTTP success from Resend is not treated as proof of inbox delivery.
- The Contact route points to the existing homepage form, avoiding a parallel form backend.

**Open / blocked**
- Preview and Production D1 bindings/database IDs are not verified. Migrations have not been confirmed on a remote Cloudflare D1 database.
- `RATE_LIMIT_SALT`, Resend API key, verified sender identity and actual notification inbox delivery remain unverified.
- No automated lead-retention/deletion schedule is documented as implemented.
- The exact current-head API test suite has not been run in this session.

## 6. SEO, discovery and security

**Verified in source**
- Generated pages include title, description, canonical URL, Open Graph and Twitter metadata.
- Generated static routes emit JSON-LD nodes for Organization, WebSite, WebPage and BreadcrumbList; the static route validator checks those nodes and canonical consistency.
- `public/robots.txt` publishes the sitemap URL. `public/sitemap.xml` contains 15 route URLs.
- `public/_headers` sets nosniff, referrer policy, frame protection, a permissions policy and a Content Security Policy. The policy limits scripts and connections to self, while explicitly allowing the external fonts and Unsplash image hosts used by the site.
- The latest website baseline commit includes a Resend idempotency/reply-to hardening change and a `basic-ftp@6.2.6` npm override for the Lighthouse CI dependency tree.

**Open / recommendations**
- Validate the current exact output with the structured-data and route validators after the latest source commit.
- Confirm the Organization email and public contact details are owner-approved.
- Decide whether to self-host fonts and approved images after measuring performance, privacy impact and licensing; do not remove them without a tested visual replacement.
- Review CSP behavior against the built site and all required assets in a real browser. Do not loosen policy merely to silence a console warning.

## 7. Accessibility, responsive behavior and performance

**Verified in source**
- The homepage has a skip link, semantic navigation/main landmarks, labelled form controls, live error/success regions, keyboard-focus styling and accessible state on the mobile navigation and interactive workflow controls.
- Both homepage and static-page styles include `prefers-reduced-motion` handling. The homepage disables the ticker and pointer-driven visual transforms under reduced motion.
- The Playwright suite includes desktop/mobile projects, mobile navigation interaction, horizontal-overflow checks and axe scans on key routes.
- The project includes Lighthouse CI configuration and a workflow step for Lighthouse reporting.

**Recorded evidence**
- The implementation status document records an earlier successful run for code commit `b259dcf`: 22/22 browser checks, 18/18 enquiry API tests, 51/51 portfolio tests, migration validation, build/route validation and zero high-severity dependency vulnerabilities.
- That recorded run is not proof that the later website baseline commit `7eef0ea` or this integration head has passed.

**Open**
- Perform manual keyboard, focus order, screen-reader, zoom/reflow, contrast, touch and reduced-motion checks at fixed desktop/tablet/mobile viewport dimensions.
- Review mobile menu dismissal/focus restoration and all interactive states in a real browser.
- Capture actual Lighthouse scores and establish evidence-based performance budgets; do not infer performance from the presence of a Lighthouse config.
- Confirm third-party image/font requests, sizes and loading behavior under a constrained network.

## 8. Analytics and operating readiness

**Verified / recorded**
- Growth Diagnostic attribution fields are carried into the enquiry handoff; the browser test asserts that answers and score are not submitted.
- Lead operations migrations and the `ops_open_leads` view are present in the website candidate according to the current source and implementation records.
- The deployment workflow publishes a Cloudflare Pages Preview on pull-request activity for its configured base branches. The root project instructions correctly prohibit opening/updating a PR until the owner authorises a Preview review.

**Open**
- The exact analytics implementation, event names, consent/privacy behavior and reporting destination need a dedicated source-to-runtime trace before claiming operational measurement readiness.
- Cloudflare bindings, remote migrations, Resend delivery, data retention, legal approval, unknown-route HTTP status and production release controls remain blockers.
- No Preview or Production deployment was performed by this work.

## 9. Agency Agents integration status

**Verified in repository**
- Nine project-scoped Codex definitions exist: website orchestrator plus UX Researcher, Brand Guardian, UI Designer, Frontend Developer, SEO Specialist, Growth Hacker, Accessibility Auditor and Code Reviewer.
- The agent definitions contain the required name, description and developer-instructions fields. A text-level structural inspection confirmed each file has one opening and one closing triple-single-quoted instruction block.
- Project-local Codex config enables agents and caps concurrent threads at six.
- A dependency-free Python TOML validator and regression tests have been added to the repository and wired into the existing CI workflows.
- Upstream MIT attribution and licence are preserved.

**Not yet verified**
- The new Python validator and its tests have not been run in this environment.
- Codex project trust, custom-agent discovery, named-agent selection and real subagent delegation have not been tested in the user's local Codex client.
- The agent definitions are not a website runtime feature and do not run autonomously in production.

## 10. Overall readiness decision

**The website is an advanced implementation candidate, not a production-verified operating website.**

The strongest foundations are the coherent positioning, generated route architecture, canonical portfolio model, evidence labels, same-origin enquiry API, D1 lead operations, structured metadata, security headers, accessibility-aware interactions and browser-test harness.

The remaining work is primarily reconciliation and proof, not another wholesale redesign:
1. Recover and compare the local visual candidate without overwriting it.
2. Verify this exact integration head with Python validation, the full build and all existing test suites.
3. Verify Codex discovery and real specialist delegation in the actual local project.
4. Complete manual browser/accessibility review.
5. Verify Cloudflare Preview bindings, remote D1 migrations, Resend sender and real notification behavior.
6. Establish data-retention and legal approval.
7. Verify real Cloudflare unknown-route 404 behavior.
8. Obtain explicit owner approval before Preview PR activity or any production release.

No merge, PR, Preview, production deployment, DNS change, remote D1 migration or external outreach is authorised by this audit.
