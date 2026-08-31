// Document shell: <head>, header with mega menu, mobile navigation, search
// overlay, cart drawer and footer. Every page renders through `page()`.

import { html, raw, jsonLd, truncate } from '../lib/html.js';
import { SITE, PRIMARY_COLLECTIONS } from '../config.js';
import { BRAND, NAV, FOOTER_LINKS } from '../content/brand.js';
import { getCategories, getAllProducts, featuredProducts } from '../lib/store.js';
import { ICON, button } from './components.js';

const ASSET_VERSION = '1';

export async function shellData(c) {
  const [categories, products] = await Promise.all([getCategories(c.ctx), getAllProducts(c.ctx, c.currency)]);
  return { categories, products, featured: featuredProducts(products.filter((p) => p.family === 'cookware'), 3) };
}

export function page(c, {
  title,
  description = '',
  body,
  bodyClass = '',
  canonicalPath = c.path,
  ogImage = '/assets/img/og-default.jpg',
  ogType = 'website',
  ld = [],
  head = '',
  scripts = [],
  noindex = false,
  shell,
  status = 200,
  headerTheme = 'light',
}) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const canonical = SITE.canonicalOrigin + canonicalPath;
  const ogImg = ogImage.startsWith('http') ? ogImage : SITE.canonicalOrigin + ogImage;
  const doc = html`<!doctype html>
<html lang="en" class="no-js" data-currency="${c.currency}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${truncate(description, 300)}">
<link rel="canonical" href="${canonical}">
${noindex ? raw('<meta name="robots" content="noindex,follow">') : ''}
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${truncate(description, 300)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f5f2ec">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/newsreader-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_VERSION}">
${raw(head)}
${ld.map((o) => jsonLd(o))}
</head>
<body class="${bodyClass}" data-header-theme="${headerTheme}">
<a class="skip-link" href="#main">Skip to content</a>
${header(c, shell)}
<main id="main" tabindex="-1">${body}</main>
${footer(c)}
${cartDrawer()}
${searchOverlay(shell)}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script type="module" src="/assets/js/app.js?v=${ASSET_VERSION}"></script>
${scripts.map((s) => html`<script type="module" src="${s}?v=${ASSET_VERSION}"></script>`)}
</body>
</html>`;
  return new Response(doc.toString(), {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'private, no-cache',
      'vary': 'Cookie',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
    },
  });
}

// ---- Header ------------------------------------------------------------------

function header(c, shell) {
  const cats = shell ? shell.categories : [];
  const featured = shell ? shell.featured : [];
  return html`
<header class="site-header" id="site-header" data-header>
  <div class="site-header__bar container-wide">
    <button class="icon-btn site-header__menu" type="button" data-menu-open aria-controls="mobile-nav" aria-expanded="false" aria-label="Open menu">${raw(ICON.menu)}</button>
    <a class="site-header__brand" href="/" aria-label="${SITE.name} home">
      ${logo()}
    </a>
    <nav class="site-nav" aria-label="Primary">
      <ul class="site-nav__list">
        ${NAV.map((item) => item.mega
          ? html`<li class="site-nav__item site-nav__item--mega" data-mega-item>
              <a class="site-nav__link" href="${item.href}" aria-haspopup="true" aria-expanded="false" data-mega-trigger>${item.label}${raw(ICON.chevron)}</a>
              ${megaMenu(cats, featured)}
            </li>`
          : html`<li class="site-nav__item"><a class="site-nav__link ${c.path.startsWith(item.href.split('#')[0]) && item.href !== '/shop/#collections' ? 'is-current' : ''}" href="${item.href}">${item.label}</a></li>`)}
      </ul>
    </nav>
    <div class="site-header__actions">
      <button class="icon-btn" type="button" data-search-open aria-label="Search">${raw(ICON.search)}<span class="icon-btn__label">Search</span></button>
      <button class="icon-btn cart-btn" type="button" data-cart-open aria-label="Open cart" aria-controls="cart-drawer">${raw(ICON.bag)}<span class="cart-btn__count" data-cart-count hidden>0</span></button>
    </div>
  </div>
  ${mobileNav(cats)}
</header>`;
}

function logo() {
  return html`<span class="wordmark"><span class="wordmark__main">Titanium</span><span class="wordmark__sub">Exclusive</span></span>`;
}

