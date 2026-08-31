// Reusable UI components. Each returns a Raw html fragment.

import { html, raw, money, truncate, escape } from '../lib/html.js';

// ---- Buttons -----------------------------------------------------------------

export function button({ href, label, variant = 'primary', size = '', arrow = true, attrs = '', type = 'button', id = '' }) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''}`;
  const inner = html`<span class="btn__label">${label}</span>${arrow ? raw(ICON.arrow) : ''}`;
  if (href) return html`<a class="${cls}" href="${href}" ${raw(attrs)}>${inner}</a>`;
  return html`<button class="${cls}" type="${type}" ${id ? raw(`id="${id}"`) : ''} ${raw(attrs)}>${inner}</button>`;
}

export function textLink(href, label, attrs = '') {
  return html`<a class="link-arrow" href="${href}" ${raw(attrs)}><span>${label}</span>${raw(ICON.arrow)}</a>`;
}

// ---- Typography blocks ------------------------------------------------------

export function eyebrow(text, cls = '') {
  return html`<p class="eyebrow ${cls}">${text}</p>`;
}

export function sectionHead({ eyebrow: eb, title, lead, align = '', size = '', link }) {
  return html`
    <header class="section-head ${align ? `section-head--${align}` : ''} ${size ? `section-head--${size}` : ''}">
      <div class="section-head__text">
        ${eb ? eyebrow(eb) : ''}
        <h2 class="section-head__title reveal">${raw(title)}</h2>
        ${lead ? html`<p class="section-head__lead reveal">${raw(lead)}</p>` : ''}
      </div>
      ${link ? html`<div class="section-head__aside reveal">${textLink(link.href, link.label)}</div>` : ''}
    </header>`;
}

// ---- Price & rating ----------------------------------------------------------

export function price(p, { size = '' } = {}) {
  const cur = p.currency; const mu = p.minorUnit;
  if (p.type === 'gift-card') return html`<span class="price ${size}"><span class="price__current">Any amount</span></span>`;
  if (p.priceRange && p.priceRange.min !== p.priceRange.max) {
    return html`<span class="price ${size}"><span class="price__current">${money(p.priceRange.min, cur, mu)} – ${money(p.priceRange.max, cur, mu)}</span></span>`;
  }
  const onSale = p.onSale && p.regularPrice > p.price;
  return html`<span class="price ${size} ${onSale ? 'price--sale' : ''}">
    <span class="price__current">${money(p.price, cur, mu)}</span>
    ${onSale ? html`<s class="price__was">${money(p.regularPrice, cur, mu)}</s>` : ''}
    <span class="price__currency">${cur}</span>
  </span>`;
}

export function stars(rating, count, { showCount = true } = {}) {
  if (!count) return '';
  const r = Math.round(rating * 2) / 2;
  const pct = Math.max(0, Math.min(100, (r / 5) * 100));
  return html`<span class="stars" aria-label="Rated ${rating.toFixed(1)} out of 5 from ${count} review${count === 1 ? '' : 's'}">
    <span class="stars__track" aria-hidden="true"><span class="stars__fill" style="width:${pct}%"></span></span>
    ${showCount ? html`<span class="stars__count">${count} review${count === 1 ? '' : 's'}</span>` : ''}
  </span>`;
}

// ---- Product card ------------------------------------------------------------

export function productCard(p, { eager = false, size = '' } = {}) {
  const img = p.images[0];
  const hover = p.images[1];
  const meta = cardMeta(p);
  return html`
    <article class="product-card ${size} reveal" data-product-id="${p.id}">
      <a class="product-card__media" href="${p.permalink}" aria-label="${p.name}">
        ${img ? html`<img class="product-card__img" src="${img.src}" alt="${img.alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="600" height="600">` : html`<span class="product-card__placeholder">Photo coming soon</span>`}
        ${hover ? html`<img class="product-card__img product-card__img--alt" src="${hover.src}" alt="" loading="lazy" decoding="async" width="600" height="600" aria-hidden="true">` : ''}
        ${badge(p)}
      </a>
      <div class="product-card__body">
        <div class="product-card__row">
          <h3 class="product-card__title"><a href="${p.permalink}">${p.name}</a></h3>
          ${price(p)}
        </div>
        ${meta ? html`<p class="product-card__meta">${meta}</p>` : ''}
        ${p.reviewCount ? html`<div class="product-card__rating">${stars(p.rating, p.reviewCount)}</div>` : ''}
        <div class="product-card__actions">
          ${quickAdd(p)}
          <a class="link-arrow link-arrow--sm" href="${p.permalink}"><span>View</span>${raw(ICON.arrow)}</a>
        </div>
      </div>
    </article>`;
}

function badge(p) {
  if (!p.inStock) return html`<span class="badge badge--muted">Sold out</span>`;
  if (p.onSale && p.regularPrice > p.price) {
    const pct = Math.round((1 - p.price / p.regularPrice) * 100);
    return html`<span class="badge">Save ${pct}%</span>`;
  }
  return '';
}

function cardMeta(p) {
  const bits = [];
  if (p.specs.diameter) bits.push(p.specs.diameter.replace(/\s*\(/, ' · ').replace(')', ''));
  else if (p.specs.dimensions) bits.push(p.specs.dimensions);
  if (p.specs.capacity) bits.push(p.specs.capacity.replace(/(\d)L/, '$1 L'));
  if (p.family === 'cookware') bits.push(p.lidIncluded || /with lid/i.test(p.name) ? 'Lid included' : 'Lid optional');
  if (p.family === 'set') bits.push(truncate(p.shortDescription.split('\n')[0], 70));
  return bits.join(' · ');
}

function quickAdd(p) {
  // Cookware carries lid / induction options, so it always routes through the product page.
  if (!p.inStock) return html`<span class="quick-add quick-add--disabled">Notify me</span>`;
  if (p.hasOptions || p.family === 'cookware' || p.family === 'set' || p.type === 'gift-card') {
    return html`<a class="quick-add" href="${p.permalink}">Choose options</a>`;
  }
  return html`<button class="quick-add" type="button" data-add-to-cart="${p.id}" data-product-name="${p.name}">Add to cart</button>`;
}

// ---- Cards ------------------------------------------------------------------

export function collectionCard(c, { size = '' } = {}) {
  return html`
    <a class="collection-card ${size} reveal" href="/product-category/${c.slug}/">
      <span class="collection-card__media">
        ${c.image ? html`<img src="${c.image}" alt="" loading="lazy" decoding="async" width="800" height="800">` : ''}
      </span>
      <span class="collection-card__body">
        <span class="collection-card__title">${c.name}</span>
        <span class="collection-card__meta">${c.count} piece${c.count === 1 ? '' : 's'}${raw(ICON.arrow)}</span>
      </span>
    </a>`;
}

export function recipeCard(r) {
  return html`
    <a class="recipe-card reveal" href="/recipes/${r.slug}/">
      <span class="recipe-card__media">${r.image ? html`<img src="${r.image}" alt="${r.title}" loading="lazy" decoding="async" width="800" height="1000">` : ''}</span>
      <span class="recipe-card__body">
        <span class="recipe-card__meta">${r.category || 'Recipe'}${r.time ? html` · ${r.time}` : ''}</span>
        <span class="recipe-card__title">${r.title}</span>
        <span class="link-arrow link-arrow--sm"><span>View recipe</span>${raw(ICON.arrow)}</span>
      </span>
    </a>`;
}

export function reviewCard(r) {
  return html`
    <figure class="review-card">
      <div class="review-card__stars" aria-label="${r.rating} out of 5 stars">${raw(ICON.star.repeat(r.rating))}</div>
      <blockquote class="review-card__quote">${truncate(r.text, 260)}</blockquote>
      <figcaption class="review-card__by">
        <span class="review-card__name">${r.reviewer}</span>
        ${r.productSlug ? html`<a class="review-card__product" href="/product/${r.productSlug}/">${r.productName}</a>` : html`<span class="review-card__product">${r.productName}</span>`}
      </figcaption>
    </figure>`;
}

// ---- Accordion --------------------------------------------------------------

export function accordion(items, { name = 'acc', open = -1, cls = '' } = {}) {
  return html`
    <div class="accordion ${cls}">
      ${items.map((it, i) => html`
        <details class="accordion__item" ${i === open ? raw('open') : ''} ${name ? raw(`name="${escape(name)}"`) : ''}>
          <summary class="accordion__summary"><span>${raw(it.q || it.title)}</span><span class="accordion__icon" aria-hidden="true"></span></summary>
          <div class="accordion__panel"><div class="accordion__content prose">${raw(it.a || it.body)}</div></div>
        </details>`)}
    </div>`;
}

// ---- Breadcrumbs ------------------------------------------------------------

export function breadcrumbs(items) {
  return html`
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        ${items.map((it, i) => html`<li>${i < items.length - 1 ? html`<a href="${it.href}">${it.label}</a>` : html`<span aria-current="page">${it.label}</span>`}</li>`)}
      </ol>
    </nav>`;
}

export function breadcrumbLd(items, origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: origin + it.href })),
  };
}

// ---- Media -------------------------------------------------------------------

export function picture({ src, alt = '', ratio = '', cls = '', eager = false, width, height, sizes }) {
  return html`<figure class="media ${cls}" ${ratio ? raw(`style="--ratio:${ratio}"`) : ''}>
    <img src="${src}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${width ? raw(`width="${width}"`) : ''} ${height ? raw(`height="${height}"`) : ''} ${sizes ? raw(`sizes="${sizes}"`) : ''}>
  </figure>`;
}

// Clearly labelled placeholder for photography that does not exist yet.
export function photoPlaceholder(label, { ratio = '4/5', cls = '' } = {}) {
  return html`<div class="photo-placeholder ${cls}" style="--ratio:${ratio}" role="img" aria-label="Placeholder: ${label}">
    <span class="photo-placeholder__tag">Photography needed</span>
    <span class="photo-placeholder__label">${label}</span>
  </div>`;
}

// ---- Icons (inline SVG, currentColor) ---------------------------------------

export const ICON = {
  arrow: '<svg class="icon icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-3.8-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  bag: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  user: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 21a8 8 0 0116 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  menu: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  chevron: '<svg class="icon icon-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg class="icon icon-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4L2.7 9.5l6.5-.7z" fill="currentColor"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  minus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  play: '<svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
  dash: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
