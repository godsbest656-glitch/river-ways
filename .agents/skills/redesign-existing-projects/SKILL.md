---
name: redesign-existing-projects
description: "Audits and improves existing River Ways pages and interfaces without replacing the project's architecture or approved design direction. Use for redesign, polish, visual QA, responsive fixes, interaction and code-quality reviews."
---

# Redesign existing River Ways projects

## Authority and safety
Read root `AGENTS.md` and the complete `docs/design/` governance set before work. These are authoritative. Preserve SHAPED CURRENT, Route 2 — Editorial Intelligence, the approved brand decisions and current project tokens. Never import upstream sample colors, font preferences or design defaults over River Ways decisions.

Do not start by rewriting the page. Inspect first. Do not alter production, DNS, deployment settings, credentials, lead data or integrations. Work on a reviewable topic branch and retain a rollback path.

## Audit sequence
1. Establish the exact branch, commit, worktree status and deployment relationship.
2. Identify framework, styling method, routes, components, dependencies and test commands.
3. Capture the current page at mobile and desktop sizes where browser access exists.
4. Inspect content hierarchy, typography, spacing, color, composition, imagery, interaction states, accessibility, performance and responsive behavior.
5. Check forms, analytics, SEO metadata, navigation, 404 handling and existing route behavior.
6. Record each issue with evidence, severity, user impact, risk and a focused proposed fix.

Report the diagnosis before editing. Separate verified defects from subjective opportunities. Do not claim a browser inspection if no browser evidence exists.

## Design review
Look for generic or repetitive layouts, weak hierarchy, inconsistent rhythm, unnecessary cards, poor alignment, unhelpful motion, unclear CTAs, missing states, low contrast, inaccessible controls and unverified visual claims. Prefer meaningful composition and content-led layouts over arbitrary novelty.

Use the project's existing design tokens. Do not invent fonts, colors, spacing, radii or motion curves. If the approved system lacks a required value, propose a token change with rationale rather than silently adding an isolated value.

## Fix priority
Prioritise in this order:
1. Broken functionality, misleading content and conversion blockers.
2. Accessibility, keyboard operation, contrast and responsive failures.
3. Typography and hierarchy.
4. Composition, layout and spacing.
5. Imagery, crop, provenance and performance.
6. Motion and micro-interactions.
7. Fine visual polish.

Keep changes narrow and reviewable. Do not migrate frameworks or add dependencies without a documented need and approval.

## Required states
For each interactive feature, inspect default, hover, pressed, focus, disabled, loading, empty, error and success states as relevant. Errors must explain what failed and what the user can do. No dead links, placeholder buttons or browser alert dialogs.

## Validation
- Run the relevant unit tests and production build.
- Check all affected routes and unknown-path behavior.
- Test 390px, tablet and wide desktop layouts.
- Test keyboard navigation, visible focus and reduced motion.
- Check forms and enquiry behavior without sending real customer data.
- Compare before and after screenshots when available.
- Record performance and accessibility evidence; do not infer scores.

## Completion report
List the diagnosis, approved fixes, files changed, commands and results, preview evidence, what was not tested, known risks and rollback instructions. A successful build alone is not proof of a successful redesign.
