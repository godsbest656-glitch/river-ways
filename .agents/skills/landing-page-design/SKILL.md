---
name: landing-page-design
description: "Plans and builds conversion-focused River Ways web pages. Use for homepage sections, campaign pages, service pages, page copy, responsive layouts, prototypes and conversion reviews."
---

# Landing page design for River Ways

## Authority
Read root `AGENTS.md` and `docs/design/` first. Those files and approved project decisions override this skill. Preserve SHAPED CURRENT, Route 2 — Editorial Intelligence, the approved “We engineer demand.” headline, existing project tokens and the current React + Vite architecture. Never import another brand's palette, typography or component styling as a default.

## Strategy before layout
Establish:
- The page's audience and intent.
- The problem and outcome the page addresses.
- The primary conversion action and its actual destination.
- The evidence supporting each material claim.
- The visitor's likely objections and information needs.
- The page's search intent and indexation requirements.

Do not force a multi-intent agency homepage into a single-offer landing-page formula. Keep one dominant hero action, while making distinct audience journeys easy to discover. Ask only for missing facts that materially affect the work; otherwise state a conservative assumption and proceed.

## Page argument
Build a coherent sequence: clear proposition, explanation of the method, relevant capabilities, credible proof, process, objection handling and a clear next step. Choose section patterns based on the content. Avoid formulaic equal-card grids and generic agency filler.

## Hero direction
For the approved River Ways homepage, use the user's centred editorial reference as a composition cue:
- Centred, confident headline with deliberate line breaks.
- Concise supporting explanation.
- One primary action and one visually quieter secondary route.
- Credibility only when independently supported.
- A purposeful visual field or gallery beneath the copy, showing real capabilities and verified work.
- Responsive composition that remains legible and useful at narrow widths.

Do not copy the reference's brand, assets, exact layout or proprietary artwork.

## Conversion and content
- Write outcome-led, specific copy. Avoid vague claims such as “unlock growth” or “transform your business”.
- Place evidence beside the claim it supports.
- Never invent clients, logos, testimonials, numbers, awards, prices, guarantees, case studies or delivery capabilities. Use an explicit evidence-needed marker where proof is missing.
- Every CTA must have a real destination and a clear expected result. No dead links or decorative buttons.
- Match page messaging to the visitor's likely source and intent.
- Use plain-language FAQs where they reduce genuine buying friction.

## Visual and interaction quality
- Use the existing approved token system; do not invent one-off values.
- Use semantic landmarks, descriptive alt text, visible keyboard focus and accessible contrast.
- Provide hover, pressed, focus, disabled, loading, empty, error and success states where applicable.
- Motion must clarify hierarchy or interaction. Respect reduced-motion preferences and provide touch/keyboard equivalents.
- Avoid layout shifts, unoptimised media and unnecessary client-side JavaScript.

## Implementation sequence
1. Inspect current route, components, styles, dependencies and tests.
2. Present the page argument, hero copy, CTA behavior, proof gaps and section outline.
3. Implement the hero first, then proceed section by section.
4. Test at 390px, tablet and wide desktop; test keyboard and reduced motion.
5. Run the build and relevant route, form and accessibility checks.
6. Report changed files, test evidence, unverified items and rollback considerations.

## Definition of done
A page is not complete because it renders. It must communicate the offer, provide a trustworthy next action, use verified proof, preserve existing functionality, work responsively and pass the available automated and manual checks.
