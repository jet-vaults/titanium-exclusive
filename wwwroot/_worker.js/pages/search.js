import { html, money, truncate } from '../lib/html.js';
import { page, shellData } from '../ui/layout.js';
import { productCard, breadcrumbs, recipeCard, textLink } from '../ui/components.js';
import { getAllProducts, searchProducts, matchingLid, getCategories, cartLineData } from '../lib/store.js';
import { getRecipes } from '../lib/recipes.js';
import { FAQ } from '../content/faq.js';

const PAGES = [
  { name: 'Why Titanium', url: '/why-titanium/', keywords: 'why titanium construction base surface heat induction oven durability engineering compare comparison' },
  { name: 'Our Story', url: '/our-story/', keywords: 'about company history since 1995 germany german made toronto trademark awards recognition' },
  { name: 'Warranty', url: '/support/warranty/', keywords: 'warranty guarantee claim 20 years defect replace return' },
  { name: 'Cleaning & care', url: '/support/care/', keywords: 'clean cleaning care wash dishwasher sticky sticking scotch brite scrub season seasoning spray' },
  { name: 'Cooking instructions', url: '/support/instructions/', keywords: 'how to cook use heat oil water vapour vapor oven stovetop induction instructions' },
  { name: 'Shipping & returns', url: '/support/shipping/', keywords: 'shipping ship delivery returns refund canada usa united states currency cad usd payment' },
  { name: 'Help & FAQ', url: '/support/faq/', keywords: 'faq question help ' + FAQ.map((f) => f.q).join(' ') },
  { name: 'Videos', url: '/support/videos/', keywords: 'video videos youtube factory film made chef episode' },
  { name: 'Contact', url: '/contact/', keywords: 'contact phone email address call toronto' },
  { name: 'Gift cards', url: '/product-category/gift-card/', keywords: 'gift card voucher' },
];

async function runSearch(c, q) {
  const [products, categories, recipes] = await Promise.all([getAllProducts(c.ctx, c.currency), getCategories(c.ctx), getRecipes(c.ctx).catch(() => [])]);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const matchAll = (hay) => terms.every((t) => hay.includes(t));
  return {
    products: searchProducts(products, q, 12),
    categories: categories.filter((k) => matchAll(`${k.name} ${k.slug}`.toLowerCase())).slice(0, 4),
    recipes: recipes.filter((r) => matchAll(`${r.title} ${r.category} ${r.ingredients.map((i) => i.name).join(' ')}`.toLowerCase())).slice(0, 4),
    pages: PAGES.filter((p) => matchAll(`${p.name} ${p.keywords}`.toLowerCase()) || terms.some((t) => t.length > 3 && p.keywords.toLowerCase().includes(t))).slice(0, 4),
  };
}

