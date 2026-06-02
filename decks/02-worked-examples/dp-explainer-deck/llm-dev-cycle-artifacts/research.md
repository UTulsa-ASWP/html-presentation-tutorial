# Research — Iteration 1 (DP Artifact)

## Tech Stack Decision

**Selection: Vanilla HTML/CSS/JavaScript in a single self-contained file. No framework, no build step, no external JS libraries.**

### Rationale

The existing course demo (`course_materials/demos/data-control-vulnerability.html`) is a 1,019-line self-contained HTML file with zero external JS dependencies. This is the established pattern in this repo and it's the right pattern for several reasons:

1. **Zero dependency risk** — no `npm install`, no lockfile drift, no CVEs, nothing to break between now and class tomorrow
2. **Offline-capable** — works even if the podium has no network (important given the user's earlier stated concern)
3. **Easy to deploy** — one file, drop into `course_materials/demos/` and add a website wrapper
4. **Easy to debug live** — open browser devtools, inspect, done
5. **Established pattern** — matches the existing `data-control-vulnerability` demo, so follow-on demos benefit from consistency

### Alternatives Rejected

| Alternative | Rejected because |
|-------------|------------------|
| **React/Vite** | Build step overhead; framework learning curve during a same-day build; heavier for deployment |
| **Svelte** | Same as React but even less familiar to this project |
| **D3.js** | Powerful but adds ~250KB CDN dependency; visualizations we need (histograms, bar charts, table filtering) are simple enough to do with raw SVG or Canvas |
| **Chart.js** | Simpler than D3 but still an external dependency; adds a CDN failure point; our charts need custom animation/interaction that doesn't fit Chart.js idioms cleanly |
| **Observable notebook** | Not podium-friendly UX; looks like a notebook, not a presentation |

### Library-free visualizations — feasibility check

All four interactive elements from `brainstorm.md` can be implemented with vanilla DOM + SVG manipulation:

1. **Act 2 linkage attack** — HTML tables with JS filtering. Pure DOM, no library. Trivial.
2. **Act 3 k-anonymity transformation** — HTML tables with CSS transitions as rows get generalized/suppressed. Trivial.
3. **Act 4 epsilon slider + histogram** — SVG histogram (10-20 rectangles) + Laplace noise sampling. See math verification below.
4. **Act 6 minority erasure bar chart** — SVG bar chart, same pattern as Act 4. Trivial.

## Mathematical Foundation

### Laplace Mechanism — implementation

The Laplace mechanism for differential privacy adds noise drawn from Laplace(0, Δf/ε), where Δf is the sensitivity of the query and ε is the privacy budget.

JavaScript implementation (verified working):

```javascript
function laplaceNoise(epsilon, sensitivity = 1) {
  const scale = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}
```

Inverse CDF sampling. ~5 lines. No library needed.

For the epsilon slider demo:
- **ε = 0.1** → scale = 10 → heavy noise
- **ε = 1.0** → scale = 1 → moderate noise
- **ε = 10** → scale = 0.1 → light noise
- **ε = 20** → scale = 0.05 → barely any noise

This range maps naturally to the "privacy budget dial" narrative from the podcast.

### Sensitivity assumption

For the demos, we'll assume sensitivity = 1 (a count query where any one individual can change the count by at most 1). This is the standard simple case and avoids the pedagogical complexity of explaining sensitivity before students have grasped the core concept.

### Histogram/count stability under noise

For a bucket count of N people with noise drawn from Laplace(0, 1/ε):
- Expected absolute error ≈ 1/ε
- For small buckets (N ≤ 5), noise at ε ≤ 0.5 can flip counts to negative (demonstrating minority erasure in Act 6)
- For large buckets (N ≥ 500), noise is lost in the rounding (demonstrating "majority groups unaffected")

This is exactly the pedagogical payoff we want.

## Data & Content Sources

### Mock datasets (to build)

1. **Act 2 — Medical records + voter list**
   - ~20 fabricated medical records: {birth_date, zip, gender, diagnosis}
   - ~30 fabricated voter records: {name, birth_date, zip, gender}
   - One record overlap: "Governor William Weld" or equivalent
   - Synthetic, no real data

2. **Act 3 — k-anonymity dataset**
   - ~12 rows with {age, zip, gender, diagnosis}
   - Designed so that after generalization to k=5, one group has homogeneous diagnosis (for the homogeneity attack reveal)

3. **Act 4 — Salary/population histogram**
   - Either a normal distribution of ~1000 synthetic salaries (bucketed into histogram bins)
   - Or a simple count query: "How many people are in each age bucket?"

4. **Act 6 — Small community demographics**
   - Mock town with: Majority group (950), then minorities (12, 7, 5, 3)
   - Bar chart with labeled groups

### Content/copy

The script for each section will draw directly from the podcast transcript progression, lightly adapted for visual presentation (shorter sentences, callouts, key phrases). This is custom content, not scraped.

## Deployment Strategy

### File locations (following existing pattern)

- **Artifact**: `course_materials/demos/differential-privacy-explainer.html` (the self-contained 1-file demo)
- **Website wrapper**: `website/demos/differential-privacy-explainer/index.html` (iframe wrapper with course chrome)

### Publishing

The website deploys via `scripts/deploy-website.sh` (based on repo pattern). The demo needs to live in a path that gets copied into the deployed site. Two options:

1. **Copy the self-contained HTML into the deployed tree** — the existing deploy process handles `website/demos/{name}/` wrapper pages, but the actual demo file is referenced via relative path `../../course_materials/demos/data-control-vulnerability.html`. This relative path must resolve correctly in deployment.

2. **Verify deployment path** — check `.docs/website-deployment.md` during Plan phase to confirm the exact deployment mechanism and ensure the artifact will be publicly accessible.

Public URL will be: `https://dallaselleman.github.io/cyb-4203-6203-spring-2026/demos/differential-privacy-explainer/`

## Security Considerations

- **No user input accepted** — purely display-only interaction (sliders, buttons). No XSS surface.
- **No external scripts** — no CDN, no tracking. Matches existing demo pattern.
- **No real data** — all datasets synthetic/fabricated. No FERPA exposure.
- **Static site** — no backend, no authentication, no session management.

## Open Questions Resolved in Plan Phase

- Exact dataset sizes and compositions for each act
- Visual design / aesthetic: match existing data-control-vulnerability cyberpunk style, or use a cleaner course-branded look?
- Transition/animation framework: pure CSS transitions, or a small JS animation helper?
- Accessibility: keyboard navigation, ARIA labels — target basic level

## Confidence Assessment

**High confidence** that this stack can deliver all four interactive elements + 8 narrative sections in a single-day build:
- Pattern is proven (existing demo works this way)
- Math is verified (Laplace noise is trivial)
- No dependency risk
- Deployment path is established
