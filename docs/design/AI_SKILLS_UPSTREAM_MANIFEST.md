# AI skills upstream manifest

This manifest records source provenance for the River Ways project-level skills. The project files are adaptations written for River Ways, not verbatim mirrors.

| Installed file | Upstream source | Pinned upstream commit | Adaptation |
|---|---|---|---|
| `.agents/skills/landing-page-design/SKILL.md` | `elayadesign/ai-design-skills/skills/landing-page-design/SKILL.md` | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | Keeps strategy, page narrative, conversion, proof and implementation sequence; removes incompatible hard-coded design values |
| `.agents/skills/figma-designer/SKILL.md` | `elayadesign/ai-design-skills/skills/figma-designer/SKILL.md` | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | Keeps inspect-first, variables, components, responsive frames and review workflow; requires existing River Ways tokens and Figma prerequisites |
| `.agents/skills/redesign-existing-projects/SKILL.md` | `elayadesign/redesign-skill/skills/redesign-existing-projects/SKILL.md` | `7df13f6a289f4a7f91c5fe3efd70f51fd584ec28` | Keeps evidence-led audit, state coverage and focused fix ordering; removes unrelated style prescriptions |
| `scripts/validate_skills.py` | Independently implemented against Agent Skills specification | `agentskills/agentskills@83021e2be457a9b6679148719c1f6074f0ad975e` | Standard-library metadata validator |
| `tests/test_validate_skills.py` | Independently implemented | — | Regression coverage for metadata and directory validation |
| `.github/workflows/validate-project-skills.yml` | Independently implemented | — | Pull-request and main-branch validation |

## Deliberately excluded upstream files

- `assets/slopscan-banner.png`: promotional material for an unrelated product, not a River Ways development resource.
- Upstream README files: their installation guidance is represented in the River Ways integration guide; upstream-specific design values and promotional copy are not adopted.
- Upstream fixed design-value tables: incompatible with the approved River Ways design system and therefore not copied.

## Licenses and notices

- Elaya Design repositories: MIT. See `THIRD_PARTY_NOTICES.md`.
- Agent Skills specification repository: format is followed, but its code/docs are not copied.
- Playwright, axe-core and Lighthouse CI are researched recommendations only in this increment; they are not dependencies and no source code from them is included.
