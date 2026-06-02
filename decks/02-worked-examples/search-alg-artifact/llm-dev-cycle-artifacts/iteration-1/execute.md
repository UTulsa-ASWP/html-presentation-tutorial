# Phase 5 — Execute

## What was built

`pathfinding-race.html` — a single, fully offline HTML file (~520 lines) implementing the
four-way lockstep pathfinding race from the plan. One inline `<style>`, one inline `<script>`
(an IIFE), zero dependencies, zero network references.

Sections, as planned: CONFIG → Engine (Maze/MinHeap/makeSearch) → State → Render → Interaction
→ Race controller → wire-up. Aesthetic direction: a dark "instrument panel" with a faint
graph-paper background, monospace numerals, per-algorithm accent labels, and a single shared
cell-state colour language across all four grids (driven by CSS variables).

Build followed the 7-step sequence. Each step's test gate was met before moving on.

## Translation note (the one real risk)

The engine was first written and unit-tested as a standalone module (`tests/engine.js`) using
`Map`/`Set`/`class`. For the artifact I rewrote it to plain objects + ES5 prototypes (maximally
robust over `file://`). Because that translation could have introduced subtle bugs, I
**extracted the actual inlined engine back out of the HTML and re-ran the full assertion suite
against it** (`tests/verify_inlined.js`). It reproduced the standalone results identically
(BFS 28/14, Dijkstra 6/7, Greedy 28/5, A\* 6/7), confirming a faithful port.

## Tests run (all green) — saved under `tests/`

| Test file | What it covers | Result |
|-----------|----------------|--------|
| `engine.js` + `test.js` | Standalone engine: optimality, no-path, path validity, edge cases | 44/44 pass |
| `verify_inlined.js` | Re-tests the *actual shipped* engine + 8 static security/offline checks | pass + 8/8 |
| `integration.js` (jsdom) | Headless DOM: build, paint propagation, endpoint protection, full race via the real Play/rAF path, single-step semantics, reset, no-path | 20/20 pass |

Headless race result on a muddy-band maze (proves the teaching contrast end-to-end):
`cost [BFS 44, Dijkstra 36, Greedy 44, A* 36]`, `visited [319, 417, 21, 261]`,
`optimal [✗, ✓, ✗, ✓]`.

## Bugs found and fixed

- **No artifact bugs surfaced.** The upfront Research prototype + Step-2 unit tests caught the
  algorithmic issues before they reached the file, so Execute was unusually clean.
- Bugs fixed were all in the **test harness**, not the artifact: jsdom's `performance` is
  read-only (switched to `Object.defineProperty`), and assertions initially ran before the
  script's `DOMContentLoaded` `init()` (wrapped the suite to await load).

## Acceptance criteria results (vs. plan checklist)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Offline, no network, no console errors | Static: no external URLs / no errors in jsdom ✓ · real-browser console = Verify (human) |
| 2 | Four panels, same maze, shared legend | ✓ integration |
| 3 | Paint walls/weights/erase + drag endpoints reflect in all four | Paint propagation ✓ tested; endpoint-drag *movement* implemented, not auto-asserted → Verify |
| 4 | Random + Clear never strand start/end | `reachable()` retry + endpoint guards implemented; not auto-asserted → Verify |
| 5 | Play lockstep · Step one each · Reset clears | ✓ integration (Step→visited==1 each; reset clears overlays) |
| 6 | Speed slider changes pace | Logic wired (`speedToMsPerTick`); pace change is visual → Verify |
| 7 | Dijkstra & A\* equal optimal cost; A\* visits ≤ Dijkstra | ✓ (36==36; 261 ≤ 417) |
| 8 | BFS/Greedy can be costlier than optimal | ✓ (44 > 36) |
| 9 | Scoreboard live visited/cost/steps/optimal | ✓ |
| 10 | Final path drawn per panel | ✓ |
| 11 | Seal goal → "No path", no crash | ✓ |
| 12 | No innerHTML/eval/fetch/external URLs | ✓ 8/8 static checks |

## Honest handoff to Verify

Everything testable without a real browser is green. The items that an automated headless run
*cannot* fully judge — actual visual rendering, colour/layout fidelity, real-browser console
cleanliness, the feel of the speed slider, and endpoint-drag + random-maze behaviour by hand —
are explicitly flagged above and are the right targets for the adversarial Verify pass.
