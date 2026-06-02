# Phase 1 — Review/Reflect (Iteration 2)

## Reflection on Iteration 1

**What worked — carry forward:**
- *Prototype-before-commit.* Validating the engine in Node before inlining meant Execute
  surfaced zero artifact bugs. Keep this discipline for the pseudocode instrumentation.
- *Stepable engine + shared-maze/four-view architecture.* Clean separation of model, search,
  and render. The new feature should extend this, not fight it.
- *Layered test pyramid.* Standalone unit → re-test the *inlined* code → jsdom integration.
  Reusable as-is; the pseudocode sync will need new assertions on top.
- *CSS-variable shared visual language.* One palette, consistent across panels — extend the
  same approach to pseudocode/teaching UI.

**Assumptions to revisit for the new scope:**
- *Step granularity.* `step()` currently performs **one full node expansion** per tick
  (pop → goal-test → loop neighbors → relax/push). Line-level pseudocode highlighting wants to
  know *which operation* is active. One expansion spans several pseudocode lines, so we must
  decide: highlight the whole expansion's block per tick, OR refine stepping into sub-steps
  (pop / test / per-neighbor) so the highlight walks line by line. **This is the central
  technical decision of iteration 2** — flagged for Brainstorm and Research.
- *Visual load.* Four grids already fill the view. Four simultaneous pseudocode traces with
  live highlights may overwhelm. Whether pseudocode shows for all four at once or for a
  *focused* algorithm is a real UX fork.

**Carried-forward items:** none — iteration 1's deferred adversarial checks were closed by
direct user verification in `iteration-1/verify.md`.

## New requirements (this iteration)

| # | Requirement | Reading |
|---|-------------|---------|
| R6 | Teach each algorithm | Richer per-algorithm explanation than the current one-line caption |
| R7 | Highlight the differences between them | Comparative teaching — what makes each distinct |
| R8 | Step-by-step pseudocode execution during the demo, **toggleable** | Pseudocode per algorithm with the active line highlighted, synced to the live race; on/off |

**Constraints (unchanged):** single self-contained `.html`, fully offline, no dependencies,
no `innerHTML`/`eval`. New UI must not regress the iteration-1 acceptance criteria.

## Scope shift

Iteration 1 was *show the race*. Iteration 2 is *explain the race*: narration/teaching content,
explicit difference-highlighting, and a synced pseudocode tracer. This is additive — the existing
demo must keep working with the new features toggled off.

## Gaps / ambiguities to resolve in Brainstorm

- **Pseudocode display:** all four traces at once (parallel, dense) vs. a **focused** single
  algorithm (selectable) vs. a hybrid.
- **Highlight granularity:** per-expansion block highlight (simpler, keeps current tick model)
  vs. sub-step line walk (truer "step-by-step", changes the stepping model).
- **Teaching content home:** expandable per-panel detail, a separate "Learn" section/tab, or a
  "focus/study one algorithm" mode.
- **Difference-highlighting format:** comparison table, prose, or synchronized side-by-side
  pseudocode with the differing lines called out.
- **Layout impact:** when pseudocode is on, do panels shrink, does a drawer open, or is there a
  dedicated study view? Must stay readable on a desktop screen.
- **Interaction coupling:** does pseudocode mode pair naturally with the existing Step button
  (study one operation at a time)?

## Candidate approaches (for Brainstorm to settle)

- **A) Parallel strips.** A compact pseudocode block under each of the four grids, active line
  highlighted per tick. Maximally comparative; visually dense.
- **B) Focus/study mode.** Pick one algorithm; show large pseudocode + a plain-English
  description of the current step, while the race continues. Calmer, deeper, less parallel.
- **C) Hybrid.** Compact per-panel pseudocode during the race **plus** an expandable per-algorithm
  "learn" section (full explanation + difference notes). Most complete; most to build.

No code this phase. These trade-offs — especially display mode and highlight granularity — are
exactly what Brainstorm should resolve interactively.
