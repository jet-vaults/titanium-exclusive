// WooCommerce Store API client with edge caching.
// Product data is never hard-coded: everything comes from the live WooCommerce catalog.

import { WP, COLLECTIONS } from '../config.js';
import { cachedJson } from './cache.js';
import { fetchOrigin } from './proxy.js';
import { textOf, decodeEntities } from './html.js';

const API = '/wp-json/wc/store/v1';

async function getJson(path, currency) {
  const res = await fetchOrigin(path, {}, currency);
  if (!res.ok) throw new Error(`Store API ${res.status} for ${path}`);
  return res.json();
}

// ---- Catalog -----------------------------------------------------------------

export async function getAllProducts(ctx, currency) {
  const products = await cachedJson(ctx, `products:${currency}`, WP.catalogTtl, async () => {
    const list = await getJson(`${API}/products?per_page=100&page=1&catalog_visibility=visible`, currency);
    return list.map(normalizeProduct).filter((p) => p.purchasable || p.type === 'gift-card');
  });
  return products;
}

export async function getCategories(ctx) {
  return cachedJson(ctx, 'categories', WP.catalogTtl, async () => {
    const list = await getJson(`${API}/products/categories?per_page=100`, WP.defaultCurrency);
    return list.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: decodeEntities(c.name),
      description: textOf(c.description),
      count: c.count,
      image: c.image ? c.image.src : null,
      order: Math.max(0, COLLECTIONS.findIndex((k) => k.slug === c.slug)),
    })).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  });
}

export async function getProductBySlug(ctx, currency, slug) {
  const all = await getAllProducts(ctx, currency);
  const decoded = safeDecode(slug);
  return all.find((p) => p.slug === slug || safeDecode(p.slug) === decoded) || null;
}

export async function getProductsInCategory(ctx, currency, categorySlug) {
  const all = await getAllProducts(ctx, currency);
  return all.filter((p) => p.categories.some((c) => c.slug === categorySlug));
}

export async function getReviews(ctx) {
  return cachedJson(ctx, 'reviews', WP.catalogTtl, async () => {
    const list = await getJson(`${API}/products/reviews?per_page=50&orderby=date&order=desc`, WP.defaultCurrency);
    return list
      .map((r) => ({
        id: r.id,
        rating: r.rating,
        reviewer: decodeEntities(r.reviewer),
        text: textOf(r.review),
        date: r.date_created,
        productId: r.product_id,
        productName: decodeEntities(r.product_name),
        productSlug: permalinkSlug(r.product_permalink),
      }))
      // Product reviews are moderated in WooCommerce; skip entries that are clearly questions, not reviews.
      .filter((r) => r.rating >= 4 && r.text.length > 20 && !/shipping to|is it possible|\?\s*$/i.test(r.text));
  });
}

export async function getProductReviews(ctx, productId) {
  const all = await getReviews(ctx);
  return all.filter((r) => r.productId === productId);
}

// ---- Product add-ons (WooCommerce Product Add-Ons) -------------------------
// The plugin has no public REST endpoint, so the definitions are read from the
// rendered WooCommerce product page and cached. They remain fully managed in WooCommerce.

export async function getProductAddons(ctx, product) {
  return cachedJson(ctx, `addons:${product.id}`, WP.addonsTtl, async () => {
    try {
      const res = await fetchOrigin(`/product/${product.slug}/`, { headers: { accept: 'text/html' } });
      if (!res.ok) return [];
      const page = await res.text();
      return parseAddons(page);
    } catch {
      return [];
    }
  });
}

