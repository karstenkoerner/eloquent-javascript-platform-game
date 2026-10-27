# Platform Game — Development Workflow

Planning baseline v1 • 2026-10-25. This describes future work; no GitHub issues or branches have been created by the initial planning run.

## Responsibility and authorization

The junior developer implements and owns decisions within the agreed scope. The technical lead plans, explains, and reviews only the work requested. GitHub read/push/admin permission was reported for the confirmed repository, but tool availability does not authorize a mutation. Creating/updating issues, pushing documentation, opening branches/PRs, posting reviews, merging, and closing issues are performed only under explicit user instructions for that action. A review recommendation in chat does not itself post a GitHub review or merge anything.

## Issues and readiness

When issue creation is requested, first inspect current issues to avoid duplicates. Copy the relevant [backlog](ENGINEERING_BACKLOG.md) ticket with its acceptance criteria, dependencies, test expectations, and DoD. Preserve `PG-xxx` in the title/body and record the assigned GitHub number separately; provisional numbers are not GitHub numbers. Optional features need a separate approved scope ticket.

Use `type:feature`, `type:chore`, `type:test`, or `type:bug` and priorities matching the backlog if labels are useful. Labels, milestones, and a project board need not be created to begin work; their setup is a separately authorized repository action. Track the same states in issue text if a board is unavailable.

| State | Entry / exit rule |
| --- | --- |
| Backlog | Defined work with dependencies or unresolved scope; acceptance criteria may need refinement. |
| Ready | Scope and acceptance criteria are clear; dependencies are completed or the ticket explicitly supports a test stub; no blocking question remains. |
| In Progress | Developer has selected this one ticket and begun implementation. |
| In Review | PR is ready, author checks completed, tests/results and relevant screenshots supplied. |
| Done | Required review findings resolved, merge completed, acceptance verified, and issue closure recorded. |

Work on one implementation ticket at a time. Use the [roadmap](DEVELOPMENT_ROADMAP.md) to select the next ready item. Parallel opportunities describe independence, not a request for the junior developer to multitask. A blocked ticket remains visible with a concrete blocker and next action; do not label untested implementation Done.

## Branches and commits

Before starting, inspect local changes, current branch, and the remote default branch. Preserve existing work. Create a short-lived branch from current `main` for the selected ticket, for example `feat/pg-007-player-motion`, `test/pg-013-lifecycle`, or `fix/pg-008-last-coin`. Use the actual issue number in the PR link; do not guess it from PG numbering.

Prefer small meaningful commits with imperative subjects: `feat: add held-key input`, `fix: preserve focus on retry`, `test: cover lava and final coin overlap`, `docs: explain local launch`. A strict commit-lint tool is unnecessary. Keep generated logs and temporary experiments out of commits; include maintained test fixtures and relevant documentation.

## Pull requests and review

One ticket per PR is the default. If a ticket grows beyond a focused review, split it along a behavior boundary and update dependencies before continuing. Avoid unrelated refactors. PR description:

- Concrete problem and resulting behavior, with the ticket and requirement IDs.
- Acceptance criteria completed and any intentionally remaining limitation.
- Actual tests run, commands or browser steps, exact browser/version when relevant, and results; mark unrun checks explicitly.
- Screenshots for visible changes where they help review; no screenshots required for pure model changes.
- Material design deviation and updated documentation, if any.

The author reads the diff first and removes debugging leftovers. Review checks correctness, requirements, edge cases, tests, maintainability, readability, and evidenced performance concerns in that order. Distinguish verified defects, likely defects needing investigation, maintainability concerns, optional improvements, and style preferences. Do not demand a rewrite of a sound alternative solution.

Review verdicts are **Approved**, **Changes Requested**, or **Needs Clarification**. Findings include severity, evidence, file/line when available, consequence, and required direction. Optional suggestions do not become silent blockers. The technical lead supplies code only when asked and does not automatically fix the submission. Chat-only review remains chat-only unless posting is explicitly authorized.

## Merge and issue closure

After required checks pass and blocking findings are resolved, merge using a consistent simple approach; squash merge is the recommendation for these small tickets. Inspect the repository's actual settings before using any option. Do not assert branch protection or CI exists: the initial inspection found a single unprotected `main` branch and no application setup. Adding protection or automation is separate work if requested.

Merge authorization is explicit. After an authorized merge, verify the resulting `main` behavior/check results as appropriate. Close the linked issue and move to Done only when those actions are authorized and acceptance is met. Use an actual `Closes #number` link only when issue auto-closure is intended and authorized. Delete a branch only when requested/covered by the agreed action. Never treat approval of code as automatic authorization to merge, close, or delete.

## Bugs and changes

A bug report records revision, level/fixture, browser/OS, reproduction steps, expected versus actual behavior, frequency, and useful console output. Set severity by consequence: progress-blocking/crash, wrong gameplay, or minor usability/cosmetic. Reproduce where possible; label an unverified report as such. Add a focused regression case before closing a confirmed bug. Report defects locally unless issue creation is requested.

Distinguish a requirement clarification, implementation-plan adjustment, bug fix, and scope change. Clarifications and routine architecture adjustments may preserve scope; update affected acceptance criteria, dependencies, and tests together. New mechanics, removed supported browsers, or materially changed controls are scope changes requiring explicit developer approval. Optional ideas remain deferred so they do not prevent completion.

Update the PRD when behavior changes, technical design/decisions for material implementation choices, backlog/roadmap for dependency changes, test traceability for coverage, and README for user-facing instructions. Keep a single canonical requirement ID for each behavior rather than copying inconsistent descriptions into new files.
