# River Ways — Design Acceptance Gates

Use this checklist for design proposals, prototypes, and shipped page work. Mark each item **Pass**, **Fail**, or **Not tested** with evidence. Do not infer a pass from intention or a successful build.

## Gate A — Strategic fit
- [ ] The page states a clear visitor/business problem and intended outcome.
- [ ] The design reflects the approved creative route and River Ways' Demand Engineering position.
- [ ] The experience is distinct from a generic agency/SaaS template.
- [ ] Every major section has a clear narrative or task purpose.
- [ ] No unverified proof, claim, client result, testimonial, or capability is introduced.

## Gate B — Comprehension and conversion
- [ ] A first-time visitor can understand what River Ways does without decoding internal jargon.
- [ ] Primary and secondary calls to action are distinguishable and contextually useful.
- [ ] Navigation labels describe their destinations.
- [ ] The visitor can progress from positioning to offer, proof, and contact without dead ends.
- [ ] Forms explain required information, errors, submission state, and next steps.
- [ ] Enquiry submission works end-to-end in the target preview when it is in scope.

## Gate C — Visual quality
- [ ] Composition has intentional hierarchy, scale, rhythm, and whitespace.
- [ ] Typography is tested with actual copy, not only short specimen words.
- [ ] Color decisions are documented and contrast checked.
- [ ] Images and visual assets support the story and have verified provenance/license.
- [ ] Layouts avoid repetitive card grids and ornamental elements without purpose.
- [ ] Desktop and mobile are both art-directed.

## Gate D — Accessibility and resilience
- [ ] Semantic landmarks and heading order are sensible.
- [ ] All interactive elements work by keyboard and expose accessible names/states.
- [ ] Focus is visible; focus is not obscured by sticky UI.
- [ ] Text and meaningful UI contrast meet WCAG 2.2 AA targets.
- [ ] Zoom/reflow and long-content cases remain usable.
- [ ] Reduced-motion mode is respected.
- [ ] Meaningful content remains available if motion, video, canvas, or third-party assets fail.
- [ ] Forms have associated labels and actionable error feedback.

## Gate E — Performance and technical quality
- [ ] Production build and available tests were run and their results recorded.
- [ ] Images/video are optimized and dimensions/aspect ratios prevent layout shift.
- [ ] No unnecessary dependency or large client bundle was added without rationale.
- [ ] No console errors or unexplained network failures remain in the tested flow.
- [ ] Animation is bounded, interruptible where appropriate, and does not block primary tasks.
- [ ] Metadata, canonical URLs, structured data, sitemap and robots behavior remain correct for the verified deployment.
- [ ] Analytics and consent behavior are not duplicated or silently altered.

## Gate F — Privacy, trust and release
- [ ] No secrets or private data appear in code, screenshots, logs, or documentation.
- [ ] Analytics/marketing data collection matches the current privacy and consent approach.
- [ ] No production DNS, email, routing, or deployment change occurred without separate approval.
- [ ] Preview URL and tested commit are recorded.
- [ ] Known limitations and untested cases are stated.
- [ ] Human review has approved identity-level decisions and the release candidate.

## Gate outcomes
- **Exploration ready:** research and competing routes are documented; no production-quality claim is implied.
- **Prototype ready:** representative views are implemented and tested enough to compare routes.
- **Implementation ready:** route, information architecture, tokens, and core patterns are approved for expansion.
- **Release candidate:** all applicable gates pass with evidence; no critical accessibility, security, conversion, or functional defects remain.
- **Blocked:** any critical gate fails or a required owner decision remains unresolved.

A checklist without evidence is not a pass. Record any accepted exception, rationale, owner, and revisit date.

## Current route-specific gates

Evaluate all creative work against the approved SHAPED CURRENT / Route 2 — Editorial Intelligence direction and the “We engineer demand.” positioning. Do not fail a design because it does not match an old unapproved route hypothesis, and do not reopen route selection as part of routine refinement.

Additional checks for this implementation:
- [ ] The first screen communicates what River Ways does, who it helps, and the next step without requiring animation to finish.
- [ ] The hero's visual system is distinctive and purposeful; layered cards/3D/motion are not decorative obstacles.
- [ ] Blue palette roles are consistent and every text/control/focus state meets WCAG 2.2 AA contrast requirements where applicable.
- [ ] Typography remains legible and responsive at narrow widths; font delivery is resilient if remote fonts fail.
- [ ] All interactive hero cards, menus, accordions, selectors, and forms work by keyboard and touch, with visible focus and meaningful accessible names.
- [ ] Reduced-motion users receive a complete, intentional static/low-motion experience.
- [ ] The site remains useful on mid-range mobile devices and imperfect connections; no unnecessary heavy 3D or video blocks core content.
- [ ] Creative Studio and portfolio claims distinguish verified client work from internal demonstrations and concepts.
- [ ] Every primary CTA leads to a working route or verified action; no decorative/inert controls.
- [ ] Contact submission is tested end-to-end in Preview, including server-side validation, D1 persistence, attribution, spam controls, and notification configuration. A generic 4xx probe alone does not prove successful lead delivery.
- [ ] Exact preview commit is confirmed and inspected in a real browser at desktop, tablet, and mobile sizes.

A build pass is not a preview pass. A preview deployment is not an enquiry-service pass. An enquiry endpoint responding is not proof of persistence or notification. Mark each as Pass, Fail, or Not tested with evidence.
