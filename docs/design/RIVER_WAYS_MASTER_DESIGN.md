# River Ways — Canonical Website Design Direction

**Status:** Governing direction for the public River Ways website  
**Brand:** River Ways  
**Positioning:** Creative Demand Engineering  
**Primary message:** We engineer demand.  
**Visual system:** SHAPED CURRENT  
**Creative route:** Route 2 — Editorial Intelligence  
**Experience principles:** Cinematic · Creative · Interactive · Dimensional · CRO-led

This document consolidates prior design conversations, prototypes, references, and implementation efforts into one direction. It supersedes exploratory route proposals and earlier visual directions where they conflict with the decisions recorded here. It does not authorize a production deployment or override technical release gates.

## 1. The one direction

River Ways should feel like a confident, globally relevant creative demand engineering agency: editorial in its intelligence, cinematic in its presentation, expressive in its creative work, and precise in how it turns attention into commercial action.

The website is not a generic agency template, a SaaS dashboard, a portfolio-only site, or an abstract art experiment. It must make the agency's thinking and capabilities tangible while helping the right visitors take a clear next step.

The central proposition is **We engineer demand.** Supporting language should explain the practical connection between brand, creative, digital experiences, discovery, demand generation, conversion, measurement, and growth engineering.

## 2. Brand and visual guardrails

- Keep the name **River Ways** (two words) and domain `riverwayse.com`.
- Use the established **SHAPED CURRENT** sea/sky-blue visual expression, with deep-water contrast and considered cool surfaces.
- Preserve the current mark provisionally. Logo redesign or monogram exploration is not a prerequisite for website progress.
- Do not revive the rejected terracotta / lime / forest-green, near-black / warm-parchment, or unrelated experimental identity directions.
- Do not turn the river metaphor into literal waves, water textures, particles, or contour lines everywhere. Use it as a source of meaning: direction, force, confluence, terrain, adaptation, interdependence, formation, and destination.
- Use editorial typography, strong hierarchy, deliberate negative space, art-directed image crops, layered compositions, and distinctive but legible graphic systems.
- Photography, video, illustration, 3D, and motion should have a clear narrative or commercial role. Use licensed, approved, or original assets; do not imply client work where an asset is only a concept.

## 3. The River philosophy

The River has a way. The River has a life. The River has an environment. It understands seasons and people. People are ecosystems the River is part of, and some depend on it for survival. The River forms and sustains life. Its end goal is the ocean.

Translate this philosophy into the experience through context, connection, adaptation, movement, formation, and purposeful convergence. It is a strategic point of view, not a requirement to illustrate a literal river.

## 4. Experience principles

### Cinematic
Create a strong opening sequence and a sense of scale. Use motion and transitions to establish a world, not to delay comprehension. The first screen must communicate what River Ways does, who it helps, and what action a visitor can take.

### Creative
Treat typography, composition, imagery, motion, and detail as a coherent art direction. The Creative Studio is a real agency capability spanning brand systems, campaign concepts, graphic design, content, video, motion, 3D, editorial, and digital experiences. Do not present unbuilt capabilities as delivered work.

### Interactive
Make interactions purposeful and discoverable. Visitors should be able to explore a system, reveal a process, compare options, or understand an offer. Interactions must work with keyboard, touch, pointer, and assistive technology.

### Dimensional
Use depth, layering, spatial transitions, and responsive visual environments selectively. The Koi website reference (marinabudarina.github.io/koi) informs the principle of a living, layered full-screen experience and typography as artwork. It is not a visual template: do not copy its koi motif, dark palette, portfolio structure, or specific controls.

### CRO-led
Every section should serve visitor understanding, trust, qualification, or action. Use clear pathways for founders, growth-stage businesses, and enterprise teams. Make calls to action specific, reduce unnecessary form friction, and measure meaningful enquiry outcomes. Never sacrifice clarity or accessibility for spectacle.

## 5. Homepage narrative

The homepage should tell one connected story in this order:

1. **Cinematic opening:** We engineer demand. A distinct visual environment, concise supporting explanation, and primary project/diagnostic action.
2. **The business problem:** Disconnected brand, creative, marketing, digital and sales activity creates gaps in the customer journey.
3. **The River Ways system:** Explain how strategy, creative, digital experience, discovery, demand, conversion and learning connect.
4. **Capabilities:** Present the core capability families as an editorial composition, not a repetitive wall of identical cards.
5. **Creative proof:** Show verified work, original demonstrations, and capability examples with their evidence status clearly labelled.
6. **How we work:** Diagnose, shape, activate, measure, and improve — adapt the method to the client's context.
7. **Who we work with:** Clear entry paths for founders, growth-stage businesses, and enterprise teams.
8. **Demand Intelligence / diagnostic:** Explain the value honestly and invite visitors into an appropriate assessment or conversation.
9. **Point of view:** Express the River philosophy in business-relevant language.
10. **Closing conversion:** A confident, low-friction enquiry route with privacy clarity and useful expectations.

