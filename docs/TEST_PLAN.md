# Platform Game — Test Plan

Planning baseline: 2026-10-25. Status: specification only; no application tests have been executed. The [PRD](PRD.md) defines required behavior; the [technical design](TECHNICAL_DESIGN.md) defines the recommended boundaries. Test identifiers below are stable references for tickets and release evidence.

## Approach and ownership

Use a small browser-native ES-module test page with assertion helpers and a visible pass/fail summary. Serve it through the same documented local HTTP server as the game. No framework, browser automation package, bundler, coverage service, or CI setup is required. A harness failure must be visible as a failure, never a blank successful result. Assertions should include expected and actual values and the fixture name.

The developer adds relevant tests in each implementation ticket. PG-015 closes integration gaps and runs the complete suite; it does not postpone unit testing until the end. Keep simulation tests independent of browser rendering: pass explicit time steps and input snapshots. Use tiny original fixtures that isolate one rule, plus a few combined fixtures. Do not duplicate the production algorithm in expected-value calculations. Test observable results and important invariants.

Use three layers:

- **Unit:** plan parsing, validation, coordinate/state construction, overlap queries, movement, interactions, and transition decisions. Run these through browser modules without creating a game view.
- **Integration:** clock, input, simulation, attempt lifecycle, display, failure cleanup, and progression. Replace time scheduling with a controllable test clock; use a small disposable DOM host. Browser event behavior still receives manual coverage.
- **Manual:** actual keyboard behavior, readability, scrolling, every authored level, browser compatibility, and performance on a documented reference machine.

Compare exact discrete values directly. Use an absolute tolerance of `1e-6` grid units for ordinary numeric unit assertions unless a case specifies another tolerance. Wall-contact gaps must stay between zero and `0.02` units. For same-duration cadence comparisons, allow at most one fixed simulation step of phase difference; compare step-aligned snapshots exactly within numeric tolerance. Do not assert approximate floating-point values with strict equality.

## Required representative cases

Each row describes a test family. Every listed variation is part of that family for final acceptance. Earlier tickets execute the applicable subset and record the later integration variations as pending until their implementing ticket. Automated cases can be several small assertions rather than a single large scenario.

