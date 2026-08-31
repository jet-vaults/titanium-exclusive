import { html, raw } from '../lib/html.js';
import { SITE, PRIMARY_COLLECTIONS } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { button, textLink, sectionHead, productCard, collectionCard, recipeCard, reviewCard, accordion, ICON, srcsetAttr } from '../ui/components.js';
import { getReviews, featuredProducts } from '../lib/store.js';
import { getRecipes } from '../lib/recipes.js';
import { BRAND, PROOF, VIDEOS, IMG } from '../content/brand.js';
import { FAQ, faqLd } from '../content/faq.js';
import { compareTable } from './why.js';

export async function renderHome(c) {
  const shell = await shellData(c);
  const [reviews, recipes] = await Promise.all([getReviews(c.ctx).catch(() => []), getRecipes(c.ctx).catch(() => [])]);
  const featured = featuredProducts(shell.products, 8);
  const collections = PRIMARY_COLLECTIONS.map((k) => shell.categories.find((x) => x.slug === k.slug)).filter(Boolean);
  const faq = FAQ.filter((f) => ['material', 'stovetops', 'oven', 'oil', 'dishwasher', 'lids', 'warranty', 'shipping'].includes(f.id));

  const body = html`
    ${hero()}
    ${proof()}
    ${collectionsSection(collections)}
    ${anatomy()}
    ${featuredSection(featured)}
    ${madeSection()}
    ${compareSection()}
    ${reviews.length ? reviewsSection(reviews) : ''}
    ${videoSection()}
    ${recipes.length ? recipesSection(recipes.slice(0, 3)) : ''}
    ${faqSection(faq)}
    ${finale()}
  `;

  return page(c, {
    shell,
    title: '',
    description: 'Titanium Exclusive: hand-cast titanium non-stick cookware from Germany since 1995. 8 mm cast base, little or no oil, oven-safe, 20-year warranty. Ships across Canada and the US.',
    body,
    bodyClass: 'page-home',
    preloadImage: { src: IMG.panTexture, srcset: `${IMG.panTexture.slice(0, -5)}-480.webp 480w, ${IMG.panTexture.slice(0, -5)}-960.webp 960w, ${IMG.panTexture} 1400w`, sizes: '(max-width: 64em) 100vw, 46vw' },
    ld: [organizationLd(), websiteLd(), faqLd(faq)],
  });
}

function hero() {
  return html`
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__text">
        <p class="eyebrow">The original titanium cookware · since ${BRAND.since}</p>
        <h1 class="hero__title">
          <span class="line"><span style="--i:0">Hand-cast</span></span>
          <span class="line"><span style="--i:1">in Germany.</span></span>
          <span class="line"><span style="--i:2"><em class="accent">Made to outlast</em></span></span>
          <span class="line"><span style="--i:3">the kitchen.</span></span>
        </h1>
        <p class="hero__lead">An 8 mm cast base. A titanium surface that needs little or no oil. A 20-year warranty. Made the same way since 1995.</p>
        <div class="btn-row hero__actions">
          ${button({ href: '/shop/', label: 'Shop cookware', size: 'lg' })}
          ${button({ href: '/why-titanium/', label: 'Discover Titanium Exclusive', variant: 'secondary', size: 'lg' })}
        </div>
        <ul class="hero__proof">
          <li>German foundry</li><li>Titanium non-stick</li><li>20-year warranty</li>
        </ul>
      </div>
      <div class="hero__media">
        <div class="hero__main">
          <img src="${IMG.panTexture}" ${raw(srcsetAttr(IMG.panTexture, '(max-width: 64em) 100vw, 46vw'))} alt="The cast titanium cooking surface of a Titanium Exclusive frying pan" width="1000" height="800" fetchpriority="high" decoding="async" data-parallax="7">
        </div>
        <div class="hero__inset">
          <img src="${IMG.pour.slice(0, -5)}-480.webp" alt="Molten aluminium alloy being ladled into a mould by hand" width="480" height="480" loading="lazy" decoding="async">
        </div>
        <p class="hero__caption">Poured by hand in a German foundry.</p>
      </div>
    </div>
  </section>`;
}

