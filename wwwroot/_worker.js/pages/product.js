import { html, raw, money, truncate, textOf } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { productCard, breadcrumbs, breadcrumbLd, stars, price as priceHtml, accordion, ICON, textLink, button, srcsetAttr } from '../ui/components.js';
import { getProductAddons, getProductReviews, relatedProducts, matchingLid, sizeOptions } from '../lib/store.js';
import { FAMILY_USE, familyKey } from '../content/collections.js';
import { FAQ } from '../content/faq.js';
import { BRAND } from '../content/brand.js';
import { renderError } from './error.js';

export async function renderProduct(c, { slug }) {
  const shell = await shellData(c);
  const product = shell.products.find((p) => p.slug === slug || safeDecode(p.slug) === safeDecode(slug));
  if (!product) return renderError(c, 404);
  if (product.slug !== slug && safeDecode(product.slug) !== safeDecode(slug)) return Response.redirect(new URL(product.permalink, c.url.origin).toString(), 301);

  const [addons, reviews] = await Promise.all([getProductAddons(c.ctx, product), getProductReviews(c.ctx, product.id)]);
  const related = relatedProducts(shell.products, product, 4);
  const lid = matchingLid(shell.products, product);
  const sizes = sizeOptions(shell.products, product);
  const fam = familyKey(product);
  const use = FAMILY_USE[fam] || FAMILY_USE.other;
  const category = product.categories[0] || (fam === 'frying' ? { slug: 'titanium-frying-pans', name: 'Frying Pans' } : null);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }].concat(category ? [{ label: category.name, href: `/product-category/${category.slug}/` }] : []).concat([{ label: product.name, href: product.permalink }]);
  const desc = product.descriptionText;
  const lead = firstSentence(desc) || product.shortDescription.split('\n').find((l) => l.length > 40) || '';
  const isCookware = product.family === 'cookware' || product.family === 'set';
  const config = {
    id: product.id, name: product.name, permalink: product.permalink, price: product.price, currency: product.currency, minorUnit: product.minorUnit,
    image: product.images[0] ? product.images[0].thumb : '', max: product.addToCart.maximum || 99, soldIndividually: product.soldIndividually,
    inStock: product.inStock, hasAddons: addons.length > 0,
    variations: product.type === 'variable' ? product.variations.map((v) => ({ id: v.id, price: v.price, inStock: v.inStock, attributes: v.attributes.map((a) => ({ name: a.name, value: a.value })) })) : [],
  };
  const firstVariation = product.variations.find((v) => v.inStock) || product.variations[0];
  const chosenFor = (attrName) => { const a = firstVariation && firstVariation.attributes.find((x) => x.name === attrName); return a ? a.value : ''; };

  const body = html`
    <div class="container">
      <div class="pdp__crumbs">${breadcrumbs(crumbs)}</div>
      <div class="pdp">
        ${gallery(product)}
        <form class="buy" data-buy-form data-product="${JSON.stringify(config)}" action="/cart/" method="get">
          <div class="buy__head">
            <div class="buy__kicker">
              ${category ? html`<a href="/product-category/${category.slug}/">${category.name}</a>` : ''}
              ${product.reviewCount ? html`<a href="#reviews">${stars(product.rating, product.reviewCount)}</a>` : ''}
              ${product.sku ? html`<span>Model ${product.sku}</span>` : ''}
            </div>
            <h1 class="buy__title">${product.name}</h1>
            <div>${priceHtml(product, { size: 'price--lg' })}</div>
            ${lead ? html`<p class="buy__lead">${lead}</p>` : ''}
            ${specChips(product)}
          </div>

          ${sizes.length > 1 ? html`
            <div class="buy__options">
              <div class="opt-group">
                <div class="opt-group__label"><span>Size</span><small>${sizes.length} diameters</small></div>
                <div class="sizes">
                  ${sizes.map((s) => s.id === product.id
                    ? html`<span class="is-current">${s.diameterCm} cm<small>${inches(s)}</small></span>`
                    : html`<a href="${s.permalink}" class="${s.inStock ? '' : 'is-soldout'}" ${s.inStock ? '' : raw('aria-label="Sold out"')}>${s.diameterCm} cm<small>${inches(s)}</small></a>`)}
                </div>
              </div>
            </div>` : ''}

          ${addons.length || product.type === 'variable' ? html`
            <div class="buy__options">
              ${addons.map((a) => addonGroup(a, product, lid))}
              ${product.type === 'variable' ? product.attributes.filter((at) => at.hasVariations).map((at) => html`
                <div class="opt-group">
                  <label class="opt-group__label" for="attr-${at.id}"><span>${at.name}</span></label>
                  <select class="input select" id="attr-${at.id}" data-attr="${at.name}" required>
                    ${at.terms.map((t) => html`<option value="${t.slug}" data-label="${t.name}" ${t.slug === chosenFor(at.name) ? raw('selected') : ''}>${t.name}</option>`)}
                  </select>
                </div>`) : ''}
            </div>` : ''}

          <div class="buy__cta">
            ${product.type === 'gift-card' ? html`
              <p class="muted" style="font-size:var(--text-sm)">Gift cards are issued by us directly: tell us the amount and the recipient and we send it by email.</p>
              ${button({ href: '/contact/', label: 'Request a gift card', variant: 'primary', size: 'block' })}
            ` : html`
              <div class="buy__row">
                <div class="qty qty--lg" aria-label="Quantity">
                  <button type="button" data-qty="-1" aria-label="Decrease quantity">${raw(ICON.minus)}</button>
                  <input type="number" name="quantity" value="1" min="1" max="${product.addToCart.maximum || 99}" data-qty-input aria-label="Quantity" ${product.soldIndividually ? raw('readonly') : ''}>
                  <button type="button" data-qty="1" aria-label="Increase quantity">${raw(ICON.plus)}</button>
                </div>
                <button class="btn btn--primary btn--lg" type="submit" data-buy-submit ${product.inStock ? '' : raw('disabled')}>
                  <span class="btn__label">${product.inStock ? 'Add to cart' : 'Sold out'}</span>
                  <span class="buy__total" data-buy-total>${money(firstVariation ? firstVariation.price : product.price, product.currency, product.minorUnit)}</span>
                </button>
              </div>
              <span class="buy__stock ${product.inStock ? '' : 'buy__stock--out'}">${product.inStock ? (product.lowStock ? `Only ${product.lowStock} left` : 'In stock — ships from Toronto') : 'Currently sold out'}</span>
            `}
          </div>

          <div class="buy__notes">
            ${isCookware ? html`<p class="buy__note">${raw(ICON.check)}<span><strong>20-year warranty</strong> on the cast body — 5 years no-charge replacement. <a href="/support/warranty/">Terms</a></span></p>` : ''}
            ${isCookware ? html`<p class="buy__note">${raw(ICON.check)}<span><strong>Hand-cast in Germany.</strong> 8 mm base, titanium non-stick surface, oven-proof to 260 °C / 500 °F.</span></p>` : ''}
            <p class="buy__note">${raw(ICON.check)}<span><strong>Ships across Canada and the US.</strong> Flat-rate shipping shown at checkout. <a href="/support/shipping/">Details</a></span></p>
            ${product.family === 'cookware' && !product.lidIncluded && lid ? html`<p class="buy__note">${raw(ICON.check)}<span><strong>Lid sold separately.</strong> The ${lid.name} fits this pan.</span></p>` : ''}
          </div>
        </form>
      </div>
    </div>

    <div class="container pdp-story">
      ${desc ? html`<section class="pdp-section"><h2 class="pdp-section__title">Overview</h2><div class="prose">${raw(cleanDescription(product.description))}</div></section>` : ''}
      ${isCookware ? benefitsSection() : ''}
      ${isCookware ? constructionSection() : ''}
      ${specsSection(product)}
      ${use.intro ? html`<section class="pdp-section"><h2 class="pdp-section__title">How to use</h2><div class="prose"><p>${use.intro}</p><ul>${use.tips.map((t) => html`<li>${t}</li>`)}</ul></div></section>` : ''}
      ${isCookware || product.family === 'lid' ? careSection() : ''}
      ${isCookware ? whySection() : ''}
      ${reviews.length ? reviewsSection(reviews, product) : ''}
      ${related.length ? html`
        <section class="pdp-section" style="display:block">
          <div class="section-head"><div class="section-head__text"><p class="eyebrow">Goes with it</p><h2 class="section-head__title">Related <em class="accent">cookware.</em></h2></div>${textLink('/shop/', 'Shop all')}</div>
          <div class="grid grid--4 grid--products" data-stagger>${related.map((p) => productCard(p))}</div>
        </section>` : ''}
    </div>

    <div class="sticky-bar" data-sticky-bar aria-hidden="true">
      <div class="container sticky-bar__inner">
        <div class="sticky-bar__name">${product.name}<small data-sticky-total>${money(product.price, product.currency, product.minorUnit)}</small></div>
        <button class="btn btn--primary" type="button" data-sticky-submit ${product.inStock ? '' : raw('disabled')}><span class="btn__label">${product.inStock ? 'Add to cart' : 'Sold out'}</span></button>
      </div>
    </div>`;

  return page(c, {
    shell,
    title: product.name,
    description: truncate(lead || product.shortDescription.replace(/\n/g, ' · '), 200),
    canonicalPath: product.permalink,
    ogImage: product.images[0] ? product.images[0].src : undefined,
    ogType: 'product',
    bodyClass: 'page-product',
    scripts: ['/assets/js/product.js'],
    preloadImage: product.images[0] ? { src: product.images[0].src, srcset: product.images[0].srcset, sizes: '(max-width: 64em) 100vw, 50vw' } : null,
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), productLd(product, reviews, lead)],
    body,
  });
}

