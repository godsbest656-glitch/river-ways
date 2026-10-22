# AI Developer Kickoff — River Ways Website Design

## Mission
Begin comprehensive design work for the public River Ways website using the repository's new design foundation. This is a staged design-and-implementation assignment, not permission to immediately rewrite the whole site or change production.

## Required first task
Perform a baseline audit and research sprint. Do not start with a full visual rebuild.

### Deliverable 1 — Baseline audit
Inspect the actual current branch and application. Document:
- Existing routes/sections, component structure, styles and design decisions.
- Current visitor journey and conversion actions.
- Working enquiry, analytics, SEO, and deployment behavior that must not regress.
- Existing design branches and experiments worth reviewing or reconciling.
- Accessibility, performance, responsive, content, and technical risks.
- What is verified, assumed, and unknown.

### Deliverable 2 — Reference atlas
Collect a focused, high-quality reference set from different disciplines: digital agencies, editorial/cultural institutions, architecture/material design, product interfaces, data storytelling, motion/interaction libraries. Include direct URLs, a specific observed lesson, River Ways application, what not to copy, and any licensing caveat. Avoid a generic inspiration dump.

### Deliverable 3 — Three divergent routes
Develop Living Terrain, Mineral Force, and Uncommon Intelligence as initial hypotheses—or replace one if research justifies a stronger route. Routes must differ in composition, typographic voice, imagery/materials, information visualization, and interaction behavior, not only palette. Include desktop and mobile first-screen concepts, one explanatory Demand Engineering section, one case-study treatment, and contact/conversion treatment. Include palette/type studies and contrast checks without declaring them approved.

### Deliverable 4 — Comparative recommendation
Score routes against the constitution using a transparent rubric: distinctiveness, immediate comprehension, credibility, conversion clarity, masterbrand flexibility, accessibility, performance, maintainability, and asset feasibility. Explain trade-offs. State which decisions require owner approval.

### Deliverable 5 — Small prototype
Implement only the smallest representative prototype needed to compare the leading route(s). Use the existing React + Vite stack unless an ADR justifies otherwise. Keep it on a topic branch. Do not touch production DNS, deployment settings, or unrelated enquiry/analytics work. Include responsive behavior and reduced-motion fallback.

### Deliverable 6 — Design-system seed
After the route is recommended, establish semantic CSS tokens and only the core components needed for the prototype. Do not generate a large component library before the route is validated. Record asset provenance and design decisions.

## Required working method
1. Read `AGENTS.md` and every document linked from `docs/design/README.md`.
2. Inspect source, branch history, existing design experiments, and deployment configuration.
3. Work in reviewable commits and keep scope separate from other feature work.
4. Prefer evidence and direct inspection over assumptions.
5. Test real rendered output; include screenshots or preview links where available.
6. Report actual tests run and disclose untested cases.
7. Open a pull request with a concise summary, route comparison, preview evidence, tests, risks, and unresolved decisions.

## Guardrails
- The public name is River Ways. Preserve `riverwayse.com` as the domain.
- No final brand route, palette, font, or logo is approved by this brief.
- Do not assume water requires blue; do not drift into the rejected terracotta / near-black / warm-parchment association.
- Do not fabricate case-study results, testimonials, customer logos, or analytics.
- Do not copy reference sites or use unlicensed assets.
- Keep the main conversion path usable without motion or third-party media.
- Preserve unrelated prospecting, enquiry, analytics, and release work.
- Do not merge or deploy without the required review and release gates.

## Completion report format
- Baseline facts and files inspected
- Reference atlas
- Three routes and comparative decision
- Prototype branch/PR and preview URL (if available)
- Files changed
- Build/tests and browser checks actually performed
- Accessibility/performance findings
- Decisions requiring owner approval
- Known limitations and recommended next step