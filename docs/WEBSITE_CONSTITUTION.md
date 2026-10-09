# River Ways Website Constitution
**Version:** 1.0  
**Prepared:** 9 October 2026  
**Status:** Proposed governing standard for review and implementation  
**Owner:** River Ways brand/product owner; delegated owners may implement individual controls.

## 1. Purpose

This constitution defines the non-negotiable principles, decision rules, evidence requirements, and release standards for the River Ways website and for the website systems River Ways builds for clients. The goal is not a fashionable homepage; it is a distinctive, accessible, discoverable, secure, maintainable, and commercially useful digital experience.

The public brand name is **River Ways** (two words). The current registered/live domain and email infrastructure remain separate operational facts. Do not rename or migrate domains, alter DNS, mail records, nameservers, or DNSSEC as part of design work. Any domain strategy change requires a separate risk-reviewed migration plan.

## 2. The governing promise

> Every design decision serves the brand. Every interaction serves the visitor. Every marketing activity connects to a measurable objective. Every release is supported by evidence.

We want River Ways to be a model for creative interactive websites: the web should become something visitors can explore, use, learn from, and share—not merely scroll through. Social-inspired interaction can be an invitation into deeper value, not a reason to copy feed mechanics, create dark patterns, or slow the website.

## 3. Non-negotiable principles

1. **Clarity before spectacle.** A visitor should understand what River Ways does, who it serves, why its approach matters, and what to do next. Motion and visual complexity may enhance the story but must not obscure the offer.
2. **Distinctive brand, not a template.** Build a coherent River Ways visual language from the rising-bar mark, forest/lime palette, typography, graphic grammar, iconography, motion, tone, and original illustrations. Inspiration may inform principles but never justify copying protected creative expression.
3. **Purposeful interactivity.** Each interactive element must help a visitor explore, decide, configure, learn, compare, create, or take action. Each has defined states, accessibility behavior, loading behavior, failure behavior, and analytics events when measurement is appropriate.
4. **Mobile is a first-class experience.** Design for narrow screens, touch, reduced bandwidth, older hardware, small viewport heights, and intermittent connections. Do not simply shrink the desktop design.
5. **Accessibility by design.** Target WCAG 2.2 AA for relevant user journeys, including semantic structure, keyboard operation, visible focus, accessible names, sufficient contrast, readable text, error identification, reduced motion, and non-pointer operation. Automated scans are necessary but not sufficient.
6. **Performance is part of creative quality.** Establish budgets before implementing heavy video, 3D, animation libraries, third-party scripts, fonts, and analytics. Degrade gracefully and provide lighter experiences when hardware or connection quality is limited.
7. **Trust is earned with evidence.** No fabricated clients, testimonials, awards, metrics, case studies, certifications, endorsements, or promises. Distinguish examples, simulations, prototypes, forecasts, and live integrations clearly.
8. **Privacy and security are product features.** Collect only needed data, explain use, control access, retain data intentionally, secure credentials server-side, protect endpoints, and document response procedures.
9. **Discovery serves people.** Build crawlable, useful, original service and niche content, meaningful information architecture, accurate metadata, structured data matching visible content, and internal links. No search or AI discovery outcome is guaranteed.
10. **Measure outcomes, not vanity.** Define the intended business result before an experience is built. Track appropriate signals such as qualified enquiries, form completion, booked calls, tool completion, conversion quality, and client outcomes—with privacy controls.
11. **Maintainability beats cleverness.** Reusable design tokens, semantic components, documented interaction patterns, version control, automated checks, and boringly reliable release procedures are preferred over fragile one-off effects.
12. **Honest capability language.** Describe only services, integrations, automations, data coverage, performance, and security controls that exist or can be supported. Label roadmaps and interactive demonstrations as such.

## 4. Experience principles: move beyond the scroll

River Ways should develop a library of reusable, high-value interactive patterns:
- Explorers and guided pathways that let visitors choose their context.
- Diagnostics and maturity assessments with transparent scoring.
- Calculators and scenario models that expose assumptions and allow adjustment.
- Interactive explainers of systems, processes, and trade-offs.
- Configurators and comparison tools that reduce decision effort.
- Original data visualisations with source notes and accessible text equivalents.
- Shareable outputs, reports, or summaries when there is a meaningful user benefit.
- Product-like live demonstrations whose data provenance and limitations are explicit.
- Story-driven motion and scroll sequences only when the narrative benefits from time and progression.
- Conversational guidance when it is genuinely more useful than a structured form or navigation.

Do not adopt infinite scroll, forced autoplay, fake urgency, manipulative consent, unwanted audio, hidden controls, or novelty interaction without a user need. Preserve browser behavior, direct links, selection/copying, back/forward navigation, and readable content. Interactive tools must not trap visitors in a modal or force completion to access basic information.

