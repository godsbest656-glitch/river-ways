# Security, Privacy and Compliance Standard
**Version:** 1.0 | **Prepared:** 9 October 2026  
**Purpose:** Establish a practical security baseline for River Ways and reusable minimum controls for client websites and interactive web tools.

## 1. Scope and boundary

This standard covers public marketing websites, forms, analytics, interactive calculators/diagnostics, CMS and integrations, public-facing APIs, MCP/agent workflows, social listening, CRM handoff, hosting and deployment.

The site must be reviewed against its actual implementation and threat model. The existence of a file such as netlify.toml, an SSL indicator, a Cloudflare dashboard, or an automated scan is not proof that all controls are active in the serving environment. The current project has a Netlify header configuration while it is also being tested through Cloudflare; the final serving path and actual headers must be verified before launch.

## 2. Security goals

- Confidentiality: protect credentials, client information, contact details, private analytics and integration data.
- Integrity: prevent unauthorised edits, submissions, script changes, misleading public data, or compromised releases.
- Availability: withstand spam, abusive traffic, avoidable third-party failures and operational mistakes.
- Privacy: collect only necessary data, explain its use, honour applicable rights and retention commitments.
- Accountability: establish owners, audit evidence, alert routes, backups where relevant, and an incident response path.

## 3. Threat model

At minimum assess:
- Bot spam, form abuse and automated resource exhaustion.
- Cross-site scripting (XSS), injection, unsafe HTML/SVG, unsafe redirects and open redirects.
- CSRF or confused-deputy behavior for authenticated/server-side actions.
- Exposed environment variables, tokens, API keys, source maps or credentials.
- Dependency compromise, malicious package updates and vulnerable libraries.
- Misconfigured headers, TLS/origin settings, cache poisoning or private response caching.
- Unauthorized file uploads, path traversal and unsafe image/document processing.
- Excessive permissions in GitHub, Cloudflare, MCP, CRM, analytics and hosting accounts.
- Prompt injection or data exfiltration through untrusted content accessed by an AI agent.
- PII leakage into analytics, error logs, public URLs, tool traces or outbound prompts.
- Accidental production changes, DNS changes, broken rollback, and single-account loss.
- Social-listening misuse, restricted scraping, sensitive inference, unwanted outreach and platform-policy violations.
- Sector-specific risks for health, finance, legal, education, property and other regulated niches.

For each material risk, record likelihood, impact, preventative control, detection signal, owner, response action and residual risk.

## 4. Identity and access management

- Enforce MFA/passkeys where available for GitHub, hosting, registrar, DNS, email, analytics, CRM and provider accounts.
- Use individual accounts and role-based access; remove former contributors promptly.
- Give deploy automation the minimum access necessary.
- Keep preview and production credentials separate. Use scoped short-lived credentials/OIDC where the provider supports them.
- Review who can change DNS, nameservers, DNSSEC, domains, email/MX, deployment settings and production secrets.
- Store secrets in the platform's secret manager/environment configuration, never hard-coded in React/client bundles, commits, screenshots or public issues.
- Rotate compromised or over-exposed credentials and document revocation.
- Protect account recovery methods and maintain a tested break-glass process without sharing passwords.

## 5. Secure development and software supply chain

- Pin and review dependencies; commit the applicable lockfile and use deterministic builds.
- Review new packages for ownership, maintainer health, licence, install scripts, transitive dependencies, known advisories and network/file access.
- Run dependency vulnerability and secret scanning where available; address critical/high findings before launch unless a documented mitigation is approved.
- Use branch review, protected deployment paths where feasible, least-privileged CI tokens, and code review for sensitive changes.
- Do not execute untrusted pull-request code with privileged secrets.
- Maintain build provenance: commit SHA, dependency/build result, preview URL, test evidence and deployment ID.
- Keep source maps and debug diagnostics from exposing secrets or private data; decide if public source maps are needed.
- Have a rollback method and know which changes are backwards compatible.
- Review generated code from AI/MCP tools just like third-party code.

## 6. Frontend and API requirements