| ID | Layer and setup/action | Explicit expected result |
| --- | --- | --- |
| T-001 | Manual + integration: follow the README from a fresh checkout, start the documented local server, load the game and test page. | Assets and ES modules load over HTTP; the first level is displayed with controls and a focusable game region; no uncaught error or failed asset request occurs. The test page shows a result summary. PG-001 initially verifies the shell; final acceptance repeats against the completed game. |
| T-002 | Unit: parse a small valid plan containing each supported symbol; repeat with LF, CRLF, and outer empty lines. | All variants produce equal dimensions, terrain, actor kinds, and initial coordinates. Actor symbols leave empty terrain. Rows preserve their authored width. Player size is `0.8 × 1.5` at marker offset `(0, -0.5)`; coin size `0.6 × 0.6` at `(0.2, 0.1)`; moving lava size is `1 × 1`. |
| T-003 | Unit + integration: supply an empty plan/catalog, ragged rows, an interior empty row, a space or unknown character, missing/multiple players, and zero coins. | Each invalid fixture is rejected before gameplay. No whitespace repair silently changes a level. The diagnostic identifies the level and explains the violated rule; cell-specific defects include row and column. No partial game starts and no level is silently skipped. |
| T-004 | Unit: put the full player rectangle beyond a boundary, inside a wall, or overlapping static lava, moving lava, or a coin; test another actor overlapping a wall or extending outside the level. | Every unsafe initial layout is rejected. A player whose marker is in a valid cell but whose extra half-cell height crosses a wall/boundary is still invalid. Exact-edge contact without positive overlap is accepted when all other rules hold. |
| T-005 | Unit: start two attempts from one parsed level; move an actor and collect a coin in the first; retain its prior state snapshot. | The second attempt has original actors, positions, velocities, coin inventory, and `playing` status. The level/start templates and earlier state snapshots remain unchanged. Fractional positions are preserved. |
| T-006 | Unit: rectangles overlap, separate, share only an edge/corner, or cross one/all four world limits; query wall and lava tiles separately. | Only positive-area overlap is an actor collision. Grid queries include every intersected cell without out-of-range reads. Outside space is solid on every side, including the bottom; it is not lava and does not itself cause loss. A neighboring wall does not make a separate lava query true. |
| T-007 | Unit: on an unobstructed floor, hold Right for exactly 120 fixed steps, then release; repeat Left, both keys, and airborne direction changes. | Right changes x by `+7` units in one simulated second; Left by `-7`; both cancel to zero horizontal speed. Release stops horizontal travel on the next step. Midair direction follows the same input without requiring a landing. |
| T-008 | Unit: fall from rest without contact; jump from a supported position; press Up in midair; hold Up through landing; strike a ceiling. | Gravity changes downward velocity by `30 × dt` before the maximum fall speed of `30` is reached. A supported jump applies vertical speed `-17`; airborne Up creates no second jump. Holding Up starts a fresh jump when the player lands. A ceiling cancels upward motion and never grants a jump. |
| T-009 | Unit + integration: walk into each wall, land on a one-cell platform, fall at the capped speed, slide down a wall, move along a floor, and meet an inside corner. Repeat at ordinary and capped frame delays. | No solid penetration or passage through a one-cell barrier. The blocked axis stops while the free axis continues; stable contact leaves a gap of at most `0.02` units. Landing with Up released sets vertical speed to zero; ceiling contact does likewise. All four world boundaries block travel. |
| T-010 | Unit: overlap one of several coins, then multiple coins in one step, then the last coin; separately test exact-edge contact. | Each overlapping coin is removed once, other actors remain, and the count cannot become negative. Remaining coins keep status `playing`; removing the final coin gives `won`. Edge-only contact leaves the coin present. |
| T-011 | Unit: overlap a static lava tile from above, below, and either side; compare edge-only contact and a nearby non-overlap. | Positive overlap gives `lost` regardless of approach. Lava is hazardous rather than a solid support platform. Edge-only contact and nearby non-overlap leave status unchanged. |
| T-012 | Unit: exercise horizontal and vertical moving lava in open space, then against a wall and world boundary; overlap it with the player. | Bouncing lava moves at `2` units/second along its assigned axis, reverses on a blocking solid boundary, and does not penetrate it. It neither pushes nor bounces off coins or other lava. Player overlap causes loss. For an opposing-motion fixture with overlapping x extents and no walls, set player top y=1, height=1.5, downward speed=30 and vertical lava top y=2.6, height=1, upward speed=2, plus a remote remaining coin. After one 1/120-second step, player bottom=2.75 and lava top≈2.583333 overlap; status must be lost. |
| T-013 | Unit: run dripping lava downward into a floor, then repeat its cycle; place the player on a point crossed only by the reset teleport and, separately, at the reset destination. | Downward speed is `3` units/second. On blocked movement it returns to its original spawn and retains downward motion for the next step. The teleport path itself is not lethal; overlap at its resulting destination is lethal. Reset origin does not drift after repeated cycles. |
| T-014 | Unit: overlap the final coin and a static hazard or moving hazard in the same substep. Permute actor-array order. Also place a terminal event in an earlier substep of the same rendered frame. | Every same-substep combination yields `lost`, with no coin collection during that lethal substep, regardless of array order. A result reached in an earlier substep is locked; a later substep cannot turn a win into a loss or vice versa. |
| T-015 | Unit + integration: enter `won` or `lost`, keep sending movement input, and advance controlled active time to just below and then through one second. Repeat with a focus interruption. | Actor state and terminal status remain frozen. No transition occurs before one active second. The attempt transition happens once on the first fixed step reaching that duration, within one step tolerance. Time while unfocused/hidden contributes zero to the delay. If the transition occurs early in a multi-step frame, discard remaining old-attempt time: the fresh replacement stays at its initial state until a subsequent callback. |
| T-016 | Integration: lose after moving lava, moving the player, and collecting some coins; wait for feedback; repeat several times. | The same level index restarts with all original coins, actor positions/velocities, reset origins, and fresh `playing` status. Held-input state is cleared. The outer game region retains focus across attempt display replacement. A physically held key does not carry motion into the new attempt; auto-repeat keydown events cannot reactivate a cleared key until a fresh physical press. |
| T-017 | Integration: win a two-level fixture catalog, lose on the second level, then win it; attempt additional updates after completion. | First win advances exactly once; loss retries only the second level. Final win shows visible completion text, stops gameplay, and does not read a nonexistent next level. Reload starts the first level again. |
| T-018 | Integration + manual: focus the game, press/hold/release arrows, trigger key repeat, hold both directions, and use Tab. Try arrows while another page control is focused. | Key repeat does not accumulate speed or multiply jumps. Keyup clears the held state. Only the focused active game consumes arrow defaults; Tab remains normal navigation. No movement or page-scroll suppression is applied outside the game region. Instructions and focus indication make activation clear. |
| T-019 | Integration + manual: while moving or during terminal feedback, blur the game region, blur the window, or hide the tab. Return after several seconds and refocus without pressing a key. | Input clears and simulation/terminal timer freeze. Returning discards stale elapsed time and the prior accumulator. Gravity, hazards, and the outcome timer resume when visible window/game focus returns with a reset clock. Input-driven movement requires a fresh non-repeat keydown. Resume creates no second active loop. |
| T-020 | Integration: drive the clock with first callback, zero/negative/non-finite deltas, ordinary intervals, a `100 ms` interval, and a `2 s` stall. Inspect updates and renders. | The first callback establishes an origin without advancing. Invalid/zero deltas do not advance state. Every update receives `1/120 s`; no rendered frame performs more than 12 updates. At most `0.1 s` from a frame is accepted; excess stall time is discarded, never queued for later catch-up. Render occurs once per active callback; no actor receives the whole stall as one step. |
| T-021 | Integration: run the same fixed-duration input schedule at synthetic 30, 60, 120, and 144 Hz with identical starting state. Include walking, a jump, moving lava, and a coin/hazard sequence whose inputs are specified at simulation-step boundaries. | At matching simulation steps, positions, velocity, coin inventory, and outcomes match within numeric tolerance. End snapshots differ by at most one step of phase due to frame sampling. A stalled schedule is tested for safety, not equal wall-clock progress. |
| T-022 | Integration: instrument listener registration and scheduling, complete 20 retries, change levels, then complete the game; repeat with a fatal error and disposal called twice. | There is never more than one active animation chain or one set of input handlers. Superseded display nodes are removed while the focusable outer game region remains stable across attempts. Completion/error/disposal leave no scheduled gameplay update or gameplay listener. Repeated disposal is harmless. |
| T-023 | DOM integration + manual: display each terrain/actor type, update fractional positions, collect a coin, enter both terminal states, and complete the game. | DOM positions/sizes correspond to the model at `20 px` per grid unit. The static grid is not rebuilt on every frame; removed coins disappear. Walls, hazards, player, and coins are visually distinguishable. The current-level indicator matches the runner index and updates on progression. Win/loss/completion have readable text feedback as well as styling. Rendering leaves model values unchanged. |
| T-024 | DOM integration + manual: use a level exceeding both viewport dimensions, walk/jump to every edge, then resize the browser to supported sizes including `800 × 600`. | The player remains visible; scroll positions stay within the level's legal extent without exposing blank outside space. Small central motion does not force constant recentering. The view is at most `600 × 450 px` and fits available page width; controls/status remain readable. Resizing changes presentation, not physics coordinates. |
| T-025 | Integration + manual: inject malformed catalog data, a controlled initialization exception, a controlled update/render exception, and a missing module request; disable JavaScript separately. | Runtime/data failures stop gameplay and clean resources, display actionable error text, and retain useful console detail. There is no endless retry or silent level skip. Fatal error text survives display cleanup. Missing-module/disabled-JavaScript cases retain static fallback guidance rather than an unexplained blank page; startup fallback is removed only after successful initialization. |
| T-026 | Manual + catalog checks: validate all three shipped plans, play each from its real spawn without debug skips, deliberately lose at each hazard type, and finish the whole sequence. | Every coin is reachable and each level is winnable using required controls. All moving-lava variants and static lava appear across the catalog; at least one level demonstrates scrolling. Each plan stays within `120 × 50` cells and 80 initial actors. No spawn trap or unavoidable death blocks completion. Record route notes and problematic jumps. |
| T-027 | Manual compatibility: on each supported browser, run the complete automated suite and the release smoke route described below. | Every required browser has an explicit pass or failure record with exact browser/OS versions. An unavailable browser is recorded as not tested and cannot count as passed. Functionality and layout satisfy the same requirements on each platform. |
| T-028 | Manual performance: profile the representative largest/most populated delivered level for 60 seconds of active play on the documented 60 Hz reference setup, including movement, hazards, and scrolling. | Report sample count, median and 95th-percentile frame intervals, and long stalls. Median is at most `16.7 ms`; p95 at most `33.4 ms`. No growing actor DOM/listener/loop count occurs across repeated retries. Intentional background suspension is excluded and recorded separately. |
| T-029 | Inspection: inspect module imports, entry points, package usage, runtime network requests, and test seams. | The application uses vanilla JS/HTML/CSS and standard browser APIs with no runtime framework or external service. Core simulation has no DOM/event/scheduler dependency. Model tests run without a view; display does not own physics. No build step is required. |
| T-030 | Manual documentation check: have a reader follow setup, controls, test, and known-limitation instructions; inspect references and asset provenance. | Instructions match actual commands and files; they explain HTTP serving, controls/focus, retry/progression, supported browsers, and how to run tests. The chapter is credited; original level authorship and any reused material are identified accurately. Existing repository license is preserved. |
| T-031 | Harness self-check + regression: deliberately fail one assertion, cause an unexpected test exception, restore the passing fixtures, then run twice from a fresh test state. | Failures and exceptions appear in the result summary and cannot be counted as passes. Both normal runs have identical case counts and results. Tests release their DOM/listeners/timers and leave no state that affects later cases. Record actual executed results; never infer success from static review. |

