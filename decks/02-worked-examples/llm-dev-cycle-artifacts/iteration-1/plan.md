# Plan — Iteration 2

*Phase 4 of `llm-dev:cycle`. Built-in plan mode. Self-contained.*

## Scope of THIS Iteration

Ship, fully verified, to the shared repo:
1. **Deck 2 — The Worked Example** (hybrid-spine interactive deck, built on `starter/`).
2. An **embedded, offline copy of the live DP explainer** users open at key moments.
3. **Copies of the 6 cycle artifacts** for "read the originals" links.
4. A few **WebP screenshots** of the explainer for slides.
5. **Index updated**: Deck 2 card "coming soon" → live link.

**Deferred:** Deck 3 (enrichment + reveal.js pointer) → iteration 3.

## Settled Decisions (from Review/Brainstorm/Research + this phase)

- **Narrative spine = hybrid**: story-of-the-build intro (1–2 slides) → 6-phase
  walkthrough → before/after + key-moment callouts → "your turn" close.
- **Embed = link-out** to a verbatim copy of the explainer (no iframe).
- **Excerpts = short scrubbed snippets on slides + full artifacts copied into the repo.**
- **Time-cover image included as-is** (user: fair-use educational). Assets copied verbatim.
- **One mechanical edit to the embedded explainer**: remove the line-1 Google Fonts
  `@import` (system fonts). Keep the 8 further-reading anchors (content, not resource loads).
