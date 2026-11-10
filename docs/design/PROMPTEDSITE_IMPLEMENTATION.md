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

- GitHub Actions `River Ways checks` passed on commit `2a4f772a6dae0537c2d2a939239b7c4517db21ed` (run `42878580915`): dependency installation, production build, browser journeys/accessibility, Lighthouse, enquiry API, portfolio tests, public portfolio validation, D1 migration validation, skill tests and dependency audit.
- The separate project-skill validation workflow also passed on that commit (run `42878580930`).
- Lighthouse did report a homepage performance warning: score 0.54 against a 0.60 assertion, LCP 4.60s against 4.0s, and TBT 3.96s against 0.50s. The workflow completed successfully because these are configured warnings, not hard failures.
- The build emitted a 839.06 kB minified / 225.45 kB gzip `LiquidCurrent` chunk. The scene was code-split but still requested immediately because the lazy component mounted with the hero.
- A follow-up optimization now delays importing the 3D scene until the hero is engaged or 3.6 seconds after mount, reduces the plane mesh from 96×96 to 48×48 segments, and pauses the renderer when the canvas is offscreen. This follow-up is not yet covered by CI.
- Browser preview, visual review, and context-loss testing remain outstanding. This is not a certified release.

## Review gates

1. Confirm npm installation and production build with the new React Three Fiber dependencies.
2. Check WebGL failure and context-loss fallback; the original SVG current must remain visible.
3. Review the hero at desktop, tablet and narrow mobile widths.
4. Verify reduced-motion mode, keyboard focus, touch interaction and contrast.
5. Measure initial bundle impact and runtime GPU cost; the R3F scene must remain a deferred chunk.
6. Check current Chrome, Safari and Firefox rendering before considering a liquid-glass library.
7. Keep this PR draft until all checks pass and the preview has been visually reviewed.