export function parseAddons(page) {
  const addons = [];
  const wrapRe = /<div class="wc-pao-addon-container[\s\S]*?<label[^>]*data-addon-name="([^"]*)"[\s\S]*?<\/div>\s*<\/div>/g;
  const inputRe = /<input[^>]*class="[^"]*wc-pao-addon-field[^"]*"[^>]*>/g;
  const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m ? decodeEntities(m[1]) : ''; };
  let block;
  while ((block = wrapRe.exec(page))) {
    const name = decodeEntities(block[1]);
    const options = [];
    let input;
    while ((input = inputRe.exec(block[0]))) {
      const tag = input[0];
      options.push({
        field: attr(tag, 'name'),
        value: attr(tag, 'value'),
        label: attr(tag, 'data-label') || 'Yes',
        price: Number(attr(tag, 'data-raw-price') || 0),
        priceType: attr(tag, 'data-price-type') || 'flat_fee',
        type: attr(tag, 'type'),
      });
    }
    if (options.length) addons.push({ name, options, key: classify(name) });
  }
  return addons;
}

function classify(name) {
  const n = name.toLowerCase();
  if (n.includes('lid')) return 'lid';
  if (n.includes('induction')) return 'induction';
  return 'option';
}

// ---- Normalisation ---------------------------------------------------------

function normalizeProduct(p) {
  const prices = p.prices || {};
  const minor = Number(prices.currency_minor_unit ?? 2);
  const specs = parseSpecs(textOf(p.short_description));
  const categories = (p.categories || []).map((c) => ({ id: c.id, slug: c.slug, name: decodeEntities(c.name) }));
  const family = detectFamily(p, categories);
  return {
    id: p.id,
    name: cleanName(p.name),
    slug: p.slug,
    sku: p.sku || '',
    type: p.type,
    permalink: `/product/${p.slug}/`,
    shortDescription: textOf(p.short_description),
    description: p.description || '',
    descriptionText: textOf(p.description),
    specs,
    family,
    modelCode: specs.model || '',
    diameterCm: specs.diameterCm || null,
    capacityL: specs.capacityL || null,
    lidIncluded: /lid included|with lid|w\/ ?lid/i.test(`${p.name} ${textOf(p.short_description)}`) && !/sold separately/i.test(textOf(p.short_description)),
    onSale: !!p.on_sale,
    price: Number(prices.price || 0),
    regularPrice: Number(prices.regular_price || 0),
    salePrice: Number(prices.sale_price || 0),
    priceRange: prices.price_range ? { min: Number(prices.price_range.min_amount), max: Number(prices.price_range.max_amount) } : null,
    currency: prices.currency_code || 'CAD',
    minorUnit: minor,
    rating: Number(p.average_rating || 0),
    reviewCount: Number(p.review_count || 0),
    images: (p.images || []).map((i) => ({ id: i.id, src: i.src, thumb: i.thumbnail || i.src, alt: decodeEntities(i.alt || i.name || p.name) })),
    categories,
    attributes: (p.attributes || []).map((a) => ({
      id: a.id,
      name: a.name,
      taxonomy: a.taxonomy,
      hasVariations: a.has_variations,
      terms: (a.terms || []).map((t) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug })),
    })),
    variations: (p.variations || []).map((v) => ({ id: v.id, attributes: v.attributes })),
    hasOptions: !!p.has_options,
    purchasable: !!p.is_purchasable,
    inStock: !!p.is_in_stock,
    onBackorder: !!p.is_on_backorder,
    lowStock: p.low_stock_remaining,
    soldIndividually: !!p.sold_individually,
    weight: p.weight || '',
    dimensions: p.dimensions || {},
    addToCart: p.add_to_cart || {},
  };
}

function cleanName(name) {
  return decodeEntities(name).replace(/\s+/g, ' ').trim();
}

// Woo short descriptions hold the real spec sheet as loose lines ("Diameter: 11″ (28cm)").
export function parseSpecs(text) {
  const specs = { lines: [] };
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/^[\s–—-]+/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z][A-Za-z .\/]+?):\s*(.+)$/);
    if (m) {
      const key = m[1].trim(); const value = m[2].trim();
      specs.lines.push({ key, value });
      const k = key.toLowerCase();
      if (k === 'diameter') { const cm = value.match(/(\d+(?:\.\d+)?)\s*cm/i); if (cm) specs.diameterCm = Number(cm[1]); specs.diameter = value; }
      else if (k === 'height') specs.height = value;
      else if (k === 'capacity') { const l = value.match(/(\d+(?:\.\d+)?)\s*l/i); if (l) specs.capacityL = Number(l[1]); specs.capacity = value; }
      else if (k.startsWith('glass cover') || k === 'lid') specs.lid = value;
      else if (k === 'dimensions') { specs.dimensions = value; const cm = value.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*cm/i); if (cm) specs.diameterCm = Math.max(Number(cm[1]), Number(cm[2])); }
      else if (k.startsWith('weight')) specs.weight = value;
      else if (k === 'size') specs.size = value;
    } else if (/^Titanium .* TM[- ]?\w+/i.test(line) || /\bTM[- ]?\d+\w*\b/.test(line)) {
      const code = line.match(/\bTM[- ]?[\dA-Z]+(?:SET|S|L)?\b/);
      if (code) specs.model = code[0].replace(/\s+/, '-').replace('TM-', 'TM ').replace(/^TM(\d)/, 'TM $1');
      specs.title = line;
    } else if (/^\*/.test(line)) {
      specs.notes = (specs.notes ? specs.notes + ' ' : '') + line.replace(/^\*\s*/, '');
    } else {
      specs.lines.push({ key: '', value: line });
    }
  }
  return specs;
}

