import { html } from '../lib/html.js';
import { CHECKOUT } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { button, breadcrumbs, productCard, sectionHead } from '../ui/components.js';
import { featuredProducts } from '../lib/store.js';
import { BRAND } from '../content/brand.js';

export async function renderCart(c) {
  const shell = await shellData(c);
  const picks = featuredProducts(shell.products, 4);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart/' }];
  return page(c, {
    shell,
    title: 'Your cart',
    description: 'Review your Titanium Exclusive order.',
    noindex: true,
    bodyClass: 'page-cart',
    body: html`
      <section class="container page-hero">
        ${breadcrumbs(crumbs)}
        <h1 class="page-hero__title">Your <em class="accent">cart.</em></h1>
      </section>
      <div class="container cart-page">
        <div class="cart-page__lines">
          <ul class="cart-lines" data-cart-page-lines></ul>
          <div class="cart-empty" data-cart-page-empty>
            <p class="cart-empty__title">Your cart is empty.</p>
            <p class="cart-empty__text">Cookware hand-cast in Germany, built to outlast the kitchen it lives in.</p>
            ${button({ href: '/shop/', label: 'Shop cookware' })}
          </div>
        </div>
        <aside class="cart-page__summary" data-cart-page-summary hidden>
          <h2>Summary</h2>
          <div class="cart-totals__row"><span>Subtotal</span><strong data-cart-page-subtotal></strong></div>
          <p class="cart-totals__note">Shipping and taxes are calculated when you check out.</p>
          ${button({ href: CHECKOUT.url || '/checkout/', label: 'Proceed to checkout', size: 'block' })}
          <p class="muted" style="font-size:var(--text-xs);text-align:center">20-year warranty on every cast piece</p>
        </aside>
      </div>
      <section class="section section--line">
        <div class="container">
          ${sectionHead({ eyebrow: 'Complete the set', title: 'Often bought <em class="accent">together.</em>', link: { href: '/shop/', label: 'Shop all' } })}
          <div class="grid grid--4 grid--products" data-stagger>${picks.map((p) => productCard(p))}</div>
        </div>
      </section>`,
  });
}

// Placeholder until a commerce back-end is connected (see CHECKOUT in config.js).
export async function renderCheckout(c) {
  if (CHECKOUT.url) return Response.redirect(CHECKOUT.url, 302);
  const shell = await shellData(c);
  return page(c, {
    shell,
    title: 'Checkout',
    description: 'Complete your Titanium Exclusive order.',
    noindex: true,
    bodyClass: 'page-checkout',
    body: html`
      <section class="container page-hero">
        ${breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart/' }, { label: 'Checkout', href: '/checkout/' }])}
        <h1 class="page-hero__title">Almost <em class="accent">there.</em></h1>
        <p class="lead">Online checkout is being connected. Until it is live, we take orders by phone and email — call ${BRAND.phoneTollFree} or write to <a href="mailto:${BRAND.email}" style="text-decoration:underline">${BRAND.email}</a> with the pieces below and we will confirm the total, shipping and payment with you directly.</p>
      </section>
      <div class="container cart-page" style="padding-bottom:var(--section)">
        <div class="cart-page__summary" style="position:static">
          <h2>Your order</h2>
          <div data-checkout-summary></div>
        </div>
        <div>
          <div class="btn-row">
            ${button({ href: `tel:${BRAND.phoneTollFreeTel}`, label: `Call ${BRAND.phoneTollFree}`, size: 'lg' })}
            ${button({ href: '/contact/', label: 'Send a message', variant: 'secondary', size: 'lg' })}
          </div>
          <p class="muted" style="margin-top:1.5rem;font-size:var(--text-sm)">Your cart is saved in this browser and will be here when you return.</p>
        </div>
      </div>`,
  });
}