// ---- Pieces ------------------------------------------------------------------

function gallery(product) {
  const imgs = product.images.length ? product.images : [{ src: '', alt: product.name }];
  const first = imgs[0];
  return html`
    <div class="gallery" data-gallery>
      <div class="gallery__thumbs" role="tablist" aria-label="Product images">
        ${imgs.map((im, i) => html`<button class="gallery__thumb ${i === 0 ? 'is-active' : ''}" type="button" data-full="${im.src}" data-alt="${im.alt}" aria-label="Image ${i + 1}"><img src="${im.thumb || im.src}" alt="" width="72" height="72" loading="lazy"></button>`)}
      </div>
      <div class="gallery__main">
        ${first.src ? html`<img src="${first.src}" ${raw(srcsetAttr(first.src, '(max-width: 64em) 100vw, 50vw'))} alt="${first.alt}" width="1000" height="800" fetchpriority="high" decoding="async">` : html`<span class="product-card__placeholder">Photo coming soon</span>`}
      </div>
      <div class="gallery__track" aria-label="Product images">
        ${imgs.map((im, i) => html`<img src="${im.src.slice(0, -5)}-960.webp" alt="${im.alt}" width="960" height="768" ${i === 0 ? raw('fetchpriority="high"') : raw('loading="lazy"')} decoding="async">`)}
      </div>
      ${imgs.length > 1 ? html`<div class="gallery__dots" aria-hidden="true">${imgs.map((_, i) => html`<span class="${i === 0 ? 'is-active' : ''}"></span>`)}</div>` : ''}
    </div>`;
}

