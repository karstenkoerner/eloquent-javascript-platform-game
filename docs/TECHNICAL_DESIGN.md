# Platform Game — Technical Design

Planning baseline v1 • 2026-10-25 • Recommended design, no application implementation supplied.

[PRD](PRD.md) defines acceptance. This document supplies compatible boundaries and defaults; the developer may use reasonable equivalent implementations and record material changes in [DECISIONS.md](DECISIONS.md). This design deliberately leaves algorithm construction to the developer.

## Architecture and ownership

Use browser ES modules and a small set of ordinary objects/functions or classes. Separate model calculation from browser effects. No framework, entity-component system, event bus, inheritance hierarchy, dependency injection container, physics engine, or build system is needed.

| Subsystem | Owns | Receives / returns | Must not own |
| --- | --- | --- | --- |
| Level loading and validation | Plan interpretation, immutable grid/start descriptors | Plan + level identity → validated level or contextual error | Browser DOM or animation |
| Actor/state model | Player, coin, lava values; fresh attempts | Validated template → independent attempt state | Browser listeners or screen coordinates |
| Simulation and collision | One bounded update and deterministic outcome | State + seconds + input snapshot → next state | Real clock, DOM, global keyboard state |
| Input | Held arrows, focus/visibility observations | Browser events → input snapshot and active/inactive status | Player coordinates or level selection |
| Display | Background, actor nodes, status, camera | Level/state → DOM synchronization | Mutating model or deciding wins |
| Animation driver | RAF handle, elapsed clock, accumulator | Timestamp → zero or more fixed updates + one render | Physics details or hidden background catch-up |
| Attempt/game runner | Current index, outcome timer, transitions, disposal | Catalog + browser adapters → game lifecycle | General-purpose engine features |
| Bootstrap | Stable page shell, startup/error text | Valid catalog → running session; errors → stopped UI | Silent error recovery loops |

A plain data object for two-dimensional positions is sufficient; a small vector class is also reasonable. A few local helper functions are preferable to speculative abstractions. State updates should produce new actor/state values without modifying the level's starting descriptors. Deep freezing every frame is unnecessary.

## Recommended directory layout

This is a future layout, not files created in this planning run. Filenames may change if responsibilities stay clear.

```text
index.html
styles/game.css
src/main.js
src/levels.js
src/model/level.js
src/model/state.js
src/model/actors.js
src/model/collision.js
src/model/simulation.js
src/browser/input.js
src/browser/display.js
src/browser/animation.js
src/browser/game.js
tests/index.html
tests/assert.js
tests/unit/*.test.js
tests/integration/*.test.js
tests/fixtures.js
README.md
LICENSE
docs/PRD.md
docs/TECHNICAL_DESIGN.md
docs/ENGINEERING_BACKLOG.md
docs/DEVELOPMENT_ROADMAP.md
docs/TEST_PLAN.md
docs/DEVELOPMENT_WORKFLOW.md
docs/RELEASE_CHECKLIST.md
docs/DECISIONS.md
```

Serve the project root over HTTP so modules resolve normally. In PG-001, choose and document one static server command using tooling already available to the developer, including any prerequisite. Do not require Node or introduce a package manager merely to run the tests. Test imports must not execute `main.js` or automatically start a game.

## Level and actor contracts

A level is a nonempty rectangle. Normalize CRLF to LF and remove empty lines at the beginning/end; preserve all other positions. Interior spaces, tabs, blank rows, and indentation are invalid rather than implicitly repaired. Show a one-based level/row/column in validation diagnostics when the defect has a location.

| Plan symbol | Background | Initial actor |
| --- | --- | --- |
| `.` | empty | none |
| `#` | wall | none |
| `+` | lava | none |
| `@` | empty | player |
| `o` | empty | coin |
| `=` | empty | horizontal lava |
| vertical bar | empty | vertical lava |
| `v` | empty | dripping lava |

World coordinates start at the upper left; x increases right and y down. A grid cell is 1×1. Actor positions are the upper-left corners of rectangles and may be fractional. All positions, sizes, speeds, and acceleration use model units; only the display converts to pixels.

