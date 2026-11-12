/* Vertex installation guide: pedestal height calculator (Install-B design).
   Pedestal height = total height - board - joist. The drawing scales so the tallest of
   (total, board + joist) is 300px. Pedestal count = area x per-m² figures, rounded up. */
(function () {
  var STEPPERS = { board: { step: 1, min: 15, max: 40 }, joist: { step: 5, min: 20, max: 100 } };

  function init(root) {
    if (root.__vxReady) return;
    root.__vxReady = true;
    var total = root.querySelector('[data-vx-in="total"]');
    var area = root.querySelector('[data-vx-in="area"]');
    var outs = function (key) { return root.querySelectorAll('[data-vx-out="' + key + '"]'); };
    var state = {
      board: parseInt((outs('board')[0] || {}).textContent, 10) || 25,
      joist: parseInt((outs('joist')[0] || {}).textContent, 10) || 50
    };
    var minPed = parseFloat(root.getAttribute('data-min-ped')) || 20;
    var perMin = parseFloat(root.getAttribute('data-per-min')) || 6;
    var perMax = parseFloat(root.getAttribute('data-per-max')) || 7;
    var fmt = root.getAttribute('data-count-format') || 'About {min} to {max}';

    function set(key, text) {
      outs(key).forEach(function (el) { el.textContent = text; });
    }

    function render() {
      var t = parseInt(total.value, 10);
      var a = parseInt(area.value, 10);
      var b = state.board;
      var j = state.joist;
      var ped = t - b - j;
      var pedPos = Math.max(0, ped);
      var scale = 300 / Math.max(t, b + j, 1);
      var heights = { board: b, joist: j, ped: pedPos };
      root.querySelectorAll('[data-vx-bar]').forEach(function (el) {
        el.style.height = Math.max(0, Math.round(heights[el.getAttribute('data-vx-bar')] * scale)) + 'px';
      });
      set('total', t + ' mm');
      set('area', a + ' m²');
      set('board', b + ' mm');
      set('joist', j + ' mm');
      set('ped-small', pedPos + ' mm');
      var note = root.getAttribute('data-note-ok');
      if (ped < 0) note = root.getAttribute('data-note-none');
      else if (ped < minPed) note = root.getAttribute('data-note-low');
      set('ped', ped < 0 ? root.getAttribute('data-too-low') : ped + ' mm');
      outs('ped').forEach(function (el) { el.style.color = ped >= minPed ? '#ffffff' : '#e3a77a'; });
      set('note', note);
      set('count', fmt.replace('{min}', Math.ceil(a * perMin)).replace('{max}', Math.ceil(a * perMax)));
    }

    total.addEventListener('input', render);
    area.addEventListener('input', render);
    root.querySelectorAll('[data-vx-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-vx-step');
        var cfg = STEPPERS[key];
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        state[key] = Math.min(cfg.max, Math.max(cfg.min, state[key] + dir * cfg.step));
        render();
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-vx-hcalc]').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', boot);
})();
