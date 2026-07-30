# The BenAri Design System

Design system for **The BenAri.com** — a public-facing AI/creative portfolio for BenAri, covering
three kinds of work: **AI projects**, **experiences & events**, and **creative projects**.

The identity is a bold, editorial, poster-like system: flat grounds (ink black, warm cream,
signal blue), oversized all-caps grotesque display type, justified small-caps meta labels, and a
single figurative asset — a **flock of geese in flight** — used as the brand mark and as
atmospheric, oversized graphic punctuation.

## Sources given

All source material was delivered as SVG uploads (no codebase, no Figma file, no live site).

| File | What it is |
| --- | --- |
| `uploads/1.svg` … `uploads/10.svg` | A 10-slide **brand-strategy deck template**, 1920×1080, text outlined to paths (originally set in Helvetica Now Display; the system uses Archivo instead — see Type). Slides: title, introduction, about the brand, body spread, target audience, mood board, body spread, our approach, implementation, thank you. Copy is Lorem-ipsum placeholder — the layouts, palette and type scale are the real signal. |
| `uploads/blue.svg`, `uploads/cream.svg` | The **flock mark**: three geese in flight. Blue `#0054C1` and cream `#FBF4EF` versions. |
| `uploads/single 2.svg`, `uploads/single 3.svg`, `uploads/IMG_1667.svg` | The three individual bird silhouettes (glide / land / climb), solid black, no fill attribute. |

Copied into `assets/` as `logo.svg`, `flock-blue.svg`, `flock-cream.svg`, `bird-glide.svg`,
`bird-land.svg`, `bird-climb.svg`.

**No product UI, no site code, and no written copy were provided.** The UI kit in
`ui_kits/portfolio-site/` is therefore built by extending the deck's own visual language to web
surfaces — it is not a recreation of an existing site. Treat it as the proposed system, and
correct it against the real site when that becomes available.

---

## CONTENT FUNDAMENTALS

The deck's own copy is placeholder, so tone below is derived from its *structure* — the labelling,
casing, and hierarchy — plus the portfolio brief. Confirm and extend with real copy.

**Structure over adjectives.** Every slide is a numbered, labelled unit: a tiny uppercase index
(`01`, `02`) at the top-left of a column, a short uppercase category tag (`CONCEPT`, `BRAND`,
`MOOD`) at the top-right, then justified body text. Web copy follows the same pattern: label,
then substance.

**Casing**
- Display headlines: **ALL CAPS**, no terminal punctuation. `BRAND STRATEGY` · `OUR APPROACH` · `THANK YOU`
- Meta labels / eyebrows / nav / buttons: **ALL CAPS**, wide tracking (`--label-tracking`), often
  a number: `01 — AI PROJECTS`
- Body copy: sentence case, full sentences, full stops. Justified in multi-column settings,
  left-ragged in single columns.

**Voice.** First person, plainspoken, low-adjective. "I build…", "I ran a two-day workshop for…"
Work is described by what it *did*, not by how innovative it was. Address the reader as **you**
only in calls to action (`GET IN TOUCH`, `SEE THE WORK`).

**Length.** Display headlines 1–3 words. Section intros 2–4 sentences. Project blurbs ≤ 40 words.
Credits and dates always present, always in a label, always uppercase.

**Numbers and dates.** Uppercase, terse: `27 SEPTEMBER 2024`, `2024–2025`, `03 / 12`.
Slide 1 pairs `PRESENTED BY / [NAME]` top-left with `[DATE]` top-right — the same
two-corner metadata pattern is used for project credits on the site.

**No emoji.** None appear in the source and none should be added. Punctuation carries the
personality instead: the em dash `—`, the slash `/`, and two-digit indices.

**Don't**: exclamation marks, "revolutionary/cutting-edge/leverage", AI buzzword stacking,
sentence-case display type, title-case buttons.

---

## VISUAL FOUNDATIONS

