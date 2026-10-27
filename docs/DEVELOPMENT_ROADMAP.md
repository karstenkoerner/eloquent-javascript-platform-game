# Development Roadmap

Planning baseline: 2026-10-25. This roadmap describes future work by the developer; no ticket has been implemented, opened as a GitHub Issue, or reviewed as a pull request during planning. Detailed scope is in [Engineering Backlog](ENGINEERING_BACKLOG.md). Requirements and release scope are in [PRD](PRD.md).

## Recommended first ticket

**PG-001 — Establish the project shell, local launch, and test harness.** The inspected repository has a license but no application or development setup. PG-001 makes every later ticket runnable and reviewable. Its completion is a working shell and test harness, not a premature implementation of gameplay.

Before beginning, the developer should adopt or revise the proposed baseline decisions in [Engineering Decisions](DECISIONS.md), particularly level syntax, rendering, timing, input, collision, and browser support. This is normal project alignment; it does not require an additional architectural discovery phase. Preserve the existing license. GitHub issue creation and any assistant repository changes require a later explicit request.

## Milestones

| Milestone | Objective | Required tickets | Dependencies | Expected deliverable | Verification criteria |
|---|---|---|---|---|---|
| M1 — Foundation and model | Establish a runnable project and trustworthy level/state data. | PG-001, PG-002, PG-003 | None outside this milestone. | Documented local server, browser test harness, validated plans, and isolated attempt state. | A clean checkout launches; malformed plans fail clearly in tests; every required actor can be represented; attempts cannot corrupt templates. |
| M2 — Visible, controllable world | Connect display, input, time, geometry, and player motion. | PG-004, PG-005, PG-006, PG-007 | M1; PG-005 can start after PG-001. | A visible fixture with walking, falling, jumping, and solid collision. | Manual movement works; geometry/physics tests pass; focus and bounded timing work against a stub or real simulation; model stays independent of DOM. |
| M3 — Minimum viable playable version | Add objectives, every hazard behavior, and complete attempt/session flow. | PG-008, PG-009, PG-010 | M2. | One compact playable level with collection, loss/retry, visible outcomes, and completion; a two-level fixture proves advancement. | Player can win or lose, retries restore everything, all hazard variants have tests, same-substep lava precedence is deterministic, completion ends gameplay resources. |
| M4 — Complete content and integration | Make the required catalog usable and lifecycle failures predictable. | PG-011, PG-012, PG-013, PG-014 | M3; PG-011 can start after PG-004 and PG-007. | Three verified levels, scrolling, clear failures, and robust focus/timing/attempt integration. | Every level is manually completed; scrolling keeps the player visible; failure injection cleans resources; timing schedules and repeated retries pass integration checks. |
| M5 — Release acceptance | Demonstrate completion against the full scope. | PG-015, PG-016 | M4. | Passing regression evidence, browser results, complete README, and evaluated release checklist. | Requirement traceability is complete; target-browser acceptance and performance checks pass; no blocking defects remain; unrun checks are explicitly identified. |

**MVP boundary:** M3 is the first complete gameplay loop, including all three moving-lava behaviors. It uses a compact fixture and need not yet contain the finished three-level catalog, scrolling content, startup fault coverage, or all browser evidence. It is an internal playable checkpoint, not final release acceptance. Do not advertise M3 as satisfying requirements assigned to M4/M5.

## Execution order and dependencies

Recommended solo execution order:

**PG-001 → PG-002 → PG-003 → PG-004 → PG-005 → PG-006 → PG-007 → PG-008 → PG-009 → PG-010 → PG-011 → PG-012 → PG-013 → PG-014 → PG-015 → PG-016.**

This order is intentionally simple and satisfies every dependency. Select the next Ready ticket only after checking actual completed work, unresolved review findings, and dependency status. The numeric identifiers are stable references, not an instruction to ignore a legitimate dependency adjustment.

| Ticket | Direct dependencies | Becomes ready when |
|---|---|---|
| PG-001 | None | Baseline scope and local tooling are understood. |
| PG-002 | PG-001 | Module loading and assertions work. |
| PG-003 | PG-002 | Validated spawn descriptions are available. |
| PG-004 | PG-003 | Display can consume state snapshots. |
| PG-005 | PG-001 | Test callbacks can run without real gameplay. |
| PG-006 | PG-002 | Static grid and coordinate contract are available. |
| PG-007 | PG-003, PG-004, PG-005, PG-006 | State, display, time/input, and geometry contracts support a manual movement fixture. |
| PG-008 | PG-007 | Player movement can produce interaction positions. |
| PG-009 | PG-008 | Terminal rules can include moving hazards. |
| PG-010 | PG-004, PG-005, PG-009 | Display, loop/input, and complete mechanics can be orchestrated. |
| PG-011 | PG-004, PG-007 | Display and moving-player fixtures can exercise a camera. |
| PG-012 | PG-002, PG-010 | Validation and session resource ownership can be joined. |
| PG-013 | PG-010, PG-012 | Successful and failed session lifecycles exist. |
| PG-014 | PG-009, PG-010, PG-011, PG-012 | All mechanics, progression, scrolling, and startup validation work. |
| PG-015 | PG-013, PG-014 | Integration and finished content are available for regression. |
| PG-016 | PG-015 | The automated regression baseline is ready for browser acceptance. |

There is no circular dependency. PG-002 can use a small local spawn-geometry helper before PG-006 provides general runtime collision queries. PG-005 uses a stub simulation and does not depend on PG-007. PG-010 uses temporary compact fixtures and does not depend on the final catalog in PG-014. Test cases accompany each behavior; PG-015 gathers evidence and closes gaps.

## Independent work, if useful

The default remains **one implementation ticket in progress at a time** for the junior developer. Parallel opportunities describe technical independence, not a workload target:

- After PG-001, PG-005 can proceed independently of PG-002/PG-003.
- After PG-003, PG-004 and PG-006 can proceed independently, sharing the established coordinate contract.
- After PG-007 and PG-004, PG-011 can proceed while PG-008/PG-009 add interactions.
- After PG-012, PG-013 and PG-014 can proceed independently if PG-011 is also complete. Agree on fixtures and content changes so playthrough evidence is not invalidated accidentally.

Coordinate browser access early: PG-016 requires Windows Chrome/Edge/Firefox and macOS Safari evidence. Browser access is an external dependency, not a new code dependency. A missing environment is recorded as untested; release support cannot be claimed until evidence is supplied or the developer explicitly changes scope.

## Milestone gates and change handling

At each gate, compare the delivered behavior with the linked ticket acceptance criteria, run relevant checks, and record only verified results. Keep an unresolved defect in the current milestone if it prevents the next milestone from working. Small defects may use a focused follow-up ticket with severity and release impact; do not silently redefine acceptance criteria to mark work Done.

Requirement clarifications and ticket splits can preserve scope. Added controls, limited lives, Escape pause, monsters, sound, persistence, or other optional features require explicit scope approval and are not part of this sequence. The final gate uses [Release Checklist](RELEASE_CHECKLIST.md); implementation stops at the accepted project scope.

