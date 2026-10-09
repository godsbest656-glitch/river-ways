# River Ways Website — Architecture

## Product objective
Build a conversion-focused, accessible, responsive marketing website that positions River Ways around demand generation and Demand Engineering. The website should help qualified prospects understand the offer, explore services, and start a conversation.

## Initial stack
- React + Vite for a lightweight component-based frontend, using the official Cloudflare Vite plugin and Wrangler for Worker + static-assets delivery.
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
- The contact form provides a mailto fallback and a same-origin Worker API path.
- The Worker uses server-side validation, origin checks, body-size controls, honeypot handling, Turnstile Siteverify and Resend delivery.
- Direct submission fails closed until Turnstile and Resend settings are configured; delivery is not considered live until an end-to-end test email has been received.

## Search and discovery
- Descriptive title and meta description, canonical placeholder to be replaced with the verified production URL, Open Graph metadata, robots.txt, sitemap, and Organization/ProfessionalService JSON-LD with only verified details.
- Semantic headings, descriptive links, useful service copy, crawlable internal anchors, and performance-conscious media.
- GEO/AIO/answer-engine optimization is treated as content clarity and entity consistency, not a guarantee of inclusion in AI answers.

## Security and quality
- Apply response security headers in the Worker and via `public/_headers` for static assets where supported. Verify the actual deployed responses.
- `netlify.toml` remains legacy host-specific configuration and does not configure a Cloudflare Worker.
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
- `wrangler.jsonc` configures the Worker entry point, static assets and `/api/*` routing; `public/_headers` defines static asset headers.
- `netlify.toml` is retained as a separate legacy configuration. Its presence is not evidence that the Cloudflare runtime is configured or secure.
- Verify the final domain, contact destination, privacy policy, service claims, image choices, and form endpoint before production.


## Governing standards

The website constitution and technical release requirements are maintained in [docs/README.md](README.md) and its linked documents. Key requirements include purposeful interactive experiences, accessible motion, real lead submission, verified host security, clear data governance, crawlable service content and evidence-based release approval.

The current mailto-only form is a temporary fallback and is not reliable server-side lead capture. The Netlify configuration file is not proof that headers or SPA behavior are applied to a Cloudflare Worker/Pages deployment. Verify the actual serving path and HTTP responses before production release. Preserve the existing live domain, email, DNS and DNSSEC until a separate approved migration plan exists.


## Implementation status

The growth readiness diagnostic is client-side only; responses are not sent or stored by River Ways. Direct lead capture depends on Turnstile and Resend provider configuration, sender verification, rate limiting and successful end-to-end testing. See [Contact Pipeline Setup](CONTACT_PIPELINE_SETUP.md).

The existence of a configuration file does not prove security headers are active on the live hostname. Confirm the actual serving path and HTTP responses from an isolated preview before any production release. Preserve the existing live domain, email, DNS and DNSSEC until a separately approved migration plan exists.
