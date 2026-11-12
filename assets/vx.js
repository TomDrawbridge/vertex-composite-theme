/* Vertex Composite interactions, ported from the Direction B design logic.
   Vanilla JS, no dependencies. Each feature binds to data-vx-* hooks. */
(function () {
  'use strict';
  if (window.__vx) return;
  window.__vx = true;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: blur once scrolled past 24px; mobile drawer */
  function initHeader() {
    var header = document.querySelector('[data-vx-header]');
    if (!header) return;
    // Horizon makes .page-wrapper the scroll container on desktop; the window scrolls on mobile.
    var pw = document.querySelector('.page-wrapper');
    var onScroll = function () {
      var y = Math.max(window.scrollY || 0, pw ? pw.scrollTop : 0);
      header.classList.toggle('is-scrolled', y > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (pw) pw.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    var drawer = document.querySelector('[data-vx-drawer]');
    document.querySelectorAll('[data-vx-burger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.documentElement.style.overflow = open ? 'hidden' : '';
      });
    });
  }

  /* Hero slider: filmstrip track, crossfading copy, tabs with progress */
  function initHero(root) {
    var track = root.querySelector('[data-vx-track]');
    var cells = root.querySelectorAll('[data-vx-cell]');
    var copies = root.querySelectorAll('[data-vx-copy]');
    var tabs = root.querySelectorAll('[data-vx-tab]');
    var n = cells.length;
    if (n < 2) return;
    var secs = parseInt(root.getAttribute('data-seconds'), 10) || 7;
    var auto = root.getAttribute('data-autoplay') === 'true' && !reduced;
    var cur = 0, timer = null;

    function go(i) {
      cur = (i + n) % n;
      track.style.transform = 'translate3d(-' + (cur * 100 / n).toFixed(4) + '%,0,0)';
      cells.forEach(function (c, j) {
        c.classList.toggle('is-active', j === cur);
        c.classList.toggle('is-before', j < cur);
      });
      copies.forEach(function (c, j) {
        c.classList.toggle('is-active', j === cur);
        c.setAttribute('aria-hidden', j === cur ? 'false' : 'true');
      });
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', 'false'); });
      // restart the progress fill
      void root.offsetWidth;
      if (tabs[cur]) tabs[cur].setAttribute('aria-selected', 'true');
      restart();
    }
    function restart() {
      if (!auto) return;
      clearTimeout(timer);
      timer = setTimeout(function () { go(cur + 1); }, secs * 1000);
    }
    tabs.forEach(function (t, j) { t.addEventListener('click', function () { go(j); }); });
    if (tabs[0]) tabs[0].setAttribute('aria-selected', 'false');
    requestAnimationFrame(function () { go(0); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimeout(timer); else restart();
    });
  }

  /* Colour picker: swaps the photo, board cut-out, name and button */
  function initColour(root) {
    var btns = root.querySelectorAll('[data-vx-colour-btn]');
    var photos = root.querySelectorAll('.vx-colour__photo');
    var boards = root.querySelectorAll('.vx-colour__board');
    var name = root.querySelector('[data-vx-colour-name]');
    var cta = root.querySelector('[data-vx-colour-cta]');
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        photos.forEach(function (p, j) { p.style.opacity = j === i ? '1' : '0'; });
        boards.forEach(function (p, j) { p.style.display = j === i ? 'block' : 'none'; });
        if (name) name.textContent = b.getAttribute('data-name');
        if (cta) {
          if (b.getAttribute('data-cta')) cta.textContent = b.getAttribute('data-cta');
          if (b.getAttribute('data-link')) cta.setAttribute('href', b.getAttribute('data-link'));
        }
      });
    });
  }

  /* Deck planner: same maths as the design */
  function initPlanner(root) {
    var deck = root.querySelector('[data-vx-deck]');
    var inputs = {};
    root.querySelectorAll('[data-vx-in]').forEach(function (el) { inputs[el.getAttribute('data-vx-in')] = el; });
    var trimLen = parseFloat(root.getAttribute('data-trim')) || 4;
    var state = { c1: '#6B4A36', c2: '#4f3626', name: 'Chestnut', dir: 'length' };

    function out(key, val) {
      root.querySelectorAll('[data-vx-out="' + key + '"]').forEach(function (el) { el.textContent = val; });
    }
    function render() {
      var L = parseFloat(inputs.len.value), W = parseFloat(inputs.wid.value), H = parseInt(inputs.ht.value, 10);
      var sc = Math.min(500 / L, 250 / W);
      var wp = L * sc / 640 * 100, hp = W * sc / 360 * 100;
      deck.style.left = (50 - wp / 2).toFixed(2) + '%';
      deck.style.top = (50 - hp / 2 + 3).toFixed(2) + '%';
      deck.style.width = wp.toFixed(2) + '%';
      deck.style.height = hp.toFixed(2) + '%';
      deck.style.borderColor = state.c2;
      deck.style.background = 'repeating-linear-gradient(' + (state.dir === 'length' ? '180deg' : '90deg') + ', ' +
        state.c1 + ' 0, ' + state.c1 + ' 13px, ' + state.c2 + ' 13px, ' + state.c2 + ' 15px)';
      var ped = H - 25 - 50, edge = 2 * (L + W);
      out('len', L.toFixed(1) + ' m');
      out('wid', W.toFixed(1) + ' m');
      out('ht', H + ' mm');
      out('col', state.name);
      out('area', (L * W).toFixed(1) + ' m²');
      out('edge', edge.toFixed(1) + ' m');
      out('trims', Math.ceil(edge / trimLen) + ' × ' + trimLen + ' m');
      out('ped', ped >= 20 ? ped + ' mm' : 'Too low');
      out('peds', Math.ceil(L * W * 6) + ' to ' + Math.ceil(L * W * 7));
    }
    Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', render); });
    root.querySelectorAll('[data-vx-chip]').forEach(function (chip, i, all) {
      chip.addEventListener('click', function () {
        all.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        state.c1 = chip.getAttribute('data-c1'); state.c2 = chip.getAttribute('data-c2'); state.name = chip.getAttribute('data-name');
        render();
      });
    });
    root.querySelectorAll('[data-vx-dir]').forEach(function (btn, i, all) {
      btn.addEventListener('click', function () {
        all.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        state.dir = btn.getAttribute('data-vx-dir');
        render();
      });
    });
    render();
  }

  function init() {
    initHeader();
    document.querySelectorAll('[data-vx-hero]').forEach(initHero);
    document.querySelectorAll('[data-vx-colour]').forEach(initColour);
    document.querySelectorAll('[data-vx-plan]').forEach(initPlanner);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // theme editor: re-init sections when they reload
  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target;
    el.querySelectorAll('[data-vx-hero]').forEach(initHero);
    el.querySelectorAll('[data-vx-colour]').forEach(initColour);
    el.querySelectorAll('[data-vx-plan]').forEach(initPlanner);
    if (el.querySelector('[data-vx-header]')) initHeader();
  });
})();
