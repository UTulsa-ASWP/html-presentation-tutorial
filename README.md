# Interactive HTML Presentations — ASWP Tutorial Suite

A team tutorial on building **interactive HTML presentations with LLM assistance** —
as a replacement for traditional PowerPoint, for in-class delivery.

Every presentation here is a plain **vanilla HTML/CSS/JS** file: no framework, no build
step, no internet. Open it in any browser and it runs — which is the whole point, since
the finished decks go to classrooms that may have no network.

## Start here

Open **`index.html`** in a browser for the landing page, then work through the decks in
order. Deck 1 is ready now; Decks 2 and 3 are in progress.

| | Deck | What it covers |
| --- | --- | --- |
| 1 | **The Method** (`decks/01-the-method/`) | The `llm-dev:cycle` process — six phases from a topic to a finished deck. |
| 2 | **The Worked Example** *(coming soon)* | A real interactive explainer, built step by step from session transcripts + cycle artifacts. |
| 3 | **Enrichment & What's Next** *(coming soon)* | Making slides richer and better-sourced; reveal.js as a future option. |

## Build your own

Copy the **`starter/`** folder — a re-themeable, fully offline presentation skeleton
(scroll-snap slides, keyboard navigation, progress bar, speaker-notes panel). See
[`starter/README.md`](starter/README.md) for how to copy, re-theme, and the small
HTML ↔ JS contract to keep intact.

## Layout

```
html-presentation-tutorial/
├── index.html                 # landing page (links the decks + starter)
├── assets/shared/theme.css     # canonical design tokens (copy into a deck to re-theme)
├── starter/                    # the template you copy to start a new deck
│   ├── index.html
│   ├── assets/styles.css
│   ├── assets/script.js
│   └── README.md
└── decks/
    └── 01-the-method/          # Deck 1, built on the starter
        ├── index.html
        └── assets/{styles.css, script.js, img/}
```

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
