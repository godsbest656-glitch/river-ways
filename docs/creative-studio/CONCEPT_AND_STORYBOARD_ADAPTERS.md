# Concept and storyboard draft adapters

**Branch:** `feat/creative-studio-concept-storyboard`  
**Base:** `feat/river-ways-creative-studio-foundation` at `5edb5e0932788e715a0d65a0fb6544c2b34671da`

## Delivered in this implementation slice

- Added deterministic, source-traceable `concept` and `storyboard` draft adapters.
- Enabled both job types in the authenticated Studio worker allowlist and local worker poller.
- Kept the worker's existing client/project scope check, draft-brief validation, lease heartbeat, bounded retry and no-overwrite output behaviour.
- Added tests for concept provenance, storyboard structure, missing video deliverables, unfilled proof/CTA placeholders, draft-only enforcement and unsupported job types.
- The adapters create structured creative starting points only. They do not call an AI model, generate images/video, render media, approve assets or publish content.

## Safety and quality boundaries

- Concepts use the brief's supplied message and audience as inputs; no product capabilities, customer results, testimonials, pricing or endorsements are invented.
- Storyboards are four-beat structural outlines. Product evidence and conversion CTA remain explicit placeholders until verified inputs are supplied.
- Every output remains `draft`, requires human review and is marked non-production.
- Image, video, render, QA and delivery job types remain unavailable to the worker until their individual adapters, rights gates and tests are implemented.

## Next gates

1. Run the complete repository CI against this branch and resolve any failures.
2. Connect a local worker to a configured non-production Cloudflare Access + D1 + private R2 environment; verify project, strategy, copy, concept and storyboard jobs end-to-end.
3. Add client reviewer identity and version-specific approval before enabling client-facing review.
4. Implement image/video generation and rendering only after workstation hardware, model terms, client asset rights and human approvals are verified.
