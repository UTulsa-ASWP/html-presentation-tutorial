# Phase 3 — Research

## Tech stack selection

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Language/runtime | Vanilla HTML + CSS + JS, single `.html` file | Hard requirement: offline, no build step, runs from `file://` |
| Modules | One inline `<script>`, no ES module imports | ES modules over `file://` hit CORS restrictions; a single inline script sidesteps it entirely |
| Rendering | **DOM grid per panel**, incremental cell updates | See "Rendering decision" below |
| Animation | `requestAnimationFrame` + time accumulator | Smooth, frame-rate-independent lockstep stepping |
| Styling | Inline `<style>`, system font stack, CSS variables for the shared palette | No external fonts/CSS; CSS vars give one source of truth for the shared visual language |
| Dependencies | **None** | Reimplementing the four algorithms ourselves (see Brainstorm) |

## Dependencies & security posture

**Zero external dependencies**, so `npm audit` / `pip audit` are N/A — there is no supply chain.
This is the most secure posture available and follows directly from the single-file/offline goal.
The only self-imposed disciplines (carried from Brainstorm):
- Build all DOM via element creation + `textContent`; **never `innerHTML`**.
- No `eval`, no `new Function`, no dynamic `<script>`. Nothing to inject into.

## Validated engine (prototype run, not assumed)

A standalone Node prototype of the search core was written and executed before committing.
Test grid: a short route blocked by "mud" (weight 9) vs. a longer all-cheap (weight 1) detour.

| Algorithm | Steps | Path cost | Cells visited | Teaching point confirmed |
|-----------|-------|-----------|---------------|--------------------------|
| BFS | 4 | 28 | 14 | Fewest *steps*, ignores weight → costly; explores widely |
| Dijkstra | 6 | 6 (optimal) | 7 | Finds genuinely *cheapest* path |
| Greedy | 4 | 28 | 5 | Fastest (fewest visits) but *suboptimal* |
| A\* | 6 | 6 (optimal) | 7 | Optimal cost like Dijkstra, directed search |

Confirmed properties:
- Binary **min-heap with lazy deletion** is correct (stale entries skipped on pop via a
  closed-set check). No decrease-key needed — simpler and standard.
- A\* path cost **equals** Dijkstra path cost → Manhattan heuristic is admissible here, so
  A\* is provably optimal. This holds because min cell weight is ≥ 1, so Manhattan distance
  (in steps) never overestimates true cost.
- On this tiny grid A\* and Dijkstra visit the same count; the "A\* visits *fewer* than
  Dijkstra" effect grows with grid size and open space — the full-size demo will show it.

## Key technical decisions

**Cost model.** Each cell has a *weight = cost to enter it* (normal = 1, "mud" = a higher
constant, e.g. 5–10). Walls are impassable. `g(n)` = sum of weights of entered cells.
- BFS: FIFO queue, ignores weight, optimizes *step count*.
- Dijkstra: priority by `g`.
- Greedy: priority by `h` = Manhattan distance (steps) to goal.
- A\*: priority by `g + h`.

**Data structures.**
- Priority queue: small binary min-heap (~30 lines), lazy deletion. Adequate and fast for the
  target grid sizes (≤ ~1k cells per panel; pops are O(log n)).
- BFS queue: array + head index (amortized O(1) dequeue), avoids `Array.shift()` O(n).
- Per-search state: `cameFrom` map, `gScore` map, closed set — keyed by `"r,c"`.

**Shared maze, four views.** One maze model (walls/weights/start/end) is the single source of
truth. The four panels are renderings of that shared maze plus their own per-search overlay
(open / closed / path). Painting on any panel mutates the shared model and re-renders all four.

**Rendering decision: DOM over Canvas.** Each panel is a CSS-grid of cell `<div>`s with
`data-r`/`data-c`. Per tick we mutate only the *changed* cells' CSS classes (typically a handful),
not the whole grid — so cost scales with work done, not grid size. DOM also makes painting
trivial via event delegation (`mousedown`/`mouseenter` with a drag flag) and gives crisp,
CSS-variable-themed styling for the shared legend. Canvas would force full or dirty-rect redraws
and pixel→cell math for painting — more code, no benefit at this scale.

**Lockstep race.** A single `requestAnimationFrame` loop with a time accumulator. Each "tick"
advances every not-yet-finished search by **one node expansion**, keeping the race fair and
watchable. A speed slider maps to ms-per-tick (and at max speed, multiple expansions per frame).
Play / Step / Reset control the loop.

**Tie-breaking.** Heap ties broken by insertion order; for A\*/Greedy this yields the classic
clean "directed" frontier. (Optional later polish: break ties toward lower `h` for prettier
A\* fronts — noted, not required for iteration 1.)

**Browser APIs used** (all standard, offline-safe, no flags): DOM, `requestAnimationFrame`,
mouse events, CSS Grid, CSS custom properties. No `fetch`, no storage, no workers.

## Open items deferred to Plan
- Exact grid dimensions and cell size for a clean 2×2 desktop layout.
- Mud weight constant and palette values.
- Random-maze density (walls + weight patches) that produces interesting, solvable races.
