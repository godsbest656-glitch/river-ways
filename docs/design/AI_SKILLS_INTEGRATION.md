# River Ways AI design skills

## Installed project skills

The following Agent Skills are installed under `.agents/skills/`:

| Skill | Purpose | Source |
|---|---|---|
| `landing-page-design` | Page strategy, narrative, conversion copy and responsive page implementation | https://github.com/elayadesign/ai-design-skills |
| `figma-designer` | Figma foundations, variables, components and screen QA | https://github.com/elayadesign/ai-design-skills |
| `redesign-existing-projects` | Evidence-led audit and focused improvement of existing interfaces | https://github.com/elayadesign/redesign-skill |

These are River Ways adaptations informed by the upstream repositories, not verbatim copies. They preserve useful workflows while preventing upstream sample design values from overriding approved River Ways decisions.

## Required workflow

1. Read root `AGENTS.md` and the complete `docs/design/` governance documents.
2. Inspect the exact branch, commit, worktree, routes, source, dependencies and tests.
3. Use `redesign-existing-projects` for existing pages and `landing-page-design` for new pages or campaigns.
4. Use `figma-designer` only for an actual Figma task. Load required Figma prerequisite skills first.
5. State the problem, evidence, proposed scope, acceptance criteria and risks before editing.
6. Implement focused changes; preserve forms, analytics, SEO, routes and deployment behavior.
7. Validate build, tests, responsive layouts, keyboard use, reduced motion and performance.
8. Report exact commits, changed files, commands and results, preview evidence, unverified areas and rollback options.

## Approved River Ways design constraints

- Brand: River Ways. Positioning: Creative Demand Engineering.
- Approved headline: “We engineer demand.”
- Approved direction: SHAPED CURRENT, Route 2 — Editorial Intelligence.
- The supplied centred editorial header reference calls for a confident centred headline, concise supporting copy, one primary action with a quieter secondary route, and a purposeful gallery or visual field beneath. Adapt the composition; do not copy another brand's artwork or exact design.
- Existing approved project tokens and implementation are authoritative for colors, typography, spacing, radii and motion.
- Do not invent client work, metrics, testimonials, awards, logos, guarantees, pricing or unsupported service claims.
- Keep River Ways website scope separate from Avenize and Revenue OS.

## Validation

Run `python -m unittest discover tests` and `python scripts/validate_skills.py .agents/skills`. The GitHub Actions workflow runs these checks for pull requests and pushes to main.

## Provenance

The integration is informed by the documented workflows in the two upstream repositories listed above. Both declare MIT licensing. The River Ways skill files are independently written adaptations. The upstream promotional banner was excluded because it is not a functional skill or a River Ways asset.
