import { html, raw } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { accordion, breadcrumbs, breadcrumbLd, sectionHead, textLink, button, ICON } from '../ui/components.js';
import { FAQ, faqLd } from '../content/faq.js';
import { BRAND, VIDEOS } from '../content/brand.js';
import { videoCard } from './home.js';
import { renderError } from './error.js';

const TOPICS = {
  faq: { title: 'Help & FAQ', short: 'Answers to the questions we hear most.', description: 'Frequently asked questions about Titanium Exclusive cookware: materials, induction, oven use, cleaning, lids, warranty and shipping.' },
  warranty: { title: 'Warranty', short: 'Twenty years on the cast body. What is covered and how to claim.', description: 'The Titanium Exclusive 20-year warranty: 5 years no-charge replacement, prorated fee from year 6, exclusions, and how to send a claim to Toronto.' },
  care: { title: 'Cleaning & care', short: 'Hand wash, Scotch-Brite pad, no sprays. Five minutes that protect twenty years.', description: 'How to clean and care for Titanium Exclusive titanium non-stick cookware, and how to restore a pan that has started to stick.' },
  instructions: { title: 'Cooking instructions', short: 'Heat settings, the vapour-oven technique, and what each pan does best.', description: 'How to cook with Titanium Exclusive cast titanium cookware: little or no oil, lower heat, and cooking with the lid on.' },
  shipping: { title: 'Shipping & returns', short: 'Canada and the United States, flat rate, CAD or USD.', description: 'Shipping and returns for Titanium Exclusive orders in Canada and the United States.' },
  videos: { title: 'Videos', short: 'The factory film, the brand film, and three cooking episodes.', description: 'Watch how Titanium Exclusive cookware is made in Germany and see it used in the kitchen.' },
};

export async function renderSupport(c) {
  const shell = await shellData(c);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Support', href: '/support/' }];
  return page(c, {
    shell,
    title: 'Support',
    description: 'Help with your Titanium Exclusive cookware: FAQ, warranty, cleaning and care, cooking instructions, shipping, videos and contact.',
    bodyClass: 'page-support',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin)],
    body: html`
      <section class="container page-hero">
        ${breadcrumbs(crumbs)}
        <h1 class="page-hero__title">How can we <em class="accent">help?</em></h1>
        <p class="lead">Everything about owning the cookware, in one place. If you cannot find it here, call ${BRAND.phoneTollFree} or <a href="/contact/" style="text-decoration:underline">write to us</a>.</p>
      </section>
      <section class="container section--sm">
        <div class="hub" data-stagger>
          ${Object.entries(TOPICS).map(([slug, t]) => html`<a class="hub__card reveal" href="/support/${slug}/"><h2 class="hub__title">${t.title}</h2><p class="hub__text">${t.short}</p><span class="link-arrow link-arrow--sm"><span>Open</span>${raw(ICON.arrow)}</span></a>`)}
          <a class="hub__card reveal" href="/contact/"><h2 class="hub__title">Contact</h2><p class="hub__text">Phone, email and a form. Toronto, Ontario.</p><span class="link-arrow link-arrow--sm"><span>Open</span>${raw(ICON.arrow)}</span></a>
          <a class="hub__card reveal" href="/my-account/"><h2 class="hub__title">My account</h2><p class="hub__text">Orders, addresses and account details.</p><span class="link-arrow link-arrow--sm"><span>Open</span>${raw(ICON.arrow)}</span></a>
        </div>
      </section>
      <section class="section section--line">
        <div class="container" style="max-width:52rem">
          ${sectionHead({ eyebrow: 'Quick answers', title: 'Most asked.' })}
          ${accordion(FAQ.slice(0, 6), { name: 'support-faq' })}
          <p style="margin-top:1.5rem">${textLink('/support/faq/', 'All questions')}</p>
        </div>
      </section>`,
  });
}

export async function renderSupportTopic(c, { topic }) {
  const t = TOPICS[topic];
  if (!t) return renderError(c, 404);
  const shell = await shellData(c);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Support', href: '/support/' }, { label: t.title, href: `/support/${topic}/` }];
  const ld = [breadcrumbLd(crumbs, SITE.canonicalOrigin)];
  if (topic === 'faq') ld.push(faqLd(FAQ));
  return page(c, {
    shell,
    title: t.title,
    description: t.description,
    bodyClass: `page-support page-support--${topic}`,
    ld,
    body: html`
      <section class="container page-hero">
        ${breadcrumbs(crumbs)}
        <h1 class="page-hero__title">${t.title}</h1>
        <p class="lead">${t.short}</p>
      </section>
      <section class="container" style="padding-bottom:var(--section)">${TOPIC_BODY[topic]()}</section>`,
  });
}

