"""Head metadata for each page, re-applied after every design export.

Claude design exports ship pages with no <title> and no social tags, so this data
lives here instead of in the HTML — the HTML gets overwritten on every export, this
file does not. Edit copy here, not in the exported HTML, or the next sync loses it.
"""

SITE_NAME = "The BenAri"
BASE = "https://thebenari.com"
FAVICON = "assets/flock-blue.svg"  # blue reads on both light and dark tab bars

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
    },
}