function detectFamily(p, categories) {
  const slugs = categories.map((c) => c.slug);
  if (slugs.includes('titanium-gift-sets')) return 'set';
  if (slugs.includes('lids')) return /steamer/i.test(p.name) ? 'steamer-insert' : 'lid';
  if (slugs.includes('household')) return 'household';
  if (slugs.includes('cleaning-products')) return 'cleaning';
  if (slugs.includes('gift-card') || p.type === 'gift-card') return 'gift-card';
  if (slugs.length === 0 && /frying/i.test(p.name)) return 'cookware';
  return slugs.length ? 'cookware' : 'other';
}

function permalinkSlug(permalink) {
  const m = String(permalink || '').match(/\/product\/([^/?#]+)/);
  return m ? m[1] : '';
}

function safeDecode(s) { try { return decodeURIComponent(s); } catch { return s; } }

// ---- Search ----------------------------------------------------------------

export function searchProducts(products, query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = [];
  for (const p of products) {
    const hay = `${p.name} ${p.sku} ${p.modelCode} ${p.categories.map((c) => c.name).join(' ')} ${p.shortDescription}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (p.name.toLowerCase().includes(t)) score += 5;
      else if (hay.includes(t)) score += 2;
      else { score = 0; break; }
    }
    if (score) scored.push([score, p]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, p]) => p);
}

// ---- Merchandising helpers -------------------------------------------------

export function featuredProducts(products, limit = 8) {
  const cookware = products.filter((p) => p.family === 'cookware' || p.family === 'set');
  const byReviews = [...cookware].sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating);
  const picked = [];
  const seen = new Set();
  const pushUnique = (p) => { if (p && !seen.has(p.id) && p.inStock) { seen.add(p.id); picked.push(p); } };
  // Reviewed products first, then one representative size per collection.
  byReviews.filter((p) => p.reviewCount > 0).forEach(pushUnique);
  for (const c of ['titanium-frying-pans', 'titanium-sauce-pans', 'titanium-casserole-pans', 'titanium-roasting-pots', 'titanium-soup-pots', 'titanium-specialty-cookware', 'titanium-gift-sets']) {
    const inCat = cookware.filter((p) => p.categories.some((k) => k.slug === c) || (c === 'titanium-frying-pans' && p.family === 'cookware' && /frying/i.test(p.name)));
    const mid = inCat.sort((a, b) => a.price - b.price)[Math.floor(inCat.length / 2)];
    pushUnique(mid);
    if (picked.length >= limit) break;
  }
  return picked.slice(0, limit);
}

export function relatedProducts(products, product, limit = 4) {
  const cats = new Set(product.categories.map((c) => c.slug));
  const same = products.filter((p) => p.id !== product.id && p.categories.some((c) => cats.has(c.slug)) && p.inStock);
  const out = same.sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price)).slice(0, limit);
  if (out.length < limit) {
    const extra = products.filter((p) => p.id !== product.id && !out.includes(p) && p.family === 'cookware' && p.inStock).slice(0, limit - out.length);
    out.push(...extra);
  }
  return out;
}

// Suggest a matching lid for cookware sold without one.
export function matchingLid(products, product) {
  if (product.family !== 'cookware' || !product.diameterCm) return null;
  return products.find((p) => p.family === 'lid' && /^lid/i.test(p.name) && new RegExp(`\\b${product.diameterCm}\\s*cm`).test(p.shortDescription)) || null;
}

export function priceLabel(p) {
  return { current: p.price, regular: p.regularPrice, onSale: p.onSale && p.regularPrice > p.price, currency: p.currency, minorUnit: p.minorUnit };
}

export function sizeOptions(products, product) {
  // Sibling sizes: same family + same category, e.g. all frying pan diameters.
  if (product.family !== 'cookware') return [];
  const cat = product.categories[0] && product.categories[0].slug;
  const base = product.name.replace(/\d+(?:\.\d+)?\s*(?:″|"|&#8243;|in|inch)?\s*\(?\d*\s*cm\)?.*$/i, '').trim().toLowerCase();
  return products
    .filter((p) => p.family === 'cookware' && ((cat && p.categories.some((c) => c.slug === cat)) || (!cat && /frying/i.test(p.name))) && p.name.toLowerCase().startsWith(base) && p.diameterCm)
    .sort((a, b) => a.diameterCm - b.diameterCm);
}
