---
name: figma-designer
description: "Creates and reviews River Ways design work in Figma using reusable variables, text styles, components, responsive frames and documented design foundations. Use only for tasks involving an actual Figma file."
---

# Figma designer for River Ways

## Mandatory prerequisites
Before any Figma MCP operation, load the installed `figma-use` skill. For full-page or screen creation, also load `figma-generate-design`. For token libraries or component systems, load `figma-generate-library`. This project skill does not replace those prerequisites.

## Project authority
Read root `AGENTS.md` and `docs/design/`. Preserve River Ways, Creative Demand Engineering, SHAPED CURRENT and Route 2 — Editorial Intelligence. Existing approved brand tokens and the current Figma library are authoritative. Do not impose sample colors, fonts or generic component systems from external references.

## Inspect before creating
1. Confirm the correct Figma file and page.
2. Inspect existing variables, modes, text styles, components and library assets.
3. Reuse existing assets where appropriate; do not duplicate foundations.
4. Identify missing foundations and propose only necessary additions.
5. Do not delete, move or overwrite existing work unless explicitly requested.

## Foundations
Use semantic variable names for color, spacing, radius and reusable values. Keep raw brand values separate from semantic usage where supported. Bind fills, strokes, text, spacing and radii to variables wherever supported. Keep Light and Dark modes coherent if the project uses both. Check font availability before applying a font.

## Components and layout
Create reusable components for repeated patterns. Interactive components should represent default, hover, pressed, focus and disabled states. Inputs should include error and filled states where relevant. Data views should include loading, empty and error states. Use Auto Layout for structured frames, meaningful layer names and constraints that survive resizing. Create desktop and mobile variants when required.

Avoid three equal cards as an automatic default. Choose layouts that fit the content and approved editorial direction.

## Content and assets
Use real, approved copy. Never invent client proof, performance metrics, testimonials or logos. Record asset source and licence information. Use clearly marked placeholders only when evidence is unavailable.

## Review checklist
- Existing library and file structure inspected.
- Variables and text styles reused or intentionally extended.
- Layers and components named meaningfully.
- Responsive behavior considered.
- Contrast, focus, touch target and state coverage checked.
- No unsupported claims or unlicensed assets.
- Screenshots or Figma evidence captured where available.
- Final report states what was created, changed, skipped and not verified.