## Browser and manual execution matrix

At release, use current stable desktop Chrome, Edge, and Firefox on Windows, plus Safari on macOS. Record the exact versions actually used rather than assuming a version from the date. These are target platforms, not verified compatibility claims. If Safari hardware is unavailable, arrange a run by someone with access or explicitly seek a scope change; do not silently remove that target.

For every browser run T-001, the complete browser test suite, and a smoke route covering held controls, wall/ceiling contact, jump and midair steering, a coin, every lava variant, one retry, level advancement, final completion, focus loss/tab switching, and scrolling at an `800 × 600` or larger viewport. Perform T-026's full three-level playthrough in every supported browser, recording the result and any browser-specific failure. Include a brief larger-window resize check. Mobile/touch support is outside this baseline.

Use a compact evidence record:

| Build/commit | Date | OS and browser version | Cases/run route | Pass/fail/not tested | Failure details or evidence |
| --- | --- | --- | --- | --- | --- |
| Not yet implemented | — | — | T-001 through T-031 | Not run | Planning document only |

Performance evidence also records machine CPU, memory, display refresh rate, browser version, level dimensions/actor count, and whether developer tools or throttling were active. Frame scheduling is environment-sensitive: a miss requires investigation on the recorded setup, not an unsupported claim that every computer is slow or broken. Functional correctness is independently required even when performance passes.

