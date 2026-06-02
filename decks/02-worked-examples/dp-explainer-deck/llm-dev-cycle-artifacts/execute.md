# Execute — Iteration 1 (DP Artifact)

## Summary

Built a self-contained 1,766-line interactive HTML artifact (`course_materials/demos/differential-privacy-explainer.html`) teaching differential privacy fundamentals through an 8-act narrative structure, plus a course-website wrapper page (`website/demos/differential-privacy-explainer/index.html`). All four planned interactive elements work correctly and have been verified via Chrome automation against a local preview.

**Deployment status**: Dry-run succeeded. Real deploy deferred pending additional work in the iteration.

## What Was Built

### File 1: `course_materials/demos/differential-privacy-explainer.html` (1,766 lines)

Single self-contained HTML file with inline CSS and JavaScript. No build step, no framework, no external JS dependencies (only Google Fonts, matching the existing course demo pattern, with proper system-font fallbacks).

**Structure**:
- CSS design system with typography, color tokens, layout primitives (~500 lines)
- 8 `<section class="act">` elements, one per narrative act (~600 lines)
- Inline `<script>` with datasets, utility functions, and all interactive handlers (~660 lines)

**The 8 acts**:

| Act | Title | Content | Interactive? |
|-----|-------|---------|--------------|
| I | The Illusion of Invisibility | Incognito mode placebo hook | Static |
| II | Patient Zero | Latanya Sweeney / Governor Weld re-identification | **Yes — live linkage attack** |
| III | The Spartacus Strategy | k-anonymity and homogeneity attack | **Yes — dataset transformation** |
| IV | The Revolution | Differential privacy, frosted glass, epsilon budget | **Yes — epsilon slider + histogram** |
| V | DP in the Wild | Apple, Google, 2020 Census, SMPC | Static + external links |
| VI | The Dark Side | Minority erasure, Matthew effect, clipping | **Yes — minority erasure visualization** |
| VII | Law, Theater, and Trust | Quebec Law 25, privacy theater, trust gap | Static |
| VIII | The Reframe | Privacy as a dial, not a switch | Static |

### Interactive Element 1 — Act II: Linkage Attack

Two side-by-side tables (Anonymized Medical Records / Cambridge Voter Registration) with 20 and 30 rows respectively. Three filter buttons progressively narrow the visible rows: birth date → gender → ZIP. The datasets were carefully crafted so that the filter sequence matches the podcast narrative exactly:

- After birth filter: 20 → 6 rows on both sides
- After gender filter: 6 → 3 rows on both sides
- After ZIP filter: 3 → 1 row on both sides — reveals Governor William F. Weld's hypertension

Verified in browser via automated filter sequence.

### Interactive Element 2 — Act III: k-Anonymity Transformation

Three discrete buttons (k=1, k=3, k=5) that swap the dataset between raw, partially generalized, and fully generalized states. The data was designed so that at k=5:

- Five males in the "30–40, 021**, M" group all share "Heart Disease" diagnosis (homogeneity attack)
- Five females in the "40–60, 021**, F" group have varied diagnoses (protected)
- Two outliers (ages 72 and 104) are suppressed

The "Reveal Homogeneity Attack" button activates only at k=5 and highlights the vulnerable group with an explanation.

Verified: at k=5, exactly 5 rows show homogeneous Heart Disease in the first group, and the reveal button highlights them correctly.

### Interactive Element 3 — Act IV: Epsilon Slider + Histogram

The central pedagogical exhibit. An SVG histogram showing a synthetic salary distribution (10 bins, 1,000 people) with:

- Privacy budget slider mapping integer positions to ε via log scale: slider −10 → ε=0.1, slider 0 → ε=1.0, slider 13 → ε≈20
- Laplace noise applied client-side to each bucket count: `noise = -scale * sign(u) * ln(1 - 2|u|)` where scale = sensitivity/ε
- Ghosted true bars + solid noisy bars for comparison
- Three stat boxes: true mean, noisy mean, privacy error (signed delta)
- Dynamic interpretation text at threshold values (strong privacy / balance point / leaning utility / weak privacy)
- Re-roll button that draws fresh random noise to demonstrate the randomness
- CSS `backdrop-filter: blur()` overlay that scales inversely with ε (the "frosted glass" visual motif from the podcast)

Verified across the full slider range:

- At ε=0.1: mean error ~$634, "Strong privacy" interpretation
- At ε=1.0: mean error ~$160, "Balance point" interpretation
- At ε=19.95: mean error ~$0, "Weak privacy" interpretation

