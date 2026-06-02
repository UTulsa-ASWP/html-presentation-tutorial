# Research — Iteration 2 (Deck 2: "Worked Examples")

*Phase 3 of `llm-dev:cycle`. No new runtime stack — a static, offline-first deck on the shared
starter. The research questions are mechanism + assets: how to show **richer two-column slides**
with **nicely rendered cycle docs** and **inline-running artifacts**, all offline from `file://`
and on GitHub Pages.* Findings below were verified against the actual files and environment.

## Scope added since Brainstorm (user direction)

1. **Don't link raw `.md`** — rendered raw markdown opens unformatted/ugly in a new tab. Render it.
2. **Richer slide layout**, two columns:
   - **Part 1 phase slides:** left = a few user/assistant **conversation bubbles** + a → arrow;
     right = a **scrollable pane showing the rendered cycle-phase doc**.
   - **Part 2 iteration slides:** left = **phase highlights**; right = the **artifact running inline**.

## Tech Stack — Runtime Unchanged, One Build-Time Tool Added

- **Runtime:** vanilla HTML/CSS/JS, no build step, offline-first; shared starter at
  `assets/styles.css` + `script.js` (the deck's CSS lives at **`assets/styles.css`**, not a
  top-level `styles.css`). No runtime libraries, nothing to install to *run* the deck.
- **Build-time (authoring only): `pandoc` 3.9.0.2** — verified present at
  `/opt/homebrew/bin/pandoc`. Used once to convert each cycle `.md` → a **standalone,
  self-contained, styled `.html`**. Output is plain static HTML with no runtime dependency, so the
  offline-first contract holds. (Rejected alternatives: `python-markdown` not installed; `marked`
  not installed and would mean a runtime fetch.)

## The Markdown-Rendering Decision

**Pre-render each linked cycle `.md` → a self-contained styled `.html` companion; link/iframe the
`.html`, never the `.md`.**

Why not the alternatives:
- **Runtime fetch + JS renderer** (e.g. marked.js `fetch('review.md')`): **fails offline from
  `file://`** — browsers block `fetch()`/XHR of local files (CORS/opaque origin). Dealbreaker.
- **Inline every doc as a string in `index.html`** and render with a vendored marked.js: works
  offline but bloats `index.html` with ~24 docs and couples content to the deck file.
- **Pre-rendered companion HTML (chosen):** offline-safe, no runtime lib, looks good standalone
  *and* embeds in an iframe, content stays decoupled. Cost = generated files + a regeneration step,
  managed by a committed script.

**Generation:** a committed script (e.g. `search-alg-artifact/`-aware `scripts/render-cycle-docs.sh`)
runs `pandoc --standalone --embed-resources` with a **shared template + CSS** so every rendered doc
is consistent and matches the deck. Parameterized over a glob of cycle dirs (no hard-coded file
lists) per the workspace "parameterize volatile values" principle. Re-runnable to track `.md` edits.

**Theme (user: "match the deck"):** use the deck's **real slide palette**, which is also the
readable choice — the slides are light cream, not dark:

| Token | Value | Use in rendered doc |
|---|---|---|
| `--bg-slide` | `#fafaf7` | document card background |
| `--ink` / `--ink-muted` | `#1a1a2e` / `#55556b` | body text / secondary |
| `--navy` | `#1d3557` | headings |
| `--gold` / `--gold-light` | `#b8860b` / `#d4a017` | accents, links, rules |
| `--bg` | `#0f1419` | dark backdrop behind the card (standalone view) |
| `--serif` / `--sans` / `--mono` | Georgia / system / SF Mono | headings / body / code |

Readability mitigations baked into the template: comfortable `max-width` (~70ch), generous
line-height (~1.6), adequate font-size for a small pane. Standalone view = cream card centered on
the dark backdrop (mirrors the deck page).

## The Inline-Display Decision (reverses Research's earlier "no iframes")

The richer layout needs docs/artifacts **shown inside the slide**, not just opened. That means an
**`<iframe>`** of a local self-contained file, inside a fixed-height scrollable container (iframes
scroll internally → the "scrollable window" the user asked for).

- This **supersedes** the prior "links, not iframes" call, which was only about how to *open*
  artifacts. We now do **both**: iframe for the in-slide pane **and** keep an "open in new tab"
  `<a target="_blank" rel="noopener">` for the full-size view / deep dive.
