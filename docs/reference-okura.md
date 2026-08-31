# Reference study: okuracookware.com (premium cookware DTC)

Analyzed 2026-08-30. Pages inspected: homepage, `/collections/restock-sale`, `/products/hand-hammered-high-wall-titanium-pan`, `/pages/about-us` (rendered via WebFetch plus raw HTML/CSS/JS inspection).

Purpose: extract transferable UX/design **principles** for Titanium Exclusive. We are not copying Okura's copy, colors, fonts or layout. Where a specific value (px, seconds) is quoted it is a calibration point, not a spec to reproduce.

Platform facts worth knowing: Shopify, custom theme built on a stock base, heavily A/B tested (Intelligems: the homepage ships 4 hero variants and toggles them at runtime), review app (Loox), Klaviyo, Swiper only for one review carousel. Almost everything else is hand-written CSS + vanilla JS. No GSAP, no ScrollTrigger, no Lenis, no Framer, no Lottie.

Overall positioning read: dark, warm, "modern Japanese craft" brand wrapped around a very aggressive performance-marketing funnel (70%-off countdown, cart timer, urgency badges, rankings ribbons). The storytelling layer is good; the promo layer is loud. Our job is to keep the former and drop the latter.

---

## 1. Homepage narrative sequence

Order as shipped (one hero variant shows at a time). Viewport shares are estimates from CSS min-heights/paddings at ~1440px wide.

| # | Section | Purpose in the argument | Approx. height |
|---|---------|--------------------------|----------------|
| 0 | Announcement bar (marquee + countdown) | Urgency / promo | ~36px |
| 1 | **Hero** – full-bleed lifestyle photo, dark gradient shade, serif headline (2 lines), 4 benefit "pills", one primary CTA + secondary "story" link, rating line above headline | One-sentence promise + instant credibility | 0.9–1.0 vh (`min-height: min(920px, 100svh - bars)`) |
| 2 | **Proof strip** – 3 icon guarantees (warranty / shipping / non-toxic) + aggregate rating stats + "as seen on" TV logos marquee | De-risk immediately after the promise | ~0.3 vh |
| 3 | **Shop by category** – 5 horizontally scrolling square image cards (name, one-line descriptor, "Shop now") | Route people who already want to buy | ~0.75 vh |
| 4 | **Testimonials** – headline + 3 stat tiles, then horizontal snap-scroll of 8 photo review cards (4:3 photo, stars, quote, name, country, verified badge) | Social proof from people like the buyer | ~0.9 vh |
| 5 | **The problem** – 3 cards (16:10 image + title + 2 lines) describing what is wrong with the category | Create the itch | ~0.8 vh |
| 6 | **The difference** – split layout: left = 4 click-to-expand feature rows with icons; right = large product image with 4 pulsing hotspot dots that open popovers | Explain the mechanism that fixes the problem | ~0.9 vh |
| 7 | Second testimonial block (same component, different reviews) | Reinforce after the technical section | ~0.9 vh |
| 8 | **Us vs. them** comparison – 2-column feature-by-feature table, brand column highlighted | Rational justification, pre-empts "why not just buy a normal pan" | ~0.9 vh |
| 9 | **FAQ** – 8 accordion items in a narrow (800px) column, "still have questions" link | Remove residual objections | ~0.8 vh |
| 10 | **Newsletter** – headline, 3 benefit checkmarks, single email field, privacy note, "join N cooks" line | Capture non-buyers | ~0.5 vh |
| 11 | Footer – tagline, support email/address/hours, 3 link columns (collapsible on mobile), currency, payment icons | Housekeeping / trust | ~0.6 vh |

Reading of the structure: **promise → de-risk → route buyers → proof → problem → mechanism → proof → rational comparison → objections → capture.** Buyers can exit at section 3; skeptics get a full argument. Proof appears three times (strip, testimonials, testimonials again) rather than once.

The product page repeats sections 4–9 almost verbatim below the buy box, so the "argument" is available regardless of entry page.

## 2. Navigation pattern

