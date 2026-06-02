# Phase 3 — Research (Iteration 3)

For a pure restyle there are no packages to vet. Research here validated the two things that
could actually go wrong: the **palette's contrast on white**, and the **offline font strategy**.

## Palette validated with WCAG math (not by eye)

A contrast script (`tests/contrast.js`) checked every text/surface pair and every cell-state pair.

**Text/UI — all pass AA:**
- ink `#1d1d1f` on page `#f5f5f7` → 15.46:1; on white → 16.83:1
- secondary gray `#6e6e73` on white → 5.07:1 (≥ 4.5 AA body)
- white on accent `#0071e3` → 4.70:1 (button labels, ≥ 4.5)
- accent on white → 4.70:1 (≥ 3.0 for UI/large)

**Cell states vs white field — all perceptible** (start 2.22, goal 3.55, wall 16.83, open 1.90,
closed 1.28, path 1.51).

**Issue found & resolved (the payoff of checking):** the original gold path `#ffc400` and the
cyan frontier `#5ac8fa` were nearly **iso-luminant** (1.19:1) — a problem for reduced-colour
vision even though the hues differ. Iterating:
- darkening to amber `#f5a623` made it *worse* (1.07) — crossed below cyan's luminance;
- the correct direction was *brighter*. Settled on **`#ffd60a` (Apple systemYellow)**:
  open-vs-path **1.34**, visible on white **1.41**.

`#ffd60a` sits close to the light-gray *closed* state in luminance (1.11), but path and closed
are resolved by a **non-colour cue**: the final path is drawn last with a subtle inset ring/weight,
so it never depends on fill luminance alone (WCAG 1.4.1 — don't use colour as the only channel).
This also matches the intended "payoff" emphasis for the path.

### Final validated palette

| Token | Value |
|-------|-------|
| page background | `#f5f5f7` |
| card surface | `#ffffff` |
| ink (primary text) | `#1d1d1f` |
| secondary text | `#6e6e73` |
| hairline/separator | `#d2d2d7` |
| accent (interactive) | `#0071e3` |
| start | `#34c759` |
| goal | `#ff3b30` |
| wall | `#1d1d1f` |
| mud (weight dot) | `#ff9500` |
| frontier / open | `#5ac8fa` |
| visited / closed | `#dfe4ee` |
| final path | `#ffd60a` + inset ring |
| algorithm dots | bfs `#0a84ff` · dijkstra `#ff9f0a` · greedy `#ff375f` · astar `#30d158` |

## Offline font strategy (no web fonts)

- UI/body: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif`
  → renders **SF Pro on Apple devices**, system-ui elsewhere. No download, fully offline.
- Numerals/stats/pseudocode: `ui-monospace, "SF Mono", Menlo, Consolas, monospace` → SF Mono on
  Apple. The existing artifact already uses these stacks; no change needed for the font goal.
- Loading SF as a web font is rejected: violates offline/no-deps and is unnecessary.

## Technique decisions

- **Theming stays variable-driven.** Rewrite `:root` tokens; most rules inherit. This keeps the
  diff concentrated and preserves all class names the test suite asserts on.
- **Depth via box-shadow, not borders.** Soft diffuse shadows (e.g. `0 1px 3px rgba(0,0,0,.04),
  0 8px 24px -12px rgba(0,0,0,.12)`); large radii (~18px cards, ~10px controls). Remove the
  graph-paper `repeating-linear-gradient` body background and all glow/gradient effects.
- **Segmented control** for paint tools: a pill container with the active segment on white with a
  small shadow (CSS only; same buttons/IDs, so `setTool` and tests are unaffected).
- **Primary button** = filled blue pill; secondary = light-gray pill; toggle active = blue.
- **Class names preserved.** If any class must be renamed for styling, update the matching test
  selector in lockstep and keep the assertion intent. Plan to avoid renames entirely.
- **Reduced motion**: keep existing transition durations modest; respect the calm aesthetic.

## Security / offline posture

Unchanged. No new external resources (no web fonts, no CDNs), no new input, no `innerHTML`/`eval`.
The static security scan (8 checks) remains part of Verify and must stay clean.

## Deferred to Plan

- Exact shadow/radius/spacing scale values and where hairlines vs. shadows are used.
- Segmented-control markup approach that preserves existing button IDs.
- Order of edits to keep the regression suite green throughout.
