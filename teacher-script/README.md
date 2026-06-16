# Teacher Script (Teacher Supplement) toolkit

Generate a teacher-facing **presentation script** — a slide-by-slide
*Say / Ask / Expected Responses / Teacher Do* walkthrough — as an editable Word
`.docx` to ship alongside any deck. It is written so a non-specialist or a
substitute can deliver the lesson confidently.

This is the **full teacher script**, distinct from the deck's built-in presenter
speaker notes (the `#speaker-notes` JSON block read by `deck-stage.js`): those
are a few private cues for whoever is clicking through slides; this `.docx` is
the complete teaching script, with board work and expected student answers.

## Two ways to make one

**A · Author in Markdown, then build (recommended; agent-friendly).**

1. Copy `teacher-script-template.md` next to your deck and rename it
   `teacher-script.md`.
2. Fill in one block per slide — or have an agent draft it from the deck's
   slides and speaker notes, then review it.
3. Build the `.docx`:

   ```
   # macOS / Linux
   bash teacher-script/build-teacher-script.sh path/to/teacher-script.md

   # Windows (PowerShell)
   pwsh teacher-script/build-teacher-script.ps1 path\to\teacher-script.md
   ```

   This writes `teacher-script.docx` beside the `.md`. Re-run after edits — it
   is idempotent. The `.sh` and `.ps1` behave identically.

**B · Type into the Word template (no tools needed).**

Open `teacher-script-template.docx` in Word and type your script straight into
the per-slide blocks. For teachers who do not want to touch Markdown or a
terminal — same on macOS and Windows.

## Format

One block per slide, in deck order:

- **Note** — what is on the slide / what to look at first.
- **Say** — what the teacher says (read aloud or paraphrase).
- **Ask** — a question for the class, with **Expected Student Responses**.
- **Teacher Do** — board work or actions (write a term, draw a diagram).

Mix the moves as the slide needs; a slide can have several Say/Ask blocks. Keep
meaning checks short and frequent. This follows the course's
`teacher-supplement-template.md` deliverable spec.

## Requirements

- [pandoc](https://pandoc.org):
  - **macOS:** `brew install pandoc`
  - **Windows:** `winget install --id JohnMacFarlane.Pandoc` (or `choco install pandoc`)
  - **Linux:** your package manager (e.g. `apt install pandoc`)
- A shell to run the build script: macOS/Linux use `build-teacher-script.sh`;
  **Windows** uses `build-teacher-script.ps1` (PowerShell ships with Windows —
  no Git Bash or WSL required).
- Optional: drop a `reference.docx` next to the build script to control the Word
  styling (fonts, heading styles) via pandoc's `--reference-doc`.
