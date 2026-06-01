# Phase 5 — Execute (Iteration 2)

## What was built

Study Mode added to `iteration-2/pathfinding-race.html` (evolved from the v1 baseline; v1 left
intact). The 4-up race is unchanged and remains the default view. A **📖 Study / Pseudocode**
toggle (default off) opens a focused, line-by-line pseudocode tracer for one algorithm.

New pieces, per the plan's build sequence:
1. **Engine refactor** — `makeSearch` is now a generator micro-stepper; `step()` is the
   expansion-boundary driver (race), `microStep()` yields one pseudocode line (study).
2. **Teaching/pseudocode data** — shared skeleton (10 lines), per-mode annotations for the three
   divergent lines (`pop`/`cost`/`improve`), narration templates, per-algorithm blurbs,
   comparison table.
3. **Study view** — focused larger grid, pseudocode list, narration bar, thumbnails, comparison
   table; built once via DOM APIs (`textContent`, no `innerHTML`).
4. **Study controller** — mode routing (`race`|`study`); micro-step → active-line highlight +
   grid cursors (node expanded / neighbor inspected) + overlay accumulation + live narration;
   focus switching; Play auto-advances lines at the speed slider.
5. **Difference-highlighting** — divergent lines flagged and annotated for the focused algorithm;
   comparison table highlights the focused row.

## Step 1 regression gate (the critical one)

After refactoring the engine to the generator, the **entire iteration-1 suite was re-run against
the refactored file and passed identically** — same race outcome (cost 44/36/44/36, visited
319/417/21/261, same statuses), 42 engine assertions, 8 static checks, 20 integration assertions.
The race controller was not modified; it consumed the new `step()` transparently. Only after this
gate did study mode get built.

## Tests (all green) — saved under `iteration-2/tests/`

| Suite | Scope | Result |
|-------|-------|--------|
| `trace_proto.js` | generator vs iteration-1 engine oracle (4 algos × 3 fixtures) | 14/14 |
| `v2_verify.js` | inlined refactored engine + static security/offline scan | 42/42 + 8/8 |
| `v2_integration.js` | race mode unchanged (build, paint, race, step, reset, no-path) | 20/20 |
| `v2_study.js` | study toggle, scaffold, line-by-line PC, grid sync, annotations, full study run, no-path-in-study, race-after-study | 26/26 |

**Total: 110 assertions passing.** Study line trace confirmed:
`init → pop → goal → mark → for → cost → improve → push`.

## Bugs found and fixed

- **No artifact bugs.** As in iteration 1, the Research prototype (generator validated against
  the oracle before inlining) meant the refactor and feature landed clean — the regression gate
  passed on the first run, and study tests passed on the first run.
- Only friction was a couple of tooling hiccups (a malformed edit retried), not defects in the
  artifact.

## Acceptance criteria results (vs. plan checklist)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Race mode unchanged (regression) | **PASS** — 20/20 identical race results |
| 2 | Study toggle default OFF; initial view identical to v1 | **PASS** — study tests |
| 3 | Entering study focuses one; switch via thumbnails or panel click | **PASS** for toggle + thumbnails; panel-title click wired, not auto-asserted → Verify |
| 4 | Shared skeleton shown; active line advances | **PASS** — sequence asserted |
| 5 | Study Step = one line; Play auto-advances | **PASS** |
| 6 | Focused grid: node + neighbor cursors; accumulates overlays | **PASS** for overlays (closed/open asserted); cursor classes implemented, not explicitly asserted → Verify |
| 7 | Live plain-English narration with values | **PASS** — populated; no-path narration asserted |
| 8 | Divergent annotations per algo; switching updates | **PASS** — A\*→BFS swap asserted |
| 9 | Teaching blurb + comparison table | **PASS** for table; blurb set on focus, text not asserted → Verify |
| 10 | No-path in study graceful | **PASS** — status "no path", narration "unreachable" |
| 11 | Generator race reproduces iteration-1 results exactly | **PASS** — oracle + identical race |
| 12 | No innerHTML/eval/fetch/external URLs | **PASS** — 8/8 static |

## Honest handoff to Verify

All testable-without-a-browser behavior is green, including a full regression of iteration 1.
What a headless run can't fully judge — visual rendering of the study layout, the active-line
and cursor highlighting *as seen*, panel-title click entry, blurb/table legibility, the feel of
line auto-play, and reading the narration in context — are flagged above for the adversarial
Verify pass and a human look.
