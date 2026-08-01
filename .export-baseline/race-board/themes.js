/* ============================================================
   Northwind RACE BOARD — theme registry

   One entry per week's costume. Adding a theme touches nothing else: no race
   logic, no geometry, no payload. Set it with <body data-theme="sharks"> (or
   ?theme=sharks to preview on a laptop without a deploy).

   THIS FILE IS PURELY ADDITIVE. race.js has `cars` built in and falls back to
   it on ANY problem — file missing, syntax error, unknown id, malformed entry,
   art that throws, art too tall for the row. Delete this file and the board
   still runs. That is deliberate: this is a wall display, and a black screen at
   2am with nobody watching is the failure mode worth designing against.

   LOAD ORDER MATTERS: this file must be included BEFORE race.js. Wrong order
   and RACE_THEMES is undefined when race.js resolves the theme — the board
   silently falls back to cars and nobody knows why. (Porting to the CRM: this is
   the SECOND script tag, and HANDOFF's porting section says only the asset
   hrefs and data-* change. It's one more href.)

   ------------------------------------------------------------------
   WRITING A THEME — the whole contract

     { id, label, w, teamColor, racer: {vb, body(color)}, team: {vb, body(color)} }

   You supply a viewBox and the SVG innards. You do NOT write the <svg> tag —
   artSVG() emits it, taking width from `w` and deriving height from your
   viewBox's aspect. That is what makes width and height impossible to get
   wrong rather than merely checked.

   `color` arrives ALREADY ESCAPED. Interpolate it directly.

   RULES:
     1. `w` is one number for the WHOLE theme — racer and team alike. Never two.
        paceX = pace*usable + w/2, so two widths on one screen = two pace
        positions = the amber line jogs at the bottom row. It shipped once.
     2. Height is the real constraint and `w` is back-derived from it. The lane
        is 110px and the team strip 96px, both overflow:hidden. Budget: racer
        <= 100, team <= 88. A horizontal animal at w=118 is free; anything
        UPRIGHT needs a much smaller w or it gets guillotined. race.js rejects
        an over-tall theme at boot and tells you the numbers.
     3. DRAW INSIDE THE VIEWBOX. There is no clipping warning — art outside it is
        simply gone. The first draft of the shark below put the dorsal fin at
        y=-1 and lost the one feature that makes a shark a shark; it read as a
        sardine. If a feature needs headroom, grow the viewBox (and re-check the
        derived height against rule 2), don't push past the edge.
     4. Face RIGHT. The board races left -> right.
     5. Centre the character's MASS horizontally in the viewBox. The pace anchor
        is w/2 — art whose bulk sits off-centre stays lane-aligned but makes
        "level with the amber line" stop meaning "on pace".
     6. Paint the main mass with `color`, FLAT. That colour is the PERSON, and
        it's the one thing that must not change from week to week (see
        PERSON_COLORS in live_data.py). A gradient to black washes every racer
        grey and destroys the only thing identifying them across a room.
     7. `teamColor` is yours to pick — the team is not a person. But it must not
        collide with --pace (#ffb400), because an on-pace team vehicle parks ON
        the amber line, and it must not read as any PERSON_COLORS hue.
     8. Moving parts carry class="anim" so one reduced-motion rule covers every
        theme. Rotating parts set transform-origin INLINE in viewBox user units
        and must never use transform-box — fill-box resolves against the
        element's own bbox and the part ORBITS instead of turning (measured:
        59x64px of drift), and it's Chromium 64+ anyway.
     9. Syntax floor: NO ?? and NO ?. — Chromium 80+, and a SyntaxError here is
        a black wall, not a degraded one. Keep it ES2017-ish.

   Then add the theme's motion + track skin to race.css, scoped:
       .board[data-theme="sharks"] .fin-tail { animation: ... }
   Check it with ?theme=sharks&audit=1 — the audit renders on the board itself.

   AND THEN LOOK AT IT. The audit proves the geometry, never the read. At TV
   distance a character survives on ONE silhouette cue: make that cue huge.
   ============================================================ */
// A spoked wheel that spins (the `.wheel` class carries the global spin; `.anim`
// lets reduced-motion still it). Inlined here because race.js's wheelSVG lives
// inside its IIFE and isn't reachable from this file — a theme must be
// self-contained or the boot guard rejects it and falls back to cars.
function trainWheel(cx, cy, r) {
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#20242c"/>' +
    '<g class="wheel anim" style="transform-origin:' + cx + 'px ' + cy + 'px">' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 1) + '" fill="none" stroke="#565c66" stroke-width="1.4" stroke-dasharray="1.6 2"/>' +
    '<path d="M' + cx + ' ' + (cy - r + 1) + ' L' + cx + ' ' + (cy + r - 1) +
    ' M' + (cx - r + 1) + ' ' + cy + ' L' + (cx + r - 1) + ' ' + cy + '" stroke="#565c66" stroke-width="1.1"/>' +
    '</g><circle cx="' + cx + '" cy="' + cy + '" r="1.4" fill="#6a7280"/>';
}