- **Repo layout = nested under Deck 2** (this phase's gate).
- **Scrub = effectively a no-op** (Research verified all material clean/pre-sanitized);
  still run a final repo grep before pushing.

## Target File Structure (additions to the shared repo)

```
html-presentation-tutorial/
├── index.html                          # EDIT: Deck 2 card → live link
└── decks/
    └── 02-worked-example/
        ├── index.html                  # Deck 2 slides (built on starter)
        ├── assets/
        │   ├── styles.css              # starter styles (+ any Deck-2 additions)
        │   ├── script.js               # starter nav (unchanged)
        │   └── img/                    # WebP screenshots of the explainer
        ├── artifact/                   # the embedded live explainer (verbatim copy)
        │   ├── differential-privacy-explainer.html
        │   └── assets/dp-explainer/    # styles.css (@import removed), script.js, 9 images
        └── cycle-artifacts/            # the 6 source .md files (clean copies)
            ├── review.md  brainstorm.md  research.md
            └── plan.md    execute.md     verify.md
```

## Build Sequence (ordered)

### Step 1 — Copy the embedded explainer + apply the offline fix
1. Copy `differential-privacy-explainer.html` + `assets/dp-explainer/` (all 9 images,
   styles.css, script.js) into `decks/02-worked-example/artifact/`.
2. **Remove the line-1 `@import`** from the copied `styles.css`; rely on the existing
   system-font fallbacks already in its `--serif/--sans/--mono` tokens.
3. Verify the copy renders offline: no remote resource loads (grep for
   `@import http`/`<link|script|img …=http`/`url(http`/`fetch(` → none), 9 images present.
**Done when**: the copied explainer opens via `file://`, fonts fall back cleanly, no
remote resource loads, interactivity intact (it's verbatim JS).

### Step 2 — Capture screenshots for slides
4. Open the embedded explainer and capture 2–4 frames (title; an interactive demo such as
   the linkage-attack table or epsilon slider). Save as WebP (per iter-1) into
   `decks/02-worked-example/assets/img/`, ≤~200 KB each.
   - If browser capture isn't available this session, fall back to a documented manual
     capture step or proceed with text-forward slides + link-outs (note the gap).
**Done when**: screenshots exist locally and are legible, OR the gap is explicitly logged.

### Step 3 — Copy the cycle artifacts
5. Copy the 6 `.md` files from `CYB-4203-6203/workspace/cycle/iteration-1/` into
   `decks/02-worked-example/cycle-artifacts/` (review, brainstorm, research, plan,
   execute, verify). Handoff optional — skip unless it adds value.
6. Quick grep over the copies (paths/emails/secrets) — Research says clean; confirm.
**Done when**: 6 clean `.md` files in place; grep clean.

### Step 4 — Build Deck 2
7. Copy `starter/assets/{styles.css,script.js}` into the deck (same base as Deck 1).
8. Author `index.html` — hybrid spine, ~12–16 slides:
   - **Intro (1–2)**: title + story-of-the-build (what the explainer is, that it was built
     with the cycle, invitation to open the live artifact). Use a screenshot.
   - **6 phase slides**: for each phase, the verbatim key-moment quote (from research.md)
     + a "key moment / before-after" callout. Link into the live explainer at the phases
     where it pays off (Execute → "open the linkage demo / epsilon slider"; Verify →
     "click through it yourself"). Link to the matching `cycle-artifacts/<phase>.md` for
     "read the full phase doc."
   - **Key-moment highlights** woven in: narrative-arc-first, vanilla = zero-dependency,
     the single-file → 3-file refactor, the epsilon-slider bug fix, deploy-then-sanitize
     gotcha. Humanizing user quotes ("…don't really have time to go back through another
     iteration", the one-word "B").
   - **Close**: "you've seen it end-to-end — your turn" → points to Deck 3 / solo practice.
   - Speaker notes on every slide. Relative links only (`artifact/…`, `cycle-artifacts/…`).
9. Validate (headless): slide/notes counts, JS↔HTML contract IDs, counter matches,
   every local img/link target resolves on disk.
**Done when**: Deck 2 structure validates; all intra-repo links resolve.

### Step 5 — Update the index
10. Edit root `index.html`: Deck 2 card from "coming soon" → `href="decks/02-worked-example/index.html"`,
    drop the "In progress" badge, mirror Deck 1's live-card styling.
**Done when**: index links Deck 2 live; Deck 3 still stubbed.

### Step 6 — Verify, commit & push
11. Browser smoke test (Firefox, or Chrome if `file://` enabled): Deck 2 plays through,
    nav + notes work, links open the explainer and artifacts, console clean. Open the
    embedded explainer and exercise one interactive to confirm the verbatim copy works.
12. Final repo-wide **resource-load** grep guard (refined — see below).
13. Commit + push the submodule to `origin main`; re-point the parent submodule commit
    (local only).
**Done when**: all acceptance criteria pass; shared `main` has Deck 2 + artifact;
fresh clone runs offline.

## Refined Offline Guard (carried from Research)

The iter-1 guard flagged any `href=http`; that's **too broad** here — the explainer has 8
legitimate `<a href=http target="_blank">` further-reading links (content, not resource
loads). The guarantee is **"no remote resource loads required to render."** Check:

```sh
grep -rnE "@import[^;]*https?://|<link[^>]*href=[\"']https?://|<script[^>]*src=[\"']https?://|<img[^>]*src=[\"']https?://|url\([\"']?https?://|fetch\(" \
  decks/02-worked-example/ index.html
```

Expected: **none**. Plain `<a href=http>` anchors are allowed (like the reveal.js pointer).

## Testing Strategy

Same as iter-1: no automated suite (static content + lifted nav). Verification =
**browser smoke test + headless guards**:
- Open Deck 2 + the embedded explainer via `file://` (true offline).
- Walk every slide; keyboard nav + `S`/`Esc`; click each link-out (explainer + artifacts).
- Exercise one explainer interactive (proves the verbatim copy + `@import` removal didn't
  break it).
- Console error-free; **no remote resource loads** in the Network tab (anchors un-clicked).
- Refined resource-load grep clean; all intra-repo links resolve on disk.

## Security / Hardening Checklist

- [ ] **No remote resource loads** in Deck 2 or the embedded explainer (refined grep).
- [ ] **`@import` removed** from the copied explainer CSS; system fonts render.
- [ ] **Scrub confirmed** — final grep over copied artifacts + any transcript snippets
      (paths/emails/secrets). Research says clean; re-confirm before push.
- [ ] **Copyright** — Time cover included per user (fair-use educational); other 8 images
      are first-party/era photos copied as-is. No new licensing action.
- [ ] **Snippets, not wholesale** — transcripts are quoted short; not copied into the repo.

## Acceptance Criteria (Iteration 2)

1. [ ] Embedded explainer copied verbatim (9 images, JS) with **`@import` removed**;
       opens offline; interactivity intact.
2. [ ] No **remote resource loads** anywhere in `decks/02-worked-example/` (refined grep);
       `<a href=http>` further-reading anchors allowed.
3. [ ] 6 cycle artifacts copied, clean (scrub grep passes).
4. [ ] **Deck 2** plays start→finish offline: story intro + 6 phase slides (each with a
       sourced quote + callout) + close; speaker notes on every slide.
5. [ ] Deck 2's **link-outs resolve**: each opens the live explainer / the right artifact
       `.md`; the explainer link lands in its full-screen view.
6. [ ] Screenshots present + legible (or the capture gap explicitly logged).
7. [ ] Console clean; no remote resource requests in DevTools (links un-clicked).
8. [ ] **Index** updated: Deck 2 live link, Deck 3 still "coming soon".
9. [ ] Pushed to shared `main`; fresh `--recurse-submodules` clone runs Deck 2 + explainer
       offline with no setup.

## Risks & Fallbacks

- **Screenshot capture unavailable** (Chrome `file://` blocked this session) — fall back to
  Firefox capture, or ship text-forward slides + link-outs and log the gap for a follow-up
  (non-blocking; the live explainer is one click away regardless).
- **`@import` removal shifts the explainer's look** — acceptable (same system-font
  rationale as the starter); if it's jarring, local WOFF2 vendoring is the documented
  upgrade path (deferred).
- **A link-out path typo** — caught by the Step-4/Step-6 "links resolve on disk" check.
- **Embedded explainer interactivity regressed** by the copy — exercise one interactive in
  Verify; the JS is verbatim so risk is low.
