# River Ways — Design System Architecture

## Intent
Build a small, coherent design system that expresses the chosen creative route and can be maintained by humans and AI agents. This document defines the system shape, not final values.

## Source-of-truth layers
1. **Brand decisions** — approved route, logo rules, palette rationale, type choices, imagery and motion principles.
2. **Primitive tokens** — raw color, spacing, type, radius, border, shadow, timing, and layout values.
3. **Semantic tokens** — purpose-based aliases such as canvas, surface, text-primary, text-muted, border-subtle, accent, focus, success, warning, and danger.
4. **Component tokens** — component-specific values only when semantic tokens cannot express the requirement.
5. **Components and patterns** — reusable implementation with documented behavior and accessibility.
6. **Page composition** — authored layouts assembled from patterns, with freedom to vary composition where content needs it.

Never spread unexplained hex values, arbitrary spacing, or one-off animation timings throughout components. Use CSS custom properties as the runtime interface for design tokens.

## Suggested file organization
Adapt to the actual codebase rather than creating duplicate systems:
- `src/styles/tokens.css` — primitive and semantic custom properties.
- `src/styles/base.css` — reset, typography defaults, document-level rules.
- `src/styles/motion.css` — shared motion primitives and reduced-motion behavior.
- `src/components/` — reusable navigation, buttons, links, form controls, containers, and visual primitives.
- `src/sections/` — homepage/story sections with clear responsibilities.
- `src/assets/` — optimized local assets and documented provenance where practical.
- `docs/design/` — design decisions, specs, asset register, and visual QA evidence.

These are target patterns, not permission to reorganize blindly. First inspect existing source and choose the smallest migration that creates clarity.

## Token requirements
Define and document:
- Color: primitive palette, semantic roles, interaction states, contrast pairs.
- Typography: family, fallback stack, size/line-height scale, weights, measure, display behavior, responsive clamp rules.
- Space: consistent scale and section rhythm.
- Layout: max-widths, page gutters, grid, columns, breakpoints and overflow behavior.
- Shape/material: borders, radii, shadows, texture and surface treatments tied to the route.
- Motion: duration, easing, distance, stagger limits, interaction triggers, reduced-motion alternatives.
- Layering: intentional z-index scale for navigation, overlays, dialogs, and floating elements.
- Focus and states: visible focus, hover, active, disabled, loading, error, success, selected.

Use semantic tokens for content meaning. A component should not choose a random brand color because it looks good locally.

## Component principles
- Build components around meaningful patterns, not every HTML element.
- Keep APIs small and predictable.
- Prefer semantic HTML and native controls where suitable.
- Separate content from presentation when it improves reuse and content accuracy.
- Keep interaction state explicit; avoid brittle DOM querying and animation hacks.
- Design every component for empty, error, loading, long-content, keyboard, touch, and reduced-motion cases where applicable.
- Avoid a card component becoming the default answer to every layout problem.
- Avoid a homegrown abstraction when a native CSS layout or platform primitive is simpler.

## Motion and media
- Motion communicates transition, causality, hierarchy, or feedback.
- Respect reduced-motion at both CSS and JavaScript levels.
- Avoid continuous animation that drains battery, causes distraction, or competes with text.
- Use responsive art direction, optimized formats, explicit dimensions/aspect ratios, lazy loading where appropriate, and poster/fallback assets for video.
- Any canvas, WebGL, 3D, or video-based storytelling must have a meaningful static/DOM fallback and must not contain the only copy of important information.

## Content and layout system
Define reusable rules for section introductions, editorial grids, case-study storytelling, proof blocks, service explanations, diagnostic/engagement pathways, FAQs, forms, and calls to action. Allow bespoke compositions where they create meaningful distinction.

## Governance
- Record major decisions in a short design decision record: context, options, decision, rationale, trade-offs, owner, date, and revisit trigger.
- Update tokens and component docs when the implementation changes.
- No token value is considered brand-approved merely because it appears in a prototype.
- Avoid adding a large component library or animation dependency without a documented benefit and cost.
