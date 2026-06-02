# Plan — Iteration 2 (Deck 2: "Worked Examples")

*Phase 4 of `llm-dev:cycle`. Concrete, ordered build sequence for restructuring Deck 2 into two
parts with rendered-doc panes, conversation bubbles, and inline-running artifacts. Self-contained:
executable without re-reading earlier phases (key facts restated inline).*

## Carried facts (so this plan stands alone)

- Deck dir: `decks/02-worked-examples/`. Deck CSS/JS live in **`assets/styles.css`** (422 ln) +
  **`assets/script.js`** (284 ln). Each slide is `<section class="slide">` (or `.slide title-slide`).
- **Bottom counter + dots auto-compute** from `slideElements.length` → no manual edits on add.
- **Per-slide `<span class="slide-number">NN</span>` labels are hardcoded and NOT JS-driven** →
  will be auto-numbered (build step 2) so inserts don't drift them.
- Render markdown with **pandoc 3.9** (build-time only) → standalone self-contained styled HTML;
  **never link raw `.md`**. Theme = deck's cream/navy/gold slide palette, readability-tuned.
- In-slide doc/artifact panes use **`<iframe>`** of local self-contained files (offline-safe);
  keep an **open-in-new-tab** `<a target="_blank" rel="noopener">` alongside.
- Part 2 artifacts already exist (no copying): `search-alg-artifact/llm-dev-cycle-artifacts/
  iteration-{1,2,3}/pathfinding-race.html` = 571 / 891 / 907 ln; each dir has `review…verify.md`.
- Bubble quotes: `dp-explainer-deck/llm-dev-cycle-artifacts/condensed-transcript.md`.
- **Polish is a separate post-cycle pass** — Execute targets structurally-sound + accurate.

## File Structure (after this iteration)

<!-- prettier-ignore -->
```
decks/02-worked-examples/
├── index.html                       # restructured into Part 1 / Part 2
├── assets/
│   ├── styles.css                   # + .split two-column, .bubbles/.bubble, .flow-arrow, .doc-pane
│   └── script.js                    # + auto-number .slide-number spans in init()
├── scripts/
│   ├── render-cycle-docs.sh         # pandoc generator (globs cycle .md → sibling .html); committed
│   └── cycle-doc.css                # rendered-doc theme (cream/navy/gold, readable)
├── dp-explainer-deck/
│   └── llm-dev-cycle-artifacts/
│       ├── *.md                      # source (unchanged)
│       └── *.html                    # GENERATED, committed (review.html … verify.html, +transcript)
└── search-alg-artifact/
    ├── pathfinding-race.html         # final (unchanged)
    └── llm-dev-cycle-artifacts/iteration-{1,2,3}/
        ├── *.md                      # source (unchanged)
        ├── *.html                    # GENERATED, committed
        └── pathfinding-race.html     # per-iteration snapshot (unchanged)
```

> Generated `.html` co-located beside source `.md` (short, obvious relative paths). They must be
> **committed** so GitHub Pages serves them. A one-line note/header marks them generated.

## Slide Sequence (target ~18–19 slides)

