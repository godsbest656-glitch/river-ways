# River Ways Agency Operating Platform

This directory is the consolidated product and engineering reference for the River Ways operating ecosystem.

## Source-of-truth hierarchy

1. Explicit owner decisions and current verified implementation.
2. Root `AGENTS.md` and binding design, security, privacy and cost rules.
3. Current code, migrations, tests, deployment configuration and observed runtime evidence.
4. Documents in this directory: product requirements, approved direction and planned architecture.
5. External tutorials and resource recommendations: research inputs only.

A document describing a planned capability does not prove it exists. Use the status vocabulary in `rules.md`: Proposed, Implemented, Deployed, Verified, Blocked or Unknown.

## Documents

- [Ecosystem master architecture](./ECOSYSTEM_MASTER_ARCHITECTURE.md) — complete agency, workforce, application, data and integration architecture.
- [Product requirements](./PRD.md)
- [Architecture](./architecture.md)
- [Binding product and engineering rules](./rules.md)
- [Prioritized implementation tasks](./tasks.md)
- [Design system and experience direction](./Design.md)
- [Project memory and decision register](./Memory.md)
- [Reusable component architecture](./component-architecture.md)
- [Engineering resource registry](./ENGINEERING_RESOURCE_REGISTRY.md)
- [Integration adoption register](./INTEGRATION_ADOPTION_REGISTER.md) — repository verification, adoption decisions and gates.
- [Ecosystem branch reconciliation](./ECOSYSTEM_BRANCH_RECONCILIATION_2026-11-23.md) — verified branches, open PRs and integration boundaries.
- [Adobe ecosystem register](../integrations/ADOBE_ECOSYSTEM_REGISTER.md) — official Adobe extension paths and community MCP/SDK candidates.
- [Repository reconciliation](./REPOSITORY_RECONCILIATION_2026-11-10.md)

## Operating rule

Preserve existing website and operational work. Build the smallest useful, testable slice. Do not introduce a new service merely because it appears in the resource registry. No production deployment, DNS change, paid service, paid API, paid model route or client-data migration is authorized by these documents.
