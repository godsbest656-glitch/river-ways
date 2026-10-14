# River Ways — Creative interaction direction

## Intent
The website should demonstrate River Ways' ability to connect strategy, discovery and digital experiences through a distinctive, responsive visual system. Motion is part of the brand expression, not decoration added after layout.

## Visual language
- Deep forest and mineral green establish depth; restrained acid-lime accents identify signals and moments of action.
- Flowing contour lines communicate systems, movement, direction and connected forces without literal river illustrations.
- Editorial typography and compact technical annotations balance emotion with strategic clarity.
- The visual field uses SVG and CSS so it remains crisp, lightweight and independent of a remote image or WebGL runtime.

## Interaction principles
- Pointer movement creates subtle parallax in the hero field on mouse/trackpad devices.
- Contour paths, signal bars and nodes move at different speeds to suggest connected systems.
- Section reveals trigger only as content enters view and stop observing once revealed.
- Service cards use restrained image motion and elevation to reward exploration.
- Navigation, forms and service content remain available without animation.

## Accessibility and performance
- Respect `prefers-reduced-motion`; reveal content immediately when motion is reduced.
- Disable pointer parallax on touch devices.
- Keep the main message and calls to action visible without waiting for animation.
- Use IntersectionObserver rather than continuous scroll listeners.
- Avoid adding a runtime animation dependency until a concrete interaction requires one.
- Keep all meaningful copy in HTML, not inside SVG imagery.

## Implementation notes
- Stack remains React + Vite + plain CSS.
- The interactive hero uses inline SVG and CSS custom properties.
- MotionSite.ai is a reference and exploration resource, not a production dependency.
- Future work can evaluate Motion for React or GSAP for more complex timelines, but should avoid overlapping animation engines.
