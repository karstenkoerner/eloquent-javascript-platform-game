# Platform Game — Release Checklist

Planning baseline v1 • 2026-10-25. All implementation/release checks below are initially unchecked. Planning review is not evidence that the game exists or passes tests.

## Project-wide Definition of Done

- [ ] All mandatory FR-001–FR-020 and NFR-001–NFR-007 are implemented and verified against [PRD.md](PRD.md).
- [ ] PG-001–PG-016 meet their individual acceptance criteria and DoD; required reviews are resolved and the intended release revision contains the completed work.
- [ ] [TEST_PLAN.md](TEST_PLAN.md#requirements-traceability-matrix) maps each requirement to implementation and actual evidence; no missing, skipped, or unrun required check is represented as passed.
- [ ] Material design changes are documented with rationale and synchronized across the plan; approved scope changes are recorded explicitly.

## Required gameplay and lifecycle

- [ ] Fresh local launch starts level one with visible instructions and usable keyboard focus.
- [ ] All three original levels validate, are completable, and have recorded routes showing every coin is reachable.
- [ ] Walking, opposite keys, midair steering, gravity, supported jumping, held-jump landing, ceiling impacts, and all four world boundaries meet the contract.
- [ ] Static lava and horizontal, vertical, and dripping lava work; thin geometry and fast falls pass collision cases.
- [ ] Coins disappear exactly once; lava takes precedence over the last coin within a substep; terminal results cannot be reversed.
- [ ] Loss freezes briefly and restores the same level completely; wins advance exactly once; final win presents persistent completion and stops gameplay.
- [ ] Camera keeps the player visible in both axes; resizing and small levels behave correctly.
- [ ] Focus loss/hidden tabs clear keys and suspend both world and feedback time. A fresh press is required after focus/attempt transitions.
- [ ] Twenty retries and repeated progression produce no duplicate loops/listeners, stale state, or accumulated DOM. The focused outer container survives attempts.
- [ ] Invalid levels and caught runtime errors stop cleanly with persistent actionable text; static fallback is useful when modules cannot load.

## Tests and browser evidence

- [ ] Unit and browser integration suites pass from the documented local setup on the release revision, with named counts and no unexpected console errors.
- [ ] The scripted 30/60/120/144 Hz schedules, long stalls, timestamp reset, terminal timer, and resource cleanup tests pass.
- [ ] Full manual routes, keyboard focus/scroll behavior, visual outcomes, and final completion pass the supported browser matrix.
- [ ] Exact Chrome, Edge, Firefox (Windows), and Safari (macOS) versions and OS details are recorded. Safari requires a real tester; unavailable is untested.
- [ ] Supported 800×600 and larger viewports pass; no unsupported mobile or full screen-reader-playability claim appears in documentation.
- [ ] Authored content respects 120×50 cells and 80 actors per level. The documented reference machine meets the PRD 60-second, 60 Hz profile target (median ≤16.7 ms, p95 ≤33.4 ms), with measurement evidence.
- [ ] Regression cases cover every confirmed gameplay bug fixed during development.

## Documentation and repository readiness

- [ ] README gives actual static-server prerequisites/command, launch URL, controls, objective, retry/progression, test URL/instructions, browser matrix, and known limitations.
- [ ] The eight planning documents match the released behavior and current ticket/issue mapping.
- [ ] Source inspiration and level authorship are recorded; the existing LICENSE is preserved and any imported material's applicable notices are included.
- [ ] No unneeded runtime packages, third-party network dependencies, build system, debug controls, or test-only hooks have entered the player flow.
- [ ] The intended release revision is identified. A fresh checkout served as documented reproduces the test and launch results.

## Known-defect policy

A reproducible violation of any mandatory acceptance criterion blocks acceptance until fixed or changed through explicit scope approval. Crashes, invalid shipped levels, unreachable coins, missed mandatory transitions, stuck input, and failed supported-browser behavior cannot be accepted as cosmetic limitations.

Minor visual imperfections that violate no mandatory criterion may remain if documented with impact and developer acceptance. Personal style preferences do not block release. A likely defect requires bounded investigation or an explicit limitation supported by evidence; lack of reproduction must not be reported as a proven fix. Missing mandatory test evidence remains unresolved, not a known passing limitation.

## Release acceptance record

Complete this record only after verification:

| Field | Evidence |
| --- | --- |
| Release commit / proposed tag | Pending |
| Developer / reviewer | Pending |
| Verification date | Pending |
| Automated suite results | Not run |
| Browser matrix and manual routes | Not run |
| Frame profile / lifecycle evidence | Not run |
| Known nonblocking defects | Not assessed |
| Approved scope changes, if any | None recorded |
| Final acceptance | Pending |

A successful checklist makes the project ready for a release decision. Creating a tag, publishing a GitHub release, deployment, merging, or closing issues remains a separately authorized action. No hosting/deployment service is required for the local browser application.

## Planning consistency review record

The initial plan is reviewed for requirement coverage, test mappings, ticket sizing, dependencies, scope boundaries, and source attribution. The completed planning review is recorded in the delivery summary; it does not check any release box above. Future reviews should repeat traceability and dependency checks whenever a material requirement or ticket changes.

Planning review completed on 2026-10-25:

- All eight requested Markdown documents exist and their local document links resolve.
- All 20 functional and 7 nonfunctional requirements have implementation-ticket ownership and test-family references in the traceability matrix.
- All 16 tickets contain the required fields; their direct dependency graph is acyclic. PG-007 explicitly depends on the display needed for its manual movement fixture.
- Independent source/architecture and backlog reviews checked edge cases and cross-document consistency. Corrections aligned focus resume semantics, full playthroughs across browsers, terminal-timer ownership, level-indicator checks, stale time at transitions, and opposing player/lava motion coverage.
- The 31 test families are specifications, not executed test results. Browser compatibility, performance, content playability, and application correctness remain unverified until implementation.
- Repository reads and reported permissions are documented in the PRD. No application implementation or remote repository mutation occurred.

Recommended first development ticket: **PG-001 — Establish the project shell, local launch, and test harness.** The initial planning assignment ends here; no implementation is started automatically.
