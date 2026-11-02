# River Ways Platform — Project Memory and Decision Register

**Purpose:** Durable project context for humans and AI agents. This file records approved direction, constraints, verified facts, open questions and decisions. It is not a substitute for code, tests, source records or current-state audits.

**Last updated:** 2 November 2026  
**Status:** Living document

## 1. Project identity

- Agency name: **River Ways** (two words).
- Domain: `riverwayse.com`.
- Repository: `godsbest656-glitch/river-ways`.
- Current application baseline in the accessible repository history: React + Vite. Recent project context identifies React 18 + Vite 6; verify the checked-out branch and deployment source before assuming current production state.
- The project has existing website, design, acquisition and implementation work. Do not restart or overwrite it without inspection.

## 2. Business ambition

River Ways is a digital agency built around **creative demand engineering** and the ambition to connect strategy, creative work, marketing, technology, discovery and measurement into systems that create meaningful business movement.

The agency should:
- serve a global initial market;
- use a hybrid acquisition engine (inbound and direct, evidence-led outbound);
- lead with valuable business problems rather than compete only on freelance marketplaces;
- connect diagnosis, scoped projects and ongoing engagements;
- build capability and operational leverage through its own platform.

The website should become both the public face of the agency and a solid part of its operations.

## 3. River philosophy

The user's current guiding philosophy supersedes earlier formulations:

- The River has a way.
- The River has a life.
- The River has an environment.
- The River understands seasons and people.
- People are ecosystems in which the River participates, and some depend on it for survival.
- The River's end goal is the ocean.

Use this as a strategic foundation for thinking about systems, context, adaptation, interdependence, life and destination. Do not reduce it to literal wave graphics or a generic blue visual theme.

## 4. Brand and design decisions

- Current approved direction: **SHAPED CURRENT**.
- Current mark is provisional and should be used unless a separate identity decision is approved.
- Do not reopen logo/identity approval as a prerequisite for website or platform implementation.
- The user wants color and identity choices to be strategic, not arbitrary decoration.
- Preserve the existing current brand tokens and design assets from the active implementation branch; do not infer hex values from an older branch or conflicting document.
- The homepage ambition is a premium, art-directed, accessible and interactive experience, including a **curated catalogue of brilliance**: original campaigns, graphics, video, digital experiences, motion, case studies and demonstrations.
- Use real licensed or original imagery; verify rights. Do not fabricate client work or outcomes.
- Motion/3D is welcome when purposeful, performant, accessible and supported by fallbacks.

## 5. Platform vision

The website/platform has three connected environments:

1. **Public website:** positioning, services, creative catalogue, case studies, enquiry and acquisition conversion.
2. **Client workspace:** project status, briefs, approvals, asset review, reports, deliverables and authorized communication.
3. **Internal agency workspace:** CRM, prospects, clients, projects, tasks, creative studio, reports, finance records, asset library and operational oversight.

The shared foundation includes identity, permissions, data, file handling, audit events, jobs, reporting, backup/recovery and integration boundaries.

The platform is intended to support real-world agency work and reporting. Reports must be generated from recorded work and traceable data, not invented dashboards or end-of-month recollections.

## 6. Creative production vision

Target workflow:
1. Client approves scope and payment is verified.
2. River Ways submits a structured brief.
3. Platform imports authorized social analytics or client exports.
4. System analyzes the business, audience, content history and available performance signals.
5. AI-assisted strategist recommends content pillars, creative angles, formats, quantities and a batch plan.
6. Human reviews and approves the plan.
7. Local/open-source tools produce batches of graphics, carousels and videos.
8. Quality, brand, rights and claim checks run.
9. Client reviews, requests revisions or approves.
10. Approved work is delivered; only authorized work can enter the public catalogue.
11. Performance data informs the next cycle.

AI recommendations must distinguish measured evidence from hypotheses. Social API access is not assumed to be free or universally available.

## 7. Hard cost constraint

**No additional cost at all** is the user's explicit requirement for this platform build.

