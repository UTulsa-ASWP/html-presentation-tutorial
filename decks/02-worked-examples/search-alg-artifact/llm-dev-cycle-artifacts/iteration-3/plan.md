# Phase 4 — Plan (Iteration 3)

Self-contained plan to restyle `pathfinding-race.html` into a light, clean, Apple-style design.
**Appearance only** — no change to structure, controls, modes, algorithms, or class names. The
iteration-2 behaviour suite (111 assertions) is the regression guard and must stay green
throughout.

## Deliverable

`iteration-3/pathfinding-race.html` — evolved from the iteration-2 file (copied in as baseline;
v2 left intact as a record).

## Strategy

Concentrate the change in CSS: rewrite the `:root` token block and the component rules, remove
the dark-theme texture/glow/gradient effects, and add the segmented-control + soft-depth styling.
Touch markup only where a class/wrapper is needed for the segmented control or identity dots —
**without renaming any existing id/class** the tests rely on. JS untouched.

## Build sequence (each ends in a regression check)

**Step 1 — Baseline + token swap.**
Copy v2 → iteration-3. Replace `:root` variables with the validated light palette (page, card,
ink, secondary, hairline, accent, and re-derived cell-state colors incl. path `#ffd60a`).
_Check:_ file opens; re-run the full v2 suite against the iteration-3 file (paths repointed).
Must stay green (palette change can't affect behaviour/classes).

**Step 2 — Body + surfaces.**
Remove the graph-paper `repeating-linear-gradient` body background and radial glow → flat
`#f5f5f7`. Convert panels/cards/bars to white + large radius + soft diffuse shadow (drop borders
to hairlines where needed). Remove glow/gradient on headings and buttons.
_Check:_ re-run suite (green); visual self-check of structure via class presence.

**Step 3 — Typography + spacing.**
Apply the heading/body type scale, secondary-gray body text, generous line-height and padding.
Keep the existing `-apple-system` / `ui-monospace` stacks (already Apple-correct).
_Check:_ suite green.

**Step 4 — Controls: segmented paint control + pill buttons + accent.**
Wrap the three paint-tool buttons in a segmented-control container (CSS + a wrapper element only;
**ids `tool-wall`/`tool-weight`/`tool-erase` preserved**). Primary "Play" → filled blue pill;
secondary → light pill; `studytoggle` active → blue; slider accent → blue; focus rings → accent.
_Check (critical):_ re-run suite — the segmented wrapper must not break tool selection,
`aria-pressed`, or any selector. Green required before proceeding.

**Step 5 — Cell states + grid + study cursors.**
Restyle `.cell` states to the new palette on white; add the path inset-ring (non-colour cue);
recolour study `.pl.active` to accent, `.cur-node` to blue ring, `.cur-nb` to red ring; identity
dots use the algorithm-dot colors. Grid gridlines → hairline on white.
_Check:_ suite green (class-based assertions unaffected); confirm `.cell.path`, `.cell.open`,
`.cell.closed`, `.cur-node`, `.cur-nb` still apply.

**Step 6 — Polish + full regression + static security.**
Hairline/shadow consistency pass, segmented-control active styling, hover/active states, legend
swatches updated to match new palette, spacing rhythm. Then the **entire suite + contrast +
static security scan**.
_Check:_ all green; no `innerHTML`/`eval`/`fetch`/external URLs; contrast still passes.

## Testing strategy

- **Regression (primary):** the v2 suite — engine, oracle equivalence, race integration, study
  integration, gap-closing — re-run against the iteration-3 file after **every** step. The
  restyle must not change a single assertion. This is the core safety net.
- **Palette:** `contrast.js` re-run to confirm the shipped values match the validated palette.
- **Static/security:** re-grep for `innerHTML`/`eval`/`new Function`/`fetch`/external URLs.
- **Human visual:** appearance/elegance is the actual deliverable and only a person can judge it
  → explicit hand-off in Verify (as in prior iterations).

## Boundaries / risks

| Risk | Handling |
|------|----------|
| Segmented-control wrapper breaks tool selection | Preserve button ids/handlers; wrapper is presentational; re-run suite at Step 4 |
| A class rename for styling breaks a test selector | Avoid renames; if unavoidable, update the test selector in lockstep, preserve intent |
| Light cell states too low-contrast | Already validated in Research; path uses a non-colour ring cue |
| Accidental JS edit changes behaviour | JS is out of scope this iteration; diff stays in `<style>` + minimal markup |

## Acceptance criteria checklist

1. [ ] All 24 prior acceptance criteria (12 race + 12 study) still pass — full v2 suite green.
2. [ ] Page uses the light palette: `#f5f5f7` page, white cards, no graph-paper/glow/gradient.
3. [ ] Single blue accent (`#0071e3`) on primary button, active toggle, slider, focus, active
       pseudocode line; UI otherwise neutral.
4. [ ] Algorithm identity survives as small colored dots; UI chrome is otherwise neutral.
5. [ ] Cards use large radius + soft diffuse shadow (not borders); hairlines only where needed.
6. [ ] Typography: system (SF) stack, larger/lighter heading, secondary-gray body, generous
       spacing.
7. [ ] Paint tools render as a segmented control; Play is a filled blue pill.
8. [ ] Cell states use the validated light palette; final path has a non-colour ring cue.
9. [ ] Study view (pseudocode, narration, cursors, table) is cohesive in the new style.
10. [ ] Contrast checks pass (text AA; states distinguishable).
11. [ ] Still offline single file; no `innerHTML`/`eval`/`fetch`/external URLs/web fonts.
12. [ ] No id/class renames that break tests (or selectors updated in lockstep).
```
