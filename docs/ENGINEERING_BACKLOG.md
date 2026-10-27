# Engineering Backlog

Planning baseline: 2026-10-25. These are proposed issue bodies, not existing GitHub Issues. `PG-*` identifiers remain stable planning references; record GitHub's assigned issue number beside each identifier when issue creation is authorized. Requirements are authoritative in [PRD](PRD.md); implementation boundaries are in [Technical Design](TECHNICAL_DESIGN.md).

## How to use this backlog

Priorities: **P1** means foundational or required gameplay; **P2** means required integration, content, or release readiness. Both priorities are mandatory for release. Complexity describes the engineering challenge, not an hourly commitment: **S** is one bounded behavior, **M** is several closely related behaviors, and **L** is integration across multiple subsystems. Start with one ticket at a time. If a ticket needs multiple unrelated design decisions, split it before implementation while preserving its acceptance criteria and dependencies.

**Common Definition of Done (DoD):** acceptance criteria met; focused tests added or updated and actually run; applicable regression checks pass; relevant documentation updated; PR describes behavior and test evidence; no unresolved blocking review findings; approved work merged through the agreed workflow. A ticket's specific DoD below supplements this common standard. Unit tests belong in the implementation ticket; PG-015 does not postpone them. Test-family references apply to the behavior owned by that ticket: later lifecycle/browser variations remain pending until their implementing ticket, rather than blocking an earlier partial feature. Review may accept reasonable designs that satisfy the same contracts.

## PG-001 — Establish the project shell, local launch, and test harness

- **Type:** Engineering foundation
- **Priority:** P1
- **Objective:** Give the developer a repeatable way to load browser modules and verify subsequent work.
- **Requirements:** FR-001; NFR-001, NFR-002, NFR-003, NFR-006. Use vanilla JavaScript ES modules, HTML, and CSS; preserve the existing license. Choose an already available static HTTP server and document its exact command and prerequisite. Do not add a build pipeline or runtime framework.
- **Acceptance criteria:** A clean checkout can serve the application shell and a separate browser test page using the README instructions. Module imports resolve without console errors. The test page visibly reports passed and failed assertions, isolates cases, and demonstrates that a deliberate failing fixture is reported; that fixture is not left as a failing baseline. Provide a labelled game mount and static loading/failure fallback text. No game mechanics are required yet.
- **Dependencies:** None.
- **Testing expectations:** Planned cases T-001, T-029, T-030, T-031 in [Test Plan](TEST_PLAN.md). Follow the documented setup from a fresh directory; verify module loading and harness failure reporting in one target browser. Record browser and server prerequisite.
- **Definition of Done:** Common DoD; a reviewer can reproduce local launch and the passing test baseline without undocumented steps.
- **Estimated complexity:** S.

## PG-002 — Parse and validate level plans

- **Type:** Feature
- **Priority:** P1
- **Objective:** Turn authored text into reliable level data before gameplay starts.
- **Requirements:** FR-002, FR-003. Support `.`, `#`, `+`, `@`, `o`, `=`, `|`, and `v`; actor markers leave empty background cells. Normalize CRLF and remove only outer empty lines. Keep interior layout unchanged.
- **Acceptance criteria:** Valid plans produce the expected dimensions, static cells, and actor spawn descriptions. Reject empty plans, ragged rows, unknown symbols, interior blank rows, anything other than one player, and zero coins. Check each full initial actor rectangle against bounds and solid cells; reject initial player overlap with static lava, moving lava, or coins. Validation reports the level and offending row/column where meaningful. Rejected data never becomes a partially valid level.
- **Dependencies:** PG-001.
- **Testing expectations:** Planned cases T-002–T-004 in [Test Plan](TEST_PLAN.md). Valid fixtures cover every symbol and both LF/CRLF. Invalid fixtures cover every rejection category, including the player's half-cell upward offset and edge-boundary spawn. Check that normalization does not silently repair indentation.
- **Definition of Done:** Common DoD; parser tests cover valid and invalid contracts. A small local validation helper is sufficient; PG-006 is not a prerequisite.
- **Estimated complexity:** M.

## PG-003 — Define actor state and fresh attempts