**Header structure (desktop)**
- Floating bar, not full-width: 60px tall pill/card with 16px page margin on all sides, rounded corners, translucent dark background with `backdrop-filter: blur(20px)`. Announcement bar sits above it.
- Three zones: left = text nav (Home, Shop ▾, Guides, About, FAQ, Contact, Track order) in a small 13px medium-weight sans; center = logo (~150px wide, max 40px tall); right = currency dropdown, search icon, cart icon with count badge.
- `position: sticky; top: 0` on the section, plus JS **hide-on-scroll-down / reveal-on-scroll-up** (hides after 120px scrolled, reveals on any 5px upward movement, 350ms ease transition). Mega menu closes when the header hides.

**Mega menu** (only on "Shop", opens on hover with a 350ms close delay, positioned as a fixed panel 6px under the bar, fades/slides 12px):
- Grid `1fr 1fr 1fr 280px`: three link columns (Cookware / Knives & Tools / Collections) + one promo card.
- Column title: 10px uppercase, 2px letter-spacing, accent color. Links: 13px, each with a 34px thumbnail, a right-aligned muted meta badge ("3 sizes", "6 types"). Hover: background tint + `translateX(4px)`.
- Promo card: image with gradient fade into a body (eyebrow tag, serif title, 1-line description, small uppercase CTA).
- Bottom strip: 3 USP micro-lines (warranty / shipping / returns) on the left, "View all products" on the right.

**Mobile**
- Hamburger toggles a full-height drawer; body scroll locked; dimming backdrop rendered as `::before` on the header section.
- Drawer content order: promo card → "Shop" label → 2×2 grid of category cards (48px thumb + name + count) → plain link list (14px, 14px vertical padding) → divider → USP lines → currency chips.
- Footer columns collapse to accordions on mobile.

Principle: the header is a compact, floating "instrument panel"; the mega menu doubles as a merchandising surface (thumbnails, counts, promo, USPs) not just a sitemap.

## 3. Product card anatomy and hover

Collection grid: 4 columns desktop (`collection-product-list--4`), 2 on mobile, 24 per page, horizontal filter bar (sort select + "Filter" button opening a drawer with availability + price range). No swatches, no quick-add.

Card (top to bottom):
1. Media – square-ish image, 10px radius, `object-fit: cover`. Single image (no secondary image swap).
2. Badge row overlaid top-left – emoji + label pills (Bestseller / New / Low stock / Only 1 left).
3. Title – 15px, weight 500, 2 lines max.
4. Star row + review count in parentheses.
5. Price group – struck compare price, sale price, "(65% off)" percent, and a "SAVE $195" chip.
6. Whole card is a link overlay (no visible button on the card in the collection grid; the WebFetch reading of "add-to-cart buttons" is the link overlay).

Hover: image zoom (`transform: scale` on the img, ~0.4–0.6s), card lift `translateY(-3px)`, soft glow shadow `4px 20px 40px rgba(0,0,0,.25)` and a subtle border tint, all on a 0.4s `cubic-bezier(0.19,1,0.22,1)` ease-out curve. Transparent card background so the image floats on the page.

Category cards (homepage) follow the same grammar: square image, name, 1-line descriptor, "Shop now" text link, `scale(1.06)` image zoom on hover.

## 4. Product page anatomy

**Layout**: 2-column grid `1fr 1fr`, max 1600px. **Left column (gallery) is `position: sticky; top: header-height`**, right column scrolls. Collapses to single column on mobile.

**Gallery**
- Main image track (6 images), prev/next arrows, small overlaid "guarantee" badge graphic on the image, "Tap to zoom" hint, click toggles `zoomed` (switches to `object-fit: contain` + zoom-out cursor).
- Thumbnail strip below (horizontal scroll, no scrollbar), dot indicators on mobile.
- No video in the gallery; UGC videos live further down in the buy box.