The exact section composition may evolve after browser review, but the commercial story and message hierarchy should remain coherent.

## 6. Information architecture and route reality

The intended public structure is larger than the currently accessible GitHub design branch. Do not confuse the target map with the routes that have been verified in a particular branch.

**Verified on PR #32's current GitHub branch:** the source contains the homepage, `/growth-diagnostic/`, `/field-guide/`, `/privacy/`, and a custom 404 document. Its sitemap currently lists four URLs. The homepage navigation is primarily anchor-based. Service detail, Work, About, Approach, Insights, Contact, Start a Project, and Thank You are not present as distinct static route documents in this branch. The Demand Engineering Field Guide has been restored from PR #24 and restyled to SHAPED CURRENT.

**Separate local release candidate:** the earlier `build/shaped-current-homepage` branch at `4fd62fc` was reported to include route registry and prerendering. Its close-out report claimed 12 sitemap URLs, while its build summary reported 10 route documents plus `404.html`. That discrepancy is unresolved. The local branch and its 42-commit / 63-file release bundle are not present on the accessible GitHub branches. Preserve that candidate and reconcile its exact route registry, generated output, sitemap, redirects, and 404 behavior before selecting the final release base. Do not infer the 12 route names or claim the discrepancy is resolved.

**Target public structure, subject to the route inventory:** Home; Services; Brand Strategy; Digital Experiences; Demand Generation; Growth Engineering; Creative Studio; Work; Approach; About; Insights; Contact; Growth Diagnostic; Start a Project; Thank You; Privacy; and a genuine not-found experience.

Do not collapse distinct service routes into homepage anchors or replace existing routes with a single scrolling brochure. Do not add sitemap entries for pages that do not exist. Every shipped route must serve a distinct, useful document, with correct canonical metadata, internal links, robots directives, and 404 behavior.

## 7. Work, evidence, and honesty

- Never invent clients, case studies, testimonials, performance figures, awards, or outcomes.
- Distinguish verified client work from internal product work, speculative concepts, experiments, and capability demonstrations.
- Names previously discussed as possible portfolio work are not automatically approved case studies. Confirm assets, scope, outcomes, permission, and evidence before publication.
- The River Ways website and Growth Diagnostic may be shown as internal demonstrations when accurately labelled.
- Avenize is a separate in-house AI Business Operating System, not a standard River Ways website feature or client case study.

## 8. Technical preservation and feature dependencies

The public website uses React 18 + Vite 6 and Cloudflare Pages. Preserve this architecture unless a verified architecture decision requires a change. The visual redesign must not reduce the capabilities of the strongest release foundation.

- **PR #24 — release / ads-readiness foundation:** includes the Pages contact function, D1 migrations 0001–0004, idempotent submission handling, attribution, lead operations, Playwright configuration and end-to-end tests, privacy, Growth Diagnostic, and a Demand Engineering field guide. These are valuable release capabilities, but they are not all present in PR #31's changed-file set. Reconcile them into the final release candidate rather than silently dropping them.
- **PR #31 — SHAPED CURRENT design branch:** preserves the basic contact endpoint, attribution, Growth Diagnostic, privacy, and 404, but its branch currently shows only migrations 0001–0002 and does not include the PR #24 field guide or Playwright E2E suite. Treat it as the visual foundation, not automatically as the complete technical release foundation.
- **PR #30 — Demand Intelligence AI increment:** adds a visitor-facing React component, a Pages Function, migration 0005, tests, and an owner-controlled `AI_DEMAND_ENABLED` feature gate. It reasons only from visitor-supplied context; it does not crawl the web or create leads. Keep it disabled until the owner approves current model cost/billing and the required Preview bindings and migration are verified. Do not imply the AI feature is live merely because the UI or endpoint exists.
- Preserve the existing `POST /api/contact` contract, server-side validation, D1 persistence, attribution, idempotency, anti-spam controls, and notification behavior when integrating branches. Do not replace it with a `mailto:` mock or front-end-only success state.
- Preserve Growth Diagnostic, privacy, field guide, lead operations, 404, route registry/prerendering, sitemap, robots, redirects, metadata, release-marker behavior, and end-to-end tests where they exist in the selected release candidate.
- The current branch's migration 0003 adds assignment/follow-up fields and `ops_open_leads` using the existing UUID `leads` schema. It has been exercised against a local in-memory SQLite sequence (0001→0002→0003), including existing-row backfill, insert/update triggers, overdue follow-up calculation, and exclusion of won/lost leads. This is not a D1 Preview migration run and has not been applied to any remote database.
- Do not introduce paid services, subscriptions, APIs, templates, or stock assets without explicit approval. Keep the AI feature gated until cost approval.
- Do not change production DNS, Cloudflare routing, production secrets, or production deployment settings as part of design work.
- Do not rebuild the application from scratch or create a parallel website to avoid understanding the existing one.