function proof() {
  return html`
  <section class="proof" aria-label="Key facts">
    <ul class="container proof__list" data-stagger>
      ${PROOF.map((p) => html`<li class="proof__item reveal"><span class="proof__value">${p.value}</span><span class="proof__label">${p.label}</span></li>`)}
    </ul>
  </section>`;
}

function collectionsSection(collections) {
  return html`
  <section class="section" id="collections">
    <div class="container">
      ${sectionHead({ eyebrow: 'Collections', title: 'Choose the pan. <em class="accent">Then the size.</em>', lead: 'Nine families of cookware, each cast from the same alloy and finished with the same titanium surface. Sizes from 16 to 43 cm.', link: { href: '/shop/', label: 'Shop all cookware' } })}
      <div class="collections" data-stagger>
        ${collections.map((k, i) => collectionCard(k, { size: i === 0 ? 'collection-card--wide' : '' }))}
      </div>
    </div>
  </section>`;
}

const FEATURES = [
  { key: 'surface', x: 56, y: 56, title: 'Titanium non-stick surface', text: 'A patented titanium finish bonded to the cast body. Non-porous and extremely durable, it cooks with little or no oil, needs no seasoning, and keeps the aluminium underneath away from your food.' },
  { key: 'base', x: 64, y: 88, title: '8 mm thermobasic base', text: 'Eight millimetres of hand-cast aluminium spread heat evenly and hold it. Cast aluminium conducts heat about seven times faster than iron or steel, so you cook at lower settings, in less time.' },
  { key: 'handle', x: 6, y: 62, title: 'Plug-in handle, no screws', text: 'The patented mounting has no screws and no rivets — nothing to loosen. It carries the TÜV Rheinland safety label and is oven-proof to 260 °C / 500 °F.' },
  { key: 'rim', x: 50, y: 20, title: 'Reinforced rim', text: 'A reinforced pouring rim with an opposing grip on the pots: clean pouring, safe two-handed lifting.' },
  { key: 'lid', title: 'Borosilicate glass lid', text: 'Hardened, heat-resistant glass lets you watch the food without lifting the lid. Closed, it turns the pan into a stovetop “vapour oven” — vegetables without water, eggs poached to the point.' },
  { key: 'body', title: 'Cast, not stamped', text: 'The body is cast in one piece and turned flat on the lathe. It resists warping on high heat and stays flat on the burner year after year.' },
];

function anatomy() {
  return html`
  <section class="section theme-dark" data-anatomy>
    <div class="container anatomy__grid">
      <div class="anatomy__figure reveal">
        <div class="anatomy__img">
          <img src="${IMG.panTexture}" ${raw(srcsetAttr(IMG.panTexture, '(max-width: 64em) 100vw, 46vw'))} alt="Cross-section view of a Titanium Exclusive pan showing the cooking surface, rim and handle" width="1000" height="800" loading="lazy" decoding="async">
        </div>
        ${FEATURES.filter((f) => f.x != null).map((f, i) => html`<button class="hotspot" type="button" style="left:${f.x}%;top:${f.y}%" data-hotspot="${f.key}" aria-label="${f.title}">${i + 1}</button>`)}
      </div>
      <div>
        ${sectionHead({ eyebrow: 'Why Titanium Exclusive', title: 'Every part <em class="accent">does a job.</em>', lead: 'Not a coating on a stamped disc. A cast body, a titanium surface and a handle you will never tighten.' })}
        <div class="features">
          ${FEATURES.map((f, i) => html`
            <div class="feature" data-feature="${f.key}" tabindex="0" role="button" aria-expanded="false">
              <span class="feature__num">0${i + 1}</span>
              <div><h3 class="feature__title">${f.title}</h3><p class="feature__text">${f.text}</p></div>
            </div>`)}
        </div>
      </div>
    </div>
  </section>`;
}

