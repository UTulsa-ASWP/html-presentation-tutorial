# Review — Iteration 1

## Context

**Goal**: Build an interactive demo for in-class presentation on April 6, 2026 (tomorrow) illustrating two privacy-enhancing and security technologies: **differential privacy** and **federated learning**.

**Course context**: This is for Presentation 17 (Week 11, Session 1), covering Unit 8: Privacy-Enhancing and Security Technologies. Unit 8 subtopics:
- 8.1 Differential privacy: concepts, mechanisms, and privacy-utility tradeoffs
- 8.2 Federated learning: architecture, security considerations, and applications
- 8.3 Homomorphic encryption
- 8.4 Secure multi-party computation

The demo targets 8.1 and 8.2 specifically.

## Constraints

1. **Time**: Must be ready by tomorrow (April 6). Single-session build.
2. **Audience**: Undergraduate/graduate cybersecurity students (18 students). Technical but not ML specialists. They've completed Units 1-7 covering AI/ML fundamentals, ethics, bias, regulatory frameworks, and attack vectors.
3. **Presentation context**: In-class live demo during a lecture. Needs to be visually clear, interactive, and illustrative — not a code walkthrough.
4. **Infrastructure**: Instructor laptop. No assumption of student devices for participation (though possible).
5. **Prior art**: The course has used interactive HTML artifacts with a viewer (commit 9017513). This is an established pattern.

## Requirements

- Demonstrate **differential privacy**: show how adding calibrated noise protects individual data points while preserving aggregate statistics. Illustrate the privacy-utility tradeoff (epsilon parameter).
- Demonstrate **federated learning**: show how multiple parties can collaboratively train a model without sharing raw data. Illustrate the communication rounds and convergence.
- Interactive: instructor (or students) can manipulate parameters and see effects in real time.
- Visually clear: charts, animations, or visualizations that make abstract concepts concrete.
- Self-contained: runs in a browser with no server dependencies (or minimal local server).

## Candidate Approaches

1. **Single-page HTML/JS app** — React or vanilla JS with D3/Chart.js visualizations. Runs in browser, no backend. Consistent with existing course artifact pattern.
2. **Python notebook (Jupyter)** — More flexible for actual ML code, but less polished for in-class presentation.
3. **Streamlit/Gradio app** — Python-based interactive web app. Requires local server but good visualization support.
4. **Slide-embedded demos** — Interactive elements embedded in the PPTX/HTML presentation itself.

## Gaps / Questions for Brainstorm

- Should the two topics (DP and FL) be separate demos or one unified app with tabs/sections?
- What dataset/scenario makes both concepts accessible? (e.g., salary data, health records, student grades)
- How much mathematical detail? (epsilon definition, Laplace mechanism, etc.)
- Should students be able to interact, or is this instructor-driven?
