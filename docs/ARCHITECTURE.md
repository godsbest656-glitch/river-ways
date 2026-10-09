# River Ways Website — Architecture

## Product objective
Build a conversion-focused, accessible, responsive marketing website that positions River Ways around demand generation and Demand Engineering. The website should help qualified prospects understand the offer, explore services, and start a conversation.

## Initial stack
- React + Vite for a lightweight component-based frontend.
- The official Cloudflare Vite plugin and Wrangler configuration for a Worker plus static assets deployment.
- Plain CSS with design tokens to keep styling fast and maintainable.
- Semantic HTML and accessible interactions; respect reduced-motion preferences.
- Static-first delivery with no secrets or credentials in client code.
- Free-to-use Unsplash image URLs for editorial/hero photography; replace with locally optimized assets or approved image CDN during production hardening.

## Information architecture
1. Home / hero: Demand Engineering positioning and primary consultation CTA.
2. Problem framing: connect disconnected marketing activity to measurable demand.
3. Services: Demand Engineering, performance marketing, SEO/GEO/AIO, website conversion, content and creative, and Demand Intelligence/social listening.
4. Demand Intelligence workflow: signals → qualification → alert → human follow-up → learning loop.
5. Operating approach: diagnose, engineer, activate, measure, improve.
6. FAQ: clarify fit, measurement, global scope, and implementation expectations.
7. Contact / consultation request.

## Conversion principles
- One primary action repeated consistently.
- Secondary action for exploring services.
- Clear service descriptions and outcomes without fabricated testimonials, clients, performance figures, or guarantees.
- Contact form includes a prefilled mailto fallback. A Cloudflare Worker endpoint is implemented but fails closed until the Turnstile site/secret keys and Resend delivery credentials/sender are configured.
- Server-side validation, origin checks, request limits and Turnstile Siteverify are required before email delivery.
- End-to-end email delivery is not considered live until a test enquiry has been received and the exact production sender/recipient flow is verified.

## Search and discovery
- Descriptive title and meta description, canonical placeholder to be replaced with the verified production URL, Open Graph metadata, robots.txt, sitemap, and Organization/ProfessionalService JSON-LD with only verified details.
- Semantic headings, descriptive links, useful service copy, crawlable internal anchors, and performance-conscious media.
- GEO/AIO/answer-engine optimization is treated as content clarity and entity consistency, not a guarantee of inclusion in AI answers.

## Security and quality
- Apply security headers to Cloudflare static assets via `public/_headers` and to Worker responses in `src/worker.js`; verify the actual preview responses.
- `netlify.toml` remains a legacy host-specific configuration and does not configure the Cloudflare Worker runtime.
- Never place API keys, provider tokens, analytics secrets, or customer data in the frontend or repository.
- Use dependency lockfiles and CI build checks once dependencies are installed.
- Validate form input client-side for usability; validate and rate-limit again on the server when a real endpoint is connected.
- Add consent-aware analytics only after selecting a provider and defining the privacy notice.

## Future integrations
- Global keyword and social listening provider(s), source-specific terms of service, deduplication, confidence/scoring, lead alerts, CRM handoff, and auditable human follow-up.
- Secure backend/webhooks for form submission and alerts.
- Analytics/conversion events and consent management.
- Dedicated personal brand at femi.riverwayse.com.

## Deployment notes
- Vite build output is `dist/`.
- Netlify configuration provides SPA fallback and security headers; review CSP and hosting-specific behavior before launch.
- Verify the final domain, contact destination, privacy policy, service claims, image choices, and form endpoint before production.
