# Platform Game — Product Requirements

Planning baseline v1 • 2026-10-25 • Status: proposed engineering specification; implementation not started.

## Purpose and users

Build a small keyboard-controlled browser platform game while practicing JavaScript, decomposition, tests, Git, review, and completion of a stable scope. The primary user is a desktop player; the secondary user is the junior developer learning to maintain the project. The developer implements the application. The technical lead assigns, explains, and reviews work when asked.

This document owns required behavior. [Technical design](TECHNICAL_DESIGN.md) owns recommended implementation contracts; [decisions](DECISIONS.md) explains choices. [Test plan](TEST_PLAN.md) contains the requirements traceability matrix. Recommendations become the working baseline when development begins unless the developer identifies a conflict; optional features remain excluded until explicitly approved.

## Repository and planning evidence

The user confirmed [karstenkoerner/eloquent-javascript-platform-game](https://github.com/karstenkoerner/eloquent-javascript-platform-game). GitHub reads on 2026-10-25 found only `LICENSE` (Apache 2.0) on `main`, at commit `b84606952855f60acaac051254fa9d6ca8176875`, titled `Initial commit`. Branch listing returned only `main`; all-state issue and PR listings were empty. No application, README, tests, or existing planning documentation was present in that inspected tree.

The connector authenticated as `karstenkoerner`; repository metadata reported pull/push/admin and the collaborator permission endpoint returned admin. Repository reads are verified. Content-write tools are available and account permission supports writes, but no write was attempted; an actual future write remains subject to connector authorization and repository rules. These documents are local outputs, intended for a future `docs/` directory. No issues, branches, commits, or PRs were created.

## Research and provenance

The [official fourth-edition chapter](https://eloquentjavascript.net/16_game.html) was accessible and inspected. Its baseline combines arrow-key movement and jumping, grid scenery, fractional actor positions, coins, stationary lava, bouncing lava, and downward lava that resets. Collecting all coins completes a level; lava causes a retry. It uses DOM rendering and a scrolling viewport. Limited lives, Escape pause, and monsters are exercises.

The requirements below are this project's specification, not a reproduction of the chapter. Origin labels distinguish **Core** (user-requested textbook functionality), **Detail** (a concrete rule needed to implement it), and **Engineering** (a recommended quality improvement adopted into this proposed baseline). Exact level count, validation policy, deterministic conflict handling, terminal freeze, focus handling, timing limits, textual completion, and release gates are project choices.

## Functional requirements

All FR requirements are mandatory for v1. Each row states observable acceptance criteria. Values and edge cases are elaborated in the technical design without changing the behavior here.

| ID | Origin | Requirement and objective acceptance criteria |
| --- | --- | --- |
| FR-001 | Core/Detail | **Launch.** Loading the documented local HTTP URL loads local modules/assets and displays the first level with instructions. Focusing the game enables controls. A fresh reload restarts at level one. No account, remote API, or build step is needed. |
| FR-002 | Core/Detail | **Level representation.** Parse nonempty rectangular rows using `.`, `#`, `+`, `@`, `o`, `=`, vertical bar, and `v`. They represent empty space, wall, static lava, player, coin, horizontal lava, vertical lava, and dripping lava respectively. Width/height match the plan; actors leave empty background cells; actors support fractional positions. |
| FR-003 | Engineering | **Validate content.** Before play, reject an empty catalog, empty/ragged plans, interior blank rows, unknown symbols, anything other than one player, zero coins, actors outside bounds or inside walls, and initial player overlap with lava or a coin. Normalize CRLF and remove outer empty lines only; whitespace must not silently change geometry. Errors identify the level and row/column when applicable. All shipped plans pass. |
| FR-004 | Detail | **Fresh state.** An attempt contains one player, independent actors, and `playing` status. Starting or retrying reproduces original positions, velocities, coins, and hazard origins; a previous attempt cannot mutate the level template. Model units are grid units, independent of screen pixels. |
| FR-005 | Core/Engineering | **Input.** Held Left/Right/Up act continuously while the visible game region has focus. Both horizontal keys cancel. Only game arrow keys suppress page scrolling; Tab works normally. Blur/hiding clears input and freezes simulation. Visible window/game focus resumes gravity, hazards, and timers with a fresh clock; input-driven movement requires a fresh physical key press. Attempt changes also clear input. |
| FR-006 | Core/Detail | **Horizontal motion.** Left/right move in the requested direction at the same speed on ground and in air; releasing stops horizontal movement, except collision already prevents it. Midair steering is available; no horizontal inertia is required. |
| FR-007 | Core/Detail | **Vertical motion.** Gravity causes falling. Up initiates a jump only with floor support; holding Up repeats after landing. No airborne second jump. Ceiling collision stops ascent, and the player subsequently falls. Landing stops descent. Baseline tuning is in the design; maximum fall speed is bounded. |
| FR-008 | Core/Detail | **Solid collision.** Walls and all four outside boundaries block actors. A player cannot pass through a one-cell wall, floor, or ceiling at supported speeds/steps. Touching a wall does not block movement along the other axis. Stable floor/wall separation is at most 0.02 grid units. Outside space does not itself cause death. |
| FR-009 | Core/Detail | **Coins.** Positive-area overlap collects each touched coin once and removes it from play and view. Collecting multiple coins in one update works. A nonlethal update collecting the last coin wins. Merely matching an edge does not collect. |
| FR-010 | Core/Detail | **Stationary lava.** Positive-area overlap with static lava loses the attempt. Lava is hazardous rather than a supporting platform. Exact edge adjacency alone does not lose. |
| FR-011 | Core/Detail | **Moving lava.** Horizontal and vertical lava reverse at solid obstacles; dripping lava moves down and resets to its original position when blocked. All three are lethal on positive overlap with the player. Reset teleport does not collide along an imaginary path. Lava does not bounce off coins or other actors. |
| FR-012 | Engineering | **Outcome resolution.** For one simulation substep, any lethal overlap takes precedence over coin collection, independently of actor order; no coins are collected on that lethal substep. Once won/lost, the result and actor positions freeze. Later substeps cannot reverse it. Display outcome feedback for 1.0 seconds of active simulation time before transition. |
| FR-013 | Core/Detail | **Retry.** After loss feedback, restart the same level with its full initial state and cleared keys. Retry count is unlimited; no lives are consumed. Repeated retries retain one active game loop and the intended listener count. |
| FR-014 | Core/Engineering | **Progression.** After win feedback, start exactly the next level. After the last level, show persistent completion text and stop gameplay/its resources without indexing past the catalog. Reload is sufficient to play again. |
| FR-015 | Core/Engineering | **Rendering and feedback.** Display walls, lava, player, and coins as distinguishable styled DOM shapes aligned to model positions. Show controls, current level, and textual win/loss/completion status. Removing a coin removes its visual; restarting clears the previous display. |
| FR-016 | Core/Detail | **Viewport.** In a level larger than the view, scrolling keeps the entire player visible through horizontal and vertical traversal; world edges do not expose blank space outside the level. Resizing within supported dimensions keeps the game usable. A small level does not induce unnecessary scrolling. |
| FR-017 | Detail/Engineering | **Timing.** Use elapsed time and bounded simulation updates, independent of display frame count. For scripted input at ordinary 30/60/120/144 Hz, state agrees within one simulation step. A long stall cannot create a giant step or unlimited catch-up. First/resumed frames establish a fresh clock. |
| FR-018 | Engineering | **Resource lifecycle.** One owner controls animation, input, and display lifetime. Retry/progression dispose obsolete resources. Completion/fatal error leave no active gameplay callbacks or captured game keys. Blur/hiding suspends both gameplay and the outcome timer; no elapsed hidden time is replayed. |
| FR-019 | Engineering | **Failure handling.** Invalid content and caught startup/runtime failures produce readable, actionable page text; stop and clean up the game rather than silently skipping or repeatedly retrying. Developer diagnostics preserve cause/context. Static startup text remains useful if JavaScript/modules fail to load. |
| FR-020 | Detail | **Playable content.** Ship three original, short predefined levels in a fixed order. Across the catalog demonstrate jumping, coins, static lava, all three moving lava types, and at least one scrolling level. Every level has a documented successful manual route; every coin is reachable. No procedural generation is needed. |

## Nonfunctional requirements

| ID | Requirement and objective acceptance criteria |
| --- | --- |
| NFR-001 | **Minimal stack.** Runtime consists of vanilla JavaScript, HTML, CSS, and standard browser APIs. No framework, physics engine, external runtime package, build pipeline, or required third-party network request. Development-only static serving is documented. |
| NFR-002 | **Separation and clarity.** Simulation/level modules run under the test harness without DOM, animation, or keyboard globals. Rendering consumes model state without changing it. Constants have named units. Modules have clear responsibilities; no general-purpose engine is required. |
| NFR-003 | **Repeatable verification.** A documented browser test page reports named passes/failures and an aggregate result. Model tests supply time/input explicitly and use fixed fixtures. Every implemented behavior has relevant automated checks or an explicit manual case; no claims of tests passed without execution evidence. |
| NFR-004 | **Browser support.** Pass the release test matrix on desktop stable Chrome, Edge, Firefox on Windows and Safari on macOS available at release time. Record exact versions and OS. An unavailable browser is untested and blocks claiming full support; narrowing support requires an explicit scope decision. |
| NFR-005 | **Keyboard and text usability.** At a CSS viewport of at least 800×600, controls and status are readable, game focus is visible, Tab can enter/leave the game, and color is not the sole outcome signal. This is not a claim of complete nonvisual gameplay accessibility. |
| NFR-006 | **Documentation and provenance.** README explains local serving, controls, objective, retry/progression, test execution, browser targets, limitations, and source inspiration. Record authorship/source of levels and any reused material. Preserve the existing repository license; inspect applicable notices before importing third-party material. |
| NFR-007 | **Bounded workload.** Authored levels contain at most 120×50 cells and 80 actors. On a documented reference machine at a 60 Hz display, a 60-second active run of the largest shipped level has median frame intervals ≤16.7 ms and p95 ≤33.4 ms, with no increasing DOM/listener counts after 20 retries. Record measurement setup; this is a release target, not a claim about every device. |

## Scope exclusions and optional enhancements

No backend, accounts, persistence, scoring economy, multiplayer, level editor, touch/gamepad support, mobile certification, Canvas renderer, deployment automation, or asset pipeline is part of v1. The core runs from local static files served over HTTP.

| ID | Optional item | Acceptance if separately approved |
| --- | --- | --- |
| OPT-001 | Limited lives | A separate scope ticket defines life count and restart behavior and supersedes unlimited retries explicitly. |
| OPT-002 | Escape pause | A separate ticket defines pause/resume controls and interactions with focus and outcome timers. |
| OPT-003 | Monsters | A separate ticket specifies movement, defeat/contact rules, and tests without silently changing lava behavior. |
| OPT-004 | Cosmetic animation, sound, or additional controls | Each approved addition has its own behavior and verification ticket. Coin wobble is not required for v1. |

Optional items have no mandatory backlog tickets and cannot block this release. Automatic focus suspension is an input/lifecycle safeguard; it does not authorize a pause menu or Escape feature.

## Final acceptance

Release requires every FR and NFR row verified, all 16 mandatory tickets complete under their acceptance criteria, the [release checklist](RELEASE_CHECKLIST.md) satisfied, and the [traceability matrix](TEST_PLAN.md#requirements-traceability-matrix) supported by actual results. The developer can complete all three levels from a fresh launch, recover from losses, and reach final completion in each supported browser. No mandatory behavior may be silently waived as an optional improvement. Planning completion itself establishes no implementation or test-pass evidence.

