# Brainstorm — Iteration 2 (Deck 2: "Worked Examples")

*Phase 2 of `llm-dev:cycle`. Converges the Review's candidate approaches and open questions into
a chosen concept for expanding Deck 2 from one worked example into two.*

## Chosen Concept — "Two Parts: Single-Iteration Simple → Multi-Iteration Complex"

Deck 2 becomes a two-part deck split along a **scale-of-build axis**. Both examples are
interactive HTML; what differs is *how far the cycle is pushed* — one pass at something simple
vs. multiple iterations into something complex. The split does **double duty**: it's a structural
divider *and* it teaches that **the same cycle scales** from a quick single-iteration build up to
an iterated, complex one.

- **Part 1 — Single-Iteration Interactive Presentation.** The DP-explainer deck: a presentation
  with **simple interactive elements**, built in a **single cycle iteration**. Organized by the
  **six cycle phases** (Review → Brainstorm → Research → Plan → Execute → Verify). Teaches the
  **anatomy of one cycle, start to finish**. Largely the existing 11 slides, reframed under a
  Part 1 banner.
- **Part 2 — Multi-Iteration Complex Artifact.** The Pathfinding Race: a **more complex
  interactive artifact**, built across **three iterations** (Core Race → Study Mode → Apple-style
  restyle). Organized by those iterations. Teaches **iterating toward complexity** — "iterate,
  don't perfect," with regression-gate discipline as the through-line.

The two parts are **complementary, not duplicative**: Part 1 = anatomy of a single cycle, Part 2 =
iterating across cycles toward complexity. Together they show the full picture, and the implicit
lesson of the split is *the cycle scales — same process, simple one-pass build or complex iterated
one.*

This supersedes the Review's recommended **Approach A (Deep + Contrast)**. The user chose
**Approach C (Two clean parts)**, and in dialogue we (a) resolved C's main weakness (feared
"structural duplication") by giving each part a *different natural spine* — phases for Part 1,
iterations for Part 2 — and (b) sharpened the axis from "two kinds of thing (presentation vs app)"
to **"single-iteration simple vs multi-iteration complex,"** since both builds are in fact
interactive.

## Resolved Open Questions (from `review.md`)

1. **Depth balance** → **Two clean parts (C)**, each with its own spine. Not equal phase-by-phase
   depth (that reintroduces duplication); not A's "DP-deep + Pathfinding-as-contrast-aside."
2. **Embed the Pathfinding artifact** → **Full parity, per iteration.** Each of Part 2's three
   iteration slides embeds *the version of `pathfinding-race.html` completed in that iteration*
   (571 → 891 → 907 lines) for offline one-click open, **and** links out to that iteration's cycle
   artifacts (`brainstorm/research/plan/execute/verify`). The audience can open all three and watch
   the artifact evolve. (Verified: all three snapshots + their docs exist on disk.)
3. **Target length** → Not capped. Expect roughly **~18–22 slides**; 11 was never a hard limit
   (locked decision). Let the content decide; keep each slide tight.
4. **Tool-contrast angle** → **Explicit teaching beat** with a generalization: Part 2 was built in
   the **Claude desktop app**, not Claude Code — *and* the same `llm-dev:cycle` can be run with
   ChatGPT, any other CLI, or any LLM tool the user is comfortable with. The message is
   **"same cycle, any tool, any model."** Gets its own slide/callout.
5. **Iteration story** → **Featured — it *becomes* Part 2's structure** (the 3 iterations are the
   spine), rather than being a single aside.

## Proposed Section Outline (sketch for Plan — not final slide order)

> Plan (Phase 4) owns the exact slide-by-slide sequence; this is the converged shape.

- **Opening (shared).** Title (already says "two real builds") + a reframed welcome note + one
  intro slide: *"One cycle, two scales"* — a single-iteration simple build vs a multi-iteration
  complex one (both interactive).
- **Part 1 divider — "Single-Iteration Interactive Presentation."**
- **Part 1 body.** The existing 6-phase DP spine (Review → Verify), plus the "1→3-file refactor"
  and "how it really went" key-moment beats. Embedded DP explainer + cycle-doc link-outs (as today).
  Reconcile any body/notes copy that still implies the deck is *only* about the DP build.
- **Bridge slide — "Same cycle, more iterations, more complexity (and a different tool)."** Sets
  up Part 2 and plants the tool/model-agnostic beat.
- **Part 2 divider — "Multi-Iteration Complex Artifact."**
- **Part 2 body — three iteration beats:**
  - *Iteration 1 — Core Race* (571 lines): prototype-before-commit (engine unit-tested in Node,
    then ported). Embed i1 snapshot + link i1 artifacts.
  - *Iteration 2 — Study Mode* (891 lines): regression-gate refactor to a generator micro-stepper;
    line-by-line pseudocode walkthrough. Embed i2 snapshot + link i2 artifacts.
  - *Iteration 3 — Apple-style restyle* (907 lines): behavior-neutral redesign enabled by the
    CSS-variable architecture; full suite re-run to prove nothing broke. Embed i3 snapshot + link
    i3 artifacts.
