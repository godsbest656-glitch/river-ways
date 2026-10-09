# Riverwayse Creative & Engineering Constitution

**Version:** 1.0  
**Status:** Working standard for implementation and review  
**Applies to:** Website, landing pages, campaign pages, interactive experiences, content and future demand-intelligence interfaces.

## 1. Product principle

Riverwayse serves commercially ambitious, art-conscious people. The website must demonstrate judgement and taste—not merely claim them. Hallmark's useful principle is adopted as a quality discipline: resist interchangeable, template-shaped output; make every page feel intentionally composed; critique the result before release. This is an original Riverwayse system, not a copy of another site's visual identity or code.

**Decision test:** Every page needs a visual idea. Every interaction needs a purpose. Every claim needs evidence. Every next step needs to be clear.

## 2. Experience principles

1. **Art direction before decoration.** Define the idea, emotional register, composition, image treatment and hierarchy before adding effects.
2. **Composition with intent.** Use scale disparity, asymmetry, negative space, frame-within-frame, cropping, visual rhythm, contrast and form substitution when each supports the message. Do not force every technique into every section.
3. **Structural variety.** Avoid repeating one card grid as the answer to every content problem. Let editorial stories, process explanations, service comparisons and calls to action have distinct layouts.
4. **Commercial clarity.** A visitor should understand who Riverwayse helps, what problem it solves, how it works and what to do next.
5. **Evidence over theatre.** Do not invent client logos, testimonials, case-study outcomes, audience numbers, guarantees or performance claims.
6. **Motion with meaning.** Motion should communicate state, guide attention or reveal structure. Respect the prefers-reduced-motion setting; avoid motion that delays comprehension or blocks access.
7. **Mobile is a designed experience.** Recompose layouts for small screens instead of merely shrinking desktop sections.
8. **Inclusive by default.** Use semantic HTML, keyboard-accessible controls, visible focus, readable contrast, useful alt text and clear form errors. Target WCAG 2.2 AA.
9. **Performance is part of craft.** Prefer light, purposeful animation; responsive/compressed images; minimal dependencies; and stable layouts.
10. **Originality without obscurity.** Surprise the visitor visually, not by hiding navigation, disguising links or making basic tasks difficult.

## 3. Content and conversion

- Lead with the customer's situation and desired progress, not a list of agency capabilities.
- Make primary and secondary actions visually distinct and consistent.
- Explain Demand Engineering as a connected operating system: discover signals → interpret demand → activate the right message/channel → convert → measure → learn.
- Explain Demand Intelligence as a proposed capability unless the selected data sources, backend, alerts and human review workflow are actually connected.
- Never imply that a contact form has transmitted data when it only opens a local email draft.
- Keep copy specific, plain-spoken, useful and verifiable. Remove generic filler and unsupported superlatives.
- Use case studies only when client permission and outcome evidence exist; otherwise label demonstrations as concepts or illustrative examples.

## 4. Visual quality review

Score each dimension from 1–5 and record the reason:
- Originality and fit: 25%
- Composition and hierarchy: 25%
- System coherence: 20%
- Craft and interaction quality: 15%
- Commercial relevance: 15%

**Release threshold:** weighted score at least 80/100, with no dimension below 3/5. This score does not override accessibility, security, broken-functionality or factual-accuracy failures.

Before approval, ask:
- Could this page be mistaken for dozens of other agency sites?
- Is the layout driven by the content, or by a repeated template?
- Does the visual hierarchy survive a quick scan and a narrow viewport?
- Are image selection, crop, contrast, typography and whitespace deliberate?
- Does each animation improve understanding?
- Are all CTAs, forms, menus and links usable by keyboard and touch?
- Does the page remain understandable with reduced motion and without decorative imagery?
- Are all factual claims and integrations accurately represented?

## 5. Engineering and security rules

- Preserve the current site and production domain while work is developed on a feature branch and previewed.
- Do not switch DNS, replace production, delete the existing hosting configuration or publish to production without explicit approval.
- Never commit credentials, tokens, customer data or secrets to the repository or browser bundle.
- Treat all form input as untrusted. Client validation is for usability; server-side validation, spam controls and rate limits are required before a real submission endpoint is launched.
- Keep dependencies purposeful and reviewed. Build must pass before release.
- Keep security headers aligned with actual external resources and test them in the deployed preview. Avoid adding third-party scripts without a defined purpose and privacy review.
- Do not automate unsolicited outreach from public intent signals. Respect source terms, applicable privacy rules, platform policies and human review.
- Use Cloudflare Pages for this static Vite site unless repository evidence establishes a need for Workers. Do not introduce Vercel-specific deployment configuration.

## 6. Definition of done

A change is done only when:
- Its purpose and acceptance criteria are documented.
- The implementation matches the intended art direction and responsive behavior.
- Navigation, forms, interactions, error states and reduced-motion behavior are checked.
- Build succeeds and there are no known critical console/runtime errors.
- SEO metadata, headings, links, image alternatives and structured data are reviewed where relevant.
- Security headers and routing are checked on a Cloudflare preview.
- Performance and accessibility are reviewed; target Core Web Vitals at the 75th percentile when sufficient field data exists: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Known limitations are recorded and no unverified claims are presented as completed work.
- A human approves the preview before production promotion.

## 7. Defect severity and release gates

- **Critical:** data exposure, compromised security, broken site-wide navigation, or inaccessible core task. Block release.
- **High:** primary conversion path broken, severe mobile failure, major factual misrepresentation or widespread accessibility failure. Block release.
- **Medium:** meaningful but localized usability, layout, content or performance issue. Fix before launch unless explicitly accepted with a documented reason.
- **Low:** minor polish issue with no material impact. Track and schedule.

A security-critical defect cannot be waived as a design preference. No approval by silence.

## 8. Change record

For each meaningful release, record the purpose, files changed, build/test evidence, known risks, preview URL, reviewer and production approval.
