# Example embedded doc

This Markdown file was rendered to a self-contained HTML page by
`scripts/render-markdown.sh` and embedded in the **starter** deck's split-layout
example slide. Delete this folder (and that slide) if your deck doesn't need it.

## Why render Markdown ahead of time?

A deck has to run from `file://` with no server. Browsers **block** reading a local
`.md` at runtime, so rendering in JS would leave the pane blank offline. Pre-rendering
sidesteps that entirely — this page has no runtime dependencies.

## What survives the render

- Headings, lists, and **bold** / *italic* text
- Inline `code` and fenced blocks:

```js
const label = slide.querySelector('.slide-number');
if (label) label.textContent = String(i + 1).padStart(2, '0');
```

- Block quotes:

> Evidence before assertions — verify behavior, not structure.

- Tables, and literal dollar amounts like a $20 license or $55k budget (these stay
  text, not TeX math, thanks to the `gfm-tex_math_dollars` flag):

| Phase | Leaves behind |
| --- | --- |
| Plan | acceptance criteria |
| Verify | pass/fail evidence |

## Regenerate

After editing this file:

```sh
bash scripts/render-markdown.sh docs
```
