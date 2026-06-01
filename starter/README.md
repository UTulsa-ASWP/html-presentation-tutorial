# Presentation Starter

A re-themeable, fully self-contained **vanilla HTML/CSS/JS** presentation template.
No frameworks, no build step, no internet required — open `index.html` in any browser
and it just works, which is exactly what a classroom-offline deck needs.

## Use it

1. **Copy the whole `starter/` folder** to wherever your new deck lives and rename it.
2. Open `index.html` in a browser to see the five example slides.
3. Edit the slides (see below), re-theme the colors, drop in local images, done.

## How a deck is structured

```
your-deck/
├── index.html          # the slides (content)
├── assets/
│   ├── styles.css       # theme tokens + layout + components
│   ├── script.js        # navigation engine (rarely needs editing)
│   └── img/             # YOUR local images (keep everything local!)
```

- **Each slide** is a `<section class="slide">`. The first/last use the
  `title-slide` variant (brand-colored). Add or remove sections to change the deck.
- **Speaker notes** go in a hidden `<div class="speaker-notes">` inside each slide.
  Press **S** while presenting to open the notes panel; **Esc** closes it.

## Re-theming

Open `assets/styles.css` and edit the `:root` block at the top (section 1). Every
color, font, and shadow flows from those custom properties — change `--navy` and
`--gold` first; that's most of the visual identity. You rarely need to touch anything
below the token block. The canonical token set lives in
`../assets/shared/theme.css`; copy it if you want to start from the suite default.

## Keyboard controls (built in)

| Key | Action |
| --- | --- |
| → · ↓ · PageDown · Space | Next slide |
| ← · ↑ · PageUp | Previous slide |
| Home / End | First / last slide |
| S | Toggle speaker-notes panel |
| Esc | Close speaker-notes panel |
| Click a dot | Jump to that slide |

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

## The offline rule

Everything must be local. **No** `@import` of web fonts, **no** CDN `<script>`/`<link>`,
**no** remote image URLs. If you need a font beyond the system stack, vendor the WOFF2
files into `assets/` and add an `@font-face` rule. A quick check before you ship:

```sh
grep -riE 'https?://|cdn|googleapis' index.html assets/
```

It should return nothing in your resource references.
