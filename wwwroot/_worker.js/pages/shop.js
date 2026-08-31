import { html, raw } from '../lib/html.js';
import { SITE, PRIMARY_COLLECTIONS } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { productCard, breadcrumbs, breadcrumbLd, ICON, textLink } from '../ui/components.js';
import { COLLECTION_COPY } from '../content/collections.js';
import { renderError } from './error.js';

const TYPE_LABEL = { cookware: 'Cookware', set: 'Gift sets', lid: 'Lids', 'steamer-insert': 'Steamer inserts', cleaning: 'Cleaning', 'gift-card': 'Gift cards', household: 'Household', other: 'Other' };

export async function renderShop(c) {
  const shell = await shellData(c);
  const products = orderProducts(shell.products);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }];
  return page(c, {
    shell,
    title: 'Shop titanium cookware',
    description: 'Every Titanium Exclusive piece: frying pans, sauce pans, casseroles, roasting and soup pots, woks, grill pans, lids, steamers and gift sets. Hand-cast in Germany, 20-year warranty.',
    bodyClass: 'page-shop',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), itemListLd(products)],
    scripts: ['/assets/js/filters.js'],
    body: html`
      <div class="container">
        <header class="shop-hero">
          ${breadcrumbs(crumbs)}
          <h1 class="shop-hero__title">All <em class="accent">cookware.</em></h1>
          <p class="shop-hero__lead">Seventy pieces, one alloy, one surface. Filter by collection or size, or start with a set.</p>
          ${categoryChips(shell.categories, null)}
        </header>
        ${shopGrid(shell, products)}
      </div>`,
  });
}

export async function renderCategory(c, { slug }) {
  const shell = await shellData(c);
  const category = shell.categories.find((k) => k.slug === slug);
  if (!category) return renderError(c, 404);
  const copy = COLLECTION_COPY[slug] || { title: category.name, lead: category.description };
  const products = orderProducts(shell.products.filter((p) => p.categories.some((k) => k.slug === slug) || (slug === 'titanium-frying-pans' && p.family === 'cookware' && p.categories.length === 0 && /frying/i.test(p.name))));
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: copy.title, href: `/product-category/${slug}/` }];
  return page(c, {
    shell,
    title: `${copy.title} — titanium cookware`,
    description: copy.lead,
    canonicalPath: `/product-category/${slug}/`,
    bodyClass: 'page-shop',
    ogImage: category.image || undefined,
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), itemListLd(products)],
    scripts: ['/assets/js/filters.js'],
    body: html`
      <div class="container">
        <header class="shop-hero">
          ${breadcrumbs(crumbs)}
          <h1 class="shop-hero__title">${copy.title}</h1>
          <p class="shop-hero__lead">${copy.lead}</p>
          ${copy.uses ? html`<p class="muted" style="font-size:var(--text-sm)"><strong>Best for:</strong> ${copy.uses}</p>` : ''}
          ${categoryChips(shell.categories, slug)}
        </header>
        ${shopGrid(shell, products, { hideCategoryFilter: true })}
        ${slug === 'titanium-frying-pans' ? html`<p style="margin:2rem 0 0">${textLink('/product-category/lids/', 'Add a matching lid')}</p>` : ''}
      </div>`,
  });
}

function orderProducts(products) {
  const order = PRIMARY_COLLECTIONS.map((k) => k.slug);
  const rank = (p) => {
    if (p.family === 'cookware' && p.categories.length === 0) return 0; // uncategorised frying pans first
    const idx = p.categories.map((k) => order.indexOf(k.slug)).filter((i) => i >= 0);
    return idx.length ? Math.min(...idx) + 1 : 50;
  };
  return [...products].filter((p) => p.slug !== 'default_gift_this_product').sort((a, b) => rank(a) - rank(b) || (a.diameterCm || 0) - (b.diameterCm || 0) || a.price - b.price).map((p, i) => ({ ...p, order: i }));
}

function categoryChips(categories, current) {
  const list = PRIMARY_COLLECTIONS.map((k) => categories.find((x) => x.slug === k.slug)).filter(Boolean);
  return html`<nav class="shop-cats" aria-label="Collections">
    <a href="/shop/" class="${current ? '' : 'is-active'}">All</a>
    ${list.map((k) => html`<a href="/product-category/${k.slug}/" class="${k.slug === current ? 'is-active' : ''}">${k.name}</a>`)}
    <a href="/product-category/lids/" class="${current === 'lids' ? 'is-active' : ''}">Lids</a>
  </nav>`;
}

