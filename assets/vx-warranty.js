/* Warranty registration form (sections/vx-warranty-register.liquid).
   Five steps with tabs, Next and Back, per-step validation and a check-and-send summary.
   The form itself is Shopify's contact form, so it posts normally once every step is valid. */
(() => {
  const STORE_KEY = 'vx-warranty-sent';

  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    clear() { try { sessionStorage.removeItem(STORE_KEY); } catch (e) { /* storage unavailable */ } }
  };

  /* Thanks state after a successful post: fill in the first name and email if we have them. */
  const fillThanks = () => {
    const title = document.querySelector('[data-vx-thanks-title]');
    if (!title) return;
    const sent = store.get();
    if (!sent) return;
    const text = document.querySelector('[data-vx-thanks-text]');
    if (sent.name && title.dataset.template) title.textContent = title.dataset.template.replace('{name}', sent.name);
    if (sent.email && text && text.dataset.template) text.textContent = text.dataset.template.replace('{email}', sent.email);
    store.clear();
  };

  const init = (form) => {
    const steps = Array.from(form.querySelectorAll('[data-vx-step]'));
    if (!steps.length) return;
    const tabs = Array.from(form.querySelectorAll('[data-vx-tab]'));
    const back = form.querySelector('[data-vx-back]');
    const next = form.querySelector('[data-vx-next]');
    const nextLabel = form.querySelector('[data-vx-next-label]');
    const send = form.querySelector('[data-vx-send]');
    const time = form.querySelector('[data-vx-time]');
    const rows = form.querySelector('[data-vx-rows]');
    const rowTemplate = form.querySelector('[data-vx-row-template]');
    const addRow = form.querySelector('[data-vx-row-add]');
    const ack = form.querySelector('#w-ack');
    const card = form.closest('.vx-wform') || form;
    const labels = tabs.map((t) => t.dataset.label || '');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let sending = false;

    form.noValidate = true;

    /* Validation */
    const errorFor = (el) => document.getElementById(el.id + '-error');

    const showError = (el, msg) => {
      const box = errorFor(el);
      el.setAttribute('aria-invalid', 'true');
      if (box) { box.textContent = msg; box.hidden = false; }
    };

    const clearError = (el) => {
      const box = errorFor(el);
      el.removeAttribute('aria-invalid');
      if (box) { box.textContent = ''; box.hidden = true; }
    };

    const messageFor = (el) => {
      if (el.type === 'checkbox') return el.checked ? '' : el.dataset.error;
      const value = el.value.trim();
      if (el.required && !value) return el.dataset.error;
      if (!value) return '';
      if (el.type === 'email' && el.validity.typeMismatch) return el.dataset.errorFormat || el.dataset.error;
      if (el.type === 'number' && (el.validity.rangeUnderflow || el.validity.badInput || el.validity.stepMismatch)) return el.dataset.error;
      return '';
    };

    const fieldsIn = (panel) => Array.from(panel.querySelectorAll('[data-error]'));

    const validateStep = (i) => {
      let first = null;
      fieldsIn(steps[i]).forEach((el) => {
        const msg = messageFor(el);
        if (msg) { showError(el, msg); if (!first) first = el; } else { clearError(el); }
      });
      return first;
    };

    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.matches && el.matches('[data-error]') && el.getAttribute('aria-invalid') === 'true' && !messageFor(el)) clearError(el);
    });
    form.addEventListener('change', (e) => {
      const el = e.target;
      if (el.matches && el.matches('[data-error]') && el.getAttribute('aria-invalid') === 'true' && !messageFor(el)) clearError(el);
      if (el === ack) updateSend();
    });

    /* Summary on the last step */
    const summary = form.querySelector('[data-vx-summary]');
    const val = (id) => { const el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };

    const setSum = (key, text, missing) => {
      const el = summary && summary.querySelector('[data-vx-sum="' + key + '"]');
      if (!el) return;
      el.textContent = text;
      el.classList.toggle('is-missing', !!missing);
    };

    const buildSummary = () => {
      if (!summary) return;
      const missing = summary.dataset.missing || 'Not added';
      [['name', 'w-name'], ['email', 'w-email'], ['postcode', 'w-postcode'], ['order', 'w-order']].forEach(([key, id]) => {
        const v = val(id);
        setSum(key, v || missing, !v);
      });
      const lines = Array.from(rows ? rows.querySelectorAll('[data-vx-row]') : []).map((row) => {
        const get = (k) => { const el = row.querySelector('[data-vx-key="' + k + '"]'); return el ? el.value.trim() : ''; };
        const range = get('range');
        if (!range) return '';
        return range + (get('colour') ? ', ' + get('colour') : '') + (get('qty') ? ' × ' + get('qty') : '');
      }).filter(Boolean);
      setSum('products', lines.length ? lines.join('; ') : (summary.dataset.none || 'None added'), !lines.length);
      const photos = form.querySelector('#w-photos');
      if (photos) setSum('photos', photos.checked ? photos.value : (summary.dataset.notConfirmed || missing), !photos.checked);
    };

    /* Send button looks disabled until the confirmation is ticked (design: aria-disabled) */
    const updateSend = () => {
      if (!send || !ack) return;
      send.setAttribute('aria-disabled', ack.checked ? 'false' : 'true');
    };

    /* Step display */
    const show = (i, focus) => {
      current = i;
      steps.forEach((panel, n) => { panel.hidden = n !== i; });
      tabs.forEach((tab, n) => {
        tab.setAttribute('aria-current', n === i ? 'step' : 'false');
        tab.classList.toggle('is-done', n < i);
        const mark = tab.querySelector('.vx-wtab__mark');
        if (mark) mark.textContent = n < i ? '✓' : String(n + 1);
        tab.setAttribute('aria-label', labels[n] + (n < i ? ' (done)' : ''));
      });
      const last = i === steps.length - 1;
      if (back) back.hidden = i === 0;
      if (time) time.hidden = i !== 0;
      if (next) next.hidden = last;
      if (send) send.hidden = !last;
      if (!last && nextLabel && labels[i + 1]) nextLabel.textContent = (next.dataset.prefix || 'Next: ') + labels[i + 1].toLowerCase();
      if (last) { buildSummary(); updateSend(); }
      if (focus) {
        const title = steps[i].querySelector('[data-vx-step-title]');
        if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (title) title.focus({ preventScroll: true });
      }
    };

    /* Move to step `to`, checking every step before it first */
    const go = (to) => {
      if (to > current) {
        for (let n = current; n < to; n += 1) {
          const bad = validateStep(n);
          if (bad) {
            if (n !== current) show(n, false);
            bad.focus();
            return;
          }
        }
      }
      show(to, true);
    };

    /* Enter in a field moves to the next step rather than sending early */
    form.addEventListener('keydown', (e) => {
      const el = e.target;
      if (e.key !== 'Enter' || current === steps.length - 1) return;
      if (el.tagName !== 'INPUT' || el.type === 'checkbox') return;
      e.preventDefault();
      go(current + 1);
    });

    tabs.forEach((tab, n) => tab.addEventListener('click', () => go(n)));
    if (next) next.addEventListener('click', () => go(Math.min(steps.length - 1, current + 1)));
    if (back) back.addEventListener('click', () => show(Math.max(0, current - 1), true));

    /* Product rows */
    const renumber = () => {
      const all = Array.from(rows.querySelectorAll('[data-vx-row]'));
      all.forEach((row, idx) => {
        const n = idx + 1;
        const title = row.querySelector('[data-vx-row-title]');
        if (title) title.textContent = title.textContent.replace(/\d+\s*$/, String(n));
        row.querySelectorAll('[id], [for], [name], [aria-describedby], [aria-label]').forEach((el) => {
          ['id', 'for', 'aria-describedby'].forEach((attr) => {
            const v = el.getAttribute(attr);
            if (v) el.setAttribute(attr, v.replace(/w-p\d+-/g, 'w-p' + n + '-'));
          });
          const name = el.getAttribute('name');
          if (name) el.setAttribute('name', name.replace(/\[Product \d+ /, '[Product ' + n + ' '));
          const label = el.getAttribute('aria-label');
          if (label) el.setAttribute('aria-label', label.replace(/\d+\s*$/, String(n)));
        });
        const remove = row.querySelector('[data-vx-row-remove]');
        if (remove) remove.hidden = all.length < 2;
      });
    };

    if (rows && rowTemplate && addRow) {
      addRow.addEventListener('click', () => {
        const n = rows.querySelectorAll('[data-vx-row]').length + 1;
        const wrap = document.createElement('div');
        wrap.innerHTML = rowTemplate.innerHTML.replace(/__N__/g, String(n)).trim();
        const row = wrap.firstElementChild;
        if (!row) return;
        rows.appendChild(row);
        renumber();
        const first = row.querySelector('select, input');
        if (first) first.focus();
      });
      rows.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-vx-row-remove]');
        if (!btn) return;
        const row = btn.closest('[data-vx-row]');
        const prev = row.previousElementSibling || row.nextElementSibling;
        row.remove();
        renumber();
        const target = prev && prev.querySelector('select, input');
        if (target) target.focus(); else addRow.focus();
      });
      renumber();
    }

    /* Submit: every step must pass, then remember name and email for the thanks message */
    form.addEventListener('submit', (e) => {
      if (sending) { e.preventDefault(); return; }
      for (let n = 0; n < steps.length; n += 1) {
        const bad = validateStep(n);
        if (bad) {
          e.preventDefault();
          if (n !== current) show(n, false);
          bad.focus();
          return;
        }
      }
      sending = true;
      if (send) send.setAttribute('aria-disabled', 'true');
      store.set({ name: val('w-name').split(/\s+/)[0] || '', email: val('w-email') });
    });

    show(0, false);
  };

  const start = () => {
    fillThanks();
    const form = document.getElementById('vx-warranty-form');
    if (form) init(form);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
