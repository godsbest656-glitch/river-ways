# River Ways Website

A responsive, conversion-focused agency website built with React and Vite. It introduces River Ways's demand-led growth approach, services, Demand Intelligence workflow, operating method, FAQs and consultation brief.

## Run locally

```bash
npm install
npm run dev
```

Test, build and preview:

```bash
npm test
npm run build
npm run preview
```

The configured Cloudflare Worker deployment command is `npm run deploy`; use it only after reviewing the preview and release checklist.

## Project structure

- `src/App.jsx` — page sections, accessible workflow tabs and enquiry UI.
- `src/GrowthDiagnostic.jsx` — five-question, client-side growth readiness diagnostic; answers are not submitted.
- `src/DemandEngineExplorer.jsx` — accessible six-stage interactive explainer of the River Ways Demand Engineering method.
- `src/styles.css` — responsive design system, animation, reduced-motion and diagnostic/form states.
- `src/worker.js` — Cloudflare Worker static-asset serving, security headers and contact API.
- `src/contact-validation.js` — server-side enquiry validation.
- `wrangler.jsonc` — Cloudflare Worker and static-asset routing configuration.
- `public/_headers` — static asset response headers for supported static hosting.
- `public/privacy/index.html` — initial privacy notice, to be reviewed against the final data flow.
- `tests/` — server-side input and Worker endpoint tests.
- `index.html` — metadata, canonical/social sharing tags and Organization JSON-LD.
- `public/robots.txt` and `public/sitemap.xml` — initial crawler files.
- `netlify.toml` — legacy host-specific SPA fallback and headers; it does not configure Cloudflare Workers.
- `docs/ARCHITECTURE.md` — architecture and future integration plan.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Configure the Cloudflare Turnstile site key and server-side secret, and configure Resend API credentials plus a verified sender identity before enabling direct submission.
3. Follow [Contact Pipeline Setup](docs/CONTACT_PIPELINE_SETUP.md); do not change existing DNS, DNSSEC or Google Workspace mail records without separate review and approval.
4. Confirm the privacy notice reflects actual data flows and retention before collecting enquiries.
5. Apply a suitable Cloudflare rate-limiting rule to `POST /api/contact` before public launch.
6. Test CSP and security headers on the actual hosting provider.
7. Review all claims, service descriptions, imagery and brand details with River Ways.
8. Run CI, accessibility/performance checks and an end-to-end test enquiry on a separate deployment preview.

## Current scope

The Growth Readiness Diagnostic runs locally in the browser and does not submit its answers. The enquiry Worker API is implemented but fails closed until Turnstile and Resend configuration is complete; successful end-to-end email delivery has not yet been verified. Real-time global social listening, lead qualification, notifications and CRM follow-up still require selected data sources, provider access, credentials and compliance review.


## Website standards and resource library

Repository-wide AI/developer operating rules are in [AGENTS.md](AGENTS.md), and the review workflow uses [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md). The governing standards and implementation resources are in [docs/README.md](docs/README.md). Start with:
- [Website Constitution](docs/WEBSITE_CONSTITUTION.md)
- [Curated Reference Library](docs/REFERENCE_LIBRARY.md)
- [Interactive Experience Playbook](docs/INTERACTIVE_EXPERIENCE_PLAYBOOK.md)
- [Content and Social-to-Site System](docs/CONTENT_AND_SOCIAL_TO_SITE_SYSTEM.md)
- [Niche Playbooks](docs/NICHE_PLAYBOOKS.md)
- [MCP and Agent Tooling](docs/MCP_AND_AGENT_TOOLING.md)
- [SEO, GEO/AIO and Discoverability](docs/SEO_GEO_AIO_DISCOVERABILITY.md)
- [Security, Privacy and Compliance](docs/SECURITY_PRIVACY_COMPLIANCE.md)
- [QA and Release Gates](docs/QUALITY_ASSURANCE_RELEASE_GATES.md)
- [Roadmap and Backlog](docs/ROADMAP_AND_BACKLOG.md)
- [Client Website Brief Template](docs/CLIENT_WEBSITE_BRIEF_TEMPLATE.md)
- [Interaction Specification Template](docs/INTERACTION_SPEC_TEMPLATE.md)
- [Multi-Lens Strategy Playbook](docs/MULTI_LENS_STRATEGY_PLAYBOOK.md)

Use these standards as release requirements, not as evidence that any control has already been implemented or tested. The production domain and email/DNS infrastructure must remain unchanged until the redesign passes the release gates.


## Secure contact pipeline

Direct submission is not live merely because the Worker route exists. Configure the required public Turnstile site key and server-side Turnstile secret, Resend API key, and verified `CONTACT_FROM` sender following [the setup guide](docs/CONTACT_PIPELINE_SETUP.md). Keep provider secrets out of GitHub and frontend code.

Resend sender verification may require DNS records. **Do not apply changes to the live DNS zone, Google Workspace MX/TXT records, nameservers or DNSSEC without a separate reviewed and approved change plan.**

## Before production cutover

The Worker implementation must be deployed to a separate preview, its response headers verified, the privacy notice reviewed, and a test enquiry received end-to-end. Do not attach the current production domain or change DNS as part of this implementation PR.
