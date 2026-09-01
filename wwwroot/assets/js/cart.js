// Cart: kept in the browser (localStorage) until a checkout back-end is connected.
// Lines carry a snapshot of name / price / options so the drawer renders instantly;
// prices are re-validated against /api/product/ when the cart is opened.
import { $, $$, toast, openDialog, lockScroll, unlockScroll, money, decode } from './ui.js?v=6';

const KEY = 'te-cart-v1';
let cart = load();
let closeDrawer = null;
const listeners = new Set();

function load() {
  try { const raw = localStorage.getItem(KEY); const c = raw ? JSON.parse(raw) : null; if (c && Array.isArray(c.lines)) return c; } catch { /* fresh cart */ }
  return { lines: [], currency: document.documentElement.dataset.currency || 'CAD', updated: 0 };
}
function save() {
  cart.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* private mode */ }
  render();
  listeners.forEach((fn) => fn(cart));
}
export function onCart(fn) { listeners.add(fn); fn(cart); }
export function getCart() { return cart; }

const count = () => cart.lines.reduce((n, l) => n + l.qty, 0);
const lineTotal = (l) => (l.price + (l.options || []).reduce((s, o) => s + (o.price || 0), 0)) * l.qty;
const subtotal = () => cart.lines.reduce((s, l) => s + lineTotal(l), 0);
const keyFor = (line) => [line.id, line.variationId || '', ...(line.options || []).map((o) => o.field + '=' + o.value)].join('|');

// line: { id, name, permalink, image, price (minor units), currency, minorUnit, max, soldIndividually,
//         options: [{ field, value, label, price }], variation: [{ name, value }], variationId }
export function addLine(line, qty = 1) {
  const key = keyFor(line);
  const existing = cart.lines.find((l) => l.key === key);
  const max = line.max || 99;
  if (existing) existing.qty = line.soldIndividually ? 1 : Math.min(max, existing.qty + qty);
  else cart.lines.push({ ...line, key, qty: line.soldIndividually ? 1 : Math.min(max, qty) });
  save();
  return cart;
}
export function updateQty(key, qty) {
  const l = cart.lines.find((x) => x.key === key); if (!l) return;
  l.qty = Math.max(1, Math.min(l.max || 99, Number(qty) || 1)); save();
}
export function removeLine(key) { cart.lines = cart.lines.filter((l) => l.key !== key); save(); }
export function clear() { cart.lines = []; save(); }

// Quick add from a product id (cards, suggestions). Product data comes from the edge catalog API.
export async function addById(id, qty = 1) {
  const p = await fetch(`/api/product/?id=${encodeURIComponent(id)}&cur=${pageCurrency()}`).then((r) => (r.ok ? r.json() : null));
  if (!p || !p.id) throw new Error('That product could not be found.');
  if (!p.inStock) throw new Error('That product is currently sold out.');
  if (p.hasOptions) { location.href = p.permalink; return null; }
  return addLine({ id: p.id, name: p.name, permalink: p.permalink, image: p.image, price: p.price, currency: p.currency, minorUnit: p.minorUnit, max: p.max, soldIndividually: p.soldIndividually, options: [] }, qty);
}

// Re-check prices/stock for lines already in the cart (catalog may have changed since they were added).
async function revalidate() {
  if (!cart.lines.length) return;
  let changed = false;
  await Promise.all(cart.lines.map(async (l) => {
    try {
      const p = await fetch(`/api/product/?id=${l.id}&cur=${pageCurrency()}`).then((r) => (r.ok ? r.json() : null));
      if (!p || !p.id) return;
      const v = l.variationId && p.variations ? p.variations.find((x) => x.id === l.variationId) : null;
      const price = v ? v.price : p.price;
      if (!l.variationId || v) { if (price !== l.price) { l.price = price; changed = true; } }
      if (l.currency !== p.currency) { l.currency = p.currency; changed = true; }
      for (const o of l.options || []) {
        const np = p.addonPrices ? p.addonPrices[o.field] : undefined;
        if (np != null && np !== o.price) { o.price = np; changed = true; }
      }
      if (p.image && p.image !== l.image) { l.image = p.image; changed = true; }
      l.inStock = v ? v.inStock : p.inStock;
    } catch { /* offline: keep snapshot */ }
  }));
  if (changed) save(); else render();
}

