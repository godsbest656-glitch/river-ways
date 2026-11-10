# River Ways — SHAPED CURRENT visual implementation

## Direction

The visual system is being developed as a living current, not a collection of effects. River Ways keeps its established sea/sky-blue identity, typography, content architecture and recognisable mark. Motion should express direction, depth and momentum; it must never compete with the proposition or make the site harder to use.

## Current implementation in this branch

- A lazy-loaded React Three Fiber scene adds a custom GLSL current surface behind the existing interactive hero cards.
- The shader uses restrained procedural flow, caustic highlights and deep-ocean/ice-blue colour values.
- The original SVG current remains in place as a graceful visual fallback if the WebGL layer cannot render.
- The current-stage cards receive translucent optical surfaces, blur, specular highlights and pointer-following light.
- The River Ways mark remains recognisable; its existing strokes receive a restrained draw-through animation on hover/focus.
- The earlier CSS scroll-linked motion and component depth refinements remain additive.
- The Three Fiber canvas is capped at device pixel ratio 1.5 and uses a low-power rendering preference.
- Reduced-motion preference stops shader time progression and disables the logo animation. Mobile opacity and blur are reduced.

## Dependency choice

The site is React 18. React Three Fiber v8 is selected because the official compatibility guidance pairs Fiber v8 with React 18; Fiber v9 is intended for React 19. The shader scene is code-split with React.lazy so it does not block the initial React entry chunk.

The liquid-glass treatment in this iteration is implemented as a small, project-owned CSS/pointer layer rather than adding an unverified third-party glass runtime. A dedicated liquid-glass library can be evaluated separately against browser compatibility, accessibility, bundle size and performance before adoption.

## Deliberately not done

- No replacement of the approved River Ways logo or core brand identity.
- No fabricated client work, testimonials, metrics or portfolio evidence.
- No autoplay video background or full-screen 3D world.
- No production deployment, DNS changes, Worker replacement or merge to main.
- No changes to enquiry handling, APIs, data storage or business operations.

## Verification status

This is an implementation candidate, not a certified release. The full CI suite, package audit, browser rendering and responsive visual review must run against this branch's exact head. The earlier successful CI run on the PromptedSite motion branch does not certify these new dependencies or shader changes.

## Review gates

1. Confirm npm installation and production build with the new React Three Fiber dependencies.
2. Check WebGL failure and context-loss fallback; the original SVG current must remain visible.
3. Review the hero at desktop, tablet and narrow mobile widths.
4. Verify reduced-motion mode, keyboard focus, touch interaction and contrast.
5. Measure initial bundle impact and runtime GPU cost; the R3F scene must remain a deferred chunk.
6. Check current Chrome, Safari and Firefox rendering before considering a liquid-glass library.
7. Keep this PR draft until all checks pass and the preview has been visually reviewed.
