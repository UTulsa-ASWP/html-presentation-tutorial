# Phase 4 — Plan

Self-contained build plan. Target: one offline `.html` file, four pathfinding algorithms
(BFS, Dijkstra, Greedy Best-First, A\*) racing in lockstep on a shared weighted grid, as a
teaching tool. No dependencies. No `innerHTML`/`eval`.

## Deliverable

`pathfinding-race.html` — single file, inline `<style>` + single inline `<script>`.

## Internal structure (sections within the one file)

```
pathfinding-race.html
├── <style>                     palette (CSS vars), layout, cell-state classes, legend, controls
├── markup                      header/intro, control bar, legend, 2×2 panel container, footer
└── <script> (one IIFE)
    ├── CONFIG                  grid dims, cell px, mud weight, colors-as-classes, speed map
    ├── Model                   Cell {wall, weight}, Maze {grid, start, end}, helpers
    ├── MinHeap                 binary min-heap, lazy deletion (validated in Research)
    ├── Search                  stepable per-algorithm search objects (common interface)
    ├── View                    build 4 DOM grids; renderCell(); renderDelta(); legend
    ├── Interaction             tool select, drag-paint, drag endpoints, random, clear
    ├── Race controller         rAF lockstep loop; Play/Step/Reset; speed; scoreboard update
    └── init()                  wire it all up, initial maze, first render
```

## Engine design (the crux: stepable searches)

Each algorithm is a search object with a uniform interface so the race loop treats all four
identically:

```
makeSearch(maze, mode) -> {
  step()   // perform ONE node expansion; update internal state; return {opened:[], closed:cell|null}
  done     // bool: finished (found goal or exhausted)
  found    // bool: path to goal exists
  stats    // {visited, cost, steps, optimal}  (optimal filled after all four finish)
  path()   // array of cells from start..end (valid once found)
  state    // open set membership + closed set, for rendering
}
```

