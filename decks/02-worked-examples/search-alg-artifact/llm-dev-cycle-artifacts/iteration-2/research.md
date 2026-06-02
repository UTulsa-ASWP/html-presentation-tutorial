# Phase 3 — Research (Iteration 2)

## The central decision: one engine, two granularities

The risk flagged in Review was maintaining two implementations (fast race engine vs. annotated
study engine) that could silently diverge. **Resolved by unification:** a single
**generator-based micro-stepper** is the source of truth.

- **Study mode** advances the generator **one `.next()` per pseudocode line** (the program counter).
- **Race mode** advances the generator **to the next expansion boundary** (`endExp`), collecting
  the same `{opened[], closedCell}` deltas iteration 1's renderer already consumes.

This was prototyped and **validated against the iteration-1 engine as an oracle**: across BFS,
Dijkstra, Greedy, and A\* on three fixtures (weighted, open 15×15, diagonal walls), the
generator-driven race produced **identical** found/visited/cost/steps every time (12/12). The
equivalence check is retained as a permanent regression test.

## Pseudocode line model (shared skeleton)

Generator yields a state per line id; ids map to the displayed shared-skeleton lines:

| line id | displayed line | per-mode divergence (annotation) |
|---------|----------------|----------------------------------|
| `init` | push start to frontier | — |
| `pop` | node ← remove "best" from frontier | BFS: oldest · Dijkstra: min g · Greedy: min h · A\*: min g+h |
| `goal` | if node is goal: reconstruct; stop | — |
| `mark` | mark node visited | — |
| `for` | for each neighbor | — |
| `skip` | skip if wall or visited | BFS/Greedy also skip if already seen (no re-open) |
| `cost` | cost ← g[node] + weight(neighbor) | BFS ignores weight (orders by steps) |
| `improve` | if new or cheaper | BFS/Greedy: only if unseen |
| `push` | update g, set parent, push | — |
| `endExp` | (loop back to while) | race-mode boundary marker |
| `exhausted` | frontier empty → no path | — |

Each yield carries context: `{line, node, neighbor, cost, improved, hit}`. The PC walks the
**same** skeleton for all four; the algorithm's *real* branching (relax vs. first-reach, ordering
key) is faithful underneath, while the *displayed* difference is the annotation + narration. This
is precisely the R7 teaching mechanism — the differences live on three lines (`pop`, `cost`,
`improve`).

## Key technical decisions

- **Generators**: ES6 `function*`/`yield`. Universally supported in modern browsers, pure JS,
  works offline from `file://`, zero dependencies. No compatibility concern.
- **Refactor shape**: `makeSearch` exposes `microStep()` (one line, returns the yield state) and
  `stepExpansion()` (drives to `endExp`, returns `{opened, closedCell}` — same contract as
  iteration 1). The controller routes Step/Play to one or the other based on mode.
- **Performance**: race-via-generator adds trivial overhead (still ≤ ~1k cells); study mode is
  human-paced. A full-race regression through the refactored engine will be re-run in Verify.
- **Narration (R6/R8)**: static plain-English templates per line id, interpolated with live
  values via `textContent` (e.g. `pop` → "Remove (r,c) — lowest f in the frontier"; `improve`
  false → "Already have a cheaper route — skip"). No `innerHTML`.
- **Focused grid sync**: render the focused search's accumulated open/closed/path incrementally
  from the same micro-step stream (push→open, pop→closed, goal→path), plus two transient cursors:
  **node being expanded** and **neighbor under inspection**.
- **Difference summary (R7)**: a static comparison table — ordering key · uses weights? ·
  heuristic? · optimal? — beside the pseudocode.
- **Controller modes**: a `mode` flag (`race` | `study`). Study pauses the parallel race, keeps
  the four searches' state, and drives only the focused one at line granularity. Toggling off
  restores the 4-up race. Step/Play/Reset/speed are reused, reinterpreted at line granularity in
  study mode.

## Dependencies & security posture

Still **zero dependencies**. No new external input — only more internal UI state. Pseudocode
text, annotations, and narration templates are static strings in code (not user-derived). DOM
built via `createElement`/`textContent`; no `innerHTML`/`eval`. Posture unchanged from iteration 1.

## Deferred to Plan

- Exact study-view layout (focused grid size, pseudocode list, narration bar, thumbnails,
  comparison table placement) and how it swaps in/out without disturbing the race DOM.
- Whether study mode rebuilds a dedicated larger grid or reuses an enlarged panel.
- Speed-slider mapping for line-granularity auto-play (lines/sec).
