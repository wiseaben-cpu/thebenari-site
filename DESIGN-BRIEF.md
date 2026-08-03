# Claude Design brief — benjiwise.com

**Paste everything under "Standing rules" into Claude Design at the start of a design session.**
It tells the designer about constraints it can't see, so its export drops cleanly into this repo
instead of fighting it.

If code-side edits have happened since the last export, also run:

```bash
./scripts/design-brief.sh
```

That prints these rules *plus* a diff of what changed in code, so Claude Design isn't
redesigning around edits it doesn't know exist.

---

## Standing rules

> This design is published as a static site at **benjiwise.com**, from a git repo. It gets edited
> from two directions: visually by you, and directly in code. A tool merges your export with the
> code-side edits, and that merge only works if you follow these:
>
> 1. **Keep filenames and folder structure exactly as they are** — `index.html`, `benari.html`,
>    `signal-desk.html`, `support.js`, `assets/`, `race-board/`, `_ds/`. A renamed or moved file
>    reads as "deleted and replaced," which throws away any code-side edits to it.
>
> 2. **Don't add `<title>`, `<meta>`, favicon, or Open Graph / social tags.** Those are injected at
>    publish time from a separate file. If you add them, every single export collides on the same
>    lines and needs manual fixing.
>
> 3. **Change only what I ask you to change.** Don't reformat, reindent, reorder, minify, or
>    otherwise tidy sections I didn't ask about. A whole-file reflow looks like "every line
>    changed" and destroys the ability to merge code-side edits — this is the single most
>    important rule here.
>
> 4. **Keep the design-system folder name stable:**
>    `_ds/thebenari-design-system-55844aa4-140a-4eb8-aef7-3ad1426228bc/`. A new UUID leaves the old
>    folder behind as dead weight and invalidates every stylesheet path.
>
> 5. **Every page must keep loading `support.js`.** It renders the pages client-side — without it
>    they render blank.
>
> 6. **Mobile matters.** The site is read on phones. Keep tap targets at least 44px and check the
>    layout at 390px wide.
>
> When you're done, export the site as a zip. I'll handle publishing.

---

## What happens to your export

1. `scripts/sync-from-export.sh <zip>` unpacks it over the repo.
2. Code-side edits are merged back on top (three-way merge against `.export-baseline/`).
3. `<head>` metadata is re-injected from `scripts/page_meta.py`.
4. Local preview, then push to `main` — GitHub Pages publishes within a minute.

Rules 1–4 above exist because each one, if broken, turns step 2 from automatic into manual.
