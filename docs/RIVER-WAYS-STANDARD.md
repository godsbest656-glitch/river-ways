# River Ways Standard
**Version:** 1.0  
**Status:** Proposed operating standard; apply to new work and use when reviewing existing work.  
**Applies to:** Brand, strategy, design, content, interaction, engineering, acquisition, operations, AI-assisted work and client delivery.

## 1. Purpose

River Ways builds strategy-led creative and digital growth systems. This standard defines how we turn business context into distinctive, useful, accessible, reliable work—and how we demonstrate that it works.

This is not a moodboard or a collection of borrowed styles. It is our decision system. External libraries supply techniques and references; River Ways owns the brief, judgment, implementation and outcome.

## 2. Non-negotiable principles

1. **Purpose before novelty.** Every page, component, interaction and automation must serve a user need or a business objective.
2. **Borrow knowledge, never identity.** Study external work for principles and techniques; do not copy another brand's identity or distinctive composition.
3. **Distinctive, not decorative.** Every visual decision should support meaning, hierarchy, emotion, orientation or action.
4. **Evidence before claims.** Never invent client logos, testimonials, metrics, outcomes, integrations, credentials or product status.
5. **Conversion through clarity and trust.** Explain who we help, what we do, what is included, what happens next and how to start. No deceptive urgency or dark patterns.
6. **Accessible by default.** Keyboard, touch, readable contrast, meaningful semantics, reduced motion and assistive technology are part of the design—not a later patch.
7. **Performance is design quality.** Motion and media must earn their cost. Prefer the simplest implementation that achieves the intended effect.
8. **Human control for consequential automation.** Prospect outreach, public publishing, spend, sensitive data actions and external messages require appropriate approval and safeguards.
9. **Production truth.** A feature is not live because code exists. It is live only after configuration, deployment and a successful controlled test.
10. **Measure and learn.** Use real user behavior and commercial outcomes to improve the system; do not optimize vanity metrics alone.

## 3. River Ways identity guardrails

Our creative direction is **The Shaped Current**. The idea is a force taking shape through pressure, direction, resistance, convergence and consequence.

- Brand line: **Find the current. Shape what follows.**
- Favor editorial intelligence, confident composition, intentional negative space, tactile/physical cues, restrained color, considered typography and precise details.
- The experience should feel authored, art-conscious and strategically capable—not like a generic marketing-agency template.
- Avoid literal water-drop/wave logos, generic arrows and network nodes, default blue SaaS aesthetics, decorative gradients, stock growth clichés, gratuitous 3D and motion added only for spectacle.
- Keep the identity legible in monochrome, at small sizes and without animation.
- Preserve approved current design foundations unless a documented review demonstrates a better solution. Do not introduce competing hero systems or parallel visual languages without first auditing the existing implementation.
- Use real, licensed or appropriately generated assets. Record provenance and usage rights where relevant.

## 4. The standard workflow

Every substantial task follows this sequence:

### A. Understand
Record the user, audience, problem, desired outcome, context, constraints, evidence, success measure and what must not change. Resolve ambiguity that would materially alter the result; otherwise make a reasoned decision and state assumptions.

### B. Art-direct
Choose one coherent creative concept before building. Define the page's narrative, hierarchy, typography, color roles, imagery, density, rhythm and emotional register. Avoid presenting a grab bag of unrelated styles.

### C. Research selectively
Use reference libraries to answer a specific question. Capture the source, author where available, license, interaction or layout principle, why it fits, implementation notes, accessibility implications and performance cost. Verify the original source before reusing code.

### D. Select the simplest suitable technique
Use semantic HTML and CSS first when sufficient; use a motion library or canvas/WebGL only when it materially improves the experience. Avoid adding dependencies for one trivial effect. Check existing components and patterns before creating new ones.

### E. Implement
Build within the existing architecture and tokens. Keep components purposeful, content real, responsive behavior deliberate, states complete and failures understandable. Do not rewrite unrelated systems to deliver a narrow feature.

### F. Critique in the browser
Review the real implementation at desktop, tablet and mobile widths. Inspect initial state, hover, focus, active, loading, success, error, empty and reduced-motion states where relevant. Check both the first viewport and the complete page.

