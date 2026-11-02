# River Ways — Design & Implementation Brief

**Status:** Working implementation brief for the SHAPED CURRENT website direction  
**Applies to:** The River Ways public website in this repository  
**Authority:** Use alongside the approved River Ways strategy and governance documents. This brief does not approve a new logo, brand identity, public claims, portfolio items, pricing, or production deployment.

## 1. Product and business purpose

River Ways is a global-facing creative demand engineering agency. The website must help the right buyer understand the business problem River Ways solves, see the breadth and relationship of its capabilities, assess credibility, choose a relevant next step, and start a useful conversation.

The site is not a generic digital-agency brochure. It must connect the following disciplines into a coherent business system:

- Positioning, market understanding and go-to-market strategy.
- Demand creation, content and creative.
- Search, SEO, AI discovery and visibility.
- Websites, digital products and conversion experiences.
- Performance marketing, experimentation and measurement.
- Demand intelligence, lead workflows, CRM, automation and connected business systems.
- Bespoke digital platforms, applications, dashboards and AI-enabled integrations where relevant.

Explain outcomes and buyer problems before listing tools or mechanisms. Do not imply that every engagement includes every capability.

## 2. Strategic narrative

The central idea is **creative demand engineering**: bringing intelligence, creativity and systems together to turn complexity into purposeful progress.

The governing River philosophy is a strategic lens, not a literal illustration brief:

- The River has a way and a life.
- It exists within an environment and responds to seasons and people.
- People are ecosystems the River is part of; some depend on it for survival.
- It forms and supports life.
- Its direction and end goal are the ocean.

Translate this into interdependence, force, formation, confluence, adaptation, direction, purpose, life and consequence. Avoid stock river imagery, literal water metaphors in every section, and decorative waves without meaning.

## 3. Design direction: SHAPED CURRENT

Use the existing SHAPED CURRENT direction as the provisional visual foundation. Do not restart earlier routes or reintroduce the rejected terracotta / near-black / warm-parchment identity.

### Color tokens

Treat these as the current implementation tokens, subject to contrast verification:

- Deep current: `#06243A`
- Supporting deep blue: `#092B42`
- Current blue: `#168BB7`
- Sky accent: `#A9E8F7`
- Ice surface: `#E8F7FB`
- Light page surface: `#F5FBFD`
- Primary text: `#102B3C`
- Muted text: `#587181`
- Divider: `#D8E8EF`

Use the sky accent sparingly for emphasis and action. Maintain clear contrast on light and dark surfaces. Avoid adding unrelated accent colors. The palette is not a substitute for hierarchy, typography, composition or art direction.

### Typography

- Use the existing Manrope and Newsreader font setup unless a deliberate, tested change is proposed.
- Use a restrained editorial hierarchy: confident display typography, readable body copy, compact labels and generous line-height.
- Avoid oversized text on every section, excessive uppercase labels, and decorative italic serif treatment as a default.
- Keep body copy comfortable on narrow screens and avoid long line lengths.

### Composition and visual language

- Build a coherent visual system from alignment, spacing, scale, rhythm, grids, depth and purposeful contrast.
- Prefer a few strong, memorable compositions over repeated generic cards.
- Use cards when they clarify comparison, sequence, status or a distinct unit of information—not as the default layout for every section.
- Make images earn their place. Use relevant, properly licensed imagery with clear subject and art direction; do not use generic stock merely to fill space.
- Use diagrams and data-like visuals only when they explain a real relationship or process. Label conceptual illustrations as conceptual; never present invented data as live performance.
- Keep the existing mark provisional. Logo exploration and identity approval are out of scope for this website implementation and must not block progress.

## 4. Experience and information architecture

The site should make these questions easy to answer:

1. What does River Ways help a business achieve?
2. What kinds of problems and capabilities can River Ways address?
3. How do those capabilities work together?
4. Is River Ways relevant to my business stage, market and complexity?
5. What evidence supports the claims?
6. What happens if I enquire?

Use clear pathways for founders, growth-stage businesses and enterprise or multi-market buyers where useful. Do not create empty audience pages just to imply segmentation.

Recommended information architecture to validate against the existing implementation:

- Home: proposition, buyer relevance, connected capabilities, proof, engagement path and clear CTA.
- Capabilities: grouped by buyer problem and outcome, with service detail where justified.
- Work / case studies: only verified projects with approved evidence, role, scope and outcomes.
- Approach: how River Ways diagnoses, prioritizes, builds, activates and improves.
- About: operating philosophy, point of view and team/company facts that can be substantiated.
- Contact / enquiry: concise, accessible brief and a clear expectation for what happens next.

Do not publish unsupported claims, fabricated client logos, invented metrics, testimonials, credentials, awards, or implied partnerships. Candidate projects mentioned in prior discussions are leads for evidence gathering, not automatically approved case studies. Absence from this repository does not establish that work does not exist.

## 5. Conversion and acquisition

The website is one part of the hybrid River Ways acquisition engine, whose initial target market is global.

- Make the primary next step obvious without forcing visitors through animation or multiple unnecessary steps.
- Offer a useful, specific enquiry path; capture only information needed to route and qualify the conversation.
- Explain what happens after submission and avoid promising a response time unless operationally guaranteed.
- Do not call a mailto fallback a submitted enquiry. The current form opens the visitor's email client; clearly preserve that disclosure until a secure server-side endpoint is implemented and verified.
- Do not claim that leads are stored, notifications sent, bookings created or CRM records updated unless the complete path has been tested.
- Keep outreach respectful, contextual and human-reviewed. Do not imply indiscriminate scraping, automated unsolicited messaging or access to private intent data.