- **Tool/model-agnostic beat** (own slide): "built in the Claude desktop app — but run the same
  cycle in ChatGPT, another CLI, or any LLM tool you like."
- **Close / hand-off (shared).** Reconciled to cover *both* builds.

## Scope Boundaries

**Will:**
- Restructure Deck 2 into Part 1 / Part 2 with the two distinct spines above, updating the
  **existing deck structure** (intro/welcome, Part-1 framing, dividers) to the single-iteration-
  simple → multi-iteration-complex axis.
- Reframe (not rewrite) the existing DP slides under Part 1; reconcile welcome note + any
  singular-example copy.
- Add Part 2: 3 iteration beats, each with an embedded per-iteration artifact snapshot + cycle-doc
  link-outs, plus divider/bridge/tool-agnostic/close slides.
- Keep team-facing speaker notes (Deck 1 voice) for every new slide.
- Preserve offline-first behavior and the shared starter (`styles.css`/`script.js`).
- **Richer two-column slides** (added by user direction; see `research.md`): phase/iteration
  slides get a left column (conversation bubbles / highlights + → arrow) and a right scrollable
  pane showing the **rendered** cycle doc (Part 1) or the **artifact running inline** (Part 2).
- **Render cycle `.md` → styled HTML** (never link raw `.md`) via a committed pandoc script;
  display in-slide via `<iframe>` + keep an open-in-new-tab link.

**Won't:**
- Re-narrate the six phases inside Part 2 (iterations are its spine).
- Give Part 2 equal phase-by-phase depth to Part 1.
- Modify the artifacts themselves or their historical cycle docs (they're the *subject*, read-only).
- Rebuild the DP content from scratch — it passed 9/9 last iteration; reframe, don't redo.
- Force an 11-slide cap.
- **Visual/copy polish.** This cycle restructures and adds the second example so the deck is
  correct and complete; a dedicated **polish pass happens *after* this cycle finishes** (per the
  user). Execute aims for structurally sound + accurate, not pixel-final.

## Alternatives Considered & Rejected

- **Approach A — Deep + Contrast** (Review's pick): DP deep, Pathfinding as a tighter contrast
  aside. *Rejected* in favor of C — the user wanted two clean, co-equal parts framed as two *kinds*
  of build, not a primary + a footnote.
- **Approach B — Parallel-per-phase** (both examples side-by-side on each phase slide): *Rejected* —
  big rewrite of existing slides, cramming risk, and it forces the artifact into a phase frame that
  isn't its natural narrative.
- **Equal depth, both full 6-phase spines:** *Rejected* — reintroduces exactly the duplication C
  was feared to cause; buries the artifact's real story (its 3 iterations).
- **Part 2 organized by phases (of iteration 1):** *Rejected* — same duplication; the 3-iteration
  arc is the more instructive and more honest narrative for this build.
- **Embed-only / link-only for the artifact:** *Rejected* — loses either the verifiable doc-trail
  or the offline one-click demo. Per-iteration full parity keeps both *and* shows evolution.
- **Omit / only-lightly-mention the tool difference:** *Rejected* — the README now advertises the
  tool/model-agnostic theme; it earns an explicit beat.

## Security-Relevant Boundaries

Low surface — a static, offline teaching deck. Notes for later phases:
- **Embedded artifacts run local JS** (three Pathfinding snapshots + the DP explainer). They're our
  own authored files opened from `file://`/Pages; no external input, no network calls. If embedding
  via `<iframe>`, consider `sandbox`/sameorigin behavior so the local open still works offline
  (mechanism decided in Research).
- **Offline guard unchanged:** resource loads must stay local; `<a href="http…">` allowed as
  content only. New embeds/link-outs must not introduce remote resource loads.
- **Fair-use images** in the embedded DP artifact are already public (prior decision) — no change.
- No secrets, auth, or user data anywhere in scope.

## Verified This Phase

- All three Pathfinding snapshots exist at the cited sizes: `iteration-{1,2,3}/pathfinding-race.html`
  = 571 / 891 / 907 lines; final top-level = 907. Each iteration dir also holds full cycle docs.
  → the per-iteration embed + link-out plan is feasible with no reconstruction.

## Carry to Research

- **Embed mechanism for per-iteration snapshots:** match Part 1's DP embed approach (offline copy
  opened from the slide) vs `<iframe>`; decide how to host three snapshots without filename
  collisions or remote loads. Confirm how Part 1 currently embeds the DP explainer and mirror it.
- **Asset/link conventions** for the three snapshots + their cycle-doc link-outs (relative paths
  that resolve both from `file://` and GitHub Pages).
- Re-confirm the **offline guard** still passes with three new embedded artifacts.
