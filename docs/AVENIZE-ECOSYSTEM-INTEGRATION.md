# Avenize — River Ways ecosystem integration

## Product boundary

Avenize is a distinct in-house AI-powered Business Operating System product initiative within the wider River Ways ecosystem. River Ways remains the creative demand engineering agency. Avenize is not a new River Ways service line, a client case study, or a replacement for the agency website.

The River Ways public website may introduce Avenize and invite qualified interest. The website must not host Avenize's private workspace, business records, AI assistant, CRM, HR/personnel data, or operational controls.

## Public positioning

**Working description:** Avenize is a connected operating layer being developed to help businesses understand their organisation, coordinate people and work, and act with better context.

**Status language:** In development. Not yet available for general release.

The public introduction must remain explicit about product status. Do not say "powered by" or imply a feature is live unless its implementation and production behavior have been verified. Do not publish launch dates, pricing, customer logos, customer counts, performance claims, integrations, or screenshots of real business data without approval and evidence.

## Product direction

The intended system map currently includes:

1. **Business identity and graph** — a connected representation of an organisation, its entities, relationships, roles, resources and operating context.
2. **Customer relationships / CRM** — accounts, contacts, conversations, opportunities, activity and follow-through.
3. **People and operations** — people records, roles, responsibilities, HR-adjacent workflows and operational coordination, subject to appropriate privacy and access controls.
4. **AI assistant (Sarah)** — an assistant that can reason over permitted business context and help users understand, plan and carry out work. It must respect permissions, provenance, confirmation boundaries and auditability.
5. **Pulse / business intelligence** — timely views of activity, progress, exceptions, trends and decisions requiring attention.
6. **Marketplace and workflows** — connected tools, repeatable processes and approved extensions.

This is a product direction map, not a statement that all modules exist or are production-ready.

## Integration with River Ways

- River Ways owns the agency website, brand, creative demand engineering services and public enquiry path.
- Avenize has its own product identity, roadmap, application architecture, data model, authentication, authorisation, tenant isolation, security controls, deployment pipeline and support model.
- The River Ways website may provide an Avenize overview and collect an enquiry through the existing secure River Ways contact endpoint.
- Avenize must not share the River Ways website's D1 lead database as its product database.
- Do not add third-party API calls, paid services, product login, waitlist automation or product analytics until the owner has approved the provider, costs, privacy implications and operating model.
- Any later handoff from River Ways to Avenize must be explicit, documented, consent-aware and protected by server-side authorization.

## Current website implementation

The Avenize introduction is a static, responsive section on the River Ways homepage. It:
- identifies Avenize as an in-development product initiative;
- distinguishes it from River Ways agency capabilities;
- presents six planned product areas as a system map;
- routes interested visitors to the existing River Ways enquiry form;
- adds a dedicated enquiry goal so interest can be identified without a separate data store.

It does not create an Avenize account, waitlist, product workspace, AI assistant, CRM, HR system, marketplace, or integration. It does not claim any of those systems are live.

## Acceptance gates for future Avenize work

Before turning this introduction into a product launch:
- approve the product name, public positioning, scope and launch criteria;
- define users, roles, tenant boundaries, permissions and data ownership;
- specify the business identity/graph model and source-of-truth rules;
- define CRM and people-data privacy, retention, export and deletion;
- design Sarah's tool permissions, confirmation requirements, provenance and audit log;
- specify Pulse metrics, event semantics and freshness guarantees;
- define marketplace review, integration secrets and revocation;
- choose hosting, database, queue, storage, model providers and cost controls;
- establish threat model, backups, recovery, monitoring and incident response;
- implement automated tests and a staged private beta before public availability.

No product feature should be described as operational until its exact release has passed those gates.
