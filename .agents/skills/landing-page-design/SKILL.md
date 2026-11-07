---
name: landing-page-design
description: "Plans and implements conversion-aware River Ways pages, including audience intent, page narrative, copy, proof, calls to action, responsive composition and search visibility. Use when creating or substantially changing a homepage, service page, campaign page, section or marketing experience."
---

# Landing page design for River Ways

## Authority
Read `AGENTS.md`, `docs/design/RIVER_WAYS_MASTER_DESIGN.md`, the relevant design-system documents and the existing route before making decisions. The master design is binding: River Ways, Creative Demand Engineering, SHAPED CURRENT, Route 2 — Editorial Intelligence, and “We engineer demand.” Do not import upstream sample palettes, fonts, type scales, spacing, radius, icon sets or motion values. The current project tokens and approved creative direction take precedence.

## Approved homepage hero composition
The user-approved reference calls for a centred editorial proposition, not a split copy/visual hero:
- Centred, confident headline with deliberate line breaks.
- Concise supporting explanation with a readable measure.
- One primary action and one quieter secondary route.
- A purposeful visual field or interactive gallery beneath the copy.
- Keep the existing River Ways interactive current/card model; do not replace it with a generic stock image or a decorative video.
- Preserve the hero's commercial clarity, responsive behavior and reduced-motion support.
Adapt the composition, not another brand's artwork, assets or exact proprietary design.

## Strategy before layout
Establish from available evidence:
- The audience and context for this page.
- The visitor's problem, intent and expected outcome.
- The page's role in the wider website journey.
- The primary action and its actual destination.
- The evidence that supports each claim.
- Likely objections and information the visitor needs before acting.
- Search intent, indexation and internal-link requirements.

A homepage serves several audiences and intents; do not force it into a one-offer landing-page formula. A focused campaign or service page may have one dominant audience and action. Ask only for missing information that materially changes the implementation. Otherwise record a conservative assumption and continue.

## Build the page argument
Choose a content sequence that fits the page, typically:
1. A clear proposition and useful first action.
2. Context: the problem or opportunity.
3. River Ways' method and how capabilities connect.
4. Relevant services or outcomes.
5. Evidence, with its status made explicit.
6. Process, expectations and risk/objection handling.
7. A clear next step.

Do not use a fixed section recipe where the content does not justify it. Avoid repetitive equal-card grids, generic agency filler and decorative sections without a visitor purpose.

## Copy and proof
- Write specific, plain-language, outcome-led copy.
- Explain specialist terms when a first-time visitor may not know them.
- Put proof beside the claim it supports.
- Never invent clients, logos, testimonials, awards, metrics, prices, guarantees, credentials or results.
- Distinguish verified client work, internal work, illustrative capability studies, prototypes and roadmap items.
- Mark missing evidence as a content dependency; do not disguise it with plausible-sounding sample data.
- Give every CTA a real destination and a clear expected result. No dead links or decorative buttons.

## Visual and interaction implementation
- Use the approved River Ways tokens and existing components.
- Build a coherent composition from content hierarchy, image treatment, rhythm, scale and whitespace.
- Use photography, video, illustration, 3D and motion only when they advance the story or task.
- Preserve semantic HTML, accessible names, visible focus, keyboard and touch behavior.
- Implement loading, empty, error, success and disabled states where relevant.
- Respect reduced motion; content and actions must remain available without animation.
- Avoid layout shift, unoptimised media and unnecessary client-side JavaScript.

## Implementation sequence
1. Inspect the existing route, source, styles, dependencies, tests and deployment assumptions.
2. Write the page argument, proposed hierarchy, CTA behavior and proof gaps.
3. Reuse existing patterns where sound; add only the missing components.
4. Implement in small, coherent changes.
5. Test narrow mobile, tablet and wide desktop; test keyboard and reduced motion.
6. Run the actual build and relevant automated checks.
7. Report files changed, evidence, untested cases and rollback considerations.

## Definition of done
A page is not complete merely because it renders. It must communicate the offer, support a trustworthy next action, use truthful evidence, preserve existing functionality, work responsively and pass the applicable acceptance gates.
