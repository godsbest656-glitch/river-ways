# Content, Social-to-Site and Demand Experience System
**Version:** 1.0 | **Prepared:** 9 October 2026  
**Purpose:** Convert social attention and public customer questions into useful, owned, measurable website experiences.

## 1. Strategic belief

Social feeds are excellent at discovery, fast storytelling, conversation and distribution, but a brand usually has limited control over their algorithms, presentation, audience relationship and data access. A website can provide deeper context, useful tools, stable pages, consent-aware follow-up and a measurable next step.

The opportunity for River Ways is not to imitate a social app. It is to join the speed and creative energy of social content with the clarity, utility, credibility and task completion of a good website.

Consumer expectations vary by audience and context. Treat short video, interactive storytelling, personalisation, quizzes, calculators, rich visuals and shareable outputs as patterns to test—not universal requirements. A visitor trying to book a clinic appointment may prefer calm clarity over gamified exploration; a consumer comparing products may appreciate a product finder or configurator.

## 2. Content-to-experience loop

1. **Listen:** collect first-party customer questions, sales objections, search queries, feedback, reviews, and source-permitted public discussion.
2. **Cluster:** group by problem, task, niche, buying stage, urgency and evidence need. Remove duplicates and irrelevant/sensitive data.
3. **Choose:** decide whether the best response is a short social post, long-form guide, service page, interactive tool, live event, downloadable resource, or no content at all.
4. **Create:** use one verified core idea and adapt the narrative to each channel. Keep brand, factual claims and CTA consistent.
5. **Connect:** send visitors to the exact useful destination promised by the post. Use sensible UTMs that never contain personal or sensitive information.
6. **Reward:** the page should provide the promised value without forcing account creation or contact details unless truly necessary.
7. **Continue:** offer a relevant next step (save/share, use another resource, subscribe with clear consent, submit a brief, book a call).
8. **Measure:** distinguish reach from useful engagement, completion, qualified enquiry, pipeline and customer outcome.
9. **Learn:** document what worked, for whom, under what conditions, the sample size/limitations and the next experiment.

## 3. Channel roles

| Channel type | Role | Typical asset | Website destination |
|---|---|---|---|
| Short video (Reels/Shorts/TikTok etc.) | Hook, demonstration, point of view | 15–60 second story, UI demo, before/after only when verified | Interactive explainer, service page, diagnostic or case study |
| LinkedIn/social professional feeds | Insight, credibility, conversation | Framework, founder viewpoint, annotated case, useful checklist | Detailed guide, service page or consultation brief |
| Image carousel | Multi-step explanation, saveable education | 5–10 cards telling one complete story | Original article, tool or resource page |
| Community discussions | Understand problems and answer directly | Contextual expert reply, no disguised advertising | Relevant explanatory page only where genuinely helpful |
| Search and AI discovery | Capture active questions and comparisons | Service page, FAQ, guide, tool or comparison | Canonical, crawlable source page |
| Email/newsletter | Permission-based continuation | Curated insight, tool output, new resource | Personalised-but-transparent content route |
| Events/webinars | Demonstration, trust and interaction | Session, live teardown, workshop | Booking/registration and follow-up resources |
| Paid media | Controlled reach/testing | Clearly labelled ad creative and landing promise | Purpose-built page with consistent message |

Adapt actual video/image ratios, captions, CTA rules and platform policies at the time of production. Do not assume one creative format or length will outperform for every niche.

## 4. Social-inspired website components

A River Ways/client site may include:
- **Interactive carousel or chooser:** visitors explore options at their own pace; arrow keys, focus and touch all work.
- **Tap-to-reveal explainer:** progressive disclosure makes complex information approachable without hiding core copy.
- **Multi-step self-assessment:** brief questions, visible progress, transparent scoring and practical next steps.
- **Calculator:** variables, source/assumptions, ranges, and clear limitations.
- **Build-your-own brief:** visitors select goals, scope, timeline and context; downloadable or submittable output is useful even without lead capture.
- **Interactive map or coverage explorer:** use only when geography genuinely matters and data is current.
- **Shareable result card:** optional share/export that excludes personal data and does not reveal the answer in a guessable URL.
- **Micro-demo:** a small, fast experience that shows how a service/product behaves, labelled as simulated if it is not connected to real data.
- **Story-mode case study:** user controls each chapter, with accessible text version and evidence/source notes.
- **Resource picker:** recommended guide/tool based on the visitor’s stated goal, not opaque tracking.

For every component, document its user purpose, alternative non-interactive path, privacy requirements, failure states, mobile behavior, performance cost and success metric. Do not add a widget just because it is fashionable.

