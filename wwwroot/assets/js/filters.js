// Shop filtering and sorting. The grid is server-rendered with data attributes; this module
// filters it client-side (71 products) and mirrors the state in the URL.
import { $, $$, lockScroll, unlockScroll } from './ui.js?v=4';

const shop = $('[data-shop]');
if (shop) init(shop);

function init(root) {
  const grid = $('[data-shop-grid]', root);
  const cards = $$('.product-card', grid);
  const form = $('[data-filters]', root);
  const countEl = $('[data-shop-count]', root);
  const emptyEl = $('[data-shop-empty]', root);
  const chips = $('[data-active-filters]', root);
  const sortSel = $('[data-sort]', root);

  const data = cards.map((c) => ({
    el: c,
    cats: (c.dataset.cats || '').split(' ').filter(Boolean),
    price: Number(c.dataset.price || 0),
    size: Number(c.dataset.size || 0),
    lid: c.dataset.lid || '',
    sale: c.dataset.sale === '1',
    stock: c.dataset.stock === '1',
    rating: Number(c.dataset.rating || 0),
    reviews: Number(c.dataset.reviews || 0),
    name: c.dataset.name || '',
    order: Number(c.dataset.order || 0),
    type: c.dataset.type || '',
  }));

  const state = () => {
    const fd = new FormData(form);
    return {
      cats: fd.getAll('cat'),
      sizes: fd.getAll('size'),
      lid: fd.getAll('lid'),
      type: fd.getAll('type'),
      sale: fd.get('sale') === '1',
      stock: fd.get('stock') === '1',
      min: Number(fd.get('min') || 0),
      max: Number(fd.get('max') || 0),
      sort: sortSel ? sortSel.value : 'featured',
    };
  };

  const sizeBucket = (cm) => (!cm ? '' : cm <= 20 ? 'small' : cm <= 26 ? 'medium' : cm <= 32 ? 'large' : 'xl');

  const apply = (push = true) => {
    const s = state();
    let visible = 0;
    const list = data.filter((d) => {
      if (s.cats.length && !s.cats.some((c) => d.cats.includes(c))) return false;
      if (s.sizes.length && !s.sizes.includes(sizeBucket(d.size))) return false;
      if (s.lid.length && !s.lid.includes(d.lid)) return false;
      if (s.type.length && !s.type.includes(d.type)) return false;
      if (s.sale && !d.sale) return false;
      if (s.stock && !d.stock) return false;
      if (s.min && d.price < s.min * 100) return false;
      if (s.max && d.price > s.max * 100) return false;
      return true;
    });
    const set = new Set(list.map((d) => d.el));
    data.forEach((d) => d.el.classList.toggle('is-hidden', !set.has(d.el)));
    visible = list.length;
    // Sort by reordering DOM nodes.
    const sorted = [...list].sort((a, b) => {
      switch (s.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.reviews - a.reviews || b.rating - a.rating || a.order - b.order;
        default: return a.order - b.order;
      }
    });
    sorted.forEach((d) => grid.appendChild(d.el));
    countEl.textContent = `${visible} ${visible === 1 ? 'product' : 'products'}`;
    emptyEl.classList.toggle('is-visible', visible === 0);
    renderChips(s);
    if (push) syncUrl(s);
  };

  const labelFor = (name, value) => {
    const input = form.querySelector(`[name="${name}"][value="${CSS.escape(value)}"]`);
    return input && input.closest('label') ? input.closest('label').textContent.replace(/\d+$/, '').trim() : value;
  };
  const renderChips = (s) => {
    const items = [];
    s.cats.forEach((v) => items.push(['cat', v, labelFor('cat', v)]));
    s.sizes.forEach((v) => items.push(['size', v, labelFor('size', v)]));
    s.lid.forEach((v) => items.push(['lid', v, labelFor('lid', v)]));
    s.type.forEach((v) => items.push(['type', v, labelFor('type', v)]));
    if (s.sale) items.push(['sale', '1', 'On sale']);
    if (s.stock) items.push(['stock', '1', 'In stock']);
    if (s.min || s.max) items.push(['price', '', `${s.min ? '$' + s.min : '$0'} – ${s.max ? '$' + s.max : 'any'}`]);
    chips.innerHTML = items.map(([n, v, l]) => `<button type="button" data-clear="${n}" data-value="${v}">${l}<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>`).join('')
      + (items.length ? '<button type="button" data-clear="all">Clear all</button>' : '');
  };

  const syncUrl = (s) => {
    const p = new URLSearchParams();
    s.cats.forEach((v) => p.append('cat', v)); s.sizes.forEach((v) => p.append('size', v)); s.lid.forEach((v) => p.append('lid', v)); s.type.forEach((v) => p.append('type', v));
    if (s.sale) p.set('sale', '1'); if (s.stock) p.set('stock', '1'); if (s.min) p.set('min', s.min); if (s.max) p.set('max', s.max); if (s.sort !== 'featured') p.set('sort', s.sort);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
  };

  // Restore from URL
  const params = new URLSearchParams(location.search);
  ['cat', 'size', 'lid', 'type'].forEach((n) => params.getAll(n).forEach((v) => { const i = form.querySelector(`[name="${n}"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; }));
  ['sale', 'stock'].forEach((n) => { if (params.get(n) === '1') { const i = form.querySelector(`[name="${n}"]`); if (i) i.checked = true; } });
  ['min', 'max'].forEach((n) => { if (params.get(n)) form.querySelector(`[name="${n}"]`).value = params.get(n); });
  if (sortSel && params.get('sort')) sortSel.value = params.get('sort');

  form.addEventListener('change', () => apply());
  form.addEventListener('submit', (e) => { e.preventDefault(); apply(); closeSheet(); });
  sortSel && sortSel.addEventListener('change', () => apply());
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear]'); if (!b) return;
    const n = b.dataset.clear;
    if (n === 'all') form.reset();
    else if (n === 'price') { form.querySelector('[name="min"]').value = ''; form.querySelector('[name="max"]').value = ''; }
    else { const i = form.querySelector(`[name="${n}"][value="${CSS.escape(b.dataset.value)}"]`) || form.querySelector(`[name="${n}"]`); if (i) i.checked = false; }
    apply();
  });
  $('[data-filters-reset]', root)?.addEventListener('click', () => { form.reset(); apply(); });

  // Mobile bottom sheet
  const openBtn = $('[data-filters-open]', root);
  const closeSheet = () => { form.classList.remove('is-open'); unlockScroll('filters'); openBtn?.setAttribute('aria-expanded', 'false'); };
  openBtn?.addEventListener('click', () => { form.classList.add('is-open'); lockScroll('filters'); openBtn.setAttribute('aria-expanded', 'true'); });
  $$('[data-filters-close]', root).forEach((b) => b.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  apply(false);
}
