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
BASE = "https://thebenari.com"
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
            "Share card for thebenari.com: Benji Wise — collecting knowledge, "
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
        "title": "Signal Desk — A trading bot, then LLM agents | Benji Wise",
        "og_title": "Signal Desk — A trading bot, then LLM agents",
        "description": (
            "A momentum trading system, walk-forward tested net of 35 bps, with LLM "
            "agents trading a live broker over MCP. Illustrative sample data — not "
            "investment advice."
        ),
        "og_description": (
            "A momentum trading system, walk-forward tested net of 35 bps. "
            "Illustrative sample data — not investment advice."
        ),
        "url": f"{BASE}/signal-desk.html",
        "og_type": "article",
        "og_image": "assets/og-signal-desk.png",
        "og_image_alt": (
            "Share card for Signal Desk: a momentum trading system, walk-forward "
            "tested."
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
                "Built a trading bot, then disproved it. LLM agents trading a live "
                "broker over MCP posted a 62% win rate but an out-of-sample "
                "information coefficient of 0.006 — bull-market beta, not skill — so "
                "the system was rebuilt on momentum, which holds out-of-sample "
                "(IC 0.13), walk-forward tested net of 35 bps. Illustrative sample "
                "data — not investment advice; the real system is a private repo."
            ),
            "author": PERSON_REF,
        },
    },
}
