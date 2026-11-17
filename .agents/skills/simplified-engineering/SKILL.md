---
name: simplified-engineering
description: "Use for routine River Ways engineering tasks to deliver the smallest complete, safe change; reuse existing code and tools, remove unnecessary complexity, and verify affected behavior. Inspired by the Ponytail engineering approach."
---

# Simplified engineering

## Objective

Solve the complete task with the least new code, dependencies, moving parts and operational burden. Read first; simplify only after understanding the real flow.

## Before editing

1. Confirm the repository, branch and exact commit.
2. Read `AGENTS.md`, the relevant source, callers, tests, package scripts and workflow constraints.
3. Trace the affected behavior end to end. Identify data boundaries, side effects, error paths and compatibility expectations.
4. Search for existing components, helpers, dependencies and platform features before proposing a new one.
5. State the smallest change that fully satisfies the request. Exclude unrelated features.

## Choose the simplest complete implementation

Use the first option that fully works:

1. Remove the need for the feature if the requirement does not justify it.
2. Reuse an existing River Ways implementation or established project pattern.
3. Use a standard-library or native platform capability where it fits the existing architecture.
4. Use an already-installed dependency.
5. Add a dependency only when the gap is real and the maintenance, license, compatibility, security and cost are justified.
6. Otherwise write the minimum clear implementation.

Prefer deletion over addition. Avoid speculative abstractions, wrappers, configuration, generic frameworks, duplicate state, unnecessary options and premature flexibility. Keep the existing architecture and naming conventions.

## Never simplify away correctness

Preserve:
- Validation at trust boundaries and authorization checks.
- Error handling, retries and idempotency that protect data or external side effects.
- Privacy, secrets handling, tenant boundaries and safe logging.
- Accessibility, keyboard support and reduced-motion behavior.
- Existing API, route, schema and data compatibility unless a migration is explicitly part of the task.
- Tests and acceptance criteria that protect the behavior being changed.

For a bug fix, find all callers and fix the root cause once. When moving or merging code, carry over its validation and failure handling.

## Verification proportional to risk

- Trivial text or metadata edits need no new tests.
- Every new non-trivial branch, loop, parser, money/security rule or script needs a focused test or assert-based self-check.
- Run the narrowest relevant existing test first, then the build or broader suite required by the change.
- Do not create a second test framework or browser harness.
- Report commands actually run and their exact results. If execution is unavailable, mark it Not run; do not infer success from source inspection.

## Optional RTK command-output compression

RTK is an optional local developer CLI, not a runtime dependency of River Ways. If `rtk` is installed and initialized for the active coding agent, prefix supported shell commands with `rtk` (for example, `rtk git status`, `rtk npm test`, `rtk git diff`). Use `rtk gain` to measure command-output reduction.

- If RTK is absent, use the ordinary command; never block work on installing it.
- For complete diagnostic output, use `rtk bypass <command>` or the documented RTK recall mechanism.
- Preserve exit codes and inspect the full output for failures before concluding.
- Do not install RTK automatically, pipe secrets/customer data through it, or enable optional telemetry/proxy/pipelines without explicit review.
- A reduction in terminal output is not the same as an equivalent reduction in total model cost or task duration.

## Completion note

End with a concise record of what changed, checks actually run, what was not checked, and any remaining risk. Do not claim a pilot or integration is verified until there is runtime evidence.
