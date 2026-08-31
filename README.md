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

The site is **standalone**. Nothing on it talks to the previous WordPress/WooCommerce website.

```
Browser ──► Cloudflare Pages (this repo, wwwroot/)
              ├── _worker.js/      edge worker: renders every page from data/catalog.js
              │     └── data/catalog.js   products, prices, add-ons, categories, reviews, recipes, legal pages
              ├── media/           all product, brand, recipe images and video thumbnails (local copies)
              └── assets/          CSS, JS, fonts, icons
```

- **Catalog** — `wwwroot/_worker.js/data/catalog.js` is a snapshot of the old store taken on 2026-08-30 (70 products, 44 with lid/induction options, 13 categories, 8 reviews, 7 recipes). Edit it to change prices, stock, copy or images; changes publish on the next push.
- **Cart** — kept in the shopper's browser (`localStorage`), with a drawer on every page and a full `/cart/` page. Prices are re-checked against the catalog when the drawer opens.
- **Checkout** — `/checkout/` is a placeholder that shows the order and asks the shopper to call or email. When a commerce back-end is ready, set `CHECKOUT.url` in `_worker.js/config.js` and the Checkout button hands the cart over.
- **Currency** — CAD/USD switch stored in the `te_currency` cookie. Both show the same figures, as the old store did.
- **URLs** — `/product/<slug>/`, `/product-category/<slug>/`, `/recipes/<slug>/`, `/shop/`, `/cart/` are unchanged from the old site; renamed pages 301-redirect (`REDIRECTS` in `config.js`).
- **Videos** — YouTube embeds load only when a visitor clicks play (thumbnails are local).

## Layout

```
wwwroot/_worker.js/
  index.js       router: static files → redirects → pages
  config.js      site, redirects, collections, contact form endpoint, checkout URL
  routes.js      URL → page module
  data/          catalog.js (the product data)
  lib/           html templating, catalog access, recipes, currency
  ui/            layout shell (header, mega menu, drawers, footer) and components
  pages/         one module per page type
  content/       brand facts, FAQ, collection copy (all sourced from the old site — see docs/)
wwwroot/assets/  css/site.css (design system), js/*.js (no dependencies), fonts/, img/
wwwroot/media/   images (≈10 MB)
docs/            content audit, reference notes, redesign plan, photography brief
```

## Local development

```powershell
npm run dev      # wrangler pages dev wwwroot → http://127.0.0.1:8788
```

## Deploying

Any push to `main` publishes to Cloudflare Pages. While the domain is not pointed, that only updates the `.pages.dev` preview.

## Go-live checklist (apex domain)

1. **Email first.** Mail for titaniumexclusive.com is hosted on the old A2 server. Before switching nameservers, recreate in the Cloudflare zone: `MX titaniumexclusive.com → mail.titaniumexclusive.com` and `A mail → 185.160.66.193` (DNS-only), plus any SPF/DKIM TXT records — or move email to a new provider.
2. Point the nameservers at the registrar (`lia.ns.cloudflare.com`, `louis.ns.cloudflare.com`).
3. Run `activate-site.yml` from `jet-vaults/.github` once the zone is active.
4. Connect checkout (`CHECKOUT.url`) and the contact form endpoint (`CONTACT`) in `config.js` when ready.

## Photography brief

The site works with the existing library, but these shots would lift it further:

- **Hero:** one wide (3:2, ≥3000 px) close-up of the bare titanium cooking surface with raking light; one 4:5 portrait of a single frying pan on a stone or steel surface.
- **Anatomy:** a pan photographed from directly above and a true side profile on white, plus a macro of the plug-in handle joint and of the 8 mm base edge.
- **Process:** high-resolution versions of the foundry pour, lathe turning and titanium spraying (the current files are 1000–1600 px).
- **Cooking:** steak searing, eggs on a dry surface, vegetables under the glass lid with visible condensation, a soup pot with steamer inserts stacked.
- **Collections:** one consistent hero image per collection, same angle, same background (the current category images mix styles).
- **People:** the Toronto team / warehouse (placeholder on *Our Story*), and a live trade-show demonstration.
- **Product pages:** every product currently with a single image needs at least three (front, above, detail).
