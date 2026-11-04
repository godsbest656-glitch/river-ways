# River Ways — SHAPED CURRENT experience constitution

**Status:** Working design authority for the website redesign  
**Brand:** River Ways  
**Positioning:** Creative Demand Engineering  
**Primary domain:** https://riverwayse.com/

This document turns the approved brand direction and website goals into implementation rules. It governs the homepage and the existing public utility pages. It does not authorize new routes, unverified portfolio claims, or production infrastructure changes.

## 1. Commercial purpose

The site must help a suitable prospect understand, within seconds:

1. River Ways connects strategy, creative, digital experiences and growth systems.
2. The work is designed to make demand more coherent—from market attention to customer action.
3. The offer can be shaped around founders, growing teams and established organisations.
4. There is a clear, low-friction way to begin a useful conversation.

The primary conversion is a qualified project enquiry. Visual novelty is subordinate to comprehension, trust, accessibility and action.

## 2. Brand and visual direction

**SHAPED CURRENT** is the approved website expression. Use a sea/sky-blue system, not the former forest/lime or terracotta/near-black/warm-parchment systems.

| Token | Value | Use |
|---|---|---|
| Deep current | `#06243A` | Primary dark surface, footer, strong CTA |
| Deep blue | `#092F49` | Secondary dark surface |
| Current blue | `#168BB7` | Primary accent, links, focus |
| Signal blue | `#087DA8` | Accent on light surfaces |
| Sky | `#A9E8F7` | Highlight, dark-surface CTA |
| Ice | `#E8F7FB` | Selected and soft surfaces |
| Paper | `#F5FBFD` | Main light background |
| Ink | `#102B3C` | Main text |
| Muted | `#587181` | Supporting text |
| Line | `#D8E8EF` | Borders and dividers |

Typography uses **Manrope** for clear interface and body text, paired with **Newsreader** for restrained editorial emphasis. Fonts are loaded once from the document head, not repeatedly imported in component styles.

The current mark is provisional and must not become a redesign dependency. Keep its geometry intact unless separately approved; palette alignment is allowed.

## 3. The River Ways idea

The River is not a decorative wave motif. Its meaning is a connected system:

- The River has a way.
- The River has a life.
- The River has an environment.
- The River understands seasons and people.
- People are ecosystems the River is part of; some depend on it for survival.
- Life forms.
- The River's end goal is the ocean.

Translate this into useful strategic language: understand the environment, respect context and timing, connect the parts that sustain progress, and keep the wider destination in view. Do not reduce the philosophy to stock river photography, droplets, generic wave lines or vague nature copy.

## 4. Experience architecture

The current repository's verified public page inventory is:

- `/` — agency homepage
- `/growth-diagnostic/` — self-guided assessment
- `/privacy/` — privacy notice

Unknown routes must return HTTP 404. Do not invent or imply additional routes or the presence of an unavailable multiroute bundle.

The homepage narrative is ordered for comprehension and conversion:

1. Positioning and primary action.
2. The disconnected-growth problem.
3. Connected capabilities.
4. Audience pathways.
5. Demand Intelligence explanation and workflow.
6. Method and practical outputs.
7. River Ways point of view.
8. Questions and objections.
9. Enquiry form and direct email fallback.

Do not publish client names, testimonials, performance figures or case-study claims unless evidence and permission are available. Describe deliverables and methods honestly when proof is not yet publishable.

## 5. Interaction and motion

Motion must clarify structure, create a sense of progression or reward exploration. It must not delay the proposition or conceal the next action.

- The hero's layered current cards are keyboard-operable buttons with visible active state.
- Pointer parallax is a progressive enhancement, never a requirement.
- Touch devices receive a stable composition without pointer-dependent behavior.
- Reduced-motion preferences disable non-essential animation and smooth scrolling.
- Workflow controls expose their selected state and update a clearly labelled content region.
- No autoplay sound, forced modal, hover-only content or blocking cinematic intro.

A more elaborate WebGL or fly-over sequence is only justified if it improves the story and passes mobile performance, accessibility and fallback tests.

## 6. Conversion and content rules

- Use one dominant action in each context; secondary links should have a clear purpose.
- Explain what a service changes for the buyer, not only what the agency does.
- Make the next step predictable and the form proportionate to the conversation.
- Never use fake scarcity, invented client proof, guaranteed outcomes or misleading automation claims.
- Demand Intelligence is described as public-signal discovery and human-reviewed follow-up; source coverage depends on access, platform policies, language and integrations.
- Do not imply that a build or preview proves the enquiry service is operational.

## 7. Accessibility and resilience

Target WCAG 2.2 AA. At minimum:

- Semantic landmarks, ordered headings, descriptive link names and meaningful image alt text.
- Full keyboard operation and clearly visible focus.
- Sufficient text and control contrast.
- Responsive reflow at narrow widths without horizontal overflow.
- Usable touch targets and form labels.
- Honest validation, success and failure states.
- Reduced-motion support.
- Useful static content and graceful behavior when an enhancement is unavailable.

## 8. Performance and technical stewardship

- Preserve React 18 + Vite 6 and Cloudflare Pages unless evidence justifies a change.
- Avoid adding a 3D dependency solely for spectacle.
- Use optimised, licensed assets with meaningful alt text and recorded provenance.
- Prevent layout shift and avoid loading unnecessary assets above the fold.
- Preserve the existing D1/Resend enquiry architecture and migrations; do not replace it with a mailto-only form.
- Keep secrets server-side. Never commit API keys, salts or private customer data.
- Verify the deployed commit, not merely a successful build or deployment command.

## 9. Release acceptance gates

A release is not complete until all are true:

- Build, API tests and dependency audit pass on the exact candidate commit.
- Desktop and mobile preview are inspected; no critical visual, navigation or content defects remain.
- Existing routes return their intended documents; unknown paths return 404.
- Enquiry preview has the D1 binding, migrations and rate-limit secret configured.
- A controlled preview enquiry creates one correct D1 record and delivers a real notification to the intended inbox.
- Duplicate handling, validation, rate limiting and failure states are verified.
- Metadata, canonical, sitemap, robots and security headers are checked.
- Keyboard, reduced motion, responsive behavior and image loading are checked.
- Production deployment is authorized, the exact commit is served by the Pages hostname and canonical domain, and post-deploy smoke checks pass.

**Decision hierarchy:** truth and safety → visitor comprehension → conversion clarity → accessibility and performance → brand distinctiveness → technical spectacle.