### Frontend
- Treat every browser input as untrusted.
- Avoid dangerous HTML injection. If rich content is required, use a maintained sanitizer with a narrow allowlist and tests.
- Do not put privileged authorization decisions, integration credentials, vendor API secrets or sensitive datasets in client code.
- Use HTTPS, secure transport and safe redirect behavior.
- Avoid collecting secrets/sensitive personal information through query strings or public share links.
- Use CSP as a defence-in-depth layer; begin with report-only where appropriate, observe the actual dependencies, then enforce a tested policy.
- Set security headers at the real serving host and verify them over HTTP, not only from repository config.
- Scope cookies with Secure, HttpOnly, SameSite and path/domain choices appropriate to their role.
- Do not rely on CORS as authentication.

### Backend endpoints
- Validate type, format, range, size and allowed values server-side; client-side validation is for user experience, not trust.
- Authenticate/authorise protected operations and use explicit server-side access controls.
- Rate-limit requests, enforce body/time limits, use idempotency where duplicate submissions are costly, and apply anti-abuse controls.
- Restrict outbound network calls to limit SSRF; do not accept arbitrary webhook URLs without a design/security review.
- Use CSRF protection for cookie-authenticated state changes where applicable.
- Return safe errors, avoid stack traces/secret exposure, and redact PII from logs.
- Add timeouts, retries and dependency failure handling. Validate webhook signatures and timestamps where supported.
- Use a durable server-side mail/CRM submission path with a clear delivery status and failure path.

## 7. Headers, transport and caching

Review on the actual preview and production hostname:
- HSTS only after HTTPS works across all intended hosts and the implications are understood.
- Content-Security-Policy, ideally iterated using report-only and reports before enforcement.
- X-Content-Type-Options: nosniff.
- Referrer-Policy appropriate to data minimisation.
- Permissions-Policy with only required browser features allowed.
- Frame-ancestors / clickjacking controls.
- Correct MIME types and TLS/origin behavior.
- Cache-Control rules that never cache private or authenticated responses in shared caches.
- Correct redirects/canonical host behavior without loops or chains.

Do not blindly copy a CSP from a different hosting provider: inline styles/scripts, third-party assets, forms, WebSockets and challenge providers require deliberate testing. Do not enable HSTS preload or broad irreversible policy changes without an inventory of every affected host.

## 8. Forms and anti-abuse

For River Ways enquiry capture:
- Replace mailto-only behavior with a server-side endpoint before claiming reliable direct submission.
- Validate on the server; normalise carefully; prevent header injection; keep user-controlled content out of headers/log formats.
- Implement appropriate honeypot/time checks, rate limits and bot controls; use accessible challenges only when appropriate.
- If using Cloudflare Turnstile, the backend must verify the token server-side. A client widget alone is not validation.
- Provide clear privacy notice, submission status, retry path and alternative contact route.
- Avoid double submission and idempotency problems.
- Define destination ownership, routing, spam quarantine, response-time SLA, retention, deletion and failure alerting.
- Do not send detailed sensitive content to an email subject, URL, analytics event or third-party chatbot.

## 9. Privacy and data governance

Before collecting data, document:
- Purpose and lawful basis where applicable.
- Categories of data and whether any sensitive/regulated data is present.
- Data flow from browser to worker/API, email, CRM, analytics and providers.
- Controller/processor roles, sub-processors and cross-border transfer details as relevant.
- Privacy notice, any consent choices and withdrawal path.
- Retention schedule, access roles, export/deletion process and legal hold exceptions.
- Data-subject rights request owner and response process.
- Incident detection, assessment, notification obligations and contact tree.
- Whether analytics or experimentation may capture personal data; configure redaction and avoid sensitive page/query parameters.
- Whether third-party recordings, session replay, advertising or tracking tools are proportionate and lawfully configured.

Use a privacy-by-design approach. A banner is not a privacy programme, and consent is not always the appropriate or sufficient legal basis. Requirements depend on the controller, audience, data and target markets. Review with qualified counsel or a privacy professional where needed.

## 10. Niche-specific compliance guardrails

