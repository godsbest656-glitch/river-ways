# River Ways — Reusable Component and Interaction Architecture

**Status:** Architecture proposal; not implemented  
**Version:** 1.0 · 2 November 2026  
**Scope:** Shared component contracts for the public site, internal workspace, client workspace and Creative Studio  
**Depends on:** `docs/platform/Design.md`, `docs/platform/rules.md`, `docs/platform/architecture.md`

## 1. Purpose and implementation boundary

Create a small, composable interface foundation so screens share reliable behavior without becoming visually identical. The public catalogue may be editorial and expressive; operational interfaces remain calm, legible and task-oriented. All surfaces share accessibility, state semantics, interaction safety and brand tokens.

This document defines contracts and sequencing. It does not claim components exist or authorize production changes. Implement only after the active application branch, design tokens, routing, API behavior and test setup are verified.

## 2. What the inspected branch currently tells us

The inspected documentation branch contains a React 18 + Vite application with `src/App.jsx`, `src/main.jsx` and `src/styles.css`. The inspected `App.jsx` is a single large page component with local menu/step/form state, inline form validation, a mailto-based contact submission path and page-level reveal behavior. The inspected package manifest lists React, React DOM, Vite and lucide-react; it does not list a component library, router, form framework, query/cache library or test framework.

These observations describe the fetched branch snapshot only. They do not establish the live production implementation or the active release branch. Do not add a framework or dependency simply to implement this architecture. Prefer existing React/CSS primitives and small local utilities until a verified need justifies more.

## 3. Component layers

Keep components in five layers with one-way dependencies:

1. **Tokens and primitives** — semantic color, typography, spacing, focus, motion, icon, visually-hidden text and layout primitives.
2. **Interaction primitives** — Button, Link, TextField, TextArea, Select, Checkbox, Dialog, Tabs, Menu, Tooltip and form field composition. Native HTML semantics first.
3. **State and feedback patterns** — InlineStatus, Alert, Toast/Announcement, Skeleton, EmptyState, NoResults, ErrorState, OfflineNotice, PermissionNotice, LoadingRegion and AsyncAction.
4. **Domain components** — LeadRow, OpportunityStage, ProjectMilestone, TaskItem, DeliverableCard, AssetPreview, ApprovalPanel, ReportMetric and CatalogueEntry. Domain components consume typed data and callbacks; they do not own network access.
5. **Page compositions** — public pages, CRM screens, project views, client portal pages and Creative Studio workflows. Pages compose domain and state patterns; they should not reimplement primitives.

Avoid a generic component with dozens of boolean props. Prefer a small base component plus named variants with clear intent. Avoid coupling components to a specific API provider or database.

## 4. Shared component contracts

| Component/pattern | Responsibility | Contract and guardrails |
|---|---|---|
| Button | Trigger an action | Explicit `type`; disabled/busy semantics; no nested interactive elements; destructive variant requires clear label |
| Link | Navigate | Real destination and native link behavior; never use a button for navigation |
| Field | Label, hint, input and error | Programmatic label; stable description/error IDs; preserve value on validation failure |
| Form | Coordinate submission | Client validation improves UX; server validation is authoritative; prevent duplicate submission |
| Alert | Persistent contextual message | Semantic role appropriate to urgency; action to recover where possible |
| Toast/Announcement | Brief confirmation or background update | Do not make transient toast the only record of critical success or error |
| Skeleton | Reserve layout while loading | Match expected content geometry; never replace meaningful content during refresh |
| EmptyState | Explain a genuinely empty collection | Distinguish first-use from filtered no-results; offer a permitted next action |
| NoResults | Explain zero search/filter matches | Show active query/filter context and a clear reset action |
| ErrorState | Explain a failed read or operation | State what failed, preserve recoverable input and offer safe retry/correction |
| AsyncAction | Represent a pending mutation | Disable duplicate activation, expose progress, handle timeout/retry/cancel and authoritative result |
| DataTable | Present operational records | Keyboard-accessible actions, responsive fallback, stable sort/filter semantics and empty/loading/error slots |
| Dialog | Confirm focused decision | Focus trap/return, Escape behavior where safe, explicit cancel and confirm labels |
| FilePicker/AssetPreview | Select and inspect files | Validate type/size, show upload state, never imply upload completion before server confirmation |
| StatusBadge | Display a domain status | Text label plus non-color cue; map only known domain statuses |
| AuditTimeline | Show consequential history | Actor, timestamp, event and evidence; no client exposure of internal-only events |

Props should express data and callbacks, not transport details. For example, a list receives `items`, `loading`, `error`, `empty`, `onRetry` and row callbacks; it does not fetch its own records.

## 5. Async state model

Use explicit state rather than unrelated booleans that can produce impossible combinations. A resource view should distinguish initial load, loaded, refreshing, empty, failure and access denial. A mutation should distinguish idle, pending, succeeded, failed and cancelled where cancellation is supported. Offline is an environment/transport condition that can coexist with cached content; it is not a synonym for an empty state.

Recommended conceptual resource states:

- `initial-loading`: no usable result has been loaded.
- `loaded`: usable data is present.
- `refreshing`: prior data remains visible while a refresh runs.
- `empty`: request succeeded and the collection contains no records.
- `error`: request failed; prior usable data, if any, is retained.
- `no-results`: data exists but the active query/filter has no matches.
- `forbidden`: the server denied access; protected data is not rendered.