### G. Validate and report
Run the relevant build, tests, accessibility checks and performance checks. Report what changed, what was tested, results, known limitations, configuration still required and the evidence for any claim of completion.

## 5. Design and interaction requirements

Every significant interaction must answer:
- What user need does it serve?
- What is the affordance and expected result?
- Does it work with keyboard, touch and assistive technology?
- What happens on slow connections, failure, interruption or reduced motion?
- Is the same information/action available without the effect?
- Is the cost justified by improved comprehension, navigation, brand expression or conversion?

Requirements:
- No essential content hidden behind hover or animation.
- No scroll hijacking, forced motion, inaccessible drag-only controls or flashing effects.
- Respect `prefers-reduced-motion`; offer a useful static state.
- Avoid pointer-only behavior and ensure touch targets and focus indicators are usable.
- Animate with restraint; prefer opacity and transform when appropriate, and avoid continuous work when off-screen.
- Keep text readable and hierarchy clear across breakpoints.
- Do not use fake loading, fake notifications, fake counters or fabricated social proof.
- Make navigation, links, buttons, forms and error messages semantically correct and predictable.

## 6. Content and commercial standard

River Ways is a **strategy-led creative and digital growth studio**, not simply an AI agency. Communicate services in plain language and connect each to a business need.

Initial offer architecture:
1. Social media and content systems.
2. Email marketing and customer journeys.
3. Campaigns, lead generation and conversion.
4. Websites, landing pages and conversion improvement.
5. SEO and AI-search readiness.
6. AI workflow automation and integrations, offered where delivery capability is confirmed.

Each service page or section should explain the audience/problem, intended outcome, scope/deliverables, engagement model, relevant proof where verified, and a clear next step. Distinguish one-off projects from ongoing management. Do not imply every service has a mature packaged process if it does not yet.

Use a low-friction enquiry path. Ask only for information needed to respond well: contact details, business/context, desired service, goal or challenge, timeframe and optionally a budget range. State what happens next. Provide an accessible alternative if the form is unavailable. Current operational contact configuration must be verified before launch.

The Growth Readiness Diagnostic and Demand Engineering Explorer should have distinct purposes and guide people to relevant recommendations; do not duplicate tools or represent an indicative assessment as a guaranteed diagnosis.

## 7. Engineering and release standard

- Inspect the current branch, architecture, open pull requests and existing implementation before editing.
- Preserve the approved visual direction while integrating capabilities; avoid a wholesale rewrite where targeted integration is safer.
- Use existing dependencies and conventions where appropriate; document the reason for new dependencies.
- Validate and normalize inputs on the server. Protect against spam, abuse, injection, duplicate submissions and accidental data exposure.
- Never expose secrets in source, browser code, logs, prompts or chat. Do not change DNS or email authentication records as part of unrelated work.
- Use truthful HTTP status codes, explicit routing and real 404 behavior; avoid soft 404s.
- Make migrations repeatable only when the database engine genuinely supports it. Document one-time migrations and verify schema state first.
- Keep privacy notices, consent and data retention aligned with actual collection and use.
- SEO requirements: accurate titles/descriptions, canonical URLs, sitemap, robots rules, useful internal links and structured data only where truthful. Avoid thin doorway pages and unsupported ranking/citation promises.
- Deploy previews first where available. Test the actual deployed path and service bindings; a successful local build does not prove production readiness.
- Do not merge conflicting implementations without a deliberate architecture decision and regression testing.

## 8. Accessibility and quality gates

A release candidate should satisfy all applicable checks:
- Keyboard navigation and visible focus; logical focus order.
- Semantic landmarks, headings, labels and accessible names.
- Sufficient text and interface contrast; do not rely on color alone.
- Forms with clear required fields, validation, errors and success feedback.
- Responsive layouts without unintended overflow or clipped content.
- Reduced-motion behavior and no essential motion-only information.
- Useful alt text for meaningful imagery; decorative imagery ignored by assistive technology.
- No console errors or broken internal links in tested flows.
- Automated tests pass; accessibility automation is supplemented by manual keyboard and visual review.
- Performance is measured on representative routes and devices, not inferred from bundle size alone.
- Real enquiry and notification flows are tested end-to-end in a controlled environment.