- BFS: FIFO (array + head index), ignores weight, tracks step-count.
- Dijkstra/Greedy/A\*: MinHeap keyed by `g` / `h` / `g+h`; lazy deletion via closed check.
- `g` accumulates *entering* cell weight; `h` = Manhattan distance (steps).
- `optimal` = (this path's cost == min cost found across the four). Dijkstra/A\* → true.

## Ordered build sequence

Each step ≤ ~1 hour; each ends with a concrete check.

**Step 1 — Scaffold + model.**
HTML skeleton (offline, no external refs), CSS vars/palette, `CONFIG`, `Cell`/`Maze` model,
default dimensions (~24 cols × 18 rows/panel), fixed start/end positions.
_Test:_ page opens from `file://`; `console.log` of model shows correct dims, start, end.

**Step 2 — Search engine (port validated prototype to stepable form).**
MinHeap + the four search objects behind the common interface. Keep the run-to-completion
logic from the Research prototype, but expose it one expansion at a time.
_Test (unit):_ a dev self-test runs each search to completion on the Research fixture grid and
asserts: A\* cost == Dijkstra cost (optimal); BFS step-count ≤ Dijkstra step-count; all four
reconstruct a valid contiguous path. Run via Node before wiring UI.

**Step 3 — Four-panel rendering.**
Build 4 CSS-grid panels of cell `<div>`s (`data-r`/`data-c`) from the shared maze; `renderCell`
applies state classes (start/end/wall/weight/open/closed/path); shared legend.
_Test:_ four panels show identical maze; manually toggle a cell's class set and confirm each
state renders with the correct color; legend swatches match cell classes.

**Step 4 — Interaction (painting + endpoints + maze ops).**
Tool selector (wall / weight / erase); drag-paint with `mousedown`+`mouseenter`+global `mouseup`;
drag start/end; Random maze; Clear walls/weights; Clear path.
_Validation/hardening (carry from Brainstorm):_ cannot paint over or delete start/end; dragging
an endpoint onto a wall/weight forces that cell passable (weight 1); clicks outside grid ignored;
random maze keeps start/end clear.
_Test:_ paint on one panel → all four update; drag endpoints; random maze always leaves
start/end clear; erase restores weight 1.

**Step 5 — Lockstep race loop + controls.**
Single rAF loop with time accumulator; each tick advances every unfinished search by one
expansion and renders only the delta; Play / Step / Reset; speed slider (ms-per-tick, multi-
expansion at max speed); freeze painting while running.
_Test:_ all four advance in lockstep; Step does exactly one expansion each; Reset clears overlays
and stats; speed slider visibly changes pace; race halts when all four are `done`.

**Step 6 — Scoreboard + descriptions + final path.**
Per-panel live stats (visited, path cost, steps, optimal ✓/✗); one-line algorithm description;
draw final path on completion; compute `optimal` once all four finish.
_Test:_ live stats match engine counters; on the Research-style fixture, BFS/Greedy show higher
cost than Dijkstra/A\*; Dijkstra & A\* show optimal ✓; paths render end-to-end.

**Step 7 — Edge cases, polish, layout.**
No-path handling (sealed goal → "No path", no crash); start==end guard; clean 2×2 desktop layout;
disable inappropriate controls mid-run; intro/explainer text; final visual pass.
_Test:_ seal the goal with walls → every panel reports "No path" gracefully; layout holds at a
typical desktop width; no console errors across a full interaction cycle.

## Testing strategy (woven in, not after)

- **Unit:** Step 2 Node self-test on a fixed fixture (cost/step/optimality assertions). Re-run
  after any engine change.
- **Integration:** Steps 4–6 — paint → race → scoreboard end-to-end; delta rendering matches
  full re-render.
- **Edge cases:** no path, start==end, goal walled off, endpoint dragged onto obstacle,
  painting during a run.
- **Security/static (Step 7 + Verify):** grep the file for `innerHTML`, `eval`, `new Function`,
  `fetch`, `http`/`https`/`//cdn`, `import ` — expect none. Confirm zero network references so
  the file is provably offline.

## Inputs to validate / boundaries to harden

| Input | Risk | Handling |
|-------|------|----------|
| Paint over start/end | Lose endpoints | Disallow; painting skips endpoint cells |
| Drag endpoint onto wall/weight | Unreachable/odd cost | Force target cell passable (weight 1, not wall) |
| Random maze | Seals start/end | Always clear start/end + immediate neighbors |
| Click outside grid / during run | Bad state | Ignore out-of-grid; freeze editing while running |
| No path exists | Crash on reconstruct | `path()` returns null → scoreboard "No path", no throw |

(Offline single-file artifact → no network/auth/storage attack surface; above is robustness +
the standing "no `innerHTML`/`eval`" discipline.)

## Acceptance criteria checklist

1. [ ] Opens and runs fully from `file://` with no network requests and no console errors.
2. [ ] Four panels (BFS, Dijkstra, Greedy, A\*) render the same maze with a shared legend.
3. [ ] User can paint walls and weights, erase, and drag start/end; changes reflect in all four.
4. [ ] Random maze and Clear work and never strand the start/end.
5. [ ] Play animates all four in lockstep; Step advances one expansion each; Reset clears state.
6. [ ] Speed slider changes animation pace.
7. [ ] On weighted terrain, Dijkstra & A\* report equal, optimal path cost; A\* visits ≤ Dijkstra.
8. [ ] BFS and/or Greedy can report higher path cost than optimal (the core teaching contrast).
9. [ ] Per-panel scoreboard shows visited / cost / steps / optimal, updating during the run.
10. [ ] Final path is drawn in each panel that finds one.
11. [ ] Sealing the goal → every panel reports "No path" without crashing.
12. [ ] Source contains no `innerHTML`, `eval`, `new Function`, `fetch`, or external URLs.
```
