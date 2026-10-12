# Riverwayse Website — Architecture

## Product objective

Build a conversion-focused, accessible, responsive marketing website that positions Riverwayse around demand generation and Demand Engineering. The website should help qualified prospects understand the offer, explore services, and start a conversation. Riverwayse's audience is art-conscious; composition and visual judgement are part of the product experience, not a layer of decoration.

## Initial stack

- React + Vite for a lightweight component-based frontend.
- Plain CSS with design tokens to keep styling fast and maintainable.
- Semantic HTML and accessible interactions; respect reduced-motion preferences.
- Static-first delivery with no secrets or credentials in client code.
- Free-to-use Unsplash image URLs for editorial/hero photography; replace with locally optimized assets or an approved image CDN during production hardening.

## Information architecture

1. Home / hero: Demand Engineering positioning and primary consultation CTA.
2. Problem framing: connect disconnected marketing activity to measurable demand.
3. Services: Demand Engineering, performance marketing, SEO/GEO/AIO, website conversion, content and creative, and Demand Intelligence/social listening.
4. Demand Intelligence workflow: signals → qualification → alert → human follow-up → learning loop.
5. Operating approach: diagnose, engineer, activate, measure, improve.
6. FAQ: clarify fit, measurement, global scope, and implementation expectations.
7. Contact / consultation request.

## Creative direction and quality

The Riverwayse Creative & Engineering Constitution in `docs/CREATIVE-ENGINEERING-CONSTITUTION.md` is the review standard. Apply Hallmark's anti-template principle without copying its brand or site: use intentional composition, structural variety, purposeful motion, honest copy and a documented critique. Techniques such as scale disparity, asymmetry, frame-within-frame, negative space and form substitution are options to be chosen for a specific communication goal—not effects to apply everywhere.

## Conversion principles

- One primary action repeated consistently.
- Secondary action for exploring services.
- Clear service descriptions and outcomes without fabricated testimonials, clients, performance figures, or guarantees.
- Contact form validates inputs and opens a prefilled email draft as a no-backend fallback. Replace with a secured server-side form endpoint before production lead capture.

## Search and discovery

- Descriptive title and meta description, canonical placeholder to be replaced with the verified production URL, Open Graph metadata, robots.txt, sitemap, and Organization/ProfessionalService JSON-LD with only verified details.
- Semantic headings, descriptive links, useful service copy, crawlable internal anchors, and performance-conscious media.
- GEO/AIO/answer-engine optimization is treated as content clarity and entity consistency, not a guarantee of inclusion in AI answers.

## Security and quality

- Apply Cloudflare Pages headers from `public/_headers` and SPA fallback from `public/_redirects`; validate actual behavior on a preview deployment.
- Never place API keys, provider tokens, analytics secrets, or customer data in the frontend or repository.
- Use dependency lockfiles and CI build checks once dependencies are installed.
- Validate form input client-side for usability; validate and rate-limit again on the server when a real endpoint is connected.
- Add consent-aware analytics only after selecting a provider and defining the privacy notice.

## Future integrations

- Global keyword and social listening provider(s), source-specific terms of service, deduplication, confidence/scoring, lead alerts, CRM handoff, and auditable human follow-up.
- Secure backend/webhooks for form submission and alerts.
- Analytics/conversion events and consent management.
- Dedicated personal brand at femi.riverwayse.com.

## Deployment

- Target platform: Cloudflare Pages.
- Build command: `npm run build`; output directory: `dist`.
- `wrangler.toml` records the Pages output directory. Cloudflare's dashboard Git integration must still be connected and configured by an account owner.
- Keep the existing live deployment and domain unchanged until a preview has passed the release gates and the owner explicitly approves cutover.
- `netlify.toml` is retained for reference during migration; do not treat it as the active deployment target.