This means:
- no new paid subscriptions;
- no paid AI APIs;
- no metered services that may generate charges;
- no paid templates, stock assets or plugins;
- no paid automation service;
- no production dependency on free trials;
- no automatic paid fallback.

Use existing capacity, open-source software, local processing, client-provided exports and manual workflows where necessary. Free software does not guarantee free compute, unlimited generation, unlimited storage or free social API access. Hardware and quota limits must be surfaced honestly.

Any cost exception requires explicit approval in advance.

## 8. Verified repository context and cautions

- The accessible repository is `godsbest656-glitch/river-ways`.
- The default `main` branch inspected on 2 November 2026 contains a simpler website snapshot and an older `docs/ARCHITECTURE.md`; do not treat it as the complete or current implementation without branch reconciliation.
- PR #25 is an open draft documentation PR titled “docs: establish AI design constitution and creative direction foundation”, based on `docs/ai-design-foundation` at the inspected head. It contains `AGENTS.md` and the existing design constitution, creative direction brief, design-system architecture, protocol, acceptance gates, master execution brief and design README.
- This platform documentation is intended to build on that design foundation, not replace it.
- Prior implementation context includes Cloudflare Pages/Workers and D1, an enquiry pipeline, and related production hardening. Verify exact active branch, bindings, deployment source and current live behavior before making claims or changes.
- Do not assume an old mailto form, Netlify configuration, Cloudflare binding, Resend credential or inbox is currently active without testing.
- Production DNS, registrar, nameservers, DNSSEC, email/MX/TXT and deployment settings must remain untouched absent separate explicit authorization.

## 9. Evidence and truth protocol

Use these labels in reports and decisions:
- **Verified:** directly checked against current source, test, provider response or authorized record.
- **Implemented:** code/configuration exists; runtime behavior may still be unverified.
- **Deployed:** a deployment exists in a named environment.
- **Verified in environment:** behavior was actually tested in that environment.
- **Proposed:** recommended but not implemented.
- **Hypothesis:** plausible but not validated.
- **Blocked:** cannot proceed because a named dependency or authorization is missing.
- **Unknown:** not yet established.

Never convert missing evidence into a negative claim. For example, absence from one repository does not prove work never existed.

## 10. Open questions to resolve through inspection

- Which branch and commit are the current implementation/release source?
- Which environment currently serves the production domain?
- What database, object storage and worker capacity are already available without new charges?
- What are the current authentication and access-control capabilities?
- What are the actual current enquiry endpoint and notification behavior?
- What hardware (RAM, GPU/VRAM, storage) is available for local models and rendering?
- Which client social analytics exports can be supplied reliably?
- What client permissions and retention terms are required for data and portfolio publication?
- What payment evidence source is available without introducing a paid integration?
- What is the current approved detailed SHAPED CURRENT token set and asset register?

## 11. Agent handoff protocol

Before continuing work:
1. Read this file, `PRD.md`, `architecture.md`, `rules.md`, `Design.md` and `tasks.md`.
2. Read root `AGENTS.md` and the existing design constitution/protocol/acceptance gates.
3. Inspect current branch, git status, recent commits, open PRs, app source, package scripts, database schema, deployment configuration and tests.
4. Reconcile facts with the source-of-truth hierarchy; update this file only when a decision is approved or a fact is verified.
5. Never use this memory file as proof of current deployment or runtime behavior.
6. Work in a topic branch, preserve unrelated changes, test, document evidence and open a reviewable PR.
7. Do not merge, deploy or change production routing without explicit authorization.

## 12. Document ownership

- `PRD.md`: what the product must do and how success is measured.
- `architecture.md`: how the system is structured and how data/control flow.
- `rules.md`: binding constraints and operating rules.
- `Design.md`: visual and interaction experience requirements.
- `tasks.md`: prioritized implementation backlog and acceptance criteria.
- `Memory.md`: durable context, decisions, facts and open questions.

If one document changes a binding decision, update the others and record why. Keep these documents concise enough to maintain and specific enough to execute.
