#!/usr/bin/env bash
# render-cycle-docs.sh — generate styled, self-contained HTML for every llm-dev:cycle
# artifact doc that Deck 2 links to, so the deck never links raw .md (which renders
# unformatted in a browser).
#
# - Renders with pandoc (build-time only; output has no runtime dependency).
# - Output is committed: GitHub Pages must serve these .html files.
# - Idempotent: re-run after editing any .md; running twice yields no git diff.
# - Scoped to the two WORKED-EXAMPLE folders only — NOT the deck's own
#   llm-dev-cycle-artifacts/ (those meta-cycle docs aren't linked from the deck).
#
# Usage:  bash scripts/render-cycle-docs.sh
set -euo pipefail

# Deck root = parent of this script's dir, regardless of where it's invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DECK_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CSS="$SCRIPT_DIR/cycle-doc.css"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found (brew install pandoc)" >&2
  exit 1
fi

# Subtrees whose cycle artifacts are linked by the deck.
ROOTS=(
  "$DECK_ROOT/dp-explainer-deck/llm-dev-cycle-artifacts"
  "$DECK_ROOT/search-alg-artifact/llm-dev-cycle-artifacts"
)

count=0
for root in "${ROOTS[@]}"; do
  [ -d "$root" ] || { echo "skip (missing): $root" >&2; continue; }
  # -print0 / read -d '' to be safe with any spaces in paths.
  while IFS= read -r -d '' md; do
    out="${md%.md}.html"
    # Title: first level-1 heading, else the file's basename.
    title="$(grep -m1 -E '^# ' "$md" | sed -E 's/^# +//' || true)"
    [ -n "$title" ] || title="$(basename "${md%.md}")"
    # Disable tex_math_dollars so literal "$20" / "$55k" aren't parsed as math.
    pandoc "$md" \
      --from gfm-tex_math_dollars \
      --to html5 \
      --standalone \
      --embed-resources \
      --css "$CSS" \
      --metadata title="$title" \
      --output "$out"
    count=$((count + 1))
    printf '  rendered  %s\n' "${out#"$DECK_ROOT/"}"
  done < <(find "$root" -type f -name '*.md' -print0)
done

echo "done: $count doc(s) rendered."
