#!/usr/bin/env bash
# render-markdown.sh — turn Markdown into styled, self-contained HTML you can embed
# in a deck (in a .doc-pane <iframe>) or open in a browser tab.
#
# WHY THIS EXISTS (the offline-first rule):
#   A deck must run from file:// with no server. You CANNOT fetch()/XHR a local .md
#   at runtime — browsers block local-file fetch under file:// — so a "load the .md
#   and render it in JS" viewer shows a BLANK pane offline. Instead we pre-render each
#   .md to a standalone .html at build time and embed/link THAT. The output has zero
#   runtime dependencies (CSS is inlined), so it works offline and on GitHub Pages.
#
# Properties:
#   - Build-time only (pandoc); committed output is what ships.
#   - Idempotent: re-run after editing a .md; running twice yields no new git diff.
#   - Each <doc>.md renders to a sibling <doc>.html.
#
# Usage:
#   bash scripts/render-markdown.sh [TARGET ...]
#     TARGET = a .md file or a directory (scanned recursively for *.md).
#     With no TARGET, defaults to the "docs/" folder at the deck root.
#
# Requires: pandoc  (macOS: brew install pandoc)
set -euo pipefail

# Deck root = parent of this script's dir, regardless of where it's invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DECK_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CSS="$DECK_ROOT/assets/doc.css"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found (macOS: brew install pandoc)" >&2
  exit 1
fi
[ -f "$CSS" ] || { echo "error: missing stylesheet $CSS" >&2; exit 1; }

# Default target: the deck's docs/ folder.
TARGETS=("$@")
[ "${#TARGETS[@]}" -gt 0 ] || TARGETS=("$DECK_ROOT/docs")

render_one() {
  local md="$1"
  local out="${md%.md}.html"
  # Title: first level-1 heading, else the file's basename.
  local title
  title="$(grep -m1 -E '^# ' "$md" | sed -E 's/^# +//' || true)"
  [ -n "$title" ] || title="$(basename "${md%.md}")"
  # --from gfm-tex_math_dollars: keep literal "$20" / "$55k" from parsing as TeX math.
  pandoc "$md" \
    --from gfm-tex_math_dollars \
    --to html5 \
    --standalone \
    --embed-resources \
    --css "$CSS" \
    --metadata title="$title" \
    --output "$out"
  printf '  rendered  %s\n' "${out#"$DECK_ROOT/"}"
}

count=0
for target in "${TARGETS[@]}"; do
  if [ -f "$target" ]; then
    case "$target" in *.md) render_one "$target"; count=$((count + 1));; *) echo "skip (not .md): $target" >&2;; esac
  elif [ -d "$target" ]; then
    while IFS= read -r -d '' md; do
      render_one "$md"; count=$((count + 1))
    done < <(find "$target" -type f -name '*.md' -print0)
  else
    echo "skip (missing): $target" >&2
  fi
done

echo "done: $count doc(s) rendered."
