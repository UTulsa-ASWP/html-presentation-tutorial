# Phase 4 — Plan (Iteration 2)

Self-contained build plan. Add a toggleable **Study Mode** (focused, line-by-line pseudocode
execution + teaching + difference-highlighting) to the existing offline `pathfinding-race.html`,
without regressing the iteration-1 race. Single file, no dependencies, no `innerHTML`/`eval`.

## Deliverable

`iteration-2/pathfinding-race.html` — evolved from the iteration-1 file (copied in as the
starting baseline so v1 stays intact as a record).

## Internal structure (changes to the one file)

```
<style>     + study view styles: focused grid, pseudocode list, active-line + divergent-line
              highlight, narration bar, comparison table, thumbnails. Reuse existing CSS vars.
markup      + Study/Pseudocode toggle in the control bar
            + #study container (hidden by default): focused grid · pseudocode · narration ·
              blurb · comparison table · thumbnail switcher
<script>
  Engine        ~ REFACTOR: generator micro-stepper is the single source of truth.
                  expose microStep() (one line) and stepExpansion() (to endExp, same delta
                  contract). step()/isDone/isFound/visited/cost/steps/path preserved.
  PseudoModel   + line display text, per-mode annotations (pop/cost/improve), narration
                  templates per line id, per-algorithm blurbs, comparison-table data
  StudyView     + build/show/hide study DOM; render focused grid; thumbnails
  StudyControl  + mode routing (race|study); micro-step → highlight line + grid cursors +
                  accumulate overlays + narration; focus switching
  Race control  ~ route Step/Play by mode; entering study pauses race
  wire-up       + toggle handler, race-panel click → study
```

## Build sequence (each ≤ ~1 hour, each ends in a test gate)

**Step 1 — Engine refactor to the generator (REGRESSION-GATED).**
Replace `makeSearch` internals with the validated generator + `stepExpansion()` boundary driver;
implement the existing `step()` via `stepExpansion()` so the race controller is untouched. Add
`microStep()`.
_Gate (hard):_ re-run the **entire iteration-1 suite** (engine unit, inlined re-test, jsdom
integration) against the refactored file — must pass **identically**. Add the generator↔oracle
equivalence test to the permanent suite. If race results differ at all, stop and fix before proceeding.

**Step 2 — Pseudocode + teaching data model.**
Static data: shared-skeleton line display text; per-mode annotations for `pop`/`cost`/`improve`;
narration templates per line id; per-algorithm blurbs; comparison-table rows.
_Gate:_ assertion that every line id the generator can emit has a display line + narration
template, and all four modes have annotations for the three divergent lines (no missing mappings).

**Step 3 — Study-view DOM scaffold (hidden by default).**
Build `#study`: focused grid (larger cells), pseudocode list (one element per line), narration
bar, blurb area, comparison table, thumbnail switcher; add the toggle button. Default hidden.
_Gate (jsdom):_ toggle on → study visible, race hidden, pseudocode list has all skeleton lines,
table has 4 rows, 3 non-focused thumbnails present; toggle off → race restored.

**Step 4 — Study controller + micro-step sync.**
Mode routing: study Step = one `microStep()` on the focused search; Play auto-advances lines at
the speed slider; Reset restarts the focused search. Per micro-step: move active-line highlight,
set grid cursors (node expanded + neighbor inspected), accumulate open/closed/path on the focused
grid, update narration with live values. Focus switch re-inits the focused search from the
current maze.
_Gate (jsdom):_ enter study on A\*, Step through lines, assert active-line sequence
(init→pop→goal→mark→for→cost→improve→push…), narration non-empty, focused grid shows a closed
cell after `mark` and open cells after `push`, and reaching the goal draws a path.

**Step 5 — Difference-highlighting + teaching (R6/R7).**
Render divergent-line annotations for the focused algorithm on `pop`/`cost`/`improve`; wire the
per-focus blurb; finalize the comparison table.
_Gate:_ focusing each algorithm shows its correct annotations and blurb; comparison-table values
match (ordering key, weights?, heuristic?, optimal?).

**Step 6 — Integration, edge cases, regression, polish.**
Race-panel click → study; entering study pauses race, leaving returns to a clean race-ready state;
maze editing disabled in study mode (study examines the current maze); no-path-in-study
(`exhausted` → narration message, no crash); control labels per mode; layout polish.
_Gate:_ full regression (all iteration-1 acceptance criteria) + new study assertions + no-path
study + no console errors.

## Testing strategy (woven in)

- **Regression (critical):** iteration-1 engine unit + inlined re-test + jsdom integration must
  pass unchanged after the Step-1 refactor and again at Step 6. This is the primary safety net.
- **Unit:** generator↔oracle equivalence (built in Research); line-id mapping completeness.
- **Integration (jsdom):** study toggle, focus switching, micro-step line sequence, grid sync,
  narration content, no-path-in-study.
- **Static/security:** re-grep `innerHTML`/`eval`/`new Function`/`fetch`/external URLs over the
  expanded file → expect none.

## Inputs to validate / boundaries to harden

| Situation | Risk | Handling |
|-----------|------|----------|
| Switch focus mid-walk | Stale highlights/state | Re-init focused search + clear focused grid + reset PC |
| Enter study while race running | Inconsistent state | Pause race; build focused search fresh from current maze |
| Edit maze in study mode | Search/maze mismatch | Disable editing in study; must return to race to edit |
| Leave study mid-walk | Partial race state | Return to a clean race-ready (idle) state; overlays cleared *(preserving paused race = stretch)* |
| No path in study | Crash at reconstruct | `exhausted` yield → narration "no path", stop, no throw |
| Very fast line auto-play | Incoherent render | Cap lines/frame; render each line's highlight before advancing |

(Still fully offline; no new external input. Annotations/narration are static, not user-derived.)

## Acceptance criteria checklist

1. [ ] Race mode unchanged — **all iteration-1 acceptance criteria still pass** (regression).
2. [ ] Study/Pseudocode toggle exists, **default OFF**; initial view identical to iteration 1.
3. [ ] Entering study focuses one algorithm; switch via thumbnails or by clicking a race panel.
4. [ ] Shared pseudocode skeleton shown; active line highlights and advances with the PC.
5. [ ] Study Step = exactly one pseudocode line; Play auto-advances lines at the speed slider.
6. [ ] Focused grid highlights the node being expanded + neighbor inspected; accumulates
       open/closed/path correctly.
7. [ ] Narration shows a live plain-English sentence with real values for the current line.
8. [ ] Divergent lines (`pop`/`cost`/`improve`) show per-algorithm annotations; switching focus
       updates them.
9. [ ] Per-algorithm teaching blurb shown; comparison table present with correct values.
10. [ ] No-path in study handled gracefully (message, no crash).
11. [ ] Generator-driven race reproduces iteration-1 results exactly (equivalence regression).
12. [ ] Still no `innerHTML`/`eval`/`fetch`/external URLs; offline single file.
```
