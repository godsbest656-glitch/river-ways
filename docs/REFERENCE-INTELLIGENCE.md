# Riverwayse Design Reference Intelligence

**Status:** Active research brief  
**Purpose:** Improve the originality, visual judgement and implementation quality of Riverwayse's Demand Engineering website without copying other studios.

## Reference set

### 1. GetLayer
- URL: https://getlayer.io
- Research status: URL supplied by Riverwayse; detailed page-level findings still need a manual/live-browser review.
- Inspect: art direction, type scale, composition, project storytelling, navigation, transitions, mobile behaviour, performance and accessibility.
- Do not record a design claim as verified until a reviewer has inspected the live page and captured the relevant URL/screenshot.

### 2. TEXTURA Agency
- Main site: https://textura.agency/
- Projects: https://textura.agency/projects
- Useful project pages:
  - MetaDeck: https://textura.agency/projects/metadeck
  - Furniture Presence: https://textura.agency/projects/furniture
  - Sequoia: https://textura.agency/projects/sequoia
- Research observations from the published site: bespoke digital positioning; work spanning web development, branding, UX/UI, 3D and motion; project pages explain deliverables and intent. Some projects use immersive or animated presentation.
- Transferable lessons: make work itself the proof; articulate the idea behind each project; treat motion/3D as purposeful craft; create a strong distinction between overview and case-study pages.
- Do not copy its brand, copy, layouts, assets, motion choreography or project work.

### 3. Broader discovery sources
- Awwwards: https://www.awwwards.com/
- SiteInspire: https://www.siteinspire.com/
- Godly: https://godly.website/
- Use these as discovery indexes, then inspect the actual source website. An award or gallery listing is not proof of usability, accessibility, responsive quality or performance.

### 4. Social discovery
Use public agency pages, public portfolio posts and publicly accessible launch announcements on Facebook and other social channels to discover new work. Store the original post URL and the actual project URL separately. Validate claims and inspect the live website before adopting a reference.
- Do not scrape private groups, bypass access controls, collect unnecessary personal data or automate unsolicited outreach.
- Respect platform terms, applicable privacy requirements and copyright.
- Reuse only assets with an appropriate licence or explicit permission; inspiration is not permission to copy.

## Reference capture template

For every candidate, record:
- Studio / project:
- Original post URL (if discovered socially):
- Live website URL:
- Date reviewed:
- Reviewer:
- Screenshot / recording location:
- Page and viewport inspected:
- Distinctive design idea:
- Typography and hierarchy:
- Composition / grid / whitespace:
- Image treatment and asset provenance:
- Motion / interaction and reduced-motion behaviour:
- Mobile experience:
- Accessibility observations:
- Performance observations:
- What Riverwayse can learn:
- What must not be copied:
- Confidence: observed / inferred / unverified.

## Riverwayse evaluation rubric

Score each from 1–5 and provide evidence:
1. Originality and fit (25%)
2. Composition and hierarchy (25%)
3. Design-system coherence (20%)
4. Interaction and craft (15%)
5. Commercial relevance (15%)

Weighted total = sum(score / 5 × weight). Target at least 80/100 and no dimension below 3/5. This is not a substitute for accessibility, factual, security or functional release gates.

## Riverwayse art-direction guardrails

- Keep the Demand Engineering proposition clear: connect market understanding, demand signals, strategy, discovery, conversion, measurement and learning.
- Prefer editorial hierarchy, deliberate asymmetry, negative space, purposeful image-making, confident typography and varied section compositions over a repeated grid of identical cards.
- Use motion only when it explains state, guides attention or adds meaningful narrative. Respect reduced-motion preferences.
- Do not add 3D, gradients, glass panels, stock imagery or decorative dashboards simply to make the site appear sophisticated.
- No invented clients, testimonials, case-study outcomes, performance metrics or connected capabilities.
- Keep conversion paths obvious and usable on mobile.
- Preserve Riverwayse's identity; references are inputs to judgement, not templates.

## Workflow

1. Discover references from galleries, public social posts and agency portfolios.
2. Verify the original website and capture evidence.
3. Write a short design critique before implementation.
4. Translate only the underlying lesson into Riverwayse-specific design decisions.
5. Implement in a feature branch and keep production untouched.
6. Run build, browser, responsive, accessibility and visual-regression checks.
7. Review a live Cloudflare preview at desktop and mobile sizes.
8. Record the decision and evidence before approving a release.
