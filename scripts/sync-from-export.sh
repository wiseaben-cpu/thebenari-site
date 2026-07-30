#!/usr/bin/env bash
# Sync a Claude design export (.zip) into this repo, safely.
#
#   ./scripts/sync-from-export.sh ~/Downloads/"Landing page portfolio plan.zip"
#
# Then review `git diff --stat`, and push when it looks right.
#
# Why this exists: a raw export is missing .nojekyll (site renders unstyled),
# CNAME (custom domain detaches), and all <head> metadata. Overwriting the repo
# with an export by hand silently breaks the live site. This script replaces the
# content, protects those files, drops files the export no longer has (e.g. an old
# _ds/<uuid>/ folder), and re-applies the metadata.

set -euo pipefail

ZIP="${1:-}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -z "$ZIP" || ! -f "$ZIP" ]]; then
  echo "usage: $0 <path-to-export.zip>" >&2
  exit 2
fi

if [[ -n "$(git -C "$REPO" status --porcelain)" ]]; then
  echo "ERROR: working tree is dirty. Commit or stash first so the sync diff is readable." >&2
  git -C "$REPO" status --short >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ extracting $(basename "$ZIP")"
unzip -q "$ZIP" -d "$TMP/x"

# Exports wrap everything in a single top-level dir (deploy/). Find whichever
# directory actually holds index.html rather than assuming the name.
SRC="$(dirname "$(find "$TMP/x" -name index.html -maxdepth 3 -print -quit)")"
if [[ -z "$SRC" || ! -f "$SRC/index.html" ]]; then
  echo "ERROR: no index.html found in the zip — is this a site export?" >&2
  exit 1
fi
echo "→ source: ${SRC#$TMP/x/}"

# --delete removes files the export dropped. Excluded paths are NOT deleted
# (that needs --delete-excluded), which is exactly how the protected files survive.
echo "→ syncing into repo"
rsync -a --delete \
  --exclude '.git/' \
  --exclude '.nojekyll' \
  --exclude 'CNAME' \
  --exclude 'README.md' \
  --exclude 'scripts/' \
  "$SRC"/ "$REPO"/

# Belt and braces: recreate the two files whose absence breaks the live site.
[[ -f "$REPO/.nojekyll" ]] || { : > "$REPO/.nojekyll"; echo "  recreated .nojekyll"; }
[[ -f "$REPO/CNAME" ]] || { echo "thebenari.com" > "$REPO/CNAME"; echo "  recreated CNAME"; }

echo "→ re-applying head metadata"
python3 "$REPO/scripts/apply_meta.py"

echo "→ verifying"
fail=0
for f in .nojekyll CNAME index.html support.js; do
  [[ -e "$REPO/$f" ]] || { echo "  MISSING: $f" >&2; fail=1; }
done
grep -q '^thebenari\.com$' "$REPO/CNAME" || { echo "  CNAME content wrong" >&2; fail=1; }
for f in index.html benari.html signal-desk.html; do
  [[ -f "$REPO/$f" ]] && { grep -q '<title>' "$REPO/$f" || { echo "  no <title> in $f" >&2; fail=1; }; }
done
# Every page needs the runtime or it renders blank.
grep -q 'support\.js' "$REPO/index.html" || { echo "  index.html lost support.js" >&2; fail=1; }
(( fail == 0 )) && echo "  all checks passed"

echo
echo "── changes ──"
git -C "$REPO" status --short
echo
echo "Next: preview locally with"
echo "  cd $REPO && python3 -m http.server 8899   # then open http://127.0.0.1:8899"
echo "Then commit and push to publish."
exit $fail
