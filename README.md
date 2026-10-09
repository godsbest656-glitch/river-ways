# River Ways Website

A responsive, conversion-focused agency website built with React and Vite. It introduces River Ways's demand-led growth approach, services, Demand Intelligence workflow, operating method, FAQs and consultation brief.

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Project structure

- `src/App.jsx` — page sections and interactive components.
- `src/styles.css` — responsive design system, animation and reduced-motion handling.
- `index.html` — metadata, social sharing tags and Organization JSON-LD.
- `public/robots.txt` and `public/sitemap.xml` — initial crawler files.
- `netlify.toml` — SPA fallback and baseline response security headers.
- `docs/ARCHITECTURE.md` — architecture and future integration plan.

## Before production launch

1. Confirm the canonical production domain and update metadata, sitemap and robots directives if needed.
2. Confirm the public contact email. The current enquiry form uses a `mailto:` draft as a no-backend fallback; it does not transmit data directly.
3. Add a privacy notice and consent-aware analytics only after selecting relevant providers.
4. Replace the mailto flow with a secured server-side form endpoint if direct submission, spam protection, storage or CRM integration is required.
5. Test CSP and security headers on the actual hosting provider.
6. Review all claims, service descriptions, imagery and brand details with River Ways.
7. Run CI and accessibility/performance checks on the deployment preview.

## Current scope

The Demand Intelligence section explains the workflow and user experience. Real-time global social listening, lead qualification, notifications and CRM follow-up require selected data sources, a backend, credentials and compliance review; these integrations are not represented as already connected.


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

Use these standards as release requirements, not as evidence that any control has already been implemented or tested. The production domain and email/DNS infrastructure must remain unchanged until the redesign passes the release gates.