## 6. Motion and interaction

Motion should explain relationships, guide attention or make the experience more legible. It must not delay comprehension.

- The hero should communicate River Ways' value immediately, even if all motion and imagery are disabled.
- Prototype in semantic HTML, CSS and the existing React stack first. Use Motion or GSAP only when a clear interaction requires it.
- Use Three.js only when a tested 2D/CSS approach cannot achieve a meaningful outcome and the added complexity is justified.
- Keep motion short, purposeful and interruptible. Avoid forced scroll, scroll hijacking, perpetual high-amplitude movement and animation that competes with reading.
- Pointer response is enhancement only; touch users must retain a complete experience.
- Honor `prefers-reduced-motion` and provide static alternatives. Reduced motion must not hide content or remove essential information.
- Ensure all interactive elements work by keyboard and expose clear focus states and semantic roles.

## 7. Responsive, accessible and resilient implementation

Target WCAG 2.2 AA as the acceptance baseline.

- Semantic landmarks, logical heading order, descriptive links, accessible form labels and useful error messages.
- Keyboard access for navigation, tabs, accordions, menus and all interactive elements.
- Visible focus that is not obscured by sticky navigation.
- Sufficient text and non-text contrast; do not rely on color alone.
- Touch targets and spacing appropriate for mobile.
- No horizontal overflow at 320px; test common phone, tablet and desktop widths.
- Meaningful alt text for informative images; decorative images should not add noise to assistive technology.
- Preserve content and navigation when JavaScript, remote fonts, images or animation fail where practical.
- Avoid layout shifts; reserve image dimensions and lazy-load below-the-fold media.
- Do not add third-party trackers, embeds, fonts or packages without checking privacy, performance, licensing and necessity.

## 8. Technical implementation rules for coding agents

Before changing code:

1. Inspect the current branch, package scripts, component tree, styles, routes, assets and existing tests.
2. Identify existing functionality and preserve it unless a specific change is required.
3. Map proposed selectors to real rendered elements. Do not add large CSS layers based on assumed class names.
4. Read existing brand and governance docs before proposing new copy or visual direction.
5. Identify whether a change affects production behavior, forms, APIs, SEO, analytics, deployment or infrastructure.

While implementing:

- Work in a feature branch and make small, reviewable commits.
- Prefer targeted edits over wholesale replacement of working files.
- Reuse existing dependencies and components. Do not add packages just for novelty.
- Keep content, presentation and interaction responsibilities understandable.
- Avoid fake dashboards, fake live indicators, fabricated counts, placeholder logos and nonfunctional controls.
- Keep secrets out of source control and logs.
- Do not change DNS, Cloudflare routing, production secrets, database state, email configuration or deployment settings as part of visual work.
- Do not merge or deploy without explicit owner approval.

## 9. Quality gates — evidence required

A successful build is necessary but not sufficient. Before a change is considered ready, record evidence for:

### Visual
- Desktop, tablet and mobile screenshots at representative widths.
- No unintended legacy palette remnants or inconsistent component treatments.
- Clear hierarchy, balanced density, legible typography and purposeful imagery.
- No clipped, overlapping or off-screen content.

### Functional
- Navigation and mobile menu.
- All links and CTAs.
- Tabs, accordions and any interactive diagrams.
- Form validation, success/error behavior and actual delivery path.
- Fallback behavior when scripts or external assets fail.

### Accessibility
- Keyboard-only walkthrough.
- Screen-reader semantics for controls and status messages.
- Contrast checks and reduced-motion checks.
- Automated axe checks plus manual review.

### Performance and search
- Production build and preview smoke test.
- Core Web Vitals / Lighthouse baseline and regression review.
- Responsive image sizing, lazy loading and font loading behavior.
- Title, description, canonical, Open Graph, robots, sitemap and structured data consistency.
- No console errors, failed critical requests or hydration errors if SSR/prerendering is present.

### Release integrity
- Preview URL and exact commit SHA recorded.
- Contact flow tested end-to-end without sending test data to real prospects.
- Production remains unchanged until explicit approval.
- Clearly distinguish verified results, pending checks and known limitations.

## 10. Resource use policy

The resource library in `docs/design/CREATIVE_AND_AI_RESOURCE_LIBRARY.md` is a research index, not an instruction to install everything.

Evaluate each candidate for:
- Current availability and maintenance.
- License and commercial-use rights.
- Pricing and whether a free path is genuinely usable.
- Security, permissions, data handling and supply-chain risk.
- Accessibility, performance and compatibility with the current stack.
- Whether it improves the actual user experience.

Use inspiration references to understand principles, not to copy another studio's layout, code, assets, identity or distinctive interaction.

## 11. Immediate implementation sequence

1. Reconcile the SHAPED CURRENT CSS with the actual rendered app; remove legacy palette conflicts and hard-coded visual colors where appropriate.
2. Define and approve the page narrative and buyer journey before expanding page count.
3. Build a focused hero and first-screen composition that explains the proposition without requiring animation.
4. Improve capability architecture and show how services connect to business outcomes.
5. Establish a credible work/proof system using only verified material.
6. Improve enquiry experience while explicitly preserving the current mailto limitation until server-side delivery is implemented and tested.
7. Validate responsive behavior, accessibility, performance, SEO and functional paths.
8. Review preview evidence with the owner before any merge or production release.

**Definition of done:** the site is clear, credible, distinctive, accessible, responsive, performant and conversion-ready; its claims are supportable; its interactions work; and its release state is honestly reported.