## 5. Brand system

The current working visual direction is:
- Forest: `#101C18`
- Signal lime: `#D7FB69`
- Growth green: `#799A3B`
- Soft paper: `#F7F8F4`
- Ink: `#17221D`
- Muted text: `#69756E`

These are implementation tokens to govern the current redesign, not proof that every combination passes contrast. Validate foreground/background pairs, focus states, text sizes, links, charts, disabled states, error states, and focus indicators. Lime is a selective accent; do not use it for small body copy on pale backgrounds without testing contrast. Keep light/dark logo variants, a simple small-size mark, favicon/app icon assets, and spacing rules.

Brand voice: intelligent, clear, practical, curious, outcome-focused, and candid. Avoid jargon stacking, invented certainty, manipulative urgency, and unexplained acronyms. Define Demand Engineering and Demand Intelligence in plain language wherever needed.

## 6. Content and information architecture

### Minimum launch information architecture
- Home: positioning, clear primary action, service routes, method, proof, FAQ, contact.
- Services index plus service pages as content is ready.
- About / point of view.
- Work / case studies only when verified evidence exists.
- Insights / resources when there is editorial capacity to keep them useful.
- Contact / consultation request.
- Privacy notice, applicable terms, accessibility contact/process, cookie or consent information where required.
- System pages: not found, submission success/error, and graceful failure/empty states.

### Service-page rule
Each page must identify the target audience, problem, observable symptoms, outcome sought, scope and deliverables, method, dependencies, limitations, proof or a transparent explanation where proof is not yet available, FAQs, a relevant CTA, and related next steps. Pages must be substantively useful, not shallow keyword variants.

### Claims and evidence register
Before publication, record each important business claim, its source/owner, permission status, date, expiry/review date, and the exact pages using it. Where evidence is missing, rewrite the claim or omit it.

## 7. Interaction design contract

Every interaction must define:
- Purpose and user task.
- Entry point and exit/undo path.
- Default, hover, focus, active, disabled, loading, empty, success, and error states as applicable.
- Keyboard, touch, screen-reader, zoom, reduced-motion, and no-JavaScript behavior where relevant.
- Performance budget and fallback.
- Data collected, where data goes, retention, and security needs.
- Analytics event and success measure, only when appropriate.
- Acceptance test and named owner.

Motion should be brief, consistent, cancelable, and optional where possible. Do not communicate critical meaning through color or animation alone. Respect `prefers-reduced-motion`; provide a non-motion path, and ensure the site remains usable when animations or WebGL are unavailable.

## 8. Technical architecture standards

The current project uses React + Vite with CSS and a Cloudflare testing deployment. Preserve the working stack unless an architecture decision record demonstrates a real need to change it.

- Use semantic HTML, accessible React components, explicit component boundaries, and stable design tokens.
- Keep API keys, session secrets, integration credentials, privileged logic, and private user data out of shipped client bundles and source control.
- Use server-side endpoints for submissions and integrations; validate and authorize at the boundary.
- Add dependency lockfile discipline, dependency review, build checks, error monitoring, and deployment rollback.
- Separate development, preview, and production settings; do not use the live domain as an unverified test environment.
- Treat Cloudflare and repository deployment configuration as separate from registrar/DNS changes. Never change working DNS, Google Workspace MX/TXT records, nameservers, or DNSSEC during routine website implementation.
- Audit hosting headers, cache behavior, redirects, content security policy, source maps, and error responses on the actual deployed host.
- Make canonical URL, sitemap, robots directives, Open Graph metadata, and structured data derive from the confirmed production domain only after launch decisions are approved.

## 9. SEO, local/global discovery, and AI-enabled discovery

- Create an indexable, helpful page for each distinct high-value service and audience need.
- Ensure important content is present as accessible text; do not hide all meaningful copy inside imagery or inaccessible canvas.
- Use clear page titles, unique descriptions, descriptive headings and links, internal links, responsive media, and accurate alt text.
- Use structured data where applicable and ensure it matches visible content. Never invent reviews, ratings, locations, prices, credentials, or affiliations.
- Keep business identity, name, contact details, service geography, and author attribution consistent.
- Manage canonicalization, redirects, sitemap, robots controls, 404s, indexation, and duplicate content.
- Use Google Search Console, Bing Webmaster Tools, analytics, and actual search-result checks; measure impressions, clicks, qualified enquiries, landing pages, and observed AI/search referrals.
- Treat GEO/AIO/AEO as an outcome of clear entity information, original expertise, verifiable sources, useful answers, accessible crawlable pages, and overall search fundamentals—not a separate guaranteed ranking hack.
- Global demand generation must respect language, market, data source limits, local expectations, and regional regulation. Do not publish doorway pages at scale.