### Colour
Three colours plus ink, never blended. `--blue #0352BA`, `--paper #EDE9E4` (cream),
`--red #E3170A`, with `--ink #241E1A` (espresso) for type and dark grounds — a warm neutral, so `--blue` is the only saturated colour carrying the brand (`--paper-warm #FBF4EF` remains
for card surfaces). Red is **accent only, and only on large elements** — big fills, rules,
display type, oversized numerals. Never body copy, labels, small icons, or small text of any
kind. `--blue-mark` is now an alias of `--blue`; the old `--yellow` accent is retired.
Blue is the lead ground: heroes, statement bands, and the sticky nav over them are blue, and
it is the only colour that appears on every artefact. Espresso is for contrast and grounding —
footers, closing slides, and type on cream — never the hero. Cream carries the editorial middle.
Muted text on any dark or blue ground is `--text-on-dark-muted` (cream at **.88**, not .7) —
.7 fails 4.5:1 over `--blue`. Never use `--paper-70` for type.
Pairings actually used: cream type on ink; cream type on blue; blue type on cream; ink type on
cream; cream type on red. Blue on ink is not used. Max two grounds per artefact.
**No gradients anywhere.** No tints of blue as "hover states" — see interaction below.

### Type
One family, extreme weight contrast. Display is the black weight (`--weight-black` 900) set in
all caps at `--display-tracking -0.035em` and `--display-leading .86`, so two-line headlines
almost touch. Display sizes are viewport-scaled and *big*: the title slide headline is roughly
40% of the frame width. Body is 400/500 at 16–20px, `1.45` leading, `-0.005em`. Meta labels are
12px, 500, uppercase, `+0.09em`. There is no serif, no script, and no italic in the system.

**The face is Archivo** (Google Fonts, variable 400–900), with **Archivo Narrow** for tight
settings. This is settled, not a placeholder — nothing is pending and no files need swapping in.

The source deck was set in **Helvetica Now Display**; a Monotype web licence was declined, so
Archivo carries the system on every surface. It is the nearest freely available neo-grotesque:
slightly narrower caps and a touch more contrast in the Black weight, which the display tracking
(`-0.035em`) and leading (`.86`) are already tuned for. Archivo is SIL OFL — free for commercial
use and self-hostable. Do not introduce a second family to "get closer" to Helvetica.

### Layout
Poster logic, not card logic. Full-bleed flat grounds with generous margins
(`--page-margin`, `--slide-margin 72px` at 1440). Content sits in two symmetric text columns with
a `--gutter` between, or as one oversized headline anchored to a corner — usually
**bottom-left** (slides 1, 8, 10) or **top-left** (slide 2, 9). Metadata pins to the
opposite corners. Nothing is centred except the flock mark. Large empty areas are deliberate:
slide 4 is a cream field with two small text columns and nothing else.

### Backgrounds
Solid colour, full-bleed. No photography was supplied; the mood-board slide reserves image
wells, so imagery is expected — when it lands, expect **warm, slightly desaturated, filmic**
frames (the cream/blue palette biases warm) presented full-bleed or in square/4:5 wells with
`--radius-0`. No textures, no noise overlay, no repeating pattern. The only graphic device is
the flock: birds placed large, cropped by the frame edge, in a single flat colour at 100% or as
a 12–18% ghost of the ground colour.

### Surfaces, borders, radii
Two radius idioms only: `--radius-0` (images, ground blocks, most panels) and `--radius-xl 32px`
— the deck's one soft text panel (slide 2) is a cream rounded rectangle on ink. Buttons and tags
are `--radius-pill`. Borders are hairlines, `1px` at 14% ink (or 18% paper on dark); a `2px`
heavy rule marks section breaks. **Cards are flat**: ground shift + hairline, no shadow.

### Shadow
Effectively none. `--shadow-none` is the default for cards, buttons and tags.
`--shadow-lift` (a low, wide, soft ink shadow) is reserved for genuinely floating UI — a
sticky nav that has scrolled, a dialog (`--shadow-overlay`). Never an inner shadow.

### Transparency & blur
Sparingly, and only for legibility: a scrolled sticky header uses the page ground at ~85% with
`backdrop-filter: blur(12px)`. Text over imagery uses a **protection gradient**
(ink → transparent, bottom 45%) rather than a capsule or a scrim card. Ghosted flock art uses
flat alpha (`--paper-18`, `--blue-12`), not blur.

### Motion
See the **Motion** cards for live specimens. Quiet and mechanical: fades and small vertical moves
only. `--dur-fast 120ms` for micro-feedback, `--dur 200ms` with `--ease-out`
for interaction, `--dur-slow 420ms` for entrances (opacity + `translateY(12px)`, siblings staggered
60ms, never more than four). `--ease-in-out` is only for looping or self-reversing moves. No bounce, no
spring, no scale-in, no parallax. The one long, ambient motion is drift: the flock or a label
marquee crossing at `--dur-drift 16s` linear. Respect `prefers-reduced-motion` by dropping
transforms and keeping opacity.

