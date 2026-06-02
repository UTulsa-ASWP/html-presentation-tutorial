# Research — Iteration 2

*Phase 3 of `llm-dev:cycle`. Content mining + scrub audit (the stack is settled). All
findings verified against the real source files/transcripts.*

## Tech / Mechanics (settled, confirmed)

No tool selection — Deck 2 reuses the validated `starter/` and WebP captures. The only
new technical work is **embedding the explainer offline** and the distinction below.

### Offline reality of the embedded explainer (verified)
Grepped the explainer's three source files for resource loads vs. navigational links:
- **No remote resource loads**: zero `<link href=http>`, `<script src=http>`,
  `<img src=http>`, or `url(http…)` in the HTML. ✓
- **CSS**: the **only** remote thing is the **line-1 Google Fonts `@import`** → must remove
  (system-font fallback), exactly like the starter fix.
- **JS**: **zero network** — no `fetch`, `XMLHttpRequest`, dynamic `import()`. ✓
- **8 external `href` links** in the HTML are **navigational anchors** ("further reading":
  Apple ML, Google, US Census, arXiv, programming-dp, a DP-Tetris demo, etc.), all
  `target="_blank"`. These are **content, not resource loads** — the page renders 100%
  offline; the links simply won't resolve without internet (like the reveal.js pointer).

**Consequence for Verify:** the iter-1 offline guard (flag any `href=http`) is **too broad**
for Deck 2. Refine the guarantee to *"no remote resource loads required to render"* — i.e.
grep for `@import http`, `<link/script/img ... =http`, `url(http`, `fetch(` — and treat
`<a href=http>` as allowed content. Otherwise the embedded explainer trips a false alarm.

## Scrub Audit — Material To Be Published

Scanned everything that will be copied into the public repo.

### Cycle artifacts (6 `.md` files, copied in full) — CLEAN
- **No `/Users/` absolute paths, no emails, no real secrets.** The only "secret/token"
  grep hits are false positives: "design **tokens**" (CSS) and the DP narrative copy
  ("we already know his **secret**"). Safe to copy as-is.

### Transcripts (quoting short snippets only) — CLEAN / pre-sanitized
- Home-dir paths already appear as the **`<user>` placeholder** (the back-half transcript
  literally contains the "deploy-then-sanitize" step where that scrubbing was run).
- **No API keys, tokens, passwords, emails, or phone numbers** in the dialogue.
- We're quoting **short snippets**, not republishing transcripts wholesale → minimal surface.
  Spot-check each chosen quote at Execute time, but no redaction is required.

### Explainer source — CLEAN (only the `@import` to fix; links are content)
- No secrets/keys/emails. "secret" hits are narrative copy. `@import` handled above.

**Verdict:** the scrub pass is effectively a no-op for redaction — all first-party,
already-clean content. Still run a final grep over the repo before pushing (cheap guard).

## Content Mine — Key Moments Per Phase (verbatim, for slides)

From the 6 cycle artifacts (`CYB-4203-6203/workspace/cycle/iteration-1/`). Quotes are
copied exactly; trim/condition on-slide but don't misquote.

- **Review** — the constraint that forced everything: a same-day, server-free build.
  > "Must be ready by tomorrow… Single-session build." *(review.md)*
- **Brainstorm** — the foundational pivot: instructor-driven explainer over participatory
  multi-device demo.
  > "A well-designed interactive explainer can drive discussion as effectively as
  > participation" *(brainstorm.md)*
- **Research** — kill all dependencies; vanilla wins.
  > "Vanilla HTML/CSS/JavaScript in a single self-contained file. No framework, no build
  > step, no external JS libraries." / "Zero dependency risk." *(research.md)*
- **Plan** — split-file structure for targeted edits (self-contained artifact + wrapper).
  *(plan.md file-structure block)*
- **Execute** — built ~1,766 lines; found & fixed the epsilon-slider range bug.
  > "Narrowed to `min=-10 max=13`, giving a meaningful range of ε ≈ 0.1 to ε ≈ 20"
  > *(execute.md)*
- **Verify** — hands-on, human-verified in the browser.
  > "Status: COMPLETE — manually verified by user… hands-on in Chrome on macOS" *(verify.md)*

## Content Mine — The "Story of the Build" (for the intro + key-moment callouts)

From the two transcripts (lived process):

**Two sessions:** (1) deep DP-pedagogy design — an **8-act narrative arc** (Sweeney's
$20 voter-list re-identification, the Spartacus k-anonymity analogy, Dwork's 2006 DP
"revolution," real deployments, minority erasure as the dark side) brought by the user,
then brainstorm→research→plan→start-execute; (2) rapid execution under time pressure:
expansion 18→21 slides, interactive demos added, mid-flight refactor, deploy.

**Biggest key moments (for callouts):**
1. **Narrative-arc-first** *(Brainstorm)* — the pedagogy/story was decided before any
   slide; interactives were mapped onto the arc, not vice versa.
2. **Vanilla = zero dependency risk** *(Research)* — sophisticated interactivity (Laplace
   noise, live SVG histograms, sliders) in pure client-side JS, no build/CDN.
3. **Single-file → 3-file refactor** *(Execute)* — done mid-build as complexity grew; safe
   because IDs aren't referenced in JS and the slide counter auto-computes from
   `slideElements.length` (no hardcoded numbers to fix).
4. **Epsilon-slider bug fix** *(Execute)* — complete-but-pedagogically-broken → narrowing
   the range made the privacy/utility tradeoff actually teachable.

**Human direction quotes (humanize the narrative; verbatim):**
- Time pressure: *"we will just start editing the slide deck because I don't really have
  time to go back through another iteration."*
- Decisiveness: a one-word **"B"** chose the stronger slide ordering (insert k-anon demo,
  push the homogeneity reveal down as the "even this still fails" twist).
- A real-world gotcha worth a teaching aside: a **deploy-then-sanitize** `git reset --hard`
  wiped uncommitted edits, recovered from the already-deployed public copy.

## Decisions Handed To Plan

1. **Embed = verbatim copy** of `differential-privacy-explainer.html` + `assets/dp-explainer/`
   (styles.css, script.js, 9 images incl. the fair-use Time cover), with **one edit:
   remove the line-1 `@import`** (system fonts). Keep the 8 further-reading anchors.
2. **Copy the 6 cycle `.md` artifacts** into the repo (clean; for "read the originals" links).
3. **Refine the offline guard** to *resource loads only* (allow `<a href=http>` content).
4. **Repo locations** (propose; finalize in Plan): embedded explainer under
   `decks/02-worked-example/artifact/`; cycle artifacts under
   `decks/02-worked-example/cycle-artifacts/`.
5. **Slide content** is sourced — per-phase quotes + story-of-the-build moments above.
6. **Captures**: take a few WebP screenshots of the live explainer for slides (title +
   an interactive demo) so Deck 2 reads well even before the viewer clicks through.
