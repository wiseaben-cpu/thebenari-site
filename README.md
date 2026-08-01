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

## The edit loop

This site is edited from two directions — visually in **Claude Design**, and directly in
**code**. Both work, and neither clobbers the other.

```
   ┌─ design visually ─────────┐        ┌─ or edit the code directly ─┐
   │ paste DESIGN-BRIEF.md     │        │ change the HTML/CSS in place│
   │ into Claude Design        │        │ commit                      │
   │ export the zip            │        └─────────────────────────────┘
   └───────────┬───────────────┘                       │
               ▼                                       │
   ./scripts/sync-from-export.sh <zip>  ◄──── merges both sides together
               ▼
   preview locally → git push → live in ~1 min
```

### Designing in Claude Design

Start every session by pasting in the brief, so the export stays merge-friendly:

```bash
./scripts/design-brief.sh | pbcopy    # rules + anything changed in code since last export
```

Then export the zip and sync it. **Drop the zip anywhere — including this folder**
(`*.zip` is gitignored, and the sync script leaves it alone):

```bash
cd ~/dev/thebenari-site
git status                                        # must be clean — the script refuses a dirty tree
./scripts/sync-from-export.sh "<the new export>.zip"
python3 -m http.server 8899                       # preview at http://127.0.0.1:8899
```

Then publish:

```bash
git add -A && git commit -m "design: <what changed>" && git push
```

The script is idempotent — running it twice on the same export changes nothing.

### Editing directly in code

Just edit and commit. `.export-baseline/` holds a pristine copy of the last export, so the
next sync three-way merges your edits back on top of the new design instead of overwriting
them. **Don't edit `.export-baseline/` by hand** — the script maintains it.

### If the sync reports a conflict

A conflict means you and the design export changed *the same lines*. The script leaves
standard conflict markers in place, lists the files, and **exits non-zero — the verify step
fails, so a conflicted file can't be published by accident.** Open each file, search for
`<<<<<<<`, keep the version you want, delete the markers, then re-verify:

```
<<<<<<< new export
...what Claude Design produced...
=======
...what you changed in code...
>>>>>>> your code edits
```

### Two files the export can't own

**Page titles and social-preview text live in `scripts/page_meta.py`, not in the HTML.**
The HTML is overwritten by every export; that file is not. Edit copy there, then re-run
`python3 scripts/apply_meta.py`.

If a future export changes its `<head>` structure, `apply_meta.py` prints
`SKIPPED … runtime anchor not found` and exits non-zero rather than silently publishing
untitled pages — update `ANCHOR` in that script if that happens.

`apply_meta.py --strip` is the exact inverse: it returns a page to raw-export form. The sync
script uses it so merges compare like-for-like instead of colliding on injected `<head>` tags.

## Deploying

Push to `main`. GitHub Pages rebuilds automatically, usually within a minute.

`CNAME` pins the custom domain to `thebenari.com`; leave it in place or the domain detaches on
the next push. DNS lives at GoDaddy (apex `A` records → GitHub Pages IPs, `www` CNAME →
`wiseaben-cpu.github.io`). The domain also carries **live Google Workspace email** — never touch
its `MX` or `TXT` records while editing DNS.

## Known gaps

- `race-board/race.json` is mock data (`"mock": true`, fictional names).
- `support.js` fetches React, ReactDOM and `@babel/standalone` from unpkg at runtime.
  Babel alone is ~2.5 MB, so first paint waits on a third-party CDN — the site's main
  Core Web Vitals liability. Fixing it means changing how the export bundles, which
  fights the design-sync loop, so measure in PageSpeed Insights before touching it.
- Not yet verified in Google Search Console — no impression or coverage data exists
  until the property is claimed (see below).

## Search and AI discoverability

`robots.txt`, `sitemap.xml` and `llms.txt` sit at the repo root and ship as-is. `robots.txt`
opens the site to search *and* AI crawlers by name — deliberate: this is a portfolio, so
being quoted by a model is the goal, not a leak.

Two things that are easy to get wrong:

- **The pages are NOT blank without JavaScript.** `support.js` adds behavior, not copy —
  the text is in the static HTML and crawlers that don't run JS still read it. Verify with
  `curl -A ClaudeBot https://thebenari.com/` before assuming otherwise.
- **`scripts/page_meta.py` now requires `og_image`, `og_image_alt` and `jsonld` on every
  page.** `apply_meta.py` raises `KeyError` if one is missing — deliberately loud, since a
  silently absent tag is an invisible regression. Add all three when you add a page.

The `<head>` carries schema.org JSON-LD: a `Person` on `index.html` that both project pages
reference by `@id`, so scrapers merge them into one author instead of three. Every claim in
it must be traceable to copy on the page — never add a credential or profile URL the site
itself doesn't state.

Social cards are `assets/og-*.png`, 1200×630, regenerate-by-hand (no script). If you change
a page title, the card still says the old one.