function specChips(p) {
  const s = p.specs; const chips = [];
  if (s.diameter) chips.push(`Ø ${s.diameter.replace(/\s*\(/, ' · ').replace(')', '')}`);
  else if (s.dimensions) chips.push(s.dimensions);
  if (s.height) chips.push(`Height ${s.height}`);
  if (s.capacity) chips.push(`${s.capacity.replace(/(\d)\s*L$/i, '$1 L')} capacity`);
  if (p.family === 'cookware') chips.push(p.lidIncluded || /with lid/i.test(p.name) ? 'Glass lid included' : 'Lid optional');
  if (s.weight) chips.push(`≈ ${s.weight}`);
  if (!chips.length) return '';
  return html`<div class="buy__specs">${chips.map((x) => html`<span>${x}</span>`)}</div>`;
}

function addonGroup(addon, product, lid) {
  const label = addon.key === 'lid' ? 'Glass lid' : addon.key === 'induction' ? 'Induction' : addon.name;
  const help = addon.key === 'lid' ? `Add the matching ${product.diameterCm ? product.diameterCm + ' cm ' : ''}borosilicate glass lid${lid ? '' : ''}.` : addon.key === 'induction' ? 'Choose the induction-ready version for induction cooktops. Same price.' : '';
  return html`
    <div class="opt-group">
      <div class="opt-group__label"><span>${label}</span><small>Optional</small></div>
      ${addon.options.map((o) => html`
        <label class="choice">
          <input type="${addon.options.length > 1 && o.type === 'radio' ? 'radio' : 'checkbox'}" name="${o.field}" value="${o.value}" data-addon-price="${o.price}" data-addon-label="${addon.key === 'lid' ? 'With glass lid' : addon.key === 'induction' ? 'Induction-ready' : `${addon.name}: ${o.label}`}">
          <span class="choice__text"><span class="choice__title">${addon.key === 'lid' ? 'Add the lid' : addon.key === 'induction' ? 'Make it induction-ready' : o.label}</span>${help ? html`<span class="choice__desc">${help}</span>` : ''}</span>
          <span class="choice__price">${o.price ? `+ ${money(Math.round(o.price * 100), product.currency, product.minorUnit)}` : 'Included'}</span>
        </label>`)}
    </div>`;
}

