// Central configuration for the Titanium Exclusive edge worker.
// Everything that ties the static front-end to the WooCommerce back-end lives here.

export const SITE = {
  name: 'Titanium Exclusive',
  legalName: 'Titanium Exclusive Cookware Inc.',
  tagline: 'The Original Titanium since 1995',
  // Canonical public origin. Used for canonical URLs and structured data.
  canonicalOrigin: 'https://titaniumexclusive.com',
  defaultCurrency: 'CAD',
  currencies: ['CAD', 'USD'],
  locale: 'en-CA',
};

export const WP = {
  // The WooCommerce origin. WordPress keeps titaniumexclusive.com as its site URL,
  // so we always request that host from the origin server.
  originUrl: 'https://titaniumexclusive.com',
  // Once the zone is on Cloudflare and titaniumexclusive.com points at Pages,
  // requests must resolve to the hosting server instead of looping back here.
  // Create a proxied DNS record "origin.titaniumexclusive.com" -> 185.160.66.193
  // and set this to that hostname. Leave null while DNS still points at the host.
  resolveOverride: null,
  // Request paths that are passed straight through to WordPress/WooCommerce.
  // The new front-end owns everything else.
  proxyPrefixes: [
    '/wp-json/',
    '/wp-content/',
    '/wp-includes/',
    '/wp-admin/',
    '/wp-login.php',
    '/wp-cron.php',
    '/xmlrpc.php',
    '/checkout/',
    '/checkout',
    '/my-account/',
    '/my-account',
    '/order-received/',
    '/wc-api/',
    '/feed/',
    '/gift-cards/',
    '/apple-developer-merchantid-domain-association',
    '/.well-known/apple-developer-merchantid-domain-association',
  ],
  // Query-string driven WooCommerce endpoints (AJAX, add-to-cart) on any path.
  proxyQueryKeys: ['wc-ajax', 'add-to-cart', 'wc-api', 'removed_item', 'undo_item', 'key', 'order-pay', 'order-received', 'wmc-currency'],
  currencyCookie: 'wmc_current_currency',
  // Store API cache lifetime at the edge (seconds). Changes made in WooCommerce
  // (prices, stock, new products) appear on the front-end within this window.
  catalogTtl: 300,
  // Product add-on definitions are scraped from the WooCommerce product page.
  addonsTtl: 3600,
};

// Old WordPress URLs that no longer exist on the new front-end.
// Product and product-category URLs are preserved as-is and need no redirect.
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
};

// Cookware categories shown in navigation, in merchandising order.
// Slugs match WooCommerce product_cat slugs, so /product-category/<slug>/ keeps working.
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
