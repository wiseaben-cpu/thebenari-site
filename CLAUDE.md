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

The public portfolio site for Benji Wise, live at **https://benjiwise.com**. Static files, **no
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
- **`CNAME` must stay, containing `benjiwise.com`.** Remove it and the custom domain detaches.
  GitHub itself sometimes commits `Delete CNAME` / `Create CNAME` pairs — that's normal; rebase
  onto them rather than fighting it.
- **`<head>` metadata lives in `scripts/page_meta.py`, never in the HTML.** Exports overwrite the
  HTML; that file survives. Edit copy there, then run `python3 scripts/apply_meta.py`.
- **Never hand-drag an export in.** Always `./scripts/sync-from-export.sh <zip>` — it protects the
  files above, drops files the export removed, three-way merges code-side edits, and re-applies
  metadata. Doing it by hand silently breaks the live site.
- **Never edit `.export-baseline/` by hand.** The sync script owns it; it's the merge base.
- **Two domains, and only one of them carries email.** Both are registered at GoDaddy.
  - `benjiwise.com` — the live site. Apex `A` → the four GitHub Pages IPs, `www` CNAME →
    `wiseaben-cpu.github.io`. No `MX`; nothing to break.
  - `thebenari.com` — the former domain. Its `A` records still point at Pages but it **404s**;
    it does not redirect. GitHub Pages serves only the domain named in `CNAME` and errors on any
    other domain aimed at its IPs — an earlier note here claimed it 301s, which is wrong. A
    redirect would need GoDaddy domain forwarding. It carries **live Google Workspace email**
    (`aspmx.l.google.com`): never touch its `MX`/`TXT`, and **never let it lapse** — the site
    moving off it did not move the mailbox.
- **`signal-desk.html` publishes real financial performance.** Real money, a real brokerage
  account, broker-sourced figures. Every number on it traces to an export of the live system, and
  the disclosure text (sample size, method, price source, "not investment advice") is load-bearing
  — it can be restyled but not reworded away or dropped. Never let a design export replace those
  numbers with invented ones; the page shipped on invented figures once and it was wrong.
- **`GOOGLE_SITE_VERIFICATION` in `page_meta.py` proves site ownership to Google.** Deleting it
  un-verifies the Search Console property. It lives there, not in a `google*.html` root file,
  because the sync would delete the file form on the next export.
- **`page-transition.js` intercepts every same-origin link click.** If navigation ever breaks
  site-wide, suspect it first. It honours `prefers-reduced-motion` and skips `_blank`, downloads,
  `mailto:`/`tel:` and hash links.

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

The sync also **refuses to run** if the export would delete a tracked file that `PROTECTED` (top
of `sync-from-export.sh`) doesn't cover. That guard exists because the list fell behind reality
once and an export was about to remove `robots.txt`, `sitemap.xml`, `llms.txt`, the social cards
and this file. When you add a repo-authored file at the root, add it to `PROTECTED` too.

**Exports carry only the design.** Three exports in a row arrived with no change in them at all
(re-exports of a stale artifact), so before syncing, diff the zip against `.export-baseline/` and
confirm there is actually a delta. And paste `design-brief.sh` into Claude Design *first* — the
one export that came back carrying the real trading data was the one preceded by the brief.

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
- **Verify against the deployed site, not the local file.** A restore once shipped a broken page
  while the local file was correct: `git checkout <ref> -- index.html` stages the file, then
  `apply_meta.py` edits the working tree *after* staging, and a `git commit` without `-a` ships
  the stale staged copy. Use `commit -a` (or re-`add`) after running `apply_meta.py`, and confirm
  with `curl`/Playwright against the live URL. Grepping the local file will happily agree with you
  while production disagrees.
- **Drive the browser check by behaviour.** The bug above was invisible to every content grep and
  was caught only because a Playwright click timed out against an overlay intercepting it.

## Search / AI discoverability (do not undo)

- **The pages are NOT blank without JavaScript** — a long-standing note here claimed they were,
  and it was wrong. `support.js` adds behavior, not copy; the text ships in the static HTML and
  non-JS crawlers read it fine. Check with `curl -A ClaudeBot https://benjiwise.com/` before
  believing otherwise, because that one wrong belief makes all SEO work look pointless.
- `robots.txt`, `sitemap.xml`, `llms.txt` live at the repo root. `robots.txt` opens the site to
  AI crawlers **on purpose** — being quoted by a model is the goal here.
- `page_meta.py` requires `og_image`, `og_image_alt` and `jsonld` per page; `apply_meta.py`
  raises `KeyError` if any is missing. Loud on purpose — a missing tag is an invisible bug.
- **JSON-LD is a factual claim about a real person.** Everything in it must be traceable to copy
  on the page. Never add a job title, credential, or profile URL the site doesn't state.
- Social cards `assets/og-*.png` are hand-made, not generated. Change a title and the card goes
  stale silently.

## Useful refs

- `real-landing-page` — tag on the last commit where `index.html` was the genuine portfolio page.
  Restore with `git checkout real-landing-page -- index.html && python3 scripts/apply_meta.py`,
  then `git commit -a`. Used when the landing page is swapped for something temporary.
- A shared-password gate (`gate.js`) existed briefly and was removed. Recover from `516662a` if
  it's ever wanted again — but note it de-indexes the site, since crawlers can't pass it.

## Known gaps

- **`assets/og-signal-desk.png` is stale.** It still shows the old "walk-forward / sample data"
  framing against a page that now reports a real loss, so link previews contradict the page. Hand
  drawn, so nothing regenerates it — needs a redraw at 1200×630.
- `race-board/race.json` is mock data (`"mock": true`, fictional names).
- `support.js` pulls React + `@babel/standalone` (~2.5 MB) from unpkg at runtime, so first paint
  waits on a third-party CDN. The main performance liability; measure before touching, since the
  fix fights the design-sync loop.
- Search Console is claimed (URL-prefix property on `https://benjiwise.com/`, sitemap submitted,
  all three URLs sent for indexing on 2026-08-03). Nothing is indexed yet — the domain is days
  old and every URL reads "Discovered — currently not indexed". Give it a week before judging.
- Git pushes from this repo use `gh` for credentials via a **repo-local** config, because the
  macOS keychain serves a different GitHub account and 403s the push. If pushes start failing
  with "Permission … denied to Benji-UNCS", that's why.
