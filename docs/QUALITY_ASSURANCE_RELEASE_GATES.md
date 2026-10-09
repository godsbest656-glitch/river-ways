# Quality Assurance and Release Gates
**Version:** 1.0 | **Prepared:** 9 October 2026  
**Purpose:** Make correctness, creative quality, accessibility, performance, search, security and operations testable before every release.

## 1. Release policy

No production release is “done” solely because the build passed, a preview URL loads, a screenshot looks attractive, or one person says it works. A release passes when the change has a stated purpose, a reviewed diff, relevant automated checks, manual review of high-risk journeys, evidence on the actual preview, and a rollback/owner.

All tests should identify the commit SHA, deployment/version, environment, timestamp, browser/device, results, blocking defects and approver. Do not claim a test passed without recorded evidence.

## 2. Current project-specific facts to keep visible

- Repository: https://github.com/godsbest656-glitch/river-ways
- Current architecture: React + Vite + CSS.
- Website branding should read **River Ways** in public-facing copy; the existing domain spelling remains a separate infrastructure decision.
- Existing public landing experience includes service cards, menu, tab-like Demand Intelligence workflow, FAQs, a form and animation.
- The current form is a mailto-draft fallback; it is not a reliable server-side enquiry pipeline.
- A Netlify configuration exists with response-header intent, while testing has also occurred through Cloudflare Workers. Actual serving architecture and headers must be checked, not inferred from repository config.
- The present CI build check runs npm install and npm run build; verify dependency lockfile policy and broaden tests.
- Main-domain DNS, DNSSEC, MX/TXT and legacy live deployment must not be changed as part of routine release work.

## 3. Gates by stage

### Gate A — brief and design
- User, task, outcome, primary CTA and success metric are written down.
- Design references are accompanied by adaptation notes; no assets or expression are copied without rights.
- Content claims are evidence-checked and brand owner approved.
- Interaction states, edge cases and accessibility behavior are documented.
- Responsive designs cover narrow mobile, standard mobile, tablet, laptop and wide desktop.
- Motion and media budget approved; reduced-motion/static fallbacks defined.
- Privacy/security review identifies data, integrations and sensitive areas.

### Gate B — implementation and code review
- No unrelated edits and no unresolved TODO that affects launch-critical behavior.
- Components reuse tokens and patterns where appropriate; semantic HTML used.
- Form/client code contains no privileged secrets.
- Inputs, links, menus, tabs, details/accordions and dialogs have stable names and states.
- Keyboard operation and focus behavior are implemented.
- Errors, loading/empty state, success state and retry path are implemented where relevant.
- Lockfile and package manager policy are consistent; dependency changes reviewed.
- AI/MCP-generated code has been inspected and tested by a human.
- No unapproved DNS, environment, deployment target, domain or email configuration changes.

### Gate C — automated CI
Minimum:
- Install deterministically using npm ci once a committed package-lock.json and package manager strategy exist.
- Build in a clean environment.
- Lint/type/static analysis as the project establishes the appropriate tooling.
- Unit/component tests for interactive logic and form validation.
- Link or route checks where practical.
- Automated accessibility scan on representative pages/components.
- Dependency and secret scan; fail or require review for serious issues.
- Build artifacts and commit identity attached to the workflow.
- Pull-request checks are visible before merge.

CI tests are guardrails; they do not replace visual or human testing.

### Gate D — preview UX and browser test
Run desktop and mobile viewport passes in current Chrome, Safari/WebKit and Firefox where feasible. Include a representative real phone test where possible.

Required user journeys:
1. Site opens without blank screen or blocking console exception.
2. Logo/brand link returns to top.
3. Navigation links reach correct content; mobile menu opens/closes, state is announced and Escape/keyboard behavior is sensible where appropriate.
4. Every CTA has the intended destination and no dead-end.
5. Interactive tabs/filters/accordions work with keyboard and touch.
6. Forms: empty validation, malformed values, accepted submit, duplicate click, server rejection/timeout, visible status, retry, accessible labels.
7. Direct deep link/anchor and browser back/forward behavior.
8. Page 404/fallback behavior is deliberate.
9. Images/fonts/video failures do not hide core content.
10. Reduced motion, zoom/text enlargement, keyboard-only and contrast checks pass.

Capture before/after screenshots or Playwright traces for material visual/interaction changes. A reference screenshot comparison should name viewport, zoom, browser and build so it can be reproduced.

### Gate E — accessibility
- Automated axe/WAVE/Lighthouse scan with high-impact findings reviewed.
- Keyboard: all functionality reachable, logical order, visible focus, no focus trap, skip link works.
- Screen-reader sampling for landmarks, headings, nav state, tabs, form labels/errors and status messages.
- Contrast tested for body text, controls, focus rings, placeholders, data graphics and dark/light surfaces.
- Text zoom/reflow and narrow viewports work without clipping or lost actions.
- Touch targets and drag alternatives checked.
- Captions/transcripts and text alternatives added for informative media.
- prefers-reduced-motion supported; essential meaning never motion-only.
- Color never the sole indicator of success, error or state.
- Form errors identify the problem and how to correct it.
- Third-party embeds have keyboard/fallback and privacy behavior reviewed.

