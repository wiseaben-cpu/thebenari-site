# CLAUDE.md

> Read automatically at the start of every session in this repo. Keep it short and authoritative.

## ⚠️ This file wins inside this folder

This repo sits **nested inside the `benji.ai` checkout** (`~/dev/benji.ai/thebenari-site`) purely
for convenience. It is a **separate git repo with its own remote**, gitignored by the parent — the
two never share history.

Because Claude Code reads `CLAUDE.md` from the working directory upward, the parent's
`benji.ai/CLAUDE.md` also loads here. **Where they disagree, this file governs anything under this
folder.** The one that actually bites:

| Topic | `benji.ai` says | **Here** |
|---|---|---|
| Git workflow | never commit to `main`; branch + PR always | **commit to `main` directly; there is no PR flow** |
| Pushing | routine, reversible | **push IS the production deploy** — owner's call |

Everything else in the parent (how to talk to the owner, no secrets, keep docs current) still
applies. Anything about the orchestrator, MCP servers, Postgres, Railway, or the agent registry is
irrelevant here — this is a static website.

## What this is

The public portfolio site for Benji Wise, live at **https://thebenari.com**. Static files, **no
build step** — what's committed is what ships, served by GitHub Pages from `main` at the repo root.

Deliberately a **separate repo** from `benji.ai`, even though it sits inside that folder. That one
is private and tracks CRM notes, journals, and secrets; this one *must* be public, because GitHub
Pages won't serve a private repo on the free plan. Nesting on disk is fine — **merging the two
repos is not**, in either direction.

## Working with the owner

Ben is an **intermediate "vibe coder"** — strong at directing the product, reads code at a high
level, limited depth on infra and tooling. Explain technical choices in plain language, define
jargon, and **make the call yourself with a stated reason** rather than handing over an
unexplained fork. Never assume git fluency.

## This repo is PUBLIC

Everything committed here is world-readable. Never add API keys, tokens, `.env` contents,
customer or contact data, or anything copied out of the `benji.ai` vault (`CRM/`, `Journal/`,
`Archive/`). When in doubt, it doesn't go here.

## Core invariants (do not break)

- **`support.js` must ship with the HTML and stay referenced by every page.** The pages use
  non-standard markup (`<x-dc>`, `<helmet>`, `style-hover="…"`) that only it understands, and it
  renders them client-side. Break its path and every page renders blank.
- **`.nojekyll` must stay in the repo root.** GitHub Pages runs Jekyll by default, and Jekyll
  excludes any directory starting with `_` — without this file the entire `_ds/` design system
  404s and the site renders unstyled.
- **`CNAME` must stay, containing `thebenari.com`.** Remove it and the custom domain detaches.
  GitHub itself sometimes commits `Delete CNAME` / `Create CNAME` pairs — that's normal; rebase
  onto them rather than fighting it.
- **`<head>` metadata lives in `scripts/page_meta.py`, never in the HTML.** Exports overwrite the
  HTML; that file survives. Edit copy there, then run `python3 scripts/apply_meta.py`.
- **Never hand-drag an export in.** Always `./scripts/sync-from-export.sh <zip>` — it protects the
  files above, drops files the export removed, three-way merges code-side edits, and re-applies
  metadata. Doing it by hand silently breaks the live site.
- **Never edit `.export-baseline/` by hand.** The sync script owns it; it's the merge base.
- **DNS lives at GoDaddy and the domain carries live Google Workspace email.** Only ever touch
  `A`/`CNAME` records — never `MX` or `TXT`.

## The edit loop

This site is edited from two directions, and neither clobbers the other:

- **Visually in Claude Design** → paste `./scripts/design-brief.sh | pbcopy` into the session
  first (it carries the constraints *plus* a diff of anything changed in code since the last
  export) → export the zip → drop it anywhere, including this folder (`*.zip` is gitignored and
  the sync script leaves it alone) → sync.
- **Directly in code** → just edit and commit. `.export-baseline/` lets the next sync merge those
  edits back on top of the new design instead of overwriting them.

On conflict, the script leaves standard markers, lists the files, and **exits non-zero** so the
verify step fails — a conflicted file can't be published by accident. Resolve, then re-verify.

## Commands

| Action | Command |
|--------|---------|
| Sync a design export | `./scripts/sync-from-export.sh "<export>.zip"` |
| Brief for Claude Design | `./scripts/design-brief.sh \| pbcopy` |
| Re-apply `<head>` metadata | `python3 scripts/apply_meta.py` |
| Strip to raw-export form | `python3 scripts/apply_meta.py --strip` |
| Preview locally | `python3 -m http.server 8899` → http://127.0.0.1:8899 |
| Verify responsive | Playwright at 390px — Chrome's `resize_window` is ignored when the window is maximized |

## Git workflow

**No branch/PR flow here** (unlike `benji.ai`) — this repo publishes straight from `main`.
Commit locally as work completes, but **pushing is the deploy**: `git push` puts it live within
about a minute. Treat the push as the owner's call — line it up, then ask. Always preview
locally first.

## Always

- Preview at **both** 390px and 1440px before publishing; the site is read on phones.
- After any sync, confirm the diff is only what you expected — no lost `<head>` metadata, no
  dropped `support.js`, no conflict markers.
- Update `README.md` in the same change as any workflow modification.

## Known gaps

- `benari.html` and `signal-desk.html` have **no phone breakpoints** (smallest are 1360px and
  1280px). Only `index.html` has a mobile layout. Worth a design round.
- No `og:image`, so shared links show a text-only preview card. Needs a 1200×630 PNG.
- Client-rendered, so pages are blank until JS runs — weaker search indexing.
- `race-board/race.json` is mock data (`"mock": true`, fictional names).
