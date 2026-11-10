# PromptedSite-inspired experience layer

## Decision

Adopt interaction techniques, not PromptedSite's visual identity or template-marketplace structure. River Ways remains the SHAPED CURRENT / sea-sky-blue direction and keeps its existing content, information architecture, portfolio evidence and conversion journey.

## Implemented in this branch

- Scroll-linked movement for the existing river field, grid and card composition where CSS view timelines are supported.
- Restrained kinetic reveal for the hero's emphasized word.
- Additive depth and focus treatments on the existing interactive current cards; existing pointer-driven transforms are preserved.
- Subtle lift for the real homepage components: service feature cards, compact service cards, pathway cards and output items.
- Visible keyboard focus treatment for interactive current cards and key links.
- Explicit reduced-motion overrides.
- No new runtime dependency, WebGL bundle, external asset, analytics call or backend behaviour.

## Graceful degradation

The existing static composition remains the fallback. Scroll-linked effects are gated by `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Hover/depth transitions are also gated by the motion preference. Existing IntersectionObserver section reveals remain unchanged. Motion additions use the independent CSS `translate` property where possible so they do not overwrite the homepage's existing card transforms.

## Verification evidence

- The initial implementation commit passed the repository's GitHub Actions checks: production build, browser journeys/accessibility, Lighthouse performance and SEO baseline, enquiry API tests, portfolio tests (51 passing), public portfolio validation and dependency audit (zero vulnerabilities).
- A follow-up CSS refinement aligned selectors with the actual React component classes and preserved the existing card transforms. This follow-up commit requires its own CI run before the package can be considered fully verified.
- The passing run is evidence for the initial commit only; it must not be represented as verification of the later CSS refinement.

## Not included

- No replacement of River Ways' logo, palette, typography or brand language.
- No fabricated client work, testimonials, metrics or portfolio material.
- No heavy Three.js scene or video background.
- No production deployment, DNS changes, Worker replacement or merge to `main`.

## Release gates

1. Run the full build and CI suite against the latest PR head.
2. Review at desktop, tablet and narrow mobile widths.
3. Verify keyboard focus and touch interaction for current-stage cards.
4. Verify reduced-motion mode disables all newly introduced motion.
5. Check scroll-linked behaviour in supported browsers and confirm static fallback elsewhere.
6. Run accessibility and performance checks on the isolated preview before any production decision.
