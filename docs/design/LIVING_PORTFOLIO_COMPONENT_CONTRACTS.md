# River Ways — Living Portfolio Component Contracts

These contracts are downstream of `LIVING_PORTFOLIO_ARCHITECTURE.md`. Components consume normalized records from `src/portfolio/index.js`; they must not create their own project datasets or read raw records.

## Shared primitives

### ProjectMedia
**Inputs:** `media`, optional `className`, optional `loading`.

- Renders image or video from a validated media record; interactive media remains on its accessible static fallback until a safe renderer is explicitly approved.
- Images use intrinsic width/height, `srcSet`, `sizes`, focal point and lazy loading where appropriate.
- Video uses poster and controls only when useful; always has a static fallback.
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

### ProjectCard
**Inputs:** normalized `project`, optional `onProjectSelect`, `surface`, style class names and `showServices`.

- Renders one consistent media, classification, title, summary, service and disclaimer structure.
- A selection button appears only when a real callback is provided; no decorative or dead links.
- Selection emits `{ projectId, slug, surface }`.

## Presentation contracts

| Component | Selection | Main inputs | Required fallback |
|---|---|---|---|
| Scroll Gallery | `selectGalleryProjects` or `selectFeatured` | `source`, optional `scope`, `limit`, `ariaLabel`, `onProjectSelect` | Native horizontal scroll and readable list |
| Shuffle Gallery | `selectFiltered` + deterministic `stableShuffle` | `source`, `filters`, `onFilterChange`, `onProjectSelect` | Ordered, unfiltered project list |
| Card Folder | `selectHomeShowcase` | `source`, `limit`, `onProjectSelect` | Plain readable project list |
| 3D Memory Album | `selectGalleryProjects` | `source`, `activeSlug`, `onProjectSelect` | Card Folder or Scroll Gallery with full content parity |
| Editorial Case Study | `getBySlug` / `selectGalleryProjects` | `source`, `slug` | Semantic long-form article |

## Current implementation state

- **Implemented:** ProjectMedia, ProjectBadge, ProjectDisclaimer, ProjectCard, ScrollGallery, ShuffleGallery and CardFolder.
- **Integrated:** ScrollGallery powers the existing homepage `#studio` studies from the canonical source.
- **Not yet integrated:** ShuffleGallery and CardFolder are reusable components awaiting the work index/homepage decisions.
- **Deferred:** Editorial Case Study route/template and 3D Memory Album.
- **Visual QA:** the current change is build/test gated on the topic branch; no new preview has been deployed for visual review.

## Interaction and event contract

- Project selection emits `{ projectId, slug, surface }`.
- Filter changes emit `{ category, service }`; omitted values are `null`.
- Active selection is exposed with semantic state such as `aria-current`, `aria-expanded` or a labelled region.
- All interactive elements are keyboard reachable and touch operable.
- Focus is visible and remains predictable when filters or selections change.
- Reduced-motion mode disables non-essential transitions and all auto-rotation.
- Shuffle order is deterministic for a given seed, changes only when the visitor requests it, and never mutates source records.
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
