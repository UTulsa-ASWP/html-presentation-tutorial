# Plan — Iteration 1 (DP Artifact)

## Goal

Build a self-contained interactive HTML artifact teaching the fundamentals of differential privacy, following the 8-act progression from the Rapid Synthesis / NotebookLM podcast. Deploy to the public course website before class on April 6, 2026.

## File Structure

```
course_materials/demos/
  differential-privacy-explainer.html          # The artifact (self-contained, ~1500-2000 lines)

website/demos/
  differential-privacy-explainer/
    index.html                                 # Wrapper page with course chrome (iframes the artifact)
```

## Artifact Structure (inside differential-privacy-explainer.html)

The artifact is a single scrolling page with 8 sections (acts). Each section is a `<section>` element. The user scrolls (or clicks "Next") through them linearly during class.

```
<html>
  <head>
    <style>
      /* inline CSS — ~300-500 lines */
      /* Styling matches course aesthetic; clean academic look with accent color */
    </style>
  </head>
  <body>
    <header>
      <!-- Title, subtitle, progress indicator -->
    </header>
    <main>
      <section id="act-1-illusion">      <!-- Static -->
      <section id="act-2-sweeney">        <!-- Interactive: linkage attack -->
      <section id="act-3-k-anonymity">    <!-- Interactive: dataset transformation -->
      <section id="act-4-dp-mechanism">   <!-- Interactive: epsilon slider -->
      <section id="act-5-in-the-wild">    <!-- Static + external links -->
      <section id="act-6-dark-side">      <!-- Interactive: minority erasure -->
      <section id="act-7-law-theater">    <!-- Static -->
      <section id="act-8-reframe">        <!-- Static -->
    </main>
    <footer>
    <script>
      /* inline JS — ~500-800 lines */
      /* Laplace sampling, filter functions, chart drawing, state management */
    </script>
  </body>
</html>
```

## Build Sequence

### Step 1: Scaffold (30 min)

- Create `course_materials/demos/differential-privacy-explainer.html` with the skeleton: doctype, head, style block, all 8 `<section>` tags with placeholder content, body, script block
- Set up CSS design tokens: colors, typography, spacing
- Create a reusable section layout (heading, narrative paragraph, optional interactive container)
- Add simple scroll-based progress indicator

**Acceptance**: File opens in browser, shows 8 empty sections, styles render correctly

### Step 2: Act 1 (The Illusion) — static content (15 min)

- Write the hook copy: incognito mode placebo, digital ghost illusion
- Title card + opening narrative
- Transition element pointing to Act 2

**Acceptance**: Reads well, sets the tone

### Step 3: Act 2 (Sweeney/Weld) — interactive linkage attack (90 min)

**Interactive element**: Two side-by-side tables with progressive filtering

- Left table: "Anonymized Medical Records" (~20 rows). Columns: birth_date, zip, gender, diagnosis
- Right table: "Cambridge Voter Registration" (~30 rows). Columns: name, birth_date, zip, gender
- Data construction: exactly one person appears in both tables (our "Governor Weld"), with matching birth_date/zip/gender but only the medical table shows his diagnosis
- Filter buttons beneath the tables: "Filter by birth date: 1945-07-31" → "Filter by gender: Male" → "Filter by zip: 02138"
- Each button click animates: matching rows stay, non-matching rows fade out
- After the 3rd filter, both tables have exactly 1 row each → highlight connection → reveal the payoff text

**Implementation**:
- Hardcode the two datasets as JS arrays of objects
- Render rows via template string into table bodies
- Filter state: `{birthDate: null, gender: null, zip: null}`
- Re-render on each button click, applying CSS class `filtered-out` (opacity 0.1) to non-matches
- Final state: show the two single rows connected with a visual line/arrow (SVG or positioned div)

**Acceptance**:
- Opening state shows full tables
- Three sequential clicks narrow both tables to 1 row each
- Final state visibly connects the two records
- "87% of US population" statistic appears in a callout after the reveal

### Step 4: Act 3 (k-Anonymity) — dataset transformation + homogeneity reveal (90 min)

**Interactive element**: A single dataset table with a k-slider and a "Reveal Homogeneity Attack" button

- Dataset: ~12 rows with columns {age, zip, gender, diagnosis}
- Data construction: crafted so that when k=5, one of the generalization groups has all 5 members with the SAME diagnosis (the homogeneity failure)
- k-slider: ranges from 1 to 5
- At k=1: full detail shown (age=32, zip=02138, gender=M)
- At k=2-3: partial generalization (age=30-40, zip=021**)
- At k=4-5: heavy generalization (age=30-50, zip=02***, some rows suppressed)
- "Reveal Homogeneity Attack" button (appears at k=5): highlights the vulnerable group, callout explains why k-anonymity fails