## 10. Trust, privacy, and safety

- Publish a clear privacy notice before collecting personal information.
- Collect only fields needed for the stated purpose; state contact expectations and retention at collection.
- Establish consent rules for analytics, advertising technologies, recordings, and nonessential cookies where applicable.
- Identify the controller/processor relationships, vendors, transfer paths, access roles, retention periods, deletion process, and incident owner.
- Use anti-spam and abuse controls that remain accessible; avoid unnecessary personal-data exposure to bot vendors.
- Apply rate limits, safe error handling, logging with secret/PII redaction, least privilege, backups where data is stored, and a tested incident-response procedure.
- Keep social listening to lawful, permitted, appropriately accessible data sources. Respect platform terms, rate limits, robots/technical access controls, privacy rights, sensitive personal data, and opt-outs. Use context-aware, human-led outreach; never automatically spam people because a keyword matched.
- Use HTTPS and tested security headers; do not enable HSTS preload or restrictive production policies without validating all affected hosts and resources.

## 11. Quality and release gates

A release cannot pass based on a single successful build. It must demonstrate:
1. Correct brand, content and links.
2. Clean production build and no blocking browser errors.
3. Core forms and CTAs function, with verified success and failure paths.
4. Responsive layouts on common viewport sizes and browsers.
5. Keyboard-only navigation and accessibility checks.
6. Reduced-motion behavior and graceful media fallbacks.
7. Performance measurement against agreed budgets.
8. Search metadata, canonical URLs, robots, sitemap, and structured data checked.
9. Privacy/security controls tested at the actual host.
10. Analytics/lead events verified without accidental sensitive-data capture.
11. Backup/rollback and deployment ownership recorded.
12. Reviewer sign-off and a post-release smoke test.

Recommended baseline performance targets use Core Web Vitals' current good thresholds at the 75th percentile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. These are field targets, not guarantees of every lab run. Establish measurable budgets for transferred bytes, image weight, JavaScript, fonts, third-party scripts, and animation cost based on real test devices.

## 12. How we decide what to build

Score proposed work from 1–5 on: user value, strategic differentiation, conversion or retention impact, evidence of demand, accessibility impact, build cost, performance risk, privacy/security risk, and maintenance burden. Prioritise high-value work with manageable risk. Do not ship a feature just because it trends on social media.

Use this order when trade-offs arise:
1. Safety, privacy, accessibility and legal obligations.
2. User task completion and clarity.
3. Correctness, reliability and content integrity.
4. Performance and resilience.
5. Conversion and measurable business value.
6. Brand distinction and creative expression.
7. Novelty.

This is not an argument against bold creativity. It is how we ensure that bold creative work remains useful, trusted and deployable.

## 13. Review rhythm and ownership

- Before every release: complete the relevant checklist and attach evidence.
- Monthly during active improvement: review analytics, form quality, errors, performance, indexing and user feedback.
- Quarterly: review claims, accessibility, dependencies, security controls, source licences, content gaps and the reference library.
- When a provider, standard, platform policy or regulation changes: log the change and review impacted features.
- Document exceptions with owner, reason, risk, expiry date and remediation plan.

## 14. Authoritative reference policy

Prefer primary documentation from standards bodies, browser/platform vendors, security organisations, official registries, and the original provider. Use design galleries and social posts for inspiration, not as proof of technical correctness, legal rights, performance, or usability. Record each resource's purpose and review date in `docs/REFERENCE_LIBRARY.md`.

The reference set is deliberately curated and scope-based. The open web is too large and dynamic to enumerate literally every resource; the catalogue aims to cover the required disciplines and provides a process for continuous additions.

## 15. Definition of success

The website is successful when qualified visitors can understand the offer, complete key tasks, trust what the site says, use it across devices and access needs, discover valuable content, and submit enquiries that enter a reliable follow-up process—while River Ways can measure and improve these outcomes without compromising privacy, security, performance, or its brand.

## Related documents
- [Documentation hub](README.md)
- [Reference library](REFERENCE_LIBRARY.md)
- [Interactive experience playbook](INTERACTIVE_EXPERIENCE_PLAYBOOK.md)
- [Niche playbooks](NICHE_PLAYBOOKS.md)
- [MCP and agent tooling](MCP_AND_AGENT_TOOLING.md)
- [SEO, GEO/AIO and discoverability](SEO_GEO_AIO_DISCOVERABILITY.md)
- [Security and privacy](SECURITY_PRIVACY_COMPLIANCE.md)
- [QA and release gates](QUALITY_ASSURANCE_RELEASE_GATES.md)
- [Roadmap and backlog](ROADMAP_AND_BACKLOG.md)