function megaMenu(cats, featured) {
  const primary = PRIMARY_COLLECTIONS.map((k) => cats.find((c) => c.slug === k.slug) || { slug: k.slug, name: k.name, count: 0, image: null });
  const others = cats.filter((c) => !PRIMARY_COLLECTIONS.some((k) => k.slug === c.slug));
  const spotlight = featured[0];
  return html`
  <div class="mega" data-mega>
    <div class="container-wide mega__grid">
      <div class="mega__col mega__col--cats">
        <p class="mega__heading">Cookware</p>
        <ul class="mega__list">
          ${primary.map((cat) => html`<li><a class="mega__cat" href="/product-category/${cat.slug}/">
            <span class="mega__thumb">${cat.image ? html`<img src="${cat.image}" alt="" loading="lazy" width="96" height="96">` : ''}</span>
            <span class="mega__cat-text"><span class="mega__cat-name">${cat.name}</span><span class="mega__cat-count">${cat.count} pieces</span></span>
          </a></li>`)}
        </ul>
      </div>
      <div class="mega__col mega__col--more">
        <p class="mega__heading">More</p>
        <ul class="mega__links">
          ${others.map((cat) => html`<li><a href="/product-category/${cat.slug}/">${cat.name}</a></li>`)}
          <li><a href="/shop/">All products</a></li>
          <li><a href="/why-titanium/">Why titanium?</a></li>
        </ul>
        <p class="mega__note">${BRAND.origin}. ${BRAND.warranty}.</p>
      </div>
      <div class="mega__col mega__col--spot">
        ${spotlight ? html`
          <a class="mega__spot" href="${spotlight.permalink}">
            <span class="mega__spot-media"><img src="${spotlight.images[0] ? spotlight.images[0].src : ''}" alt="" loading="lazy" width="400" height="400"></span>
            <span class="mega__spot-body">
              <span class="eyebrow">Most reviewed</span>
              <span class="mega__spot-title">${spotlight.name}</span>
              <span class="link-arrow link-arrow--sm"><span>View</span>${raw(ICON.arrow)}</span>
            </span>
          </a>` : ''}
      </div>
    </div>
  </div>`;
}

function mobileNav(cats) {
  const primary = PRIMARY_COLLECTIONS.map((k) => cats.find((c) => c.slug === k.slug) || { slug: k.slug, name: k.name, count: 0 });
  const others = cats.filter((c) => !PRIMARY_COLLECTIONS.some((k) => k.slug === c.slug));
  return html`
  <div class="mobile-nav" id="mobile-nav" data-mobile-nav aria-hidden="true">
    <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="mobile-nav__top">
        <span class="wordmark wordmark--sm"><span class="wordmark__main">Titanium</span><span class="wordmark__sub">Exclusive</span></span>
        <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">${raw(ICON.close)}</button>
      </div>
      <button class="mobile-nav__search" type="button" data-search-open>${raw(ICON.search)}<span>Search cookware, recipes, help</span></button>
      <nav class="mobile-nav__nav" aria-label="Mobile">
        <details class="mobile-nav__group" open>
          <summary class="mobile-nav__link">Shop ${raw(ICON.chevron)}</summary>
          <ul class="mobile-nav__sub">
            <li><a href="/shop/">All cookware</a></li>
            ${primary.map((cat) => html`<li><a href="/product-category/${cat.slug}/">${cat.name}</a></li>`)}
            ${others.map((cat) => html`<li><a href="/product-category/${cat.slug}/">${cat.name}</a></li>`)}
          </ul>
        </details>
        ${NAV.filter((n) => !n.mega).map((n) => html`<a class="mobile-nav__link" href="${n.href}">${n.label}</a>`)}
      </nav>
      <div class="mobile-nav__foot">
        <button type="button" data-cart-open>${raw(ICON.bag)} Cart</button>
        <a href="/support/">Support</a>
      </div>
    </div>
    <button class="mobile-nav__backdrop" type="button" tabindex="-1" data-menu-close aria-label="Close menu"></button>
  </div>`;
}

// ---- Cart drawer & search -----------------------------------------------------

