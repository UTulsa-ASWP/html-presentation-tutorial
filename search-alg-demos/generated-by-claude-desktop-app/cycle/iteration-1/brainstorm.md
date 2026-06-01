# Phase 2 — Brainstorm

## Chosen concept

**A side-by-side pathfinding race on weighted terrain, built as a single offline HTML file,
designed as a teaching tool.**

Four algorithms run **simultaneously in lockstep** on one shared maze, so a learner sees the
behavioural differences at a glance:

| Panel | Algorithm | One-line teaching point |
|-------|-----------|--------------------------|
| 1 | **BFS** | Uninformed, ignores weights → fewest *steps* but can be *costly* |
| 2 | **Dijkstra** | Uniform-cost → genuinely *cheapest* path, but explores widely |
| 3 | **Greedy Best-First** | Pure heuristic → fast, beelines, but *not* optimal |
| 4 | **A\*** | Cost-so-far + heuristic → optimal *and* directed (fewer cells than Dijkstra) |

Each algorithm differs from a neighbour by one idea: add a cost function (BFS→Dijkstra),
swap to a heuristic (Dijkstra→Greedy), combine both (Greedy/Dijkstra→A\*). The weighted
terrain is what makes Dijkstra and A\* meaningfully different from BFS and Greedy — without
weights, Dijkstra and BFS would be visually identical.

## Decisions (locked)

- **Movement:** 4-directional (orthogonal) only. **Manhattan** heuristic for Greedy & A\*.
  Rationale: avoids the diagonal → heuristic-choice digression; keeps the heuristic story clean.
- **Interaction:** tool selector (paint **wall** / paint **weight** / **erase**), draggable
  **start** and **end** nodes, **Random maze** button, **Clear**. Click-and-drag painting.
- **Race model:** all four panels step in lockstep — one node expansion per tick per panel —
  for a fair, watchable race. **Play / Step / Reset** + **speed slider**.
- **Shared visual language:** identical colors across panels for start, end, wall, weight,
  frontier (open), visited (closed), final path. One shared **legend**.
- **Per-panel scoreboard:** cells visited, path cost, path length (steps), optimal? (yes/no).
  Makes the contrast quantitative.
- **Layout:** shared controls on top, 2×2 panel grid, a one-line description under each title.

## Alternatives considered and rejected

| Alternative | Why rejected |
|-------------|--------------|
| Single-grid demo (faithful PathFinding.js clone) | Weakest for teaching — can't see contrast; learner must remember prior runs |
| Single grid + accumulating scoreboard | Quantitative but not *visual*; the simultaneous spatial contrast is the payload |
| Unweighted grid (3 algorithms) | Dijkstra collapses into BFS — looks like a duplicate/bug; loses the cost story |
| Diagonal movement | Forces Manhattan/Euclidean/Chebyshev digression; muddies the heuristic lesson |
| Jump Point Search / IDA\* / bi-directional | Advanced; dilute the core four-way contrast — deferred to a later iteration |
| Importing PathFinding.js | Violates single-file/offline goal; reimplementing is clearer for teaching anyway |

## Scope boundaries

**In scope (iteration 1):**
- 4 algorithms, weighted terrain, 4-directional, Manhattan heuristic
- Lockstep race, Play/Step/Reset, speed control
- Wall/weight/erase painting, draggable endpoints, random maze, clear
- Shared legend + per-panel scoreboard, one-line algorithm descriptions

**Out of scope (deferred):**
- Diagonal movement; JPS / IDA\* / bi-directional variants
- Sophisticated maze generation (only a simple randomizer)
- Save/load, URL sharing, persistence
- Mobile-touch optimization (target: desktop browser)

## Security-relevant boundaries

Fully offline, single-file, client-side artifact:
- **No** server, network requests, authentication, persistence, secrets, or external resources.
- **Only input:** local mouse interaction mutating an in-memory grid model. No untrusted data
  enters the system; effectively no attack surface.
- **Discipline to hold in Execute:** build the grid via DOM APIs and `textContent` only —
  **never `innerHTML`** — so there is no injection path even in principle. No `eval`,
  no dynamic script. This is the one boundary worth stating; everything else is moot offline.