### Gate F — performance
Track field Core Web Vitals when data exists and collect lab tests on repeatable conditions:
- LCP good threshold ≤2.5s at p75.
- INP good threshold ≤200ms at p75.
- CLS good threshold ≤0.1 at p75.
- Lab audits document device profile, network throttling, location/region and cache state.
- Images are responsive, compressed, and have reserved dimensions/aspect ratios.
- Below-the-fold resources are lazy loaded appropriately; don't lazy-load the main LCP image without evidence.
- Third-party scripts are inventoried, justified and loaded only when needed.
- Heavy motion/3D is scoped and has fallback.
- Fonts/weights are limited and text stays visible.
- Layout shifts, long tasks, excessive hydration/JS and delayed interaction are investigated.
- Avoid claiming field compliance from a single Lighthouse score.

### Gate G — search/discovery
- Correct canonical host, redirects, sitemap and robots rules.
- Production indexability checked; preview environments controlled.
- Unique title/meta description and social metadata verified.
- Structured data validates and matches visible content.
- Important content is crawlable/readable and does not require a visual interaction to become accessible.
- Links, 404s, duplicate pages and redirect chains checked.
- Organization/service identity correct as River Ways with actual domain/address details only.
- Search Console/Bing properties and sitemap are confirmed as appropriate.
- Index inspection is done after deployment for key URLs.

### Gate H — security/privacy
- Actual live response headers verified at origin/edge.
- TLS/canonical redirect/cache behavior confirmed.
- No tokens, secrets or personal data exposed in source, bundles, URL or logs.
- Endpoint server-side validation, rate limits, anti-abuse and token verification tested.
- Form data flow, purpose, retention, processors, destination and privacy notice approved.
- No sensitive form data is sent to general analytics or browser-error telemetry.
- Access, credentials, backup and rollback owners identified.
- Security findings assessed; critical/high issues block release unless an authorised written exception describes containment and expiry.
- MCP/AI tool access and actions reviewed.
- Sector/regional compliance obligations reviewed where relevant.

### Gate I — real submission and lead operations
- Test a complete enquiry end-to-end using a dedicated test record.
- Verify field mapping, email/CRM destination, timezone/timestamp and deduplication.
- Confirm success is reported only after the server or provider confirms acceptance.
- Confirm provider failure is visible and recoverable; no silent loss.
- Confirm response owner, notification routing and service-level expectation.
- Check consent/notice, retention/deletion path, spam handling and access control.
- Remove test records securely and ensure analytics are not misclassified.
- Document what happens when the form provider or CRM is down.

### Gate J — release and post-release smoke test
- Release approval recorded for the exact commit.
- Backup/rollback procedure confirmed.
- Domain/route, HTTPS and redirect behavior tested after deploy.
- Homepage and key routes load; no console errors or missing assets.
- Primary CTA and enquiry submission tested from the live hostname.
- Header/CSP/cache and analytics events verified.
- Key page metadata and canonical inspected.
- Monitoring and alert destination active.
- Release notes list known limitations and follow-up items.
- Main DNS/email records untouched unless an approved migration plan separately authorizes changes.

## 4. Defect severity

- **P0/Critical:** site unavailable, data exposure, compromised deploy, unauthorised privileged action, or severe safety/privacy issue. Stop/revert and escalate.
- **P1/High:** lead capture broken, critical journey unusable, major mobile defect, high-impact accessibility/security failure, incorrect high-risk claim. Block launch.
- **P2/Medium:** important but recoverable functional or usability issue affecting a significant section. Fix before broad rollout or approve a dated exception.
- **P3/Low:** minor visual or copy defect with limited impact. Log and prioritise.
Every bug has a reproduction path, expected/actual result, evidence, impact, owner and verification criteria.

## 5. Required release evidence template

- Release/change name:
- Commit SHA and branch:
- Preview and deployment IDs:
- User goal and success measure:
- Changed files/components:
- Automated tests and results:
- Browsers/devices/viewports:
- Screenshots/traces:
- Accessibility evidence:
- Performance results (lab vs field distinguished):
- Search and metadata checks:
- Security/privacy checks:
- Form/CRM end-to-end result:
- Known limitations:
- Rollback plan and owner:
- Reviewer decision and date:

## 6. Toolchain shortlist (start lean)
- Build: GitHub Actions.
- Browser integration/regression: Playwright.
- Unit/component logic: Vitest + React Testing Library where introduced.
- Accessibility: axe-core plus manual review; WAVE or Accessibility Insights as additional checks.
- Performance: Lighthouse CI and PageSpeed Insights; Core Web Vitals field data via suitable provider.
- Dependency/secret scan: GitHub security tooling or an approved alternative.
- Error monitoring: select only after privacy/retention review.
- Visual references: Figma when needed; avoid buying tools before actual workflows justify them.

## 7. Reference links
- Playwright: https://playwright.dev/
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- axe-core: https://github.com/dequelabs/axe-core
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Core Web Vitals: https://web.dev/articles/vitals
- PageSpeed Insights: https://pagespeed.web.dev/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- Google Search Central: https://developers.google.com/search/docs
- GitHub Actions: https://docs.github.com/actions