## 9. How previous design and release efforts fit together

The final product must combine the best visual direction with the most complete verified route, enquiry, privacy, diagnostic, and deployment foundation. No single currently accessible PR should be assumed to contain everything.

### Visual direction and implementation
- **PR #31 — `design/shaped-current-rebuild`:** strongest accessible GitHub visual foundation for SHAPED CURRENT and the redesigned homepage. It is not the final release base until reconciled with the newer local release candidate and PR #24's operational features.
- **PR #32 — `design/we-engineer-demand-homepage`:** current consolidated PR, now retargeted directly to `main`. It includes the full PR #31 visual foundation plus the approved headline, reconciled governance, Creative Studio studies, and restored Field Guide. It remains a draft; do not merge into `main` until the newer local release candidate and PR #24 operational features have been reconciled and all release gates pass. PR #31 remains open as the original visual foundation until PR #32 is validated; avoid treating both as independent final implementations.
- **Local release candidate — `build/shaped-current-homepage` @ `4fd62fc`:** newer separate work, reported as a 42-commit / 63-file release bundle with route registry and prerendering. It is not pushed to the accessible GitHub repository. Preserve it; reconcile its route inventory and code with PR #31/#32 before choosing the final release branch. The reported 12-URL sitemap versus 10 route documents plus 404 discrepancy is an open verification item.
- **PR #24 — `feat/ads-gate-readiness`:** stronger operational/release foundation, including D1 migrations 0001–0004, idempotent enquiry handling, lead operations, Playwright E2E coverage, privacy, Growth Diagnostic, and field guide. It is a separate branch from the visual redesign; integrate its working capabilities deliberately.
- **PR #30 — `feat/river-ways-ai-demand-intelligence`:** stacked on PR #24. Keep as a gated optional capability. Its AI feature requires owner cost approval, Preview bindings, migration 0005, and live verification. Do not turn it on by default or present it as an already-live capability.
- **PR #20 — preview gate:** deployment workflow foundation; preserve exact-commit release verification when reconciling CI.
- **PR #21 — layered current cards:** earlier interaction experiment; compare against PR #31's current-card hero. Do not stack duplicate effects.
- **PR #25 — design foundation:** source of reusable governance. Its documents are now reconciled into this branch; outdated instructions to compare routes or leave palette undecided are superseded.
- **PR #27 — three-route comparison:** historical exploration only. Route selection is settled.
- **PR #28 — separate SHAPED CURRENT CSS layer:** overlapping visual experiment. Do not merge independently if its useful changes are already represented in PR #31/#32.
- **PR #29 — agency operating platform:** separate internal operating-system scope, not a public website redesign. Keep its internal workspaces and platform requirements out of the public website unless separately approved.
- **Standalone static homepage prototype:** reference only. It is not the production application and does not replace React, route rendering, or the enquiry API.

### Consolidation rule
Compare file-level changes and ancestry before integrating. Preserve the best implementation of each capability, remove duplicated versions only after verification, and keep a clear record of provenance. Do not delete historical branches or overwrite the local release bundle.

## 10. Acceptance gates

A design change is not complete because it looks good in a screenshot or passes a build.

Before a release candidate can be approved, verify:

1. Production build and relevant unit/API tests pass on the exact candidate commit.
2. Real preview deployment serves the exact commit SHA.
3. Desktop, tablet, and mobile layouts are inspected in a browser; no horizontal overflow or broken navigation.
4. Keyboard operation, visible focus, semantic structure, screen-reader labels, contrast, and reduced-motion behavior are checked.
5. Motion is performant and does not block content, navigation, or conversion.
6. Images/video are responsive, appropriately sized, licensed, and have useful alternatives.
7. All routes, metadata, canonical URLs, sitemap, robots, redirects, and 404 behavior are checked.
8. The enquiry path is tested in Preview, including D1 persistence, attribution, duplicate handling, and notification delivery where configured.
9. Security headers and privacy statements match actual runtime behavior.
10. No unsupported client claims, false functionality, hidden paid dependencies, or unapproved production changes are introduced.

## 11. Decision rule

When a new idea conflicts with this document, do not silently create another design direction. First identify the conflict, explain the commercial or user-experience reason to change, and update this document only after an explicit decision. Otherwise, implement within the established direction.

**The objective is one coherent, distinctive, accessible, high-performing River Ways experience — not an endless sequence of redesigns.**
