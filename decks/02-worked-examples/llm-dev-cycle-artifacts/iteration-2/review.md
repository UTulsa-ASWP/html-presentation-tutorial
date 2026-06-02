# Review / Reflect — Iteration 2 (Deck 2: "Worked Examples")

*Phase 1 of `llm-dev:cycle`. Goal: expand Deck 2 from one worked example (the DP explainer)
into **two** — adding the **Pathfinding Race** search-algorithm demo built with the Claude
desktop app.*

> **Folder note.** After a housekeeping pass this session, Deck 2 now separates three
> things cleanly:
> `dp-explainer-deck/` (worked example 1 + its cycle artifacts + transcript),
> `search-alg-artifact/` (worked example 2 + its 3-iteration cycle artifacts + tests), and
> `llm-dev-cycle-artifacts/` (how **this deck itself** is built — `iteration-1/` = the original Deck 2
> build, `iteration-2/` = this cycle). These artifacts live in `llm-dev-cycle-artifacts/iteration-2/`.

## Reflection on Iteration 1 (the original Deck 2 build)

Read `llm-dev-cycle-artifacts/iteration-1/execute.md` + `verify.md`. That iteration built Deck 2 as an
**11-slide "hybrid spine"**: title → story → six phase slides (each = a verbatim key-moment
quote in a callout + context + a "read the full doc" link-out) → two key-moment slides (the
1→3-file refactor; "how it really went") → close. It embedded a verbatim offline copy of the
DP explainer and shipped the 6 cycle docs as link-out targets. **9/9 acceptance criteria
passed.**

**What worked (carry forward):**
- **Phase-by-phase spine, anchored by verbatim quotes + link-outs.** The "this really
  happened, here's the doc" texture is the whole value of a worked example.
- **Embedded, offline artifact, one click away.** The DP explainer opens from the slide and
  runs offline. Parity says do the same for the Pathfinding Race.
- **Honest "how it really went" beats** (the slider bug, the refactor, the one-word "B",
  the `git reset --hard` mishap) are the most instructive slides.
- **Strict link-resolution + offline-guard discipline** in Verify caught real issues (the
  `@import`-vs-comment false positive). Keep it.

**What to change this iteration:**
- The deck must now carry **two** worked examples. 11 slides is not a hard limit — a longer
  deck is fine if the second example earns the space; we'll let the content decide rather
  than forcing brevity. The existing 11 slides are entirely DP, and Slide 1's title/subtitle
  already say "Worked Examples / two real builds," but the body and the welcome note still
  describe only the DP explainer — those need reconciling, and a second section added.
- Add the **Pathfinding Race** with its own spine, framed around what's *different* (see
  below), plus its embedded artifact and link-outs.

**Assumption corrected:** I had briefly conflated the DP explainer's own build cycle with
"Deck 2 iteration 1." They're distinct: the DP explainer is the *subject* of example 1;
`llm-dev-cycle-artifacts/iteration-1/` is the *deck's* prior build. This iteration is the deck's
second pass.

## The Second Example, in Brief

**Pathfinding Race** — one self-contained, offline HTML file racing **BFS, Dijkstra, Greedy
Best-First, and A\*** in lockstep across a shared, user-editable weighted maze, with a
per-panel scoreboard (cells visited, path cost, length, optimal?). Built in **three cycle
iterations** in the **Claude desktop app**:
1. **Core race** (571 lines) — engine prototyped + unit-tested in Node, then ported.
2. **Study Mode** (891 lines) — engine refactored to a generator micro-stepper behind a
   *regression gate* (iteration-1's full suite re-run before the new feature was built);
   adds line-by-line pseudocode walkthrough.
3. **Apple-style restyle** (907 lines) — behavior-neutral light redesign, enabled by the
   CSS-variable architecture; full suite re-run to prove nothing broke.

Its arc is **engineering-discipline-forward** (prototype-before-commit → regression-gate
refactor → behavior-neutral restyle) — a useful *contrast* to the DP build's
**content-pivot-forward** arc. Featured artifact: `search-alg-artifact/pathfinding-race.html`.

## Context Loaded This Iteration

- `llm-dev-cycle-artifacts/iteration-1/execute.md` + `verify.md` — the original Deck 2 build record.
- Current `decks/02-worked-examples/index.html` — 11 DP slides + the (uncommitted)
  team-facing notes polish from earlier this session; links now repointed to
  `dp-explainer-deck/`.
- A full digest of the **Pathfinding Race** and its 3-iteration build, from
  `search-alg-artifact/llm-dev-cycle-artifacts/`.
- Deck 1 ("Vibe Engineering with llm-dev:cycle") as the voice/polish reference.

## Constraints (unchanged from the suite)

- Vanilla HTML/CSS/JS, offline-first, no build step; built on the shared starter
  (`styles.css`/`script.js` kept in sync across decks).
- Offline guard = resource loads only; `<a href=http>` allowed as content.
- Speaker notes are **team-facing reference** (Deck 1 voice).
- File-trees use `<pre class="file-tree">` + `<!-- prettier-ignore -->`.
- Verify in **Firefox** (Chrome MCP can't open `file://`); headless checks first.

## Candidate Approaches (to settle in Brainstorm)

- **A — Deep + Contrast (recommended).** Keep the DP build as the deep, phase-by-phase
  example; add a tighter Pathfinding section framed around *what's different* (desktop app,
  3 iterations, regression-gate discipline, behavior-neutral restyle) rather than
  re-narrating all six phases. ~6–8 new slides; the contrast is the lesson.
- **B — Parallel-per-phase.** Each phase slide shows *both* examples side-by-side. Tight
  conceptual mapping, but a big rewrite of existing slides and risks cramming.
- **C — Two clean parts.** "Part 1: A Presentation" / "Part 2: An Artifact." Simple mental
  model; some structural duplication.

## Open Questions for Brainstorm

1. **Depth balance** — DP-deep + Pathfinding-as-contrast (A), or equal depth?
2. **Embed the Pathfinding artifact** in the deck (parity with the DP explainer) — enabled
   by the new `search-alg-artifact/` folder, so the deck can link/iframe it locally.
3. **Target length** — acceptable slide count? (Current 11 → ~17–19 under A.)
4. **Tool-contrast angle** — how hard to lean on "built in the Claude desktop app, not
   Claude Code" as the suite's *tool-agnostic* theme (README now states this explicitly).
5. **Iteration story** — the Pathfinding Race's 3 iterations are a strong "iterate, don't
   perfect" teaching beat; feature them, or keep to the final artifact?

## Housekeeping (done this session)

- Reorganized Deck 2 into `dp-explainer-deck/`, `search-alg-artifact/`, `llm-dev-cycle-artifacts/`.
- Deleted the codex-5.5 demo; removed the now-empty `search-alg-demos/`.
- Copied the parent's original Deck 2 build artifacts into `llm-dev-cycle-artifacts/iteration-1/`
  (retained in the local-only parent too).
- Repointed all deck links (DP artifact ×3, cycle docs ×7), the transcript self-ref, and
  the README (layout tree + removed the stale "cross-tool demos" section, folded its
  tool-agnostic point into the cycle-skill section).