**Buy box, in order**
1. Two small "Rated #1 …" ribbons (A/B tested)
2. H1 title
3. One-line tagline + a small chip ("Buy it for life")
4. Stars + "4.8 / 5 — 15,500+ reviews" link
5. Price / compare price / "Save 60%"
6. 2×2 grid of USP tiles (label + sub-label): non-toxic, warranty, dishwasher, all heat sources
7. Heat-source icon row (gas / induction / oven / grill) with a "compatibility line"
8. Offer selector: three tabs (Single / Set / Full Set) each with size `<select>`s; sizes shown in inches + cm with price per option
9. Urgency timer + stock line ("In stock · ships within 24 hours")
10. Qty stepper + full-width **Add to cart** button showing the price inside the button
11. "+ Free eBook included" bonus row with thumbnail
12. Trust line: Free shipping · 30-day returns · 25-year warranty (linked), payment icons
13. Three collapsible rows: **Details** (narrative paragraph), **Shipping & Returns** (2 sentences), **Care** (3 sentences)
14. "Real cooks, real results" – 3 vertical 9:16 UGC video thumbnails, open in a modal

**Below the buy box (order)**
1. Problem (3 cards) – same component as homepage
2. Editorial "reviews" slider (Swiper) – long-form testimonials with title, verified tag, author role
3. The difference (feature rows + hotspot image)
4. Testimonials (photo cards, stat tiles)
5. "As seen in" logo marquee
6. Comparison table (us vs. them, 9–10 rows)
7. Trust badge marquee (5 icon+title+subtitle items on a slow infinite scroll)
8. FAQ (same 8 items as homepage)
9. **Final CTA card** – eyebrow, serif headline, one-line social proof, 3 USP icons, "Secure checkout" button, "guaranteed" footnote
10. Review app widget – full list with photos/videos, product links, verified dates
11. Newsletter
12. **Sticky bottom CTA bar** (fixed, slides up 350ms) – appears only when the main add-to-cart scrolls above the viewport (IntersectionObserver on the ATC button), shows price / compare / save and an expandable variant picker; hides again if you scroll back up.

**Specs / care / FAQ presentation**: specs are *not* a table – they are dispersed as USP tiles, size options with cm/inch, a weight figure inside FAQ, and heat limits inside feature rows. Care is a 3-sentence collapsible. FAQ is a narrow accordion (800px, 15px question, 0.4s max-height ease-out, rotating + icon).

**Cross-sells**: none in the product page body. Upsells live in (a) the bundle tabs in the buy box, (b) the cart drawer ("Complete your kitchen", 4 items with inline variant selects), (c) post-purchase app. Restraint on-page, aggression in-cart.

**Structured data**: JSON-LD `Organization`, `WebSite` + `SearchAction`, `Product` (brand, offers with currency/price/availability, `AggregateRating`), `BreadcrumbList`.

## 5. Trust / social proof / comparison devices

1. **Aggregate rating triad** – three stat tiles (score / verified count / % 4–5 star) repeated at the head of every testimonial block.
2. **Photo testimonial cards** – customer photo (4:3) above the quote, name, country, verified badge; horizontally snap-scrolling with dots. Not all are 5 stars (a 4-star card is included, which reads as honest).
3. **Long-form "chef" reviews** – title + paragraph + role, in a separate slider; reads as editorial rather than UGC.
4. **UGC vertical video** – 9:16 thumbs in the buy box, modal playback.
5. **"As seen on" logo marquee** – TV show logos, slow 30–45s infinite scroll.
6. **Guarantee trio** – warranty / free shipping / returns, repeated in: hero pills, proof strip, buy box, mega-menu footer, final CTA, cart drawer.
7. **Comparison table** – 2 columns, brand column highlighted; rows are *outcomes* (versatility, maintenance, taste, heat response, dishwasher, long-term value, warranty) not specs; check/cross icons + one sentence per cell.
8. **Problem → mechanism pairing** – three named failure modes of the category, then four named features that answer them one-to-one.
9. **Ranking ribbons / "Rated #1"** badges in buy box (unsourced; a credibility risk we should avoid).
10. **About page numbers** – 4 stat tiles (kitchens / years / rating / countries) with big serif numerals.
11. Payment icons + "Guaranteed safe & secure checkout" under every checkout button.

## 6. Typography system observed