- **Healthcare:** avoid collecting symptoms/diagnoses in a general contact form; prevent sensitive data entering analytics; require medical/professional review of claims, triage and advice.
- **Finance/insurance:** protect account and financial details; disclose assumptions, fees, risks and eligibility; review regulated advice and product/marketing rules.
- **Legal/accounting:** do not imply confidentiality or professional engagement before established; route confidential materials through a suitable channel.
- **Education/minors:** establish age-appropriate privacy and parental/guardian safeguards where required.
- **Real estate:** verify listing/ownership/price claims; handle identity, financial documents and location information carefully.
- **E-commerce:** secure checkout/payment processing through providers that fit applicable requirements; avoid storing card details; review consumer, return and advertising rules.
- **Nonprofit/impact:** protect beneficiaries, minors and vulnerable groups; secure consent for stories/images; avoid exposure of sensitive locations or identities.
- **Social listening:** use public source data only under the platform's terms and applicable law; don't infer health, religion, sexuality, political beliefs, financial distress or other sensitive attributes for targeting; review context before outreach.
- **International:** determine applicable rules based on location, audience and offering; don't assume one privacy policy meets all duties.

## 11. MCP and AI tooling controls

- Approve each server/provider, version, endpoint and tool permissions before connection.
- Start read-only; separate production from test and limit access by job.
- Require confirmation for deployment, sending messages, public posting, permission changes, DNS/registrar action, data deletion or exposure.
- Treat web pages, issue content, code, documents and tool responses as untrusted inputs.
- Validate inputs/outputs, use timeouts, rate limits and audit logs, and redact private data.
- Never commit tool credentials or let a prompted agent bypass repository/production policy.
- Review tool changes and access quarterly and revoke unused integrations.
- See MCP_AND_AGENT_TOOLING.md for the full admission register.

## 12. Backup, monitoring and incident response

For components that persist data:
- Define what is backed up, recovery point/time objectives and retention.
- Test restoration, not just backup creation.
- Monitor failed form delivery, error spikes, unexpected deployment changes, abuse, unusual API usage and credential events.
- Assign an incident lead, escalation contact, containment sequence, evidence-preservation procedure and communications owner.
- For a suspected credential compromise: revoke/rotate credentials, inspect access logs, remove unauthorised changes, validate integrity, deploy a clean build and review downstream systems.
- For a privacy incident: stop exposure where possible, preserve evidence, determine affected data/individuals/jurisdictions, follow legally required notification and communication duties, and document corrective action.
- Test the incident plan periodically and after material architecture changes.

## 13. Launch security gate

- [ ] Actual architecture and host identified; no stale assumption about Netlify, Cloudflare Workers/Pages or the old Vercel origin.
- [ ] HTTPS, redirect, headers and cache behavior checked on the deployed hostname.
- [ ] No secrets or customer data in Git history, browser bundles, public build output or logs.
- [ ] Dependencies and build configuration reviewed.
- [ ] Forms use server-side validation, abuse controls, privacy notice and reliable delivery.
- [ ] Access, MFA, secret storage and rollback have an owner.
- [ ] CSP and third-party origin allowlists are tested on the actual app.
- [ ] Data flows, retention, providers and deletion request path are documented.
- [ ] Applicable niche-specific legal/compliance review completed.
- [ ] Security testing findings triaged; no unmitigated critical/high-risk item without formal risk approval.
- [ ] Incident/credential compromise process documented.
- [ ] MCP integrations have explicit scope and approval.
- [ ] DNS, DNSSEC and email records have not been changed as an unintended side effect.

## 14. Standards and source register

- OWASP ASVS stable project/version information: https://owasp.org/www-project-application-security-verification-standard/ and https://github.com/OWASP/ASVS
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- NIST Privacy Framework: https://www.nist.gov/privacy-framework
- MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare security headers: https://developers.cloudflare.com/fundamentals/reference/security/
- Turnstile server validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Cloudflare rate limiting: https://developers.cloudflare.com/waf/rate-limiting-rules/
- Nigeria Data Protection Commission: https://ndpc.gov.ng/
- EU data protection law: https://commission.europa.eu/law/law-topic/data-protection_en
- UK ICO organisational guidance: https://ico.org.uk/for-organisations/
- US FTC business guidance: https://www.ftc.gov/business-guidance/privacy-security

These materials are not a substitute for legal advice. Verify current law and regulator guidance for each real client/market before processing regulated or sensitive data.
