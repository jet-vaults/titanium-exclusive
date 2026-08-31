// Cart: WooCommerce Store API through the same-origin proxy. Sessions are cookie-based,
// exactly as on the classic storefront, so checkout picks the cart up unchanged.
import { $, $$, toast, openDialog, lockScroll, unlockScroll, money, decode } from './ui.js';

const API = '/wp-json/wc/store/v1';
let nonce = null;
let cart = null;
let closeDrawer = null;
const listeners = new Set();

export function onCart(fn) { listeners.add(fn); if (cart) fn(cart); }

async function api(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (nonce) headers.Nonce = nonce;
  const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  const n = res.headers.get('Nonce'); if (n) nonce = n;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message ? decode(data.message.replace(/<[^>]+>/g, '')) : `Request failed (${res.status})`), { data });
  return data;
}

export async function refresh() { setCart(await api('/cart')); return cart; }

function setCart(next) {
  cart = next;
  renderCount();
  renderDrawer();
  listeners.forEach((fn) => fn(cart));
}

export async function addItem(id, quantity = 1, variation) {
  if (!nonce) await refresh();
  const data = await api('/cart/add-item', { method: 'POST', body: { id: Number(id), quantity: Number(quantity), variation } });
  setCart(data);
  return data;
}

// Products with Product Add-Ons (lid / induction) go through the classic add-to-cart handler
// so WooCommerce prices the options itself. The response is the WordPress page; we only need the cookie.
export async function addWithForm(productPath, formData) {
  const before = cart ? cart.items_count : 0;
  const res = await fetch(productPath, { method: 'POST', body: formData, credentials: 'same-origin', redirect: 'follow', headers: { Accept: 'text/html' } });
  const html = await res.text();
  await refresh();
  if (cart.items_count <= before) {
    const m = html.match(/class="woocommerce-error"[\s\S]*?<li[^>]*>([\s\S]*?)<\/li>/i);
    throw new Error(m ? decode(m[1].replace(/<[^>]+>/g, '')).trim() : 'That item could not be added. Please try again.');
  }
  return cart;
}

export async function updateItem(key, quantity) {
  setCart(await api('/cart/update-item', { method: 'POST', body: { key, quantity: Number(quantity) } }));
}
export async function removeItem(key) {
  setCart(await api('/cart/remove-item', { method: 'POST', body: { key } }));
}

export function open() {
  const root = $('[data-cart-drawer]');
  if (!root || closeDrawer) return;
  lockScroll('cart');
  closeDrawer = openDialog(root, $('.drawer__panel', root), { onClose: () => { unlockScroll('cart'); closeDrawer = null; } });
  refresh().catch(() => {});
}
export function close() { if (closeDrawer) closeDrawer(); }

// ---- Rendering -----------------------------------------------------------------

function renderCount() {
  const n = cart ? cart.items_count : 0;
  $$('[data-cart-count]').forEach((el) => {
    const prev = Number(el.textContent || 0);
    el.textContent = n; el.hidden = n === 0;
    if (n !== prev) { el.classList.remove('is-bumping'); void el.offsetWidth; el.classList.add('is-bumping'); }
  });
  $$('[data-cart-count-label]').forEach((el) => { el.textContent = n ? `(${n})` : ''; });
}

function line(item) {
  const cur = item.prices.currency_code, mu = item.prices.currency_minor_unit;
  const img = item.images && item.images[0];
  const meta = (item.item_data || []).map((d) => `${decode(d.name).replace(/\s*\(optional\)/i, '').replace(/^Do you want (to add|this in) /i, '').replace(/\?$/, '')}: ${decode(d.value).replace(/<[^>]+>/g, '')}`)
    .concat((item.variation || []).map((v) => `${v.attribute}: ${v.value}`));
  return `<li class="cart-line" data-key="${item.key}">
    <a class="cart-line__media" href="${item.permalink ? new URL(item.permalink, location.origin).pathname : '#'}">${img ? `<img src="${img.thumbnail || img.src}" alt="" width="88" height="88" loading="lazy">` : ''}</a>
    <div>
      <p class="cart-line__name">${decode(item.name)}</p>
      ${meta.length ? `<p class="cart-line__meta">${meta.join(' · ')}</p>` : ''}
      <div class="cart-line__row">
        <div class="qty" aria-label="Quantity">
          <button type="button" data-qty="-1" aria-label="Decrease quantity"><svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
          <input type="number" min="1" max="${item.quantity_limits ? item.quantity_limits.maximum : 99}" value="${item.quantity}" aria-label="Quantity" ${item.sold_individually ? 'readonly' : ''}>
          <button type="button" data-qty="1" aria-label="Increase quantity"><svg class="icon" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
        </div>
        <span class="cart-line__price">${money(item.totals.line_total, cur, mu)}</span>
      </div>
      <button type="button" class="cart-line__remove" data-remove>Remove</button>
    </div>
  </li>`;
}

