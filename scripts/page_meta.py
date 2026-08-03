"""Head metadata for each page, re-applied after every design export.

Claude design exports ship pages with no <title> and no social tags, so this data
lives here instead of in the HTML — the HTML gets overwritten on every export, this
file does not. Edit copy here, not in the exported HTML, or the next sync loses it.

The `jsonld` values are schema.org structured data, serialized verbatim by
apply_meta.py. This is a real person's public portfolio: every claim in here must
be traceable to copy that actually appears on the page it describes. Never add a
credential, a job title, or a profile URL the page itself doesn't state.
"""

SITE_NAME = "The BenAri"
BASE = "https://benjiwise.com"
FAVICON = "assets/flock-blue.svg"  # blue reads on both light and dark tab bars

# One node, referenced from all three pages, so scrapers merge the project pages
# into the same author entity instead of inventing three Benji Wises.
PERSON_ID = f"{BASE}/#benji-wise"
WEBSITE_ID = f"{BASE}/#website"

# Only profiles that are actually linked from index.html's footer. Adding an
# unverified handle here would be a fabricated identity claim, not a shortcut.
SAME_AS = [
    "https://www.linkedin.com/in/benjaminwise0",
    "https://instagram.com/benji.wise05",
]

# The project pages cite the author rather than re-describing him; the full node
# lives on index.html and the shared @id links the two.
PERSON_REF = {
    "@type": "Person",
    "@id": PERSON_ID,
    "name": "Benji Wise",
    "url": f"{BASE}/",
}

PAGES = {
    "index.html": {
        "title": "Benji Wise — Collecting knowledge, connecting dots",
        "og_title": "Benji Wise — Collecting knowledge, connecting dots",
        "description": (
            "Optimization is the easy half. People are the hard half. I work in the "
            "gap between the two. Multi-agent orchestration, pgvector RAG, MCP tool "
            "servers, live-broker trading."
        ),
        "og_description": (
            "Optimization is the easy half. People are the hard half. I work in the "
            "gap between the two."
        ),
        "url": f"{BASE}/",
        "og_type": "website",
        "og_image": "assets/og-index.png",
        "og_image_alt": (
            "Share card for benjiwise.com: Benji Wise — collecting knowledge, "
            "connecting dots."
        ),
        "jsonld": {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Person",
                    "@id": PERSON_ID,
                    "name": "Benji Wise",
                    "url": f"{BASE}/",
                    # Both sentences are verbatim page copy (the "Currently" and
                    # "Studying" cards). No job title is claimed anywhere on the
                    # page, so none is asserted here.
                    "description": (
                        "Senior at Northeastern — business administration, finance "
                        "concentration, environmental studies minor. Optimization is "
                        "the easy half. People are the hard half. I work in the gap "
                        "between the two."
                    ),
                    "alumniOf": {
                        "@type": "CollegeOrUniversity",
                        "name": "Northeastern University",
                    },
                    "knowsAbout": [
                        "Multi-agent orchestration",
                        "pgvector RAG",
                        "MCP tool servers",
                        "Live-broker trading",
                    ],
                    "sameAs": SAME_AS,
                },
                {
                    "@type": "WebSite",
                    "@id": WEBSITE_ID,
                    "name": SITE_NAME,
                    "url": f"{BASE}/",
                    "description": (
                        "The portfolio of Benji Wise: Benari, Signal Desk, and the "
                        "sales race board."
                    ),
                    "inLanguage": "en",
                    "author": {"@id": PERSON_ID},
                    "publisher": {"@id": PERSON_ID},
                },
            ],
        },
    },
    "benari.html": {
        "title": "Benari — An AI chief of staff you text | Benji Wise",
        "og_title": "Benari — An AI chief of staff you text",
        "description": (
            "Benari: an always-on personal and executive assistant you text. An "
            "orchestrator agent routes to specialized domain sub-agents, each backed "
            "by its own MCP server."
        ),
        "og_description": (
            "An always-on personal and executive assistant you text, built on a "
            "stateless Claude brain and a registry of MCP-backed sub-agents."
        ),
        "url": f"{BASE}/benari.html",
        "og_type": "article",
        "og_image": "assets/og-benari.png",
        "og_image_alt": "Share card for Benari: an AI chief of staff you text.",
        # SoftwareApplication, not SoftwareSourceCode: the page describes a system
        # that runs (24/7, on WhatsApp via Twilio) and links no source repository.
        "jsonld": {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": f"{BASE}/benari.html#benari",
            "name": "Benari",
            "url": f"{BASE}/benari.html",
            "applicationCategory": "BusinessApplication",
            "inLanguage": "en",
            "description": (
                "An AI chief of staff you text. A stateless Claude brain reads one "
                "message, routes it to the right specialist — calendar, email, tasks, "
                "memory — and texts back like a person. A new skill is a new module, "
                "never a rewrite. Production runs on WhatsApp via Twilio; the demo on "
                "this page is an interactive recreation with fictional data."
            ),
            "featureList": [
                "Multi-agent routing",
                "pgvector memory",
                "Confirm before send",
                "MCP tool servers",
                "Runs 24/7",
            ],
            "author": PERSON_REF,
        },
    },
    "signal-desk.html": {
        # Mirrors the page's own disclaimer — keep the "not investment advice" clause.
        "title": "Signal Desk — An autonomous trader that bought its worst ideas | Benji Wise",
        "og_title": "Signal Desk — It traded its own worst ideas",
        "description": (
            "An autonomous system that placed real orders on a live brokerage account "
            "for 37 trading days. It lost 5.0% while the S&P 500 rose 1.4% — and the "
            "picks it chose to trade did far worse than the ones it passed over. Real "
            "money, broker-sourced figures, not investment advice."
        ),
        "og_description": (
            "37 trading days of real money on a live broker: down 5.0% against the "
            "S&P's +1.4%. The picks it traded lost 24.7%; the ones it passed over lost "
            "1.0%. Not investment advice."
        ),
        "url": f"{BASE}/signal-desk.html",
        "og_type": "article",
        "og_image": "assets/og-signal-desk.png",
        # NOTE: the card art still shows the old sample-data framing. It is hand-drawn,
        # so nothing regenerates it — redraw before leaning on link previews.
        "og_image_alt": (
            "Share card for Signal Desk: an autonomous trading system's live record."
        ),
        # Same reasoning as Benari — a running system, and the page says outright
        # that the source is a private repo, so SoftwareSourceCode would misdescribe
        # it. The disclaimer travels inside the description because that is the one
        # field a scraper is guaranteed to surface.
        "jsonld": {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": f"{BASE}/signal-desk.html#signal-desk",
            "name": "Signal Desk",
            "url": f"{BASE}/signal-desk.html",
            "applicationCategory": "FinanceApplication",
            "inLanguage": "en",
            "description": (
                "An autonomous trading system that screens, sizes and places real "
                "orders on a live Robinhood account, unattended. Over 37 trading days "
                "from 9 June to 31 July 2026 it returned −5.02% against the S&P 500's "
                "+1.35%, an alpha of −6.37%, with a maximum drawdown of 8.79% across "
                "15 completed round trips. Of its 233 tracked recommendations, the 132 "
                "it chose to trade are down 24.7% held to date while the 101 it passed "
                "over are down 1.0%, and its high-conviction traded picks did worst of "
                "all at −31.3%. Reconciling the app's own ledger against the broker "
                "found 12 discrepancies overstating losses by $47.61, so every figure "
                "is taken from the broker rather than the app. A record of one small "
                "personal account — not investment advice; the source is a private repo."
            ),
            "author": PERSON_REF,
        },
    },
}