- **Type:** Feature
- **Priority:** P1
- **Objective:** Establish simulation data that can be updated and restarted without corrupting level templates.
- **Requirements:** FR-004; NFR-002. Separate static level data from player, coin, and moving-lava state. Represent positions and sizes in grid units; use fractional coordinates.
- **Acceptance criteria:** Starting an attempt creates one player, all coins, and each specified moving hazard with correct size, position, velocity, and drip origin. Player size is 0.8 by 1.5; coin size is 0.6 by 0.6; moving lava is 1 by 1. Initial offsets match the technical design. State exposes an explicit playing/won/lost status and player identity. Updates replace simulation snapshots without modifying starting templates. Separate attempts cannot share mutable actor state.
- **Dependencies:** PG-002.
- **Testing expectations:** Planned cases T-005 in [Test Plan](TEST_PLAN.md). Assert spawn data for each actor kind; construct two attempts, alter one through a test update, and verify the other and source template remain unchanged. Verify fresh state contains every originally declared coin.
- **Definition of Done:** Common DoD; core state imports and tests run without DOM objects. No future generic actor framework is introduced.
- **Estimated complexity:** S.

## PG-004 — Render level geometry, actors, and instructions

- **Type:** Feature
- **Priority:** P1
- **Objective:** Make simulation snapshots visible through a small DOM display.
- **Requirements:** FR-015; NFR-002, NFR-005. Use a static background and positioned actor layer with a consistent 20-pixel grid scale. Include visible controls, current-level text, and outcome text containers.
- **Acceptance criteria:** A fixture's wall, empty, and static-lava cells are drawn in the correct positions. Player, coin, and moving-lava rectangles reflect fractional model coordinates and sizes. Visual classes distinguish actor kinds and playing/won/lost states. Synchronizing a snapshot removes collected actors and does not duplicate background cells. The game region is focusable, labelled, and accompanied by Left/Right/Up instructions and focus guidance. Keep a stable focusable game container across attempt replacement; display cleanup removes only its owned level/actor nodes.
- **Dependencies:** PG-003.
- **Testing expectations:** Planned cases T-023 in [Test Plan](TEST_PLAN.md). Browser assertions check actor count, positions, dimensions, state classes, and repeated synchronization/cleanup. Visually inspect a representative fixture and readable instructions. Scrolling behavior belongs to PG-011.
- **Definition of Done:** Common DoD; display reads state without changing it. Model behavior remains testable independently of rendering.
- **Estimated complexity:** M.

## PG-005 — Add keyboard input and the bounded animation lifecycle

- **Type:** Feature
- **Priority:** P1
- **Objective:** Supply consistent input and simulation time without coupling either to player physics.
- **Requirements:** FR-005, FR-017, FR-018; NFR-002, NFR-005. Use held-key snapshots and one owned animation loop. A stub simulation callback is sufficient for this ticket.
- **Acceptance criteria:** Track Left/Right/Up while the game region is focused; prevent their browser default only in that scope and preserve Tab navigation. Clear held state on region/window blur or hidden document. Suspend time while inactive and establish a fresh timestamp on resume. Advance fixed 1/120-second updates, accept at most 0.1 second of elapsed time per frame, execute at most 12 updates per frame, and render once per animation callback. Starting twice does not create competing loops; disposal removes owned callbacks/listeners. New attempts can clear input and require a fresh press, including ignoring key-repeat until release.
- **Dependencies:** PG-001.
- **Testing expectations:** Planned cases T-018–T-020, T-022 in [Test Plan](TEST_PLAN.md). Inject timestamps and stub callbacks to count updates, renders, starts, and disposal. Exercise keydown/keyup, repeated keydown, blur, visibility, refocus, zero elapsed, and long stalls.
- **Definition of Done:** Common DoD; loop and input contracts are independently verifiable before gameplay exists.
- **Estimated complexity:** M.

## PG-006 — Implement rectangle overlap and world collision queries

- **Type:** Feature
- **Priority:** P1
- **Objective:** Provide a tested geometric basis for movement and interactions.
- **Requirements:** FR-008. Use axis-aligned rectangles and static grid queries. Every world boundary behaves as a solid wall.
- **Acceptance criteria:** Queries correctly detect positive-area overlap with requested cell types at fractional and integer coordinates. Exactly touching an actor edge does not count as overlap. Queries cannot read outside the grid; crossing its left, right, top, or bottom encounters a wall. Shared geometry is independent of browser layout and does not change actors. Reuse or extract earlier validation geometry when useful without enlarging the abstraction.
- **Dependencies:** PG-002.
- **Testing expectations:** Planned cases T-006 in [Test Plan](TEST_PLAN.md). Check separated rectangles, containment, partial overlap, corner-only and edge-only contact, fractions near tile boundaries, negative coordinates, and each outer boundary. Include rectangles spanning several cells and mismatched queried tile types.
- **Definition of Done:** Common DoD; collision-query results are covered by small explicit fixtures. Movement response remains the responsibility of subsequent actor tickets.
- **Estimated complexity:** S.

