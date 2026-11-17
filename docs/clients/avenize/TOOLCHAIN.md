# Avenize — Creative operations toolchain

**Purpose:** Turn the supplied open-source design-tool list into a practical, low-cost production workflow inside River Ways.
**Budget rule:** No new paid subscriptions, metered APIs, hosted services or financial commitments without approval.
**Boundary:** These tools support River Ways' agency execution; they do not move Avenize into the River Ways product or change client data and credential separation.

## Adoption decisions

| Resource | Intended use | Decision | Reason / gate |
|---|---|---|---|
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Searchable UI patterns, styles, palettes and font-pairing references | Pilot as a project skill | Research aid only; actual logo and approved tokens take precedence |
| [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Higher-quality frontend implementation guidance | Adopt as an agent skill after provenance check | Must follow the relevant project's design system and acceptance gates |
| [Anthropic canvas-design](https://github.com/anthropics/skills/tree/main/skills/canvas-design) | Campaign artwork, posters and graphic compositions | Adopt for static creative workflow after provenance check | Prefer editable/source assets and preserve brand rules |
| [Anthropic pptx](https://github.com/anthropics/skills/tree/main/skills/pptx) | Corporate decks, sales decks and partnership presentations | Adopt for presentation production after provenance check | Use a repeatable slide system and validate exported decks |
| [Google DESIGN.md](https://github.com/google-labs-code/design.md) | Portable brand/design instructions for coding agents | Adopt the format; maintain separate file per client/project | Avenize rules must not leak into River Ways' own brand |
| [Meta Astryx](https://github.com/meta/astryx) | Design-system research and component references | Evaluate only | No second UI system without concrete fit and license/dependency review |
| [Figma Context MCP](https://github.com/GLips/Figma-Context-MCP) | Structured agent access to Figma layouts | Conditional | Requires approved Figma workspace and access model |
| [Vercel agent-browser](https://github.com/vercel-labs/agent-browser) | Browser-based implementation and visual QA | Evaluate against existing Playwright harness | Avoid duplicate browser automation; adopt only if it adds clear value |
| [Lucide](https://github.com/lucide-icons/lucide) | Consistent interface icons | Already present as lucide-react in River Ways website package | Reuse existing dependency; no second icon library |
| [rembg](https://github.com/danielgatis/rembg) | Local background removal for approved imagery | Optional local production utility | No cloud upload of client imagery; check model/dependency terms and compute |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Utility-first styling | Do not add to current River Ways website by default | Existing site has a CSS system; avoid parallel styling framework |
| [Excalidraw](https://github.com/excalidraw/excalidraw) | Workshop flows, campaign maps and process diagrams | Optional after privacy review | Diagrams must not expose prospect or client confidential information |

## Integration principles
1. Read each upstream repository's current license, install instructions, dependencies and security posture before importing files.
2. Pin source versions/commits and record provenance.
3. Adapt instructions to the project's own brand and codebase; generic defaults never override approved design.
4. Keep client-specific design files, assets, Figma access, prompts and credentials scoped to that client.
5. Prefer local/free operation where practical; account for model downloads, CPU/GPU, storage, maintenance and staff time.
6. Do not install every tool just because it is free. Adopt the smallest toolchain that removes a real production bottleneck.
7. A repository listed here is not considered installed, integrated or production-ready until code/configuration, tests and usage evidence exist.

## Immediate production workflow
1. Brand guardian reads the client brief and DESIGN.md.
2. Product marketer verifies feature claims against the actual product.
3. Creative lead creates campaign concept and channel adaptations.
4. Design agent produces editable artwork and source files.
5. Copywriter supplies audience-specific message and CTA.
6. QA checks identity, readability, dimensions, contrast, claims and destination links.
7. Client approver signs off.
8. Publishing operator schedules/publishes and records evidence.
9. Growth operator links creative to leads, demos and conversions.

## Not authorised
No paid tools, subscriptions, stock licenses, hosted model APIs, advertising spend, bulk messaging services, new cloud infrastructure or partner payments are authorised by this toolchain decision.
