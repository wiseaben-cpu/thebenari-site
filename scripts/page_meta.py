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

# Google Search Console ownership proof. Deliberately here rather than in a
# google*.html file at the repo root: the sync script's rsync --delete removes root
# files an export doesn't contain, so the file form would vanish on the next design
# export. This rides inside the generated <head>, which apply_meta.py re-applies
# after every sync. Removing it un-verifies the property — leave it in place.
GOOGLE_SITE_VERIFICATION = "zuRqiC-9K5tdOQjKX2ikIfdAz5q7eIVNVeMeqcQYP_w"

# One node, referenced from all three pages, so scrapers merge the project pages
# into the same author entity instead of inventing three Benji Wises.
PERSON_ID = f"{BASE}/#benji-wise"
WEBSITE_ID = f"{BASE}/#website"

# Only profiles that are actually linked from index.html's footer. Adding an
# unverified handle here would be a fabricated identity claim, not a shortcut.
#
# sameAs is how a search engine decides that the "Benji Wise" here and the one on
# LinkedIn are the same person rather than two. It only pays off when the profile
# links back — a one-way claim from your own site proves nothing. GitHub carries the
# most weight of the three for a builder, and is currently the weakest link in
# practice: the wiseaben-cpu profile has no display name, no bio and no website
# field, so there is nothing on the far end for a crawler to match against yet.
SAME_AS = [
    "https://www.linkedin.com/in/benjaminwise0",
    "https://github.com/wiseaben-cpu",
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
                    # "Boston · Available 2026" in the footer, and the marquee's
                    # "Open to work 2026". Both are page copy, so both can be stated
                    # as claims — location is one of the strongest disambiguators
                    # there is for a common name.
                    "homeLocation": {"@type": "Place", "name": "Boston, Massachusetts"},
                    "seeks": {"@type": "Demand", "name": "Open to work in 2026"},
                    "knowsAbout": [
                        "Multi-agent orchestration",
                        "pgvector RAG",
                        "MCP tool servers",
                        "Live-broker trading",
                        # The page's own word for how he works, and a term people
                        # actually search. "AI writes the code; I hold the taste."
                        "Vibe coding",
                    ],
                    "sameAs": SAME_AS,
                },
                # Says outright that this page is *about* the Person above. Without
                # it a crawler has a Person node and a page and has to infer the
                # link; with it the homepage is explicitly the person's own page.
                {
                    "@type": "WebPage",
                    "@id": f"{BASE}/#webpage",
                    "url": f"{BASE}/",
                    "name": "Benji Wise — Collecting knowledge, connecting dots",
                    "isPartOf": {"@id": WEBSITE_ID},
                    "about": {"@id": PERSON_ID},
                    "mainEntity": {"@id": PERSON_ID},
                    "inLanguage": "en",
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
        # Kept the "Benari" brand word in the title even though the page's own
        # eyebrow now reads "Benji-ai": it is the name people would search, and the
        # site name is The BenAri. The rest tracks the rewritten page.
        "title": "Benari — An AI assistant that reads its own source | Benji Wise",
        "og_title": "Benari — A system that can read itself",
        "description": (
            "Benari: a personal assistant Benji Wise texts on WhatsApp, vibe-coded "
            "end to end. Thirty-four tools, six of them locked behind a typed yes, "
            "every turn measured — and it can read its own source code."
        ),
        "og_description": (
            "An assistant I text on WhatsApp. Thirty-four tools, six locked behind a "
            "typed yes, and an instrumentation layer that has found more than testing "
            "did."
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
                "A personal assistant texted over WhatsApp, vibe-coded end to end. "
                "Thirty-four tools across calendar, email, tasks and notes; anything "
                "that sends or deletes stops and waits for a typed yes, enforced in "
                "code rather than asked for in the prompt. Seventy-one named events "
                "make every turn traceable — what it recalled, what it called, how "
                "long each stage took — a layer that caught three problems no test "
                "found. Four of its tools point at its own source, so it can read its "
                "repo and commit log to explain its own behaviour. Runs 24/7; "
                "production is WhatsApp via Twilio. The thread shown on the page is "
                "scripted with invented names."
            ),
            "featureList": [
                "Thirty-four tools",
                "Confirm before send, enforced in code",
                "Seventy-one named events per turn",
                "Reads its own source",
                "Prompt caching across a turn",
                "Runs 24/7",
            ],
            "author": PERSON_REF,
        },
    },
    "signal-desk.html": {
        # Mirrors the page's own disclaimer — keep the "not investment advice" clause.
        "title": "Signal Desk — An autonomous trader that bought its worst ideas | Benji Wise",
        "og_title": "Signal Desk — It traded its own best worst ideas",
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
            # 2026-08-03: trimmed to what the rewritten page actually states. The
            # previous version asserted an alpha of −6.37%, an 8.79% max drawdown, a
            # 132/101 traded-vs-skipped split, a 40% win rate, "12 discrepancies" and
            # a private source repo — none of which appear on the page any more. The
            # page is the only source of truth for this node; when its numbers move,
            # this moves with them or it becomes a fabricated financial claim.
            "description": (
                "An autonomous trading system that screens, decides, sizes and places "
                "real orders on a live Robinhood account with no human in the loop. "
                "Over 37 trading days from 9 June to 31 July 2026 it lost 5.0% while "
                "the market rose 1.4%, across 15 round trips in one $1,500 account. "
                "The finding is not the loss: because it logged what it skipped, it "
                "can be graded against itself, and its confidence ran backwards — the "
                "picks it chose to trade are down 24.7% against 1.0% for the ones it "
                "skipped, and its high-conviction picks did worst of all at −31.3%. "
                "The cause was concentration across 25 companies from 233 "
                "recommendations and 32 filled orders; only trailing stops kept it "
                "from being a wipeout. It also caught its own books overstating the "
                "damage — a claimed $91.46 loss against the broker's $43.86 — so "
                "every published figure comes from the broker, not the app. The code "
                "was frozen on 22 June, so nothing was tuned mid-flight to flatter "
                "the record. Far too small a sample to separate a bad strategy from "
                "bad luck. Not investment advice."
            ),
            "author": PERSON_REF,
        },
    },
}