### Hover & press
Hover = **ground swap or underline**, not opacity fade. Solid espresso buttons **invert** — cream
fill (`--action-fill-hover`), espresso label (`--action-text-hover`), espresso hairline; blue
buttons darken to `#02409A`; ghost buttons fill with `--surface-inset`; links get a 1px underline
at full espresso; project cards lift by `--hover-shift -2px` and their image crops in ~2%.
Press = **blue** (`--action-fill-press`) with a cream label (`--action-text-press`) plus
`scale(.985)` (`--press-scale`). Focus is a visible 2px `--focus-ring` blue outline with a
2px offset — never removed.

### Iconography — see ICONOGRAPHY below.

---

## ICONOGRAPHY

**There is no icon set in the source material.** The only supplied artwork is the flock mark and
the three individual bird silhouettes. No icon font, no sprite sheet, no PNG icons, no emoji, no
unicode-as-icon usage appears anywhere in the deck.

Consequences and rules:

1. **The birds are the iconography.** `assets/flock-blue.svg` / `flock-cream.svg` is the mark
   (three geese, right-leaning formation). `bird-glide.svg`, `bird-land.svg`, `bird-climb.svg`
   are the individual silhouettes — use them large (200px+), single-colour, often cropped by the
   frame edge. The uploads ship with no `fill` attribute (so they render black); pre-coloured
   copies live in `assets/birds/<bird>-<ink|blue|cream>.svg` and the flock mark in
   `flock-blue / flock-cream / flock-ink.svg`. **Place them as `<img>` and pick the right file —
   do not recolour with a CSS mask** (mask-based tinting fails in several rendering/export paths).
   Ghost them with `opacity` (.18 cream on ink, .12 blue on paper).
   Never rotate, outline, add a stroke to, or place a bird inside a circle.
2. **UI glyphs are substituted, and this is flagged.** For arrows, close, menu, play and external
   link the system uses **Lucide** (CDN, `lucide-static`) at `stroke-width: 1.75`, `24px`,
   `currentColor` — the closest match to the geometry of the type. This is a substitution, not
   brand-sanctioned. If a real icon set exists, send it and it will replace Lucide wholesale.
3. **Prefer type over glyphs.** The brand's instinct is a word or a number, not a symbol: use
   `NEXT →` (the character, in the type family) instead of a chevron icon, `01 / 12` instead of
   dots, `CLOSE` instead of an ✕ where space allows.
4. **No emoji, ever.**
5. **There is no wordmark/logotype file.** Where a logotype is needed, set `THE BENARI` or
   `BENARI` in the display face, all caps, `--display-tracking`, optionally beside the flock
   mark. No mark was drawn or reconstructed for this system.

---

## INDEX

**Root**
- `styles.css` — the single entry point consumers link. `@import` list only.
- `readme.md` — this file. `SKILL.md` — portable skill wrapper.
- `thumbnail.html` — project tile.

**Tokens** (`tokens/`) — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
`shape.css`, `motion.css`

**Assets** (`assets/`) — `logo.svg` / `flock-blue.svg` / `flock-cream.svg` (flock mark),
`bird-glide.svg`, `bird-land.svg`, `bird-climb.svg`

**Guidelines** (`guidelines/`) — foundation specimen cards (Colors, Type, Spacing, Brand, Motion groups)

**Components** (`components/`)
- `brand/` — `FlockMark`, `BirdField`, `Wordmark`
- `core/` — `Button`, `Tag`, `MetaLabel`, `SectionHeading`, `Display`, `Card`, `ProjectCard`, `Rule`
- `forms/` — `Input`, `Textarea`
- `navigation/` — `NavBar`, `Footer`

*Intentional additions:* no source defined a component inventory (deck + logo only), so a standard
portfolio-sized set was authored. `FlockMark` / `BirdField` / `Wordmark` exist to keep brand-asset
usage (and the recolour-by-mask rule) in one place.

**UI kits** (`ui_kits/`)
- `portfolio-site/` — The BenAri.com: Home, Work index, Project detail, Events, Contact.
  Interactive click-through in `index.html`. *Proposed, not a recreation — see Sources.*

**Templates** (`templates/`) — starting folders consuming projects can copy:
- `portfolio-page/PortfolioPage.dc.html` — full The BenAri.com page (hero, strands, work grid, statement, footer)
- `brand-deck/BrandDeck.dc.html` — six 1280×720 slides in the brand-strategy layout

**Slides** (`slides/`) — sample slides rebuilt from the supplied deck template: title, section
divider, two-column body, soft-panel intro, statement, closing.