## PG-007 — Implement player movement, gravity, jumping, and walls

- **Type:** Feature
- **Priority:** P1
- **Objective:** Make the player controllable while preserving solid geometry.
- **Requirements:** FR-006, FR-007, FR-008. Use horizontal speed 7 units/second, gravity 30 units/second squared, jump impulse -17 units/second, and maximum downward speed 30 units/second.
- **Acceptance criteria:** Left and Right move immediately, release stops horizontal movement, and both together cancel. Midair steering works. Gravity pulls the player down; Up initiates a jump only when supported by a floor, and held Up jumps again after landing. No midair jump is available. Resolve horizontal and vertical wall response separately; neither wall contact nor ceiling contact prevents motion on the other axis. Ceiling contact cancels upward velocity. Align movement with blocking boundaries rather than cancelling an entire large movement increment. The player cannot penetrate walls or any world boundary; settled contact gaps are no more than 0.02 grid units.
- **Dependencies:** PG-003, PG-004, PG-005, PG-006.
- **Testing expectations:** Planned cases T-007–T-009 in [Test Plan](TEST_PLAN.md). Cover walking, simultaneous keys, falling, jump/landing, held jump, ceiling impact, corners, side-wall sliding, and fast descent onto a one-cell platform. Compare ordinary frame schedules through the fixed-step loop.
- **Definition of Done:** Common DoD; model tests and a manual movement fixture both demonstrate the required behavior.
- **Estimated complexity:** M.

## PG-008 — Add coin collection, static lava, and terminal rules

- **Type:** Feature
- **Priority:** P1
- **Objective:** Give a playable attempt its win and loss conditions.
- **Requirements:** FR-009, FR-010, FR-012. Evaluate interactions after actor movement within each simulation substep.
- **Acceptance criteria:** Positive-area player/coin overlap removes that coin once; collecting the last remaining coin marks the attempt won. Static lava overlap marks it lost. Hazard contact takes precedence over coin collection in the same substep; lethal substeps collect no coins. Multiple simultaneous coin overlaps are handled consistently. Terminal status is locked, and all actors freeze once the outcome is established. Terminal snapshots cannot be changed by later input or later interactions. Feedback duration and restart orchestration are deferred to PG-010.
- **Dependencies:** PG-007.
- **Testing expectations:** Planned cases T-010, T-011, T-014, T-015 in [Test Plan](TEST_PLAN.md). Cover first/intermediate/final coins, multiple coins, repeated overlaps, exact-edge non-contact, static lava, final-coin-plus-lava overlap, and attempts to update already terminal state. Verify earlier-substep outcomes cannot be reversed.
- **Definition of Done:** Common DoD; tests make outcome priority explicit. The terminal-resolution boundary can incorporate moving lava in PG-009 without changing the published rule.
- **Estimated complexity:** M.

## PG-009 — Add horizontal, vertical, and dripping lava

- **Type:** Feature
- **Priority:** P1
- **Objective:** Complete the required hazard behaviors and their interaction rules.
- **Requirements:** FR-008, FR-011, FR-012. Horizontal and vertical bouncing lava move at 2 units/second; dripping lava moves downward at 3 units/second.
- **Acceptance criteria:** Each variant moves on its declared axis and reacts to walls and world boundaries. Bouncing hazards reverse direction; dripping hazards return to their own saved origin. Hazards do not collide with each other or coins. Any player overlap with moving lava loses the attempt. The final-coin/hazard result is loss regardless of actor ordering. A drip reset is a teleport: only its resulting position participates in overlap checks, not the intervening reset path. Terminal state freezes all variants.
- **Dependencies:** PG-008.
- **Testing expectations:** Planned cases T-012–T-014 in [Test Plan](TEST_PLAN.md). Check reversal and reset over several cycles, independent drip origins, wall/world-edge encounters, opposing player/lava motion, exact-edge contact, and final-coin collisions with actor arrays in different orders. Verify that reset-path-only intersection does not kill.
- **Definition of Done:** Common DoD; all three variants work in simulation fixtures and one visual demonstration. No generic physics engine is added.
- **Estimated complexity:** M.

## PG-010 — Run attempts, retries, and ordered level progression