**Opening (shared)**
1. **Title** — reframe subtitle to the two-scale axis ("one cycle, two scales: a single-iteration
   interactive presentation and a multi-iteration complex artifact"). Reframe welcome speaker note.
2. **"One cycle, two scales"** — intro slide: the axis + taxonomy (both interactive; difference =
   how far the cycle is pushed). Replaces the singular "What you're about to see" framing.

**Part 1 — Single-Iteration Interactive Presentation**
3. **Part 1 divider** — banner + 1–2 lines situating the DP explainer (simple interactive elements,
   one cycle iteration).
4–9. **Six phase slides** (Review → Brainstorm → Research → Plan → Execute → Verify), each upgraded
   to the **two-column `.split`**: left = 2–3 user/assistant **bubbles** (real quotes) + → arrow;
   right = **scrollable `<iframe>`** of that phase's rendered doc + an open-in-new-tab link. Reframe
   the existing slides 3–8 content into the left column; keep their verbatim callouts as bubbles.
10. **Refactor key moment** (keep existing slide 9 content; left highlights + optional execute-doc pane).
11. **"How it really went"** (keep existing slide 10 content).

**Bridge**
12. **Bridge** — "Same cycle, more iterations, more complexity (and a different tool)." Plants the
   tool/model-agnostic beat; transitions to Part 2.

**Part 2 — Multi-Iteration Complex Artifact**
13. **Part 2 divider + Pathfinding overview** — what the artifact is (BFS/Dijkstra/Greedy/A\* race),
   built across 3 iterations.
14. **Iteration 1 — Core Race (571 ln)** — `.split`: left = highlights (prototype-before-commit,
   engine unit-tested in Node then ported); right = **iframe of iteration-1 snapshot** running +
   link-outs to iteration-1 rendered docs.
15. **Iteration 2 — Study Mode (891 ln)** — left = highlights (regression-gate refactor to generator
   micro-stepper; pseudocode walkthrough); right = iteration-2 snapshot + iteration-2 doc link-outs.
16. **Iteration 3 — Apple-style restyle (907 ln)** — left = highlights (behavior-neutral redesign via
   CSS-variable architecture; full suite re-run); right = iteration-3 snapshot + iteration-3 link-outs.
17. **Tool/model-agnostic beat** — "built in the Claude desktop app — but run the same cycle in
   ChatGPT, another CLI, or any LLM tool you like." Own slide/callout.

**Close (shared)**
18. **Close / hand-off** — reframe existing close to cover **both** builds (presentation + artifact);
   link finished explainer, final pathfinding-race.html, and the rendered cycle artifacts.

## Build Sequence (ordered; each step independently testable)

1. **Doc rendering foundation.** Write `scripts/cycle-doc.css` (cream `--bg-slide` card, `--ink`
   text, `--navy` headings, `--gold` accents/links, serif headings, mono code; max-width ~70ch,
   line-height ~1.6) + `scripts/render-cycle-docs.sh` (globs every
   `**/llm-dev-cycle-artifacts/**/*.md` under the deck, runs
   `pandoc --standalone --embed-resources --css scripts/cycle-doc.css --metadata title="<derived>"
   IN.md -o IN.html`). Run it. **Test:** open 2–3 generated `.html` in Firefox — styled, readable,
   self-contained (no remote loads).
2. **Auto-number slide labels.** In `script.js` `init()` (already does
   `querySelectorAll('section.slide')`), set each slide's `.slide-number` textContent to a
   zero-padded index+1. **Test:** counter and per-slide labels agree after a dummy insert.
3. **Two-column layout CSS.** Add to `assets/styles.css`: `.split` (grid/flex 2-col), `.split
   .col-left`/`.col-right`, `.bubbles`, `.bubble.user`/`.bubble.assistant`, `.flow-arrow`,
   `.doc-pane` (fixed height, holds a 100%-size scrollable `<iframe>`). **Test:** a throwaway
   `.split` slide renders two columns with a working scrollable iframe pane.
4. **Part 1 build.** Reframe slides 1–2 (title/welcome/intro to two-scale axis); add Part 1 divider;
   convert phase slides 3–8 to `.split` with real transcript bubbles + arrow (left) and rendered-doc
   iframe + open-link (right); keep refactor + "how it really went". **Test:** 6 phase panes load
   the correct rendered docs; bubbles show real quotes.
5. **Bridge slide.**
6. **Part 2 build.** Part 2 divider + overview; 3 iteration `.split` slides each loading the correct
   per-iteration snapshot (571/891/907) inline + that iteration's rendered doc link-outs; tool/model-
   agnostic beat slide. **Test:** each iteration pane runs the right snapshot; link-outs resolve.
7. **Close reframe** to cover both builds.
8. **Speaker notes** (Deck 1 team-facing voice) for every new/changed slide.
9. **Reconcile pass.** Grep the deck for any remaining raw `.md` hrefs (→ none), any single-example
   copy (→ reframed), confirm all relative paths resolve.

## Testing Strategy

**Headless (scriptable, run in Verify):**
- **Offline guard:** grep `index.html`, all generated docs, and the 4 artifact snapshots for
  `http(s)://` resource loads and external `<script>/<link>` → expect none (links as content OK).
- **No raw `.md` links:** grep `index.html` for `href="...\.md"` → expect zero.
- **Slide count + numbering:** `section.slide` count ≈ 18–19; `.slide-number` labels sequential.
- **Path resolution:** every `href`/iframe `src` in `index.html` points to an existing file.
- **Per-iteration snapshot wiring:** iteration slide N references `iteration-N/pathfinding-race.html`.
- **Script idempotency:** run `render-cycle-docs.sh` twice → no git diff.

**Manual (Firefox, `file://`):** the key checkpoint — **iframe rendering of docs + artifacts on
`file://`**; slide navigation; bubble/arrow layout; scrollable panes. Fallback if `file://` iframes
are blocked: degrade panes to a static preview + prominent open-in-new-tab link (Pages unaffected).

## Acceptance Criteria

- [ ] **AC1 — Reframed:** title, welcome note, and intro express the single-iteration-simple →
  multi-iteration-complex axis; no copy implies a single example.
- [ ] **AC2 — Part 1 panes:** all 6 phase slides are two-column with real transcript bubbles + arrow
  (left) and a scrollable rendered-doc iframe + open-link (right).
- [ ] **AC3 — Part 2 built:** divider + overview + 3 iteration slides, each running the **correct
  per-iteration snapshot** inline with that iteration's rendered doc link-outs; tool/model-agnostic
  beat slide present.
- [ ] **AC4 — Markdown rendered:** zero raw `.md` links remain; every linked doc is a pandoc-rendered
  styled `.html`; `render-cycle-docs.sh` + `cycle-doc.css` committed and regenerate them idempotently.
- [ ] **AC5 — Numbering robust:** `.slide-number` labels auto-populate; bottom counter/dots correct.
- [ ] **AC6 — Offline guard green:** no remote resource loads in deck, generated docs, or artifacts.
- [ ] **AC7 — file:// verified:** doc + artifact iframes render in Firefox from `file://`, or the
  documented fallback is applied.
- [ ] **AC8 — Speaker notes:** every new/changed slide has team-facing (Deck 1 voice) notes.
- [ ] **AC9 — Navigation:** all slides reachable; counter/dots/progress correct end to end.

## Cross-deck note (deferred)

`assets/styles.css` + `assets/script.js` are the **shared starter, kept in sync across decks**.
This iteration edits Deck 2's copies (two-column classes + auto-numbering). Re-syncing the other
decks is **left to the post-cycle polish pass**, not this cycle.
