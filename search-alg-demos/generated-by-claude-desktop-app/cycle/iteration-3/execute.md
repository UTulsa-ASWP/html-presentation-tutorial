# Phase 5 — Execute (Iteration 3)

## What was built

`iteration-3/pathfinding-race.html` — the iteration-2 artifact restyled into a light,
Apple-style design. **Appearance only**; no JS, structure, control, mode, or algorithm change.
v2 left intact as a record.

Changes, all concentrated in `<style>` plus two tiny markup touches:
- **Palette:** rewrote `:root` to the validated light tokens — page `#f5f5f7`, white cards, ink
  `#1d1d1f`, secondary `#6e6e73`, accent `#0071e3`; cell states re-derived for white
  (start green, goal red, ink walls, orange mud, cyan frontier, light-gray visited, `#ffd60a`
  path + inset ring).
- **Surfaces/depth:** removed the graph-paper `repeating-linear-gradient` body, radial glow, all
  gradients and neon glows; cards now use large radius (18px) + soft diffuse shadow, hairlines
  only where needed.
- **Typography:** large light heading (40px), system (SF) stack, secondary-gray body, generous
  spacing/line-height. Eyebrow recolored to accent.
- **Controls:** paint tools wrapped in an Apple-style **segmented control** (`.segmented`,
  button IDs preserved); pill buttons; primary Play = filled blue pill; active toggle/thumbs =
  blue; custom range thumb. Study toggle emoji → clean "Study Mode" text.
- **Identity:** four algorithm hues reduced to small dots via `.pname::before` and thumbnail dots.
- **Study view:** light pseudocode card, accent active-line, accent-tinted narration in dark
  blue, blue node cursor + red neighbor cursor, accent focus-row in the table.

## Two markup touches (only non-CSS edits)

1. Wrapped the three existing paint buttons in `<span class="segmented">` — **IDs unchanged**.
2. Replaced the `📖` toggle label with text "Study Mode".

No JavaScript was modified.

## Tests (all green) — saved under `iteration-3/tests/`

| Suite | Scope | Result |
|-------|-------|--------|
| `i3_v2_verify.js` | inlined engine re-test + static security | 42/42 + 8/8 |
| `i3_v2_integration.js` | race behaviour unchanged | 20/20 |
| `i3_v2_study.js` | study behaviour unchanged | 26/26 |
| `i3_v2_verify_extra.js` | panel-click, blurb, cursors | 9/9 |
| `i3_style.js` | new style shipped + dark removed + IDs preserved | 31/31 |
| `contrast.js` | palette contrast (shipped values) | all pass |

**97 behaviour assertions + 8 static + 31 style + contrast — all pass.** The full v2 regression
suite passed unchanged against the restyled file, confirming the redesign is behaviour-neutral.

## Issue found and resolved

- **path vs closed luminance (1.11:1).** Brightening the path to `#ffd60a` (to separate it from
  the cyan frontier, per Research) brought it close in luminance to the light-gray *closed*
  state. This is the documented three-way squeeze. **Resolved by design, not by recolour:** the
  final path carries a non-colour **inset ring** (`box-shadow:inset 0 0 0 2px #d4a800`), so it's
  never distinguished by fill alone (WCAG 1.4.1). The shipped ring is asserted in `i3_style.js`;
  `contrast.js` was updated to document this relationship honestly rather than flag a false fail.
- No behavioural bugs — the regression suite stayed green at every step.

## Acceptance criteria results (vs. plan checklist)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | All 24 prior criteria pass (full v2 suite green) | **PASS** — 97/97 behaviour + 8 static |
| 2 | Light palette; no graph-paper/glow/gradient | **PASS** — style asserts old colors + texture removed |
| 3 | Single blue accent on interactive elements | **PASS** — tokens + style checks |
| 4 | Algorithm identity as small dots; chrome neutral | **PASS** — `.pname::before` + thumb dots |
| 5 | Cards: large radius + soft shadow, not borders | **PASS** — `box-shadow:var(--shadow)` asserted |
| 6 | SF type, larger/lighter heading, generous spacing | **PASS** — 40px heading, system stack |
| 7 | Segmented paint control; blue-pill Play | **PASS** — `.segmented` + wrap asserted |
| 8 | Cell states light palette; path non-colour cue | **PASS** — ring asserted |
| 9 | Study view cohesive in new style | Styled; **visual cohesion → Verify (human)** |
| 10 | Contrast passes | **PASS** — text AA; states distinguishable (path via ring) |
| 11 | Offline; no innerHTML/eval/fetch/URLs/web fonts | **PASS** — 8/8 static; system fonts only |
| 12 | No test-breaking id/class renames | **PASS** — all IDs asserted present; suite green |

## Honest handoff to Verify

Functional behaviour is fully green (regression unchanged). What automation can't judge — whether
the redesign actually *looks* light, clean, and elegant; visual cohesion of race + study views;
how the segmented control, shadows, and palette read on screen — is the deliverable's real point
and needs a human look in Verify.
