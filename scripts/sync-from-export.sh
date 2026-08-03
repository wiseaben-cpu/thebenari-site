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
#
# It also three-way merges, so this site can be edited from BOTH directions —
# visually in Claude Design, and directly in code. .export-baseline/ holds a
# pristine copy of the last export; comparing {baseline, new export, repo} lets
# the script tell "the designer changed this" apart from "I changed this in code"
# and keep both. Without it, every export silently reverted all code-side edits.

set -euo pipefail

ZIP="${1:-}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE="$REPO/.export-baseline"

# The custom domain GitHub Pages serves, and the sole contents of CNAME. Defined once
# because it appears in two places below — the recreate fallback and the verify check —
# and in August 2026 the site moved from thebenari.com to benjiwise.com with only CNAME
# itself updated. That left the fallback ready to rewrite CNAME to the *old* domain
# (which now 404s, detaching the live site) and the verify check failing on every sync.
# A guard that always fails is a guard everyone learns to ignore. Change it here only.
SITE_DOMAIN="benjiwise.com"

# Paths the export does not own. rsync --delete would otherwise remove them, because
# "absent from the export" and "should be deleted" look identical to it. Everything here
# is authored in the repo, not by Claude Design.
#
# 2026-08-01: this list silently fell behind reality. An export was about to delete
# robots.txt, sitemap.xml, llms.txt, all three og-*.png cards and CLAUDE.md — the whole
# search/AI-discoverability layer — because they were added after the list was written.
# Hence the guard in unprotected_deletions() below: a stale list must fail loudly, not quietly.
PROTECTED=(
  '.git/' '.gitignore' '*.zip' '.export-baseline/'
  '.nojekyll' 'CNAME'                 # absence breaks hosting outright
  'README.md' 'DESIGN-BRIEF.md' 'CLAUDE.md' 'scripts/'
  'robots.txt' 'sitemap.xml' 'llms.txt'   # crawler files, hand-authored
  'assets/og-*.png'                       # social cards, hand-drawn
)

is_protected() {
  local path="$1" pat
  for pat in "${PROTECTED[@]}"; do
    case "$pat" in
      */) [[ "$path" == "${pat}"* ]] && return 0 ;;
      *)  [[ "$path" == $pat ]] && return 0 ;;
    esac
  done
  return 1
}

# Tracked files the export lacks and PROTECTED doesn't cover — i.e. what --delete would eat.
unprotected_deletions() {
  local src="$1" f
  git -C "$REPO" ls-files | while IFS= read -r f; do
    is_protected "$f" && continue
    [[ -e "$src/$f" ]] || echo "$f"
  done
}