function benefitsSection() {
  const items = [
    ['Little or no oil', 'The titanium surface releases food without fat. Cook vegetables with no water at all under the lid.'],
    ['Even heat, less energy', 'The 8 mm cast base spreads heat evenly and holds it, so you cook at lower settings and in less time.'],
    ['Nothing to loosen', 'The plug-in handle has no screws or rivets and carries the TÜV Rheinland safety label.'],
    ['Oven-proof to 500 °F', 'Handles, glass lids and knobs are oven-proof to 260 °C / 500 °F.'],
  ];
  return html`<section class="pdp-section"><h2 class="pdp-section__title">Key benefits</h2><div class="benefits">${items.map(([t, x]) => html`<div class="benefit"><p class="benefit__title">${t}</p><p class="benefit__text">${x}</p></div>`)}</div></section>`;
}

function constructionSection() {
  return html`<section class="pdp-section"><h2 class="pdp-section__title">Construction</h2><div class="prose">
    <p>Cast by hand from a high-quality aluminium alloy in a German foundry, then turned flat on the lathe. The body is finished with a patented, abrasion-resistant titanium non-stick surface — non-porous, so the aluminium never reaches your food. The inner surface has been tested by LGA Bavaria and meets the German Federal Health Ministry (BGA) recommendations for food-contact articles.</p>
    <p>Glass lids are hardened, heat-resistant borosilicate. Handles use a patented plug-in mounting without screws or rivets.</p>
    <p>${textLink('/why-titanium/', 'The full engineering story')}</p>
  </div></section>`;
}

function specsSection(p) {
  const rows = [];
  if (p.sku) rows.push(['Model', p.sku]);
  p.specs.lines.filter((l) => l.key).forEach((l) => rows.push([l.key, l.value]));
  if (p.specs.notes) rows.push(['Note', p.specs.notes]);
  if (p.weight) rows.push(['Weight', `${p.weight} kg`]);
  if (p.family === 'cookware' || p.family === 'set') { rows.push(['Body', 'Hand-cast aluminium alloy, 8 mm thermobasic base']); rows.push(['Surface', 'Patented titanium non-stick']); rows.push(['Oven', 'Handles, lids and knobs to 260 °C / 500 °F']); rows.push(['Stovetops', 'Gas, electric, ceramic, glass — induction with the induction option']); rows.push(['Warranty', '20 years on the cast body (lids excluded)']); }
  if (p.family === 'lid') rows.push(['Material', 'Heat-resistant borosilicate glass, oven-proof knob']);
  if (!rows.length) return '';
  return html`<section class="pdp-section"><h2 class="pdp-section__title">Specifications</h2><table class="spec-table"><tbody>${rows.map(([k, v]) => html`<tr><th scope="row">${k}</th><td>${v}</td></tr>`)}</tbody></table></section>`;
}

