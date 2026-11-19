# River Ways repository reconciliation

**Audit date:** 19 November 2026  
**Repository:** `godsbest656-glitch/river-ways`  
**Integration branch:** `build/godmode-reconciled`  
**Base commit:** `d5a77c588aa94df086596618f39033d7392e06de`  
**Scope:** Public website branch and workflow integration. This audit does not approve a merge or deployment.

## 1. Decision

Use `feat/river-ways-liquid-current` at `d5a77c5` as the current remote website integration base for the next review cycle. This branch includes the execution foundation, the PromptedSite interaction layer, and the liquid-current hero increment.

Do not treat this branch as the final release candidate. PR #49 remains a draft. Its hosted Preview and manual device review remain open.

Keep GodMode as a development workflow. Do not add GodMode to the website runtime or `package.json`.

## 2. Verified branch and pull-request facts

| Item | Verified state | Decision |
|---|---|---|
| `build/river-ways-execution` | Commit `7eef0ea`; route generation, portfolio, enquiry operations and test foundation are present. | Preserve as the operational baseline. |
| `feat/promptedsite-inspired-experience` | Commit `85cc9e2`; based on the execution branch. | Preserve as the motion-layer parent of PR #49. |
| `feat/river-ways-liquid-current` | Commit `d5a77c5`; 24 commits ahead of PromptedSite and 29 commits ahead of execution. | Use as the current remote website integration base. |
| PR #48 | Draft; head `85cc9e2`; base execution branch. | Keep as historical stacked work. Do not merge alone. |
| PR #49 | Draft; head `d5a77c5`; base PR #48 branch. | Keep as the current visual implementation candidate. |
| `build/godmode-integration` | Two commits ahead of execution; two commits behind the liquid-current branch. | Preserve. Do not use as the website source base. |
| `build/river-ways-execution-agency-agents` | Divergent from GodMode. It adds specialist Codex agents, simplified-engineering guidance, platform documents and validation code. | Keep as a separate agency-agent workstream until file-level overlap review. |
| PR #47 | Draft; 33 commits; head `feat/river-ways-agency-agents`; base `feat/river-ways-ai-design-skills`. | Do not merge into the public website branch without ancestry and file review. |
| PR #50 | Draft; head `client/avenize-marketing-operations`; base agency-agent branch. | Keep Avenize client requirements separate from public website scope. |

The repository branch search did not return `feat/river-ways-operations-platform` or `build/shaped-current-homepage`. Earlier handoffs report those branches or local bundles. Their current contents remain unverified in this repository connection.

## 3. CI evidence

PR #49 identifies commit `d5a77c588aa94df086596618f39033d7392e06de` as its latest head. GitHub reports two completed successful workflow runs for that commit:

- River Ways checks: run `42879837460`.
- Project skills validation: run `42879837358`.

The PR description reports a successful production build, browser and accessibility tests, Lighthouse, enquiry API tests, portfolio checks, migration validation and dependency audit. It reports zero dependency vulnerabilities.

These results are CI evidence for the tested commit. They are not hosted Preview evidence, real-device review, remote D1 verification, email-delivery evidence or production approval.

## 4. Source-of-truth boundaries

- Public website design: `docs/design/RIVER_WAYS_MASTER_DESIGN.md`.
- Public website architecture: existing React 18 and Vite 6 application.
- Static route generation: `scripts/generate-static-pages.mjs`.
- Portfolio data: `src/portfolio/index.js` and its normalized records.
- Enquiry path: `functions/api/contact.js`, D1 migrations and existing API tests.
- Browser regression: Playwright in `tests/e2e`.
- Release control: root `AGENTS.md` and existing GitHub workflows.
- GodMode: `docs/engineering/GODMODE_INTEGRATION.md`. It governs the development workflow only.

Do not create a second website, route generator, portfolio data source, lead schema or browser test harness.

## 5. Workstream separation

### Public website
Continue from the liquid-current candidate. Preserve the enquiry path, generated routes, portfolio, Growth Diagnostic, Field Guide, privacy page, metadata, sitemap, 404 and existing tests.

### Agency operating platform and specialist agents
The agency-agent branch contains a separate set of Codex agents and platform documents. Review those files independently. Do not copy the platform's internal CRM, agent runtime or workspace features into the public website.

### Avenize client mandate
PR #50 records client requirements. It does not deliver approved campaign assets or a live client portal. Keep client data, creative approvals, publishing and reporting within a client-scoped operating workflow.

### GodMode
Use one primary workflow plugin. Do not install a second overlapping GodMode package. Keep the root `AGENTS.md` as the project authority when the plugin is absent.

## 6. Risks and open checks

| ID | Risk or open item | Required action |
|---|---|---|
| REC-01 | The reported local release candidate is not visible in the current remote branch search. | Recover its exact bundle and compare file-level changes before final release selection. |
| REC-02 | The route-count discrepancy in the reported local candidate is unresolved. | Compare route registry, generated documents, sitemap and 404 output. |
| REC-03 | PR #49 is stacked and remains draft. | Do not merge it alone. Review its full ancestry and base chain. |
| REC-04 | PR #49 has no hosted Preview or manual desktop/tablet/mobile review in the evidence inspected. | Obtain owner approval before opening or updating a PR. |
| REC-05 | The GodMode workstation installation is not verified. | Install in the user's Codex environment, run the doctor command and confirm skill discovery. |
| REC-06 | The agency-agent workstream diverges from the public website candidate. | Compare agent files and root instructions before selecting reusable parts. |
| REC-07 | The Avenize branch is based on the agency-agent branch. | Preserve the client boundary during future integration. |
| REC-08 | Remote D1 and Resend behavior remain unverified by this audit. | Use a controlled Preview only after owner approval. |

## 7. Next implementation sequence

1. Recover the exact local release bundle and record its commit, file list and checksums.
2. Compare the local candidate with `feat/river-ways-liquid-current` by file and behavior.
3. Compare PR #24 operational capabilities and PR #30's gated feature with the selected website candidate.
4. Review the agency-agent branch for reusable development-only resources. Keep its product platform separate.
5. Add a reconciliation matrix for routes, enquiry, D1, notifications, portfolio, SEO, privacy, accessibility, performance and deployment.
6. Add or update tests before changing any application behavior.
7. Run the relevant checks on the exact candidate commit.
8. Request Preview approval only after the branch passes local and CI gates.

## 8. Completion record

- Requirement REC-BASE-01: Select a remote website integration base from observed branch ancestry.
- Result: PASS. The liquid-current branch is 29 commits ahead of the execution branch and contains the PromptedSite parent.
- Requirement REC-BASE-02: Keep GodMode changes separate from website runtime dependencies.
- Result: PASS. No package manifest or website source file changed in this cycle.
- Requirement REC-BASE-03: Record branch, PR and workstream boundaries.
- Result: PASS. This document records the observed refs and open risks.
- Requirement REC-BASE-04: Verify the GodMode plugin on the local Codex workstation.
- Result: BLOCKED. This environment cannot run commands on the user's workstation.
- Requirement REC-BASE-05: Verify the exact branch with local build and tests.
- Result: BLOCKED. This cycle used GitHub source and CI metadata. It did not run a local checkout or build.
- Requirement REC-BASE-06: Verify hosted Preview and production behavior.
- Result: DEFERRED. No PR or deployment action was taken.

**Current outcome:** Reconciliation baseline recorded. The website source has not been merged or changed by this audit. The next code change must follow the file-level comparison in REC-01 through REC-03.
