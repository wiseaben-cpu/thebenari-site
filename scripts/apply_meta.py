#!/usr/bin/env python3
"""Re-apply <head> metadata to the exported pages. Idempotent.

Design exports have no <title>, no social tags, and no structured data. Run this
after every sync; it inserts the block from page_meta.py — title, description,
canonical, Open Graph/Twitter cards, and a schema.org JSON-LD node — replacing any
block a previous run added. Safe to run repeatedly — the second run is a no-op.

With --strip it does the exact opposite: removes everything this script adds,
returning a page to the byte-identical form the design export shipped. That
inverse is what lets sync-from-export.sh three-way merge against a raw export —
without it, every merge would collide on the injected <head> block.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from page_meta import (  # noqa: E402
    BASE,
    FAVICON,
    GOOGLE_SITE_VERIFICATION,
    PAGES,
    SITE_NAME,
)

START = "<!-- BEGIN generated head metadata (scripts/apply_meta.py) -->"
END = "<!-- END generated head metadata -->"

# The exports load the runtime with this exact tag; we insert immediately before it
# so the metadata sits inside the real <head>.
ANCHOR = '<script src="./support.js"></script>'


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def jsonld(data: dict) -> str:
    """Serialize schema.org data as a <script> tag.

    Never run esc() over this — HTML entity escaping inside a JSON-LD block
    corrupts the JSON (a parser sees the literal "&amp;", not "&"). json.dumps
    does the only escaping JSON needs; the one remaining hazard is a "</script>"
    sequence in the copy ending the block early, which "\\u003c" — a valid JSON
    escape for "<" — makes impossible without touching the parsed value.
    """
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    payload = payload.replace("<", "\\u003c")
    return f'<script type="application/ld+json">{payload}</script>'


def block(meta: dict) -> str:
    # Open Graph resolves nothing relative to the page — a relative path is simply
    # dropped by most scrapers, so image URLs are absolute even though the favicon
    # above them is not.
    image = f"{BASE}/{meta['og_image']}"
    lines = [
        START,
        f"<title>{esc(meta['title'])}</title>",
        f'<meta name="description" content="{esc(meta["description"])}">',
        # Search Console ownership. Emitted on every page so the property stays
        # verified even if the site root is not the URL Google re-checks.
        f'<meta name="google-site-verification" content="{GOOGLE_SITE_VERIFICATION}">',
        f'<link rel="canonical" href="{meta["url"]}">',
        f'<link rel="icon" href="{FAVICON}" type="image/svg+xml">',
        f'<meta property="og:type" content="{meta["og_type"]}">',
        f'<meta property="og:site_name" content="{esc(SITE_NAME)}">',
        f'<meta property="og:url" content="{meta["url"]}">',
        f'<meta property="og:title" content="{esc(meta["og_title"])}">',
        f'<meta property="og:description" content="{esc(meta["og_description"])}">',
        f'<meta property="og:image" content="{image}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(meta["og_image_alt"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(meta["og_title"])}">',
        f'<meta name="twitter:description" content="{esc(meta["og_description"])}">',
        f'<meta name="twitter:image" content="{image}">',
        jsonld(meta["jsonld"]),
        END,
    ]
    return "\n".join(lines)


def unapply(html: str) -> str:
    """Remove everything apply_to() adds. The inverse of the two edits below.

    The lang="en" revert is conditional on the generated block being present:
    apply_to() only ever touches pages in PAGES, and some export pages (the
    race-board ones) ship lang="en" of their own. Reverting unconditionally
    would corrupt those.
    """
    stripped = re.sub(
        re.escape(START) + r".*?" + re.escape(END) + r"\n?",
        "",
        html,
        flags=re.DOTALL,
    )
    if stripped == html:
        return html
    return re.sub(r'<html lang="en"((?:[^>]*)?)>', r"<html\1>", stripped, count=1)


def strip_file(path: Path) -> str:
    html = path.read_text(encoding="utf-8")
    stripped = unapply(html)
    if stripped == html:
        return f"unchanged  {path.name}"
    path.write_text(stripped, encoding="utf-8")
    return f"stripped   {path.name}"


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
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--strip",
        action="store_true",
        help="remove generated metadata instead of adding it (export form)",
    )
    parser.add_argument(
        "files",
        nargs="*",
        type=Path,
        help="files to strip; defaults to the repo's pages. --strip only.",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent

    if args.strip:
        targets = args.files or [root / name for name in PAGES]
        for path in targets:
            if path.exists():
                print(strip_file(path))
        return 0

    if args.files:
        print("ERROR: file arguments are only supported with --strip", file=sys.stderr)
        return 2

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
