import { html, raw } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { button, textLink, sectionHead, accordion, breadcrumbLd, ICON, productCard } from '../ui/components.js';
import { featuredProducts } from '../lib/store.js';
import { BRAND, IMG, VIDEOS } from '../content/brand.js';
import { FAQ, faqLd } from '../content/faq.js';
import { videoCard } from './home.js';

const yes = (t) => html`<span>${raw(ICON.check)}${t}</span>`;
const no = (t) => html`<span class="muted">${raw(ICON.dash)}${t}</span>`;

export function compareTable() {
  const rows = [
    ['Body', yes('Hand-cast aluminium, 8 mm base'), no('Stamped aluminium, thin base'), no('Pressed steel with a clad disc'), no('Cast iron')],
    ['Heat', yes('Even and fast; cook at lower settings'), no('Hot spots on thin bases'), no('Slow, uneven without a thick disc'), no('Slow to heat, holds heat')],
    ['Surface', yes('Titanium non-stick, no seasoning'), no('Coating wears; replaced every few years'), no('Bare steel; food sticks without oil'), no('Needs seasoning and upkeep')],
    ['Oil & water', yes('Little or none'), no('Some'), no('Yes'), no('Yes')],
    ['Warping', yes('Cast body stays flat'), no('Warps on high heat'), no('Can warp'), yes('Stays flat')],
    ['Weight', yes('Lighter than cast iron'), yes('Light'), yes('Medium'), no('Heavy')],
    ['Oven', yes('Handles and lids to 260 °C / 500 °F'), no('Often limited by handle materials'), yes('Yes'), yes('Yes')],
    ['Handle', yes('Plug-in, no screws or rivets'), no('Riveted or screwed; loosens'), no('Riveted'), yes('Cast in one piece')],
    ['Warranty', yes('20 years on the body'), no('Typically 1–2 years'), no('Varies'), no('Varies')],
  ];
  return html`
    <div class="compare-wrap">
      <table class="compare">
        <thead><tr><th scope="col"></th><th scope="col" class="is-us">Titanium Exclusive</th><th scope="col">Ordinary non-stick</th><th scope="col">Stainless steel</th><th scope="col">Cast iron</th></tr></thead>
        <tbody>${rows.map(([h, ...cells]) => html`<tr><th scope="row">${h}</th>${cells.map((cell, i) => html`<td class="${i === 0 ? 'is-us' : ''}">${cell}</td>`)}</tr>`)}</tbody>
      </table>
    </div>
    <p class="muted" style="font-size:var(--text-xs);margin-top:1rem">Titanium Exclusive figures are from our product specifications. Other columns describe typical cookware of that type, not a specific brand.</p>`;
}

