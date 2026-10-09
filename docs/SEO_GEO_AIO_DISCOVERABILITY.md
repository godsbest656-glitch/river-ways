# SEO, GEO/AIO and Discoverability Standard
**Version:** 1.0 | **Prepared:** 9 October 2026  
**Purpose:** Make River Ways and client websites technically discoverable, useful for real search journeys, consistent in identity, and measurable across organic search and AI-assisted discovery without promising rankings.

## 1. Core principle

Search engines and AI search experiences need reliable access to helpful, clear content. Do not treat SEO, GEO, AIO and AEO as separate magic systems. The practical foundations remain accessible pages, sound technical structure, useful and original content, clear entity identity, strong information architecture, a good user experience, and credible evidence.

Google's published guidance says existing SEO best practices apply to its AI search features; eligibility does not guarantee crawling, indexing or display. Its guidance discourages low-value AI-specific gimmicks, unnecessary machine-readable files, keyword stuffing, fake mentions and third-party claims of access to internal ranking data. Review current primary guidance before implementation.

## 2. Search objectives before keywords

For each site and niche, document:
- Target business result (qualified enquiry, purchase, booking, application, download, or another meaningful conversion).
- Audience, market, language and user intent.
- Services/products available, claims and evidence approved, exclusions and actual delivery geography.
- Primary query themes and audience questions, gathered from Search Console, interviews, CRM/sales questions, permitted social listening, keyword data and competitor analysis.
- Landing page intended to answer each cluster.
- CTA and conversion event.
- Current baseline, owner, review interval and quality constraints.

Never make a page primarily to match a keyword if it cannot provide a distinct, useful answer or service.

## 3. Information architecture and URL standards

- Organise by user need: home, services, useful service detail, audience/use case where validated, evidence/work, about, insights/resources, contact, and trust/legal pages.
- Use stable, descriptive, readable paths, for example "/services/demand-engineering/" or "/insights/website-interactivity/" when these pages genuinely exist.
- One canonical URL per intended page; use redirects when changing URLs. Do not publish multiple copies of the same service page for city/keyword permutations.
- Maintain working internal links and breadcrumbs when useful.
- Create an HTML sitemap or helpful navigation for users where information architecture warrants it; XML sitemap is for discovery by crawlers.
- Canonical, sitemap, robots rules, OG tags and structured data must use the confirmed production URL and match hosting/redirect behavior.
- Do not block CSS/JS/assets required for rendering or accidentally noindex the production site.
- Preview/test domains should not compete in search with production; apply noindex/auth controls as appropriate for the actual deployment.
- Treat the main River Ways URL structure and existing riverwayse.com domain as an explicit continuity decision. Do not change nameservers/DNS to align brand/domain spelling without a separate migration plan.

## 4. On-page standard

Each indexable page should have:
- One clear page purpose and meaningful title.
- A concise, accurate meta description that helps people choose the result (not a claimed ranking factor guarantee).
- A clear main heading and logical section headings.
- A fast, visible, useful start; the main point must not be locked behind animation.
- Original body copy that demonstrates experience, scope, evidence and limitations.
- Descriptive links and meaningful anchor text.
- Relevant internal links to related resources/service steps.
- Images/video that improve understanding, appropriate alt text and accessible captions/transcripts when audio/video communicates meaning.
- CTA consistent with the visitor's intent and readiness.
- Source/reviewer/date for time-sensitive or consequential claims.
- No copied copy, keyword stuffing, fake authority, hidden text or misleading structured data.

## 5. Service, niche and resource page specification

A service page should cover audience, problem, signs/trigger, outcome, scope/deliverables, method, dependencies, proof or evidence limitation, FAQs, CTA, and related resources. A niche page must add genuine sector-specific knowledge and use cases, not simply swap industry labels in a template.

An insight/resource page should offer original explanation, a usable framework/tool, sources where claims rely on external facts, author/reviewer as appropriate, last-reviewed information when relevant, internal pathways, and a clear next step. Do not publish an article merely to hit an editorial calendar.

For interactive tools, keep important explanatory text accessible to search engines and assistive technology; create shareable URLs only if useful and privacy-safe; distinguish examples from live data; explain calculator assumptions and dates; and provide an accessible textual output.

## 6. Entity and structured data

- Establish one consistent real-world identity: River Ways (public brand), verified contact details and the actual canonical domain. The historic domain spelling may differ from the public brand spelling; be explicit and consistent rather than silently changing the domain.
- Choose structured data type only when it describes visible and accurate content. Consider Organization, WebSite, BreadcrumbList, Service (where appropriate), Article, Person, Product, Event or other supported types only when actually applicable.
- Don't create fake aggregate ratings/reviews, false locations, invented awards, hidden content or schema that promises eligibility.
- Validate with Schema.org Validator and Google Rich Results Test; check that each change matches the page after deployment.
- Do not assume schema creates a search feature or guarantees AI citations.

