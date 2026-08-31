// Predictive search overlay backed by the edge /api/search/ endpoint.
import { $, $$, openDialog, lockScroll, unlockScroll, debounce } from './ui.js';

export function initSearch() {
  const root = $('[data-search]');
  if (!root) return;
  const panel = $('.search__panel', root);
  const input = $('[data-search-input]', root);
  const results = $('[data-search-results]', root);
  const defaultHtml = results.innerHTML;
  let close = null;
  let active = -1;
  let controller = null;

  const doOpen = () => {
    if (close) return;
    lockScroll('search');
    close = openDialog(root, panel, { onClose: () => { unlockScroll('search'); close = null; } });
    setTimeout(() => input.focus(), 30);
  };
  $$('[data-search-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); doOpen(); }));
  $$('[data-search-close]', root).forEach((b) => b.addEventListener('click', () => close && close()));
  document.addEventListener('keydown', (e) => { if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); doOpen(); } });

  const render = (data, q) => {
    active = -1;
    if (!data) { results.innerHTML = defaultHtml; return; }
    const { products = [], categories = [], recipes = [], pages = [] } = data;
    if (!products.length && !categories.length && !recipes.length && !pages.length) {
      results.innerHTML = `<p class="search__empty">Nothing matched “${escapeHtml(q)}”. Try a size (28 cm), a type (frying pan) or a topic (warranty).</p>`;
      return;
    }
    const links = [...categories.map((c) => ({ ...c, kind: 'Collection' })), ...recipes.map((r) => ({ ...r, kind: 'Recipe' })), ...pages.map((p) => ({ ...p, kind: 'Help' }))];
    results.innerHTML = `<div class="search__grid">
      <div>
        ${products.length ? `<p class="search__group-title">Cookware</p>
        <div class="search__products">${products.map((p) => `<a class="search__product" href="${p.url}" data-result>
          <img src="${p.image || ''}" alt="" width="56" height="56" loading="lazy">
          <span><span class="search__product-name">${p.name}</span><br><span class="search__product-price">${p.price}${p.meta ? ` · ${p.meta}` : ''}</span></span>
        </a>`).join('')}</div>
        <p class="search__all"><a class="link-arrow" href="/search?q=${encodeURIComponent(q)}"><span>See all results</span><svg class="icon icon-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a></p>` : ''}
      </div>
      ${links.length ? `<div><p class="search__group-title">Also</p><ul class="search__links">${links.map((l) => `<li><a href="${l.url}" data-result><span class="muted">${l.kind} · </span>${l.name}</a></li>`).join('')}</ul></div>` : ''}
    </div>`;
  };

  const search = debounce(async (q) => {
    if (controller) controller.abort();
    if (q.trim().length < 2) { render(null); return; }
    controller = new AbortController();
    try {
      const data = await fetch(`/api/search/?q=${encodeURIComponent(q)}`, { signal: controller.signal }).then((r) => r.json());
      render(data, q);
    } catch (e) { if (e.name !== 'AbortError') render({ products: [] }, q); }
  }, 160);

  input.addEventListener('input', () => search(input.value));
  input.addEventListener('keydown', (e) => {
    const items = $$('[data-result]', results);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      active = e.key === 'ArrowDown' ? (active + 1) % items.length : (active - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('is-active', i === active));
      items[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && active >= 0 && items[active]) {
      e.preventDefault(); location.href = items[active].href;
    }
  });
  $('[data-search-form]', root).addEventListener('submit', (e) => { if (input.value.trim().length < 2) e.preventDefault(); });
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