function featuredSection(featured) {
  return html`
  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Most wanted', title: 'What owners buy first — <em class="accent">and buy again.</em>', link: { href: '/shop/', label: 'View all' } })}
    </div>
    <div class="carousel carousel--products" data-carousel>
      <div class="carousel__track" data-stagger>
        ${featured.map((p, i) => productCard(p, { eager: i < 3 }))}
      </div>
      <div class="container" style="display:flex;justify-content:flex-end;margin-top:1.5rem">
        <div class="carousel__nav">
          <button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous products">${raw(ICON.arrow)}</button>
          <button class="carousel__btn carousel__btn--next" type="button" aria-label="Next products">${raw(ICON.arrow)}</button>
        </div>
      </div>
    </div>
  </section>`;
}

const STEPS = [
  { title: 'Cast', text: 'Molten aluminium alloy is poured by hand into the mould, one piece at a time, in a German foundry. The 8 mm base is cast, not pressed.', img: IMG.pour, alt: 'A foundry worker pours molten aluminium into a mould' },
  { title: 'Turned', text: 'Every casting goes on the lathe. The base is turned perfectly flat so it sits tight on the burner and heats without hot spots.', img: IMG.lathe, alt: 'A cast pan body being turned on a lathe' },
  { title: 'Coated', text: 'The patented titanium surface is bonded to the body. Non-porous, abrasion-resistant, and tested by LGA Bavaria against German food-contact recommendations.', img: IMG.sparks, alt: 'Sparks fly as the titanium surface is applied to a pan' },
  { title: 'Assembled', text: 'The plug-in handle is fitted without screws or rivets — the mounting that earned the TÜV Rheinland safety label. Lids are matched to the rim.', img: IMG.panBase, alt: 'The machined base of a Titanium Exclusive pan stamped Made in Germany' },
  { title: 'Cooked in', text: 'Then it leaves for Canada and the United States, where owners write to tell us the pan they bought at a trade show twenty years ago is still the one they reach for.', img: IMG.fryingPanFood, alt: 'A finished Titanium Exclusive frying pan with a cooked steak' },
];

function madeSection() {
  return html`
  <section class="section section--line">
    <div class="container">
      ${sectionHead({ eyebrow: 'How it is made', title: 'Five steps between a German foundry <em class="accent">and your stove.</em>', link: { href: '/support/videos/', label: 'Watch the factory film' } })}
      <div class="story" data-story>
        <div class="story__media" aria-hidden="true">
          ${STEPS.map((s) => html`<img src="${s.img}" ${raw(srcsetAttr(s.img, '46vw'))} alt="" loading="lazy" decoding="async" data-step-img>`)}
        </div>
        <div class="story__steps">
          ${STEPS.map((s, i) => html`
            <div class="story__step" data-step>
              <div class="story__mobile-img"><img src="${s.img.slice(0, -5)}-960.webp" alt="${s.alt}" loading="lazy" decoding="async" width="960" height="720"></div>
              <span class="story__num">0${i + 1}</span>
              <h3 class="story__title">${s.title}</h3>
              <p class="story__text">${s.text}</p>
            </div>`)}
        </div>
      </div>
    </div>
  </section>`;
}

function compareSection() {
  return html`
  <section class="section section--line">
    <div class="container">
      ${sectionHead({ eyebrow: 'Compared', title: 'Why it costs more than a pan <em class="accent">you replace every two years.</em>', lead: 'Ordinary non-stick is a coating on a thin stamped disc. This is a cast body with a titanium surface — and a warranty that runs for two decades.' })}
      <div class="reveal">${compareTable()}</div>
      <p style="margin-top:1.5rem">${textLink('/why-titanium/', 'Read the full comparison')}</p>
    </div>
  </section>`;
}

function reviewsSection(reviews) {
  const twenty = reviews.filter((r) => /20\+? years|over 20|20 years ago/i.test(r.text)).length;
  return html`
  <section class="section section--line">
    <div class="container">
      ${sectionHead({ eyebrow: 'Owners', title: twenty ? html`${twenty} of these reviews mention pans <em class="accent">older than twenty years.</em>` : 'What owners say.', link: { href: '/shop/', label: 'Shop cookware' } })}
    </div>
    <div class="carousel" data-carousel>
      <div class="carousel__track" data-stagger>
        ${reviews.map((r) => html`<div class="reveal">${reviewCard(r)}</div>`)}
      </div>
      <div class="container" style="display:flex;justify-content:flex-end;margin-top:1.5rem">
        <div class="carousel__nav">
          <button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous reviews">${raw(ICON.arrow)}</button>
          <button class="carousel__btn carousel__btn--next" type="button" aria-label="Next reviews">${raw(ICON.arrow)}</button>
        </div>
      </div>
    </div>
  </section>`;
}