export async function searchApi(c) {
  const q = (c.url.searchParams.get('q') || '').trim().slice(0, 80);
  if (q.length < 2) return json({ products: [], categories: [], recipes: [], pages: [] });
  const r = await runSearch(c, q);
  return json({
    products: r.products.slice(0, 6).map((p) => ({ id: p.id, name: p.name, url: p.permalink, image: p.images[0] ? p.images[0].thumb : '', price: p.type === 'gift-card' ? 'Any amount' : money(p.price, p.currency, p.minorUnit), meta: p.specs.diameter ? p.specs.diameter.replace(/\s*\(.*$/, '') : '' })),
    categories: r.categories.map((k) => ({ name: k.name, url: `/product-category/${k.slug}/` })),
    recipes: r.recipes.map((x) => ({ name: x.title, url: `/recipes/${x.slug}/` })),
    pages: r.pages.map((p) => ({ name: p.name, url: p.url })),
  });
}

// Complementary item for the cart drawer: the matching lid for a pan sold without one.
export async function suggestApi(c) {
  const ids = (c.url.searchParams.get('ids') || '').split(',').map(Number).filter(Boolean);
  const products = await getAllProducts(c.ctx, c.currency);
  const inCart = new Set(ids);
  for (const id of ids) {
    const p = products.find((x) => x.id === id);
    if (!p || p.family !== 'cookware' || p.lidIncluded || /with lid/i.test(p.name)) continue;
    const lid = matchingLid(products, p);
    if (lid && !inCart.has(lid.id) && lid.inStock) {
      return json({ title: `Fits your ${p.diameterCm} cm pan`, product: { id: lid.id, name: lid.name, image: lid.images[0] ? lid.images[0].thumb : '', price: money(lid.price, lid.currency, lid.minorUnit), url: lid.permalink } });
    }
  }
  // Otherwise suggest the cleaning pad once — it is what we recommend for every wash.
  const pad = products.find((x) => x.slug === 'titanium-cleaner-no-warranty');
  if (pad && !inCart.has(pad.id) && pad.inStock && ids.length) return json({ title: 'Recommended for every wash', product: { id: pad.id, name: pad.name.replace(/\s*\(no warranty\)/i, ''), image: pad.images[0] ? pad.images[0].thumb : '', price: money(pad.price, pad.currency, pad.minorUnit), url: pad.permalink } });
  return json({});
}

// Product data for the client-side cart (quick add, revalidation).
export async function productApi(c) {
  const id = Number(c.url.searchParams.get('id'));
  const products = await getAllProducts(c.ctx, c.currency);
  const p = products.find((x) => x.id === id);
  if (!p) return json({});
  return json(cartLineData(p));
}

function json(data) {
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, max-age=60', 'vary': 'Cookie' } });
}

export async function renderSearchPage(c) {
  const shell = await shellData(c);
  const q = (c.url.searchParams.get('q') || '').trim().slice(0, 80);
  const r = q.length >= 2 ? await runSearch(c, q) : { products: [], categories: [], recipes: [], pages: [] };
  const total = r.products.length + r.categories.length + r.recipes.length + r.pages.length;
  return page(c, {
    shell,
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search Titanium Exclusive cookware, recipes and help.',
    noindex: true,
    canonicalPath: '/search',
    bodyClass: 'page-search',
    body: html`
      <section class="container page-hero">
        ${breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Search', href: '/search' }])}
        <form action="/search" method="get" role="search" style="max-width:40rem">
          <label class="sr-only" for="q">Search</label>
          <input class="input" id="q" name="q" type="search" value="${q}" placeholder="Search cookware, recipes, help…" style="font-family:var(--font-display);font-size:var(--text-xl);min-height:4rem">
        </form>
        ${q ? html`<p class="muted">${total} result${total === 1 ? '' : 's'} for “${q}”</p>` : ''}
      </section>
      <div class="container" style="padding-bottom:var(--section);display:grid;gap:var(--space-8)">
        ${r.products.length ? html`<section><p class="eyebrow">Cookware</p><div class="grid grid--4 grid--products" data-stagger>${r.products.map((p) => productCard(p))}</div></section>` : ''}
        ${r.categories.length ? html`<section><p class="eyebrow">Collections</p><ul class="search__chips">${r.categories.map((k) => html`<li><a href="/product-category/${k.slug}/">${k.name}</a></li>`)}</ul></section>` : ''}
        ${r.recipes.length ? html`<section><p class="eyebrow">Recipes</p><div class="grid grid--4" data-stagger>${r.recipes.map((x) => recipeCard(x))}</div></section>` : ''}
        ${r.pages.length ? html`<section><p class="eyebrow">Help & information</p><ul class="search__links" style="max-width:32rem">${r.pages.map((p) => html`<li><a href="${p.url}">${p.name}</a></li>`)}</ul></section>` : ''}
        ${q && !total ? html`<p class="lead">Nothing matched. Try a size (28 cm), a type (frying pan) or a topic (warranty), or ${textLink('/shop/', 'browse all cookware')}.</p>` : ''}
      </div>`,
  });
}