## 5. Creative asset system inspired by production workflows

One core idea can produce:
- a long-form website explainer,
- a concise social video,
- an accessible carousel/diagram,
- an article or checklist,
- a case-study module,
- a talk/workshop slide,
- a newsletter item,
- a campaign variant.

Create one approved factual brief first. Adapt creative expression per channel rather than automatically copying the exact same content everywhere. Keep source files, rights, brand tokens, image alt text, caption/transcript and claim evidence associated with each asset.

Raylight.app can support product-motion exploration and repurposing; it is optional. Ensure each export has the right licence, framing, captions, source assets and human review. A motion clip should not become the only form of an important explanation.

## 6. Editorial standards

Every content item should state:
- Audience and question/problem.
- Desired action or learning outcome.
- Core point in one sentence.
- Original contribution or evidence that justifies publishing it.
- Sources and factual verification.
- Author/reviewer and update date when relevant.
- CTA and destination.
- Accessibility requirements (alt text, captions, transcript, contrast).
- Distribution/repurposing plan.
- Intended metrics and guardrails.
- Rights, consent, privacy and embargo constraints.

Use an editorial status flow: idea → validation → brief → draft → factual/claim review → accessibility/SEO review → brand approval → publish → measure → maintain/update/archive.

Do not use generic AI copy at scale as a substitute for expertise. AI can assist outlining, transformation, accessibility checks and variants, but a qualified human must verify claims, examples, source citations, tone and niche context.

## 7. Demand signal intake and consent-aware follow-up

A public mention or keyword is not always a buying signal. A high-quality signal needs relevance, context, fit, recency, explicitness and source permission.

Recommended statuses:
- New / unreviewed.
- Irrelevant or false positive.
- Potentially relevant / needs context.
- Qualified for human follow-up.
- Responded.
- Converted / not converted.
- Closed with reason.

Store only necessary context, original public source link, timestamp, keyword/query version, confidence/reason and review decision. Avoid profiling individuals based on sensitive attributes or vulnerabilities. Do not use fake accounts, evade platform restrictions, automate spam, or message everyone who uses a target phrase.

Default to human-approved response with a contextual, useful answer. Respect opt-outs, communities' norms, platform terms and applicable laws.

## 8. UTM and conversion instrumentation

Use consistent parameters such as source, medium, campaign and creative/content variant. Values should name the campaign asset, not the person. Never place email addresses, phone numbers, health/financial details, message content or another personal identifier in a URL/query parameter.

Suggested events:
- primary_cta_click
- service_card_open
- diagnostic_start
- diagnostic_complete
- calculator_complete
- resource_download
- consultation_start
- lead_submit_success
- lead_submit_error
- booking_complete
- qualified_lead (server/CRM source when appropriate)

Define each event in a schema with purpose, trigger, properties, source, owner, retention and privacy classification. Do not send sensitive form values as analytics properties. Verify events with test records, use deduplication and document attribution limitations.

## 9. Editorial and conversion experiment backlog

Start with a small set of hypotheses:
1. Does an interactive Demand Engineering explainer improve qualified service exploration versus static copy?
2. Does a transparent readiness diagnostic generate more useful consultations than a generic “Contact us” CTA?
3. Does showing the methodology before the CTA improve lead fit?
4. Does a short accessible product demo help visitors understand Demand Intelligence?
5. Does an industry-specific page answer buyer questions better than the services index?
6. Does a downloadable brief output deliver value to visitors who do not want to submit a form?
7. Does shortening the enquiry form increase qualified completion without reducing lead information quality?

For each experiment, define audience, baseline, primary metric, guardrail, sample size/limitations, test duration, and decision criteria. Avoid shipping multiple simultaneous changes that make it impossible to interpret the result. Use qualitative feedback alongside analytics.

## 10. Resource and reference list
- Raylight product motion: https://www.raylight.app/
- Raylight MCP: https://www.raylight.app/mcp
- Raylight launch video use case: https://www.raylight.app/use-cases/launch-videos
- Google Search Central people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Analytics event guidance: https://support.google.com/analytics/answer/9322688
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Apple motion HIG: https://developer.apple.com/design/human-interface-guidelines/motion
- Nielsen Norman Group usability heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- Google Search Console: https://search.google.com/search-console/
- TikTok for Developers: https://developers.tiktok.com/
- YouTube Data API: https://developers.google.com/youtube/v3
- LinkedIn Developer Platform: https://developer.linkedin.com/
- Meta developer docs: https://developers.facebook.com/docs/
