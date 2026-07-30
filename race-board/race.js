/* ============================================================
   Northwind RACE BOARD — front-end

   Consumes one JSON contract (see HANDOFF.md) from RACE_CONFIG.endpoint.
   Knows nothing about Python, MySQL, or the CRM — which is what lets this whole
   folder move into the CRM untouched.

   ALWAYS-ON DISCIPLINE
   This runs 24/7 on a wall. A leak kills the TV overnight. So:
     - DOM is built once per heat and only rebuilt if the ROSTER changes
     - every poll mutates transforms and text, never innerHTML of the lanes
     - confetti nodes remove themselves; timers are singletons, cleared on reset
   ============================================================ */
(() => {
  "use strict";

  // Config comes from <body data-*>, not an inline <script>: a strict
  // `script-src 'self'` CSP blocks inline script, which would silently drop the
  // config and leave the board on defaults. The host page (local index.html, or
  // the CRM's Blade view) sets these attributes.
  // NOTE ON SYNTAX: this file targets old TV browsers (Samsung Tizen / LG webOS
  // ship Chromium ~53-85). NO nullish coalescing (??), NO optional chaining (?.)
  // — those are Chromium 80+ and are SYNTAX errors on older engines, which means
  // the whole script fails to parse and the TV shows a black screen. A missing
  // feature degrades; a syntax error is fatal. Keep this file ES2017-ish.
  const D = document.body.dataset;
  const vol = parseFloat(D.volume);
  const CFG = {
    endpoint: D.endpoint || "race.json",
    pollSeconds: +(D.poll || 60),
    heatSeconds: +(D.heat || 20),
    sound: (D.sound || "on") !== "off",
    volume: isNaN(vol) ? 0.7 : Math.min(Math.max(vol, 0), 1),
    demo: new URLSearchParams(location.search).has("demo"),
    // ?audit=1 renders the theme's geometry checks on screen. Zero cost to the
    // wall (it never sets the flag) and the only way to check a new theme
    // without a laptop and devtools.
    audit: new URLSearchParams(location.search).has("audit"),
    // hours before the "deals through …" stamp goes amber. Default 20: the
    // overnight gap (a ~3:30pm feed to the next ~11am feed) is ~19.5h and is
    // NORMAL, so a lower threshold would false-alarm every morning.
    staleHours: +(D.staleHours || 20),
  };

  const $ = (s) => document.querySelector(s);
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const pct = (f) => Math.round(f * 100) + "%";

  // ⚠ The ONE dollar formatter. The board's founding rule was no dollars on
  // screen; this exists only for the deal banner, which now shows a new deal's
  // projected AGP (a deliberate reversal — see the `agp` note in live_data.py).
  // Nothing else calls this. Rounds to $K: deals average ~$8.6K so K reads clean.
  function fmtAgp(dollars) {
    const k = Math.round(Math.abs(dollars) / 1000);
    return "$" + (k < 1 ? "<1" : k) + "K";
  }

  /**
   * hex -> rgba(). Replaces CSS color-mix(), which needs Chromium 111+ (2023)
   * and exists on no TV browser — every lane would silently lose the colour
   * tint that identifies its racer. Computing it here and handing CSS a plain
   * rgba() works on every engine.
   */
  function rgba(hex, a) {
    let h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    if (isNaN(n)) return "rgba(255,255,255," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," +
           (n & 255) + "," + a + ")";
  }

  // ---------------------------------------------------------------- state
  let data = null;          // last good payload
  let heatIx = 0;           // which heat is on screen
  let rosterKey = "";       // rebuild DOM only when this changes
  let pollTimer = null, heatTimer = null;

  // ================================================================ themes
  /**
   * A theme is the week's costume: the racer, the team vehicle, and (later) the
   * track skin. Everything else about the board is theme-independent.
   *
   * An author supplies only { vb, body(color) } per vehicle. They never write the
   * <svg> tag — artSVG() emits it. That is not a convenience, it's the guard:
   *
   *   If a theme could declare its own width, the dangerous mistake would be
   *   INVISIBLE. Declare w:118, draw width="100", and the racer AND the team
   *   vehicle make the same error, so the pace line stays perfectly straight and
   *   the board merely looks slightly wrong forever. Validating a declared width
   *   only catches racer-vs-team disagreement — which already announces itself
   *   as a jog. And console.warn is not a guard on a wall nobody opens devtools
   *   on. Emitting the tag makes width and height structural instead.
   *
   * THE INVARIANTS, both load-bearing:
   *
   * 1. Every vehicle in a theme is exactly THEME.w wide. May differ BETWEEN
   *    themes, never WITHIN one. paceX = pace*usable + w/2, so two widths on one
   *    screen produce two pace positions and the amber line jogs at the bottom
   *    row. That already shipped once. (Per-lane width measurement is worse, not
   *    better: it self-heals per row, so divergence hides instead of showing.)
   *
   * 2. Height is the real constraint; w is back-derived from it. .track is
   *    overflow:hidden, lanes are 110 and the team strip 96. A horizontal shark
   *    at w=118 is free; an upright minifig at w=118 renders ~180 tall and gets
   *    guillotined — that theme must be ~60 wide. Budget: racer <=100, team <=88.
   *
   * Authoring rules that no code can enforce:
   *   - face RIGHT; the board races left->right.
   *   - centre the character's MASS horizontally in the viewBox. The pace anchor
   *     is w/2, so a swimmer whose body sits in the left 60% stays lane-aligned
   *     but "level with the amber line" stops meaning "on pace".
   *   - paint the main mass with the passed colour, FLAT. A gradient to black
   *     washes every racer grey and kills the only thing identifying them at TV
   *     distance. Colour is the person's identity and the one constant across
   *     weeks — see PERSON_COLORS in live_data.py.
   *   - rotating parts: set transform-origin INLINE in viewBox user units and
   *     never use transform-box (see wheelSVG).
   */
  const CARS = {
    id: "cars",
    label: "Race Cars",
    w: 118,
    teamColor: "#ffd400",      // school-bus yellow — see teamColor() on the --pace clash
    // Flat lane colour + shaded underside.
    racer: {
      vb: "0 0 72 28",
      body: (color) => `
      <path d="M2 19 L10 19 L14 13 L30 11 L38 6 L48 6 L54 12 L68 13 L70 19 L64 20 L8 20 Z" fill="${color}"/>
      <path d="M2 19 L70 19 L70 19.5 L64 20 L8 20 Z" fill="rgba(0,0,0,.4)"/>
      <path d="M14 13 L30 11 L38 6 L48 6 L54 12 Z" fill="rgba(255,255,255,.16)"/>
      <path d="M38 7 L48 7 L52 12 L36 12 Z" fill="rgba(0,0,0,.5)"/>
      <rect x="0"  y="15" width="9" height="5" rx="1" fill="#20242c"/>
      <rect x="63" y="9"  width="9" height="4" rx="1" fill="#20242c"/>
      ${wheelSVG(18, 20, 7)}
      ${wheelSVG(52, 20, 7.5)}`,
    },
    /**
     * The school bus: the whole company as one vehicle. Taller, not longer —
     * invariant 1 above is why, and it's the reason this reads as a stubby
     * cartoon bus rather than a coach.
     *
     * School-bus yellow sits close to --pace (#ffb400), and an on-pace bus parks
     * ON the pace line — the most important read on the board, at its least
     * legible moment. The dark outline, black window band, skirt and bumpers are
     * what separate the two. Don't flatten them out.
     */
    team: {
      vb: "0 0 72 34",
      body: (color) => `
      <rect x="9"  y="3" width="4" height="2.4" rx="1" fill="#e10600"/>
      <rect x="41" y="3" width="4" height="2.4" rx="1" fill="#e10600"/>
      <path d="M2 5 L50 5 L56 15 L70 15 L70 25 L2 25 Z" fill="${color}"
            stroke="#0c0f14" stroke-width="1.6" stroke-linejoin="round"/>
      <rect x="2" y="5" width="48" height="2" fill="rgba(255,255,255,.16)"/>
      <path d="M2 24 L70 24 L70 25 L2 25 Z" fill="rgba(0,0,0,.4)"/>
      <rect x="5"  y="8" width="9" height="7" rx="1" fill="#121820"/>
      <rect x="16" y="8" width="9" height="7" rx="1" fill="#121820"/>
      <rect x="27" y="8" width="9" height="7" rx="1" fill="#121820"/>
      <rect x="38" y="8" width="9" height="7" rx="1" fill="#121820"/>
      <path d="M49 7 L55.5 15 L49 15 Z" fill="#121820"/>
      <rect x="2" y="20.4" width="68" height="2.6" fill="#20242c"/>
      <rect x="0"  y="19" width="3" height="5" rx="1" fill="#20242c"/>
      <rect x="69" y="18.5" width="3" height="5.5" rx="1" fill="#20242c"/>
      <rect x="65" y="16" width="4" height="2.6" rx="1" fill="#fff3c4"/>
      ${wheelSVG(14, 25, 7)}
      ${wheelSVG(60, 25, 7)}`,
    },
  };

  /**
   * THEME RESOLUTION — the rule here is that there is NO path to a black screen.
   *
   * The art injection at boot is the most dangerous call site on this board: it
   * runs before fit(), before poll(), and outside any try/catch. Under a theme
   * system a typo'd data-theme would make it `undefined.team` -> TypeError ->
   * the whole IIFE dies -> a black wall until someone notices. And we can't guard
   * with `?.` (Chromium 80+, a SYNTAX error on the older panels).
   *
   * So: CARS is built into this file and every failure falls back to it —
   * missing themes.js, broken themes.js, unknown id, a prototype key like
   * `?theme=__proto__`, a malformed entry, or art that throws when rendered.
   * The board degrades to race cars; it never dies. That is the same always-on
   * discipline as "a dead TV is worse than a stale one" in poll().
   *
   * themes.js is purely ADDITIVE: delete it and the board still runs.
   */
  const THEMES = (typeof RACE_THEMES !== "undefined" && RACE_THEMES) || {};

  // Row budget: .track is overflow:hidden, lanes are 110 and the team strip 96.
  // Art taller than this gets guillotined at both ends — see invariant 2.
  const MAX_H = { racer: 100, team: 88 };

  function themeWarn(id, why) {
    // Loud, because the alternative is a wall quietly showing the wrong costume.
    console.warn("[race-board] theme " + JSON.stringify(id) + " rejected: " + why +
                 " — falling back to " + CARS.id);
  }

  function wellFormed(t) {
    if (!t || typeof t !== "object") return "not an object";
    if (!(t.w > 0)) return "no positive w";
    for (const k of ["racer", "team"]) {
      if (!t[k] || typeof t[k] !== "object") return "missing " + k;
      if (!t[k].vb || t[k].vb.split(/\s+/).length !== 4) return k + ".vb is not a 4-number viewBox";
      if (typeof t[k].body !== "function") return k + ".body is not a function";
    }
    return "";
  }

  // `let`, not `const`: resolution below swaps it in only after the candidate has
  // actually rendered without throwing.
  let THEME = CARS;

  (function resolveTheme() {
    const want = new URLSearchParams(location.search).get("theme") || D.theme || "";
    if (!want || want === CARS.id) return;
    // hasOwnProperty, not `in`/[] — `?theme=constructor` or `__proto__` would
    // otherwise return a function/object off the prototype chain and blow up.
    if (!Object.prototype.hasOwnProperty.call(THEMES, want)) {
      return themeWarn(want, "not in the registry (is themes.js loaded, before race.js?)");
    }
    const cand = THEMES[want];
    const bad = wellFormed(cand);
    if (bad) return themeWarn(want, bad);

    THEME = cand;                      // provisional — artHeight/artSVG read THEME
    const rh = artHeight(cand.racer), th = artHeight(cand.team);
    try {
      // Smoke-test BOTH vehicles before the wall ever sees them. A body() that
      // throws must be caught here, not at boot with no handler.
      artSVG(cand.racer, "#000000", "");
      artSVG(cand.team, "#000000", "bus");
    } catch (e) {
      THEME = CARS;
      return themeWarn(want, "art threw when rendered: " + e.message);
    }
    // Height is the one thing artSVG can't make structural — w is chosen by the
    // author, and a tall viewBox at a wide w silently overflows the row.
    if (rh > MAX_H.racer || th > MAX_H.team) {
      THEME = CARS;
      return themeWarn(want, "art too tall for the row (racer " + rh + "/" + MAX_H.racer +
                       ", team " + th + "/" + MAX_H.team + ") — lower w");
    }
  })();

  /**
   * The team vehicle's colour. Themed, unlike a racer's: the team is not a
   * person, so this carries no identity and a school-bus-yellow whale just looks
   * broken. Racer colours stay pinned per-person forever (PERSON_COLORS) — that
   * is the one thing a theme must never touch.
   *
   * Two hard constraints on any theme's teamColor:
   *   - it must not collide with --pace (#ffb400). An on-pace team vehicle parks
   *     ON the amber line, which is the board's most important read at its least
   *     legible moment. Cars' #ffd400 only survives it because of the bus's dark
   *     outline; pick something further away and you don't need the trick.
   *   - it must not read as any PERSON_COLORS hue, or the team looks like a racer.
   *
   * This used to be a const duplicated into index.html's bus-lane inline style.
   * Now it's set from JS at boot, so there's one source of truth.
   */
  const teamColor = () => THEME.teamColor || "#ffd400";

  /**
   * Emit a vehicle. Width comes from THEME.w and height is derived from the
   * author's own viewBox aspect, so neither can be mis-declared.
   *
   * `class="car"` is applied here because .car-wrap.done .car hard-requires it —
   * without it the finish-line pop silently dies. Structural, not a convention.
   *
   * Sanity: cars are vb "0 0 72 28" at w=118 -> round(118*28/72) = 46, and the
   * bus "0 0 72 34" -> round(118*34/72) = 56. Both match the hand-written values
   * this replaced exactly, which is why Step 2 is a provable no-op.
   */
  function artHeight(spec) {
    const vb = spec.vb.split(/\s+/);
    return Math.round(THEME.w * (+vb[3]) / (+vb[2]));
  }

  function artSVG(spec, color, extra) {
    const cls = extra ? "car " + extra : "car";
    // Escape ONCE, here. body() receives a colour that is already safe to
    // interpolate, so an author in themes.js cannot forget to escape — and
    // couldn't anyway: esc() lives inside this IIFE and isn't reachable there.
    const c = esc(color);
    return `<svg class="${cls}" width="${THEME.w}" height="${artHeight(spec)}" viewBox="${spec.vb}" aria-hidden="true">${spec.body(c)}
    </svg>`;
  }

  /**
   * A wheel that reads as a wheel.
   * The spinning part is a DASHED TREAD RING, not a diameter line — a line
   * through a circle renders as a prohibition sign, not rotation. Tyre, rim and
   * hub stay static so only the tread appears to turn.
   *
   * `anim` is the shared reduced-motion hook: EVERY theme's moving part carries
   * it, so the reduced-motion rule is one line instead of a list that each new
   * theme has to remember to extend.
   *
   * transform-origin is inline, in viewBox USER UNITS, and there must be no
   * transform-box anywhere: fill-box resolves these same numbers against the
   * wheel's own bbox instead of the viewBox, and the wheel ORBITS instead of
   * spinning (measured: 59x64px of drift). It's Chromium 64+ anyway.
   */
  function wheelSVG(cx, cy, r) {
    return `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f1216"/>
      <g class="wheel anim" style="transform-origin:${cx}px ${cy}px">
        <circle cx="${cx}" cy="${cy}" r="${r - 1.7}" fill="none"
                stroke="#39404a" stroke-width="2.2" stroke-dasharray="2 2.6"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.38}" fill="#454c57"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="#828a97"/>`;
  }

  // ---------------------------------------------------------------- geometry
  /**
   * The travel scale for a track, and the x of the pace marker on it.
   *
   * THESE TWO MUST AGREE ACROSS EVERY ROW ON SCREEN. They were previously
   * copy-pasted into render() and renderBus() — two call sites that had to stay
   * in lockstep by hand. If they ever diverge, the eight lanes and the bus row
   * compute different pace positions and the amber line visibly jogs sideways at
   * the bottom of the board. That bug has already shipped once. One function,
   * both callers, so divergence is not expressible.
   *
   * Travel is measured by the VEHICLE BODY only. The % pill's width changes with
   * the number, so including it would give every lane a different scale and
   * misalign the marker. Note we use THEME.w rather than measuring the rendered
   * art: SVGElement has no offsetWidth, and getBoundingClientRect() returns
   * --k-scaled px that wouldn't match track.clientWidth's unscaled layout px.
   * artSVG() guarantees the art really is THEME.w wide, so the constant is true
   * by construction rather than by hope.
   *
   * At p=1 the art spans [trackW - w - 10, trackW - 10], so the nose always
   * lands 10px from the track edge whatever w is. The -10 is the real invariant;
   * 118 is not — which is what makes per-theme widths safe.
   */
  function travel(track) {
    return Math.max(track.clientWidth - THEME.w - 10, 10);
  }
  // pace marker sits at the CENTRE of an exactly-on-pace vehicle, so being level
  // with the line reads as "on pace"
  function paceLeft(track, pace) {
    return pace * travel(track) + THEME.w / 2;
  }

  // ---------------------------------------------------------------- scale
  // Board is authored at 1920x1080 and scaled to fit. Never restyle to fit.
  function fit() {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    $("#board").style.setProperty("--k", k);
  }

  // ---------------------------------------------------------------- build
  // -------------------------------------------------------------- dumpster fire
  /**
   * A gag: a button turns Jordan's vehicle into a flaming dumpster. It's a
   * per-PERSON art override, independent of the week's theme — his lane keeps his
   * name, chip and colour, so you still know whose lane it is; only the vehicle
   * changes. Rendered through artSVG like any vehicle, so it's THEME.w wide and
   * the geometry (travel, pace line) is untouched.
   *
   * State persists in localStorage so it survives the reload a theme switch does.
   * Colour is ignored — the joke is that it's NOT his car.
   */
  const DUMPSTER = {
    vb: "0 0 80 60",   // -> 118x89 (racer budget 100) or 60x45 on a vertical theme
    body: () => `
      <circle cx="24" cy="57" r="3.4" fill="#14181f"/>
      <circle cx="56" cy="57" r="3.4" fill="#14181f"/>
      <path d="M10 32 L70 32 L66 33 L60 26 L14 26 Z" fill="#22401f"/>
      <g class="dump-flame dump-flame-a anim" style="transform-origin:34px 33px">
        <path d="M34 33 C25 26 28 15 33 7 C33 17 41 16 40 9 C48 18 45 29 34 33 Z" fill="#ff6a00"/>
        <path d="M34 32 C29 27 30 18 33 12 C33 20 39 19 38 13 C43 20 40 29 34 32 Z" fill="#ffb400"/>
        <path d="M34 31 C31 28 31 22 33 18 C33 23 37 22 36 18 C39 24 37 29 34 31 Z" fill="#ffe08a"/>
      </g>
      <g class="dump-flame dump-flame-b anim" style="transform-origin:48px 33px">
        <path d="M48 33 C40 27 42 17 46 10 C46 19 53 18 52 12 C59 20 56 30 48 33 Z" fill="#ff7a12"/>
        <path d="M48 32 C44 28 45 20 47 15 C47 22 52 21 51 16 C55 23 52 29 48 32 Z" fill="#ffc21e"/>
      </g>
      <g class="dump-flame dump-flame-c anim" style="transform-origin:26px 33px">
        <path d="M26 33 C20 28 22 20 26 14 C26 21 31 20 30 15 C35 21 33 29 26 33 Z" fill="#ff8a1e"/>
      </g>
      <path d="M12 33 L68 33 L64 56 L16 56 Z" fill="#2f6b34"/>
      <path d="M12 33 L68 33 L67 36 L13 36 Z" fill="#3f8a46"/>
      <path d="M16 55.4 L64 55.4 L64 56 L16 56 Z" fill="rgba(0,0,0,.4)"/>
      <path d="M22 37 L20.5 54 M33 37 L32.5 54 M44 37 L44 54 M55 37 L56 54" stroke="rgba(0,0,0,.22)" stroke-width="1.5" fill="none"/>
      <path d="M12 33 L68 33 L68 34.5 L12 34.5 Z" fill="#1c4020"/>`,
  };

  // Jordan's id is 'jordanpike' live but 'jordanpike' (slug) in mock — match
  // either, plus his display name as a backstop.
  const DUMP_IDS = ["jordanpike", "jordanpike"];
  let dumpsterOn = false;
  try { dumpsterOn = localStorage.getItem("race-dumpster") === "1"; } catch (e) {}
  function isDumpster(r) {
    return dumpsterOn &&
      (DUMP_IDS.indexOf(r.id) >= 0 || r.name === "Jordan Pike");
  }
  function racerArt(r) {
    return isDumpster(r)
      ? artSVG(DUMPSTER, r.color, "dump")
      : artSVG(THEME.racer, r.color, "");
  }

  function buildLanes(heat) {
    const lanes = $("#lanes");
    lanes.innerHTML = heat.racers
      .map(
        (r, i) => `
      <div class="lane" data-id="${esc(r.id)}" style="--color:${esc(r.color)};--d:${i * 45}ms;--tint-13:${rgba(r.color, .13)};--tint-30:${rgba(r.color, .30)};--tint-55:${rgba(r.color, .55)}">
        <div class="gutter">
          <span class="chip">${esc(r.initials)}</span>
          <span class="who">
            <span class="nm">${esc(r.name)}</span>
            <span class="sub" data-sub></span>
          </span>
          <span class="crown" aria-hidden="true">&#128081;</span>
        </div>
        <div class="track">
          <div class="pace"></div>
          <div class="finish"></div>
          <div class="car-wrap"><div class="car-inner">
            ${racerArt(r)}
            <span class="puff"></span><span class="streak"></span>
            <span class="pill" data-pill></span>
          </div></div>
        </div>
      </div>`
      )
      .join("");
  }

  // ---------------------------------------------------------------- render
  function render() {
    if (!data) return;
    const heat = data.heats[heatIx];
    const pace = data.week.pace_pct;

    $("#heat-label").textContent = heat.label;
    $("#week-label").textContent = fmtWeek(data.week.start, data.week.end);
    $("#co-agp").textContent = pct(data.week.company.pct);
    $("#pace-label").textContent = pct(pace);
    $("#badge-mock").hidden = !data.mock;
    renderFreshness();

    // Last window's winner for THIS page (each heat carries its own). Name + %
    // of goal — no dollars. Updates when the heats rotate. Hidden on a zero week.
    const lw = heat.last_winner;
    const lwEl = $("#last-winner");
    if (lw) {
      $("#lw-name").textContent = lw.name;
      $("#lw-pct").textContent = pct(lw.pct);
      lwEl.hidden = false;
    } else {
      lwEl.hidden = true;
    }

    // Rank by completeness, best first. Tie-break on name so equal scores don't
    // jitter between polls. Lanes keep their DOM order and slide to rank via --y.
    const ranked = [...heat.racers].sort(
      (a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
    const rankOf = new Map(ranked.map((r, i) => [r.id, i]));
    const leaderId = ranked[0].id;
    const lanes = [...document.querySelectorAll(".lane")];
    // 110 is the real lane height (race.css --lane-h, and the 1080 geometry
    // budget). The fallback only fires if there are no lanes, in which case the
    // forEach below is a no-op anyway — but a stale 122 here contradicted the
    // budget and would mislead the next reader.
    const laneH = lanes[0] ? lanes[0].offsetHeight : 110;

    lanes.forEach((lane, domIx) => {
      const r = heat.racers.find((x) => x.id === lane.dataset.id);
      if (!r) return;

      // slide this row to its rank without touching the DOM order
      lane.style.setProperty("--y", (rankOf.get(r.id) - domIx) * laneH + "px");

      const track = lane.querySelector(".track");
      const wrap = lane.querySelector(".car-wrap");
      const usable = travel(track);          // shared with renderBus() — see travel()
      const p = Math.min(r.pct, 1);

      wrap.style.transform = `translate(${p * usable}px, -50%)`;
      wrap.classList.toggle("zero", r.deals === 0);
      wrap.classList.toggle("done", r.pct >= 1);
      wrap.classList.toggle("flip", p > 0.66);   // keep the label on-track

      // position caps at the finish line; the LABEL shows the true number, so
      // clearing your goal by 80% reads as 180% rather than a flat 100%
      lane.querySelector("[data-pill]").textContent = pct(r.pct);
      lane.querySelector("[data-sub]").innerHTML =
        r.deals + (r.deals === 1 ? " deal" : " deals") +
        (r.goal_source === "placeholder"
          ? ' &middot; <span class="tbd">goal TBD</span>' : "");
      lane.classList.toggle("leader", r.id === leaderId);
      const paceX = paceLeft(track, pace);
      lane.querySelector(".pace").style.left = paceX + "px";
      // the flag lives on the board, not in the lane, so offset it by the gutter
      if (domIx === 0) {
        $("#pace-flag").style.left = (track.offsetLeft + paceX) + "px";
      }
    });

    renderBus(pace);
  }

  /**
   * The team bus rides the same track, the same pace line and the same finish as
   * the racers — that's the whole point of it, so it must use the same maths.
   * It takes no rank and never wipes: it's the same number in both heats.
   */
  function renderBus(pace) {
    const co = data.week.company;
    const lane = $("#bus-lane");
    if (!lane || !co) return;

    const track = lane.querySelector(".track");
    const wrap = $("#bus-wrap");
    const usable = travel(track);      // SAME helper as the racer lanes, on purpose
    const p = Math.min(co.pct, 1);
    const deals = co.deals || 0;      // `||` not `??`: nullish coalescing is Chromium 80+

    wrap.style.transform = `translate(${p * usable}px, -50%)`;
    wrap.classList.toggle("zero", deals === 0);
    wrap.classList.toggle("done", co.pct >= 1);
    wrap.classList.toggle("flip", p > 0.66);

    // position caps at the finish; the label shows the true number, same as a car
    $("#bus-pill").textContent = pct(co.pct);
    $("#bus-sub").textContent = deals + (deals === 1 ? " deal" : " deals");
    $("#bus-pace").style.left = paceLeft(track, pace) + "px";
  }

  function fmtWeek(a, b) {
    const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const s = new Date(a + "T00:00:00"), e = new Date(b + "T00:00:00");
    return `${M[s.getMonth()]} ${s.getDate()}–${e.getDate()}`;
  }

  // ---------------------------------------------------------------- heats
  function showHeat(ix, animate) {
    heatIx = ix;
    const dots = $("#heat-dots");
    const lanes = $("#lanes");

    const swap = () => {
      buildLanes(data.heats[heatIx]);
      lanes.classList.remove("out");
      // restart the heat timer bar
      dots.innerHTML = data.heats
        .map((_, i) => `<i class="${i === heatIx ? "on" : ""}"></i>`)
        .join("");
      dots.style.setProperty("--heat-ms", CFG.heatSeconds + "s");
      requestAnimationFrame(render);
    };

    if (animate) {
      lanes.classList.add("out");
      setTimeout(swap, 300 + data.heats[0].racers.length * 45);
    } else {
      swap();
    }
  }

  function startHeatRotation() {
    if (heatTimer) clearInterval(heatTimer);
    if (!data || data.heats.length < 2) return;
    heatTimer = setInterval(
      () => showHeat((heatIx + 1) % data.heats.length, true),
      CFG.heatSeconds * 1000
    );
  }

  // ---------------------------------------------------------------- events
  /**
   * @param {number} laneIx index of the lane being announced. The toast moves to
   *   the opposite half of the screen so it never covers the car it's about —
   *   announcing the bottom racer with a bottom-right toast hides them exactly
   *   when everyone looks up.
   */
  function toast(color, html, laneIx, sad) {
    const t = $("#toast");
    t.style.setProperty("--color", color);
    t.querySelector(".tx").innerHTML = html;
    t.classList.toggle("top", laneIx >= 4);
    t.classList.toggle("sad", !!sad);   // cancel: muted dot + a small down-tick
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove("show"), 4200);
  }

  // ---------------------------------------------------------------- sound
  // Three files, one per moment:
  //   advance    — a deal booked
  //   finishline — a goal crossed (the big one)
  //   revert     — a deal cancelled
  // Browsers refuse audio until the page has had a user gesture, and a TV kiosk
  // never gets one: play() rejects with NotAllowedError and nothing would sound.
  // Two mitigations, unchanged:
  //   1. (preferred) launch Chrome with --autoplay-policy=no-user-gesture-required
  //   2. fall back to a visible hint + unlock on the first click/key/remote-OK
  const SOUND_IDS = ["#snd-advance", "#snd-finish", "#snd-revert"];
  let audioBlocked = false;

  function playSound(id) {
    if (!CFG.sound) return;
    const a = $(id);
    if (!a) return;
    a.volume = CFG.volume;
    a.currentTime = 0;              // restart if it fires again quickly
    const p = a.play();
    if (p && p.catch) {
      p.then(() => {
        audioBlocked = false;
        $("#sound-hint").hidden = true;
      }).catch(() => {
        // autoplay refused — surface it instead of failing quietly
        audioBlocked = true;
        $("#sound-hint").hidden = false;
      });
    }
  }
  function playAdvance() { playSound("#snd-advance"); }
  function playFinish()  { playSound("#snd-finish"); }
  function playRevert()  { playSound("#snd-revert"); }

  // On the first gesture, silently prime ALL THREE so their first real play
  // isn't the one fighting the autoplay block.
  function unlockAudio() {
    if (!CFG.sound || !audioBlocked) return;
    SOUND_IDS.forEach((id) => {
      const a = $(id);
      if (!a) return;
      a.volume = 0;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.volume = CFG.volume;
      }).catch(() => {});
    });
    audioBlocked = false;
    $("#sound-hint").hidden = true;
  }
  ["click", "keydown", "touchstart"].forEach((ev) =>
    addEventListener(ev, unlockAudio, { passive: true }));

  function confetti(color, n) {
    const box = $("#confetti");
    const palette = [color, "#ffb400", "#ffffff", "#00d2be", "#e10600"];
    const count = n || 60;
    for (let i = 0; i < count; i++) {
      const c = document.createElement("i");
      c.className = "conf";
      // biased toward the finish end of the track, where the win happens
      c.style.left = 34 + Math.random() * 64 + "%";
      c.style.background = palette[i % palette.length];
      c.style.width = 8 + Math.round(Math.random() * 7) + "px";
      c.style.height = 12 + Math.round(Math.random() * 10) + "px";
      c.style.animationDuration = 1.3 + Math.random() * 1.6 + "s";
      c.style.animationDelay = Math.random() * 0.6 + "s";
      box.appendChild(c);
      setTimeout(() => c.remove(), 3600);   // self-cleaning: no leak on a 24/7 wall
    }
  }

  /**
   * The win moment: checkered flags + a name card + a heavy confetti burst.
   * Must read with the sound OFF — a TV's built-in browser gives no way to
   * force autoplay, so this is the only celebration we can rely on.
   * Re-entrant: a second win inside the window restarts cleanly rather than
   * stacking overlays (and leaking them).
   */
  let winTimer = null;
  function celebrate(name, color) {
    const win = $("#win");
    win.style.setProperty("--win-color", color);
    $("#win-name").textContent = name;

    // restart the CSS animations even if the overlay is already showing
    win.hidden = true;
    void win.offsetWidth;          // force reflow so the animations replay
    win.hidden = false;

    clearTimeout(winTimer);
    winTimer = setTimeout(() => { win.hidden = true; }, 4600);

    confetti(color, 130);
    playFinish();
  }

  /**
   * React to a change on a racer this poll. Three outcomes, never mixed:
   *   crossed  -> celebrate (fanfare + card). A win outranks everything.
   *   gained>0 -> ding + "booked a deal" banner with the projected AGP.
   *   gained<0 -> womp + "deal fell through" banner. A CANCEL, and it must never
   *               reach celebrate — the fanfare belongs to crossing UP only.
   * dAgp is the racer's window-AGP change since last poll: for a booking it's the
   * new deal's projected value; for a cancel it's what was pulled back.
   */
  function announce(racerId, gained, dAgp, crossed) {
    const lane = document.querySelector(`.lane[data-id="${CSS.escape(racerId)}"]`);
    if (!lane) return;   // racer is in the other heat right now — stay silent

    const color = getComputedStyle(lane).getPropertyValue("--color");
    const r = data.heats[heatIx].racers.find((x) => x.id === racerId);
    if (!r) return;
    const first = esc(r.name.split(" ")[0]);
    const laneIx = [...lane.parentElement.children].indexOf(lane);

    if (crossed) {
      celebrate(r.name, color);          // flags + card + confetti + fanfare
      return;                            // the win card says it better than a toast
    }

    const wrap = lane.querySelector(".car-wrap");

    if (gained > 0) {
      wrap.classList.add("moving");      // puff + streak: forward motion
      setTimeout(() => wrap.classList.remove("moving"), 2400);
      playAdvance();
      const amt = dAgp > 0 ? " &middot; ~<b>" + fmtAgp(dAgp) + "</b> projected" : "";
      toast(color,
        `${first} booked ${gained > 1 ? gained + " deals" : "a deal"}${amt} &middot; ` +
        `now <b>${pct(r.pct)}</b>`,
        laneIx);
    } else {                             // gained < 0 — a cancellation
      playRevert();
      // no `moving` class: the car slides BACKWARD via the normal transition, and
      // a forward streak on a reversing car would read wrong.
      const amt = dAgp < 0 ? " &middot; &minus;<b>" + fmtAgp(dAgp) + "</b>" : "";
      toast(color,
        `${first}&rsquo;s deal fell through${amt} &middot; now <b>${pct(r.pct)}</b>`,
        laneIx, true);
    }
  }

  // ---------------------------------------------------------------- poll
  // A new deal is detected by the DEAL COUNT rising, not an AGP delta — the
  // payload carries no AGP by design.
  //
  // Crossing the goal is checked INDEPENDENTLY of the deal count. Percent can
  // move without a new deal (someone corrects a deal's AGP in Sugar after the
  // fact), and gating the fanfare on `gained > 0` would let a car slide past the
  // finish line in silence. The celebration belongs to the crossing, not to the
  // deal that happened to cause it.
  function diffAndAnnounce(prev, next) {
    if (!prev) return;
    next.heats.forEach((h, hi) => {
      if (hi !== heatIx) return;   // only announce what's on screen
      h.racers.forEach((r) => {
        const before = prev.heats[hi] &&
          prev.heats[hi].racers.find((x) => x.id === r.id);
        if (!before) return;
        const gained = r.deals - before.deals;
        const crossed = before.pct < 1 && r.pct >= 1;
        // `|| 0`, not `??`: agp may be absent on an older payload (Chromium 80+
        // for ??, and this file targets ~53-85).
        const dAgp = (r.agp || 0) - (before.agp || 0);
        // A crossing OR any change in deal count is worth a reaction. A pure AGP
        // edit with no deal change and no crossing stays silent, as before.
        if (crossed || gained !== 0) announce(r.id, gained, dAgp, crossed);
      });
    });

    // The team clearing its own goal is the biggest thing this board can show.
    // Checked OUTSIDE the heat loop because the bus is always on screen — unlike
    // a racer, it can never be "in the other heat", so it never has to stay
    // silent. Deliberately last: celebrate() is re-entrant and the final call
    // wins, so if a person and the team cross on the same poll, the team's card
    // is the one left standing. That's the right billing.
    if (prev.week && next.week &&
        prev.week.company.pct < 1 && next.week.company.pct >= 1) {
      celebrate("Whole Team", teamColor());
    }
  }

  async function poll() {
    try {
      const res = await fetch(CFG.endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const next = await res.json();
      const key = next.heats
        .map((h) => h.racers.map((r) => r.id).join(",")).join("|");

      const prev = data;
      data = next;
      $("#err").hidden = true;

      if (key !== rosterKey) {      // roster changed -> rebuild once
        rosterKey = key;
        showHeat(heatIx % data.heats.length, false);
        startHeatRotation();
      } else {
        diffAndAnnounce(prev, next);
        render();                    // mutate only
      }
    } catch (e) {
      // keep showing the last good board; a dead TV is worse than a stale one
      $("#err").hidden = false;
      $("#err").textContent = "Feed unavailable · showing last known board";
    }
  }

  // ---------------------------------------------------------------- demo
  // ?demo=1 fires synthetic deals client-side so the motion, toasts and finish
  // celebration are all judgeable without waiting days for a real deal.
  function startDemo() {
    setInterval(() => {
      if (!data) return;
      const heat = data.heats[heatIx];
      const r = heat.racers[Math.floor(Math.random() * heat.racers.length)];
      const co = data.week.company;
      const coWas = co.pct, was = r.pct;

      // 1 in 5 is a CANCEL — but only for someone who has a deal to lose, so the
      // womp + "fell through" path is exercised without inventing negative deals.
      const cancel = r.deals > 0 && Math.random() < 0.2;
      // a deal is a big, lumpy fraction of a weekly goal — real deal AGP has
      // sd ~$12K against goals of ~$10-50K, so jumps are deliberately violent
      const jump = 0.12 + Math.random() * 0.55;
      const dollars = Math.round(jump * 18000);   // fake $ so the banner has a delta

      if (cancel) {
        r.pct = Math.max(0, r.pct - jump);
        r.deals -= 1;
        r.agp = Math.max(0, (r.agp || 0) - dollars);
        if (heatIx === 0) {
          co.pct = Math.max(0, co.pct - jump / 8);
          co.deals = Math.max(0, (co.deals || 0) - 1);
        }
      } else {
        r.pct = r.pct + jump;    // uncapped, like the real payload — see render()
        r.deals += 1;
        r.agp = (r.agp || 0) + dollars;
        // Only the buyer heat moves the bus: every deal has a buyer AND an AM, so
        // crediting both heats would double-count it — same rule as the adapter.
        if (heatIx === 0) {
          co.pct = co.pct + jump / 8;    // uncapped, so the bus can actually finish
          co.deals = (co.deals || 0) + 1;
        }
      }
      render();
      const gained = cancel ? -1 : 1;
      announce(r.id, gained, cancel ? -dollars : dollars, was < 1 && r.pct >= 1);
      if (coWas < 1 && co.pct >= 1) celebrate("Whole Team", teamColor());
    }, 4200);
  }

  // ---------------------------------------------------------------- clock
  function tickClock() {
    const d = new Date();
    $("#clock").textContent = d
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      .replace(/\s/g, "");
    renderFreshness();   // re-age the stamp even between polls
  }

  // "Deals through 1:42PM" — the newest deal the board has, so a viewer knows the
  // cutoff of a twice-daily feed instead of reading the board as broken. Same-day
  // shows the time; a prior day prepends the weekday (which is itself the stale
  // signal), and past CFG.staleHours it goes amber. data_through is UTC (ends
  // 'Z'); new Date() renders it in the board's local timezone.
  const _WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function fmtThrough(d) {
    const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      .replace(/\s/g, "");
    return d.toDateString() === new Date().toDateString() ? t : _WD[d.getDay()] + " " + t;
  }
  function renderFreshness() {
    const el = $("#data-through");
    if (!el) return;
    const iso = data && data.data_through;
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d.getTime())) { el.hidden = true; return; }
    const stale = (Date.now() - d.getTime()) > CFG.staleHours * 3600000;
    el.classList.toggle("stale", stale);
    el.textContent = (stale ? "⚠ " : "") + "Deals through " + fmtThrough(d);
    el.hidden = false;
  }

  // -------------------------------------------------------- theme + dumpster
  /**
   * The board carries NO on-screen controls anymore. Theme switching and
   * Jordan's dumpster toggle live in the /control page (a second tab), so the
   * old cursor-reveal chip switcher — and the mousemove listener that revealed
   * it — are gone. The wall stays `cursor: none` and inert; remoteControl()
   * below applies whatever /control says.
   *
   * gotoTheme() stays: a theme change still RELOADS with ?theme= (the board
   * resolves its theme once at boot on purpose — a runtime swap would have to
   * re-render build-once team art and re-run buildLanes), now driven from
   * /control instead of a click.
   */
  function gotoTheme(id) {
    if (id === THEME.id) return;             // already showing it
    const u = new URL(location.href);
    u.searchParams.set("theme", id);
    location.href = u.toString();
  }

  // Set Jordan's dumpster to an explicit on/off state (not a toggle — /control
  // holds the truth). Persist so a board reload keeps it, then rebuild the
  // current heat so his vehicle swaps immediately (buildLanes re-checks
  // isDumpster per racer).
  function setDumpster(on) {
    if (on === dumpsterOn) return;
    dumpsterOn = on;
    try { localStorage.setItem("race-dumpster", on ? "1" : "0"); } catch (e) {}
    if (data) showHeat(heatIx, false);
  }

  // ---------------------------------------------------------------- audit
  /**
   * ?audit=1 — check a theme's geometry in one glance, on the screen it will
   * actually run on. The alternative is a console nobody opens on a wall.
   *
   * These are the invariants no amount of code can make structural, plus the
   * ones that can, re-checked against the live DOM rather than trusted.
   */
  function runAudit() {
    const q = (s) => [...document.querySelectorAll(s)];
    const trackX = q(".track").map((e) => Math.round(e.getBoundingClientRect().x));
    const paceX = q(".pace").map((e) => e.style.left);
    const widths = q("svg.car").map((e) => +e.getAttribute("width"));
    const rh = artHeight(THEME.racer), th = artHeight(THEME.team);
    const rows = [
      // the one that matters: a jog here means two widths reached the screen
      ["pace line is one straight vertical", new Set(paceX).size === 1, paceX[0] || "—"],
      ["all tracks start at one x", new Set(trackX).size === 1, trackX.join(" ")],
      ["every vehicle is THEME.w wide", widths.length > 0 && widths.every((w) => w === THEME.w), widths.join(" ")],
      ["racer height fits the lane", rh <= MAX_H.racer, rh + " / " + MAX_H.racer + "px"],
      ["team height fits the strip", th <= MAX_H.team, th + " / " + MAX_H.team + "px"],
      ["board is exactly 1080 tall", $("#board").offsetHeight === 1080, $("#board").offsetHeight + "px"],
    ];
    const bad = rows.filter((r) => !r[1]).length;
    const err = $("#err");
    err.innerHTML =
      `<b>audit · theme "${esc(THEME.id)}" · w=${THEME.w} · ${bad ? bad + " FAILED" : "all clear"}</b><br>` +
      rows.map((r) => (r[1] ? "&#10003; " : "&#10007; ") + esc(r[0]) + " <i>" + esc(r[2]) + "</i>").join("<br>");
    err.hidden = false;
  }

  // ---------------------------------------------------------------- boot
  // The resolved id drives the theme's CSS: `.board[data-theme="x"] .track`.
  // It goes on #board, NOT <body> — .board is a CHILD of body, so an attribute
  // set on body would never match that selector. Writing it here also means
  // ?theme= skins correctly instead of CSS and JS disagreeing about the week.
  // Must land before fit() so the first paint is already themed.
  $("#board").dataset.theme = THEME.id;

  // Tint the team lane from the theme, the same way buildLanes() tints a racer's.
  // This used to be hardcoded in index.html, duplicating BUS_COLOR — so a themed
  // team vehicle would have kept a school-bus-yellow gutter behind a blue whale.
  (function tintTeamLane() {
    const c = teamColor(), lane = $("#bus-lane");
    lane.style.setProperty("--color", c);
    lane.style.setProperty("--tint-13", rgba(c, 0.13));
    lane.style.setProperty("--tint-30", rgba(c, 0.30));
    lane.style.setProperty("--tint-55", rgba(c, 0.55));
  })();

  // Mount the team art once. outerHTML replaces the placeholder span outright, so
  // the <svg> ends up a direct child of .car-inner exactly like a racer's — an
  // extra wrapping span would offset it against every lane above.
  //
  // try/catch because this is the one art call with no handler above it: it runs
  // before fit() and before poll(), so an exception here kills the IIFE and
  // blacks out the wall. resolveTheme() already smoke-tested the art, so this
  // should be unreachable — which is exactly why it's cheap to keep.
  try {
    $("#bus-art").outerHTML = artSVG(THEME.team, teamColor(), "bus");
  } catch (e) {
    const failed = THEME.id;          // read BEFORE reassigning, or we blame cars
    THEME = CARS;
    themeWarn(failed, "team art threw at boot: " + e.message);
    $("#board").dataset.theme = CARS.id;
    $("#bus-art").outerHTML = artSVG(CARS.team, teamColor(), "bus");
  }

  fit();
  addEventListener("resize", () => { fit(); render(); });
  tickClock();
  setInterval(tickClock, 20000);
  // after the first payload has painted, so the audit measures the real DOM
  if (CFG.audit) setTimeout(runAudit, 2500);

  poll();
  pollTimer = setInterval(poll, CFG.pollSeconds * 1000);
  if (CFG.demo) startDemo();

  // ---------------------------------------------------------------- remote control
  /**
   * OPTIONAL, opt-in via data-control. Lets a second browser tab (/control)
   * drive THIS board live: switch theme, mute/unmute, force a data refresh.
   * State lives on the server, not in either browser — so the control tab can
   * be on this machine or another device on the LAN, same mechanism either way.
   *
   * Purely additive and defensive, exactly like themes.js:
   *   - no data-control (the CRM Blade view, unless the CRM serves /api/control)
   *     -> this never runs.
   *   - a 404 -> the endpoint isn't there; stop polling for good, don't spam it.
   *   - any other error -> swallow and try next tick. A control glitch must
   *     never take down the wall; a stale board beats a black one (see poll()).
   *
   * Sound flips live (CFG.sound is re-read on every play). Theme can't: the
   * board resolves it once at boot by design, so a theme change RELOADS with
   * ?theme= via gotoTheme(), which preserves ?demo/?audit. Refresh re-polls the
   * feed the instant the server's refreshRev advances, instead of waiting out
   * the poll interval.
   */
  (function remoteControl() {
    const ep = D.control;
    if (!ep) return;                                   // wall opts in; else silent
    const every = Math.max(1, +(D.controlPoll || 3)) * 1000;
    let seenRefresh = null;   // adopt the server's counter on first sight, so a
                              // refresh issued before boot doesn't double-fire
    let ctlTimer = null;

    async function tick() {
      let st;
      try {
        const res = await fetch(ep, { cache: "no-store" });
        if (res.status === 404) { clearInterval(ctlTimer); return; }
        if (!res.ok) return;                           // transient; next tick
        st = await res.json();
      } catch (e) { return; }                          // network blip; keep polling

      if (st.sound === "on" || st.sound === "off") {   // live, no reload
        const want = st.sound !== "off";
        if (want !== CFG.sound) CFG.sound = want;
      }

      if (st.dumpster === "on" || st.dumpster === "off") {   // live, rebuilds heat
        setDumpster(st.dumpster === "on");
      }

      if (typeof st.refreshRev === "number") {         // force-refresh nudge
        if (seenRefresh === null) seenRefresh = st.refreshRev;
        else if (st.refreshRev !== seenRefresh) { seenRefresh = st.refreshRev; poll(); }
      }

      if (st.theme && st.theme !== THEME.id) gotoTheme(st.theme);   // reload
    }

    ctlTimer = setInterval(tick, every);
    tick();
  })();
})();
