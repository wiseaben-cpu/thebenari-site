#!/usr/bin/env python3
"""Re-apply <head> metadata to the exported pages. Idempotent.

Design exports have no <title> and no social tags. Run this after every sync; it
inserts the block from page_meta.py, replacing any block a previous run added.
Safe to run repeatedly — the second run is a no-op.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from page_meta import FAVICON, PAGES, SITE_NAME  # noqa: E402

START = "<!-- BEGIN generated head metadata (scripts/apply_meta.py) -->"
END = "<!-- END generated head metadata -->"

# The exports load the runtime with this exact tag; we insert immediately before it
# so the metadata sits inside the real <head>.
ANCHOR = '<script src="./support.js"></script>'


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def block(meta: dict) -> str:
    lines = [
        START,
        f"<title>{esc(meta['title'])}</title>",
        f'<meta name="description" content="{esc(meta["description"])}">',
        f'<link rel="canonical" href="{meta["url"]}">',
        f'<link rel="icon" href="{FAVICON}" type="image/svg+xml">',
        f'<meta property="og:type" content="{meta["og_type"]}">',
        f'<meta property="og:site_name" content="{esc(SITE_NAME)}">',
        f'<meta property="og:url" content="{meta["url"]}">',
        f'<meta property="og:title" content="{esc(meta["og_title"])}">',
        f'<meta property="og:description" content="{esc(meta["og_description"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(meta["og_title"])}">',
        f'<meta name="twitter:description" content="{esc(meta["og_description"])}">',
        END,
    ]
    return "\n".join(lines)


def apply_to(path: Path, meta: dict) -> str:
    html = path.read_text(encoding="utf-8")
    original = html

    # Drop any block a previous run inserted, so this stays idempotent.
    html = re.sub(
        re.escape(START) + r".*?" + re.escape(END) + r"\n?",
        "",
        html,
        flags=re.DOTALL,
    )

    if ANCHOR not in html:
        return f"SKIPPED {path.name}: runtime anchor not found (export format changed?)"

    html = html.replace(ANCHOR, block(meta) + "\n" + ANCHOR, 1)

    # Accessibility + correct language reporting; exports ship a bare <html>.
    # Single-quoted replacement: r"...\"en\"..." would emit literal backslashes.
    html = re.sub(r"<html(?![^>]*\blang=)([^>]*)>", r'<html lang="en"\1>', html, count=1)

    if html == original:
        return f"unchanged  {path.name}"
    path.write_text(html, encoding="utf-8")
    return f"updated    {path.name}"


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    missing = [name for name in PAGES if not (root / name).exists()]
    failures = []

    for name, meta in PAGES.items():
        path = root / name
        if not path.exists():
            continue
        result = apply_to(path, meta)
        print(result)
        if result.startswith("SKIPPED"):
            failures.append(name)

    if missing:
        print(f"\nWARNING: expected pages absent from the export: {', '.join(missing)}")
    if failures:
        print(
            "\nERROR: could not insert metadata into: "
            + ", ".join(failures)
            + "\nThe export's <head> structure changed. Fix ANCHOR in this script."
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