- **Two-family system**: a high-contrast **serif display face** for every H1/H2, eyebrow-adjacent numerals, promo titles and the big about-page stats; a **neutral geometric sans** for everything else (body, nav, buttons, labels). A monospace/quirky display pair is used only inside one A/B ribbon.
- **Display scale**: hero H1 80px desktop (68px tablet, 38–40px mobile), `line-height 1.0–1.08`, `letter-spacing -0.8 to -1.6px`, weight 500 (about-page hero goes to 900 at `clamp(42px, 7vw, 96px)`). Section H2s sit at a single size: **42px** (34px tablet, 30px mobile), weight 500, `line-height 1.15`. The feature section H2 uses `clamp(32px, 4vw, 50px)`.
- **Eyebrows**: 10–12px uppercase sans, 2–5px letter-spacing, accent color, ~12–32px below/above the heading. Used on nearly every section (The Problem / The Collection / FAQ / Our Journey).
- **Body**: 15–18px sans, `line-height 1.5–1.7`, muted grey on dark. Sub-headlines under H2s capped at ~500–560px measure.
- **UI micro type**: 9–13px, weights 500–700, uppercase with 0.5–2px tracking for chips, badges, CTAs in menus.
- **Weights**: 400 body, 500 nav/titles, 600 buttons & labels, 700 badges. Italic serif used once as emphasis inside a headline (a single word in italic).
- Numbers that carry proof (ratings, counts) are set in the serif display at 36–48px.

Principle: one serif voice for "brand", one sans voice for "interface", tiny uppercase eyebrows as the connective tissue, and a single H2 size used consistently so the page has rhythm.

## 7. Motion

Everything is CSS transitions/keyframes plus a handful of vanilla JS listeners. Durations are short and eased; nothing scroll-scrubbed.

| Type | Where | Implementation | Timing |
|------|-------|----------------|--------|
| Entrance fade-up | Hero eyebrow / title / sub / CTAs; about hero | CSS keyframe `translateY(28px)→0 + opacity`, staggered delays 0.1/0.25/0.4/0.55s (about page: 0.3/0.6/0.9/1.2s) | 0.8–1.0s ease-out, plays once on load |
| Scroll-reveal of sections | **None.** No IntersectionObserver-driven reveals on the homepage; sections are static. | | |
| Parallax / scroll storytelling | **None.** No pinned or scrubbed sections. The only sticky element is the product gallery column. | | |
| Sticky header hide/reveal | Header | scroll listener, `translateY(-110%)` | 0.35s cubic-bezier(.25,.1,.25,1) |
| Mega menu open | Header | opacity + `translateY(-12px→0)`, hover with 350ms close grace | ~0.3s |
| Marquees | Announcement bar, TV logos, trust badges, hero logos | `translateX(0→-50%)` on a duplicated track | 30–45s linear infinite, paused/`animation:none` for reduced-motion |
| Hover zoom | Category / problem / testimonial / team images | `scale(1.04–1.06)` | 0.4–0.6s ease |
| Hover lift | Product cards, CTAs | `translateY(-1 to -3px)` + shadow | 0.25–0.4s, ease-out curve `cubic-bezier(0.19,1,0.22,1)` |
| Accordion | FAQ, buy-box collapsibles, sticky bar expand | `max-height` transition | 0.35–0.4s `cubic-bezier(0.16,1,0.3,1)` |
| Hotspots | "Difference" product image | pulsing dot keyframe 2.5s infinite; popover `scale(0.92→1)` with slight overshoot `cubic-bezier(0.34,1.4,0.64,1)` | 0.35s |
| Drawers | Cart (right, 420px) | `translateX(100%)→0`, overlay blur 4px | 0.4s `cubic-bezier(.25,.46,.45,.94)` |
| Sticky bottom CTA | Product page | IntersectionObserver on ATC button; `translateY(100%)→0` | 0.35s |
| Micro | Scroll-indicator float (3s), button shine sweep on checkout (3s loop), spinner | keyframes | |
| Horizontal carousels | Categories, testimonials, problem cards | Native `overflow-x: auto; scroll-snap-type: x mandatory`, JS only for dots/arrows/edge fades | native |

