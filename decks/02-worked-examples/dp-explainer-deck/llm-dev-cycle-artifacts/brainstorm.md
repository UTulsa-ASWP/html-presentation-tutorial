# Brainstorm — Iteration 1

## Chosen Concept

**"Privacy Lab" — an interactive web artifact for teaching Differential Privacy and Federated Learning**, published to GitHub Pages (or similar) and driven from the podium during Presentation 17 (April 6, 2026). The artifact is instructor-controlled, not participatory — students watch and discuss rather than submit data or act as nodes.

Rationale for instructor-controlled (vs. earlier participatory ideas):
- Podium connectivity is uncertain; no local server dependencies
- Eliminates multi-device networking complexity for a same-day build
- A well-designed interactive explainer can drive discussion as effectively as participation
- Existing tools (DP Tetris, CT Census Demo) already provide the "fun participatory" angle — this artifact fills the missing gap: **a step-by-step explainer of DP fundamentals**

## Part 1: Differential Privacy Artifact

### Narrative structure (mirrors Rapid Synthesis / NotebookLM podcast)

An 8-act progression adapted from `course_materials/presentations/exclude-from-public-deploy/2-presentation-outlines-html/pres-17-podcast-transcript.md`:

| Act | Theme | Content | Interactive? |
|-----|-------|---------|--------------|
| **1. The Illusion** | Incognito mode as placebo | Hook: "you feel hidden but you're not" | Static |
| **2. Patient Zero** | Latanya Sweeney / Governor Weld | Medical data + voter records + linkage attack | **Yes — live linkage attack** |
| **3. The Spartacus Strategy** | k-Anonymity and its failure | Generalization, suppression, homogeneity attack, curse of dimensionality | **Yes — dataset transformation** |
| **4. The Revolution** | Differential Privacy (Dwork et al., 2006) | Plausible deniability, frosted glass analogy, noise injection, epsilon budget | **Yes — epsilon slider with live histogram** |
| **5. DP in the Wild** | Apple, Google Maps, 2020 Census, SMPC | Real deployments; link to DP Tetris and CT Census Demo | Static + external links |
| **6. The Dark Side** | Minority erasure, Matthew effect, clipping | The ethical cost of noise | **Yes — small-group erasure visualization** |
| **7. Law & Theater** | Quebec Law 25, privacy theater, trust gap | Regulation and the "we use DP" PR problem | Static |
| **8. The Reframe** | Privacy is a dial, not a switch | Closing thought | Static |

### Interactive elements in detail

**Act 2 — Live linkage attack:**
- Two side-by-side tables: "Anonymized medical records" (birth date, zip, gender, diagnosis) and "Voter registration" (name, birth date, zip, gender)
- Instructor clicks filters to progressively narrow down the medical record
- Click: filter by birth date → 6 matches
- Click: filter by gender → 3 matches
- Click: filter by zip → 1 match, revealing "Gov. William Weld" with his diagnosis highlighted
- Payoff animation: "She mailed him his own medical records"

**Act 3 — k-Anonymity transformation + homogeneity attack:**
- Small mock dataset (~12 rows) with identifiers + a sensitive attribute
- Slider for k (1 → 5): watch rows get generalized (ages bucketed, zips truncated) and outliers suppressed
- After reaching k=5, a "reveal" button exposes the homogeneity failure: all 5 people in Spartacus's group have the same diagnosis
- Optional: a dimensionality toggle showing how adding columns destroys k-anonymity

**Act 4 — Epsilon slider:**
- A histogram (or scatter plot) of a mock dataset (e.g., salaries, or a normally-distributed synthetic population)
- Slider for ε from 0.1 to 20
- As ε decreases, Laplace noise is added and the histogram visibly jitters/blurs
- Side panel shows the "true answer" (e.g., mean) vs. the "noisy answer" — with delta
- Visual motif: frosted glass overlay thickens/thins as ε changes
- A text callout at key ε values: "ε=0.5: strong privacy, weak utility" / "ε=15: strong utility, weak privacy"

**Act 6 — Small-group erasure:**
- A bar chart showing multiple ethnic/demographic groups in a mock town
- Majority group: 950 people. Minority groups: 3, 5, 7, 12 people
- Epsilon slider (reused from Act 4)
- Watch minority groups get noised to 0 or negative (clamped to 0)
- Narrative callout: "Those families mathematically cease to exist in the official record"

## Part 2: Federated Learning Artifact

**Deferred to a future iteration.** This iteration focuses entirely on the DP artifact. FL will be its own iteration, informed by user review of existing resources (FL Playground, PAIR Explorable, Google Comic, InFL-UX) and lessons learned from the DP build.

## Architecture

- **Single-page site** — HTML/CSS/JS, no backend, no build step required (or minimal — possibly Vite if we use a framework)
- **Chart library** — Chart.js (simpler) or D3 (more flexible) for the interactive visualizations; decision in Research phase
- **Deployment** — GitHub Pages, likely as a new subdirectory in the existing course website repo or a standalone repo
- **State** — all client-side; no persistence needed
- **Fonts/styling** — match the existing course website aesthetic (see `website/` directory)

## Scope Boundaries

**In scope:**
- Acts 1-8 of the DP artifact with 4 interactive elements (Acts 2, 3, 4, 6)
- Deployment to a publicly accessible URL before class tomorrow
- Clean visual design matching course branding
- Mock/synthetic data (no real student data)
- Links to DP Tetris and CT Census Demo in Act 5

**Out of scope for this iteration:**
- Participatory multi-device features (submitting data, QR code voting)
- Real ML model training or demonstration
- Mobile-optimized layouts (podium projector only)
- Persistent state or analytics
- The FL artifact until user decides on approach
- Real census data or realistic ML datasets

## Security-Relevant Boundaries

Minimal attack surface — static site, no user input accepted, no backend, no data stored. Only security-relevant considerations:
- **Dependency integrity**: use CDN-hosted libraries with SRI hashes, or bundle locally
- **No student data**: all datasets are synthetic/mock to avoid FERPA concerns even though the site is public
- **No external tracking**: no analytics, no third-party scripts beyond the chart library

## Alternatives Considered and Rejected

1. **Full participatory multi-device demo with QR codes** — Rejected due to podium connectivity uncertainty, same-day build risk, and Firebase dependency complexity. The podcast-driven narrative structure is more pedagogically rich anyway.

2. **Curated tour of existing tools only (no custom build)** — Rejected because the key pedagogical gap (step-by-step DP fundamentals explainer with interactive elements) is not well-served by any single existing tool. PAIR explorables come closest but don't cover the Sweeney→k-anonymity→DP progression.

3. **Python/Streamlit app with real DP library** — Rejected because deployment and browser accessibility are harder; custom HTML/JS gives more presentation polish.

4. **Jupyter notebook as the artifact** — Rejected because it's not podium-friendly; looks like a coding environment, not a teaching tool.

5. **Slides with embedded interactive elements in PPTX** — Rejected because PPTX interactivity is limited and fragile; a dedicated web page is more reliable.

## Open Questions for Research Phase

- Chart.js vs. D3 vs. raw SVG for the visualizations?
- Framework (React/Svelte/vanilla)? Leaning vanilla for simplicity
- Deploy as standalone repo or nest within existing course website repo?
- How to handle the Act 4 Laplace noise mathematically — compute client-side or precompute and interpolate?
