import { html } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { button, sectionHead, breadcrumbLd, photoPlaceholder } from '../ui/components.js';
import { getReviews } from '../lib/store.js';
import { BRAND, IMG } from '../content/brand.js';

const TIMELINE = [
  { year: '1995', title: 'The original titanium cookware', text: 'Titanium Exclusive begins selling hand-cast, titanium-surfaced cookware from a German foundry to Canadian kitchens — the tagline “The Original Titanium since 1995” dates from here.' },
  { year: '1999', title: 'Trademark filed in the United States', text: 'The TITANIUM EXCLUSIVE mark is filed with the USPTO for cooking pots and frying pans, with first use in commerce recorded as 1 January 2000.' },
  { year: '2000', title: 'Trade shows, and a gold membership', text: 'Live demonstrations at fairs across Canada — cooking without oil or water in front of thousands. The company joins the Canadian Gift & Tableware Association, later recognised as a Gold Member in good standing since 2000.' },
  { year: '2001', title: 'Registered in Canada and the US', text: 'The Canadian Intellectual Property Office registers TITANIUM EXCLUSIVE (TMA542,255) in March; the USPTO follows in December (Reg. No. 2,520,815).' },
  { year: '2010 – 2019', title: 'A decade of recognition', text: 'Exhibitor awards for five years at the Western Fair, ten years at Canadian Western Agribition, twelve years at the Winnipeg Wellness Expo, and a certificate of appreciation from the Royal Agricultural Winter Fair.' },
  { year: 'Today', title: 'Sold across Canada and the United States', text: 'The same foundry, the same 8 mm base, the same 20-year warranty — now also online, shipped from Toronto, with owners writing in about pans that have lasted twenty years and more.' },
];

const RECOGNITION = [
  { img: IMG.cgta, cap: 'Canadian Gift & Tableware Association — Gold Member in good standing since March 2000.' },
  { img: IMG.cipo, cap: 'Canadian trade-mark registration TMA542,255, 13 March 2001.' },
  { img: IMG.uspto, cap: 'US trade-mark Reg. No. 2,520,815, 18 December 2001 — cooking pots and frying pans.' },
  { img: IMG.agribition, cap: 'Canadian Western Agribition, Regina — ten years as an exhibitor, 2016.' },
  { img: IMG.winnipeg, cap: 'Winnipeg Wellness Expo — twelve-year participant, 2019.' },
  { img: IMG.royal, cap: 'The Royal Agricultural Winter Fair, Toronto — certificate of appreciation, 2012.' },
  { img: IMG.pressLondon2000, cap: 'The London Free Press, September 2000 — “Gourmet gadgets” at the Western Fair.' },
  { img: IMG.booth2000, cap: 'An early Titanium Exclusive trade-show stand.' },
];

