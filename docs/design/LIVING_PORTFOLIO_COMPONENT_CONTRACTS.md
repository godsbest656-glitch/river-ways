# River Ways — Living Portfolio Component Contracts

These contracts are downstream of `LIVING_PORTFOLIO_ARCHITECTURE.md`. Components consume normalized records from `src/portfolio/index.js`; they must not create their own project datasets or read raw records.

## Shared primitives

### ProjectMedia
**Inputs:** `media`, optional `className`, optional `loading`.

- Renders image, video or interactive media from a validated media record.
- Images use intrinsic width/height, `srcSet`, `sizes`, focal point and lazy loading where appropriate.
- Video uses poster and controls only when useful; always has a static fallback.
- Interactive media always has a static fallback.
- Alt text is supplied by the record; never synthesize claims or generic alt text.
- Broken media renders an accessible fallback with the same content purpose.

### ProjectBadge
**Inputs:** normalized `project`.

- Shows the project type and delivery truth.
- Client, internal-demo, capability-study, concept, experiment and roadmap states remain distinguishable.
- Never label a capability study as client work or a result.

### ProjectDisclaimer
**Inputs:** normalized `project`.

- Renders the derived disclaimer when present.
- Must not be hidden behind hover, animation or a collapsed state.
- Must be visible wherever the project could otherwise be mistaken for commissioned client work.

## Presentation contracts

| Component | Selection | Main inputs | Required fallback |
|---|---|---|---|
| CMS Scroll Gallery | `selectGalleryProjects` | `source`, `limit`, `heading`, `ariaLabel`, `onProjectSelect` | Native horizontal/vertical scroll and readable list |
| CMS Shuffle Gallery | `selectFiltered` | `source`, `filters`, `onFilterChange`, `onProjectSelect` | Ordered, unfiltered project list |
| Card Folder | `selectHomeShowcase` | `source`, `limit`, `onProjectSelect` | Plain readable project list |
| 3D Memory Album | `selectGalleryProjects` | `source`, `activeSlug`, `onProjectSelect` | Card Folder or Scroll Gallery with full content parity |
| Editorial Case Study | `getBySlug` / `selectGalleryProjects` | `source`, `slug` | Semantic long-form article |

## Interaction and event contract

- Project selection emits `{ projectId, slug, surface }`.
- Filter changes emit `{ category, service }`; omitted values are `null`.
- Active selection is exposed with semantic state such as `aria-current`, `aria-pressed` or a labelled region.
- All interactive elements are keyboard reachable and touch operable.
- Focus is visible and remains predictable when filters or selections change.
- Reduced-motion mode disables non-essential transitions and all auto-rotation.
- Shuffle order is stable for the current session and never mutates the source records.
- The 3D album cannot be the only way to access project information. The non-3D fallback has the same titles, descriptions, media alternatives, disclaimers and links.
- No component stores diagnostic answers, lead details or other personal data.

## Ownership boundaries

- **Architecture/schema owner:** `src/portfolio/**`, portfolio validation and architecture docs.
- **Scroll Gallery owner:** its component and scoped stylesheet only.
- **Shuffle Gallery owner:** its component and scoped stylesheet only.
- **Card Folder owner:** its component and scoped stylesheet only.
- **Memory Album owner:** its component and scoped stylesheet only; no global tokens.
- **Case-study owner:** case-study template and scoped stylesheet only.
- **Integration owner:** the only owner permitted to wire components into `src/App.jsx` and the route registry after contracts and component tests pass.

## Verification checklist

1. Only the canonical source is used.
2. Public, unlisted, internal and draft visibility are respected.
3. Type badges and disclaimers are visible.
4. Client permission, result evidence and testimonial permission are enforced.
5. Images have alt text and intrinsic dimensions.
6. Video and interactive media have static fallbacks.
7. Keyboard, focus, touch and reduced motion work.
8. Responsive layouts do not overflow.
9. No source record is mutated or duplicated.
10. No unsupported proof or unlicensed media appears.
11. The fallback retains full content parity.
12. Build, unit tests and portfolio validator pass.