function shopGrid(shell, products, { hideCategoryFilter = false } = {}) {
  const cats = shell.categories.filter((k) => products.some((p) => p.categories.some((x) => x.slug === k.slug)));
  const sizeCounts = { small: 0, medium: 0, large: 0, xl: 0 };
  products.forEach((p) => { const b = sizeBucket(p.diameterCm); if (b) sizeCounts[b]++; });
  const types = Object.keys(TYPE_LABEL).filter((t) => products.some((p) => p.family === t));
  const lidCounts = { included: products.filter((p) => lidState(p) === 'included').length, optional: products.filter((p) => lidState(p) === 'optional').length };
  const prices = products.map((p) => p.price / 100).filter(Boolean);
  const min = Math.floor(Math.min(...prices) || 0), max = Math.ceil(Math.max(...prices) || 0);
  return html`
    <div class="shop" data-shop>
      <form class="filters" data-filters aria-label="Filters">
        <div class="filters__close"><span>Filter</span><button class="icon-btn" type="button" data-filters-close aria-label="Close filters">${raw(ICON.close)}</button></div>
        ${!hideCategoryFilter && cats.length > 1 ? html`
          <fieldset class="filters__group"><legend class="filters__title">Collection</legend>
            ${cats.map((k) => html`<label><input type="checkbox" name="cat" value="${k.slug}"> ${k.name}<span class="filters__count">${products.filter((p) => p.categories.some((x) => x.slug === k.slug)).length}</span></label>`)}
          </fieldset>` : ''}
        ${Object.values(sizeCounts).some(Boolean) ? html`
          <fieldset class="filters__group"><legend class="filters__title">Size</legend>
            ${sizeCounts.small ? html`<label><input type="checkbox" name="size" value="small"> Up to 20 cm<span class="filters__count">${sizeCounts.small}</span></label>` : ''}
            ${sizeCounts.medium ? html`<label><input type="checkbox" name="size" value="medium"> 22 – 26 cm<span class="filters__count">${sizeCounts.medium}</span></label>` : ''}
            ${sizeCounts.large ? html`<label><input type="checkbox" name="size" value="large"> 28 – 32 cm<span class="filters__count">${sizeCounts.large}</span></label>` : ''}
            ${sizeCounts.xl ? html`<label><input type="checkbox" name="size" value="xl"> 36 cm and larger<span class="filters__count">${sizeCounts.xl}</span></label>` : ''}
          </fieldset>` : ''}
        ${lidCounts.included && lidCounts.optional ? html`
          <fieldset class="filters__group"><legend class="filters__title">Lid</legend>
            <label><input type="checkbox" name="lid" value="included"> Lid included<span class="filters__count">${lidCounts.included}</span></label>
            <label><input type="checkbox" name="lid" value="optional"> Lid optional<span class="filters__count">${lidCounts.optional}</span></label>
          </fieldset>` : ''}
        ${types.length > 1 ? html`
          <fieldset class="filters__group"><legend class="filters__title">Type</legend>
            ${types.map((t) => html`<label><input type="checkbox" name="type" value="${t}"> ${TYPE_LABEL[t]}<span class="filters__count">${products.filter((p) => p.family === t).length}</span></label>`)}
          </fieldset>` : ''}
        <fieldset class="filters__group"><legend class="filters__title">Price</legend>
          <div class="filters__range"><input class="input" type="number" name="min" min="${min}" max="${max}" placeholder="${min}" aria-label="Minimum price"><span>–</span><input class="input" type="number" name="max" min="${min}" max="${max}" placeholder="${max}" aria-label="Maximum price"></div>
        </fieldset>
        <fieldset class="filters__group"><legend class="filters__title">Availability</legend>
          <label><input type="checkbox" name="sale" value="1"> On sale<span class="filters__count">${products.filter((p) => p.onSale).length}</span></label>
          <label><input type="checkbox" name="stock" value="1"> In stock only</label>
        </fieldset>
        <div class="filters__actions">
          <button class="btn btn--primary btn--sm" type="submit"><span class="btn__label">Show results</span></button>
          <button class="btn btn--ghost btn--sm" type="button" data-filters-reset><span class="btn__label">Reset</span></button>
        </div>
      </form>
      <div>
        <div class="shop__toolbar">
          <span class="shop__count" data-shop-count>${products.length} products</span>
          <div style="display:flex;gap:.75rem;align-items:center">
            <button class="btn btn--secondary btn--sm shop__filters-btn" type="button" data-filters-open aria-expanded="false"><span class="btn__label">Filter</span></button>
            <label class="shop__sort"><span class="sr-only">Sort by</span>
              <select data-sort>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Most reviewed</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
        </div>
        <div class="active-filters" data-active-filters></div>
        <div class="grid--products" data-shop-grid data-stagger>
          ${products.map((p, i) => cardWithData(p, i))}
        </div>
        <p class="shop__empty" data-shop-empty>No products match those filters. <button type="button" class="link-arrow" data-filters-reset><span>Clear filters</span></button></p>
      </div>
    </div>`;
}

function cardWithData(p, i) {
  const card = productCard(p, { eager: i < 6 }).toString();
  const attrs = ` data-cats="${p.categories.map((k) => k.slug).join(' ')}" data-price="${p.price}" data-size="${p.diameterCm || ''}" data-lid="${lidState(p)}" data-sale="${p.onSale ? 1 : 0}" data-stock="${p.inStock ? 1 : 0}" data-rating="${p.rating}" data-reviews="${p.reviewCount}" data-name="${p.name.replace(/"/g, '&quot;')}" data-order="${p.order}" data-type="${p.family}"`;
  return raw(card.replace('<article class="product-card', `<article${attrs} class="product-card`));
}

function sizeBucket(cm) { return !cm ? '' : cm <= 20 ? 'small' : cm <= 26 ? 'medium' : cm <= 32 ? 'large' : 'xl'; }
function lidState(p) { if (p.family !== 'cookware') return ''; return p.lidIncluded || /with lid/i.test(p.name) ? 'included' : 'optional'; }

function itemListLd(products) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 50).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE.canonicalOrigin + p.permalink, name: p.name })),
  };
}