export async function renderWhyTitanium(c) {
  const shell = await shellData(c);
  const featured = featuredProducts(shell.products, 4);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Why Titanium', href: '/why-titanium/' }];
  const faq = FAQ.filter((f) => f.topics.includes('why') || ['dishwasher', 'warranty', 'sticky'].includes(f.id));
  const tiles = [
    ['8 mm', 'Thermobasic base', 'Cast, not stamped. Thick enough to spread heat evenly and hold it.'],
    ['7×', 'Faster than iron or steel', 'Cast aluminium conducts heat about seven times faster than iron or steel — cooking time roughly halved.'],
    ['500 °F', 'Oven-proof', 'Handles, glass lids and knobs are rated to 260 °C / 500 °F.'],
    ['20 yr', 'Warranty', 'On the cast body. Five years no-charge, then a prorated replacement fee.'],
  ];
  return page(c, {
    shell,
    title: 'Why titanium cookware',
    description: 'How Titanium Exclusive cookware is built and why it performs: hand-cast 8 mm aluminium base, patented titanium non-stick surface, screw-less handles, borosilicate lids, 20-year warranty.',
    bodyClass: 'page-why',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), faqLd(faq)],
    body: html`
      <section class="container page-hero">
        <p class="eyebrow">Why Titanium</p>
        <h1 class="page-hero__title">A pan is a piece of <em class="accent">engineering.</em></h1>
        <p class="lead">Most non-stick pans are a coating sprayed on a thin stamped disc. Ours start as molten metal in a German foundry. Here is what that changes — and what it does not.</p>
      </section>

      <section class="container section--sm">
        <div class="tiles" data-stagger>
          ${tiles.map(([v, t, x]) => html`<div class="tile reveal"><span class="tile__value">${v}</span><span class="tile__title">${t}</span><p class="tile__text">${x}</p></div>`)}
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <figure class="media reveal reveal--mask"><img src="${IMG.pour}" alt="Molten aluminium alloy poured by hand into a mould" width="1000" height="1000" loading="lazy"></figure>
          <div class="split__text">
            <p class="eyebrow">Construction</p>
            <h2 class="h2">Cast by hand, <em class="accent">turned flat.</em></h2>
            <p>Every piece is cast from a high-quality aluminium alloy in a German foundry — still by hand, one pour at a time. The casting is then machined on the lathe so the 8 mm base sits perfectly flat on the burner.</p>
            <p>Casting makes a body that stamping cannot: thick where it needs to be, warp-resistant, and free of the seams and rivets that fail first on ordinary pans.</p>
          </div>
        </div>
      </section>

      <section class="section theme-dark">
        <div class="container split split--reverse">
          <figure class="media reveal reveal--mask"><img src="${IMG.sparks}" alt="Sparks as the titanium surface is applied to a pan body" width="1000" height="1000" loading="lazy"></figure>
          <div class="split__text">
            <p class="eyebrow">Titanium surface</p>
            <h2 class="h2">Non-porous. Non-stick. <em class="accent">No seasoning.</em></h2>
            <p>The patented titanium finish is bonded to the cast body. It is non-porous — the aluminium underneath never touches your food — and hard enough to shrug off years of daily use. The inner surface has been tested by LGA Bavaria and meets the German Federal Health Ministry (BGA) recommendations for food-contact articles.</p>
            <p>You cook with little or no oil, and vegetables cook in their own moisture under the lid. Nothing to season, nothing to re-coat.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <figure class="media reveal reveal--mask"><img src="${IMG.panBase}" alt="The machined base of a Titanium Exclusive pan, stamped Made in Germany" width="1000" height="800" loading="lazy"></figure>
          <div class="split__text">
            <p class="eyebrow">Heat & energy</p>
            <h2 class="h2">Lower settings. <em class="accent">Less time.</em></h2>
            <p>Cast aluminium conducts heat about seven times faster than iron or steel. The 8 mm thermobasic base spreads that heat across the whole cooking surface and holds it, so the pan does the work at medium instead of high — and finishes sooner.</p>
            <p>With the borosilicate lid on, the pan becomes a stovetop “vapour oven”: whole meals cook on one burner without turning the oven on.</p>
          </div>
        </div>
      </section>

      <section class="section section--line">
        <div class="container">
          ${sectionHead({ eyebrow: 'Durability', title: 'The parts that fail on other pans <em class="accent">are not here.</em>' })}
          <div class="grid grid--3" data-stagger>
            <div class="tile reveal"><span class="tile__title">No screws, no rivets</span><p class="tile__text">The patented plug-in handle mounting has nothing to loosen. It carries the TÜV Rheinland safety label and is oven-proof to 260 °C / 500 °F.</p></div>
            <div class="tile reveal"><span class="tile__title">Warp-resistant body</span><p class="tile__text">A thick cast body turned flat stays flat. It does not lift off the burner after a year of high heat the way stamped pans do.</p></div>
            <div class="tile reveal"><span class="tile__title">Hardened glass lids</span><p class="tile__text">Heat-resistant borosilicate glass with an oven-proof knob. Watch the food without lifting the lid and losing the heat.</p></div>
          </div>
        </div>
      </section>

      <section class="section section--line">
        <div class="container">
          ${sectionHead({ eyebrow: 'Compatibility', title: 'Every stovetop. <em class="accent">Any oven.</em>', lead: 'Gas, electric, ceramic and glass cooktops as standard. For induction, choose the induction option on the product page — every pan is available in an induction-ready version at the same price. Handles, lids and knobs go into the oven to 260 °C / 500 °F.' })}
        </div>
      </section>

      <section class="section section--line">
        <div class="container">
          ${sectionHead({ eyebrow: 'Compared', title: 'Side by side.' })}
          <div class="reveal">${compareTable()}</div>
        </div>
      </section>

      <section class="section theme-dark">
        <div class="container">
          ${sectionHead({ eyebrow: 'Manufacturing', title: 'Watch it <em class="accent">being made.</em>', link: { href: '/support/videos/', label: 'All videos' } })}
          <div class="grid grid--2">${videoCard(VIDEOS[0], { hero: true })}${videoCard(VIDEOS[1], { hero: true })}</div>
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <div class="split__text">
            <p class="eyebrow">Care</p>
            <h2 class="h2">Five minutes of care, <em class="accent">twenty years of use.</em></h2>
            <p>Wash by hand with warm water, dish detergent and a green 3M Scotch-Brite pad. Skip the dishwasher — acidic detergents can impair the surface. Never use non-stick sprays; they leave an invisible film that makes a pan stick. If that happens, a dry scrub with the pad brings it back.</p>
            <p>${textLink('/support/care/', 'Full care instructions')}</p>
          </div>
          <div class="reveal">${accordion(faq, { name: 'why-faq', cls: 'accordion--compact' })}</div>
        </div>
      </section>

      <section class="section section--line">
        <div class="container">
          ${sectionHead({ eyebrow: 'Start here', title: 'The pieces owners <em class="accent">buy first.</em>', link: { href: '/shop/', label: 'Shop all cookware' } })}
          <div class="grid grid--4 grid--products" data-stagger>${featured.map((p) => productCard(p))}</div>
          <div class="btn-row" style="margin-top:2.5rem">${button({ href: '/shop/', label: 'Shop cookware', size: 'lg' })}${button({ href: '/our-story/', label: 'Our story', variant: 'secondary', size: 'lg' })}</div>
        </div>
      </section>`,
  });
}
