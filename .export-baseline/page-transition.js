/* BenAri page transition — line opens, birds fall, page scrolls in behind them. */
(function () {
  if (window.__benariTransition) return;
  window.__benariTransition = true;

  var BLUE = '#0352BA', CREAM = '#EDE9E4', INK = '#241E1A';
  var PAGE_BG = {
    'home.dc.html': BLUE, 'index.html': BLUE,
    'benari demo.dc.html': BLUE, 'benari demo v1.dc.html': BLUE, 'benari.html': BLUE,
    'signal desk.dc.html': CREAM, 'signal-desk.html': CREAM
  };
  var KEY = '__benari_transition';
  var BIRDS = ['glide', 'land', 'climb'];
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fileOf(url) {
    var p = url.split('#')[0].split('?')[0];
    return decodeURIComponent(p.substring(p.lastIndexOf('/') + 1)).toLowerCase();
  }
  function bgFor(url) { return PAGE_BG[fileOf(url)] || BLUE; }
  function ownBg() {
    var here = PAGE_BG[fileOf(location.pathname)];
    if (here) return here;
    var c = getComputedStyle(document.body).backgroundColor;
    return (c && c !== 'rgba(0, 0, 0, 0)') ? c : BLUE;
  }
  function birdColorOn(bg) {
    var b = String(bg).toLowerCase();
    return (b === CREAM.toLowerCase() || b.indexOf('237, 233, 228') > -1) ? 'blue' : 'cream';
  }
  function assetBase() {
    var img = document.querySelector('img[src*="assets/"]');
    if (!img) return 'assets/';
    var s = img.getAttribute('src');
    return s.substring(0, s.indexOf('assets/') + 7);
  }

  function vpH() {
    return (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  }
  function birdSize() {
    var w = window.innerWidth;
    return w < 760 ? Math.round(w * 0.26) : Math.min(190, Math.round(w * 0.15));
  }

  function makeBirdRow(tone) {
    var base = assetBase(), size = birdSize();
    var row = document.createElement('div');
    row.style.cssText = 'position:absolute;left:0;top:50%;width:100%;transform:translateY(-50%);' +
      'display:flex;align-items:center;justify-content:space-evenly;padding:0 4vw;box-sizing:border-box;';
    BIRDS.forEach(function (name, i) {
      var img = document.createElement('img');
      img.src = base + 'birds/' + name + '-' + tone + '.svg';
      img.alt = '';
      img.style.cssText = 'width:' + size + 'px;object-fit:contain;will-change:transform;' +
        'transform:translateY(0);' + (i === 1 ? 'align-self:flex-start;' : '');
      row.appendChild(img);
    });
    return row;
  }

  // per-bird drift so the flock falls like three separate birds, not one block
  var MOTION = [
    { dy: 0.00, ax: 0.026, px: 1750, ph: 0.0, ar: 5.0, pr: 2300, dr: 0.4 },
    { dy: -0.07, ax: 0.018, px: 2200, ph: 1.9, ar: 3.5, pr: 1900, dr: 2.1 },
    { dy: 0.05, ax: 0.032, px: 1500, ph: 3.4, ar: 6.0, pr: 2600, dr: 4.7 }
  ];
  function paintBirds(row, y, t, vh, ramp) {
    var k = ramp == null ? 1 : Math.max(0, Math.min(1, ramp));
    Array.prototype.forEach.call(row.children, function (img, i) {
      var m = MOTION[i % MOTION.length];
      var x = Math.sin(t / m.px * 6.283 + m.ph) * m.ax * vh * k;
      var r = Math.sin(t / m.pr * 6.283 + m.dr) * m.ar * k;
      var bob = Math.sin(t / m.px * 6.283 + m.ph + 1.1) * 0.006 * vh * k;
      img.style.transform = 'translate3d(' + x + 'px,' + (y + m.dy * vh * k + bob) + 'px,0) rotate(' + r + 'deg)';
    });
  }

  function overlay(bg) {
    var el = document.createElement('div');
    el.setAttribute('data-page-transition', '');
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:auto;overflow:hidden;' +
      'display:flex;align-items:center;justify-content:center;';
    var curtain = document.createElement('div');
    curtain.style.cssText = 'position:absolute;left:0;width:100%;top:50%;height:2px;transform:translateY(-50%);' +
      'background:' + bg + ';overflow:hidden;will-change:height,transform;';
    el.appendChild(curtain);
    document.body.appendChild(el);
    return { el: el, curtain: curtain };
  }

  /* ---- leaving: line opens, birds fall to the bottom, then navigate ---- */
  function leave(href) {
    var bg = bgFor(href), tone = birdColorOn(bg);
    if (reduced) { location.href = href; return; }

    var o = overlay(bg);
    o.curtain.style.width = '0%';
    o.curtain.style.left = '50%';
    o.curtain.style.transform = 'translate(-50%,-50%)';
    var row = makeBirdRow(tone);
    row.style.opacity = '0';
    o.curtain.appendChild(row);

    var vh = vpH();
    requestAnimationFrame(function () {
      o.curtain.style.transition = 'width 300ms cubic-bezier(.2,0,0,1)';
      o.curtain.style.width = '100%';
    });
    setTimeout(function () {                      // line opens to a full field
      o.curtain.style.transition = 'height 460ms cubic-bezier(.2,0,0,1)';
      o.curtain.style.height = vh + 'px';
      row.style.transition = 'opacity 220ms linear 60ms';
      row.style.opacity = '1';
    }, 300);
    setTimeout(function () {                      // a small lift, then gravity takes them
      var h = row.getBoundingClientRect().height || vh * 0.18;
      var ty = vh * 0.35 - h / 2;                 // hands off with the flock 15% off the bottom
      var g = vh / 380000;                        // px per ms²
      var y = 0, v = -vh / 3200, last = 0, t0 = 0;  // upward toss — no hard start to the fall
      requestAnimationFrame(function step(ts) {
        if (!t0) { t0 = ts; last = ts; }
        var dt = Math.min(48, ts - last); last = ts;
        var el = ts - t0;
        v += g * dt; y += v * dt;
        paintBirds(row, Math.min(ty, y), el, vh, el / 700);   // drift eases in
        if (y < ty) { requestAnimationFrame(step); return; }
        try {
          sessionStorage.setItem(KEY, JSON.stringify({
            t: Date.now(), bg: bg, tone: tone,
            tyFrac: ty / vh, hFrac: h / vh, vFrac: v / vh, gFrac: g / vh, phase: el
          }));
        } catch (e) {}
        location.href = href;
      });
    }, 620);
  }

  /* ---- arriving: the window really scrolls down off the field, birds keep falling ---- */
  function arrive(state) {
    var vh = vpH();
    var bg = state.bg || ownBg();

    // a real block of destination colour sitting above the page, so the reveal
    // is an actual document scroll rather than a fake slide
    var field = document.createElement('div');
    field.setAttribute('data-transition-field', '');
    field.style.cssText = 'position:relative;width:100%;height:' + vh + 'px;background:' + bg + ';' +
      'margin:0;padding:0;overflow:hidden;';
    document.body.insertBefore(field, document.body.firstChild);

    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);

    // birds ride in a fixed layer so they keep falling through the viewport
    var layer = document.createElement('div');
    layer.setAttribute('data-page-transition', '');
    layer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;';
    var row = makeBirdRow(state.tone || birdColorOn(bg));
    layer.appendChild(row);
    document.body.appendChild(layer);
    var v = (state.vFrac || 1 / 900) * vh;                // speed the birds arrived with
    var g = (state.gFrac || 1 / 380000) * vh;             // and they keep accelerating
    var h = (state.hFrac || 0.18) * vh;
    var ty = state.tyFrac != null ? state.tyFrac * vh : vh * 0.35 - h / 2;
    var phase = state.phase || 0;                         // keeps the sway continuous
    paintBirds(row, ty, phase, vh);

    var start = 0, last = 0, scrolled = 0, blocked = true;
    var stopWheel = function (e) { if (blocked) e.preventDefault(); };
    window.addEventListener('wheel', stopWheel, { passive: false });
    window.addEventListener('touchmove', stopWheel, { passive: false });

    // the destination content may still be streaming in — nothing can scroll until
    // the document is taller than the field, so park the birds and wait for it
    var waitStart = performance.now();
    (function waitForPage(ts) {
      var ready = document.documentElement.scrollHeight > vh * 1.9;
      if (!ready && (ts || 0) - waitStart < 2500) { requestAnimationFrame(waitForPage); return; }
      var canScroll = ready;
      window.scrollTo(0, 0);
      requestAnimationFrame(function () {
        // birds hold still in the viewport — the page scrolls up behind them,
        // accelerating exactly as the fall does
        requestAnimationFrame(function step(ts) {
          if (!start) { start = ts; last = ts; }
          var dt = Math.min(48, ts - last); last = ts;
          v += g * dt; scrolled = Math.min(vh, scrolled + v * dt);
          if (canScroll) window.scrollTo(0, scrolled);
          else field.style.marginTop = (-scrolled) + 'px';  // page too short to scroll
          paintBirds(row, ty, phase + (ts - start), vh);    // sway carries on while they hang
          if (scrolled < vh) requestAnimationFrame(step);
          else finish(ts - start);
        });
      });
    })();

    function finish(elapsed) {
      var rest = vh * 0.15 + h + 40;                      // clear of the bottom edge
      var restStart = 0, lastT = 0, d = 0, base = phase + (elapsed || 0);
      requestAnimationFrame(function fallOn(ts) {         // still accelerating, sway unbroken
        if (!restStart) { restStart = ts; lastT = ts; }
        var dt = Math.min(48, ts - lastT); lastT = ts;
        v += g * dt; d += v * dt;
        paintBirds(row, ty + d, base + (ts - restStart), vh);
        if (d < rest) requestAnimationFrame(fallOn);
        else layer.remove();
      });
      field.remove();                       // page top is now the viewport top
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = prevBehavior;
      blocked = false;
      window.removeEventListener('wheel', stopWheel);
      window.removeEventListener('touchmove', stopWheel);
    }
  }

  function init() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
    if (raw && !reduced) {
      var s = null;
      try { s = JSON.parse(raw); } catch (e) {}
      if (s && Date.now() - s.t < 6000) arrive(s);
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href[0] === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      leave(a.href);
    }, true);
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
