#!/usr/bin/env bash
# build-teacher-script.sh — turn a Markdown teacher script into a Word (.docx)
# Teacher Supplement you can hand to any teacher delivering the deck.
#
# WHY THIS EXISTS:
#   Every deck ships with a teacher-facing "presentation script" — a slide-by-
#   slide Say / Ask / Expected-Responses / Teacher-Do walkthrough so a non-
#   specialist (or a substitute) can teach the lesson confidently. Teachers want
#   this as an editable .docx, not HTML. We author the script in Markdown (easy
#   to draft, diff, and review in git) and render the .docx at build time.
#
# Properties:
#   - Build-time only (pandoc); the committed .docx is what ships beside the deck.
#   - Idempotent: re-run after editing the .md; re-running yields the same .docx.
#   - Each <name>.md renders to a sibling <name>.docx.
#   - If a reference.docx sits next to this script, it is used as the Word style
#     template (fonts, heading styles) via --reference-doc.
#
# Usage:
#   bash build-teacher-script.sh [TARGET ...]
#     TARGET = a .md file or a directory (scanned recursively for *.md).
#     With no TARGET, rebuilds teacher-script-template.docx from the template.
#
# Requires: pandoc  (macOS: brew install pandoc)
set -euo pipefail

# Reproducible output: without SOURCE_DATE_EPOCH, pandoc stamps the .docx zip
# entries with the current time, so every rebuild differs in git. Pin it
# (overridable) so re-running yields byte-identical output.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REF="$SCRIPT_DIR/reference.docx"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found (macOS: brew install pandoc)" >&2
  exit 1
fi

# Optional Word style template — used only if present.
REF_ARGS=()
[ -f "$REF" ] && REF_ARGS=(--reference-doc "$REF")

# Default target: regenerate the fill-in template's .docx.
TARGETS=("$@")
[ "${#TARGETS[@]}" -gt 0 ] || TARGETS=("$SCRIPT_DIR/teacher-script-template.md")

render_one() {
  local md="$1"
  local out="${md%.md}.docx"
  # --from gfm-tex_math_dollars: keep literal "$20" / "$55k" from parsing as TeX math.
  pandoc "$md" \
    --from gfm-tex_math_dollars \
    --to docx \
    ${REF_ARGS[@]+"${REF_ARGS[@]}"} \
    --output "$out"
  printf '  built  %s\n' "$out"
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

echo "done: $count teacher script(s) built."
