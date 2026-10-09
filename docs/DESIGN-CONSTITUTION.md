# River Ways design constitution

## Purpose

The interface should make River Ways feel like a thoughtful Demand Engineering partner: visually literate, commercially clear, editorial rather than templated, and trustworthy. Design is part of the explanation—not decoration added after the fact.

## Principles

1. **Composition before effects.** Establish hierarchy, grid, rhythm, and whitespace before adding shadows, textures, or animation.
2. **Paper as a metaphor, not a gimmick.** Use warm editorial surfaces, fine borders, layered cards, and restrained shadows where they clarify structure. Do not simulate paper on every element.
3. **Contrast earns attention.** Keep the forest/ink palette and lime accent for meaningful emphasis. Maintain readable contrast and avoid using color alone to convey status.
4. **One clear next step.** Each section should help a visitor understand the problem, evaluate the approach, or take an appropriate action.
5. **Evidence over theatre.** Never display invented live signals, client logos, performance metrics, testimonials, or claims. Mark examples and prototype data clearly.
6. **Motion explains state.** Use short transitions for orientation and feedback. Honor prefers-reduced-motion; no essential information may depend on animation.
7. **Responsive by design.** Preserve hierarchy and tap targets on small screens; avoid horizontal overflow and hover-only interactions.
8. **Accessible by default.** Semantic landmarks, ordered headings, keyboard-visible focus, descriptive link labels, form labels, and useful error messages are requirements.
9. **Performance is a design constraint.** Prefer CSS and small SVGs to large libraries, heavy video, and decorative image payloads.
10. **Keep the stack boring.** React + Vite remains the marketing-site foundation. A design reference or authoring skill must not become a production runtime dependency without a concrete requirement.

## Initial design tokens

The current application CSS remains the source of truth for existing component values. These semantic tokens are the intended direction for new components:

- Forest / primary dark: #101c18
- Ink / primary text: #18221c
- Paper / page surface: #f7f8f4
- Soft paper / raised surface: #fbfcf9
- Muted green / secondary text: #69756e
- Lime / action accent: #d7fb69
- Olive / editorial emphasis: #698743
- Hairline / borders: #dfe4d9

Use the existing DM Sans and Manrope font families until a deliberate typography review justifies a change. Avoid introducing more font families by default.

## Component rules

- Cards should have a purpose, consistent internal spacing, and a restrained border; use elevation only to clarify interaction or hierarchy.
- Buttons must have visible focus states and a minimum comfortable touch target.
- Tabs must expose selected state and keyboard-operable controls.
- Use details/summary for simple disclosures when it offers a simpler, more robust interaction.
- Do not add parallax, cursor effects, or scroll hijacking.
- External image sources must be reviewed for licensing, stability, performance, and privacy. Prefer optimized, locally hosted approved assets for production.

## Acceptance checklist

- [ ] No fabricated metrics or fake real-time activity.
- [ ] Mobile layout works at 320px and up.
- [ ] Keyboard-only use is possible.
- [ ] Reduced-motion preference is respected.
- [ ] Color contrast and focus indicators are checked.
- [ ] Images have useful alt text or are decorative.
- [ ] Build succeeds and browser console has no errors.
- [ ] Cloudflare response headers are verified on a deployed preview.
