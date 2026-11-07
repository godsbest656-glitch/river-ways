---
name: figma-designer
description: "Creates and reviews River Ways design work in an existing Figma file using reusable variables, text styles, components, responsive frames and documented design foundations. Use only for tasks involving an actual Figma file."
---

# Figma designer for River Ways

## Mandatory tool prerequisites
Before any Figma MCP operation, load the installed `figma-use` skill. For full-page or screen creation, also load `figma-generate-design`. For tokens, variables or component libraries, also load `figma-generate-library`. This project skill does not replace those prerequisites.

## Project authority
Read `AGENTS.md`, `docs/design/RIVER_WAYS_MASTER_DESIGN.md` and the current design-system documentation. Preserve River Ways, Creative Demand Engineering and SHAPED CURRENT / Route 2 — Editorial Intelligence. Existing approved Figma variables, text styles and code tokens are authoritative. Do not import sample values from upstream skill repositories.

## Inspect before creating
1. Confirm the correct Figma file, page and target frames.
2. Inspect existing variables, modes, text styles, components and library assets.
3. Reuse suitable foundations; do not duplicate or rename established tokens casually.
4. Identify gaps and propose only necessary additions.
5. Do not delete, move or overwrite existing work without explicit instruction.

## Foundations and components
- Use semantic names for color, spacing, radius, typography and reusable values.
- Bind fills, strokes, text and layout properties to existing variables where supported.
- Check font availability before applying a font.
- Use Auto Layout and meaningful layer names for maintainable structure.
- Build reusable components for repeated patterns.
- Include relevant hover, pressed, focus, disabled, filled, error, loading, empty and success states.
- Create desktop and mobile variants where the page requires them.
- Avoid treating three equal cards as the default layout.

## Content, accessibility and assets
Use approved copy and verified evidence. Never invent client proof, performance metrics, testimonials or logos. Record source and license details for images, video, illustrations and fonts. Check contrast, focus, touch target size and responsive behavior. Motion prototypes must have a reduced-motion alternative.

## Review checklist
- Correct file and page confirmed.
- Existing variables and library assets inspected and reused.
- Components and layers named meaningfully.
- Responsive behavior considered.
- Contrast, focus, touch targets and states checked.
- No unsupported claims or unlicensed assets.
- Screenshots or Figma evidence captured where available.
- Final report states what changed, what was skipped and what was not verified.