function renderDrawer() {
  const root = $('[data-cart-drawer]');
  if (!root || !cart) return;
  const lines = $('[data-cart-lines]', root), empty = $('[data-cart-empty]', root), foot = $('[data-cart-foot]', root), sub = $('[data-cart-subtotal]', root);
  const has = cart.items && cart.items.length;
  empty.hidden = !!has; lines.hidden = !has; foot.hidden = !has;
  if (has) {
    lines.innerHTML = cart.items.map(line).join('');
    sub.textContent = money(cart.totals.total_items, cart.totals.currency_code, cart.totals.currency_minor_unit);
  }
  renderSuggestion(root);
  // Also render the full cart page if present.
  const pageLines = $('[data-cart-page-lines]');
  if (pageLines) {
    pageLines.innerHTML = has ? cart.items.map(line).join('') : '';
    $('[data-cart-page-empty]').hidden = !!has;
    $('[data-cart-page-summary]').hidden = !has;
    if (has) {
      $('[data-cart-page-subtotal]').textContent = money(cart.totals.total_items, cart.totals.currency_code, cart.totals.currency_minor_unit);
      const disc = Number(cart.totals.total_discount || 0);
      const d = $('[data-cart-page-discount]'); if (d) { d.hidden = !disc; if (disc) $('strong', d).textContent = '−' + money(disc, cart.totals.currency_code, cart.totals.currency_minor_unit); }
    }
  }
}

let suggestCache = new Map();
async function renderSuggestion(root) {
  const box = $('[data-cart-suggest]', root);
  if (!box) return;
  if (!cart.items || !cart.items.length) { box.hidden = true; return; }
  const ids = cart.items.map((i) => i.id).join(',');
  try {
    if (!suggestCache.has(ids)) suggestCache.set(ids, await fetch(`/api/suggest/?ids=${ids}`).then((r) => r.json()));
    const s = suggestCache.get(ids);
    if (!s || !s.product) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<p class="cart-suggest__title">${s.title}</p>
      <div class="cart-suggest__item">
        <img src="${s.product.image}" alt="" width="64" height="64" loading="lazy">
        <div><p class="cart-suggest__name">${s.product.name}</p><p class="cart-suggest__price">${s.product.price}</p></div>
        <button class="btn btn--secondary btn--sm" type="button" data-add-to-cart="${s.product.id}" data-product-name="${s.product.name}"><span class="btn__label">Add</span></button>
      </div>`;
  } catch { box.hidden = true; }
}

// ---- Wiring ----------------------------------------------------------------------

export function initCart() {
  $$('[data-cart-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-close]')) { e.preventDefault(); close(); }
  });

  // Quick add buttons (simple products without options) anywhere on the page.
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    e.preventDefault();
    btn.classList.add('is-busy');
    try {
      await addItem(btn.dataset.addToCart, 1);
      toast(`${btn.dataset.productName || 'Item'} added to your cart`);
      open();
    } catch (err) { toast(err.message, { error: true }); }
    finally { btn.classList.remove('is-busy'); }
  });

  // Quantity / remove inside any rendered cart list.
  document.addEventListener('click', async (e) => {
    const lineEl = e.target.closest('.cart-line'); if (!lineEl) return;
    const key = lineEl.dataset.key;
    const input = $('input', lineEl);
    if (e.target.closest('[data-remove]')) { lineEl.classList.add('is-updating'); try { await removeItem(key); } catch (err) { toast(err.message, { error: true }); lineEl.classList.remove('is-updating'); } return; }
    const q = e.target.closest('[data-qty]');
    if (q) { const next = Math.max(1, Number(input.value) + Number(q.dataset.qty)); input.value = next; lineEl.classList.add('is-updating'); try { await updateItem(key, next); } catch (err) { toast(err.message, { error: true }); lineEl.classList.remove('is-updating'); } }
  });
  document.addEventListener('change', async (e) => {
    const lineEl = e.target.closest('.cart-line'); if (!lineEl || e.target.type !== 'number') return;
    const next = Math.max(1, Number(e.target.value) || 1);
    lineEl.classList.add('is-updating');
    try { await updateItem(lineEl.dataset.key, next); } catch (err) { toast(err.message, { error: true }); lineEl.classList.remove('is-updating'); }
  });

  // Initial count (cheap; cached by the browser for the session).
  refresh().catch(() => {});
  if (location.search.includes('cart=open')) open();
}
