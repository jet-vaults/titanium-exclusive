# titanium-exclusive

Titanium Exclusive storefront — a new front-end for titaniumexclusive.com, rendered at the Cloudflare edge on top of the existing WooCommerce store.

## Status

| | |
|---|---|
| **Domain** | `https://titaniumexclusive.com` (not yet pointed) |
| **Preview** | `https://titanium-exclusive.pages.dev` |
| **Storage mode** | `Standard` (`standard`) |
| **Storage account** | `jetvaults` |
| **Public storage** | `https://jetvaults.blob.core.windows.net/titanium-exclusive/` |
| **Private storage** | `https://jetvaults.blob.core.windows.net/titanium-exclusive-private/` |
| **Activated** | No |

## Nameservers

Set these at the domain registrar when ready to go live (see the go-live checklist first):

```
lia.ns.cloudflare.com
louis.ns.cloudflare.com
```

## How it works

```
Browser ──► Cloudflare Pages (this repo, wwwroot/)
              ├── _worker.js/   edge worker
              │     ├── renders storefront pages from the WooCommerce Store API (5-min cache)
              │     └── proxies /wp-json, /wp-content, /wp-admin, /checkout, /my-account,
              │         ?wc-ajax, ?add-to-cart and every non-GET request to WordPress
              └── assets/       CSS, JS, fonts, images
WordPress + WooCommerce (A2 Hosting, 185.160.66.193) — unchanged; still the CMS and checkout
```

- Products, prices, stock, add-ons (lid / induction), coupons, taxes, shipping, payments, orders and customer accounts stay in WooCommerce. Nothing is hard-coded.
- `/product/<slug>/`, `/product-category/<slug>/`, `/recipes/<slug>/`, `/shop/`, `/cart/`, `/checkout/`, `/my-account/` keep their existing URLs. Renamed pages are 301-redirected (`_worker.js/config.js` → `REDIRECTS`).
- Currency follows the WooCommerce Multi Currency cookie (`wmc_current_currency`, CAD/USD).
- Recipes are read from the Cooked plugin via `/wp-json/wp/v2/cooked_recipe`.

## Layout

```
wwwroot/_worker.js/
  index.js       router: assets → WooCommerce proxy → redirects → pages
  config.js      site, origin, proxy rules, redirects, collections, contact form endpoint
  routes.js      URL → page module
  lib/           html templating, Store API client, proxy, cache, recipes
  ui/            layout shell (header, mega menu, drawers, footer) and components
  pages/         one module per page type
  content/       brand facts, FAQ, collection copy (all sourced from the old site — see docs/)
wwwroot/assets/  css/site.css (design system), js/*.js (no dependencies), fonts/, img/
docs/            content audit, reference notes, redesign plan, photography brief
```

## Local development

```powershell
npm run dev      # wrangler pages dev wwwroot → http://127.0.0.1:8788
```

The worker talks to the live WooCommerce origin, so the local site shows real products and a real (session-cookie) cart. Nothing is written to WooCommerce except normal cart sessions.

## Deploying

Any push to `main` publishes to Cloudflare Pages. While the domain is not pointed, that only updates the `.pages.dev` preview.

## Go-live checklist (apex domain)

1. In Cloudflare DNS for the zone, **recreate the mail records before switching nameservers** — mail is hosted on the same A2 server: `MX titaniumexclusive.com → mail.titaniumexclusive.com` and `A mail → 185.160.66.193` (DNS-only). Copy any SPF/DKIM TXT records from the A2 zone as well.
2. Add a **proxied** `A origin → 185.160.66.193` record and set `WP.resolveOverride = 'origin.titaniumexclusive.com'` in `wwwroot/_worker.js/config.js`. Without this the worker would resolve titaniumexclusive.com to itself after the switch.
3. Point the nameservers at the registrar.
4. Run `activate-site.yml` from `jet-vaults/.github` once the zone is active.
5. Confirm checkout end-to-end on the live domain (the WordPress checkout and account pages still render in the old theme — a minimal WooCommerce theme is a recommended follow-up).
6. Optional: set the contact form endpoint (`CONTACT` in `config.js`). Until then the form opens a prefilled email.

## Photography brief

The site works with the existing library, but these shots would lift it further:

- **Hero:** one wide (3:2, ≥3000 px) close-up of the bare titanium cooking surface with raking light; one 4:5 portrait of a single frying pan on a stone or steel surface.
- **Anatomy:** a pan photographed from directly above and a true side profile on white, plus a macro of the plug-in handle joint and of the 8 mm base edge.
- **Process:** high-resolution versions of the foundry pour, lathe turning and titanium spraying (the current files are 1000–1600 px).
- **Cooking:** steak searing, eggs on a dry surface, vegetables under the glass lid with visible condensation, a soup pot with steamer inserts stacked.
- **Collections:** one consistent hero image per collection, same angle, same background (the current category images mix styles).
- **People:** the Toronto team / warehouse (placeholder on *Our Story*), and a live trade-show demonstration.
- **Product pages:** every product currently with a single image needs at least three (front, above, detail).
