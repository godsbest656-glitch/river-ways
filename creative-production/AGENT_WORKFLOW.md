# Creative production agent workflow

This is the execution contract for the River Ways agency agents when producing website motion, campaign video, social creative and client deliverables. Agents may prepare work in parallel, but production and delivery gates are sequential and human-owned.

## Agent roles and contracts

| Role | Responsibility | Required output |
|---|---|---|
| Creative Producer / Orchestrator | Owns the brief, dependencies, schedule, job state and handoffs | Validated brief, task graph, production status and final manifest |
| Strategist | Audience, objective, proposition, channel and message hierarchy | Strategy note tied to approved brief fields |
| Copywriter | Headlines, voiceover, captions, CTA and on-screen copy | Copy deck with claims/source checks |
| Creative Director | Selects concept and protects River Ways SHAPED CURRENT brand direction | Approved concept and visual treatment |
| Art Director / Storyboard Artist | Shot sequence, references, composition, palette, lighting and continuity | Storyboard and shot list |
| Prompt / Model Specialist | Selects model candidate, prompt, seed, checkpoint and ComfyUI workflow | Versioned API workflow and prompt/seed record |
| Motion Developer | Builds HTML/CSS/GSAP composition in HyperFrames; Remotion only when separately licensed | Reproducible composition source |
| Generation Operator | Runs approved local workflow and monitors GPU/job telemetry | Generated media, job record and provenance |
| Editor / Finisher | Selects takes, trims, assembles, captions, audio, grade and exports | Final candidate render and edit notes |
| QA / Accessibility | Checks playback, duration, dimensions, codec, text, captions, contrast and platform constraints | FFprobe report plus human QA checklist |
| Rights / Compliance Reviewer | Checks model licence, music, footage, fonts, stock, client assets, releases and territory | Rights register and explicit clearance |
| Account / Client Approver | Presents preview and captures client approval | Approval identity, timestamp, scope and revision notes |

The role names map to the installed agency-agent catalogue where a matching agent exists. Missing specialist agents are explicit work to add; do not claim an agent is active merely because this role appears in the workflow.

## Required sequence

1. **Intake:** producer validates the brief schema, required deliverables, audience, objective, message, channels and constraints.
2. **Strategy:** strategist and copywriter produce message hierarchy and scripts. No fabricated performance claims or client results.
3. **Concept approval:** creative director and owner approve one concept before client asset generation or paid model inference.
4. **Storyboard:** art director creates shot list, timings, visual continuity and reference rights.
5. **Model and renderer selection:** model specialist verifies hardware, exact checkpoint and component licences. Prefer HyperFrames for local HTML/CSS/GSAP motion. Remotion is not the default for automated work because its Automators tier is paid.
6. **Production approval:** the brief must carry approver/timestamp, asset-generation permission, model-license review and (for benchmark-only inference) hardware compatibility review.
7. **Generation:** generation operator runs only loopback ComfyUI workflows. Production models must be enabled in the registry; disabled models are allowed only for explicitly marked benchmark-only runs. Hunyuan territory exclusions are enforced in code.
8. **Edit and finishing:** editor creates the final candidate. No output is considered approved just because generation succeeded.
9. **Technical QA:** run FFprobe QA against the deliverable specification; inspect the video visually and audibly. Check captions, text, safe areas, audio rights and platform-specific export requirements.
10. **Rights and brand QA:** rights reviewer verifies every input and output. Confirm the correct River Ways identity and client-specific permissions.
11. **Human approval:** account lead/owner and, where required, client approve the exact preview, version and usage scope. Store approval evidence.
12. **Delivery:** only approved files move from `assets/generated/` to `assets/approved/` and then to `delivery/`. Publish/send only after explicit approval.

## Parallel work allowed

- Strategy, copy and initial reference research can run in parallel after intake.
- Storyboard and production planning can run in parallel after the concept direction is approved.
- HyperFrames layout exploration can run in parallel with model compatibility research, using synthetic/internal assets.
- Technical QA and rights review can run in parallel on a frozen candidate render.

Generation, final export, approval and delivery must not be treated as parallel substitutes for their upstream gates.

## Agent reporting contract

Every task report must include:
- task ID, agent/role, input brief version and output paths;
- status: `not-started`, `in-progress`, `blocked`, `failed`, `review-required` or `complete`;
- evidence links or file paths, tests/checks run and exact result;
- dependencies and owner decisions still required;
- no claim of completion when only a mock, plan, prompt or generated draft exists.

## Non-negotiable boundaries

- Agents do not self-approve their own work or the client brief.
- Agents do not enable a model, alter its licence gate, accept paid terms or purchase credits.
- Agents do not publish, email, upload to client portals or deliver without explicit owner/client approval.
- Agents do not use client assets for training/fine-tuning without separate written permission.
- Agents do not invent portfolio results, case studies, testimonials, client approvals or benchmark scores.
- Generated output stays in `assets/generated/` until all human, technical, rights and brand gates are complete.
