# build-teacher-script.ps1 — Windows / PowerShell twin of build-teacher-script.sh.
# Turns a Markdown teacher script into a Word (.docx) Teacher Supplement.
# Same behavior as the bash version; use this on Windows with no Git Bash / WSL.
#
# Properties:
#   - Build-time only (pandoc); the committed .docx is what ships beside the deck.
#   - Idempotent: re-run after editing the .md; re-running yields the same .docx.
#   - Each <name>.md renders to a sibling <name>.docx.
#   - If a reference.docx sits next to this script, it is used as the Word style
#     template (fonts, heading styles) via --reference-doc.
#
# Usage:
#   pwsh teacher-script/build-teacher-script.ps1 [TARGET ...]
#     TARGET = a .md file or a directory (scanned recursively for *.md).
#     With no TARGET, rebuilds teacher-script-template.docx from the template.
#
# Requires: pandoc
#   winget install --id JohnMacFarlane.Pandoc    (or:  choco install pandoc)

$ErrorActionPreference = 'Stop'

# Reproducible output: without SOURCE_DATE_EPOCH, pandoc stamps the .docx zip
# entries with the current time, so every rebuild differs in git. Pin it
# (overridable) so re-running yields byte-identical output.
if (-not $env:SOURCE_DATE_EPOCH) { $env:SOURCE_DATE_EPOCH = '0' }

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Ref = Join-Path $ScriptDir 'reference.docx'

if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
  Write-Error 'pandoc not found (winget install --id JohnMacFarlane.Pandoc, or choco install pandoc)'
  exit 1
}

# Optional Word style template — used only if present.
$RefArgs = @()
if (Test-Path $Ref) { $RefArgs = @('--reference-doc', $Ref) }

# Default target: regenerate the fill-in template's .docx.
$Targets = $args
if ($Targets.Count -eq 0) { $Targets = @(Join-Path $ScriptDir 'teacher-script-template.md') }

function Build-One($md) {
  $out = [System.IO.Path]::ChangeExtension($md, '.docx')
  # --from gfm-tex_math_dollars: keep literal "$20" / "$55k" from parsing as TeX math.
  pandoc $md --from gfm-tex_math_dollars --to docx @RefArgs --output $out
  Write-Host "  built  $out"
}

$count = 0
foreach ($target in $Targets) {
  if (Test-Path $target -PathType Leaf) {
    if ($target -like '*.md') { Build-One $target; $count++ }
    else { Write-Warning "skip (not .md): $target" }
  }
  elseif (Test-Path $target -PathType Container) {
    Get-ChildItem -Path $target -Recurse -Filter *.md |
      ForEach-Object { Build-One $_.FullName; $count++ }
  }
  else { Write-Warning "skip (missing): $target" }
}

Write-Host "done: $count teacher script(s) built."