- **Offline-safe inputs:** all four Pathfinding snapshots are fully self-contained — **zero
  `http(s)` URLs, zero external `<script>`/`<link>` tags** (grep-verified). Rendered cycle docs are
  `--embed-resources` standalone (CSS inlined). So no iframe introduces a remote load.
- **Pages (https): robust** — same-origin local iframes just work.
- **`file://` (local): the one risk.** Firefox generally renders `file://` iframes of
  same-/sub-directory files, but this must be **proven in Verify** (Chrome MCP can't open
  `file://`). **Fallback if blocked:** degrade that pane to a static preview image or a prominent
  "open in new tab" link; the deck must remain usable offline either way.

## Assets — Mostly Already Present

Part 2's three per-iteration snapshots + full cycle docs already exist (verified, self-contained):

<!-- prettier-ignore -->
```
search-alg-artifact/
├── pathfinding-race.html                      # final (= iteration 3), 907 lines
└── llm-dev-cycle-artifacts/
    ├── iteration-1/  pathfinding-race.html     # Core Race,     571 lines  + review…verify.md
    ├── iteration-2/  pathfinding-race.html     # Study Mode,    891 lines  + review…verify.md (+ tests/)
    └── iteration-3/  pathfinding-race.html     # Apple restyle, 907 lines  + review…verify.md
dp-explainer-deck/
├── differential-privacy-explainer.html         # Part 1 artifact
└── llm-dev-cycle-artifacts/                     # review…verify.md + condensed-transcript.md
```

- **No artifact copying needed** — reference existing paths.
- **New generated files:** the rendered `.html` companions for every linked cycle doc
  (Part 1: 6 DP docs; Part 2: 3 × 6 = 18; + optionally the DP `condensed-transcript.md`). Location
  TBD in Plan — proposal: a `rendered/` subfolder beside each `llm-dev-cycle-artifacts/` so source
  `.md` and generated `.html` stay visually separable and regen = wipe + rebuild.

### Conversation-bubble source (Part 1)

Real user/assistant quotes for the left-column bubbles come from
`dp-explainer-deck/llm-dev-cycle-artifacts/condensed-transcript.md` (user turns verbatim, assistant
summarized) — keeps the "this really happened" texture. Part 2 highlights come from each iteration's
cycle docs.

## Exact relative paths (resolve from `index.html`; `file://` + Pages)

| Part 2 iteration | Artifact (iframe + open-link) | Cycle docs (rendered `.html`) |
|---|---|---|
| 1 — Core Race | `search-alg-artifact/llm-dev-cycle-artifacts/iteration-1/pathfinding-race.html` | rendered from `…/iteration-1/{review,brainstorm,research,plan,execute,verify}.md` |
| 2 — Study Mode | `…/iteration-2/pathfinding-race.html` | rendered from `…/iteration-2/{…}.md` |
| 3 — Apple restyle | `…/iteration-3/pathfinding-race.html` | rendered from `…/iteration-3/{…}.md` |

Part 1 docs: rendered from `dp-explainer-deck/llm-dev-cycle-artifacts/{review,brainstorm,research,plan,execute,verify}.md`.

## Security Posture

- Static, offline, no inputs/auth/secrets/network. Surface unchanged.
- Iframes load **only our own** self-contained local files (artifacts + `--embed-resources` docs) —
  no third-party/remote code, no new trust boundary. Consider a `sandbox` attribute on doc iframes
  (docs need no script); artifact iframes need `allow-scripts` to run.
- `target="_blank"` links keep `rel="noopener"` (matches existing).

## Key Technical Decisions (carry to Plan)

1. **Render cycle `.md` → standalone styled `.html` via committed `pandoc` script**; link/iframe the
   `.html`, never raw `.md`. Theme = deck's cream/navy/gold slide palette, tuned for readability.
2. **Two-column slide layout** (new CSS, likely in `assets/styles.css`): `.split` with a left
   `.bubbles`/`.highlights` column + → arrow and a right `.pane` holding a fixed-height
   **scrollable `<iframe>`**.
3. **Iframe for in-slide display** (supersedes "no iframes") + keep **open-in-new-tab** links.
   `sandbox` on doc iframes; `allow-scripts` on artifact iframes.
4. **`file://` iframe rendering is the key Verify checkpoint**, with a link-only/static-image
   fallback. Pages is robust.
5. **No new runtime deps; pandoc is build-time only.** Offline guard re-checked in Verify.
6. **Reuse existing artifact paths; generate only the rendered doc HTML** (location finalized in
   Plan; proposal: `rendered/` beside each cycle-artifacts dir).