| Actor | Size | Initial position relative to symbol | Additional state |
| --- | --- | --- | --- |
| Player | 0.8×1.5 | (0, -0.5) | Velocity initially (0, 0) |
| Coin | 0.6×0.6 | (0.2, 0.1) | Stable identity or reliable per-attempt reference |
| Moving lava | 1×1 | (0, 0) | Velocity; dripping variant retains reset origin |

Validate the full rectangles, not only the symbol cells. All actors must start within the world without wall overlap. The player must also start clear of stationary/moving lava and coins. Other actor overlaps are permitted structurally, although level authors must still demonstrate playability. A top-row player whose head is outside is invalid. Exactly one player and at least one coin are required. Validate the complete catalog before any gameplay begins; report failure rather than silently skipping a level. Content budget: at most 120×50 cells and 80 actors per shipped level. Authoring review enforces that budget; generic parsing need not reject otherwise valid larger fixtures.

Parser validation can use small local geometry helpers initially; PG-006 can consolidate useful helpers when runtime collision queries are introduced. This avoids a circular prerequisite. Validation checks structure and safe starts, not reachability. PG-014 proves reachability by playthrough.

## Simulation and collision boundaries

State consists of a level reference, current actor values, and `playing`, `won`, or `lost`. Level index and terminal timer belong to the runner; `complete` and `error` are runner states, not actor types. Build a fresh attempt from descriptors for every retry.

Recommended tuning (named constants, not values scattered in update code):

| Quantity | Value | Unit |
| --- | --- | --- |
| Horizontal player speed | 7 | cells/second |
| Gravity | 30 | cells/second² |
| Jump velocity | -17 | cells/second |
| Maximum downward velocity | 30 | cells/second |
| Horizontal/vertical lava speed | 2 | cells/second |
| Dripping lava speed | 3 downward | cells/second |
| Display scale | 20 | CSS pixels/cell |

These are baseline choices, not an invitation to implement a tuning system. If necessary, adjust them with evidence and rerun motion/playability tests; changed jump reach can invalidate levels.

Horizontal input is immediate with no inertia; opposing arrows cancel. Resolve horizontal solid movement before vertical movement so a wall does not cancel falling and a floor does not cancel walking. Gravity advances vertical velocity; clamp downward velocity before using it for displacement. Jump is permitted only with floor support/downward floor contact and held Up. Holding Up repeats a jump after landing, but never grants a second airborne jump. Hitting the ceiling stops ascent; it does not trigger a jump.

Solid collision uses rectangle-versus-grid queries. All outside cells are walls. Align blocked motion to the obstacle boundary and retain unobstructed movement on the other axis. Tests allow a 0.02-unit maximum resting separation; merely cancelling the entire proposed motion may leave a larger gap and is insufficient. Handle adjacent cells and corners without embedding the actor in a wall. The developer chooses the precise traversal and alignment algorithm.

Interactive overlap requires positive area on both axes. Exact edge contact is not collection/death. After each substep's actor movement, evaluate static and moving hazards first. If lethal, set lost and collect nothing. Otherwise remove all overlapping coins and win if none remain. This is a deliberate project rule; outcome must not depend on the order of actors in the array. Once a substep ends terminally, later substeps cannot reconsider the result.

Moving lava reacts to solid geometry, not other lava or coins. Bouncing variants reverse their direction when blocked without ending inside a wall. Dripping lava resets instantaneously to its stored origin when blocked; the teleport has no collidable swept path, but positive overlap at its final reset position is lethal. Collision sampling is discrete at substep result positions. This design does not promise exact continuous collision for every infinitesimal diagonal graze. The bounded timestep and velocities must pass the explicit thin-wall, fast-fall, and crossing-actor fixtures in the test plan; a swept physics engine is unnecessary.

## Input and focus

Use a focusable, labelled, stable outer game region with visible focus styling. Keep instructions/status outside the disposable attempt display. Enter with Tab or a click. Capture only the three arrow controls while the region is focused and the page is visible. Prevent their scrolling behavior only while owned by gameplay; preserve other keys and normal focus navigation.

Keep keydown/keyup handlers separate from simulation. Browser key repeat must not create multiple jumps; simulation reads held state. Ignore repeated keydown events when activating a newly cleared key, so holding a physical key across a retry/focus change does not resume movement without a fresh press.