Recommended mutation states:

- `idle`
- `pending`
- `succeeded` only after authoritative confirmation
- `failed`
- `cancelled` only when cancellation is confirmed or the operation is known not to have committed
- `unknown` when timeout/disconnect means the server outcome is uncertain; reconcile before offering a potentially duplicating retry

Do not model offline as permission denied, or a timeout as proof that a write failed. When the outcome is unknown, check operation status or reload the authoritative record using an idempotency key before resubmission.

## 6. Interaction rules

### Forms
- Keep entered values when validation or network submission fails.
- Associate each error with its field and provide a concise form-level summary when useful.
- Move focus to the error summary or first invalid field according to the form pattern.
- Distinguish client-side format checks from server-side business rules.
- On success, show a durable confirmation and next step; clear fields only when that is the expected workflow.
- For the public enquiry path, preserve the currently approved delivery behavior until a replacement is separately implemented and regression-tested.

### Search, filters and tables
- Keep search query and active filters visible and removable.
- Debounce only where it improves performance; do not make the interface feel unresponsive.
- Preserve current results during refresh.
- Use stable sort keys and deterministic pagination.
- Provide a no-results reset action without implying the underlying dataset is empty.
- Bulk actions require explicit selection, clear scope and confirmation for irreversible changes.

### Destructive and consequential actions
- Confirm deletion, publication, payment verification, client approval and other consequential transitions with context.
- Use server-side authorization and validation; hidden controls are not security.
- Record actor, timestamp, target, before/after state where appropriate and evidence reference.
- Use idempotency keys for retries and duplicate-prone actions.
- Undo is preferred where safe; otherwise explain irreversibility before confirmation.

### Uploads and background jobs
- Show selected, uploading, uploaded, processing, failed and cancelled states distinctly.
- A browser-side transfer completing is not equivalent to server-side processing or approval completing.
- Preserve partial batch results and identify failed items individually.
- Retry only failed/retryable items; do not silently restart completed work.
- Provide a manifest for final exported assets and their rights/provenance metadata.

### Offline and reconnect
- Classify each action as locally draftable, safely queueable, read-only from cache or unavailable offline.
- Never label locally stored or queued changes as server-saved.
- Show pending-sync state and reconcile conflicts on reconnect.
- Do not queue sensitive or consequential actions unless authorization, idempotency and conflict behavior are explicitly designed.

## 7. Accessibility and responsive behavior

- Use semantic HTML before custom ARIA widgets.
- Every interactive control must be keyboard operable with visible focus.
- Ensure labels, descriptions and errors are programmatically associated.
- Announce async status changes without repeatedly interrupting screen readers.
- Use live regions sparingly; reserve assertive announcements for urgent information.
- Respect reduced-motion preferences and avoid motion as the sole state indicator.
- Maintain contrast, text resizing, browser zoom and reflow.
- Dialogs manage focus correctly; menus and tabs follow their expected keyboard interaction model.
- Tables must have accessible headers and a useful small-screen alternative.
- Touch targets and spacing must support mobile use.

## 8. Testing contract

For each reusable pattern, test:
- default rendering and semantic role;
- keyboard operation and focus behavior;
- loading, empty, error and permission states where applicable;
- slow response and repeated activation;
- state transition after success/failure;
- retained form values and validation association;
- responsive layout and zoom/reflow;
- reduced-motion behavior where motion exists;
- no sensitive data in forbidden states;
- idempotent retry and uncertain-outcome handling for mutations.

Prefer pure component tests for deterministic behavior and browser-level tests for critical journeys. Select test tooling only after inspecting existing repository setup and confirming zero additional cost. A passing build alone does not verify interaction behavior.

## 9. Migration sequence

1. Audit the active app branch, token source, CSS conventions, route structure, enquiry API and existing tests.
2. Define semantic tokens and focus/typography/layout primitives without changing the approved identity.
3. Extract low-risk primitives from existing markup; preserve rendered output and accessibility.
4. Build the ten state patterns and test them independently.
5. Refactor the public enquiry form first, preserving its delivery contract and adding tests for validation, pending, success, failure and uncertain outcome.
6. Introduce shared table/list and detail patterns for CRM and project delivery.
7. Add client portal-specific authorization-aware states only after server-side identity and tenant boundaries exist.
8. Add creative batch/job and asset review patterns once job contracts and file permissions are defined.
9. Add public catalogue cards and editorial modules using the same foundations but distinct presentation rules.

Each stage must be a small reviewable change with before/after evidence. Do not convert the current homepage into a speculative dashboard or implement future workspace screens before their data and permission contracts exist.

## 10. Definition of ready for implementation

- Active branch and exact commit identified.
- Existing token and styling conventions inspected.
- Existing public enquiry behavior and regression tests documented.
- No new dependency or service required, or explicit zero-cost/license evidence recorded.
- Component API and relevant state transitions agreed.
- Accessibility and responsive acceptance criteria defined.
- Rollback path is clear.

## 11. Definition of done

A component is not complete because it looks correct in one screenshot. It is complete when its API is documented, all applicable states behave truthfully, keyboard and assistive-technology behavior is verified, responsive behavior is tested, error recovery preserves user work, and no cost/security boundary has been weakened.
