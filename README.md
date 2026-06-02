# Interactive HTML Presentations & Artifacts — ASWP Tutorial Suite

A team tutorial on building **interactive HTML presentations and artifacts with LLM
assistance** — as a replacement for traditional PowerPoint, and for the interactive
demos and explainers that go with in-class delivery.

Everything here is a plain **vanilla HTML/CSS/JS** file: no framework, no build
step, no internet. Open it in any browser and it runs — which is the whole point, since
the finished decks and artifacts go to classrooms that may have no network.

## Start here

**▶ [Launch the suite in your browser](https://utulsa-aswp.github.io/html-presentation-tutorial/)** —
no clone, no setup. Or open **`index.html`** locally for the same landing page. Work
through the decks in order; Decks 1 and 2 are ready now, Deck 3 is in progress.

| | Deck | Launch | What it covers |
| --- | --- | --- | --- |
| 1 | **Vibe Engineering with `llm-dev:cycle`** (`decks/01-llm-dev-cycle-tutorial/`) | [▶ Launch](https://utulsa-aswp.github.io/html-presentation-tutorial/decks/01-llm-dev-cycle-tutorial/) | A framework for LLM-assisted development — the six-phase `llm-dev:cycle`, from a topic to a finished presentation or artifact. |
| 2 | **Worked Examples** (`decks/02-worked-examples/`) | [▶ Launch](https://utulsa-aswp.github.io/html-presentation-tutorial/decks/02-worked-examples/) | Two real builds walked through phase by phase: an interactive HTML presentation (the **DP explainer**) and the **search-algorithm demo** built with the Claude desktop app — with verbatim quotes and the source cycle docs. |
| 3 | **Enrichment & What's Next** | Coming soon | Making slides richer and better-sourced; reveal.js as a future option. |

> The ▶ links open the rendered decks via GitHub Pages — handy for a quick look or to
> share. The decks are still fully offline: clone the repo (or download a deck folder)
> and open any `index.html` from `file://` with no network.

## Getting Started

Ready to build your own decks and artifacts for the team? The quick path:

1. **Work through the decks above.** Deck 1 teaches the `llm-dev:cycle` process; Deck 2
   shows two real builds end to end. You can launch both in your browser — no setup needed.

2. **Clone the team presentations repo.** All Summer 2026 ASWP decks and artifacts live in
   **[`summer-2026-presentations`](https://github.com/UTulsa-ASWP/summer-2026-presentations)**
   (private to the team). It ships a starter template and its own README that walks you
   through your first deck:

   ```sh
   git clone https://github.com/UTulsa-ASWP/summer-2026-presentations.git
   cd summer-2026-presentations
   ```

3. **Copy the starter and run the cycle.** Duplicate the starter template, then run
   `llm-dev:cycle` (or load the bundled skill files into any LLM chat) and build. See
   [Build your own](#build-your-own) and [The cycle skill](#the-cycle-skill) below for details.

> This tutorial suite is your **reference**; the team repo
> (`summer-2026-presentations`) is where your actual **work** lives.

## Build your own

Copy the **`starter/`** folder — a re-themeable, fully offline presentation skeleton
(scroll-snap slides, keyboard navigation, progress bar, speaker-notes panel). See
[`starter/README.md`](starter/README.md) for how to copy, re-theme, and the small
HTML ↔ JS contract to keep intact.

## The cycle skill

These decks are built using **`llm-dev:cycle`** — a structured six-phase development
loop (Review → Brainstorm → Research → Plan → Execute → Verify). A reference copy of the
skill definition is bundled here under [`skills/cycle/`](skills/cycle/SKILL.md) so you can
read what each phase does.

To actually *run* the skill in Claude Code, install the **llm-dev plugin**:
<https://github.com/DallasElleman/llm-dev>. Deck 1 ("Vibe Engineering with `llm-dev:cycle`")
walks through the cycle as a concept; the bundled `SKILL.md` is the full specification.

The cycle is **tool-agnostic** — it isn't tied to Claude Code. Deck 2's second worked
example, the Pathfinding Race, was built by running the same cycle in the **Claude desktop
app**, and its full per-iteration artifacts ship alongside it.

## Layout

```
html-presentation-tutorial/
├── index.html                 # landing page (links the decks + starter)
├── assets/shared/theme.css     # canonical design tokens (copy into a deck to re-theme)
├── skills/cycle/               # bundled reference copy of the llm-dev:cycle skill
│   ├── SKILL.md
│   └── references/phase-details.md
├── starter/                    # the template you copy to start a new deck
│   ├── index.html
│   ├── assets/styles.css
│   ├── assets/script.js
│   └── README.md
└── decks/
    ├── 01-llm-dev-cycle-tutorial/  # Deck 1, built on the starter
    │   ├── index.html
    │   └── assets/{styles.css, script.js, img/}
    └── 02-worked-examples/         # Deck 2, built on the starter
        ├── index.html
        ├── assets/{styles.css, script.js, img/}
        ├── dp-explainer-deck/      # worked example 1: the DP explainer (a presentation)
        │   ├── differential-privacy-explainer.html
        │   ├── assets/dp-explainer/
        │   └── llm-dev-cycle-artifacts/   # its 6 cycle docs + condensed-transcript.md
        ├── search-alg-artifact/    # worked example 2: the Pathfinding Race (an artifact)
        │   ├── pathfinding-race.html
        │   ├── llm-dev-cycle-artifacts/iteration-{1,2,3}/   # built over 3 iterations
        │   └── tests/              # the build's test suite
        └── llm-dev-cycle-artifacts/   # how THIS deck itself was built
            └── iteration-{1,2}/    # the deck's own cycle artifacts
```

## How to view

Just open any `index.html` directly in a browser (double-click, or `file://`). No server
needed. To present: arrow keys to navigate, **P** for presenter view, **S** for speaker
notes, **Esc** to close them.

## The offline rule

Everything stays local — no CDN, no web fonts, no remote images. Quick check before
sharing a deck:

```sh
grep -riE 'https?://' <deck>/index.html <deck>/assets/
```

Resource references should return nothing.
