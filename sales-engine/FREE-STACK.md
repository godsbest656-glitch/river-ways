# River Ways zero-budget client-acquisition stack

**Policy: no new paid tools, subscriptions, API credits, trials that can auto-renew, or paid outreach platforms.** Harvey is a useful architecture reference, but its current README requires an existing Claude Pro/Max or ChatGPT plan with Codex access. It is therefore not a zero-cost runtime for us unless the needed access is already included in a subscription we already have and we explicitly choose to use it. Do not buy a plan for this project.

## What we use now

| Need | Zero-budget choice | Limits |
|---|---|---|
| Prospect records | Local SQLite and CSV; standard-library Python | Local computer is responsible for backup |
| Prospect sourcing | Manual research of public company sites, directories and search results | Human time; respect site terms and robots policies |
| Website inspection | Browser + public pages; free browser tools already installed | No paid crawling or enrichment APIs |
| Qualification | Explicit rubric and evidence links | Human-reviewed; no invented facts |
| Outreach drafts | Reusable local templates; optionally a model already available at no incremental cost | No new subscription/API key; verify any plan's usage terms |
| Contact management | Local pipeline exportable as CSV | No shared multi-user sync yet |
| Website enquiries | Existing River Ways website/enquiry work | Keep separate; do not change production bindings as part of this pilot |
| Design research | GetLayers public/free features only where genuinely available without payment; otherwise inspect public references and build ourselves | Do not assume unlimited materialization or paid features are free |
| Local AI (optional later) | Ollama or another locally runnable open model, only if the computer can handle it | No per-token API fee, but hardware, electricity and setup still have costs; model quality/speed varies |

## What we do not use

- No Harvey model calls that require buying or upgrading a subscription.
- No paid Claude/OpenAI API keys, enrichment tools, cold-email platforms, paid datasets or calendar subscriptions.
- No paid GetLayers materialization or features.
- No automatic sending, automated LinkedIn actions or unreviewed follow-up sequences.
- No production website deployment just to test the sales system.

## Immediate workflow

1. Create a small, manually verified list of 10–20 businesses in one segment.
2. Save the official website and source URL for every observation, plus the date checked.
3. Score each prospect using the rubric below.
4. Write a short, useful, evidence-backed observation and decide whether River Ways can genuinely help.
5. Use only an appropriate, publicly provided business contact route; comply with relevant rules and honour opt-outs.
6. Draft one-to-one outreach for human review. No messages are sent by this pilot.
7. Review weekly: verified prospects, strong-fit prospects, replies, meetings, proposals and wins. Stop any tactic that produces poor-fit contacts or complaints.

## Qualification rubric (0–2 each; maximum 10)

- **Service fit:** is the need within a River Ways service we can deliver now?
- **Evidence:** is there a specific, current observation from an official/public source?
- **Commercial fit:** is there a credible business reason to invest, without guessing revenue or budget?
- **Reachability:** is there an appropriate, public business contact route?
- **Timing signal:** is there a real, verifiable trigger, not a manufactured urgency?

Only manually review prospects scoring 7+ with no unresolved data or compliance concern. A high score is a research priority, not permission to contact.

## Data minimisation and stop conditions

Store company-level data and source links wherever possible. Avoid collecting sensitive personal data. Keep a suppression/do-not-contact record and check it before any future contact. Do not bypass logins, CAPTCHAs, access controls or site restrictions. Pause if a claim cannot be verified, the contact route is inappropriate, an opt-out arrives, or the legal basis for contact is unclear.

## How Harvey's architecture informs our design

We can reproduce useful *ideas* without requiring Harvey to run: deterministic stage transitions, an auditable SQLite record, transparent qualification criteria, a human-review queue, a suppression list, and explicit cost/safety gates. This is not a copy of Harvey's proprietary or private internals; it is an original, simpler River Ways workflow.
