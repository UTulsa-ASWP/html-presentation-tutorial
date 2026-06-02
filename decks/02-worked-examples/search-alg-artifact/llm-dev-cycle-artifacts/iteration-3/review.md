# Phase 1 — Review/Reflect (Iteration 3)

## Reflection on Iteration 2

**What worked — carry forward:**
- *CSS-variable palette + semantic structure.* Colors and surfaces are driven by `:root`
  variables and component classes, so a restyle localizes mostly to `:root` + a handful of
  rules — minimal JS/markup churn. This is the single biggest enabler for this iteration.
- *Behavior-based test suite as a regression guard.* The 111 assertions check classes, overlays,
  text, and search results — **not colours**. They should pass unchanged through a pure restyle,
  which makes them a precise alarm for accidental functional breakage.
- *Prototype/validate before committing; honest Execute→Verify handoff.* Keep both.

**Assumptions to revisit:**
- *The dark "instrument panel" aesthetic.* Iterations 1–2 committed to a dark, textured,
  glowing technical look. This iteration deliberately reverses that: light, airy, restrained.
- *Cell-state colours were tuned for a dark background.* On a light background the whole
  state palette (empty / wall / weight / start / end / open / closed / path, plus the study
  cursors) must be re-derived for contrast and calm. This is the main design risk.

**Carried-forward items:** none outstanding — iteration 2 closed all criteria; only the visual
look-and-feel was left to human judgment, which this iteration revisits wholesale anyway.

## New requirement (this iteration)

| # | Requirement | Reading |
|---|-------------|---------|
| R9 | Lighter, cleaner, simple & elegant — "a la Apple products" | Refined-minimalism redesign: light theme, generous whitespace, restrained colour, soft depth, clean type. Appearance only. |

**Constraints (unchanged):** single offline `.html`, no dependencies, no `innerHTML`/`eval`.
Note on fonts: we can't fetch web fonts offline, but the **system font stack renders as SF Pro on
Apple devices** (`-apple-system`) and system-ui elsewhere — which is exactly the Apple look,
for free and offline. Keep a system **mono** stack (SF Mono on Apple) for numerals/pseudocode.

## Scope

Pure visual redesign. **No** change to algorithms, controls, modes, or layout *structure*.
Both the 4-up race and Study Mode must look cohesive in the new style and keep every behaviour.
All 24 prior acceptance criteria (12 race + 12 study) must still hold.

## Gaps / ambiguities to resolve in Brainstorm

- **Surface palette:** pure white vs. Apple's off-white (`#fbfbfd`/`#f5f5f7`); card elevation
  via soft shadow vs. hairline borders.
- **Accent:** single Apple-blue accent (`#0071e3`-ish) vs. keeping muted per-algorithm accents.
- **How much to strip:** remove the graph-paper texture, glows, and gradients? (Almost certainly
  yes — they're the antithesis of the target.)
- **Cell-state palette on light:** re-derive all states for contrast/calm; pick Apple-system-like
  hues (systemGreen/Red/Blue/Orange/Teal). The biggest craft decision.
- **Typography:** larger, lighter headings; comfortable body size; generous line-height/spacing.
- **Depth language:** subtle, diffuse shadows and large corner radii vs. flat.
- **Optional/stretch:** `prefers-color-scheme` dark variant (Apple-style apps often ship both).

## Candidate approaches (for Brainstorm)

- **A) Recolour only.** Swap `:root` vars to a light palette; keep everything else. Fast, lowest
  risk, but risks looking like a recoloured dark UI rather than a native-light design.
- **B) Restyle with refinement (recommended).** Light palette **plus** Apple-grade spacing,
  typography scale, corner radius, and soft depth — the things that actually make it feel Apple,
  not just lighter. Still appearance-only; structure intact.
- **C) B + dark-mode auto-switch** via `prefers-color-scheme`. Most polished, most surface area.

Recommendation: **B** — recolouring alone won't read as "elegant, Apple-like"; the whitespace,
type, and depth refinements are what sell it. C is a tempting stretch but adds scope and a second
palette to verify.
