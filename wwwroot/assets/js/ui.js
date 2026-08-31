// Small shared UI helpers.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer;
export function toast(message, { error = false, duration = 2600 } = {}) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('toast--error', error);
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), duration);
}

const locks = new Set();
export function lockScroll(key) { locks.add(key); document.body.classList.add('is-locked'); }
export function unlockScroll(key) { locks.delete(key); if (!locks.size) document.body.classList.remove('is-locked'); }

// Minimal focus management for dialogs: remember opener, focus first focusable, trap Tab.
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
export function openDialog(root, panel, { onClose } = {}) {
  const opener = document.activeElement;
  root.classList.add('is-open');
  root.setAttribute('aria-hidden', 'false');
  const focusables = () => $$(FOCUSABLE, panel).filter((el) => el.offsetParent !== null);
  requestAnimationFrame(() => { const f = focusables(); (panel.querySelector('[autofocus]') || f[0] || panel).focus({ preventScroll: true }); });
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  function close() {
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    if (onClose) onClose();
  }
  return close;
}

export function money(minor, currency = 'CAD', minorUnit = 2) {
  const n = Number(minor) / 10 ** minorUnit;
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(n);
}

export function decode(html) {
  const t = document.createElement('textarea'); t.innerHTML = html; return t.value;
}

export function debounce(fn, ms = 200) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export const onIdle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