export function open() {
  const root = $('[data-cart-drawer]');
  if (!root || closeDrawer) return;
  lockScroll('cart');
  closeDrawer = openDialog(root, $('.drawer__panel', root), { onClose: () => { unlockScroll('cart'); closeDrawer = null; } });
  render();
  revalidate();
}
export function close() { if (closeDrawer) closeDrawer(); }

// ---- Rendering -----------------------------------------------------------------

function renderCount() {
  const n = count();
  $$('[data-cart-count]').forEach((el) => {
    const prev = Number(el.textContent || 0);
    el.textContent = n; el.hidden = n === 0;
    if (n !== prev) { el.classList.remove('is-bumping'); void el.offsetWidth; el.classList.add('is-bumping'); }
  });
  $$('[data-cart-count-label]').forEach((el) => { el.textContent = n ? `(${n})` : ''; });
}

const pageCurrency = () => document.documentElement.dataset.currency || cart.currency || 'CAD';

function lineHtml(l) {
  const cur = pageCurrency(), mu = l.minorUnit ?? 2;
  const meta = (l.options || []).map((o) => o.label).concat((l.variation || []).map((v) => `${v.name}: ${v.value}`));
  return `<li class="cart-line" data-key="${escapeAttr(l.key)}">
    <a class="cart-line__media" href="${escapeAttr(l.permalink || '#')}">${l.image ? `<img src="${escapeAttr(l.image)}" alt="" width="88" height="88" loading="lazy">` : ''}</a>
    <div>
      <p class="cart-line__name">${escapeHtml(l.name)}</p>
      ${meta.length ? `<p class="cart-line__meta">${escapeHtml(meta.join(' · '))}</p>` : ''}
      ${l.inStock === false ? `<p class="cart-line__meta" style="color:var(--danger)">Currently sold out</p>` : ''}
      <div class="cart-line__row">
        <div class="qty" aria-label="Quantity">
          <button type="button" data-qty="-1" aria-label="Decrease quantity"><svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
          <input type="number" min="1" max="${l.max || 99}" value="${l.qty}" aria-label="Quantity" ${l.soldIndividually ? 'readonly' : ''}>
          <button type="button" data-qty="1" aria-label="Increase quantity"><svg class="icon" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
        </div>
        <span class="cart-line__price">${money(lineTotal(l), cur, mu)} <span class="price__currency">${cur}</span></span>
      </div>
      <button type="button" class="cart-line__remove" data-remove>Remove</button>
    </div>
  </li>`;
}

