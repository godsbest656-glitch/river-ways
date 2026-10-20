# River Ways: Resource-to-Revenue Implementation Plan

**Status:** implementation plan; candidates below still require a repo-by-repo maintenance, licence, security, and integration audit.
**Working branch:** `feat/resource-to-revenue-implementation`
**Base:** `a3a1abc` — hero field illustration refinement.

## Operating decision

Optimise first for qualified sales conversations and reliable delivery, then reusable creative capabilities, then new products. Do not start a parallel rebuild or migrate hosting as a reaction to a performance hunch. Keep the current website, enquiries, and Growth Diagnostic stable while measuring the hosting path.

## Workstream 1 — Website Opportunity Finder (first)

### MVP
1. Input: a prospect's public website URL and a small amount of context.
2. Check publicly observable basics: page availability, title/meta/canonical, mobile viewport, primary CTA presence, contact path, image/asset weight where measurable, and basic accessibility/performance signals.
3. Generate a concise, evidence-linked audit with clear confidence labels; do not claim live analytics, conversion rates, rankings, or traffic without data access.
4. Let the operator manually mark fit, urgency, likely service, contact source, and next action.
5. Save the prospect and audit status in a small internal pipeline; export CSV/Markdown.
6. Require human review before any outreach. No purchased lists, automated mass messaging, or unverified personal data.

### Acceptance criteria
- Handles invalid URLs and timeouts without losing work.
- Every finding includes the URL/evidence and distinguishes observed facts from suggestions.
- No secret keys in client code; rate limits, SSRF protection, and safe URL validation before enabling remote fetches.
- Produces an actionable, personalised brief in under a few minutes of operator time.
- Does not interfere with existing website enquiry or diagnostic flows.

## Workstream 2 — Enquiry and sales operating system

- Preserve the existing contact flow until the server-side submission, validation, spam protection, storage, and notification path is verified end-to-end.
- Use the currently accessible enquiry inbox: `akinsify0511@gmail.com`.
- Model each lead with source, need, stage, owner, next action, last contact, consent/legal basis, and outcome.
- Use a low-cost CSV/SQLite-backed first version or an existing maintained CRM only after licence and hosting review.
- Send only expected, user-triggered client emails (enquiries, requested follow-ups, bookings, and onboarding). Keep human approval for outbound prospecting.

## Workstream 3 — Creative Experience Kit

Build a small reusable set inside the existing React/Vite project: accessible motion primitives, image-led case-study layouts, responsive hero compositions, CTA/form patterns, reduced-motion behavior, and a performance budget. Reuse only components that fit the current visual direction; do not add libraries for one decorative effect.

Candidate references to evaluate:
- React Bits — https://github.com/DavidHDev/react-bits
- Motion Primitives — https://motion-primitives.com/
- shadcn/ui — https://ui.shadcn.com/
- Awesome Creative Coding — https://github.com/terkelg/awesome-creative-coding
- Playwright — https://github.com/microsoft/playwright

## Workstream 4 — Future business intelligence

Treat Avenize-like business intelligence as a later product track. Start with one validated workflow and traceable data, not a generic AI chat wrapper. Require permissioned data access, citations to source records, human approval for consequential actions, and a measurable business outcome before expanding.

## Resource evaluation checklist

For each candidate repository, record:
- exact repository URL and what problem it solves;
- last meaningful release/commit and current maintenance signals;
- licence and whether code modification/hosting/redistribution is allowed;
- security posture, dependencies, open issues, and deployment requirements;
- total setup and ongoing cost, including external APIs;
- integration fit with React/Vite, existing enquiry flow, and available infrastructure;
- decision: reuse, adapt, learn from, or reject.

Do not equate a project-ideas list with production-ready code. Treat learning tutorials as references unless their code passes the same review.

## Cloudflare / delivery diagnosis — do not migrate by assumption

Cloudflare may add complexity to the development and release workflow, but that is different from making the website slow for visitors. Measure both separately.

1. Record the exact URL, device/network, time, and symptom (slow first byte, slow assets, delayed interactivity, failed deploy, or stale version).
2. Compare the same production response on `https://riverwayse.com/` and the known Worker deployment URL, without changing DNS.
3. Measure repeated requests for DNS, connect/TLS, TTFB, total transfer, status code, cache headers, and asset waterfalls; test both cold and warm cache.
4. If the Worker URL is fast but the custom domain is slow, investigate DNS/proxy/cache/rules. If both are slow, inspect origin/runtime and page payload. If only deployment is slow, inspect build queues, dependency installs, and preview configuration instead.
5. Check that the custom domain serves the intended commit before judging design/performance; a stale deployment is a release-routing problem, not a speed measurement.
6. Make one reversible change at a time and repeat the same measurements. Do not change nameservers, DNSSEC, or production routing until the cause is evidenced.

## Delivery sequence

1. Verify source-of-truth branch and current production commit.
2. Establish baseline performance and enquiry-flow checks.
3. Build the Opportunity Finder as a separate, testable internal tool.
4. Connect it to the lead pipeline with explicit human approval.
5. Extract and test creative components without blocking sales work.
6. Reassess hosting only after side-by-side measurements.

## Definition of done

A working, tested tool creates useful prospect briefs; every lead has a next action; current enquiries remain reliable; visual improvements are reusable; and any hosting decision is backed by measurements rather than intuition.
