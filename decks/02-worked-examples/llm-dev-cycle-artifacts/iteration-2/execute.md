# Execute — Iteration 2 (Deck 2: "Worked Examples")

*Phase 5 of `llm-dev:cycle`. Built the two-part deck per `plan.md`. Self-reported below; the
adversarial confirmation (esp. `file://` iframe rendering in Firefox) is the Verify phase.*

## What was built

**Build steps 1–3 — foundation**
- `scripts/cycle-doc.css` — rendered-doc theme in the deck's real palette (cream card, navy
  headings, gold accents, serif/sans/mono), readability-tuned (max-width ~70ch, line-height 1.62).
- `scripts/render-cycle-docs.sh` — pandoc generator. Globs every `*.md` under the **two
  worked-example** `llm-dev-cycle-artifacts/` trees (NOT the deck's own meta-cycle), renders each to
  a sibling standalone, `--embed-resources` HTML. Parameterized (no hard-coded file list), idempotent.
- Ran it → **28 docs rendered** (6 DP + 21 search-alg + transcript). All self-contained.
- `assets/script.js` — `initSlides()` now **auto-numbers** each slide's `.slide-number` label from
  its index (`String(i+1).padStart(2,'0')`); slides without the label are skipped. Kills the
  stale-hardcoded-number class of bug before the restructure.
- `assets/styles.css` — added section **5b: worked-example split layout**: `.split` (3-col grid:
  left / arrow / right), `.bubbles`+`.bubble.user`/`.assistant`, `.highlights`+`.hl`, `.flow-arrow`,
  `.doc-pane` (fixed-height scrollable iframe), `.pane-label`, `.pane-link(s)`, `.split-slide p.intro`,
  plus responsive stacking (arrow rotates to ↓, panes shrink) at ≤760px.

**Build steps 4–8 — content** (`index.html` fully restructured, 11 → **18 slides**)
1. Title — reframed to the single-iteration-simple → multi-iteration-complex axis.
2. "One cycle, two scales" intro — the axis + taxonomy (both interactive; difference = how far the
   cycle is pushed).
3. **Part 1 divider** (title-slide) — "A Single-Iteration Interactive Presentation."
4–9. **Six phase slides**, each two-column: left = real instructor/assistant **bubbles** (verbatim
   user quotes from `condensed-transcript.md`, paraphrased assistant), → arrow, right = **scrollable
   iframe of that phase's rendered doc** + open-in-new-tab link.
10. Refactor key moment — kept, now anchored by the verbatim "break this up" quote (correctly placed
   here, not in Plan, per the source).
11. "How it really went" — kept.
12. **Bridge** — "Same cycle — more iterations, more complexity"; plants the tool note.
13. **Part 2 divider** (title-slide) — "A Multi-Iteration Complex Artifact"; Pathfinding overview +
   open-final-artifact link + "571 → 891 → 907 lines."
14–16. **Three iteration slides**, each two-column: left = phase-tagged **highlights**, → arrow,
   right = **the iteration's own snapshot running inline** (571 / 891 / 907) + compact link-outs to
   all six of that iteration's rendered cycle docs.
17. **Tool/model-agnostic beat** — "Same cycle — any tool, any model" (Part 1 = Claude Code, Part 2 =
   desktop app; runs the same in ChatGPT / any CLI / any LLM tool).
18. Close — reframed to cover **both** builds (links DP Explainer + Pathfinding Race + artifacts).

- **Speaker notes** rewritten in the team-facing (Deck 1) voice for all 18 slides.

## Bugs found and fixed during Execute

1. **pandoc parsed `$…$` as TeX math** → mangled real dollar amounts ("$20", "$55k") in the DP docs
   and emitted a conversion warning. **Fix:** `--from gfm-tex_math_dollars`. Re-rendered clean; dollar
   text now literal.
2. **Literal `A\*` in the Part 2 divider** would render a stray backslash. **Fix:** removed the
   backslash (HTML needs no escaping) → "A*".

## Decisions made while building

- **Iframes carry `loading="lazy"` + `title`** — avoids loading all 9 embedded files at once; named
  for accessibility. Left unsandboxed so the artifacts' own JS runs offline (our own local files).
- **Part 1 phase slides dropped their old long context paragraphs** — the bubbles + the visible
  rendered doc now carry that load, keeping each split slide uncluttered.
- **Dividers reuse the existing `title-slide` style** (no new CSS); Part 1/Part 2 are symmetric.

## Acceptance criteria — self-reported (Verify confirms independently)

- [x] **AC1 Reframed** — title/intro/welcome express the two-scale axis; no single-example copy remains.
- [x] **AC2 Part 1 panes** — all 6 phase slides two-column with real transcript bubbles + arrow +
  scrollable rendered-doc iframe + open link. *(visual render → Verify)*
- [x] **AC3 Part 2 built** — divider + 3 iteration slides each running the **correct per-iteration
  snapshot** (grep-confirmed iteration-1/2/3 wiring) + all six doc link-outs; tool-agnostic beat present.
- [x] **AC4 Markdown rendered** — 0 raw `.md` links (grep); 28 pandoc `.html` generated; script + CSS
  committed; idempotent (twice → identical hash).
- [x] **AC5 Numbering** — `.slide-number` auto-populates (14 content slides); counter/dots auto-compute.
  *(runtime render → Verify)*
- [x] **AC6 Offline guard** — 0 remote resource loads in index.html, generated docs, or artifacts (grep).
- [ ] **AC7 file:// verified** — **pending Verify** (Firefox `file://` iframe rendering; fallback ready).
- [x] **AC8 Speaker notes** — 18/18 slides have team-facing notes.
- [x] **AC9 Navigation** — 18 sections; counter fallback "1 / 18"; chrome IDs intact. *(runtime → Verify)*

## Headless evidence captured

- `section.slide` = 18 · `speaker-notes` = 18 · `title-slide` = 4 · `<iframe>` = 9 · `split-slide` = 9.
- iframe srcs: 6 DP phase docs + iteration-{1,2,3} snapshots (correct).
- raw `.md` links = 0 · remote loads = 0 · unresolved `.html` paths = 0.
- render script idempotent (identical aggregate hash on re-run).

## Carried to Verify

- **The** open item: confirm doc + artifact iframes render from `file://` in Firefox (Chrome MCP
  can't open `file://`). If blocked, apply the planned fallback (static preview + prominent open link;
  Pages is unaffected). Also eyeball: split layout fits ~100vh, bubbles/arrow read correctly, panes
  scroll, dark-on-cream doc theme is legible, auto-numbered labels are sequential.