const TOPIC_BODY = {
  faq: () => html`<div style="max-width:52rem">${accordion(FAQ, { name: 'faq' })}<p style="margin-top:2rem" class="muted">Still stuck? ${textLink('/contact/', 'Contact us')}</p></div>`,

  warranty: () => html`
    <div class="tiles" style="margin-bottom:var(--space-8)" data-stagger>
      <div class="tile reveal"><span class="tile__value">20 yr</span><span class="tile__title">Total warranty period</span><p class="tile__text">On the cast body of every pan and pot, against manufacturing defects under normal household use.</p></div>
      <div class="tile reveal"><span class="tile__value">5 yr</span><span class="tile__title">No-charge period</span><p class="tile__text">A defective piece is replaced at no charge in the first five years.</p></div>
      <div class="tile reveal"><span class="tile__value">1/20</span><span class="tile__title">Prorated fee, years 6–20</span><p class="tile__text">1/20 of the regular retail price multiplied by the years since purchase, plus shipping.</p></div>
      <div class="tile reveal"><span class="tile__value">Receipt</span><span class="tile__title">Proof of purchase</span><p class="tile__text">Required with every claim. A fee may apply without one.</p></div>
    </div>
    <div class="prose">
      <h2>The “We Care” warranty</h2>
      <p>Highly skilled craftsmen using only the very best materials have constructed your Titanium Exclusive cookware in Germany. This warranty reflects our standards for the product and our commitment to your satisfaction. Your cookware has been manufactured anticipating zero defects under normal household use.</p>
      <h2>What is covered</h2>
      <p>Manufacturing defects in the cast body for 20 years from the date of purchase. In the event of a defect, we replace the item — at no charge within the first 5 years, and afterwards for the prorated fee above plus the cost of shipping. Replacing the cookware does not extend or restart the warranty period. If identical cookware is not available, we reserve the right to substitute a pan of equal or better value.</p>
      <h2>What is not covered</h2>
      <ul>
        <li>Lids. Remove lids before returning cookware.</li>
        <li>Scratches and marks from metal utensils.</li>
        <li>Sticky pans and food residue caused by improper cleaning. A sticky pan is a cleaning issue, not a defect — see <a href="/support/care/">Cleaning &amp; care</a>.</li>
        <li>Wear and tear around the rim.</li>
        <li>Products sold without warranty (the Titanium Cleaner, the cookie sheet and clearance items are marked as such).</li>
      </ul>
      <p>Warranties apply to products bought at regular retail price. If a product was discounted and a warranty issue arises, the difference between the discounted and regular price is payable for the warranty to apply. Titanium Exclusive Cookware is not responsible for representations made by distributors or sales representatives.</p>
      <p><strong>Note:</strong> the titanium surface cannot be worn off. If there is a defect with your cookware, the titanium will chip.</p>
      <h2>How to make a claim</h2>
      <ol>
        <li>Follow the <a href="/support/care/">cleaning instructions</a> first — most sticking is residue and clears with a dry Scotch-Brite scrub.</li>
        <li>Remove the lid. Clean the cookware so it is free of any residue; a dirty pan will not be assessed.</li>
        <li>Pack the cookware with a copy of your receipt in a sturdy box with bubble wrap or similar for a snug fit, and include contact details where we can reach you during business hours.</li>
        <li>Ship to: <strong>Titanium Exclusive Cookware, ${BRAND.address.street}, ${BRAND.address.city}, ${BRAND.address.region} ${BRAND.address.postal}</strong>. Shipping costs to and from the service centre are the customer’s responsibility.</li>
        <li>Claims are handled in order of receipt. We contact you within 5 business days of receiving your cookware. If you have not heard from us by then, call ${BRAND.phoneLocal} or toll-free ${BRAND.phoneTollFree}.</li>
      </ol>
      <p><small>The full warranty table is also printed at the bottom of your receipt.</small></p>
    </div>`,

  care: () => html`
    <div class="split" style="margin-bottom:var(--space-8);align-items:start">
      <div class="prose">
        <h2>Every wash</h2>
        <p>Scrub with a <strong>green 3M Scotch-Brite scouring pad</strong>, warm water and normal dish detergent. This prevents food from building up on the surface. Green Scotch-Brite pads are available with any cookware order.</p>
        <h2>Dishwasher</h2>
        <p>Not recommended. Many dishwasher detergents are highly acidic and may impair the cooking surface. Damage from dishwasher use is not a warranty claim.</p>
        <h2>Sprays and seasoning</h2>
        <p>You do not need to season the pan. <strong>Do not use non-stick sprays or oils</strong> on non-stick cookware: they leave an invisible build-up that impairs the release system.</p>
        <h2>Utensils and storage</h2>
        <p>Titanium is very hard, but it is not indestructible. Metal utensils will scratch the surface — use silicone. Do not stack pans directly on top of each other without protection between them.</p>
      </div>
      <div class="prose">
        <h2>If a pan starts to stick</h2>
        <p>An invisible layer has built up from sprays, oils or under-cleaning. Scrub the <strong>dry</strong> pan with a <strong>dry</strong> green Scotch-Brite pad — no soap, no water. This removes the residue and brings the surface back to its original condition. Then wash as usual.</p>
        <p>If these instructions are not followed after every use the cookware may become very sticky. Improper maintenance does not constitute a warranty claim: a sticky pan is a cleaning issue.</p>
        <p>${textLink('/product/titanium-cleaner-no-warranty/', 'Order the recommended cleaning pad')}</p>
      </div>
    </div>`,

  instructions: () => html`
    <div class="prose">
      <h2>Heat</h2>
      <p>The 8 mm cast base spreads heat evenly and holds it, and cast aluminium conducts heat about seven times faster than iron or steel. Medium is usually enough; you will rarely need high, and cooking times are shorter than you are used to.</p>
      <h2>Oil and water</h2>
      <p>Cook with little or no oil or water. The titanium surface releases food without fat, and with the lid on, vegetables cook in their own moisture — food keeps more of its nutrients and flavour, and meats stay juicy.</p>
      <h2>The vapour oven</h2>
      <p>Put the glass lid on and the pan becomes a stovetop oven. Use it to cook vegetables with no water, to poach eggs, to bring a roast up to its final internal temperature, or to reheat leftovers gently. The domed frying-pan lid adds extra vapour space. Whole meals can be cooked on the stovetop without turning the oven on.</p>
      <h2>Oven</h2>
      <p>Handles, glass lids and knobs are oven-proof to 260 °C / 500 °F, so a pan can go from stovetop to oven.</p>
      <h2>Stovetops</h2>
      <p>Gas, electric, ceramic and glass as standard. For induction, order the induction option shown on each product page.</p>
      <h2>What each pan does best</h2>
      <ul>
        <li><strong>Frying pans</strong> — steaks, cutlets, eggs, omelettes, fried potatoes and quick-fried foods. Add the lid for vegetables and poached eggs.</li>
        <li><strong>Sauce pans</strong> — dishes with sauces such as goulash or stuffed peppers; dumplings work especially well.</li>
        <li><strong>Casserole pans</strong> — braising, frying and steaming.</li>
        <li><strong>Roasting pots</strong> — braising, roasting and steaming; stovetop to oven.</li>
        <li><strong>Soup pots and steamers</strong> — stocks and soups; add steamer inserts under the lid to cook a second course above the first.</li>
        <li><strong>Woks, grill pans and crêpe pans</strong> — the same surface, shaped for stir-frying, searing and crêpes.</li>
      </ul>
      <h2>Utensils</h2>
      <p>Silicone or wood. Metal will scratch the surface. See <a href="/support/care/">Cleaning &amp; care</a>.</p>
    </div>`,

  shipping: () => html`
    <div class="prose">
      <h2>Where we ship</h2>
      <p>Across Canada and the United States, from our Toronto warehouse.</p>
      <h2>Cost</h2>
      <p>A flat shipping rate is added at checkout and shown before you pay. Prices are displayed in Canadian dollars or US dollars — switch at the bottom of any page — and are charged in the currency you choose.</p>
      <h2>Payment</h2>
      <p>Major credit cards through our secure checkout. Gift cards can be applied at checkout.</p>
      <h2>Returns</h2>
      <p>Please <a href="/contact/">contact us</a> before sending anything back so we can arrange the return with you. For a defect, see the <a href="/support/warranty/">warranty</a> — shipping to and from the service centre for warranty claims is the customer’s responsibility.</p>
      <h2>Questions about an order</h2>
      <p>Call ${BRAND.phoneTollFree} or email <a href="mailto:${BRAND.email}">${BRAND.email}</a> with your order number.</p>
    </div>`,

  videos: () => html`
    <div class="grid grid--2" data-stagger>${VIDEOS.slice(0, 2).map((v) => videoCard(v, { hero: true }))}</div>
    <div style="margin-top:var(--space-8)">
      ${sectionHead({ eyebrow: 'Bearing it All in the Kitchen', title: 'Three episodes with <em class="accent">Mathieu Beausoleil.</em>', lead: 'Shortlisted for the first three seasons of MasterChef Canada, winner of Food Network Canada’s Cook Like a Top Chef, and host of “Takin’ a Bite — Ottawa”.' })}
      <div class="grid grid--3" data-stagger>${VIDEOS.slice(2).map((v) => videoCard(v))}</div>
    </div>
    <p style="margin-top:2rem" class="muted">More on our <a href="${BRAND.youtube}" rel="noopener" target="_blank" style="text-decoration:underline">YouTube channel</a>.</p>`,
};
