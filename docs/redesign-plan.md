# Titanium Exclusive — Redesign Assessment & Plan

Prepared 2026-08-30. Sources: `docs/audit-content.md` (full content audit, every fact cited), `docs/reference-okura.md` (UX reference principles), live WooCommerce Store API.

---

## 1. What is currently wrong

1. **Stock template, not a brand.** Woodmart + WPBakery, grey `#4B4B4B` buttons, Khula everywhere, duplicated blocks, a pink currency switcher, permanent "BIGGEST SALE YET" bar. Nothing signals German-made $300–$1,600 cookware.
2. **Three company names.** Titanium Gourmet Inc. (footer/site name), Titanium Exclusive Cookware Inc. (logo, warranty, trademarks), Titanium Cookware Inc. (YouTube, legacy domain that still hosts some images).
3. **The story is asserted, never told.** "The Original Titanium since 1995" sits on a banner with no history, no founder, no factory narrative — despite real raw material: 1999–2001 CA/US trademark registrations, CGTA member since 2000, 25 years of trade-show history, foundry footage, customers with 20-year-old pans.
4. **Contradictory specs.** Dishwasher-safe (2025 block) vs "not recommended" (care + warranty pages); 500°F (features page) vs 450°F (gift sets); "works on all stovetops, even induction" vs induction sold as a paid option; TÜV GS marks dated 2013–2018.
5. **No trust architecture.** No FAQ, shipping policy, returns policy, hours, or testimonials section; 7 genuine 5★ reviews buried on product pages.
6. **Catalog is hard to browse.** 13 flat categories, lids sold separately plus a paid lid add-on, steamers filed under Lids, six frying pans with no category in the API, household items (bamboo sheets, throw blankets) diluting the range.
7. **Thin content.** 7 recipes from one week in 2022 with no times, categories, intros or pan recommendations; awards page is 16 unlabelled images (none are product awards); all 163 media items have empty alt text.
8. **SEO hygiene.** "Hello world!" indexed, agency author archive indexed, hidden helper product in the sitemap, `Crawl-Delay: 20`, USD prices identical to CAD numbers.

## 2. What must be preserved

- **All WooCommerce operations, untouched:** 71 products, prices, sale prices, stock, the 3 variable products, gift cards, Product Add-Ons (lid +$44.99 / induction), coupons, taxes, flat-rate shipping, Stripe + Authorize.net checkout, orders, customer accounts, Mailchimp, multi-currency (CAD/USD). WordPress admin stays the CMS.
- **URLs:** `/product/<slug>/`, `/product-category/<slug>/`, `/recipes/<slug>/`, `/shop/`, `/cart/`, `/checkout/`, `/my-account/` are kept byte-for-byte. Changed pages get 301s (`/company/`→`/our-story/`, `/product-features/`→`/why-titanium/`, `/cleaning-instructions/`→`/support/care/`, `/warranty/`→`/support/warranty/`, `/awards-and-recognition/`→`/our-story/#recognition`, `/on-sale/`→`/shop/?sale=1`, `/recipe-archive/`→`/recipes/`).
- **Verified claims only:** hand-cast in a German foundry from cast aluminium alloy; 8 mm thermobasic base; patented titanium non-stick surface; screw-less/rivet-less handle with TÜV Rheinland safety label; borosilicate glass lids; handles/lids/knobs oven-proof to 260°C/500°F; cast aluminium conducts heat ~7× faster than iron/steel; little or no oil or water; no seasoning; LGA Bavaria food-contact test; 20-year warranty (5 years no-charge, then 1/20 of retail × years, lids excluded); induction available as an option; hand-wash with a green Scotch-Brite pad.
- **Media:** foundry photos (molten pour, plasma-spray sparks, lathe), bare-pan texture, machined base with "Made in Germany" stamp, all product photography, 5 YouTube videos, T-shield mark.
- **Contact:** 1 (888) 834-0632, (416) 292-8151, sales@titaniumexclusive.com, 290 Nantucket Blvd, Toronto ON M1P 2P4, Instagram, YouTube.