- **Type:** Feature
- **Priority:** P1
- **Objective:** Connect the playable simulation and display into a complete game session.
- **Requirements:** FR-012, FR-013, FR-014, FR-015, FR-018; NFR-005. Own attempt resources in one runner.
- **Acceptance criteria:** Won/lost feedback remains visible for 1.0 second of active simulation time with actors frozen. Losing rebuilds the same level, restoring player, every coin, and hazard positions/velocities/origins. Winning advances exactly one level and updates the visible level indicator. Discard the old attempt timing remainder so its replacement is not simulated in the same animation callback. Winning the last level displays a clear completion message and stops gameplay resources. No limited-lives system is introduced. Every boundary clears old input and requires a fresh press while preserving the stable focusable game container. Reloading begins at the first level. Repeated transitions do not accumulate display roots, listeners, or animation loops.
- **Dependencies:** PG-004, PG-005, PG-009.
- **Testing expectations:** Planned cases T-015–T-017, T-022, T-023 in [Test Plan](TEST_PLAN.md). Use compact one- and two-level fixtures and injected time to verify feedback duration, index transitions, complete-state behavior, fresh attempt data, and repeated losses. Hide/refocus during feedback and verify its timer does not advance while inactive.
- **Definition of Done:** Common DoD; one compact level is playable through loss/retry and win/completion. A two-level fixture proves progression without requiring the final authored catalog.
- **Estimated complexity:** M.

## PG-011 — Keep the player visible in a bounded viewport

- **Type:** Feature
- **Priority:** P2
- **Objective:** Support levels larger than the visible game region.
- **Requirements:** FR-016; NFR-005, NFR-007. Keep rendering scale at 20 pixels/grid unit; game viewport is at most 600 by 450 pixels and shrinks to available width.
- **Acceptance criteria:** The viewport follows horizontal and vertical player movement before the player leaves the visible region. Scroll coordinates stay within valid level limits. Small levels do not acquire unnecessary scrolling. A neutral central area avoids continuous camera jitter during small movements. At supported browser viewport sizes of at least 800 by 600, controls and status remain readable and the player remains visible after resize. Camera movement never changes model positions or physics.
- **Dependencies:** PG-004, PG-007.
- **Testing expectations:** Planned cases T-024 in [Test Plan](TEST_PLAN.md). Exercise levels smaller and larger than the viewport, every map edge, vertical jumps, corners, and resize while playing. Check that rendering the supported capacity does not rebuild the static grid every frame.
- **Definition of Done:** Common DoD; browser checks and manual traversal verify visibility in both axes. Detailed release profiling remains in PG-016.
- **Estimated complexity:** M.

## PG-012 — Validate startup and present recoverable failure guidance

- **Type:** Reliability
- **Priority:** P2
- **Objective:** Prevent invalid content or unexpected failures from leaving an unusable running game.
- **Requirements:** FR-001, FR-003, FR-018, FR-019. Validate the complete catalog before starting its first attempt.
- **Acceptance criteria:** Empty catalogs and invalid levels stop startup with readable error text; level identity and row/column appear when meaningful. No invalid level is silently skipped. Bootstrap, display-construction, and runtime update failures stop the loop and clean up all partially owned resources. Error text lives outside the disposable display so cleanup cannot remove it. The page provides a simple reload/local-server troubleshooting direction and preserves detailed console diagnostics for development. Static fallback text stays visible until successful bootstrap and remains useful when JavaScript or module loading fails. An error never starts an automatic retry cycle.
- **Dependencies:** PG-002, PG-010.
- **Testing expectations:** Planned cases T-003, T-004, T-025 in [Test Plan](TEST_PLAN.md). Inject a malformed later level, empty catalog, initialization exception, and simulation exception. Check visible error output and resource counts after each. Disable JavaScript or block the entry module to inspect static fallback behavior.
- **Definition of Done:** Common DoD; failure paths have explicit assertions and manual evidence where browser loading cannot be meaningfully simulated.
- **Estimated complexity:** M.

## PG-013 — Verify timing, focus, and repeated-attempt integration

- **Type:** Integration and reliability
- **Priority:** P2
- **Objective:** Resolve defects that appear when input, time, and transitions interact.
- **Requirements:** FR-005, FR-017, FR-018. Consolidate lifecycle behavior already introduced in earlier tickets.
- **Acceptance criteria:** Identical input assigned per simulation step at 30/60/120/144 Hz produces matching outcomes and positions within one simulation step at ordinary cadence; exact equivalence of real keyboard event sampling at different render rates is not promised. A long stall executes at most 12 updates and never advances the full stalled duration. Region blur, window blur, and tab hiding clear input, freeze actors and feedback, and discard timing backlog. Refocus cannot resurrect held keys. Repeated losses, advances, completion, and errors maintain at most one active loop/display/input owner. Fresh attempts reject carried-over key-repeat until release.
- **Dependencies:** PG-010, PG-012.
- **Testing expectations:** Planned cases T-019–T-022 in [Test Plan](TEST_PLAN.md). Use injected clocks and scheduled inputs; run at least 20 retry transitions; test focus changes during movement, jump, and outcome feedback. Repeat the most important focus scenarios manually in a real browser.
- **Definition of Done:** Common DoD; integration failures receive fixes and regression cases within this ticket. Evidence distinguishes automated clock tests from observed browser behavior.
- **Estimated complexity:** M.

