import { html, raw } from '../lib/html.js';
import { SITE, CONTACT } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { breadcrumbs, breadcrumbLd, button } from '../ui/components.js';
import { BRAND } from '../content/brand.js';

export async function renderContact(c) {
  const shell = await shellData(c);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }];
  const mapQuery = encodeURIComponent(`${BRAND.address.street}, ${BRAND.address.city}, ${BRAND.address.region} ${BRAND.address.postal}`);
  return page(c, {
    shell,
    title: 'Contact',
    description: `Contact Titanium Exclusive in Toronto: ${BRAND.phoneTollFree}, ${BRAND.email}, ${BRAND.address.street}, ${BRAND.address.city}.`,
    bodyClass: 'page-contact',
    scripts: ['/assets/js/forms.js'],
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), contactLd()],
    body: html`
      <section class="container page-hero">
        ${breadcrumbs(crumbs)}
        <h1 class="page-hero__title">Talk to a <em class="accent">person.</em></h1>
        <p class="lead">Questions about a pan, an order or a warranty claim — call, write, or send the form. We answer during regular business hours, Eastern Time.</p>
      </section>
      <section class="container contact-grid" style="padding-bottom:var(--section)">
        <dl class="contact-list">
          <div><dt>Toll-free</dt><dd><a href="tel:${BRAND.phoneTollFreeTel}">${BRAND.phoneTollFree}</a></dd></div>
          <div><dt>Toronto</dt><dd><a href="tel:${BRAND.phoneLocalTel}">${BRAND.phoneLocal}</a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:${BRAND.email}">${BRAND.email}</a></dd></div>
          <div><dt>Address</dt><dd>${BRAND.legalName}<br>${BRAND.address.street}<br>${BRAND.address.city}, ${BRAND.address.region} ${BRAND.address.postal}<br><a href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" rel="noopener" target="_blank" class="link-arrow link-arrow--sm" style="margin-top:.5rem"><span>Open in Maps</span></a></dd></div>
          <div><dt>Warranty returns</dt><dd>Read <a href="/support/warranty/" style="text-decoration:underline">how to make a claim</a> before shipping cookware to us.</dd></div>
          <div><dt>Follow</dt><dd><a href="${BRAND.instagram}" rel="noopener" target="_blank">Instagram</a> · <a href="${BRAND.youtube}" rel="noopener" target="_blank">YouTube</a></dd></div>
        </dl>
        <form class="form" data-contact-form data-endpoint="${CONTACT.endpoint}" data-fallback-email="${BRAND.email}" novalidate>
          ${CONTACT.accessKey ? html`<input type="hidden" name="access_key" value="${CONTACT.accessKey}">` : ''}
          <input type="hidden" name="from_name" value="titaniumexclusive.com contact form">
          <div class="form__row">
            <div class="field"><label class="field__label" for="f-name">Name</label><input class="input" id="f-name" name="name" type="text" autocomplete="name" required><span class="field__error">Please enter your name.</span></div>
            <div class="field"><label class="field__label" for="f-email">Email</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required inputmode="email"><span class="field__error">Please enter a valid email address.</span></div>
          </div>
          <div class="field"><label class="field__label" for="f-phone">Phone <span class="muted">(optional)</span></label><input class="input" id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"><span class="field__error">Please check the phone number.</span></div>
          <fieldset class="field"><legend class="field__label">Reason</legend>
            <div class="form__choices">
              <label class="choice"><input type="radio" name="reason" value="General" checked><span class="choice__text"><span class="choice__title">General</span></span></label>
              <label class="choice"><input type="radio" name="reason" value="Sales"><span class="choice__text"><span class="choice__title">Sales</span></span></label>
              <label class="choice"><input type="radio" name="reason" value="Support"><span class="choice__text"><span class="choice__title">Support</span></span></label>
            </div>
          </fieldset>
          <div class="field"><label class="field__label" for="f-message">Message</label><textarea class="input" id="f-message" name="message" required minlength="10"></textarea><span class="field__error">Please tell us a little more (at least 10 characters).</span></div>
          <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave this field empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <div class="form-status" data-form-status role="status" aria-live="polite"></div>
          <div class="btn-row">${button({ label: 'Send message', type: 'submit', size: 'lg' })}<span class="muted" style="font-size:var(--text-xs)">We reply within one business day.</span></div>
        </form>
      </section>`,
  });
}

function contactLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: SITE.name,
      telephone: BRAND.phoneTollFreeTel,
      email: BRAND.email,
      address: { '@type': 'PostalAddress', streetAddress: BRAND.address.street, addressLocality: BRAND.address.city, addressRegion: BRAND.address.region, postalCode: BRAND.address.postal, addressCountry: BRAND.address.country },
    },
  };
}