**Implementation**:
- Hardcode the dataset + pre-computed generalizations for each k value (avoid implementing k-anonymity algorithmically — too much work and students don't need it)
- For each k: store a snapshot of the transformed dataset
- Slider triggers re-render with the stored snapshot for that k value
- Generalized cells get visual treatment (muted color, italic, parenthetical bucket notation)
- Suppressed rows: strikethrough or "SUPPRESSED" label
- Homogeneity reveal: adds a yellow highlight background to the vulnerable group's rows and animates in a text callout

**Acceptance**:
- Slider smoothly transitions through k=1 to k=5
- At k=5, a group of ≥5 rows is clearly visible with identical diagnosis
- Reveal button triggers the homogeneity attack explanation
- "Curse of dimensionality" sidebar explains why this fails at scale (static text)

### Step 5: Act 4 (DP Mechanism) — epsilon slider + live histogram (120 min)

**Interactive element**: The central exhibit — an SVG histogram with a real-time epsilon slider

- Base data: a synthetic distribution (e.g., ~1000 salaries, normally distributed mean=$55k, std=$15k) bucketed into 10 bins
- Display: SVG bar chart showing bin counts
- True answer display: "Mean: $55,012"
- Epsilon slider: range [0.1, 20] with log scale, default 1.0
- Laplace noise applied to each bucket count using `laplaceNoise(epsilon, sensitivity=1)`
- On slider change: recompute noisy bucket counts + noisy mean, re-render bars with smooth CSS transitions
- "Re-roll noise" button: shows that the noise is random each time — not just a fixed offset
- Side panel: "Frosted glass" visual (literal CSS blur filter over the histogram) that scales with noise level (low ε = heavy blur, high ε = crisp)
- Text callouts at key ε thresholds:
  - ε ≤ 0.5: "Strong privacy, weak utility"
  - ε ~ 1: "The balance point"
  - ε ≥ 10: "Strong utility, weak privacy"

**Implementation**:
- Pre-compute the true histogram once (array of 10 bin counts)
- `updateChart(epsilon)` function: clones true counts, adds Laplace noise to each, clamps to ≥0, re-renders SVG rects with updated heights
- SVG bars sized via `height` attribute; CSS transition on height for smooth morphing
- Mean display: recompute from noisy counts, show "Mean: $X,XXX" with delta from true mean
- Frosted glass effect: a `<div>` overlay on the chart with `backdrop-filter: blur(Npx)` where N = `1/epsilon * someConstant`

**Acceptance**:
- Slider moves smoothly from 0.1 to 20
- Bars visibly change heights as epsilon changes
- "Re-roll" button produces different noise each click (demonstrates randomness)
- Callout text updates at threshold values
- Frosted glass overlay visibly changes with epsilon

### Step 6: Act 5 (DP in the Wild) — static content with external links (30 min)

- 4 deployment cards: Apple (local DP for emoji), Google Maps (popular times), 2020 Census (reconstruction attack mitigation), SMPC (banks collaborating on fraud)
- Each card: icon/emoji, short description, key insight
- External links section (open in new tab):
  - DP Tetris: https://amanpriyanshu.github.io/Differentially-Private-Tetris/
  - CT Census DP 2010 demo: https://ct-data-collaborative.github.io/dp2010/
- Call out: "Try these after class"

**Acceptance**: Clean card layout, links open in new tab, no dependencies

### Step 7: Act 6 (Dark Side) — minority erasure visualization (75 min)

**Interactive element**: Bar chart of a mock town's demographics with shared epsilon slider

- Mock town data: 5 groups with sizes [950, 12, 7, 5, 3] representing majority + minorities
- Shared epsilon slider (could reuse the Act 4 slider logic, or a separate instance)
- Display: horizontal bar chart, one bar per group, labeled
- As epsilon decreases: small groups get noised, some go to 0 or negative (clamped)
- Visual: when a group's noisy count ≤ 0, the bar collapses and the label gets a strikethrough with "ERASED" annotation
- Narrative callout: "Those families mathematically cease to exist in the official record"
- Connect to the Matthew Effect in ML (static text below)

**Implementation**:
- Reuse `laplaceNoise()` from Act 4
- Same update pattern: recompute noisy counts on slider change, re-render bars
- Erasure detection: if `noisy count <= 0`, add CSS class `erased` to the bar + label

**Acceptance**:
- At ε ≥ 10: all groups visible
- At ε ≤ 0.5: small groups (5, 3) frequently erased on re-roll
- Majority group (950) remains roughly stable across all ε values
- Erased groups visually marked

### Step 8: Act 7 (Law & Theater) — static content (20 min)

- Quebec Law 25 callout: "irreversibly anonymized", $25M CAD fines
- GDPR comparison (brief)
- Privacy Theater section: "We use DP" → ε = 14 trap
- Trust gap statistic: "84% of executives think customers trust them. 27% actually do."

**Acceptance**: Clean layout with pull-quotes and statistics

### Step 9: Act 8 (The Reframe) — static closing (15 min)

- "Privacy is a dial, not a switch"
- "We wanted to be ghosts in the machine. We just have to make sure we don't become ghosts in the real world too."
- Optional: a final "dial" visual recapping epsilon's role
- Credits / acknowledgments: podcast source, course branding

**Acceptance**: Satisfying close, reader feels the arc has resolved

### Step 10: Website wrapper (20 min)

- Create `website/demos/differential-privacy-explainer/index.html`
- Copy the existing `website/demos/data-control-vulnerability/index.html` structure
- Update: title, description, iframe src, course context section
- The iframe references `../../course_materials/demos/differential-privacy-explainer.html`

**Acceptance**: Wrapper page loads, iframe shows the artifact, course chrome is present

### Step 11: Local preview + deploy (15 min)

- Run `python3 scripts/deploy-to-public.py --local-preview`
- Open `local-preview/demos/differential-privacy-explainer/` at `http://localhost:8000`
- Verify all 8 acts render, all 4 interactive elements work, all paths resolve
- If preview works, run `python3 scripts/deploy-to-public.py --skip-branch-check`
- Verify live URL is accessible

**Acceptance**: Artifact is live at `https://dallaselleman.github.io/cyb-4203-6203-spring-2026/demos/differential-privacy-explainer/`

## Testing Strategy

No automated tests — same-day build, manual testing is sufficient and faster.

**Manual test checklist** (runs at the end of each major step and again at the end):

- [ ] Page loads in Chrome without console errors
- [ ] Page loads in Safari without console errors (for MacOS podium)
- [ ] All 8 sections render with content
- [ ] Act 2: linkage attack filters work, final reveal shows both matching rows
- [ ] Act 3: k-slider transitions through all values, homogeneity reveal works
- [ ] Act 4: epsilon slider updates histogram smoothly, re-roll produces different results
- [ ] Act 4: frosted glass overlay scales with epsilon
- [ ] Act 6: minority erasure visibly occurs at low epsilon
- [ ] External links in Act 5 open in new tabs
- [ ] Page is scrollable top-to-bottom without layout breaks
- [ ] Looks clean at 1920x1080 (projector resolution)
- [ ] No external HTTP requests (check Network tab)

## Acceptance Criteria Checklist

The iteration is complete when ALL of the following are true:

- [ ] `course_materials/demos/differential-privacy-explainer.html` exists, is self-contained (no external JS), and has all 8 acts
- [ ] All 4 interactive elements function correctly (linkage attack, k-anonymity transformation, epsilon slider, minority erasure)
- [ ] `website/demos/differential-privacy-explainer/index.html` exists and iframes the artifact correctly
- [ ] The artifact narrative closely tracks the podcast progression (Acts 1-8)
- [ ] The page loads and functions in Chrome on macOS
- [ ] The page loads and functions in Safari on macOS
- [ ] No console errors on page load
- [ ] No external JS dependencies (verified via Network tab)
- [ ] Laplace noise is computed client-side (verified: re-roll produces different values)
- [ ] Epsilon slider produces visible, continuous changes (not just discrete thresholds)
- [ ] The artifact is deployed to the public course website and accessible via the live URL
- [ ] Synthetic/mock data only (no real student or census data)

## Rough Time Budget

| Step | Estimated time |
|------|---------------|
| Scaffold | 30 min |
| Act 1 | 15 min |
| Act 2 | 90 min |
| Act 3 | 90 min |
| Act 4 | 120 min |
| Act 5 | 30 min |
| Act 6 | 75 min |
| Act 7 | 20 min |
| Act 8 | 15 min |
| Wrapper page | 20 min |
| Local preview + deploy | 15 min |
| **Buffer for polish/bugs** | 60 min |
| **Total** | **~10 hours** |

This is an aggressive build but feasible. The longest items (Acts 3 and 4) are the core pedagogical exhibits; they deserve the most care. Static sections (1, 5, 7, 8) act as buffers that can absorb time pressure.

## Risk Mitigation

**If running out of time:**
1. **Cut Act 6's interactive element** — Make it static with a diagram; the concept is covered in narrative. Saves ~60 min.
2. **Cut the "frosted glass" visual in Act 4** — Keep the histogram but skip the CSS backdrop-filter overlay. Saves ~20 min.
3. **Simplify Act 3** — Show only 2-3 k values (k=1, k=3, k=5) as discrete buttons instead of a slider. Saves ~30 min.

**If something breaks during deploy:**
- The deploy script has `--dry-run` mode; use it first
- If the live site fails, open `course_materials/demos/differential-privacy-explainer.html` directly from a local checkout on the podium laptop as fallback
- Save a copy to a USB drive before class as backup

## Out of Scope (Explicit)

- Animations beyond simple CSS transitions
- Mobile responsive layout (podium projector only)
- Accessibility beyond semantic HTML (keyboard navigation, ARIA labels are nice-to-have, not blocking)
- Actual mathematical derivation of the Laplace mechanism (just the intuition)
- Discussion of (ε, δ)-differential privacy (keep it pure ε-DP for simplicity)
- Composition theorems (mentioned briefly in narrative, not interactively demonstrated)
