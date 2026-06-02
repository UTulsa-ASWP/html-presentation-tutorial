# Verify — Iteration 2 (Deck 2: "Worked Examples")

*Phase 6 of `llm-dev:cycle`. Independent confirmation — re-ran checks fresh (not trusting Execute's
self-report) and drove the deck in a real browser via a local HTTP server (= the GitHub Pages
scenario). Evidence below.*

## Method

- **Headless re-checks** re-run from scratch (greps, idempotency, path resolution).
- **Live browser render** in Chrome against `python3 -m http.server` serving the deck dir
  (`http://localhost:8731/`). Screenshotted the title, the intro, a Part 1 phase split slide, and
  all three Part 2 iteration slides; checked the console for errors.
- `file://` could **not** be driven (Chrome MCP rewrites `file://` → `https://file://`; confirmed
  the prior session's note). That one check is delegated to a Firefox pass — see AC7.

## Acceptance criteria — confirmed with evidence

- **AC1 Reframed — PASS.** Title slide renders the two-scale subtitle ("One cycle, two scales — a
  single-iteration interactive presentation and a multi-iteration complex artifact"); slide 2 "One
  cycle, two scales" shows the Part 1 (single-iteration presentation) vs Part 2 (multi-iteration
  artifact) callouts. No single-example copy remains (grep + visual).
- **AC2 Part 1 panes — PASS.** Slide 4 (Phase 1 · Review) renders two-column: left = INSTRUCTOR
  bubble (navy, verbatim quote with "tomorrow" bolded) + ASSISTANT bubble (cream); center = → arrow;
  right = "RENDERED REVIEW DOC" label over a **scrollable iframe showing the pandoc-rendered doc**
  (navy serif heading + gold rule + readable body: "Goal: Build an interactive demo… April 6, 2026
  (tomorrow)… differential privacy and federated learning"). Theme legible, scrollbar present.
- **AC3 Part 2 built — PASS.** All three iteration slides render two-column with the artifact
  **running live inline**: slide 14 Core Race (571 lines) — Pathfinding Race with Play/Step/Reset +
  Wall/Mud/Erase paint; slide 15 Study Mode (891) — Study/Pseudocode toggle + legend; slide 16
  Apple-style restyle (907, final). Each shows phase-tagged highlights (left) and a compact
  **cycle-docs link-out row** (Review/Brainstorm/Research/Plan/Execute/Verify ↗). Tool-agnostic beat
  present (slide 17, "Same cycle — any tool, any model").
- **AC4 Markdown rendered — PASS.** 0 raw `.md` links in `index.html` (grep). 28 docs rendered;
  `render-cycle-docs.sh` idempotent (identical aggregate hash on re-run). Fixed a cosmetic duplicate
  title this phase (pandoc title block + the doc's own `#` heading) by hiding `header#title-block-
  header` in `cycle-doc.css`; re-rendered and confirmed a single "Review — Iteration 1" heading in
  the pane.
- **AC5 Numbering — PASS.** Auto-numbered `.slide-number` badges observed correct on every slide
  visited: "02", "04", "14", "16", "17". Bottom counter tracks ("1/18" → "2/18" → "4/18" → "16/18"),
  dots present (18).
- **AC6 Offline guard — PASS.** 0 remote resource loads across `index.html`, the 28 generated docs,
  and the 4 artifact snapshots (grep for `https?://` in `src`/`<script>`/`<link>`). No console
  errors or exceptions during the live session.
- **AC7 file:// rendering — PASS.** Iframes (docs + artifacts) render over HTTP (the GitHub Pages
  scenario) AND over `file://` — **user confirmed in Firefox** the deck "works fine" opened straight
  from disk. This was the one item Chrome MCP couldn't auto-test (it rewrites `file://` → `https://
  file://`). The reason it works: the deck uses **iframe navigation, not `fetch()`/XHR** of local
  files (the latter is what browsers block under `file://`), and every embedded file is self-contained.
  No fallback needed.
- **AC8 Speaker notes — PASS.** 18/18 slides carry team-facing notes (grep `class="speaker-notes"`).
- **AC9 Navigation — PASS.** Scroll-snap, dot-jump, and `scroll_to` all move correctly; keyboard
  nav confirmed (ArrowRight advanced 16 → 17 once the page had focus). 18 slides reachable; chrome
  IDs intact.

## Issues found and fixed during Verify

1. **Duplicate doc title** in the rendered panes (pandoc title block duplicated the doc's own `#`
   heading) → hid `header#title-block-header` in `cycle-doc.css`, re-rendered. Confirmed fixed.

## Observations (not blockers)

- **Deck 1 has unrelated uncommitted changes** (`decks/01-llm-dev-cycle-tutorial/` — a `.cta-row`/
  `.cta-btn` feature + index.html edits). **Not part of this iteration** and not mine (deck assets are
  separate copies, not symlinks — confirmed). Any commit of this work must be **scoped to
  `decks/02-worked-examples/`** so Deck 1's in-flight work isn't swept in.
- Cross-deck sync of the shared `styles.css`/`script.js` edits (split layout + auto-numbering) is
  still deferred to the post-cycle polish pass, per Plan.
- Arrow-key nav needs the page focused (a click first); expected behavior, not a regression.

## Verdict

**All 9 acceptance criteria pass.** Live-rendered over HTTP (Pages scenario) and confirmed in Firefox
over `file://` (offline-local). No console errors, offline guard green, all artifacts and rendered
docs render live. The build meets the plan. Next: commit **scoped to `decks/02-worked-examples/`**
(leave Deck 1's unrelated in-flight changes untouched) and push the submodule.