### Interactive Element 4 — Act VI: Minority Erasure

A horizontal bar chart of a mock town with 5 demographic groups: majority (950) + minorities (12, 7, 5, 3). Shares the same epsilon slider pattern as Act IV. Reports `max(0, round(trueCount + laplaceNoise))` for each group. When a noisy count reaches 0, the bar visually collapses to red and the label gets a strikethrough with an "ERASED" annotation.

Verified via empirical re-roll testing:

- At ε=0.1 across 20 re-rolls: 23 erasures observed (majority never erased; minorities erased 16–47% of the time — matching the Node.js test results)
- At ε=19.95 across 20 re-rolls: 0 erasures (all groups stable)

The stats row reports the current erased count and updates on every slider change or re-roll.

### File 2: `website/demos/differential-privacy-explainer/index.html` (~230 lines)

Course-website wrapper page following the exact pattern of the existing `data-control-vulnerability` demo wrapper. Includes:

- Full course navigation chrome (header, nav links)
- Hero section with course branding
- Window-titlebar decoration around the iframe (three-dot window controls, title, fullscreen link)
- Iframe pointing to `../../course_materials/demos/differential-privacy-explainer.html`
- "Course Context" section listing Unit 8, Presentation 17, key concepts, interactive elements, and podcast source attribution
- Course footer with copyright

## Bugs Found and Fixed During Execution

### Bug 1: Slider range too wide

**Problem**: Initial slider range was `min=-10 max=30`, which at the top end mapped to ε=1000 (meaningless — no privacy at that level but also no practical utility difference from ε=20).

**Fix**: Narrowed to `min=-10 max=13`, giving a meaningful range of ε ≈ 0.1 to ε ≈ 20 that aligns with the plan's specification and the pedagogical thresholds (0.5, 2, 10) used in the interpretation text.

### Bug 2 (non-blocking): True salary mean doesn't match plan description

**Problem**: The plan document described the synthetic salary distribution as "mean=$55k" but the bin counts I used actually yield a true mean of **$59,400**. This is a plan-vs-code inconsistency, not a code bug.

**Resolution**: Left as-is. The artifact computes and displays the true mean dynamically, so students see the correct number. The plan's description was imprecise, but the demo is internally consistent.

## Acceptance Criteria Results

Running against the checklist from `plan.md`:

| Criterion | Result |
|-----------|--------|
| Artifact file exists, self-contained, has all 8 acts | **Pass** — 1,766 lines, all 8 `<section class="act">` elements verified |
| All 4 interactive elements function correctly | **Pass** — all four verified in Chrome automation |
| Wrapper page exists and iframes the artifact | **Pass** — loads, correct title, correct iframe src, full course chrome |
| Narrative tracks the podcast progression | **Pass** — each act's copy lifts directly from the podcast arc extracted in the brainstorm phase |
| Loads in Chrome on macOS | **Pass** — verified via Chrome MCP |
| Loads in Safari on macOS | **Not tested yet** — Safari verification deferred to Verify phase |
| No console errors on load | **Pass** — `read_console_messages` returned zero errors |
| No external JS dependencies | **Pass** — only Google Fonts CSS import (matches existing course demo pattern); zero JS libraries |
| Laplace noise computed client-side (verified via re-roll) | **Pass** — re-roll produces different values on every click |
| Epsilon slider produces visible, continuous changes | **Pass** — verified across 3 slider positions with quantitative output |
| Deployed to public website | **Deferred** — dry-run passed, real deploy held pending further iteration work |
| Synthetic/mock data only | **Pass** — all datasets are fabricated; the "William F. Weld" record is a historical reference with a public diagnosis known from the Sweeney 1997 incident |

## Notes for Verify Phase

Remaining verification work to do:

1. **Safari compatibility check** — the existing course demo pattern works in Safari, but this file uses `backdrop-filter` which has had partial support historically; confirm the frosted glass effect renders (or degrades gracefully) in Safari
2. **Visual inspection of each section** — automated tests confirmed functional behavior, but a human-visible walkthrough to check layout, typography, and transitions is still needed
3. **Re-roll UX** — verify that clicking "Re-roll Noise" on Act IV and Act VI is visibly satisfying (bars should animate/jump, not just silently update)
4. **External links in Act V** — confirm the DP Tetris and CT Census links open in a new tab
5. **Content review** — sanity-check the narrative copy for typos, unclear phrasing, or factual errors (the 87% Sweeney statistic, the 1945-07-31 birth date, the Quebec Law 25 figures)
6. **Overall flow** — read through from top to bottom as a student would and note any pacing issues
