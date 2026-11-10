# PromptedSite-inspired experience layer

## Decision

Adopt interaction techniques, not PromptedSite's visual identity or template-marketplace structure. River Ways remains the SHAPED CURRENT / sea-sky-blue direction and keeps its existing content, information architecture, portfolio evidence and conversion journey.

## Implemented in this branch

- Progressive 3D depth on the existing current-stage cards.
- Scroll-linked movement for the existing river field, grid and card composition where CSS view timelines are supported.
- A restrained kinetic reveal for the hero's emphasized word.
- Subtle hover lift for existing service, pathway and output cards.
- Explicit reduced-motion overrides.
- No new runtime dependency, WebGL bundle, external asset, analytics call or backend behaviour.

## Graceful degradation

The existing static composition remains the fallback. Scroll-linked effects are gated by `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Existing IntersectionObserver section reveals remain unchanged.

## Not included

- No replacement of River Ways' logo, palette, typography or brand language.
- No fabricated client work, testimonials, metrics or portfolio material.
- No heavy Three.js scene or video background.
- No production deployment, DNS changes, Worker replacement or merge to `main`.

## Verification required before release

1. Run the repository's full build and test commands on this branch.
2. Review at desktop, tablet and narrow mobile widths.
3. Verify keyboard focus and touch interaction for current-stage cards.
4. Verify reduced-motion mode disables all newly introduced motion.
5. Check scroll-linked behaviour in supported browsers and confirm static fallback elsewhere.
6. Run accessibility and performance checks on the isolated preview before any production decision.