# Files a human might plausibly hand-edit. Everything else (fonts, audio, SVG
# marks, the generated _ds/ bundle) takes the export version wholesale.
mergeable() {
  case "$1" in
    _ds/*|.export-baseline/*) return 1 ;;
    *.html|*.css|*.js|*.json) return 0 ;;
    *) return 1 ;;
  esac
}

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

# Refuse to delete repo-authored files just because this export doesn't carry them.
doomed="$(unprotected_deletions "$SRC")"
if [[ -n "$doomed" ]]; then
  echo "ERROR: this export would DELETE tracked files that it doesn't contain:" >&2
  printf '  %s\n' $doomed >&2
  echo >&2
  echo "If they're repo-authored (crawler files, social cards, docs), add them to" >&2
  echo "PROTECTED at the top of this script and re-run. If the export genuinely" >&2
  echo "dropped them on purpose, delete them in a separate commit first." >&2
  exit 1
fi

# Snapshot the repo's current mergeable files BEFORE rsync overwrites them, in
# stripped ("export form") so they compare like-for-like against a raw export.
# Without the strip, the injected <head> block would conflict on every run.
echo "→ snapshotting current files"
MINE="$TMP/mine"
mkdir -p "$MINE"
while IFS= read -r rel; do
  mergeable "$rel" || continue
  mkdir -p "$MINE/$(dirname "$rel")"
  cp "$REPO/$rel" "$MINE/$rel"
done < <(git -C "$REPO" ls-files)
find "$MINE" -name '*.html' -exec python3 "$REPO/scripts/apply_meta.py" --strip {} + >/dev/null

# --delete removes files the export dropped. Excluded paths are NOT deleted
# (that needs --delete-excluded), which is exactly how the protected files survive.
echo "→ syncing into repo"
excludes=()
for pat in "${PROTECTED[@]}"; do excludes+=(--exclude "$pat"); done
rsync -a --delete "${excludes[@]}" "$SRC"/ "$REPO"/

# Belt and braces: recreate the two files whose absence breaks the live site.
[[ -f "$REPO/.nojekyll" ]] || { : > "$REPO/.nojekyll"; echo "  recreated .nojekyll"; }
[[ -f "$REPO/CNAME" ]] || { echo "$SITE_DOMAIN" > "$REPO/CNAME"; echo "  recreated CNAME"; }

# Three-way merge: reapply code-side edits on top of the new export. The repo now
# holds the export verbatim, so merging {mine, baseline, repo} into the repo file
# keeps whichever side actually changed each region.
conflicts=()
if [[ -d "$BASELINE" ]]; then
  echo "→ merging code-side edits"
  merged=0
  while IFS= read -r -d '' path; do
    rel="${path#$MINE/}"
    [[ -f "$BASELINE/$rel" && -f "$REPO/$rel" ]] || continue
    cmp -s "$MINE/$rel" "$BASELINE/$rel" && continue   # no code-side edit; export wins
    # Arg order is (current, base, other) and the result overwrites `current`.
    # Current is the repo file, which rsync just replaced with the new export.
    if git merge-file -L "new export" -L "last export" -L "your code edits" \
         "$REPO/$rel" "$BASELINE/$rel" "$path" >/dev/null 2>&1
    then
      echo "  merged     $rel"
    else
      echo "  CONFLICT   $rel" >&2
      conflicts+=("$rel")
    fi
    merged=$((merged + 1))
  done < <(find "$MINE" -type f -print0)
  (( merged == 0 )) && echo "  no code-side edits to merge"
else
  echo "→ no baseline yet — seeding it from this export (no merge on first run)"
fi

# The new export becomes the baseline for next time. Copy from the raw zip, not
# the repo, so metadata and merge results never leak into the baseline. Only
# mergeable files are kept — storing fonts and audio here would double the repo
# for no benefit, since binaries never merge.
echo "→ recording baseline"
rm -rf "$BASELINE"
while IFS= read -r -d '' path; do
  rel="${path#$SRC/}"
  mergeable "$rel" || continue
  mkdir -p "$BASELINE/$(dirname "$rel")"
  cp "$path" "$BASELINE/$rel"
done < <(find "$SRC" -type f -print0)

echo "→ re-applying head metadata"
python3 "$REPO/scripts/apply_meta.py"

echo "→ verifying"
fail=0
for f in .nojekyll CNAME index.html support.js; do
  [[ -e "$REPO/$f" ]] || { echo "  MISSING: $f" >&2; fail=1; }
done
grep -qx "$SITE_DOMAIN" "$REPO/CNAME" || { echo "  CNAME is not $SITE_DOMAIN" >&2; fail=1; }
for f in index.html benari.html signal-desk.html; do
  [[ -f "$REPO/$f" ]] && { grep -q '<title>' "$REPO/$f" || { echo "  no <title> in $f" >&2; fail=1; }; }
done
# Every page needs the runtime or it renders blank.
grep -q 'support\.js' "$REPO/index.html" || { echo "  index.html lost support.js" >&2; fail=1; }
# A conflicted file must never reach the live site.
if grep -rlq '^<<<<<<< ' "$REPO" --include='*.html' --include='*.css' --include='*.js' 2>/dev/null; then
  echo "  merge conflict markers present" >&2
  fail=1
fi
(( fail == 0 )) && echo "  all checks passed"

echo
echo "── changes ──"
git -C "$REPO" status --short

if (( ${#conflicts[@]} > 0 )); then
  echo
  echo "── CONFLICTS (${#conflicts[@]}) ──" >&2
  printf '  %s\n' "${conflicts[@]}" >&2
  echo "Both you and the design export changed the same lines. Open each file," >&2
  echo "search for '<<<<<<<', and keep the version you want. DO NOT push until clean." >&2
fi

echo
echo "Next: preview locally with"
echo "  cd $REPO && python3 -m http.server 8899   # then open http://127.0.0.1:8899"
echo "Then commit and push to publish."
exit $fail