## PG-014 — Author and verify the three-level catalog

- **Type:** Content and integration
- **Priority:** P2
- **Objective:** Deliver a short, complete game with every required mechanic demonstrated.
- **Requirements:** FR-020; NFR-006, NFR-007. Author three original small levels within 120 by 50 cells and 80 actors per level.
- **Acceptance criteria:** All three levels pass validation and have at least one coin and a safe player start. Across the catalog, stationary lava and all three moving-lava variants are encountered; at least one level requires camera scrolling. Early content teaches movement and collection before later combinations. Every level can be completed using the defined controls and physics without modifying state or using development shortcuts. The full catalog progresses to completion. Record level purpose and manual completion evidence; credit the textbook inspiration without copying substantial chapter content.
- **Dependencies:** PG-009, PG-010, PG-011, PG-012.
- **Testing expectations:** Planned cases T-026 in [Test Plan](TEST_PLAN.md). Automatically validate every shipped plan and content budget. Manually complete each level and then the ordered catalog; exercise at least one loss/retry per level. Recheck playability if physics or level geometry changes.
- **Definition of Done:** Common DoD; no unreachable required coin or unavoidable spawn hazard remains. No automated solvability solver is required.
- **Estimated complexity:** M.

## PG-015 — Close regression gaps and check subsystem boundaries

- **Type:** Verification
- **Priority:** P2
- **Objective:** Demonstrate that the complete required behavior remains coherent before browser acceptance.
- **Requirements:** NFR-001, NFR-002, NFR-003; verifies all FR requirements. Use the [Test Plan](TEST_PLAN.md) and its traceability matrix.
- **Acceptance criteria:** Every mandatory functional requirement has implementation and verification evidence. All existing automated cases pass in the reference browser; uncovered collision, transition, timing, or failure cases are added. Pure simulation modules do not depend on DOM layout, wall-clock time, or browser key events. Static plans remain immutable across sessions. Runtime still uses standard browser APIs without a new framework/build requirement. Test failures are reproducible and reported with the relevant fixture and expected behavior.
- **Dependencies:** PG-013, PG-014.
- **Testing expectations:** Planned cases T-001–T-026, T-029, T-031 in [Test Plan](TEST_PLAN.md). Execute the full browser suite; inspect requirement coverage; rerun changed integration paths after fixes. Review boundaries for actual testability problems rather than style preference. Check that no deliberately failing harness fixture remains enabled.
- **Definition of Done:** Common DoD; regression results and any known limitations are recorded. This is a project acceptance check, not a claim that automated tests prove level solvability or cross-browser compatibility.
- **Estimated complexity:** M.

## PG-016 — Complete browser acceptance, documentation, and release evidence

- **Type:** Release readiness
- **Priority:** P2
- **Objective:** Establish an auditable finished-project handoff.
- **Requirements:** NFR-004, NFR-005, NFR-006, NFR-007; all final acceptance criteria in the PRD.
- **Acceptance criteria:** Record exact stable Chrome, Edge, and Firefox versions on Windows and Safari on macOS used for acceptance. Execute required browser/manual tests and the full-game playthrough. Unsupported access to a browser is recorded as untested and blocks that compatibility claim. Profile 60 seconds of active representative gameplay at 60 Hz on a documented reference machine; median frame interval is at most 16.7 ms and p95 at most 33.4 ms. README documents setup, controls, tests, limitations, and attribution. Release checklist contains evidence or explicit unresolved items; no blocking defect remains.
- **Dependencies:** PG-015.
- **Testing expectations:** Planned cases T-026–T-030 in [Test Plan](TEST_PLAN.md). Follow the complete [Test Plan](TEST_PLAN.md); record environment and results rather than inferred passes. Retest affected behavior after any late fix.
- **Definition of Done:** Common DoD; [Release Checklist](RELEASE_CHECKLIST.md) is completed with honest results. Declaring readiness does not itself authorize publishing, tagging, or merging through assistant tools.
- **Estimated complexity:** M; browser access is an external scheduling dependency.






