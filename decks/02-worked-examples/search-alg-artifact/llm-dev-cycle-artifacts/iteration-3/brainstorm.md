# Phase 2 — Brainstorm (Iteration 3)

## Chosen concept

A refined-minimalism **light redesign** in the spirit of Apple's product UI: calm neutral
surfaces, one restrained blue accent, generous whitespace, soft diffuse depth, and clean system
type. Appearance only — structure, controls, modes, and behaviour are untouched. Both the 4-up
race and Study Mode are restyled to feel cohesive and native-light.

## Decisions (locked)

**Approach:** restyle *with refinement* (not a recolour) — palette + spacing + typography +
radius + depth.

**Color discipline:** neutral UI with a single Apple-blue accent; the four algorithm hues
survive only as small **identity dots** beside titles/thumbnails.

**Surfaces & depth:**
- Page background: Apple off-white `#f5f5f7`.
- Content: white cards, large corner radius (~18px), soft **diffuse shadows** instead of borders.
- Hairline separators only where genuinely needed.
- Remove the graph-paper texture, glows, and gradients entirely.

**Accent:** Apple blue `#0071e3` for primary buttons, the active toggle, slider, focus rings, and
the active pseudocode line. Everything else neutral.

**Typography:**
- `-apple-system` stack (SF Pro on Apple devices) for UI/body; system **mono** (SF Mono) for
  numerals, stats, and pseudocode.
- Larger, lighter heading; comfortable body in Apple secondary gray `#6e6e73` on near-black ink
  `#1d1d1f`; generous line-height.

**Controls:**
- Rounded / pill buttons; primary "Play" is a filled blue pill.
- Paint tools (Wall / Mud / Erase) become an Apple-style **segmented control**.
- Minimal emoji; clean text labels.

**Cell-state palette — re-derived for a white background:**
| State | Color | Note |
|-------|-------|------|
| start | `#34c759` (green) | |
| goal | `#ff3b30` (red) | |
| wall | `#1d1d1f` (ink) | |
| mud (weight) | `#ff9500` (orange) | small dot marker |
| frontier / open | `#5ac8fa` (cyan) | the advancing edge |
| visited / closed | `#dfe4ee` (light cool gray) | calm, recedes |
| final path | `#ffc400` (gold) | the payoff |
| study cursor: node | blue ring | |
| study cursor: neighbor | red ring | |

In-grid story on white: a calm light-gray field of visited cells, a cyan advancing frontier, a
gold final path — legible and quiet.

## Alternatives considered and rejected

| Alternative | Why rejected |
|-------------|--------------|
| Recolour only | Would look like a recoloured dark UI, not a native-light Apple design |
| Single blue accent everywhere (no algorithm hues) | Loses the at-a-glance teaching color-code |
| Keep full per-algorithm accents throughout | Less strictly minimal; competes with the single-accent discipline |
| `prefers-color-scheme` dark variant | Tempting, but adds scope + a second palette to verify — deferred |
| Loading SF Pro as a web font | Violates offline/no-deps; unnecessary since `-apple-system` already renders SF on Apple devices |

## Scope boundaries

**In scope:** light palette; spacing/typography/radius/depth refinement; segmented paint control;
blue-pill primary; identity dots; re-derived cell-state palette; restyle of both race and study
views. Appearance only.

**Out of scope (deferred):** automatic dark mode (`prefers-color-scheme`); any layout-structure,
control, mode, or algorithm change; new features.

## Security-relevant boundaries

Unchanged. A pure CSS/markup-class restyle introduces no new input, network, or execution surface.
Discipline held: still no `innerHTML`/`eval`; any markup tweaks use `textContent`/DOM APIs. No new
external resources (no web fonts, no CDNs) — the offline single-file guarantee is preserved.

## Regression guard

The iteration-2 behaviour/class-based test suite (111 assertions) must keep passing unchanged —
it asserts classes, overlays, text, and search results, none of which the restyle should alter.
If a class name must change for styling, the corresponding test selector is updated in lockstep
and the assertion's intent preserved.