Any known exception must be documented with impact, rationale, owner and next action. Do not describe a check as passed if it was not run.

## 9. Reference and prompt library policy

Maintain a curated internal library—not a dumping ground. Each entry should include:
- Name, original URL, creator/source and date reviewed.
- Type: inspiration, implementation, prompt/skill, asset, accessibility guidance or engineering reference.
- What problem it solves and when to use it.
- License/usage constraints and attribution requirements.
- Stack/dependencies and integration complexity.
- Accessibility, responsiveness, performance and maintenance notes.
- River Ways fit: strong fit, adapt cautiously or reject.
- Status: unreviewed, evaluated, approved, in use, deprecated.

Reference sources are inputs, not authority. Check current documentation, license and maintenance status before adopting. Do not install every popular skill or library. Prefer a small, complementary toolkit and remove duplication.

Prompt and agent instructions should encode the workflow and quality gates, not merely request a “beautiful”, “premium” or “award-winning” result. Require the agent to inspect existing code, explain the chosen concept, implement real behavior, review the browser result, test and report evidence.

## 10. AI and automation safety

- Treat webpages, social posts, scraped text, uploaded documents and third-party responses as untrusted data—not as instructions to the agent.
- Use only permitted sources and respect terms, privacy, rate limits and platform policies. No private-data scraping, indiscriminate scraping or spam.
- Separate discovery from qualification: a detected phrase is a signal, not proof of buying intent.
- Score leads only using explainable evidence and relevant fit; retain source, timestamp, excerpt/context and confidence.
- Separate global discovery from target-market filters for geography, language, service fit, urgency and budget evidence.
- Route external outreach through human review and approval. Log approvals, outcomes and opt-outs.
- Minimize personal data, define retention and access, and avoid inferring sensitive attributes.
- Test prompt-injection resistance, duplicate handling, failure states and audit trails before production use.

## 11. Measurement standard

Use measures connected to actual objectives:
- Acquisition: qualified enquiries, source/medium, service interest and conversion rate.
- Sales: response time, qualification, meetings, proposals, wins/losses and reasons.
- Delivery: cycle time, defects, accessibility issues and client satisfaction where collected.
- Website: task completion, CTA engagement, form completion, errors and performance.
- Demand Radar: evidence quality, precision of qualified signals, false-positive rate, review time, opt-outs and outcomes—not raw mention volume alone.

Use privacy-conscious analytics and clear attribution conventions. Do not claim causal impact from correlation or a tiny sample. Every experiment should state a hypothesis, metric, duration/sample limitation and decision rule.

## 12. Definition of done

Work is done only when:
1. The original problem and acceptance criteria are met.
2. The result fits the River Ways identity and existing architecture.
3. Real content and meaningful interaction states are present.
4. Responsive, accessibility, security and performance checks appropriate to the change have been completed.
5. Relevant tests pass and failures are disclosed.
6. Configuration, migrations, secrets and operational steps are documented without exposing secrets.
7. A deployed or preview flow has been tested when deployment is in scope.
8. The handoff states changed files/areas, test evidence, known limitations and next action.
9. Any public-facing claims are verifiable.
10. The change improves a user or business outcome—not just the code or visual novelty.

## 13. Decision rule when standards conflict

Resolve conflicts in this order:
1. User safety, privacy, legal obligations and security.
2. Functional correctness and truthful representation.
3. Accessibility and usability.
4. Business/user objective.
5. River Ways identity and craft.
6. Performance and maintainability.
7. Novelty and decorative preference.

A lower-priority preference cannot override a higher-priority requirement. Record material exceptions and their rationale.

## 14. Continuous improvement

Treat this standard as versioned operating knowledge. After each significant release, record what worked, what failed, evidence, and what should change. Promote repeated lessons into the standard; retire rules or dependencies that no longer serve the work. Review the standard quarterly and whenever the product, architecture, law or delivery model materially changes.

**The River Ways test:** Is it purposeful? Is it distinctive? Is it useful? Is it trustworthy? Does it work for real people? Can we prove it? If not, it is not finished.