## 7. Local and global discovery

### Local businesses
- Complete and maintain eligible Google Business Profile and Bing Places entries where they exist and are accurate.
- Ensure name, address, phone, hours, service area and category are truthful and consistent.
- Use location pages only where River Ways/client genuinely serves a location and can add locally useful details.
- Do not invent local offices or publish fake locations/reviews.
- Support local enquiries with accessible maps, directions and contact alternatives without loading heavyweight maps unnecessarily.

### International
- Decide which locales justify dedicated content based on delivery capability and demand.
- Use appropriate language/region URLs and hreflang only when the pages are genuine equivalents and fully reviewed.
- Localise terminology, dates, currencies, measurement units, phone forms and legal disclosures with human review in high-stakes sectors.
- Verify source coverage and query intent for each market; translations of one generic page do not create topical authority by themselves.
- Consider regional privacy law, accessibility expectations, consumer protection, advertising rules and platform terms.

## 8. AI search and agent-friendly pages

For AI overviews, AI modes, answer engines and browsing agents:
- Keep content crawlable and available as text, not just inaccessible canvas or text baked into images.
- Put the answer and its caveats in a clear, understandable form; use descriptive headings and well-labelled tables/lists when genuinely useful.
- Cite primary sources for external factual claims and disclose authorship/review where appropriate.
- Use accurate organization/service identity and structured data that mirrors visible content.
- Avoid fabricated experience, copied pages, keyword stuffing, mass-generated low-value content, and fake third-party mentions.
- Don't block user agents you intend to allow without an explicit policy decision, and don't assume every AI crawler will follow identical rules.
- Consider agent usability: semantic controls, clear labels, stable direct URLs, understandable page state, accessible forms, and no essential workflow locked behind a complex animation.
- Review Google Search Console reports and actual referrals where available. Treat third-party AI-visibility estimates as directional, not proof of presence in proprietary systems.
- Do not create llms.txt or other speculative machine files as a substitute for solid pages; add such files only for a documented, evidenced use case and after checking current platform guidance.

## 9. Crawl/index QA checklist

- [ ] One intended indexable URL per page; canonical points to the verified canonical host.
- [ ] HTTP/HTTPS and apex/www redirect behavior is intentional, singular, and tested.
- [ ] XML sitemap includes only canonical, useful, indexable URLs.
- [ ] Robots.txt allows intended pages/assets and points to the correct sitemap.
- [ ] No accidental noindex on production.
- [ ] Important navigation uses crawlable links, not only event handlers.
- [ ] JavaScript-rendered core content works for users and crawlers.
- [ ] 404, redirect chains, trailing slash and duplicate URL behavior are checked.
- [ ] Metadata, Open Graph, social card and structured data match visible copy and current brand.
- [ ] Titles and descriptions are unique and accurate.
- [ ] Internal links point to existing pages.
- [ ] Page content has been reviewed for originality, usefulness, factuality and claims.
- [ ] Search Console/Bing properties verified; sitemap submitted where appropriate.
- [ ] Post-release URL inspection performed for the homepage and key service pages.

## 10. Measurement framework

Measure in layers:
1. **Index health:** valid indexed pages, crawl errors, canonical selection, sitemap processing.
2. **Discovery:** impressions, clicks, queries, landing pages, country/language/device and branded vs non-branded discovery.
3. **Engagement quality:** useful visits, interaction completion, meaningful engagement; do not overvalue time on page without context.
4. **Conversion:** CTA use, qualified form submissions, bookings, downloads and tool completions.
5. **Business outcome:** qualification, meeting attendance, opportunity, revenue/pipeline where known and appropriately attributable.
6. **Risk/quality:** performance, accessibility defects, complaints, irrelevant enquiries, form spam and claim correction rate.

Establish baselines before redesign/migration. Keep field-performance and lab-audit data distinct. Annotate significant launches, URL changes, campaigns and search updates. Avoid attributing causality to a single design change without sufficient evidence.

## 11. Source register

- Google Search Central docs: https://developers.google.com/search/docs
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
- Generative AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Structured data: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Search Console: https://search.google.com/search-console/
- Bing Webmaster Tools: https://www.bing.com/webmasters/
- Bing guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Schema.org: https://schema.org/
- Schema validator: https://validator.schema.org/
- Rich Results Test: https://search.google.com/test/rich-results
- Sitemap protocol: https://www.sitemaps.org/protocol.html
- Robots Exclusion Protocol: https://www.rfc-editor.org/rfc/rfc9309
- Google Trends: https://trends.google.com/
- Plain Language: https://www.plainlanguage.gov/
