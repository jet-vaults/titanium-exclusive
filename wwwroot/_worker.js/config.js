// Central configuration for the Titanium Exclusive edge worker.
// The site is fully standalone: catalog, reviews, recipes and media live in this repository
// (see data/catalog.js and wwwroot/media/). No request ever reaches the previous website.

export const SITE = {
  name: 'Titanium Exclusive',
  legalName: 'Titanium Exclusive Cookware Inc.',
  tagline: 'The Original Titanium since 1995',
  // Canonical public origin. Used for canonical URLs and structured data.
  canonicalOrigin: 'https://titaniumexclusive.com',
  defaultCurrency: 'CAD',
  currencies: ['CAD', 'USD'],
  locale: 'en-CA',
  // Shopper's currency choice is remembered in this cookie.
  currencyCookie: 'te_currency',
};

// Old WordPress URLs that no longer exist on the new site.
// Product, product-category and recipe URLs are preserved as-is and need no redirect.
export const REDIRECTS = {
  '/company/': '/our-story/',
  '/about-us/': '/our-story/',
  '/about/': '/our-story/',
  '/awards-and-recognition/': '/our-story/#recognition',
  '/product-features/': '/why-titanium/',
  '/cleaning-instructions/': '/support/care/',
  '/warranty/': '/support/warranty/',
  '/contact-us/': '/contact/',
  '/faq/': '/support/faq/',
  '/faqs/': '/support/faq/',
  '/videos/': '/support/videos/',
  '/on-sale/': '/shop/?sale=1',
  '/recipe-archive/': '/recipes/',
  '/recipe/': '/recipes/',
  '/hello-world/': '/',
  '/category/uncategorized/': '/',
  '/author/mishkat/': '/',
  '/lids.html': '/product-category/lids/',
  '/product/default_gift_this_product/': '/product/titanium-gift-card/',
  '/my-account/': '/contact/',
};

// Cookware categories shown in navigation, in merchandising order.
// Slugs match the old product_cat slugs, so /product-category/<slug>/ keeps working.
export const COLLECTIONS = [
  { slug: 'titanium-frying-pans', name: 'Frying Pans', short: 'Frying Pans' },
  { slug: 'titanium-sauce-pans', name: 'Sauce Pans', short: 'Sauce Pans' },
  { slug: 'titanium-casserole-pans', name: 'Casserole Pans', short: 'Casseroles' },
  { slug: 'titanium-roasting-pots', name: 'Roasting Pots', short: 'Roasting Pots' },
  { slug: 'titanium-soup-pots', name: 'Soup Pots', short: 'Soup Pots' },
  { slug: 'titanium-large-roasting-pans', name: 'Large Roasting Pans', short: 'Roasters' },
  { slug: 'titanium-specialty-cookware', name: 'Specialty Cookware', short: 'Specialty' },
  { slug: 'steamers', name: 'Steamers', short: 'Steamers' },
  { slug: 'titanium-gift-sets', name: 'Gift Sets', short: 'Sets' },
  { slug: 'lids', name: 'Lids & Steamer Inserts', short: 'Lids' },
  { slug: 'cleaning-products', name: 'Cleaning', short: 'Cleaning' },
  { slug: 'gift-card', name: 'Gift Cards', short: 'Gift Cards' },
  { slug: 'household', name: 'Household', short: 'Household' },
];

export const PRIMARY_COLLECTIONS = COLLECTIONS.slice(0, 9);

// Contact form delivery. Leave endpoint empty to fall back to a prefilled mailto: link.
// Web3Forms example: endpoint 'https://api.web3forms.com/submit' + accessKey '<key>'.
export const CONTACT = {
  endpoint: '',
  accessKey: '',
};

// Checkout is not connected yet. When a commerce back-end is ready, point this at it and the
// cart's Checkout button will hand the order over. Until then /checkout/ shows a clear notice.
export const CHECKOUT = {
  url: '',
};