## Regression and release gates

Run affected unit/integration cases before each PR. Include the issue's requirement IDs, executed case IDs, actual results, and manual observations in the PR. Every confirmed bug receives a focused reproduction/regression case in the layer that owns the behavior. Re-run the full automated suite when changing shared collision, time, state transitions, or input lifecycle; those affect many features. A documentation-only change needs its relevant documentation checks, not an unrelated gameplay re-run.

Before release, execute the complete suite, the browser matrix, the catalog playthrough, and the performance check. Required tests cannot be waived silently. Record known defects with reproduction, impact, affected requirement, and owner; apply the [release checklist](RELEASE_CHECKLIST.md) to decide readiness. Optional enhancements are excluded from these gates until explicitly added to scope.

## Requirements traceability matrix

Every mandatory requirement maps to implementation work and an explicit verification method. The PG numbers are provisional ticket identifiers, not existing GitHub issue numbers. Shared tests may verify multiple requirements; optional items have no release obligation.

| Requirement | Implementation ticket(s) | Verification |
| --- | --- | --- |
| FR-001 — startup | PG-001, PG-012 | T-001, T-025 |
| FR-002 — plan representation | PG-002 | T-002 |
| FR-003 — level validation | PG-002, PG-012 | T-003, T-004, T-025 |
| FR-004 — state and coordinates | PG-003 | T-002, T-005 |
| FR-005 — held input and focus | PG-005, PG-013 | T-018, T-019 |
| FR-006 — horizontal movement | PG-007 | T-007, T-009 |
| FR-007 — gravity and jumping | PG-007 | T-008, T-009 |
| FR-008 — walls and world bounds | PG-006, PG-007, PG-009 | T-006, T-009, T-012, T-013 |
| FR-009 — coin collection | PG-008 | T-010, T-014 |
| FR-010 — static hazards | PG-008 | T-011, T-014 |
| FR-011 — moving hazards | PG-009 | T-012, T-013, T-014 |
| FR-012 — terminal resolution | PG-008, PG-009, PG-010 | T-014, T-015 |
| FR-013 — retry | PG-010 | T-005, T-016, T-022 |
| FR-014 — progression and completion | PG-010 | T-017, T-022 |
| FR-015 — rendering and status | PG-004, PG-010 | T-023 |
| FR-016 — viewport following | PG-011 | T-024 |
| FR-017 — bounded timing | PG-005, PG-013 | T-020, T-021 |
| FR-018 — resource lifecycle | PG-005, PG-010, PG-012, PG-013 | T-019, T-022, T-025 |
| FR-019 — error feedback | PG-012 | T-003, T-004, T-025 |
| FR-020 — playable catalog | PG-014 | T-026 |
| NFR-001 — vanilla stack | PG-001, PG-015 | T-001, T-029 |
| NFR-002 — subsystem separation | PG-001, PG-003, PG-004, PG-005, PG-015 | T-005, T-023, T-029 |
| NFR-003 — repeatable lightweight testing | PG-001, PG-015; tests in every implementation ticket | T-031; recorded per-ticket regression runs |
| NFR-004 — browser compatibility | PG-016 | T-027 |
| NFR-005 — keyboard and text usability | PG-004, PG-005, PG-010, PG-011, PG-016 | T-018, T-023, T-024, T-027 |
| NFR-006 — usable documentation and attribution | PG-001, PG-014, PG-016 | T-001, T-030 |
| NFR-007 — performance and capacity | PG-011, PG-014, PG-016 | T-024, T-026, T-028 |