function careSection() {
  return html`<section class="pdp-section"><h2 class="pdp-section__title">Cleaning & care</h2><div class="prose">
    <p>Wash by hand with warm water, normal dish detergent and a green 3M Scotch-Brite pad. We do not recommend the dishwasher: many detergents are highly acidic and can impair the surface.</p>
    <p>No seasoning is needed. Do not use non-stick sprays — they leave an invisible film that stops the surface from releasing. If a pan ever starts to stick, scrub it dry with the Scotch-Brite pad (no soap, no water) to lift the build-up. Use silicone utensils and avoid stacking pans without protection.</p>
    <p>${textLink('/support/care/', 'Full care instructions')}</p>
  </div></section>`;
}

function whySection() {
  const faq = FAQ.filter((f) => ['warranty', 'stovetops', 'dishwasher'].includes(f.id));
  return html`<section class="pdp-section"><h2 class="pdp-section__title">Why Titanium Exclusive</h2><div>
    <p class="prose" style="margin-bottom:1.5rem">The original titanium cookware since 1995. Owners write to tell us the pan they bought at a trade show twenty years ago is still the one they reach for — which is what a 20-year warranty is for.</p>
    ${accordion(faq, { name: 'pdp-faq', cls: 'accordion--compact' })}
  </div></section>`;
}

function reviewsSection(reviews, product) {
  return html`<section class="pdp-section" id="reviews"><h2 class="pdp-section__title">Reviews <span class="muted" style="font-size:var(--text-base)">(${reviews.length})</span></h2>
    <div class="reviews">
      <div>${stars(product.rating, product.reviewCount)}</div>
      ${reviews.map((r) => html`<article class="review"><div class="review__head"><span class="review__name">${r.reviewer}</span><span>${new Date(r.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}</span></div><div class="review-card__stars" aria-label="${r.rating} out of 5">${raw(ICON.star.repeat(r.rating))}</div><p class="review__text">${r.text}</p></article>`)}
    </div></section>`;
}

// ---- Helpers ------------------------------------------------------------------

function firstSentence(text) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const m = cleaned.match(/^.*?[.!?](\s|$)/);
  const s = m ? m[0].trim() : cleaned;
  return s.length > 220 ? truncate(s, 220) : s;
}

// WooCommerce descriptions come as HTML; strip inline styles/classes and the marketing prose that repeats site-wide.
function cleanDescription(htmlStr) {
  return String(htmlStr || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/\s(style|class|id|width|height|align)="[^"]*"/gi, '')
    .replace(/<span>|<\/span>/gi, '')
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '')
    .replace(/Choices include the following and can be added to the shopping cart from the pull down menu \(with or without a matching lid\)\./gi, '');
}

function inches(p) { const m = p.specs.diameter && p.specs.diameter.match(/^([\d.]+)/); return m ? `${m[1]}″` : ''; }
function safeDecode(s) { try { return decodeURIComponent(s); } catch { return s; } }

function productLd(p, reviews, lead) {
  const offer = {
    '@type': 'Offer',
    url: SITE.canonicalOrigin + p.permalink,
    priceCurrency: p.currency,
    price: (p.price / 10 ** p.minorUnit).toFixed(2),
    availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: BRAND.legalName },
  };
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku || undefined,
    image: p.images.map((i) => i.src),
    description: lead || p.shortDescription,
    brand: { '@type': 'Brand', name: 'Titanium Exclusive' },
    category: p.categories.map((k) => k.name).join(' > ') || undefined,
    offers: offer,
  };
  if (p.reviewCount) {
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: p.rating.toFixed(1), reviewCount: p.reviewCount };
    ld.review = reviews.slice(0, 5).map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.reviewer }, datePublished: r.date, reviewBody: r.text, reviewRating: { '@type': 'Rating', ratingValue: r.rating } }));
  }
  return ld;
}
