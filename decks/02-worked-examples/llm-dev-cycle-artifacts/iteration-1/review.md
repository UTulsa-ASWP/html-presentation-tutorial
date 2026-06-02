# Review — Iteration 2

*Phase 1 of `llm-dev:cycle`. Leads with reflection on iteration 1, then scopes Deck 2.*

## Reflection on Iteration 1

**What worked (carry forward):**
- The **starter template is validated**. Deck 2 builds on it the same way: copy
  `starter/`, re-theme tokens, author slides. No re-derivation.
- **Static-then-live verification** was efficient — headless contract/offline/asset
  checks caught everything checkable; only true interaction needed a browser.
- **WebP q=80** is the right image format (20–28 KB, legible). Reuse for Deck 2
  screenshots/captures.
- **Authoring from verified patterns** (vs. copy-and-strip) produced a cleaner artifact.

**What to change / watch:**
- **Chrome can't load `file://`** (extension needs "Allow access to file URLs" in
  `chrome://extensions`; the navigate helper also force-prepends `https://`). For Deck 2's
  live check: enable that toggle, or verify in Firefox again (worked fine in iter 1).
- The two iteration-1 security flags are now **live obligations** for Deck 2 (below).

**Scope shift:** none — Deck 2 was always "the worked example." But its character differs
from Deck 1: **content-heavy, mechanics-light**. The work shifts from *building layout* to
*curating + scrubbing source material* (transcripts, artifacts, the live explainer).

## The Task (Deck 2)

Narrate **how the differential-privacy explainer was actually built** using the
`llm-dev:cycle`, drawing on the two session transcripts + the cycle artifacts, so the
team sees the method applied end-to-end before doing it solo.

### Decisions locked this phase (from Review gates)
1. **Narrative spine = hybrid.** Open with a 1–2 slide "story of the build" intro (what
   the viewer is about to see), then a **phase-by-phase walkthrough** (mirrors Deck 1's
   6 phases) with **before/after + key moments** highlighted throughout (the narrative-arc
   decision, the Laplace-noise research, the single-file → 3-file refactor, the bugs, the
   deploy).
2. **Show the artifact by EMBEDDING it.** Copy the DP explainer + its assets **into the
   `html-presentation-tutorial` repo** as a live, interactive artifact users open and play
   with throughout Deck 2 (e.g. Deck 2 links into it at the relevant phase).

## Source Material (from the iter-1 handoff + research, re-confirmed)

- **Two transcripts** (`CYB-4203-6203/.archive/transcripts/`): front half
  `20260408-grade-assignments-and-start-dp-presentation.json` (157 KB, brainstorm→
  research→plan + start of execute); back half
  `20260408-dp-explainer-deck-expansion-and-deploy.json` (87 KB, execute/refine, verify,
  deploy incl. the refactor). Structured JSON with `summary`, `participants`, messages.
- **Cycle artifacts** (`CYB-4203-6203/workspace/cycle/iteration-1/`, ~1000 ln):
  review 43 / brainstorm 114 / research 138 / plan 299 / execute 137 / verify 68 /
  handoff 197.
- **Live DP explainer**: `differential-privacy-explainer.html` (1009 ln) +
  `assets/dp-explainer/` (`styles.css` 1956, `script.js` 715, **9 images**).

## Constraints (Deck 2-specific)

- **Offline, self-contained** (unchanged core constraint) — applies to Deck 2 **and** to
  the embedded explainer copy, which currently has its **own Google Fonts `@import`**
  (CSS line 1) that must be removed/replaced for offline.
- **COPYRIGHT — escalated by the embed decision.** The explainer's assets include a
  **copyrighted Time magazine cover** (`1996-time-cover.jpg`), flagged in the original
  build for fair-use review and "do not republish publicly." Copying the explainer
  wholesale into a public GitHub repo *is* public republication. **Must be resolved before
  the copy** (see Gaps). Other images (Weld, Sweeney, GIC logo, 1996 era photos) may have
  their own provenance worth a quick check.
- **Transcript scrubbing** — raw logs may contain tokens, keys, internal paths, emails,
  PII. Scrub before any excerpt is published in Deck 2.
- **No emoji** in user-facing artifacts (workspace pref); typographic accents only.
- The shared repo stays **self-contained** (don't reference paths outside it).

## Candidate Structure (to refine in Brainstorm)

Hybrid spine, ~12–16 slides:
1. Title + "story of the build" (1–2): what the DP explainer is, that it was built with
   the cycle, and an invitation to open the live artifact.
2. Phase walkthrough (6 sections): for each cycle phase, *what it produced for this deck* —
   a real excerpt/artifact snippet + a "key moment" callout. Link into the live explainer
   at the phases where it pays off (Execute/Verify).
3. The refactor + deploy as a highlighted "key moment."
4. Close: "now you've seen it end-to-end — your turn" → hands to Deck 3 / solo practice.

## Gaps / Ambiguities to Resolve (Brainstorm/Research)

1. **Copyright decision (blocking the embed):** for the embedded explainer copy, do we
   (a) **replace** the Time-cover image with an owned/CC/public-domain substitute or a
   text placeholder, (b) drop that slide's image, or (c) something else? Default
   recommendation: **(a) substitute**, preserving the pedagogy without republishing
   copyrighted media. Confirm in Brainstorm.
2. **How much transcript to quote** — short illustrative excerpts vs. longer passages.
   Leaning short + scrubbed (also lighter to verify).
3. **Where the live explainer lives in the repo** — e.g. `decks/02-worked-example/artifact/`
   vs. a top-level `examples/`. Decide in Plan.
4. **Embed mechanism** — direct link from a Deck 2 slide (opens the explainer in a new
   view) vs. iframe. Leaning link (simpler, avoids scroll-snap-in-iframe quirks).
5. **Image provenance sweep** — quick check of the other 8 images before republishing.

## Recommended Narrowing

Hybrid-spine Deck 2 that **embeds a copyright-cleaned copy** of the DP explainer
(Time-cover substituted, Google Fonts removed) and uses **short scrubbed excerpts** from
the transcripts/artifacts to narrate each phase. Confirm the copyright handling and
excerpt depth in Brainstorm before building.