Libraries: **Swiper** (one editorial review slider only). No GSAP / ScrollTrigger / Lenis / Locomotive / AOS / Barba (the string "Barba" in the source is a reviewer's name).

`prefers-reduced-motion` is respected: a global rule collapses all animation/transition durations to ~0 and marquees are disabled.

Principle: motion budget is spent on (a) a single staged hero entrance, (b) tactile hover/press feedback, (c) smooth drawers/accordions. The page otherwise stays still, which is what makes the dark, image-heavy design feel calm rather than busy.

## 8. Whitespace / rhythm

- **Containers**: three tiers. Wide 1600px (hero, categories, features, product grid), medium 1400px (testimonials), narrow 1050–1200px (comparison table, about story), reading 800px (FAQ). Side padding 24px (40px in some sections), 16–20px mobile.
- **Section vertical padding**: 100px (categories), 80px (FAQ), 72/64px (testimonials), 64px (comparison), 40/80 asymmetric (problem, newsletter). Steps down to 64–70px at tablet and 48–50px on mobile. So: **~5rem / 4rem / 3rem** tiers.
- **Heading blocks**: eyebrow → H2 (12px gap) → sub (16px) → content (36–48px).
- **Card internals**: 12–24px padding, 8–14px radius (product image 10px, cards 12–14px, pills 40px+ full-round, buttons 8px or fully round depending on variant). Border 1px at ~6–10% white for separation on dark.
- **Gaps**: grids use 18–24px gaps desktop, 10–12px mobile.
- **Aspect ratios**: hero = viewport (cover), category cards 1:1, product cards ~1:1, problem cards 16:10, testimonial photos 4:3, UGC 9:16, team portraits 3:4, about story image 3:4, feature hotspot image 1:1 (circular halo behind product).
- **Background rhythm**: alternates between two near-identical dark greys per section to create edges without lines; the hero and footer are darkest.
- Horizontal scroll tracks bleed to the viewport edge with 20–40px "peek" padding via `::before/::after` spacers.

## 9. Conversion devices

- **Primary CTA placement**: hero (one button, full-width on mobile, `min-height 48px`), category cards, every testimonial/feature block ends without a CTA (restraint), comparison table → FAQ → dedicated final CTA card near the end. Product page: ATC in buy box, sticky bottom bar after scrolling past it, final CTA card before the review widget.
- **Buy box economics**: price shown in the ATC button itself; bundle tabs with "save X%" chips; sizes priced inline in the select; free bonus (eBook) below ATC; trust line + payment icons directly under.
- **Cart drawer** (420px right drawer): header with count and a **10-minute "cart reserved" countdown**, line items, "Complete your kitchen" 4-item upsell list with inline variant selects and −40–70% chips, optional shipping protection line, subtotal / shipping / total, "Checkout — $X" button with shine sweep, "Continue shopping", secure-checkout line + payment icons. Empty state has its own headline + button.
- **Upsell restraint on page, not in cart**: product body has zero related-product grids; the cart carries all cross-sell.
- **Free-shipping / warranty / returns messaging**: the same three promises appear at least 7 times across a session (announcement, hero pills, proof strip, buy box, mega-menu footer, final CTA, cart, footer). Repetition, not novelty.
- **Urgency stack** (the part to avoid): countdown in announcement bar, countdown in buy box, cart reservation timer, "Only 1 left"/"Low stock" badges, 60–70% strike-through pricing on every SKU, "Rated #1" ribbons.
- **Email capture**: dedicated section with 3 checkmark benefits + privacy note + "join N" line; repeated in the footer. No pop-up observed in the raw HTML (Klaviyo is loaded, so one may fire).
- **Objection handling**: FAQ answers are 2–3 sentences and lead with the reassurance; a "Still have questions? Contact" link closes it.
- **Track order / returns portal** links in the header nav – post-purchase confidence signalled pre-purchase.

## 10. Principles to adopt, and where to diverge

### Adopt (do this)

1. **Run the same argument on every entry page.** Promise → de-risk → proof → problem → mechanism → comparison → objections → capture. Product pages should carry a compressed version of the homepage story below the buy box so paid/SEO landings still convert.
2. **Repeat the guarantee trio relentlessly, quietly.** Pick three promises (e.g., warranty length, shipping, returns) and place them in hero, buy box, menu footer, final CTA, cart and footer — small type, same order, same icons every time.
3. **Sticky gallery / scrolling buy box on desktop**, single column on mobile, and a **sticky bottom ATC bar that only appears once the real ATC has scrolled off** (IntersectionObserver, slide up 300–350ms).
4. **Compact floating header with hide-on-scroll-down / show-on-scroll-up.** Keeps the hero full-bleed and gives content room; the menu returns on the first upward gesture.
5. **Make the mega menu a merchandising surface**: thumbnails per link, item counts, one featured card, and the guarantee line at the bottom.
6. **Problem → mechanism pairing.** Name three concrete ways ordinary cookware fails, then answer each with a named feature; use an annotated product image (hotspots or numbered callouts) instead of a spec list to explain construction.
7. **Outcome-based comparison table** (2 columns, brand column emphasized, one sentence per cell) placed after proof and before FAQ.
8. **Proof in three registers**: aggregate stat tiles, photo/short-quote cards (include a 4-star), and one or two long-form expert/chef testimonials. Keep the star widget honest and consistent across cards.
9. **Native horizontal scroll-snap tracks for card rows** (categories, testimonials, problem cards) with peek padding and dots; no heavy carousel library needed.
10. **Motion budget**: one staged fade-up in the hero (0.8s, 0.15s stagger), 0.3–0.4s ease-out hovers/drawers/accordions, `prefers-reduced-motion` handled globally. No scroll-scrubbed effects unless one is truly editorial.
11. **Typographic hierarchy**: display serif for headlines and proof numerals, neutral sans for interface, small uppercase eyebrows on every section, one fixed H2 size (~42px desktop / 30px mobile), body measure ≤ 560px.
12. **Ship full JSON-LD** (Organization, WebSite/SearchAction, Product with Offer + AggregateRating, BreadcrumbList) from day one.

### Do differently (Titanium Exclusive identity: German engineering × classic luxury × heritage since 1995)

1. **Kill the urgency stack.** No countdowns, no cart timers, no "only 1 left", no permanent 60–70% strike-throughs, no unsourced "#1" ribbons. Heritage brands price with confidence; use "Since 1995", a numbered production/serial idea, or a material certificate instead of discounts. If promotions exist, put them in a single restrained line, never in a marquee.
2. **Light, precise, engineered palette instead of dark-and-warm.** Okura's identity is charcoal + copper glow + soft rounded pills. Ours should read as brushed metal, paper white/ivory, graphite ink, with one restrained accent, **sharp or barely-rounded corners (0–4px)**, hairline rules and generous white margins. Buttons rectangular, not pill-shaped.
3. **Replace the "hand-hammered craft" narrative with a "specification" narrative.** Where Okura hides specs inside FAQ and USP tiles, we should make a proper **engineering data block**: material grade, base construction, wall thickness, weight per size, induction/oven limits, made-in, warranty terms — presented like a technical datasheet (monospaced or tabular numerals, aligned columns). Precision *is* the luxury cue.
4. **Heritage timeline and provenance on the About page, told with archival/documentary imagery**, not AI portraits and a "founder met a craftsman" myth. A 1995 → today timeline, factory/process photography, awards and certifications, real people with real roles. Optionally bring a compressed 3-milestone version of this onto the homepage between "mechanism" and "comparison".
5. **Calmer, editorial hero.** Instead of a lifestyle photo drowned in a dark gradient with four benefit pills, use a product-led, evenly lit still (or a slow, fixed-camera product loop), one line of serif, one small provenance line ("Engineered in Germany · Since 1995"), one CTA. Let whitespace, not overlays, carry the tone.
6. **Restrained cart.** Keep the drawer pattern (420px, guarantee line, payment icons) but limit upsells to one contextually relevant item (a lid for the pan, a care product), no timer, no protection add-on.
7. **Fewer, better testimonials.** Okura's 15k review count is doing heavy lifting; we cannot and should not fake scale. Lead with expert/chef/press quotes and a handful of named, photographed owners; show ratings only if genuine volume exists.

---

Files: this document lives at `projects/titanium-exclusive/docs/reference-okura.md`. It is a working note, not public content (not under `wwwroot/`).
