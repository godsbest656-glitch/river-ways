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

## 6. Information architecture

Preserve the existing route architecture and working page content. The intended public structure includes:

- Home
- Services
- Brand Strategy
- Digital Experiences
- Demand Generation
- Growth Engineering
- Creative Studio
- Work
- Approach
- About
- Insights
- Contact
- Growth Diagnostic
- Start a Project
- Thank You
- Privacy
- A genuine not-found experience

Do not collapse distinct service routes into homepage anchors or replace existing routes with a single scrolling brochure. Keep sitemap, canonical metadata, internal links, and 404 behavior aligned with the actual routes.

## 7. Work, evidence, and honesty

- Never invent clients, case studies, testimonials, performance figures, awards, or outcomes.
- Distinguish verified client work from internal product work, speculative concepts, experiments, and capability demonstrations.
- Names previously discussed as possible portfolio work are not automatically approved case studies. Confirm assets, scope, outcomes, permission, and evidence before publication.
- The River Ways website and Growth Diagnostic may be shown as internal demonstrations when accurately labelled.
- Avenize is a separate in-house AI Business Operating System, not a standard River Ways website feature or client case study.

## 8. Technical preservation

The design is implemented within the existing React 18 + Vite 6 application and Cloudflare Pages architecture. Preserve existing routes, SEO, security, analytics attribution, and the enquiry contract.

- Preserve the existing `POST /api/contact` flow, server-side validation, D1 persistence, attribution, anti-spam controls, and notification behavior. Do not replace it with a `mailto:` mock or front-end-only success state.
- Preserve Growth Diagnostic, privacy, 404, sitemap, robots, metadata, and release-marker behavior.
- Do not introduce paid services, subscriptions, APIs, templates, or stock assets without explicit approval. Prefer free, open-source, locally controllable, or already-approved resources.
- Do not change production DNS, Cloudflare routing, production secrets, or production deployment settings as part of design work.
- Do not rebuild the application from scratch or create a parallel website to avoid understanding the existing one.

## 9. How previous design efforts fit together

Use this hierarchy when encountering older branches, PRs, prototypes, and documents:

- **Canonical implementation foundation:** PR #31, `design/shaped-current-rebuild` — the integrated SHAPED CURRENT homepage and visual redesign built on the existing application and enquiry infrastructure.
- **Approved headline and metadata refinement:** PR #32, `design/we-engineer-demand-homepage` — applies the final headline “We engineer demand.” and aligns document/social metadata.
- **Design constitution and developer standards:** PR #25 and its supporting documents — retain reusable standards and acceptance criteria, but update any outdated exploratory statements to match this canonical decision.
- **Three-route comparison:** PR #27 — historical exploration only. Route selection is settled; do not reopen the A/B/C identity decision.
- **Standalone SHAPED CURRENT CSS layer:** PR #28 — exploratory/overlapping implementation. Do not merge independently if its changes are already represented in PR #31.
- **Earlier interactive hero, card-wave, typography, identity and visual experiments:** retain as reference material where useful; do not stack or merge them independently without a file-level comparison against the canonical implementation.
- **Standalone static homepage prototype:** reference only. It is not the production application and does not replace the existing React implementation or enquiry API.

This hierarchy is a consolidation policy, not a claim that every listed PR has been merged, tested, or deployed. Keep exploratory work available for traceability; avoid destructive branch deletion.

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
