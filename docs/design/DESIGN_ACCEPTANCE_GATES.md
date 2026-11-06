# Design acceptance gates

A visual change is not ready because it looks attractive in one screenshot. It must preserve function, communicate clearly, work across devices and be verifiable.

## Gate 1 — Direction
- Uses approved SHAPED CURRENT / Route 2 — Editorial Intelligence decisions.
- Has a documented visitor problem and clear design rationale.
- Does not imitate reference artwork or introduce rejected visual directions.

## Gate 2 — Content and trust
- No invented customers, case studies, testimonials, awards, metrics, prices or guarantees.
- Every material claim has evidence or is clearly marked as requiring evidence.
- Primary and secondary actions have accurate labels and working destinations.

## Gate 3 — Function
- Existing routes, 404 behavior, enquiry capture, analytics and metadata remain intact.
- Every interactive control works by keyboard and pointer/touch.
- Relevant loading, empty, error and success states are present.

## Gate 4 — Accessibility and responsive quality
- Semantic landmarks and meaningful accessible names are used.
- Keyboard focus is visible; color is not the only state indicator.
- Contrast is checked, text remains readable and layouts do not overflow at 390px.
- Reduced-motion preferences are respected.

## Gate 5 — Performance and assets
- Images have verified source and licence records, responsive sizes and intentional crops.
- No avoidable layout shift, oversized media or unnecessary dependencies.
- Motion uses performant properties and does not obstruct reading.

## Gate 6 — Verification
- Relevant automated tests and production build pass.
- Affected routes are checked.
- Desktop and mobile preview evidence is captured for visual changes.
- Report what was tested, what was not tested, known limitations and rollback steps.

## Release decision
Any failure in function, security, accessibility, evidence integrity or production safety blocks release. A preview build is not production approval. Production deployment or domain changes require explicit authorization.
