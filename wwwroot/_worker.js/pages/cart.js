import { html } from '../lib/html.js';
import { page, shellData } from '../ui/layout.js';
import { button, breadcrumbs, productCard, sectionHead } from '../ui/components.js';
import { featuredProducts } from '../lib/store.js';

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
          <div class="cart-totals__row" data-cart-page-discount hidden><span>Discount</span><strong></strong></div>
          <p class="cart-totals__note">Shipping and taxes are calculated at checkout. Coupons and gift cards can be applied there.</p>
          ${button({ href: '/checkout/', label: 'Proceed to checkout', size: 'block' })}
          <p class="muted" style="font-size:var(--text-xs);text-align:center">Secure checkout · 20-year warranty on every cast piece</p>
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
