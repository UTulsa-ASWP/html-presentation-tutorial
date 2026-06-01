# Interactive HTML Presentations — ASWP Tutorial Suite

A team tutorial on building **interactive HTML presentations with LLM assistance** —
as a replacement for traditional PowerPoint, for in-class delivery.

Every presentation here is a plain **vanilla HTML/CSS/JS** file: no framework, no build
step, no internet. Open it in any browser and it runs — which is the whole point, since
the finished decks go to classrooms that may have no network.

## Start here

Open **`index.html`** in a browser for the landing page, then work through the decks in
order. Decks 1 and 2 are ready now; Deck 3 is in progress.

| | Deck | Status | What it covers |
| --- | --- | --- | --- |
| 1 | **The Method** (`decks/01-the-method/`) | Ready | The `llm-dev:cycle` process — six phases from a topic to a finished deck. |
| 2 | **The Worked Example** (`decks/02-worked-example/`) | Ready | How a real interactive explainer was built, phase by phase, with verbatim quotes from the cycle artifacts. Bundles the **live DP explainer** to explore plus the source cycle docs. |
| 3 | **Enrichment & What's Next** | Coming soon | Making slides richer and better-sourced; reveal.js as a future option. |

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
<https://github.com/DallasElleman/llm-dev>. Deck 1 ("The Method") walks through the cycle
as a concept; the bundled `SKILL.md` is the full specification.

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
    ├── 01-the-method/          # Deck 1, built on the starter
    │   ├── index.html
    │   └── assets/{styles.css, script.js, img/}
    └── 02-worked-example/      # Deck 2, built on the starter
        ├── index.html
        ├── assets/{styles.css, script.js, img/}
        ├── artifact/          # the live DP explainer (offline copy you can open)
        └── cycle-artifacts/   # the 6 source cycle .md docs Deck 2 quotes from
```

(There is also a `search-alg-demos/` directory of exploratory cycle runs from
different AI tools — reference material, not part of the tutorial flow.)

## How to view

Just open any `index.html` directly in a browser (double-click, or `file://`). No server
needed. To present: arrow keys to navigate, **S** for speaker notes, **Esc** to close them.

## The offline rule

Everything stays local — no CDN, no web fonts, no remote images. Quick check before
sharing a deck:

```sh
grep -riE 'https?://' <deck>/index.html <deck>/assets/
```

Resource references should return nothing.