var RACE_THEMES = {

  /* ---------------------------------------------------------------- sharks
     Horizontal, so w matches the cars at 118 and the height budget is easy.
     No wheels — the tail is the idle motion.

     The dorsal fin IS the theme. It's deliberately oversized and given real
     headroom in the viewBox: without it this is just a fish. Same for the
     heterocercal tail (upper lobe much longer than lower) — that asymmetry is
     the second cue, and a symmetric tail reads as a tuna. */
  sharks: {
    id: "sharks",
    label: "Sharks",
    w: 118,
    teamColor: "#5f93b8",   // slate blue — far from --pace amber, far from every racer hue

    racer: {
      vb: "0 0 72 30",      // -> 118 x 49; the 30 is headroom for the fin
      // The tail is rooted at x=20 — INSIDE the body, which reaches x=16. Root it
      // at the body's edge and rotation opens a visible gap; the fin looks
      // detached, which was the first draft's other bug.
      body: (color) => `
      <g class="fin-tail anim" style="transform-origin:19px 17px">
        <path d="M20 17 L3 2 L11 16 L6 29 Z" fill="${color}"/>
        <path d="M20 17 L3 2 L11 16 Z" fill="rgba(0,0,0,.18)"/>
      </g>
      <path d="M53 15 L41 1 L34 15 Z" fill="${color}"/>
      <path d="M53 15 L41 1 L44 15 Z" fill="rgba(0,0,0,.20)"/>
      <path d="M25 15 L19 9 L17 15.6 Z" fill="${color}"/>
      <path d="M57 19 L42 29 L51 21 Z" fill="${color}"/>
      <path d="M57 19 L42 29 L49 22 Z" fill="rgba(0,0,0,.26)"/>
      <path d="M71 17 C67 13 59 11 48 11 C35 11 23 13 16 16 L16 19 C23 22 35 24 48 24 C59 24 67 21 71 17 Z" fill="${color}"/>
      <path d="M16 19 C23 22 35 24 48 24 C59 24 67 21 71 17" stroke="rgba(0,0,0,.22)" stroke-width="1.6" fill="none"/>
      <path d="M71 17 C67 19.5 63 21 58 21.6 C63 20 67 18.6 70 16.6 Z" fill="rgba(0,0,0,.5)"/>
      <path d="M56 13 L54.6 20 M59 12.6 L57.6 19.8 M62 12.4 L60.6 19.4 M65 12.6 L63.6 19" stroke="rgba(0,0,0,.24)" stroke-width="1" fill="none"/>
      <circle cx="66.5" cy="15" r="1.7" fill="#0c0f14"/>
      <circle cx="67.1" cy="14.4" r=".55" fill="rgba(255,255,255,.85)"/>`,
    },

    /* The whale: the whole team in one animal. Same w as the shark (rule 1),
       taller — exactly the bus's trick, for exactly the same reason.
       Blunt head + fluke + spout are the cues; the spout is what stops it
       reading as a very large shark. */
    team: {
      vb: "0 0 72 34",      // -> 118 x 56, inside the 88px team budget
      // Same overlap rule as the shark: the fluke roots at x=17, inside a body
      // that reaches x=12.
      body: (color) => `
      <g class="fin-fluke anim" style="transform-origin:16px 18px">
        <path d="M17 18 L2 9 L10 17 L3 27 Z" fill="${color}"/>
        <path d="M17 18 L2 9 L10 17 Z" fill="rgba(0,0,0,.18)"/>
      </g>
      <path d="M33 14 L26 3 L21 14 Z" fill="${color}"/>
      <path d="M52 22 L38 33 L47 24 Z" fill="${color}"/>
      <path d="M52 22 L38 33 L45 25 Z" fill="rgba(0,0,0,.24)"/>
      <path d="M70 18 C70 11 62 9 48 9 C31 9 18 12 13 16 L13 20 C18 25 31 28 48 28 C62 28 70 25 70 18 Z"
            fill="${color}" stroke="#0c0f14" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M13 20 C18 25 31 28 48 28 C62 28 70 25 70 18" stroke="rgba(0,0,0,.22)" stroke-width="1.8" fill="none"/>
      <path d="M70 20 C64 23.5 56 25 47 25.4 C56 24 64 22 69 19.6 Z" fill="rgba(0,0,0,.42)"/>
      
      <path d="M58 25.6 L58 27.8 M53 26.4 L53 28 M48 26.6 L48 28 M43 26.4 L43 27.6" stroke="rgba(0,0,0,.20)" stroke-width="1" fill="none"/>
      <g class="spout anim" style="transform-origin:57px 10px">
        <path d="M57 10 L54 2 M57 10 L57 1 M57 10 L60 2" stroke="#cfe6f5" stroke-width="1.7" stroke-linecap="round" fill="none"/>
      </g>
      <circle cx="64" cy="15" r="1.8" fill="#0c0f14"/>
      <circle cx="64.7" cy="14.4" r=".6" fill="rgba(255,255,255,.85)"/>`,
    },
  },

  /* ---------------------------------------------------------------- swimmers
     Horizontal front crawl, so w stays 118. The team is a rowing eight —
     the whole squad in one hull, which is the same idea as the school bus.

     This theme is the reason the track skin has a rule. A pool WANTS to be
     bright, and bright is exactly what the board can't take: the % pill is
     white-on-near-black and the finish line sells itself with a white glow.
     The skin below is a pool read from UNDER the water for that reason —
     unmistakably a pool, still dark enough for the chrome to survive. */
  swimmers: {
    id: "swimmers",
    label: "Swimmers",
    w: 118,
    teamColor: "#c8703c",   // varnished-hull orange-brown; not amber, not a racer hue

    racer: {
      vb: "0 0 72 30",      // -> 118 x 49
      body: (color) => `
      <g class="legs anim" style="transform-origin:26px 16px">
        <path d="M26 16 L10 11 L5 12" stroke="${color}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <path d="M26 16 L10 21 L5 21" stroke="${color}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="arm-back anim" style="transform-origin:44px 14px">
        <path d="M44 14 L34 5 L27 6.5" stroke="${color}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M22 12 L50 11 L55 15 L50 19 L22 18 Z" fill="${color}"/>
      <path d="M22 18 L50 19 L55 15 C50 17.6 38 18.6 22 18 Z" fill="rgba(0,0,0,.22)"/>
      <path d="M50 14 L63 11 L70 12" stroke="${color}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="55" cy="13" r="4.6" fill="${color}"/>
      <path d="M50.6 11.4 A4.6 4.6 0 0 1 58.4 10.6 L55 13 Z" fill="rgba(255,255,255,.24)"/>
      <path d="M56.4 13.6 L59.4 13.2" stroke="#0c0f14" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="58.4" cy="13.3" r="1.4" fill="#0c0f14"/>
      <circle cx="58.9" cy="12.8" r=".45" fill="rgba(255,255,255,.8)"/>`,
    },

    /* Rowing eight. Oars are the cue; without them it's a canoe. Rooted inside
       the hull like every other appendage in this file. */
    team: {
      vb: "0 0 72 34",      // -> 118 x 56
      body: (color) => `
      <g class="oars anim" style="transform-origin:36px 20px">
        <path d="M18 20 L8 30 M30 20 L20 30 M42 20 L32 30 M54 20 L44 30"
              stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M8 30 L4 32 M20 30 L16 32 M32 30 L28 32 M44 30 L40 32"
              stroke="rgba(0,0,0,.35)" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </g>
      <path d="M6 18 C6 16 8 15.4 12 15.4 L60 15.4 L70 19 L60 24 L12 24 C8 24 6 22.6 6 18 Z"
            fill="${color}" stroke="#0c0f14" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M6 20 C8 23 10 24 12 24 L60 24 L70 19 C64 21.4 40 22.6 6 20 Z" fill="rgba(0,0,0,.3)"/>
      <path d="M12 17.2 L58 17.2" stroke="rgba(255,255,255,.2)" stroke-width="1.2"/>
      <!-- Rowers: head + shoulders, NO eye dot. A pale circle with a pupil at
           this scale doesn't read as a head, it reads as a googly eye — which is
           exactly what the first draft looked like. The torso under each head is
           what makes them people; the hull covers its lower half. -->
      <g fill="#e6dccd">
        <path d="M15.6 16 C15.6 13.4 20.4 13.4 20.4 16 Z"/><circle cx="18" cy="11.6" r="2.5"/>
        <path d="M27.6 16 C27.6 13.4 32.4 13.4 32.4 16 Z"/><circle cx="30" cy="11.6" r="2.5"/>
        <path d="M39.6 16 C39.6 13.4 44.4 13.4 44.4 16 Z"/><circle cx="42" cy="11.6" r="2.5"/>
        <path d="M51.6 16 C51.6 13.4 56.4 13.4 56.4 16 Z"/><circle cx="54" cy="11.6" r="2.5"/>
      </g>`,
    },
  },

  /* ---------------------------------------------------------------- runners
     THE VERTICAL THEME — the one that exercises the small-w path. Everything
     above is horizontal at w=118 and the height budget is trivial. An UPRIGHT
     figure at w=118 renders ~180 tall and gets guillotined by the 110px lane;
     race.js would reject it at boot. So w drops to 60, and the TEAM is what
     bounds it: a mascot at w=66 is 92px, over the 88px team strip. At w=60 the
     sprinter is 96/100 and the mascot 84/88 — both just fit.

     Two consequences of the small w:
       - the figures are ~half the width of a car, so they sit further LEFT of
         their pill. That's fine; the pill floats off the wrapper, not the art.
       - detail has to be even bolder. A sprinter is thin; at 60px wide there's
         no room for a face, just a silhouette and a running pose. */
  runners: {
    id: "runners",
    label: "Runners",
    w: 60,
    teamColor: "#d24b7a",   // raspberry — deeper than the pale-pink racer, not amber

    /* Sprinter mid-stride, facing right, leaning forward. Limbs are thick
       round-capped strokes (same trick as the swimmer) — cleaner than filled
       paths at this size. Opposite arm/leg swing is the whole read: front leg +
       back arm drive together, so the CSS animates them in matching phase and
       the other pair in reverse. */
    racer: {
      vb: "0 0 40 64",      // -> 60 x 96, just under the 100 racer budget
      body: (color) => `
      <g class="leg-b anim" style="transform-origin:20px 40px">
        <path d="M20 40 L13 50 L8 60" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <g class="arm-b anim" style="transform-origin:24px 22px">
        <path d="M24 22 L15 25 L11 31" stroke="${color}" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M26 20 L19 41" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="27" cy="12" r="6.6" fill="${color}"/>
      <path d="M22 9 A6.6 6.6 0 0 1 32 11 L27 12 Z" fill="rgba(255,255,255,.2)"/>
      <g class="leg-f anim" style="transform-origin:20px 40px">
        <path d="M20 40 L28 45 L33 40" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 40 L28 45 L33 40" stroke="rgba(0,0,0,.16)" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
      </g>
      <g class="arm-f anim" style="transform-origin:25px 21px">
        <path d="M25 21 L32 26 L35 20" stroke="${color}" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,
    },

    /* The team mascot: the whole squad as one big costumed figure. Bulky and
       round where the sprinter is thin — the contrast is the point, and it's the
       same "team = a bigger single thing" idea as the bus and the whale. One arm
       waves (that's the .anim). Star on the belly for a jersey. */
    team: {
      vb: "0 0 46 64",      // -> 60 x 84, under the 88 team strip
      body: (color) => `
      <path d="M12 60 L14 48 L20 48 L20 60 Z" fill="#0c0f14"/>
      <path d="M34 60 L32 48 L26 48 L26 60 Z" fill="#0c0f14"/>
      <ellipse cx="23" cy="38" rx="17" ry="16" fill="${color}" stroke="#0c0f14" stroke-width="1.4"/>
      <path d="M6 38 A17 16 0 0 1 40 38 A17 16 0 0 0 6 38 Z" fill="rgba(255,255,255,.16)"/>
      <path d="M7 44 A17 16 0 0 0 39 44 A17 16 0 0 1 7 44 Z" fill="rgba(0,0,0,.2)"/>
      <path d="M23 30 L25.4 35.2 L31 35.6 L26.6 39.2 L28.2 44.6 L23 41.4 L17.8 44.6 L19.4 39.2 L15 35.6 L20.6 35.2 Z" fill="rgba(255,255,255,.85)"/>
      <path d="M7 34 L1 26" stroke="${color}" stroke-width="5.2" fill="none" stroke-linecap="round"/>
      <g class="wave anim" style="transform-origin:39px 34px">
        <path d="M39 34 L45 24" stroke="${color}" stroke-width="5.2" fill="none" stroke-linecap="round"/>
      </g>
      <circle cx="23" cy="14" r="10" fill="${color}" stroke="#0c0f14" stroke-width="1.4"/>
      <path d="M14 12 A10 10 0 0 1 32 10 L23 14 Z" fill="rgba(255,255,255,.2)"/>
      <circle cx="19.5" cy="14" r="1.8" fill="#0c0f14"/>
      <circle cx="27" cy="14" r="1.8" fill="#0c0f14"/>
      <path d="M18 18 C21 21 25 21 28 18" stroke="#0c0f14" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    },
  },

  /* ---------------------------------------------------------------- bricks
     A blocky minifigure — the loophole around Lego, which is enforced IP and
     this repo lands in the CRM's codebase. The cues are generic and un-trademarked:
     a cylinder head with a stud on top, a trapezoid torso, C-clip claw hands,
     two square legs. Nobody owns "toy brick person"; a specific yellow face and
     proportions would be a different conversation.

     Vertical, so w=60 like runners. The one break from face-right: a minifig's
     whole charm is the front-on face (two dots + a curve), so the head stays
     forward while the walk cycle carries the motion. Arms and legs swing at the
     shoulder and hip — a minifig's only real articulation, which is why a stiff
     little swing reads exactly right. */
  bricks: {
    id: "bricks",
    label: "Bricks",
    w: 60,
    teamColor: "#1e6fd0",   // brick blue; clear of amber, and a bus is no car

    racer: {
      vb: "0 0 40 64",      // -> 60 x 96
      body: (color) => `
      <g class="leg-l anim" style="transform-origin:16px 43px">
        <rect x="12.5" y="43" width="7" height="18" rx="1.4" fill="${color}"/>
        <rect x="12.5" y="57.5" width="7" height="3.5" rx="1.4" fill="rgba(0,0,0,.3)"/>
      </g>
      <g class="leg-r anim" style="transform-origin:24px 43px">
        <rect x="20.5" y="43" width="7" height="18" rx="1.4" fill="${color}"/>
        <rect x="20.5" y="57.5" width="7" height="3.5" rx="1.4" fill="rgba(0,0,0,.3)"/>
      </g>
      <rect x="11.5" y="39" width="17" height="4.5" rx="1.2" fill="${color}"/>
      <rect x="11.5" y="42" width="17" height="1.5" fill="rgba(0,0,0,.22)"/>
      <g class="arm-l anim" style="transform-origin:15px 25px">
        <path d="M15 25 L10 33" stroke="${color}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
        <circle cx="9.5" cy="34.5" r="2.9" fill="${color}"/>
        <circle cx="9.5" cy="34.5" r="1.3" fill="rgba(0,0,0,.28)"/>
      </g>
      <g class="arm-r anim" style="transform-origin:25px 25px">
        <path d="M25 25 L30 33" stroke="${color}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
        <circle cx="30.5" cy="34.5" r="2.9" fill="${color}"/>
        <circle cx="30.5" cy="34.5" r="1.3" fill="rgba(0,0,0,.28)"/>
      </g>
      <path d="M14 23 L26 23 L28 39 L12 39 Z" fill="${color}"/>
      <path d="M14 23 L26 23 L26.3 26 L13.7 26 Z" fill="rgba(255,255,255,.18)"/>
      <path d="M12 38.4 L28 38.4 L28 39 L12 39 Z" fill="rgba(0,0,0,.25)"/>
      <rect x="17.5" y="20.5" width="5" height="3" fill="rgba(0,0,0,.28)"/>
      <rect x="12.5" y="7" width="15" height="14" rx="3.2" fill="${color}"/>
      <rect x="12.5" y="7" width="15" height="3" rx="3" fill="rgba(255,255,255,.2)"/>
      <circle cx="17.6" cy="13.6" r="1.5" fill="#1a1207"/>
      <circle cx="22.4" cy="13.6" r="1.5" fill="#1a1207"/>
      <path d="M16.6 16.4 C19 18.8 21 18.8 23.4 16.4" stroke="#1a1207" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <rect x="16.5" y="3" width="7" height="4.6" rx="1.6" fill="${color}"/>
      <rect x="16.5" y="3" width="7" height="1.7" rx="1.4" fill="rgba(255,255,255,.28)"/>`,
    },

    /* A stubby brick bus — bricks -> bus, the same tie cars has. Studs on the
       roof are the cue. Small and toy-like on purpose: at w=60 it can't be the
       wide coach the cars bus is, and a little brick bus is more on-theme anyway. */
    team: {
      vb: "0 0 50 42",      // -> 60 x 50
      body: (color) => `
      <circle cx="15" cy="37" r="5.5" fill="#14181f"/>
      <circle cx="35" cy="37" r="5.5" fill="#14181f"/>
      <circle cx="15" cy="37" r="2.2" fill="#39404a"/>
      <circle cx="35" cy="37" r="2.2" fill="#39404a"/>
      <rect x="4" y="12" width="42" height="25" rx="3" fill="${color}"/>
      <rect x="4" y="12" width="42" height="4" rx="3" fill="rgba(255,255,255,.18)"/>
      <rect x="4" y="33" width="42" height="4" rx="3" fill="rgba(0,0,0,.28)"/>
      <rect x="8" y="18" width="9" height="9" rx="1.5" fill="#bfe0ff"/>
      <rect x="20" y="18" width="9" height="9" rx="1.5" fill="#bfe0ff"/>
      <rect x="32" y="18" width="9" height="9" rx="1.5" fill="#bfe0ff"/>
      <rect x="10" y="6" width="8" height="7" rx="1.6" fill="${color}"/>
      <rect x="22" y="6" width="8" height="7" rx="1.6" fill="${color}"/>
      <rect x="34" y="6" width="6" height="7" rx="1.6" fill="${color}"/>
      <rect x="10" y="6" width="8" height="2.4" rx="1.4" fill="rgba(255,255,255,.28)"/>
      <rect x="22" y="6" width="8" height="2.4" rx="1.4" fill="rgba(255,255,255,.28)"/>
      <rect x="34" y="6" width="6" height="2.4" rx="1.4" fill="rgba(255,255,255,.28)"/>`,
    },
  },

  /* ---------------------------------------------------------------- plumbers
     A red-capped plumber — the loophole around Mario. "A stout fellow in a red
     cap and overalls with a big moustache" is a genre, not a trademark; a
     specific character name, face, or logo would not be. Generic on purpose.

     The OVERALLS carry the person's colour (the biggest mass — rule 6), and the
     red cap, moustache and boots are fixed on everyone. The shared red cap is
     the "these are all plumbers" cue, the same way every shark shares a fin —
     identity lives in the overalls, not the hat. */
  plumbers: {
    id: "plumbers",
    label: "Plumbers",
    w: 60,
    teamColor: "#3fa93a",   // warp-pipe green; clear of amber and of the racer green

    racer: {
      vb: "0 0 40 64",      // -> 60 x 96
      body: (color) => `
      <g class="leg-b anim" style="transform-origin:20px 44px">
        <rect x="12" y="44" width="8" height="14" rx="2" fill="${color}"/>
        <path d="M9 57 L21 57 L21 61 Q21 62 20 62 L9 62 Z" fill="#4a2f14"/>
      </g>
      <g class="leg-f anim" style="transform-origin:20px 44px">
        <rect x="20" y="44" width="8" height="14" rx="2" fill="${color}"/>
        <path d="M20 57 L33 57 Q34 57 34 58 L34 62 L20 62 Z" fill="#4a2f14"/>
      </g>
      <g class="arm-b anim" style="transform-origin:15px 27px">
        <path d="M15 27 L9 35" stroke="#c0271d" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="8" cy="36" r="3.2" fill="#f4f4f4"/>
      </g>
      <path d="M12 26 L28 26 L30 44 L10 44 Z" fill="${color}"/>
      <path d="M14 26 L14 44 M26 26 L26 44" stroke="rgba(0,0,0,.16)" stroke-width="1"/>
      <circle cx="16" cy="31" r="1.5" fill="#f2c744"/>
      <circle cx="24" cy="31" r="1.5" fill="#f2c744"/>
      <path d="M11 24 Q20 20 29 24 L28 27 L12 27 Z" fill="#c0271d"/>
      <g class="arm-f anim" style="transform-origin:25px 27px">
        <path d="M25 27 L32 33" stroke="#c0271d" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="33.5" cy="34" r="3.2" fill="#f4f4f4"/>
      </g>
      <circle cx="21" cy="15" r="8.4" fill="#eab38a"/>
      <path d="M13 15 Q13 8 21 8 Q29 8 29 15 Z" fill="#eab38a"/>
      <ellipse cx="30" cy="16.5" rx="3" ry="2.4" fill="#eab38a"/>
      <path d="M15 18.5 Q21 15 30 17.5 Q29 21.5 24 21.5 Q18 21.8 15 18.5 Z" fill="#5a3a1a"/>
      <circle cx="24" cy="13.5" r="1.6" fill="#1a1207"/>
      <path d="M11 12 Q20 3 31 10 L32 14 Q30 10.5 24 10.5 L13.5 12.6 Q12 12.4 11 12 Z" fill="#c0271d"/>
      <ellipse cx="30" cy="12.4" rx="4.5" ry="2.4" fill="#c0271d"/>
      <path d="M11 12 Q20 3 31 10 L31 11 Q20 5 12 12.4 Q11.4 12.4 11 12 Z" fill="rgba(255,255,255,.22)"/>`,
    },

    /* A green warp pipe with the crew popping out — the whole team from one
       pipe. Heads bob on a stagger (see CSS). Vertical, w=60, so the pipe is
       tall and narrow, which is exactly a warp pipe. */
    team: {
      vb: "0 0 46 60",      // -> 60 x 78
      body: (color) => `
      <g class="pop-a anim" style="transform-origin:14px 30px">
        <circle cx="14" cy="24" r="4.2" fill="#eab38a"/>
        <path d="M8.5 22 Q14 15 19.5 20 L20 24 Q14 20 9 24 Z" fill="#c0271d"/>
      </g>
      <g class="pop-b anim" style="transform-origin:31px 30px">
        <circle cx="31" cy="21" r="4.2" fill="#eab38a"/>
        <path d="M25.5 19 Q31 12 36.5 17 L37 21 Q31 17 26 21 Z" fill="#c0271d"/>
      </g>
      <rect x="12" y="28" width="22" height="32" fill="${color}"/>
      <rect x="12" y="28" width="4" height="32" fill="rgba(255,255,255,.18)"/>
      <rect x="28" y="28" width="6" height="32" fill="rgba(0,0,0,.24)"/>
      <rect x="6" y="22" width="34" height="10" rx="2.5" fill="${color}"/>
      <rect x="6" y="22" width="34" height="3" rx="2.5" fill="rgba(255,255,255,.22)"/>
      <rect x="6" y="29" width="34" height="3" rx="2.5" fill="rgba(0,0,0,.24)"/>`,
    },
  },

  /* ---------------------------------------------------------------- animals
     Cheetah (lean, spotted, galloping) + elephant (trunk, ears, tusks).
     Both horizontal, w=118. Savanna track. */
  animals: {
    id: "animals",
    label: "Animals",
    w: 118,
    teamColor: "#9a9086",   // elephant grey — clear of amber and the racer hues
    racer: {
      vb: "0 0 72 34",
      body: (color) => `
      <path d="M16 17 C7 15 3 9 7 4" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="legs anim" style="transform-origin:26px 20px">
        <path d="M24 20 L17 29 L13 32" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 21 L28 30 L24 33" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M15 18 C22 12 34 11 47 13 C56 14 62 15 65 17 C61 22 51 24 40 24 C29 24 19 22 15 19 Z" fill="${color}"/>
      <g class="legs anim" style="transform-origin:52px 21px">
        <path d="M52 21 L59 30 L63 33" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M46 22 L49 31 L45 33" stroke="${color}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M60 16 L68 11" stroke="${color}" stroke-width="7.5" stroke-linecap="round"/>
      <circle cx="67" cy="11" r="5.6" fill="${color}"/>
      <path d="M62 4 L66 9 L60 9 Z" fill="${color}"/>
      <circle cx="66.5" cy="10" r="1.4" fill="#0c0f14"/>
      <circle cx="71.5" cy="12" r="1.3" fill="#0c0f14"/>
      <g fill="rgba(0,0,0,.32)">
        <circle cx="30" cy="17" r="1.6"/><circle cx="38" cy="19" r="1.6"/>
        <circle cx="46" cy="17" r="1.5"/><circle cx="34" cy="21" r="1.3"/>
        <circle cx="52" cy="19" r="1.4"/>
      </g>`,
    },
    team: {
      vb: "0 0 72 42",
      body: (color) => `
      <path d="M8 24 L4 40 M16 26 L14 41 M56 26 L58 41 M64 24 L66 40" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="38" cy="22" rx="26" ry="15" fill="${color}"/>
      <ellipse cx="38" cy="16" rx="26" ry="9" fill="rgba(255,255,255,.12)"/>
      <path d="M60 14 C70 12 71 24 64 26 C58 27 56 18 60 14 Z" fill="${color}"/>
      <path d="M60 15 C67 14 68 23 63 25 Z" fill="rgba(255,255,255,.14)"/>
      <circle cx="63" cy="17" r="1.7" fill="#0c0f14"/>
      <path d="M64 26 C66 32 66 39 64 41 C62 39 62 33 63 27 Z" fill="${color}"/>
      <path d="M64 41 Q60 41 60 38" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M58 28 L56 34 M62 28 L61 34" stroke="#f2ede4" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M12 20 C4 20 5 30 12 30 Z" fill="rgba(0,0,0,.14)"/>`,
    },
  },

  /* ---------------------------------------------------------------- rockets
     A rocket (nose right, flame tail) + a booster stack for the team. Deep-space
     track. w=118. */
  rockets: {
    id: "rockets",
    label: "Rockets",
    w: 118,
    teamColor: "#c9ccd6",   // rocket white-grey
    racer: {
      vb: "0 0 72 28",
      body: (color) => `
      <g class="rk-flame anim" style="transform-origin:14px 14px">
        <path d="M14 8 C2 10 -2 14 2 14 C-2 14 2 18 14 20 C10 16 10 12 14 8 Z" fill="#ff7a12"/>
        <path d="M14 10 C5 11 3 14 5 14 C3 14 5 17 14 18 C11 16 11 12 14 10 Z" fill="#ffc21e"/>
      </g>
      <path d="M14 9 L54 9 C64 9 70 14 70 14 C70 14 64 19 54 19 L14 19 C11 19 11 9 14 9 Z" fill="${color}"/>
      <path d="M14 9 L54 9 C64 9 70 14 70 14 C66 14 60 11 52 11 L14 11 Z" fill="rgba(255,255,255,.22)"/>
      <path d="M54 19 C64 19 70 14 70 14 C66 14 60 17 52 17 Z" fill="rgba(0,0,0,.28)"/>
      <path d="M22 9 L16 2 L14 9 Z" fill="#e10600"/>
      <path d="M22 19 L16 26 L14 19 Z" fill="#e10600"/>
      <circle cx="56" cy="14" r="4" fill="#bcd7e8"/>
      <circle cx="56" cy="14" r="4" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>
      <path d="M30 14 L46 14" stroke="rgba(0,0,0,.18)" stroke-width="1.4"/>`,
    },
    team: {
      vb: "0 0 72 36",
      body: (color) => `
      <g class="rk-flame anim" style="transform-origin:16px 18px">
        <path d="M16 9 C0 12 -4 18 2 18 C-4 18 0 24 16 27 C11 22 11 14 16 9 Z" fill="#ff7a12"/>
        <path d="M16 12 C6 14 3 18 6 18 C3 18 6 22 16 24 C12 21 12 15 16 12 Z" fill="#ffc21e"/>
      </g>
      <path d="M16 11 L52 11 C66 11 71 18 71 18 C71 18 66 25 52 25 L16 25 C13 25 13 11 16 11 Z" fill="${color}"/>
      <path d="M16 11 L52 11 C66 11 71 18 71 18 C66 18 58 14 50 14 L16 14 Z" fill="rgba(255,255,255,.22)"/>
      <path d="M26 11 L20 3 L16 11 Z" fill="#e10600"/>
      <path d="M26 25 L20 33 L16 25 Z" fill="#e10600"/>
      <path d="M40 11 L36 4 L33 11 Z" fill="#3671c6"/>
      <path d="M40 25 L36 32 L33 25 Z" fill="#3671c6"/>
      <circle cx="58" cy="18" r="4.5" fill="#bcd7e8" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>
      <circle cx="44" cy="18" r="3.2" fill="#bcd7e8" stroke="rgba(0,0,0,.3)" stroke-width="1"/>`,
    },
  },

  /* ---------------------------------------------------------------- ufos
     Flying saucer (dome + hull + lights) + a bigger mothership. Alien-sky track.
     w=118. */
  ufos: {
    id: "ufos",
    label: "UFOs",
    w: 118,
    teamColor: "#7ad6a6",   // alien green-teal, distinct from the racer teal
    racer: {
      vb: "0 0 72 30",
      body: (color) => `
      <ellipse cx="36" cy="26" rx="16" ry="3" fill="rgba(120,230,180,.18)"/>
      <path d="M36 6 C46 6 50 12 50 15 L22 15 C22 12 26 6 36 6 Z" fill="${color}"/>
      <path d="M36 6 C44 6 48 11 49 14 C44 12 40 11 36 11 C32 11 28 12 23 14 C24 11 28 6 36 6 Z" fill="rgba(255,255,255,.25)"/>
      <ellipse cx="36" cy="17" rx="34" ry="7" fill="${color}"/>
      <ellipse cx="36" cy="17" rx="34" ry="7" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
      <path d="M2 17 C2 21 70 21 70 17 C70 20 60 23 36 23 C12 23 2 20 2 17 Z" fill="rgba(0,0,0,.28)"/>
      <g class="ufo-lights anim">
        <circle cx="14" cy="18" r="2.2" fill="#ffe08a"/>
        <circle cx="25" cy="19.5" r="2.2" fill="#ff6a9a"/>
        <circle cx="36" cy="20" r="2.2" fill="#7fd6ff"/>
        <circle cx="47" cy="19.5" r="2.2" fill="#ff6a9a"/>
        <circle cx="58" cy="18" r="2.2" fill="#ffe08a"/>
      </g>`,
    },
    team: {
      vb: "0 0 72 34",
      body: (color) => `
      <ellipse cx="36" cy="30" rx="22" ry="3.5" fill="rgba(120,230,180,.2)"/>
      <ellipse cx="36" cy="10" rx="16" ry="9" fill="${color}"/>
      <ellipse cx="36" cy="8" rx="16" ry="5" fill="rgba(255,255,255,.22)"/>
      <ellipse cx="36" cy="19" rx="35" ry="8" fill="${color}"/>
      <path d="M1 19 C1 24 71 24 71 19 C71 23 58 26 36 26 C14 26 1 23 1 19 Z" fill="rgba(0,0,0,.3)"/>
      <g class="ufo-lights anim">
        <circle cx="12" cy="20" r="2.6" fill="#ffe08a"/>
        <circle cx="24" cy="22" r="2.6" fill="#ff6a9a"/>
        <circle cx="36" cy="23" r="2.6" fill="#7fd6ff"/>
        <circle cx="48" cy="22" r="2.6" fill="#ff6a9a"/>
        <circle cx="60" cy="20" r="2.6" fill="#ffe08a"/>
      </g>`,
    },
  },

  /* ---------------------------------------------------------------- trains
     Steam locomotive (funnel, cab, cowcatcher, wheels) + loco pulling a car.
     Railway track. w=118. Wheels reuse the spin animation. */
  trains: {
    id: "trains",
    label: "Trains",
    w: 118,
    teamColor: "#8a5a3c",   // boxcar brown
    racer: {
      vb: "0 0 72 34",
      body: (color) => `
      <g class="steam anim" style="transform-origin:20px 6px">
        <circle cx="20" cy="6" r="3" fill="rgba(230,238,245,.5)"/>
        <circle cx="24" cy="3" r="2.2" fill="rgba(230,238,245,.4)"/>
      </g>
      <rect x="8" y="14" width="52" height="12" rx="2" fill="${color}"/>
      <rect x="8" y="14" width="52" height="3" rx="2" fill="rgba(255,255,255,.16)"/>
      <rect x="42" y="4" width="16" height="12" rx="1.5" fill="${color}"/>
      <rect x="45" y="7" width="10" height="6" rx="1" fill="#bcd7e8"/>
      <rect x="16" y="9" width="7" height="7" rx="1" fill="${color}"/>
      <path d="M14 9 L25 9 L23 6 L16 6 Z" fill="${color}"/>
      <circle cx="36" cy="20" r="2" fill="#ffb400"/>
      <path d="M60 14 L66 20 L66 26 L60 26 Z" fill="#3a3f47"/>
      <path d="M60 26 L67 26 L64 31 L60 31 Z" fill="#20242c"/>
      <rect x="6" y="26" width="58" height="2.5" fill="#20242c"/>
      ${trainWheel(18, 28, 5)}${trainWheel(34, 28, 5)}${trainWheel(50, 28, 5)}`,
    },
    team: {
      vb: "0 0 72 34",
      body: (color) => `
      <g class="steam anim" style="transform-origin:14px 6px">
        <circle cx="14" cy="6" r="2.6" fill="rgba(230,238,245,.5)"/>
        <circle cx="17" cy="3" r="2" fill="rgba(230,238,245,.4)"/>
      </g>
      <rect x="40" y="12" width="30" height="14" rx="2" fill="${color}"/>
      <rect x="40" y="12" width="30" height="3" rx="2" fill="rgba(255,255,255,.16)"/>
      <rect x="46" y="16" width="8" height="7" rx="1" fill="#bcd7e8"/>
      <rect x="58" y="16" width="8" height="7" rx="1" fill="#bcd7e8"/>
      <rect x="4" y="14" width="32" height="12" rx="2" fill="#3671c6"/>
      <rect x="26" y="6" width="10" height="10" rx="1.5" fill="#3671c6"/>
      <rect x="10" y="9" width="5" height="6" rx="1" fill="#3671c6"/>
      <rect x="4" y="26" width="66" height="2.5" fill="#20242c"/>
      ${trainWheel(12, 28, 4.6)}${trainWheel(26, 28, 4.6)}${trainWheel(48, 28, 4.6)}${trainWheel(62, 28, 4.6)}`,
    },
  },

  /* ---------------------------------------------------------------- boats
     Speedboat (planing hull, windshield, spray) + a big ship for the team.
     Ocean track. w=118. */
  boats: {
    id: "boats",
    label: "Boats",
    w: 118,
    teamColor: "#d24b40",   // red hull, clear of amber and the racer red-vs-shape
    racer: {
      vb: "0 0 72 30",
      body: (color) => `
      <g class="wake anim">
        <path d="M2 24 C8 22 12 24 6 26 C2 27 0 25 2 24 Z" fill="rgba(210,240,255,.5)"/>
      </g>
      <path d="M10 18 L58 16 C66 16 70 18 70 18 L64 24 L16 24 C12 24 10 22 10 18 Z" fill="${color}"/>
      <path d="M10 18 L58 16 C66 16 70 18 70 18 L66 19 L12 20 Z" fill="rgba(255,255,255,.2)"/>
      <path d="M16 24 L64 24 L62 25.5 L18 25.5 Z" fill="rgba(0,0,0,.3)"/>
      <path d="M28 16 L34 8 L50 8 L52 16 Z" fill="#e8edf4"/>
      <path d="M36 9 L49 9 L50 15 L35 15 Z" fill="#5a86b0"/>
      <path d="M24 16 L26 12 L30 12 L30 16 Z" fill="${color}"/>`,
    },
    team: {
      vb: "0 0 72 38",
      body: (color) => `
      <path d="M6 24 L66 24 L60 33 L14 33 C9 33 6 29 6 24 Z" fill="${color}"/>
      <path d="M6 24 L66 24 L64 26 L8 26 Z" fill="rgba(255,255,255,.16)"/>
      <path d="M14 33 L60 33 L58 34.5 L16 34.5 Z" fill="rgba(0,0,0,.32)"/>
      <rect x="18" y="10" width="34" height="14" fill="#e8edf4"/>
      <rect x="18" y="10" width="34" height="3" fill="rgba(0,0,0,.12)"/>
      <g fill="#5a86b0"><rect x="22" y="14" width="5" height="5"/><rect x="30" y="14" width="5" height="5"/><rect x="38" y="14" width="5" height="5"/><rect x="46" y="14" width="4" height="5"/></g>
      <rect x="40" y="2" width="7" height="10" rx="1" fill="${color}"/>
      <rect x="40" y="4" width="7" height="2" fill="rgba(255,255,255,.3)"/>
      <path d="M8 24 L14 24 L14 20 Z" fill="#e8edf4"/>`,
    },
  },

  /* ---------------------------------------------------------------- coins
     A gold coin (rolls/spins) + a money bag for the team. Vault track.
     w=72 — a round coin at 118 would be 118 tall and overflow the lane; 72 keeps
     the racer at 69 and the bag at 81, both inside budget. */
  coins: {
    id: "coins",
    label: "Coins",
    w: 72,
    teamColor: "#caa23a",   // sack gold-brown; the coins themselves are brighter gold
    racer: {
      vb: "0 0 50 48",
      body: (color) => `
      <g class="coin anim" style="transform-origin:25px 24px">
        <circle cx="25" cy="24" r="21" fill="#f0c33a"/>
        <circle cx="25" cy="24" r="21" fill="none" stroke="#b8860b" stroke-width="2.5"/>
        <circle cx="25" cy="24" r="16" fill="none" stroke="#d4a520" stroke-width="1.6"/>
        <path d="M31 17 Q20 14 20 21 Q20 25 26 26 Q32 27 32 31 Q32 37 21 34" stroke="#8a6410" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <path d="M25 11 L25 37" stroke="#8a6410" stroke-width="2.8" stroke-linecap="round"/>
        <ellipse cx="18" cy="16" rx="4.5" ry="6.5" fill="rgba(255,255,255,.3)"/>
      </g>`,
    },
    team: {
      vb: "0 0 46 52",
      body: (color) => `
      <path d="M13 16 C8 22 5 34 9 44 C12 50 34 50 37 44 C41 34 38 22 33 16 Z" fill="${color}"/>
      <path d="M13 16 C9 22 6 32 8 40 C10 30 14 22 18 17 Z" fill="rgba(255,255,255,.16)"/>
      <path d="M33 16 C37 22 40 34 36 44 C34 47 30 48 26 48 C33 46 35 34 31 22 Z" fill="rgba(0,0,0,.2)"/>
      <path d="M13 16 C13 12 33 12 33 16 C33 19 13 19 13 16 Z" fill="#b98f2f"/>
      <path d="M15 12 C15 8 31 8 31 12 L33 16 L13 16 Z" fill="${color}"/>
      <path d="M17 13 Q23 10 29 13" stroke="rgba(0,0,0,.28)" stroke-width="1.6" fill="none"/>
      <circle cx="23" cy="33" r="10" fill="#f0c33a"/>
      <circle cx="23" cy="33" r="10" fill="none" stroke="#b8860b" stroke-width="1.6"/>
      <path d="M23 27 L23 39 M20 30 A3 3 0 0 1 20 36 M26 30 A3 3 0 0 0 26 36" stroke="#8a6410" stroke-width="2" fill="none"/>`,
    },
  },
};