export async function renderStory(c) {
  const shell = await shellData(c);
  const reviews = await getReviews(c.ctx).catch(() => []);
  const longOwners = reviews.filter((r) => /20\+? years|over 20|20 years ago/i.test(r.text)).slice(0, 2);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Our Story', href: '/our-story/' }];
  return page(c, {
    shell,
    title: 'Our story — since 1995',
    description: 'Titanium Exclusive has sold hand-cast German titanium cookware in Canada and the United States since 1995. Trademarks registered in 2001, decades of live demonstrations, and a 20-year warranty.',
    bodyClass: 'page-story',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin)],
    body: html`
      <section class="container page-hero">
        <p class="eyebrow">Our story</p>
        <h1 class="page-hero__title">Thirty years of selling <em class="accent">one idea.</em></h1>
        <p class="lead">Cast the pan thick. Surface it with titanium. Stand behind it for twenty years. Titanium Exclusive has done that since 1995 — first at fairs across Canada, now across North America.</p>
      </section>

      <section class="container section--sm">
        <figure class="media reveal reveal--mask" style="--ratio:21/9"><img src="${IMG.ingots}" alt="Stacked aluminium ingots in the foundry" width="2000" height="1200" loading="lazy"></figure>
      </section>

      <section class="section">
        <div class="container split">
          <div class="split__text">
            <p class="eyebrow">Philosophy</p>
            <h2 class="h2">Buy it once. <em class="accent">Cook in it for decades.</em></h2>
            <p>Most cookware is designed to be replaced. Ours is designed to be kept: a cast body that does not warp, a titanium surface that does not need re-coating, a handle with nothing to loosen, and a warranty that runs for twenty years.</p>
            <p>That is why we have always sold it the slow way — in person, cooking in front of you — and why the people who bought a pan at a fair in 2003 come back for a second piece rather than a replacement.</p>
          </div>
          <figure class="media reveal reveal--mask"><img src="${IMG.panTexture}" alt="The titanium cooking surface of a Titanium Exclusive pan" width="1000" height="800" loading="lazy"></figure>
        </div>
      </section>

      <section class="section theme-dark">
        <div class="container split split--reverse">
          <figure class="media reveal reveal--mask"><img src="${IMG.lathe}" alt="A cast pan body being turned flat on a lathe" width="1000" height="1000" loading="lazy"></figure>
          <div class="split__text">
            <p class="eyebrow">Germany</p>
            <h2 class="h2">Hand-cast in a <em class="accent">German foundry.</em></h2>
            <p>Every piece begins as molten aluminium alloy poured by hand into a mould. It is turned flat on the lathe, bonded with the patented titanium surface, fitted with the screw-less handle that earned the TÜV Rheinland safety label, and matched with a hardened borosilicate glass lid.</p>
            <p>Highly skilled craftsmen, the very best materials, and a process that has not been hurried in thirty years.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead({ eyebrow: 'Timeline', title: '1995 to <em class="accent">today.</em>' })}
          <div class="timeline" data-stagger>
            ${TIMELINE.map((t) => html`<div class="timeline__item reveal"><span class="timeline__year">${t.year}</span><div><h3 class="timeline__title">${t.title}</h3><p class="timeline__text">${t.text}</p></div></div>`)}
          </div>
        </div>
      </section>

      <section class="section section--line">
        <div class="container split">
          <figure class="media media--wide reveal reveal--mask"><img src="${IMG.tradeShow}" alt="A Titanium Exclusive demonstration stand at a convention centre" width="1024" height="576" loading="lazy"></figure>
          <div class="split__text">
            <p class="eyebrow">Trade-show heritage</p>
            <h2 class="h2">Cooked in front of <em class="accent">thousands.</em></h2>
            <p>From the Western Fair in London, Ontario to Agribition in Regina, the Royal Winter Fair in Toronto and home shows from Denver to Vancouver Island — for more than two decades our pans have been sold the hardest way there is: by cooking in them, without oil or water, while people watch.</p>
            ${longOwners.length ? html`<blockquote class="review-card__quote" style="border-left:2px solid var(--bronze);padding-left:1.25rem;font-size:var(--text-lg)">${longOwners[0].text}</blockquote><p class="muted" style="font-size:var(--text-sm)">— ${longOwners[0].reviewer}, verified purchase</p>` : ''}
          </div>
        </div>
      </section>

      <section class="section section--line" id="recognition">
        <div class="container">
          ${sectionHead({ eyebrow: 'Recognition', title: 'On the record.', lead: 'Registrations, memberships and exhibitor recognitions from three decades of business.' })}
          <div class="recognition" data-stagger>
            ${RECOGNITION.map((r) => html`<figure class="reveal"><img src="${r.img}" alt="${r.cap}" loading="lazy" width="800" height="600"><figcaption>${r.cap}</figcaption></figure>`)}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <div class="split__text">
            <p class="eyebrow">Toronto</p>
            <h2 class="h2">North American <em class="accent">home.</em></h2>
            <p>Titanium Exclusive Cookware Inc. is based at 290 Nantucket Boulevard in Toronto, Ontario. Orders ship from here across Canada and the United States, warranty claims come back here, and the phone is answered here — toll-free on ${BRAND.phoneTollFree}.</p>
            <div class="btn-row">${button({ href: '/shop/', label: 'Shop cookware' })}${button({ href: '/contact/', label: 'Contact us', variant: 'secondary' })}</div>
          </div>
          ${photoPlaceholder('The Toronto team and warehouse — a portrait of the people who answer the phone', { ratio: '4/5' })}
        </div>
      </section>`,
  });
}