function cartDrawer() {
  return html`
  <aside class="drawer" id="cart-drawer" data-cart-drawer aria-hidden="true">
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <header class="drawer__head">
        <h2 class="drawer__title" id="cart-title">Your cart <span class="drawer__count" data-cart-count-label></span></h2>
        <button class="icon-btn" type="button" data-cart-close aria-label="Close cart">${raw(ICON.close)}</button>
      </header>
      <div class="drawer__body" data-cart-body>
        <div class="cart-empty" data-cart-empty>
          <p class="cart-empty__title">Your cart is empty.</p>
          <p class="cart-empty__text">Cookware hand-cast in Germany, built to outlast the kitchen it lives in.</p>
          ${button({ href: '/shop/', label: 'Shop cookware', variant: 'secondary', attrs: 'data-cart-close' })}
        </div>
        <ul class="cart-lines" data-cart-lines hidden></ul>
        <div class="cart-suggest" data-cart-suggest hidden></div>
      </div>
      <footer class="drawer__foot" data-cart-foot hidden>
        <div class="cart-totals">
          <div class="cart-totals__row"><span>Subtotal</span><strong data-cart-subtotal></strong></div>
          <p class="cart-totals__note">Shipping and taxes are calculated at checkout.</p>
        </div>
        ${button({ href: '/checkout/', label: 'Checkout', variant: 'primary', size: 'block', attrs: 'data-checkout' })}
        <a class="cart-totals__link" href="/cart/">View full cart</a>
      </footer>
    </div>
    <button class="drawer__backdrop" type="button" tabindex="-1" data-cart-close aria-label="Close cart"></button>
  </aside>`;
}

function searchOverlay(shell) {
  const cats = shell ? shell.categories.slice(0, 6) : [];
  return html`
  <div class="search" id="search" data-search aria-hidden="true">
    <div class="search__panel" role="dialog" aria-modal="true" aria-label="Search">
      <form class="search__form" action="/search" method="get" role="search" data-search-form>
        ${raw(ICON.search)}
        <input class="search__input" type="search" name="q" placeholder="Search cookware, recipes, help…" autocomplete="off" aria-label="Search" data-search-input>
        <button class="icon-btn" type="button" data-search-close aria-label="Close search">${raw(ICON.close)}</button>
      </form>
      <div class="search__results" data-search-results>
        <div class="search__default">
          <p class="eyebrow">Collections</p>
          <ul class="search__chips">${cats.map((c) => html`<li><a href="/product-category/${c.slug}/">${c.name}</a></li>`)}</ul>
          <p class="eyebrow">Popular</p>
          <ul class="search__chips">
            <li><a href="/support/warranty/">Warranty</a></li>
            <li><a href="/support/care/">Cleaning & care</a></li>
            <li><a href="/why-titanium/">Why titanium</a></li>
            <li><a href="/recipes/">Recipes</a></li>
          </ul>
        </div>
      </div>
    </div>
    <button class="search__backdrop" type="button" tabindex="-1" data-search-close aria-label="Close search"></button>
  </div>`;
}

// ---- Footer -----------------------------------------------------------------

function footer(c) {
  const year = new Date().getFullYear();
  return html`
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <span class="wordmark wordmark--lg"><span class="wordmark__main">Titanium</span><span class="wordmark__sub">Exclusive</span></span>
      <p class="site-footer__tag">${SITE.tagline}. ${BRAND.origin}, sold across ${BRAND.region}, and backed by a ${BRAND.warrantyYears}-year warranty.</p>
      <div class="currency" data-currency-switch>
        <span class="currency__label">Currency</span>
        ${SITE.currencies.map((cur) => html`<button type="button" class="currency__opt ${cur === c.currency ? 'is-active' : ''}" data-currency="${cur}" aria-pressed="${cur === c.currency}">${cur}</button>`)}
      </div>
    </div>
    ${Object.entries(FOOTER_LINKS).map(([group, links]) => html`
      <nav class="site-footer__col" aria-label="${group}">
        <p class="site-footer__heading">${group}</p>
        <ul>${links.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
      </nav>`)}
  </div>
  <div class="container site-footer__legal">
    <p>© ${year} ${BRAND.legalName}. All rights reserved.</p>
    <ul>
      <li><a href="/support/shipping/">Shipping & returns</a></li>
      <li><a href="/support/warranty/">Warranty</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul>
  </div>
</footer>`;
}