## 3. New sitemap

```
/                         Home (storytelling journey)
/shop/                    All cookware — filters, sort, search
/product-category/<slug>/ Collection pages (13, existing slugs)
/product/<slug>/          Product pages (71, existing slugs)
/cart/                    Full cart (Store API)  ·  drawer on every page
/checkout/ /my-account/   WooCommerce (proxied, unchanged)
/search?q=                Search results (products, collections, recipes, help)
/why-titanium/            Educational landing page (construction, performance, care, compatibility)
/our-story/               Brand story: 1995 → today, Germany, trade-show heritage, recognition
/recipes/  /recipes/<slug>/ Inspiration hub + 7 recipes (Cooked plugin data via REST)
/support/                 Hub → /faq/ /warranty/ /care/ /instructions/ /shipping/ /videos/
/contact/                 Contact page + form
/privacy-policy/ /secure-shopping/  WordPress page content, new design
/sitemap.xml /robots.txt
```

## 4. Homepage sequence

1. **Hero** — editorial split: 7-word serif headline, two CTAs (Shop Cookware / Discover Titanium Exclusive), bare-pan texture photo with slow parallax and a small inset of the molten pour.
2. **Proof strip** — Since 1995 · Hand-cast in Germany · 20-year warranty · 500°F oven-safe · Canada & US.
3. **Collections** — large editorial cards (frying, sauce, casserole, roasting pots, soup pots, roasters, specialty, steamers, sets).
4. **Anatomy of the pan** (dark chapter) — hotspot diagram: 8 mm base, titanium surface, plug-in handle, borosilicate lid, pouring rim; cards/accordion on mobile.
5. **Most wanted** — live product grid (reviewed products first, then one representative size per collection).
6. **How it is made** — sticky scroll story: cast → turned on the lathe → titanium-coated → assembled → tested; foundry imagery + "How Titanium Cookware is made" video.
7. **Compared** — Titanium Exclusive vs ordinary non-stick vs stainless vs cast iron, rows limited to documented properties.
8. **Owners** — 7 genuine reviews in a drag/snap carousel, "20+ years" theme surfaced.
9. **In the kitchen** — video facade grid (brand film + 3 cooking episodes).
10. **Recipes** — 3 cards → hub.
11. **FAQ** — 8 questions from real policies (with FAQ schema).
12. **Final chapter** — full-bleed sparks image, "Explore the collection".

## 5. Design direction

Light, precise, editorial. Ivory paper ground with charcoal "engineering" chapters (the reference site is dark and warm; we deliberately go the other way). Sharp geometry (2 px radii, hairline rules), metallic titanium greys for structure, photography does the warmth. No urgency devices, no badges beyond "Save x%" and "Sold out", one upsell in the cart (the matching lid).

## 6. Typography

- **Newsreader** (variable, optical sizes 6–72; 300–600, italic) — headlines, proof numerals, pull quotes. Echoes the condensed serif caps of the original logo without copying it.
- **Archivo** (variable width/weight) — navigation, product data, buttons, tables, forms. Tabular numerals for prices and spec sheets.
- Scale: fluid `clamp()` from 15 px body to 88 px display; one H2 size site-wide; uppercase Archivo eyebrows at 11–12 px with 0.14 em tracking.

## 7. Colour

| Token | Value | Use |
|---|---|---|
| paper | `#F4F1EA` | page ground |
| ivory | `#FBF9F4` | cards, inputs |
| ink | `#161719` | text, dark chapters |
| graphite | `#2B2D31` | dark surfaces |
| titanium | `#8E939A` / `#C6CACF` / `#5D6269` | rules, secondary text, metal accents |
| bronze | `#8F6A33` | the single accent: eyebrows, focus, active states, sale price |

## 8. Animation strategy