function render() {
  renderCount();
  const has = cart.lines.length > 0;
  const cur = pageCurrency();
  const mu = cart.lines[0] ? cart.lines[0].minorUnit ?? 2 : 2;
  const root = $('[data-cart-drawer]');
  if (root) {
    const lines = $('[data-cart-lines]', root), empty = $('[data-cart-empty]', root), foot = $('[data-cart-foot]', root), sub = $('[data-cart-subtotal]', root);
    empty.hidden = has; lines.hidden = !has; foot.hidden = !has;
    if (has) { lines.innerHTML = cart.lines.map(lineHtml).join(''); sub.innerHTML = `${money(subtotal(), cur, mu)} <span class="price__currency">${cur}</span>`; }
    renderSuggestion(root);
  }
  const pageLines = $('[data-cart-page-lines]');
  if (pageLines) {
    pageLines.innerHTML = has ? cart.lines.map(lineHtml).join('') : '';
    $('[data-cart-page-empty]').hidden = has;
    $('[data-cart-page-summary]').hidden = !has;
    if (has) $('[data-cart-page-subtotal]').innerHTML = `${money(subtotal(), cur, mu)} <span class="price__currency">${cur}</span>`;
  }
  const checkout = $('[data-checkout-summary]');
  if (checkout) {
    checkout.innerHTML = has
      ? `<ul class="cart-lines">${cart.lines.map((l) => `<li class="cart-line" data-key="${escapeAttr(l.key)}"><a class="cart-line__media" href="${escapeAttr(l.permalink)}">${l.image ? `<img src="${escapeAttr(l.image)}" alt="" width="88" height="88">` : ''}</a><div><p class="cart-line__name">${escapeHtml(l.name)}</p><p class="cart-line__meta">Qty ${l.qty}${(l.options || []).length ? ' · ' + escapeHtml(l.options.map((o) => o.label).join(' · ')) : ''}</p><p class="cart-line__price" style="margin-top:.5rem">${money(lineTotal(l), cur, mu)} <span class="price__currency">${cur}</span></p></div></li>`).join('')}</ul>
         <div class="cart-totals__row" style="margin-top:1.25rem"><span>Subtotal</span><strong>${money(subtotal(), cur, mu)} <span class="price__currency">${cur}</span></strong></div>`
      : '<p class="muted">Your cart is empty.</p>';
  }
}

let suggestCache = new Map();
async function renderSuggestion(root) {
  const box = $('[data-cart-suggest]', root);
  if (!box) return;
  if (!cart.lines.length) { box.hidden = true; return; }
  const ids = cart.lines.map((l) => l.id).join(',');
  try {
    if (!suggestCache.has(ids)) suggestCache.set(ids, await fetch(`/api/suggest/?ids=${ids}`).then((r) => r.json()));
    const s = suggestCache.get(ids);
    if (!s || !s.product) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<p class="cart-suggest__title">${escapeHtml(s.title)}</p>
      <div class="cart-suggest__item">
        <img src="${escapeAttr(s.product.image)}" alt="" width="64" height="64" loading="lazy">
        <div><p class="cart-suggest__name">${escapeHtml(s.product.name)}</p><p class="cart-suggest__price">${escapeHtml(s.product.price)}</p></div>
        <button class="btn btn--secondary btn--sm" type="button" data-add-to-cart="${s.product.id}" data-product-name="${escapeAttr(s.product.name)}"><span class="btn__label">Add</span></button>
      </div>`;
  } catch { box.hidden = true; }
}

// ---- Wiring ----------------------------------------------------------------------

export function initCart() {
  $$('[data-cart-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  document.addEventListener('click', (e) => { if (e.target.closest('[data-cart-close]')) { e.preventDefault(); close(); } });

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    e.preventDefault();
    btn.classList.add('is-busy');
    try {
      const res = await addById(btn.dataset.addToCart, 1);
      if (res) { toast(`${btn.dataset.productName || 'Item'} added to your cart`); open(); }
    } catch (err) { toast(err.message, { error: true }); }
    finally { btn.classList.remove('is-busy'); }
  });

  document.addEventListener('click', (e) => {
    const lineEl = e.target.closest('.cart-line'); if (!lineEl) return;
    const key = lineEl.dataset.key;
    if (e.target.closest('[data-remove]')) { removeLine(key); return; }
    const q = e.target.closest('[data-qty]');
    if (q) { const input = $('input', lineEl); updateQty(key, Number(input.value) + Number(q.dataset.qty)); }
  });
  document.addEventListener('change', (e) => {
    const lineEl = e.target.closest('.cart-line'); if (!lineEl || e.target.type !== 'number') return;
    updateQty(lineEl.dataset.key, e.target.value);
  });
  window.addEventListener('storage', (e) => { if (e.key === KEY) { cart = load(); render(); } });

  render();
  // Prices in stored lines follow the selected currency; re-price on every page load.
  revalidate();
  if (location.search.includes('cart=open')) open();
}

function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escapeAttr(s) { return escapeHtml(s); }
