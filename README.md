# thebenari.com

The public portfolio site for Benji Wise, served at **https://thebenari.com** by GitHub Pages
from the `main` branch root.

Source of these pages: a static bundle designed in Claude Code (`Landing page portfolio plan.zip`,
2026-07-29). There is **no build step** — what's committed is what ships.

## Pages

| File | What it is |
|---|---|
| `index.html` | Landing page |
| `benari.html` | Benari — the AI chief of staff project |
| `signal-desk.html` | Signal Desk — the trading project |
| `race-board/` | Interactive sales-race-board demo (embedded in `index.html` and linked) |
| `assets/` | SVG marks |
| `_ds/` | Design-system tokens, CSS, and JS bundle |
| `support.js` | Client-side runtime the pages depend on (see below) |

## Two things not to break

**`support.js` must ship with the HTML.** These pages use non-standard markup
(`<x-dc>`, `<helmet>`, `style-hover="…"`) that only `support.js` understands, and it renders the
page client-side. Remove it, or break its path, and every page renders blank. It also pulls
React 18 + ReactDOM from `unpkg.com` at runtime, so the pages need public internet to render.

**`.nojekyll` must stay in the repo root.** GitHub Pages runs Jekyll by default, and Jekyll
excludes any directory whose name starts with `_` — without this empty file the entire `_ds/`
design system 404s and the site renders unstyled.

## Updating the site after a new Claude design export

**Do not drag export files in by hand.** An export is missing `.nojekyll` (site renders
unstyled without it), `CNAME` (custom domain detaches), and every `<head>` tag — and if the
`_ds/<uuid>/` folder gets a new UUID, the old one lingers as dead weight. Use the script;
it handles all four:

```bash
cd ~/dev/thebenari-site
git status                      # must be clean — the script refuses a dirty tree
./scripts/sync-from-export.sh ~/Downloads/"<the new export>.zip"
python3 -m http.server 8899     # preview at http://127.0.0.1:8899 before publishing
```

Then publish:

```bash
git add -A && git commit -m "design: <what changed>" && git push
```

The script is idempotent — running it twice on the same export changes nothing.

**Page titles and social-preview text live in `scripts/page_meta.py`, not in the HTML.**
The HTML is overwritten by every export; that file is not. Edit copy there, then re-run
`python3 scripts/apply_meta.py`.

If a future export changes its `<head>` structure, `apply_meta.py` prints
`SKIPPED … runtime anchor not found` and exits non-zero rather than silently publishing
untitled pages — update `ANCHOR` in that script if that happens.

## Deploying

Push to `main`. GitHub Pages rebuilds automatically, usually within a minute.

`CNAME` pins the custom domain to `thebenari.com`; leave it in place or the domain detaches on
the next push. DNS lives at GoDaddy (apex `A` records → GitHub Pages IPs, `www` CNAME →
`wiseaben-cpu.github.io`). The domain also carries **live Google Workspace email** — never touch
its `MX` or `TXT` records while editing DNS.

## Known gaps

- No `og:image`, so shared links show a text-only preview card. Needs a 1200×630 PNG.
- Client-rendered, so the page is blank until JS runs — weaker search indexing.
- `race-board/race.json` is mock data (`"mock": true`, fictional names).
