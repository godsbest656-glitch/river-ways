# River Ways Platform — Design System and Experience Direction

**Status:** Product-wide design specification  
**Version:** 1.0 · 2 November 2026  
**Relationship:** Supplements `docs/design/DESIGN_CONSTITUTION.md` and `docs/design/DESIGN_SYSTEM_ARCHITECTURE.md`.

## 1. Design intent

The River Ways experience must unite a distinctive public creative showcase with a calm, dependable operating workspace. The public website should feel like a curated exhibition of exceptional creative and strategic work. The internal and client environments should feel precise, legible, trustworthy and efficient.

These are related expressions of one brand, not identical interfaces. Public pages can be expressive; operational screens prioritize clarity, speed, consistency and evidence.

## 2. Brand continuity

- Use **River Ways** as the public brand name.
- Preserve the current approved **SHAPED CURRENT** direction and current mark provisionally.
- Do not introduce a new logo, palette or identity system as part of platform implementation.
- Use the approved current brand tokens/assets from the active implementation branch; inspect them rather than inventing new hex values.
- The river philosophy informs narrative and design judgment: direction, life, environment, seasons, people and ecosystems, and movement toward the ocean. It is not a requirement to decorate every screen with water, waves or flowing lines.
- Avoid returning to the rejected terracotta / near-black / warm-parchment direction or generic blue-gradient SaaS styling.

## 3. Experience architecture

### Public website
Primary tasks:
1. Understand what River Ways does and whom it serves.
2. Understand Demand Engineering and the engagement model.
3. Explore selected work and creative capabilities.
4. Evaluate proof, process and credibility.
5. Submit an enquiry or request a conversation.

The homepage should be a **catalogue of brilliance**, not an unstructured gallery. Curate work into meaningful editorial groupings: campaigns, digital experiences, brand/graphic systems, motion and film, interactive experiences, and selected case studies. The catalogue should include filters only when they genuinely improve exploration.

Each project detail should communicate:
- project classification (client work, internal experiment, concept or prototype);
- client permission/publication status where relevant;
- problem or creative challenge;
- River Ways' actual contribution;
- creative and strategic rationale;
- deliverables and process;
- verified outcome, if available;
- credits and asset rights.

No fake dashboards, invented client logos, placeholder testimonials or unsupported metrics.

### Internal agency workspace
Design for frequent use:
- clear navigation and stable information architecture;
- overview with actionable exceptions, not vanity numbers;
- dense but readable tables for CRM, tasks, assets and invoices;
- status, ownership, due date, next action and evidence always discoverable;
- bulk actions only when safe and reversible;
- strong empty, loading, error, success and permission-denied states;
- visible audit history for consequential changes.

### Client workspace
Design for confidence and transparency:
- one clear project overview;
- progress linked to milestones and accepted deliverables;
- concise brief and approval workflows;
- asset previews with version history and feedback;
- downloadable final deliverables;
- reports with sources and caveats;
- no internal notes or other-client information.

### Creative Studio
The production interface should make batch work understandable:
- brief and brand profile;
- imported data and source provenance;
- strategic findings and confidence;
- recommended content pillars and asset matrix;
- internal plan approval;
- batch/job progress and failures;
- preview gallery and quality checks;
- client review and revision;
- final export manifest.

Show which assets are generated, template-assembled, manually edited or unavailable due to hardware constraints.

## 4. Visual system governance

Use the existing design-system architecture and current token source. Do not create a competing token set.

Token layers:
1. Brand primitives from the approved system.
2. Semantic colors: canvas, surface, elevated surface, text, muted text, border, focus, accent and status.
3. Typography: display, heading, body, label and data/numeric roles.
4. Spacing, layout, breakpoints, radii, elevation and density.
5. Motion: duration, easing, distance and reduced-motion equivalents.
6. Media: aspect ratios, crop rules, image treatments, poster/fallback and loading behavior.

Operational UI should use semantic status labels in addition to color. Never communicate success, danger, approval or blockage by color alone.

## 5. Typography and information hierarchy

- Use the currently approved type system and self-hosted/licensed font files where available.
- Preserve readability across long-form reports, data tables, forms and mobile screens.
- Use tabular numerals for quantities and dates where useful.
- Keep labels concise and consistent.
- Do not put essential text inside generated images or video.
- Report headings must distinguish the reporting period, status and source context.

## 6. Layout and responsive behavior

- Public experience: editorial compositions, deliberate scale, strong image selection, clear reading measure and a visible conversion path.
- Workspace: predictable grid, responsive tables/cards, compact navigation and task-oriented page layouts.
- Mobile: no horizontal overflow for core workflows; provide alternative layouts for complex tables; make file review, approvals and status updates usable on touch devices.
- Preserve browser zoom, text resizing and reflow.
- Do not force full-screen or scroll-jacking experiences.

## 7. Motion, 3D and media

- Use cinematic motion and 3D on the public homepage only when they support the narrative and do not block comprehension.
- The initial message and CTA must be available without waiting for a video or WebGL scene.
- Provide poster images, static fallbacks and reduced-motion alternatives.
- Respect `prefers-reduced-motion`; do not use autoplay audio.
- Lazy-load nonessential media and avoid layout shifts.
- In operational workspaces, motion should be restrained and functional: progress, state changes, previews and feedback.
- Video assets must be optimized for actual target devices and bandwidth.

## 8. Creative asset quality and presentation

The catalogue should demonstrate a range of capability without looking like a random stock gallery. Each item needs art direction, a clear idea, correct classification and accurate context.

Asset metadata must include source, author/creator where known, licence, attribution, modification permission, project, approval status, and public-use permission. Do not display an asset merely because it is visually impressive.

Batch-generated work must be curated. Prefer a small number of excellent, coherent assets over a large volume of mediocre variations. Show the creative system and its reasoning, not just output quantity.

## 9. Accessibility

Target WCAG 2.2 AA:
- semantic landmarks and heading order;
- keyboard operation and visible focus;
- accessible names and labels;
- sufficient contrast;
- useful alt text and captions/transcripts where appropriate;
- non-color status indicators;
- reduced-motion behavior;
- accessible errors and validation;
- touch targets and zoom/reflow;
- no hover-only functionality.

Canvas, WebGL and video must never be the sole carrier of essential information.

## 10. Design acceptance

A design is ready for implementation when:
- user task and business purpose are documented;
- it follows current River Ways brand decisions;
- content hierarchy and interaction are clear;
- desktop and mobile states are designed;
- accessibility and reduced-motion behavior are specified;
- performance and fallback behavior are understood;
- all imagery and assets have rights/provenance;
- states for empty, loading, error, success and permission denial are considered;
- the design has been tested against realistic content, not placeholder-only screenshots.

A design is not accepted merely because it looks good in a static mockup.
