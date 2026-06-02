# Brainstorm — Iteration 2

*Phase 2 of `llm-dev:cycle`. Built-in dialogue mode. Narrative spine + embed were
settled in Review; this phase locks wiring, excerpt depth, and the slide arc.*

## Chosen Concept

**Deck 2 — The Worked Example**: a hybrid-spine interactive deck that narrates how the
differential-privacy explainer was actually built with the `llm-dev:cycle`, backed by
**a live, embedded copy of the explainer** users open at key moments and **short scrubbed
excerpts** on-slide with the **full cycle artifacts copied into the repo** for deeper reading.

Built on the validated `starter/`, same as Deck 1.

## Locked Decisions

1. **Narrative spine = hybrid** (from Review): 1–2 slide "story of the build" intro →
   phase-by-phase walkthrough (6 phases, mirroring Deck 1) → before/after + "key moment"
   callouts throughout (narrative-arc decision, Laplace-noise research, single-file →
   3-file refactor, bugs found, deploy) → "your turn" close.
2. **Embed by link-out** (this phase): Deck 2 slides **link into the live explainer**
   (opens in its own view) at the phases where it pays off — e.g. "open the linkage-attack
   demo," "try the epsilon slider." The explainer runs in its native full-screen
   scroll-snap context; browser Back returns to the deck. **No iframe** — nesting two
   scroll-snap decks causes scroll/keyboard-capture conflicts (fragile; iter-1 reference
   noted scroll-snap quirks).
3. **Excerpt depth = snippets + full artifacts in repo** (this phase): short, curated,
   scrubbed quotes on slides (the pivotal line per phase); AND copy the 6 cycle-artifact
   `.md` files into the repo so viewers can read the originals in full.
4. **Time-cover image: include as-is** (user decision): fair-use in this educational
   context. Copy the explainer's assets **verbatim** — no substitution. The only change to
   the embedded copy is the offline fix (below), which is unrelated to copyright.

## What Gets Built / Copied Into The Repo

- `decks/02-worked-example/` — the Deck 2 slides (built on the starter) + any local
  screenshot/capture images (WebP, per iter-1).
- **Embedded explainer** — a verbatim copy of `differential-privacy-explainer.html` +
  `assets/dp-explainer/` (styles.css, script.js, 9 images) into the repo, with **one
  mechanical edit: remove the Google Fonts `@import`** (styles.css line 1) and rely on
  system-font fallbacks, so it runs fully offline like everything else.
- **Full cycle artifacts** — copies of the 6 `.md` files (review/brainstorm/research/
  plan/execute/verify; handoff optional) into the repo for "read the originals" links.

## Scope Boundaries

**In scope (Deck 2 / iteration 2):**
- Deck 2 slides (hybrid spine, ~12–16 slides), built on `starter/`.
- Embedded offline copy of the live explainer (verbatim assets + offline font fix).
- Copied + scrubbed cycle artifacts for deep-reading links.
- Short scrubbed transcript/artifact excerpts on slides.
- Update the **index** card for Deck 2 from "coming soon" → live link.

**Out of scope / deferred:**
- Rebuilding or modifying the explainer's interactivity (we embed it as-is, only the
  font fix).
- reveal.js (still a Deck 3 forward-pointer).
- Deck 3 (enrichment) — iteration 3.
- Heavy/long transcript reproduction (we quote short, link to fuller copies).

## Alternatives Considered & Rejected

- **Iframe-embedded explainer** — rejected: scroll-snap-in-scroll-snap keyboard/scroll
  conflicts; fragile. Link-out preserves the explainer's intended full-screen UX.
- **Screenshots only (no live embed)** — rejected by the Review gate (user chose a live,
  interactable copy — strongest "show don't tell").
- **Substitute the Time-cover image** — rejected by user (fair-use educational; include
  as-is).
- **Fuller on-slide transcript passages** — rejected: fights the minimal-on-screen-text
  design and adds scrub/verify load; snippets + full-artifact links serve both needs.

## Security / Trust Boundaries (carried forward, now concrete)

Low runtime surface (static, offline, no input/auth/network). Real **content-publication**
items for this iteration:
- **Scrub before publishing** — applies to BOTH the transcript excerpts AND the 6 copied
  cycle artifacts (they're internal working docs). Remove tokens, API keys, secrets,
  internal absolute paths, emails, and any PII. First-party content, so this is a
  scrub-not-permission task; do it as a dedicated pass in Research/Execute.
- **Offline guarantee extends to the embedded explainer** — remove its Google Fonts
  `@import`; then the repo-wide local-paths-only grep guard must still pass (the explainer's
  9 local image refs are fine).
- **Copyright** — Time cover included as-is per user (fair-use educational). Quick
  provenance note on the other images is informational only, not blocking.

## Open Items for Research/Plan

- Exact repo location for the embedded explainer (`decks/02-worked-example/artifact/` vs.
  top-level `examples/`) and for the artifact `.md` copies — decide in Plan.
- Which specific moments/quotes to feature per phase — mine in Research (read the
  artifacts + targeted transcript reads).
- Whether any transcript content fails the scrub check (forces redaction choices) — find
  in Research.
