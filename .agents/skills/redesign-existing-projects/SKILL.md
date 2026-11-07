---
name: redesign-existing-projects
description: "Audits and improves existing River Ways pages and interfaces without replacing the approved direction or architecture. Use for redesign, polish, responsive fixes, visual QA, interaction improvements and code-quality reviews."
---

# Redesign existing River Ways projects

## Authority and safety
Read `AGENTS.md`, `docs/design/RIVER_WAYS_MASTER_DESIGN.md` and the design acceptance gates first. Preserve SHAPED CURRENT / Route 2 — Editorial Intelligence, the Creative Demand Engineering position and approved tokens. Do not import another brand's design values or restart route exploration.

Do not begin with a rewrite. Inspect first. Work on a topic branch. Do not change production DNS, deployment settings, secrets, lead data or integrations.

## Audit sequence
1. Confirm repository, branch, exact commit, working-tree state, PR ancestry and preview relationship.
2. Identify framework, routes, components, styles, dependencies, scripts and tests.
3. Inspect the actual page at mobile and desktop sizes when browser evidence is available.
4. Review content hierarchy, typography, spacing, color, composition, imagery, motion and interaction states.
5. Check navigation, links, forms, analytics, metadata, structured data, sitemap, robots and 404 behavior.
6. Review keyboard operation, focus visibility, contrast, zoom/reflow and reduced motion.
7. Review image sizes, font loading, JavaScript, layout shift and network/console failures.
8. Record findings with evidence, severity, user impact, risk and a focused proposed fix.

Separate verified defects from subjective opportunities. Do not claim a browser inspection, performance score or accessibility pass without evidence.

## Fix priority
Apply the highest-impact, lowest-risk changes first:
1. Broken functionality, misleading content and conversion blockers.
2. Privacy, security, accessibility and responsive failures.
3. Content clarity and information hierarchy.
4. Typography, composition, layout and spacing.
5. Image quality, crop, provenance and performance.
6. Motion and micro-interactions.
7. Fine visual polish.

Keep changes narrow. Do not migrate frameworks, replace routing, add a design system or introduce dependencies without a documented need.

## Required states
For every interactive feature, inspect the applicable default, hover, pressed, focus, disabled, loading, empty, error and success states. Errors must say what failed and what the user can do. Avoid inert controls, placeholder links and browser alert dialogs.

## Validation
- Run the relevant unit/API tests and production build.
- Check every affected route and unknown-path behavior.
- Test narrow mobile, tablet and wide desktop.
- Test keyboard navigation, visible focus and reduced motion.
- Check form behavior using synthetic data only; do not contact real customers.
- Compare before/after screenshots where available.
- Record actual performance and accessibility evidence; do not infer scores.

## Completion report
List the diagnosis, approved fixes, files changed, exact commit, commands and results, preview evidence, untested areas, known risks and rollback instructions. A passing build alone does not prove a successful redesign.
