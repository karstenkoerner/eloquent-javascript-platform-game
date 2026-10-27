# Platform Game — Engineering Decisions

Planning baseline v1 • 2026-10-25. These are recommended initial choices, not evidence of implemented behavior. The developer may propose simpler equivalent choices; record consequences for requirements, tests, and dependencies. A scope change needs explicit approval. The [PRD](PRD.md) remains the behavior authority.

## D-001 — What is the release scope?

**Significance:** A finite scope supports the learning objective of finishing the project.

**Alternatives:** Recreate every exercise; reproduce all supplied textbook levels; implement the essential mechanics in a small authored catalog.

**Recommendation:** Essential mechanics plus three original short levels covering every required hazard, with a scrolling level. Exclude lives, Escape pause, monsters, sound, persistence, and mobile controls. Source research separates these exercises from the chapter baseline: [official chapter](https://eloquentjavascript.net/16_game.html#exercises).

**Tradeoffs:** Less content, but full mechanical coverage and a manageable playthrough/review burden. Three levels and original authorship are project choices, not textbook mandates.

**Resolve before implementation?** Use this scope before PG-001; any expansion requires a separate approval. Detailed level layouts are deferred to PG-014.

## D-002 — DOM or Canvas, and which dependencies?

**Significance:** Rendering choice affects module boundaries, debugging, assets, and educational scope.

**Alternatives:** DOM with CSS; Canvas; a game framework.

**Recommendation:** Vanilla ES modules, DOM shapes, CSS, static HTTP serving, no runtime dependencies or build step. Render static scenery once and sync an actor layer. A local static server is development tooling only.

**Tradeoffs:** DOM is sufficient for this small catalog and easy to inspect. It is not intended for thousands of actors. Canvas and frameworks add concepts outside the selected scope. An actor-node cache can be added only if profiling shows a need.

**Resolve before implementation?** Yes, use in PG-001/004. Choose the actual local server command in PG-001 after checking the developer's tools; the plan does not claim one is installed.

## D-003 — How should the model be separated?

**Significance:** Browser-independent state logic enables focused tests and prevents rendering from changing gameplay.

**Alternatives:** One script with mixed effects; a small module set; a general game engine/ECS.

**Recommendation:** Level, model/simulation/collision, input, display, timing, and runner responsibilities. Use plain objects or small classes. Return replacement state/actors and keep starting descriptors unchanged. One session owner coordinates side effects.

**Tradeoffs:** Modest allocation and more files than a single script; much clearer testing/reset behavior. No persistent-data library or elaborate inheritance is necessary. Filenames and class-versus-function style remain developer choices.

**Resolve before implementation?** Boundaries before PG-001/003; minor file organization can evolve without scope change.

## D-004 — How strict is level validation?

**Significance:** Malformed data otherwise fails far from its cause or creates unwinnable attempts.

**Alternatives:** Trust strings; silently pad/dedent/repair; reject malformed input with context.

**Recommendation:** Validate the entire catalog before play. Normalize line endings and outer empty lines only. Reject invalid shape/symbols, missing/duplicate player, zero coins, out-of-bounds/wall-embedded actor rectangles, and initial player overlap with hazards/coins. Validate all rectangles after applying offsets. Other actor overlaps may be valid; prove level solvability manually.

**Tradeoffs:** More validation code, but predictable errors and meaningful author feedback. A reachability solver would be disproportionate. Rejecting zero-coin plans avoids a special automatic-win rule. Parser-local geometry can precede the later runtime collision module.

**Resolve before implementation?** Yes, PG-002. Full level content is later work.

## D-005 — How is time advanced safely?

**Significance:** Frame count must not determine speed; long frame gaps must not cause huge movements.

**Alternatives:** Per-frame movement; capped variable delta; fixed updates with a bounded accumulator.

**Recommendation:** Fixed 1/120-second simulation updates, at most 0.1 seconds accepted and 12 updates per rendered frame, one render per RAF callback. Drop excess elapsed time, reset the clock/remainder on inactive focus and attempt changes, and cap downward player velocity at 30 units/second.

**Tradeoffs:** A small accumulator adds logic but makes simulation-step tests reproducible and keeps collision steps small. Severe stalls slow game time. No interpolation or exact continuous collision system is required. The chapter's frame cap alone is not an anti-tunneling guarantee; this is a project robustness choice.

**Resolve before implementation?** Yes, PG-005. PG-013 verifies cadence and stall behavior before release. If changing the step or speed limits, rerun collision and playability tests.

## D-006 — What do collision and conflicting outcomes mean?

**Significance:** Boundary cases must not depend on actor array order or render timing.

**Alternatives:** Cancel blocked movement; align at solid boundaries; use swept collision. Resolve interactions in actor order or choose explicit hazard precedence.

**Recommendation:** Separate horizontal then vertical solid movement, align to the wall within 0.02 units, treat all outside cells as walls, and use positive-area rectangle overlap for coins/hazards. Evaluate hazards before coins per substep. A lethal substep collects no coins. A terminal result is latched; later substeps cannot reverse it. Drip reset is an instantaneous teleport evaluated at its destination.

**Tradeoffs:** Alignment is slightly more work than cancelling a whole move, but avoids hovering and uneven landings. Discrete interactions can miss infinitesimal grazing contacts; the supported fixtures and speeds define the practical boundary. Hazard precedence is a clarification beyond the chapter example, not a claim that its code enforces that rule.

**Resolve before implementation?** Geometry before PG-006; ordering before PG-008/009.

## D-007 — What should held keys and lost focus do?

**Significance:** Stuck keys, page scrolling, and lost focus after retries make otherwise correct physics unusable.

**Alternatives:** Global permanent key capture; focus-scoped held state; press-only input; a pause menu.

**Recommendation:** A stable focusable game region owns Left/Right/Up. Both horizontal keys cancel. Holding Up repeats a jump on landing. Blur/hiding clears keys and suspends world/outcome time; focus return and attempt changes require a fresh non-repeat keydown. Preserve the outer container when replacing attempt visuals.

**Tradeoffs:** The user must focus the game and release/repress controls after a retry. This avoids accidental movement on the next attempt and does not trap ordinary page navigation. Automatic focus suspension requires no extra game menu.

**Resolve before implementation?** Yes, PG-004/005; verify lifecycle integration PG-010/013.

## D-008 — How do attempts end and restart?

**Significance:** Outcome feedback, cleanup, and level progression must have one owner.

**Alternatives:** Immediate transition; continue motion during feedback; freeze the outcome then transition.

**Recommendation:** Freeze actors/result for 1.0 seconds of active simulation time, then retry the same level on loss or advance on win. Final win produces persistent completion text and stops gameplay. Keep unlimited retries; reload replays the full game. Use a simple runner or async sequence, whichever makes cleanup clearest.

**Tradeoffs:** A short delay explains the outcome without a menu. Freezing differs from continuing actor animation and simplifies terminal invariants. Clear old callback ownership and discard pending attempt time so a new level cannot receive stale updates.

**Resolve before implementation?** Terminal state contract before PG-008; transition ownership before PG-010.

## D-009 — How much test infrastructure is justified?

**Significance:** Tests must be easy to run and cannot depend on human reaction timing.

**Alternatives:** Manual-only testing; browser test page with small assertions; Node/framework/CI stack.

**Recommendation:** Native browser-module test page with named assertions and a summary, deterministic model fixtures, injected input/time, small DOM integration hosts, and manual play/browser checks. Implement tests alongside behavior. A recording scheduler allows lifecycle tests without real waits.

**Tradeoffs:** Requires opening a browser, but no mandatory package manager or framework. Automated cross-browser drivers and CI can be considered later if maintenance warrants them; neither is needed for this release. Manual evidence remains necessary for feel and actual supported browsers.

**Resolve before implementation?** Harness choice in PG-001; expand fixtures per ticket, cross-feature review PG-015.

## D-010 — What browsers and workload are promised?

**Significance:** Unbounded promises are impossible to verify; a real support matrix makes release claims honest.

**Alternatives:** One browser; the three major desktop engines; desktop and mobile.

**Recommendation:** Stable Chrome/Edge/Firefox on Windows and Safari on macOS at release, with recorded versions, keyboard, and at least 800×600 CSS viewport. Bound shipped content to 120×50 cells/80 actors. Use the PRD's measured 60-second performance target on a documented 60 Hz reference machine.

**Tradeoffs:** Safari requires access to a macOS tester. That access has not been established during planning. Missing evidence remains untested; it cannot be converted into a pass. Mobile and full nonvisual gameplay require additional design beyond this scope.

**Resolve before implementation?** Support intent is the proposed baseline now; arrange browser access by PG-016. If unavailable, the developer must explicitly approve a narrower target before release, not silently omit Safari.

## D-011 — How should failures be exposed?

**Significance:** A blank page or repeating crash hides the cause and prevents diagnosis.

**Alternatives:** Console-only errors; silently skip bad levels; stop with a visible diagnostic.

**Recommendation:** Validate first, then launch. Catch fatal initialization/runner failures at the owning boundary, dispose gameplay safely, and show useful text in a panel outside disposable attempt content. Keep initial HTML guidance until initialization succeeds so a missing module still leaves an explanation. Record original diagnostic context once.

**Tradeoffs:** Modest UI/error plumbing without a general recovery system. Fix-and-reload is sufficient. Runtime errors are not normal losses and must not auto-retry indefinitely.

**Resolve before implementation?** Page fallback in PG-001; full orchestration in PG-012.

## D-012 — How are repository changes authorized?

**Significance:** Technical permission and permission to perform an action are separate.

**Alternatives:** Push planning directly; create issues immediately; deliver a local reviewed plan first.

**Recommendation:** Deliver these eight local documents. The user has authorized initial planning and repository reading, not issue creation, branches, application edits, or PR reviews. Future GitHub mutations follow explicit requests; the developer remains the implementer. See [workflow](DEVELOPMENT_WORKFLOW.md).

**Tradeoffs:** A later authorized step publishes the documents/backlog, but the initial planning run stays within its assigned scope. Repo write permissions were reported; an actual write was not tested.

**Resolve before implementation?** Repository identity is resolved. Authorization for any future write is resolved when that action is requested, rather than manufactured as part of this plan.
