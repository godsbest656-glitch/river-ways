# River Ways — Operational Readiness Register

**Purpose:** track what must be true before River Ways can rely on its website as an operating acquisition channel.

This register distinguishes verified implementation from planned work. A successful frontend build is not proof of a working production lead pipeline.

## Current verified state (repository inspection)

- Frontend: React 18 + Vite; static build output is `dist/`.
- Current branch: `feat/shaped-current-visual-foundation`.
- Existing CI build for the latest visual-foundation commit completed successfully.
- Contact form: validates name and email in the browser, then opens a prefilled `mailto:` draft addressed to the River Ways inbox.
- The page explicitly tells visitors that the browser does not transmit the enquiry.
- The repository branch inspected does **not** contain `functions/api/contact.js`, a Wrangler configuration, or a D1 migration at the expected paths.
- No server-side submission, durable lead storage, notification delivery, CRM sync, or automated follow-up is verified by this inspection.
- The site currently has no published, evidence-approved case study section. Client/project names and performance claims must not be added until evidence and publication permission are recorded.

## Readiness gates

| Gate | Required outcome | Current status | Evidence required to close |
|---|---|---|---|
| 1. Public experience | Clear positioning, buyer paths, capabilities, accessible responsive UI | In progress | Desktop/mobile preview review; keyboard and screen-reader checks |
| 2. Proof | Approved case studies, artifacts and substantiated outcomes | Blocked on evidence | Completed case-study records and publication approvals |
| 3. Enquiry capture | Browser submits securely to a server endpoint | Not implemented in this branch | Endpoint code, validation, abuse controls and successful end-to-end test |
| 4. Lead storage | Enquiries persist in a controlled database with retention rules | Not implemented in this branch | Schema/migration, access policy, retention and tested persistence |
| 5. Notifications | New enquiry alerts reach an owned inbox reliably | Not implemented in this branch | Provider configuration, secret binding and delivery test |
| 6. Follow-up operations | Clear owner, response SLA, status and next action for each lead | Not implemented | CRM/work queue, ownership rules and test lead |
| 7. Measurement | Consent-aware analytics and conversion events | Not verified | Privacy notice, selected provider, event specification and validation |
| 8. Production release | Correct domain, headers, SEO, monitoring and rollback | Not verified here | Hosting configuration review, preview checks and explicit release approval |

## Implementation sequence

### P0 — Make the enquiry path real
1. Inspect the active hosting configuration and the actual production branch before selecting an implementation.
2. Choose the canonical endpoint and deployment platform; do not introduce a second competing hosting path.
3. Define a minimal enquiry contract: name, email, company (optional), goal, details (optional), timestamp, source and consent/privacy acknowledgement where required.
4. Validate and normalize on the server; enforce size limits, rate limits, origin controls and spam protection.
5. Persist the enquiry before attempting notification. A notification failure must not silently discard a lead.
6. Send an alert to the approved River Ways inbox using a server-side secret. Never put provider keys in client code.
7. Return clear success/failure states to the visitor without exposing internal errors.
8. Add tests for valid submission, invalid input, oversized payload, abuse controls, persistence failure and notification failure.

### P1 — Give every lead an owner
1. Define a simple lifecycle: New → Reviewed → Qualified / Not a fit → Contacted → Meeting → Proposal → Won / Lost.
2. Assign an owner and next-action date.
3. Record source and campaign context without collecting unnecessary personal data.
4. Establish a human response target and escalation for unassigned leads.
5. Test the complete path using a clearly labelled internal test enquiry.

### P2 — Establish proof and learning
1. Complete one evidence record per candidate project.
2. Obtain permission before publishing client names, quotes, screenshots or identifiable details.
3. Define baseline, measurement window and attribution caveats for every metric.
4. Instrument only meaningful conversion events after privacy and consent requirements are settled.
5. Review lead quality and outcomes; feed learning into positioning, content and channel priorities.

## Release controls

- No production DNS, Worker route, Pages binding, database, secret, email-provider or deployment changes without explicit owner approval.
- No PR merge or production release based only on a green build.
- Verify the deployed preview, not only local or CI output.
- Keep a tested rollback path and record the deployed commit.
- Do not describe a planned integration as live.
