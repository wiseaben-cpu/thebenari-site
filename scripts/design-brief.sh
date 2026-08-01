#!/usr/bin/env bash
# Print the Claude Design brief, plus whatever changed in code since the last export.
#
#   ./scripts/design-brief.sh              # to the terminal
#   ./scripts/design-brief.sh | pbcopy     # straight to the clipboard, ready to paste
#
# Why the diff half exists: Claude Design iterates on its own last state and has no
# idea this repo exists. If code-side edits have landed since its last export, it
# keeps redesigning around changes it can't see — and the next export fights them.
# Pasting this in tells it what it missed.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE="$REPO/.export-baseline"

cat "$REPO/DESIGN-BRIEF.md"

echo
echo "---"
echo

if [[ ! -d "$BASELINE" ]]; then
  echo "## Changed in code since your last export"
  echo
  echo "_No baseline recorded yet — run a sync first._"
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Compare like-for-like: strip the injected <head> metadata so it doesn't show up
# as a code-side edit on every single run.
while IFS= read -r -d '' path; do
  rel="${path#$BASELINE/}"
  [[ -f "$REPO/$rel" ]] || continue
  mkdir -p "$TMP/$(dirname "$rel")"
  cp "$REPO/$rel" "$TMP/$rel"
done < <(find "$BASELINE" -type f -print0)
find "$TMP" -name '*.html' -exec python3 "$REPO/scripts/apply_meta.py" --strip {} + >/dev/null 2>&1 || true

diff_out="$(diff -ru "$BASELINE" "$TMP" 2>/dev/null || true)"

echo "## Changed in code since your last export"
echo
if [[ -z "$diff_out" ]]; then
  echo "_Nothing — the repo matches your last export. Design from where you left off._"
else
  echo "These edits were made directly in code after your last export. Please keep them"
  echo "in place and design around them:"
  echo
  echo '```diff'
  # Paths are noise to the designer; show them relative to the site root.
  echo "$diff_out" | sed -e "s|$BASELINE/||g" -e "s|$TMP/||g"
  echo '```'
fi
