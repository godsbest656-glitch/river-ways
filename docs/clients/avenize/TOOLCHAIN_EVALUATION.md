# Avenize — Creative toolchain evaluation (source-checked)

**As of:** 17 November 2026  
**Purpose:** Decide what River Ways should actually adopt for the Avenize client engagement without adding unnecessary cost or dependencies.

## Decision summary

1. Use the existing River Ways Agent Skills framework to add Avenize-specific creative instructions.
2. Pilot UI UX Pro Max as a local, project-scoped research skill only after a local Python 3 availability check and a dry-run in an isolated worktree.
3. Use Anthropic's frontend-design and canvas-design as reference workflows, subject to reading the full upstream license terms before copying source files.
4. Use the existing project presentation workflow for PPTX; read the upstream PPTX skill before importing or adapting it.
5. Keep Google DESIGN.md format as an inspiration for structured design documentation; the current Avenize DESIGN.md is the authoritative project-specific specification, not a claimed fully conformant implementation of the alpha schema.
6. Do not install Astryx into the current River Ways website: its documented React 19+ peer requirement conflicts with this branch's React 18.3.1.
7. Do not add Tailwind, a second icon library or a second browser automation harness without evidence of a real gap.

## Verified upstream details

### UI UX Pro Max
- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Repository README states MIT license.
- README describes searchable UI/UX guidance, style and product catalogs, colour palettes and font pairings.
- README documents Python 3 standard-library-only search scripts; it states the scripts do not install dependencies or make network requests.
- Installation guidance includes a CLI and skill-mode setup for multiple coding agents, including Claude Code and Codex CLI.
- Decision: pilot in an isolated client-scoped directory. Do not treat the catalog as Avenize brand authority. The exact Avenize logo and approved DESIGN.md take precedence. Check the upstream README and license again at the pinned commit before copying code/data. Do not install globally.

### Anthropic frontend-design
- Source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- The upstream skill describes distinctive, intentional interface design rather than templated defaults.
- The skill metadata points to separate complete license terms in LICENSE.txt.
- Decision: use as workflow guidance; inspect and retain the full license and notices before copying the skill itself. Keep Avenize client constraints and evidence gates in force.

### Anthropic canvas-design
- Source: https://github.com/anthropics/skills/tree/main/skills/canvas-design
- The upstream skill describes creating original static visual work and a two-step philosophy-to-artifact process.
- Its metadata points to separate complete license terms in LICENSE.txt.
- Decision: use for original static campaign-art direction only after reviewing full license terms. Never copy another designer's artwork. Do not assume a generated draft is an approved or final client asset.

### Google DESIGN.md
- Source: https://github.com/google-labs-code/design.md
- The upstream repository describes a structured design identity format for coding agents and labels the format alpha.
- Decision: use the general principle of pairing explicit tokens with human-readable rationale. The Avenize DESIGN.md is our own concise client specification; do not claim conformance to the evolving alpha format until its schema and tooling are checked.

### Meta Astryx
- Source: https://github.com/meta/astryx
- Upstream README describes an agent-oriented design system and documents React 19+ peer requirements for its core package.
- This repository branch's package.json specifies React 18.3.1.
- Decision: research only. Do not install into the River Ways site unless a separate compatibility migration is explicitly justified and approved. No such migration is needed for client campaign graphics.

### Figma Context MCP
- Source: https://github.com/GLips/Figma-Context-MCP
- Decision: conditional. Requires an approved Avenize Figma workspace, explicit access, and inspection of the current maintenance state, installation instructions and license. No Figma workspace was provided in this task.

### Vercel agent-browser
- Source: https://github.com/vercel-labs/agent-browser
- Decision: compare with the existing Playwright test harness before adoption. The current River Ways repository already uses Playwright; avoid duplicating browser automation.

## Safe pilot procedure

1. Check local Python 3 availability; do not install system software automatically.
2. Pin the upstream repository to a reviewed commit and record the license file hash.
3. Run the CLI dry-run in a disposable worktree, not against the main agency skill directory.
4. Inspect every created/changed file and reject unrelated global config changes.
5. Keep the Avenize skill and data inside this client scope.
6. Run the existing Agent Skills metadata validator and relevant tests.
7. Compare output against Avenize DESIGN.md using one real design task.
8. Adopt only if it improves output quality or speed without weakening identity, truth or QA gates.

## Not yet done

- No UI UX Pro Max code or catalog has been imported.
- No Anthropic skill source has been copied into this repository.
- No Astryx, Figma MCP or agent-browser dependency has been installed.
- No paid tool, hosted API, subscription or external service has been activated.
- The generated campaign visual drafts have not been placed in the repository or approved for publication.

This register records a decision and evidence boundary, not a claim that the integrations are already operational.