CSS-first, `transform`/`opacity` only, 200–700 ms, `cubic-bezier(.2,.7,.2,1)`. IntersectionObserver reveals (once), staged hero entrance, image scale on hover (1.04), button label/arrow shift, drawer/menu slides (320 ms), accordion height animation, sticky-scroll step activation for the "how it is made" chapter, native scroll-snap carousels with drag. Everything disabled under `prefers-reduced-motion`. No libraries.

## 9. Component architecture

```
wwwroot/_worker.js/
  index.js            router: assets → WooCommerce proxy → redirects → pages
  config.js           site, origin, proxy prefixes, redirects, collections
  routes.js
  lib/  html.js (template tag, escaping, money)  proxy.js  store.js (Store API, add-ons, search, merchandising)  cache.js
  ui/   layout.js (head, header + mega menu, mobile nav, cart drawer, search, footer)  components.js (buttons, cards, price, stars, accordion, crumbs…)
  pages/ home shop product cart search story why recipes support contact wp-page error sitemap
  content/ brand.js faq.js why.js story.js support.js (verified copy only)
wwwroot/assets/
  css/site.css        tokens → base → components → layout → page sections
  js/  app.js (boot) nav.js cart.js search.js motion.js product.js gallery.js filters.js forms.js
  fonts/ img/
```

## 10. Technical implementation (revised 2026-08-30 — standalone)

> Revision: the client asked for **no contact with the previous website**. The WooCommerce proxy and Store API integration were removed; the catalog, add-ons, reviews, recipes and media were snapshotted into this repo, the cart is browser-side, and `/checkout/` is a placeholder until a new commerce back-end is connected. The original plan below is kept for the record.

## 10a. Original technical plan

- **Hosting:** Cloudflare Pages (JetVaults) serves `wwwroot/`. A Pages edge worker (`_worker.js/`) renders storefront pages server-side from the live WooCommerce Store API (5-minute edge cache), so products are never hard-coded and stay managed in WooCommerce.
- **Commerce continuity:** the same worker reverse-proxies `/wp-json/*`, `/wp-content/*`, `/wp-admin/*`, `/checkout/`, `/my-account/`, `?wc-ajax`, `?add-to-cart` to the WordPress origin. Cookies, nonces, sessions, payments, Mailchimp and admin keep working; the browser only ever sees one host.
- **Cart:** Store API (`/wc/store/v1/cart`) with nonce; add-ons carried through the classic add-to-cart POST so lid/induction pricing is calculated by WooCommerce. Drawer + full cart page; checkout hands off to WooCommerce.
- **Currency:** WooCommerce Multi Currency cookie honoured; edge decides CAD/USD from the shopper's country on first visit.
- **Search:** edge endpoint returning products, collections, recipes and help pages; overlay with thumbnails.
- **SEO:** canonical URLs on the apex domain, Product/Offer/AggregateRating/Review, BreadcrumbList, Organization, FAQPage, Recipe schema; generated `sitemap.xml`; 301 map; `noindex` on cart/search/account.
- **Go-live prerequisites (operator):** point nameservers to Cloudflare; recreate **MX + mail A records** (mail is on the same A2 host — mail breaks otherwise); create proxied `origin.titaniumexclusive.com` → `185.160.66.193` and set `WP.resolveOverride` in `config.js`; run `activate-site.yml`. WordPress needs no configuration change. Checkout/account pages still render in the old theme until a minimal WooCommerce theme is installed (recommended follow-up).

## Open items for the client

1. Canonical legal name (proposed: brand "Titanium Exclusive", legal "Titanium Exclusive Cookware Inc.").
2. Dishwasher: site copy now says hand-wash recommended (matches care + warranty pages).
3. Oven limit: 500°F / 260°C used for handles, lids and knobs (features page). Confirm gift-set "450°F" copy.
4. TÜV GS mark status after 2018.
5. USD pricing (currently identical to CAD numbers).
6. Whether to keep Household items in the storefront (currently kept, separated from cookware).
7. Contact form delivery: the new form needs an endpoint key (Web3Forms or similar) — placeholder until provided.
