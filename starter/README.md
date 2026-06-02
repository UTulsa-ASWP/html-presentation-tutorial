# Presentation Starter

A re-themeable, fully self-contained **vanilla HTML/CSS/JS** presentation template.
No frameworks, no build step, no internet required — open `index.html` in any browser
and it just works, which is exactly what a classroom-offline deck needs.

## Use it

1. **Copy the whole `starter/` folder** to wherever your new deck lives and rename it.
2. Open `index.html` in a browser to see the six example slides.
3. Edit the slides (see below), re-theme the colors, drop in local images, done.

## How a deck is structured

```
your-deck/
├── index.html          # the slides (content)
├── assets/
│   ├── styles.css       # theme tokens + layout + components (+ optional 5b split layout)
│   ├── script.js        # navigation engine (rarely needs editing)
│   ├── doc.css          # OPTIONAL — theme for rendered-Markdown docs
│   └── img/             # YOUR local images (keep everything local!)
├── docs/               # OPTIONAL — Markdown to embed in slides (*.md → *.html)
└── scripts/
    └── render-markdown.sh   # OPTIONAL — pre-render docs/*.md to self-contained HTML
```

- **Each slide** is a `<section class="slide">`. The first/last use the
  `title-slide` variant (brand-colored). Add or remove sections to change the deck.
- **Speaker notes** go in a hidden `<div class="speaker-notes">` inside each slide.
  Press **S** while presenting to open the notes panel; **Esc** closes it.
- **Slide numbers auto-set from position.** Give a slide a
  `<span class="slide-number"></span>` badge and `script.js` fills in `01`, `02`, …
  by order — insert or reorder slides freely and the numbers never go stale. Omit the
  span on title/closing slides (they're skipped).

## Re-theming

Open `assets/styles.css` and edit the `:root` block at the top (section 1). Every
color, font, and shadow flows from those custom properties — change `--navy` and
`--gold` first; that's most of the visual identity. You rarely need to touch anything
below the token block. That `:root` block **is** the canonical token set — copy it into
a new deck whenever you want to start from the suite default.

## Keyboard controls (built in)

| Key | Action |
| --- | --- |
| → · ↓ · PageDown · Space | Next slide |
| ← · ↑ · PageUp | Previous slide |
| Home / End | First / last slide |
| P | Open the **presenter view** (second window: notes + next slide + timer) |
| F | Toggle fullscreen |
| S | Toggle the inline speaker-notes panel |
| Esc | Close the speaker-notes panel |
| Click a dot | Jump to that slide |

**Presenter view (P):** opens a second window showing the current slide's speaker
notes, the next slide's title, and a running timer, with Prev/Next buttons. Put it on
your laptop screen and the deck on the projector. Arrow keys work in *either* window, so
you can drive the talk from whichever has focus. It runs fully offline (no setup) — your
browser may ask to allow the popup the first time.

## The HTML ↔ JS contract (don't break these)

`script.js` is content-agnostic but expects a few elements to exist. If you rename or
remove them, navigation breaks. Keep these:

**Required element IDs**
- `#progressBar` — the top progress bar
- `#slideDots` — container the dot indicators are injected into
- `#slideCounter` — the "N / total" readout
- `#speakerNotesPanel` — the slide-in notes panel
- `#speakerNotesContent` — where the current slide's notes are rendered

**Required classes / selectors**
- `section.slide` — marks every slide (the script counts these)
- `.title-slide` — optional title-slide styling variant
- `.speaker-notes` — the hidden per-slide notes block (data source for the panel)
- `.slide-dot`, `.active` — dot indicators and the active-state class

## Adding interactivity

The navigation engine is all you need for a normal deck. To add a chart, toggle, or
other widget, write your functions at the bottom of `script.js` and call them from the
`DOMContentLoaded` handler (there's a marked spot). The keyboard handler already
ignores arrow keys while an `<input>`/`<textarea>` is focused, so sliders behave.

## Optional patterns (use if you need them)

Everything below is **opt-in** — the base template above is complete without it. These
exist so decks across the team are built the same way when they *do* reach for them.

### Split / artifact-embed layout

Slide 5 of this starter demos a `.split` slide: a left column (chat **bubbles** or
labelled **highlights**) flows via an arrow into a right **pane** that embeds a rendered
doc or a live artifact in a scrollable `<iframe>`. The classes live in `styles.css`
section **5b** and theme automatically from the `:root` tokens. Copy that slide's markup
to use it — or delete the slide (and `docs/`, `scripts/`, `assets/doc.css`) if you don't.

### Embedding rendered Markdown (offline-safe)

To show a Markdown file *inside* a slide (cycle artifacts, design notes, a transcript):

1. Put the `.md` in `docs/`.
2. Pre-render it to self-contained HTML:

   ```sh
   bash scripts/render-markdown.sh docs      # needs pandoc: brew install pandoc
   ```

   Each `docs/x.md` becomes `docs/x.html` with `assets/doc.css` inlined (zero runtime
   deps). It's idempotent — re-run after editing. Commit the `.html` so Pages serves it.
3. Embed it: an `<iframe src="docs/x.html">` inside a `.doc-pane` (see slide 5).

**Why pre-render instead of fetching the `.md` in JS?** Browsers block local-file
`fetch()`/XHR under `file://`, so a "load the .md and render it" viewer shows a **blank
pane offline**. Embedding pre-rendered HTML via `<iframe src>` works offline; fetching does not.

### More optional components

- **`.takeaway-chips` / `.chip`** — a centered row of short key-point cards; good for a
  summary or closing slide. Each `.chip` leads with a `<strong>` heading line.
- **`.pane-head` / `.launch-btn`** — a pane header with a "launch in new tab" button; use in
  place of a bare `.pane-label` when the embedded thing is worth opening full-screen.

### Built-in niceties (no markup needed)

- **In-page anchor links just work.** An `<a href="#some-id">` whose target is a
  `<section class="slide" id="some-id">` jumps straight to that slide — `script.js` routes
  it instantly so `scroll-snap` doesn't fight the jump.
- **Cache-busting.** `index.html` loads `styles.css?v=1` / `script.js?v=1`; bump the `N`
  when you edit those files so browsers reliably pick up changes during iteration.

## Offline-first gotchas (learned building the suite)

- **`file://` blocks `fetch`/XHR** of local files, but **`<iframe src>` navigation works.**
  Build embeds as iframe navigation, not fetch.
- **Verify the true offline case in Firefox** — it opens `file://` directly (a real eyeball
  on the classroom scenario). A local `python3 -m http.server` is great for quick checks and
  mirrors the GitHub Pages path, but it is *not* the same as `file://`.
- **pandoc:** use `--from gfm-tex_math_dollars` so `$20`/`$55k` don't parse as TeX math, and
  the bundled `doc.css` hides pandoc's duplicate title block. Both are already wired into
  `render-markdown.sh`.

## The offline rule

Everything must be local. **No** `@import` of web fonts, **no** CDN `<script>`/`<link>`,
**no** remote image URLs. If you need a font beyond the system stack, vendor the WOFF2
files into `assets/` and add an `@font-face` rule. A quick check before you ship:

```sh
grep -riE 'https?://|cdn|googleapis' index.html assets/
```

It should return nothing in your resource references.