On region blur, window blur, or document hiding, clear held keys, discard accumulated elapsed time, and suspend simulation and terminal feedback time. Resume only when the document/window is active and the game region has focus; the next timestamp establishes a new origin. No elapsed inactive time is replayed. Automatic suspension does not add Escape pause controls. Clear keys at every attempt boundary while retaining the outer focusable node.

## Animation and terminal timing

Use requestAnimationFrame for presentation, with a fixed 1/120-second simulation step and a small accumulator. A frame accepts at most 0.1 seconds of elapsed time and performs at most 12 updates; discard elapsed time beyond the cap. Render once after the updates. Carry only the fractional substep remainder between ordinary active frames. Handle zero delta without an update; do not pass negative or nonfinite time into the model. The first callback and any resumed callback establish time rather than advancing from an old timestamp.

At 30/60/120/144 Hz, identical total accepted elapsed time and identical input per simulation step should produce the same state within one step of remainder. Real key events arriving between frames can be sampled at different times, so exact equality of separately played human runs is not required. Large stalls intentionally slow game time instead of causing unlimited catch-up. Interpolation is unnecessary for this project.

As soon as won/lost is resolved, freeze all actors and latch the result. Accumulate 1.0 seconds of subsequent active simulation time for feedback. Focus suspension freezes this timer too. Transition at the first update reaching the threshold, exactly once. Display the terminal state before retry/advance. Pending time from an old attempt must not update its replacement in the same callback; discard the remainder at attempt changes.

## Runner transitions

| Current state / event | Next state and effects |
| --- | --- |
| Startup with valid catalog | Level index 0, fresh playing attempt |
| Startup with invalid catalog | Error UI, no gameplay scheduled |
| Playing + nonlethal last coin | Won, frozen model, feedback timer starts |
| Playing + hazard | Lost, frozen model, feedback timer starts |
| Lost + feedback elapsed | Dispose attempt display, reset same level and keys |
| Won + feedback elapsed, more levels | Dispose display, increment index once, fresh attempt |
| Won + feedback elapsed, final level | Complete text, no active gameplay resources |
| Active game + focus loss/hidden | Suspended clock/input; status and timer retained |
| Suspended + visible focus returns | Resume existing attempt with fresh time origin and keys |
| Any running state + caught fatal failure | Stop/dispose gameplay, preserve visible error text |

A simple runner object or an async sequence is acceptable. Do not start a second loop when the first still owns a callback. Late callbacks must be harmless after disposal. Cleanup must be safe if called twice. It may be simplest to keep one input/animation lifetime for the whole session and replace only attempt state/display. Per-attempt ownership is also acceptable if tests prove complete cleanup and focus preservation.

## Display, camera, and errors

Build the background once per attempt and overlay absolutely positioned actors. Rebuilding the small actor layer per render is acceptable; keyed reconciliation is optional. Keep the region at a maximum 600×450 CSS pixels, shrinking to the available width within the supported page size. Camera adjustments keep the player's rectangle visible with a neutral central area rather than continuously recentering; clamp scrolling to world extents. Avoid recreating the static grid every frame or measuring each actor's DOM layout.

Status text identifies the level and terminal outcomes. The final message survives display disposal. For fatal failure, dispose animation/input/attempt DOM, then preserve or set an independent error panel with recovery guidance (fix the level/configuration and reload). Show level/row/column for validation errors; log the underlying diagnostic once rather than every frame. Initial HTML contains useful startup/failure guidance and a no-JavaScript message, replaced only after successful initialization. A module-load failure cannot rely on the failed module to render its own fallback.

## Testing seams and progression

Unit tests cover parser, immutable starts, geometry, movement, and outcomes with explicit fixtures/input/time. Browser integration tests use replaceable clock/scheduler callbacks and an isolated DOM host; do not wait real seconds to verify the outcome timer. Manual tests verify feel, visibility, keyboard focus, complete routes, and browser compatibility. See [TEST_PLAN.md](TEST_PLAN.md) for expected results and traceability.

PG-005 can test animation/input using a recording callback before player physics exists. PG-008 can test terminal states before the retry runner exists. PG-010 connects display, driver, simulation, and catalog iteration. PG-015 closes integration gaps rather than postponing all tests until the end. Keep test conveniences outside product flows.
