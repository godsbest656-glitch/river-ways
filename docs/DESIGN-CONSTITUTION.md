# River Ways design constitution

## Purpose

The interface should make River Ways feel like a thoughtful Demand Engineering partner: visually literate, commercially clear, editorial rather than templated, and trustworthy. Design is part of the explanation—not decoration added after the fact.

The core idea is **a current shaped by conditions**. Water is the originating metaphor, but the identity should express the larger system around it: pressure, direction, convergence, resistance, judgement and movement. Avoid literal wave icons, generic growth arrows, stock river photography and decorative technology theatre.

## Principles

1. **Composition before effects.** Establish hierarchy, grid, rhythm, and whitespace before adding shadows, textures, or animation.
2. **A metaphor with a job.** Use channels, contours, convergence and directional flow to explain a system or create visual recognition. Never add a river motif where it does not communicate anything.
3. **Paper as a metaphor, not a gimmick.** Use warm editorial surfaces, fine borders, layered cards, and restrained shadows where they clarify structure. Do not simulate paper on every element.
4. **Contrast earns attention.** Deep forest anchors the experience; warm paper makes it readable; terracotta signals points of emphasis; ochre marks direction and action. Avoid turning every section into a bright accent.
5. **One clear next step.** Each section should help a visitor understand the problem, evaluate the approach, or take an appropriate action.
6. **Evidence over theatre.** Never display invented live signals, client logos, performance metrics, testimonials, or claims. Mark examples and prototype data clearly.
7. **Motion explains state.** Use short transitions for orientation and feedback. Honor prefers-reduced-motion; no essential information may depend on animation.
8. **Responsive by design.** Preserve hierarchy and tap targets on small screens; avoid horizontal overflow and hover-only interactions.
9. **Accessible by default.** Semantic landmarks, ordered headings, keyboard-visible focus, descriptive link labels, form labels, and useful error messages are requirements.
10. **Performance is a design constraint.** Prefer CSS and small SVGs to large libraries, heavy video, and decorative image payloads.
11. **Keep the stack boring.** React + Vite remains the marketing-site foundation. A design reference or authoring skill must not become a production runtime dependency without a concrete requirement.

## Visual system

### Colour

| Token | Value | Role |
|---|---|---|
| Deep forest | `#171D1A` | Primary dark field, navigation CTA, high-contrast sections |
| Ink | `#1B211E` | Primary text on light surfaces |
| Mineral paper | `#F4F0E7` | Default page and editorial background |
| Raised paper | `#F7F3EB` | Cards and contained reading surfaces |
| Terracotta | `#C65C3A` | Brand signal, important emphasis, visual signature |
| Warm ochre | `#E8B76D` | Primary action, light-on-dark emphasis, directional highlight |
| Muted ink | `#6F756D` | Secondary copy on light surfaces |
| Hairline | `#DED8CC` | Borders, separators and quiet structure |

Terracotta and ochre are accents, not body-text defaults. Check contrast for every foreground/background pairing; never use colour alone to communicate success, error or selection.

### Typography

- **Manrope** carries display headlines and high-level section titles: confident, direct and compact.
- **DM Sans** carries body copy, navigation, labels and interface controls.
- **Georgia** is a restrained editorial counterpoint for selected italic phrases, not a second general-purpose display face.
- Keep line lengths comfortable, headlines decisive, and body copy easy to scan. Use italics as punctuation, not as a style applied to every heading.

### Graphic language

- The River Ways mark is an abstract channel/current drawing, not a monogram.
- Supporting graphics may use contour lines, diverging channels, convergence nodes, directional paths and restrained diagram labels.
- Graphics should explain **signal → interpretation → direction → action** where useful.
- Use asymmetry and deliberate negative space. Avoid defaulting to circles, three-bar growth marks, generic water drops, blue gradients, stock dashboards or random squiggles.
- Keep the logo legible in one colour and at small sizes; test it in the browser header, favicon, document cover and monochrome applications before calling it final.

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
- [ ] Browser metadata, social titles, and favicon match the approved identity.
- [ ] Build succeeds and browser console has no errors.
- [ ] Cloudflare response headers are verified on a deployed preview.

This is a working design constitution, not a claim that every application has been audited or that the logo is final.
