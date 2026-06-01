# Phase 6 — Verify (Iteration 1)

Adversarial pass. Per the cycle, the full suite was **re-run from scratch** rather than trusting
Execute's self-report, and combined with the user's direct hands-on verification of the rendered
artifact in a real browser.

## Test suite — fresh re-run (not copied from Execute)

| Suite | Scope | Result |
|-------|-------|--------|
| `tests/test.js` (standalone engine) | optimality, no-path, path validity, edge cases | **44/44 pass** |
| `tests/verify_inlined.js` (shipped engine) | re-extracts engine from the HTML and re-asserts | **42/42 pass** |
| `tests/verify_inlined.js` (static) | innerHTML/eval/Function/fetch/XHR/storage/external-URL scan | **8/8 clean** |
| `tests/integration.js` (jsdom) | build, paint, endpoints, full Play race, Step, reset, no-path | **20/20 pass** |

Headless race (reproduced this run): `cost [44, 36, 44, 36]`, `visited [319, 417, 21, 261]`,
`optimal [✗, ✓, ✗, ✓]` — the intended teaching contrast holds.

## Acceptance criteria — evidence

| # | Criterion | Verdict | Evidence |
|---|-----------|---------|----------|
| 1 | Offline, no network, no console errors | **PASS** | Static: 0 external URLs / 0 storage / 0 fetch. No errors in jsdom. **User: no console issues, runs offline.** |
| 2 | Four panels, same maze, shared legend | **PASS** | integration (4 panels, paint propagates); user visual |
| 3 | Paint walls/weights/erase + drag endpoints, reflect in all four | **PASS** | paint propagation auto-tested; **endpoint drag confirmed by user hands-on** |
| 4 | Random + Clear never strand start/end | **PASS** | `reachable()` retry + guards; **user exercised Random/Clear directly** |
| 5 | Play lockstep · Step one each · Reset clears | **PASS** | integration (Step→visited==1 each; reset clears overlays); user |
| 6 | Speed slider changes pace | **PASS** | **user confirmed slider feel/pace** |
| 7 | Dijkstra & A\* equal optimal cost; A\* visits ≤ Dijkstra | **PASS** | 36==36; 261 ≤ 417 |
| 8 | BFS/Greedy can be costlier than optimal | **PASS** | 44 > 36 |
| 9 | Scoreboard live visited/cost/steps/optimal | **PASS** | integration; user |
| 10 | Final path drawn per panel | **PASS** | integration (`.cell.path` > 0 in every panel); user |
| 11 | Seal goal → "No path", no crash | **PASS** | integration (all four report "no path", cost ∞) |
| 12 | No innerHTML/eval/fetch/external URLs | **PASS** | 8/8 static checks |

**12 / 12 acceptance criteria pass.**

## Security check results

- Offline single-file artifact: no network, storage, auth, or secrets — no attack surface.
- Static scan clean: no `innerHTML`, `eval`, `new Function`, `fetch`, `XMLHttpRequest`,
  `localStorage`/`sessionStorage`, or external/protocol-relative URLs.
- DOM is built exclusively via `createElement` + `textContent`; no injection path.

## User (human) verification — recorded

User confirmed directly in a real browser: demo works well, looks great, all buttons and
features functional. This closes the visual/interaction items automation could not judge
(rendering fidelity, layout, slider feel, endpoint dragging, random/clear by hand).

## Issues found

None. No regressions, no failing criteria, no security findings.

## Outcome

**Iteration 1 complete.** All acceptance criteria pass with evidence; no issues carried forward.
The stepable-engine architecture and shared-maze/four-view design are validated and provide a
clean foundation for iteration 2 (teaching content + toggleable pseudocode execution).
