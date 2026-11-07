# River Ways — Living Portfolio Architecture

**Scope:** issue #35 — architecture and data contract.  
**Status:** foundation implemented; three presentation components implemented; Scroll Gallery integrated into the existing studio section. No new portfolio routes or 3D experience are released.

## Provenance and source integrity

The previous handoff reports a verified local foundation at commit `9bda5e590a9810f9d67587c62aa4700aad230cfe`, branch `arch/living-portfolio-foundation`, based on `56a6436678af8b3df2104c660ef685e501bafc5c`. That branch and its portable bundle were not present in the accessible GitHub repository, current runtime or Library during this continuation. The report provides a detailed schema and acceptance contract, but not the original source files.

This implementation is therefore a **new reconstruction from the recorded architecture contract and issue #35**, not a claim that the original commit or bundle was imported byte-for-byte. If the original bundle becomes available, compare its source and tests before replacing anything. The accepted Media Manifest remains a separate governance package and is not integrated by this change.

## Current integration point

The existing `#studio` section contains three hand-authored studies:
- Identity with a point of view.
- Ideas built to travel.
- Experiences with dimension.

They are illustrative capability studies, not commissioned client work or performance proof. The canonical data source now powers those three cards through `ScrollGallery`; the existing titles and descriptions are preserved. Two internal demonstrations are also represented: the River Ways website and Growth Diagnostic. Both receive an explicit internal-demonstration disclaimer from the normalized project model.

The Scroll Gallery is integrated into `#studio`. Shuffle Gallery and Card Folder are implemented as reusable components but are not wired to a route. The Editorial Case Study template and 3D Memory Album remain outstanding.

## Canonical project schema

One project record is the source for every presentation. The schema is validated in `src/portfolio/schema.js`.

| Field | Contract |
|---|---|
| Identity | `id`, kebab-case `slug`, `title` (max 160), `summary` (max 320), `order`, `publishedAt`, `updatedAt` |
| Classification | `type`, controlled `categories[]`, controlled `services[]`, `tags[]`, `status`, `visibility` |
| Narrative | `problem`, `approach`, `outcome`; nullable. An outcome is exposed only when supported by verified results |
| Client | `name`, `publicName`, `sector`, `engagementWindow`, `permission`; required only for client records |
| Claims | `results[]` with label, value, verified flag, evidence and source; `testimonials[]` with quote, attribution and permission |
| Media | Required `media.cover` and `media.gallery[]`; every asset has source, rights, alt text and required fallback metadata |
| Presentation | `featured[]`, `disclaimer`, `deliverables[]`, `evidenceReferences[]`, `credits[]`, optional `seo` |

### Controlled taxonomy

There are 21 category IDs in six groups: Brand, Creative, Digital, Motion, Growth and Intelligence. Labels are resolved through `getCategoryLabel(id)`; unknown category IDs are rejected.

Service IDs mirror the seven current homepage capabilities: Creative Demand Engineering, Websites & Digital Experiences, Search & AI Discovery, Brand & Creative Systems, Performance Marketing, Content & Campaigns and Demand Intelligence.

### Project types and truth rules

| Type | Delivery truth | Publishable as proof | Required disclaimer |
|---|---|---:|---|
| `client` | Delivered | Only with granted client permission | No disclaimer when approved |
| `internal-demo` | Delivered | Yes, as owned capability evidence | Internal demonstration — not client work |
| `capability-study` | Illustrative | No | Illustrative capability study — not commissioned client work |
| `concept` | Not delivered | No | Concept — exploratory work |
| `experiment` | Not delivered | No | Experiment — exploratory work |
| `roadmap` | Planned | No | Planned work — not yet delivered |

`publishableAsProof` is derived from project type and permission; it is never an author-controlled boolean. A capability study can be shown as an illustration but must never be presented as a client result. Roadmap records can never be featured. Non-permissioned testimonials are removed from the render model. Unverified results are removed from the render model and rejected in strict public validation.

### Visibility and featuring

- `public`: eligible for galleries and public indexation when status is `published`.
- `unlisted`: published deep-link only; excluded from galleries.
- `internal`: internal use only.
- `draft`: not publicly addressable.

Featured scopes are `homepage`, `studio` and `work`. Only published public records can be featured. The homepage scope is intentionally empty in the initial dataset; `selectHomeShowcase` can top up from the public pool without repeating records. This avoids inventing a separate homepage dataset.

## Data source

`createProjectSource(records)` creates a frozen read interface:
- `list()`
- `getBySlug(slug)`
- `listPublic()`
- `listFeatured(scope)`
- `errors`

`src/portfolio/index.js` is the single public import surface. Presentation components must import through it and render normalized view models, never raw records.

The default source is local static JavaScript. There is no CMS, vendor, API key, network request, paid service or runtime dependency. A future approved CMS can replace the implementation behind `createProjectSource` without changing component contracts.

## Media, rights and accessibility

- Informative media requires meaningful alt text; generic labels such as “image of…” are rejected.
- Decorative media must use empty alt text.
- Images require intrinsic width and height to prevent layout shift.
- Video requires a poster and static fallback. Interactive media requires a static fallback.
- `license.kind: "unlicensed"` is rejected. Every asset records its source; licences requiring attribution must include it.
- Responsive source sets require URL/width pairs with increasing widths and a `sizes` value.
- Optional focal points use normalized x/y values from 0 to 1.
- Keyboard, touch, responsive behavior and reduced motion are mandatory. No information may exist only in WebGL/canvas.
- The first three capability studies retain their original CSS artwork through three controlled local renderer keys; their SVG files in `public/portfolio/` are static fallback artwork and provenance assets. The two internal demonstrations use original SVG cover artwork. None are client screenshots or third-party stock. All five assets must be reconciled into the Media Manifest when that separate package is available.

## Implementation sequence

1. **Foundation — complete:** schema, taxonomy, selectors, source, static records, validation script and automated tests.
2. **Shared primitives — complete:** ProjectMedia, ProjectBadge, ProjectDisclaimer and ProjectCard.
3. **Simple presentations — implemented:** Scroll Gallery, Shuffle Gallery and Card Folder. Scroll Gallery is wired to the existing `#studio` section; the other two remain reusable and unconnected.
4. **Editorial Case Study — pending:** semantic long-form project template and route integration.
5. **3D Memory Album — deferred:** last, with a full-content non-3D fallback.
6. **Route integration — pending:** complete the work index and individual project routes after the route registry is established.
7. **Media governance — pending:** reconcile the original Media Manifest bundle and add all approved assets before production publication.

## File map

- `src/portfolio/taxonomy.js`
- `src/portfolio/schema.js`
- `src/portfolio/selectors.js`
- `src/portfolio/shuffle.js`
- `src/portfolio/projectSource.js`
- `src/portfolio/projects.js`
- `src/portfolio/index.js`
- `src/portfolio/components/`
- `tests/portfolio/`
- `scripts/validate-portfolio.mjs`
- `public/portfolio/`

## Non-goals

No 3D album yet, no individual case-study routes yet, no paid CMS, no external media service, no fabricated client work or results, no production media release, no D1 or deployment changes.
