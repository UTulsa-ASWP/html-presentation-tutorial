# Phase 1 — Review

_Iteration 1. No prior iteration, so no Reflection section._

## Context summary

**Goal:** Build an interactive, self-contained artifact (vanilla HTML + JS, no build step,
no network) that demonstrates a few pathfinding algorithms in the spirit of the
PathFinding.js visual demo (https://qiao.github.io/PathFinding.js/visual/).

**What the source demo does (reference, not a spec to clone):**
- A 2D grid. User places a start node and an end node, and paints walls.
- User picks an algorithm and options (diagonal movement, heuristic, bi-directional, etc.).
- On "Start", the search animates: cells are shown as they're *opened* (frontier) and
  *closed* (explored), then the final path is drawn.
- Controls for pausing, clearing the path, and clearing walls.
- Library finders: A*, IDA*, Breadth-First, Best-First, Dijkstra, Jump Point Search,
  plus bi-directional variants.

## Requirements (from the user)

| # | Requirement | Notes |
|---|-------------|-------|
| R1 | Interactive | User can manipulate the grid and trigger searches |
| R2 | Vanilla HTML + JS | No frameworks, no bundler |
| R3 | Fully runnable offline | Single file, zero network requests, no CDN |
| R4 | Demonstrates "a few" algorithms | Plural but bounded — not the full library |
| R5 | Runs in a web browser | Standard modern browser, no plugins |

## Constraints

- **Single-file, offline (R3):** all CSS/JS inline; no external fonts, images, or libraries.
  This rules out importing PathFinding.js itself — we reimplement the handful of algorithms
  we want from scratch. That's fine and actually better for a *teaching* artifact.
- **No build tooling (R2):** plain `<script>`, no modules-from-disk gotchas (a single inline
  script sidesteps `file://` CORS issues with ES module imports).
- **Artifact medium:** renders as an `.html` artifact in this interface.

## Candidate algorithm set (narrowing, per skill: eliminate, don't expand)

The source library has ~10 finders. "A few" + a clear teaching story argues for a small,
*contrasting* set rather than breadth. Leading candidate — the classic quartet:

1. **BFS** — uninformed, explores in rings, optimal on unweighted grids.
2. **Dijkstra** — uniform-cost; same as BFS when all costs equal, but the framing matters.
3. **Greedy Best-First** — pure heuristic; fast, beelines to goal, *not* optimal.
4. **A\*** — combines cost-so-far + heuristic; optimal *and* directed.

This set is pedagogically tight: each one differs from its neighbour by exactly one idea
(add a cost function → add a heuristic → combine them). That contrast is the demo's payload.

**Deliberately set aside** (candidates for a later iteration, not iteration 1):
- Jump Point Search, IDA\*, bi-directional variants — more advanced, dilute the core story.
- Weighted terrain / variable cell costs — would make Dijkstra vs BFS more vivid, but adds
  UI and model complexity. Flag for Brainstorm as a possible scope decision.

## Gaps / ambiguities to resolve in Brainstorm

- **How many** algorithms exactly? (Recommend the 4 above; could trim to 3 — drop Dijkstra
  if we stay strictly unweighted, since it'd be visually identical to BFS.)
- **Diagonal movement** on/off, and whether to expose it as a toggle.
- **Side-by-side race** vs **one-at-a-time** visualization — a meaningful UX fork.
- **Weighted cells** in or out of scope for iteration 1.
- Visual style / how much polish vs. how much clarity.

## Candidate approaches (high level)

- **A) Faithful single-grid demo** — one grid, pick algorithm, animate. Closest to source.
- **B) Comparison view** — run 2+ algorithms on the same maze, side by side, to make the
  differences legible at a glance. More original, stronger teaching.
- **C) Hybrid** — single grid by default, with an optional "compare" mode.

These trade-offs are exactly what Phase 2 (Brainstorm) should settle interactively.
