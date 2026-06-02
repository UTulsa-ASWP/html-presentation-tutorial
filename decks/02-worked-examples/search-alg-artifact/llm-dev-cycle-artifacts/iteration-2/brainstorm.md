# Phase 2 — Brainstorm (Iteration 2)

## Chosen concept

Add a toggleable **Study Mode** to the existing four-way race. The 4-up race remains the default
"compare" view; toggling **Study / Pseudocode** on focuses a single algorithm and walks its
pseudocode **line by line**, synced to its grid, with plain-English narration — a true
program-counter view. The other three algorithms appear as small thumbnails to switch focus.

### The key idea: one shared pseudocode skeleton

All four algorithms share the same control-flow skeleton and differ on only a few lines. We show
**one** template and mark the divergent lines per algorithm — so the same artifact serves both
R8 (pseudocode execution) and R7 (difference-highlighting):

```
push start to frontier
while frontier not empty:
  node ← remove "best" from frontier     ← BFS: oldest · Dijkstra: min g · Greedy: min h · A*: min g+h
  if node is goal: reconstruct path; stop
  mark node visited
  for each neighbor:
    skip if wall or visited
    cost ← g[node] + weight(neighbor)     ← BFS ignores weight (counts steps)
    if new or cheaper:                      ← BFS/Greedy: only if unseen (no re-open)
      update g, set parent, push to frontier
```

## Decisions (locked)

- **Tracer model:** focused line-walk (one algorithm at a time), *not* parallel traces.
- **Other panels during study:** paused; shown as small reference thumbnails. Study mode is a
  distinct mode from the parallel race.
- **Granularity / stepping:** sub-step program counter. `Step` = advance one pseudocode line
  (pop → goal-test → mark visited → per-neighbor: skip? → cost → improve? → update+push).
  `Play` auto-advances lines at the speed slider.
- **Grid sync:** focused grid highlights the **node being expanded** and the **neighbor under
  inspection** for the current line.
- **Narration (R6/R8):** one live sentence translating the current line into plain English with
  real values (e.g. "Remove (8,5) — lowest f = 12 in the frontier").
- **Teaching content (R6):** 2–3 sentence blurb per algorithm in the study header (role,
  guarantee, weakness).
- **Difference summary (R7):** compact comparison table — ordering key · uses weights? ·
  heuristic? · optimal? — plus the highlighted divergent pseudocode lines.
- **Entry/exit:** a Study/Pseudocode toggle, **default OFF** (demo opens exactly as it does
  today). Clicking any race panel also enters study mode focused on that algorithm.

## Alternatives considered and rejected

| Alternative | Why rejected |
|-------------|--------------|
| Parallel pseudocode strips under all four grids | Four live line-walks at once overwhelms; not true line-by-line |
| Ride-along slow-mo (race continues while focused one slow-walks) | Busier; non-focused panels "jump" an expansion at a time — distracting |
| Separate pseudocode per algorithm (4 distinct listings) | Misses the teaching gold: the algorithms are *almost identical*; a shared skeleton makes differences obvious |
| Real compilable source (JS/Python) | Distracts from concept with language noise; pseudocode teaches better |
| Editable pseudocode / breakpoints | Scope creep; not needed to teach |

## Scope boundaries

**In scope (iteration 2):**
- Study Mode toggle (default off); focus one algorithm; switch via thumbnails or by clicking a
  race panel.
- Shared pseudocode skeleton with per-algorithm divergent-line highlighting.
- Sub-step program counter driven by Step/Play; grid highlights node + neighbor under inspection.
- Live plain-English narration of the current line.
- Per-algorithm teaching blurbs + a comparison table.
- The existing 4-up race must keep working unchanged when Study Mode is off.

**Out of scope (deferred):**
- Step-*backward* / history scrubbing (**stretch** — nice but not required).
- Real source code, editable pseudocode, breakpoints, audio narration.

## Security-relevant boundaries

Unchanged from iteration 1: fully offline, single file, no network/auth/storage/secrets, no new
external input — only additional internal UI state. Discipline held: pseudocode and narration
lines are built with `textContent` only (**never `innerHTML`**); no `eval`/`new Function`. The
divergent-line annotations are static strings in code, not user-derived.