export function videoCard(v, { hero = false } = {}) {
  return html`
    <div class="reveal">
      <div class="video ${hero ? 'video--hero' : ''}" data-video="${v.id}" data-title="${v.title}" role="button" tabindex="0" aria-label="Play video: ${v.title}">
        <img src="/media/video/${v.id}.webp" alt="" loading="lazy" decoding="async" width="480" height="360">
        <span class="video__play"><span class="video__play-btn">${raw(ICON.play)}</span></span>
      </div>
      <div class="video__caption"><span class="video__kind">${v.kind}</span><span class="video__title">${v.title}</span></div>
    </div>`;
}

function videoSection() {
  const [factory, brand, ...episodes] = VIDEOS;
  return html`
  <section class="section theme-dark">
    <div class="container">
      ${sectionHead({ eyebrow: 'In the kitchen', title: 'See Titanium Exclusive <em class="accent">in action.</em>', lead: 'From the foundry floor to a chef’s stove. Three cooking episodes with Mathieu Beausoleil, the Canadian chef seen on MasterChef Canada and Food Network Canada.', link: { href: '/support/videos/', label: 'All videos' } })}
      <div class="grid grid--3" data-stagger>
        ${videoCard(brand)}
        ${episodes.slice(0, 2).map((v) => videoCard(v))}
      </div>
    </div>
  </section>`;
}

function recipesSection(recipes) {
  return html`
  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Recipes', title: 'Cook something <em class="accent">tonight.</em>', link: { href: '/recipes/', label: 'All recipes' } })}
      <div class="grid grid--3" data-stagger>${recipes.map((r) => recipeCard(r))}</div>
    </div>
  </section>`;
}

function faqSection(faq) {
  return html`
  <section class="section section--line">
    <div class="container" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:var(--space-8)" data-faq-grid>
      <div>
        ${sectionHead({ eyebrow: 'Questions', title: 'Before you <em class="accent">buy.</em>', lead: 'Straight answers from our care, warranty and product pages.' })}
        ${textLink('/support/faq/', 'All questions')}
      </div>
      <div class="reveal">${accordion(faq, { name: 'home-faq', open: 0 })}</div>
    </div>
    <style>@media (max-width:64em){[data-faq-grid]{grid-template-columns:1fr!important}}</style>
  </section>`;
}

function finale() {
  return html`
  <section class="finale">
    <div class="finale__bg"><img src="${IMG.sparksWide}" ${raw(srcsetAttr(IMG.sparksWide, '100vw'))} alt="" loading="lazy" decoding="async" width="1400" height="420"></div>
    <div class="container finale__text">
      <p class="eyebrow">Since ${BRAND.since}</p>
      <h2 class="finale__title">Twenty years from now, still the pan you reach for.</h2>
      ${button({ href: '/shop/', label: 'Explore the collection', size: 'lg' })}
    </div>
  </section>`;
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: BRAND.legalName,
    url: SITE.canonicalOrigin,
    logo: `${SITE.canonicalOrigin}/assets/img/logo-1000.png`,
    foundingDate: String(BRAND.since),
    telephone: BRAND.phoneTollFreeTel,
    email: BRAND.email,
    address: { '@type': 'PostalAddress', streetAddress: BRAND.address.street, addressLocality: BRAND.address.city, addressRegion: BRAND.address.region, postalCode: BRAND.address.postal, addressCountry: BRAND.address.country },
    sameAs: [BRAND.instagram, BRAND.youtube],
  };
}

function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.canonicalOrigin,
    potentialAction: { '@type': 'SearchAction', target: `${SITE.canonicalOrigin}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };
}
