# River Ways Website — Architecture

## Product objective
Build an accessible, responsive marketing website for River Ways, a strategy-led creative and digital growth studio. The site should help qualified prospects understand the offer, explore service families, and start a conversation.

## Initial stack
- React + Vite for a lightweight component-based frontend.
- Plain CSS with design tokens to keep styling fast and maintainable.
- Semantic HTML and accessible interactions; respect reduced-motion preferences.
- Static-first delivery with no secrets or credentials in client code.
- Free-to-use Unsplash image URLs for editorial/hero photography; replace with locally optimized assets or approved image CDN during production hardening.

## Information architecture
1. Home / hero: “Find the current. Shape what follows.” and a direct project enquiry CTA.
2. Problem framing: connect disconnected marketing activity to measurable demand.
3. Services: Content & Social Systems; Email & Customer Journeys; Campaigns, Leads & Conversion; Websites & Landing Pages; Search & AI Discovery; Automation & Marketing Operations.
4. Demand Intelligence workflow: signals → qualification → alert → human follow-up → learning loop.
5. Operating approach: diagnose, engineer, activate, measure, improve.
6. FAQ: clarify fit, measurement, global scope, and implementation expectations.
7. Contact / consultation request.

## Conversion principles
- One primary action repeated consistently.
- Secondary action for exploring services.
- Clear service descriptions and outcomes without fabricated testimonials, clients, performance figures, or guarantees.
- The project brief posts to the Cloudflare Pages Function at `/api/contact`. The function validates and rate-limits submissions, stores leads in D1, deduplicates identical briefs for two minutes, and attempts a Resend notification. Configure and verify the external services before claiming production readiness.

## Search and discovery
- Descriptive title and meta description, canonical URL uses the current production domain, Open Graph metadata, robots.txt, sitemap, and Organization/ProfessionalService JSON-LD with only verified details.
- Semantic headings, descriptive links, useful service copy, crawlable internal anchors, and performance-conscious media.
- GEO/AIO/answer-engine optimization is treated as content clarity and entity consistency, not a guarantee of inclusion in AI answers.

## Security and quality
- Baseline static response headers are defined in `public/_headers`; verify actual deployed headers and add a carefully tested CSP before production hardening.
- Never place API keys, provider tokens, analytics secrets, or customer data in the frontend or repository.
- Use dependency lockfiles and CI build checks once dependencies are installed.
- Client-side checks support usability; the server validates, bounds and rate-limits every submission.
- Add consent-aware analytics only after selecting a provider and defining the privacy notice.

## Future integrations
- Global keyword and social listening provider(s), source-specific terms of service, deduplication, confidence/scoring, lead alerts, CRM handoff, and auditable human follow-up.
- Secure backend/webhooks for form submission and alerts.
- Analytics/conversion events and consent management.
- Dedicated personal brand at femi.riverwayse.com.

## Deployment notes
- Vite build output is `dist/`.
- The current deployment target is Cloudflare Pages. Pages Functions, D1 binding, redirects, 404 behavior and headers must be verified on a deployed preview; do not assume Netlify settings apply.
- Verify the final domain, contact destination, privacy policy, service claims, image choices, and form endpoint before production.
