// Header behaviour: compact on scroll, hide on scroll-down, mega menu, mobile drawer.
import { $, $$, openDialog, lockScroll, unlockScroll } from './ui.js?v=3';

export function initNav() {
  const header = $('[data-header]');
  if (!header) return;

  // Scroll state
  let lastY = window.scrollY, ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (y > 480 && goingDown && !header.classList.contains('has-open-menu')) header.classList.add('is-hidden');
    else if (goingUp || y < 480) header.classList.remove('is-hidden');
    lastY = y; ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();

  // Mega menu (hover intent on desktop, click toggles for touch/keyboard)
  $$('[data-mega-item]').forEach((item) => {
    const trigger = $('[data-mega-trigger]', item);
    let openTimer, closeTimer;
    const open = () => { clearTimeout(closeTimer); item.classList.add('is-open'); header.classList.add('has-open-menu'); trigger.setAttribute('aria-expanded', 'true'); };
    const close = () => { clearTimeout(openTimer); item.classList.remove('is-open'); header.classList.remove('has-open-menu'); trigger.setAttribute('aria-expanded', 'false'); };
    item.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') openTimer = setTimeout(open, 90); });
    item.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { clearTimeout(openTimer); closeTimer = setTimeout(close, 160); } });
    trigger.addEventListener('click', (e) => {
      // First tap/click on touch or keyboard opens the panel; a second activates the link.
      if (!item.classList.contains('is-open')) { e.preventDefault(); open(); }
    });
    item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); trigger.focus(); } });
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) close(); });
    document.addEventListener('click', (e) => { if (!item.contains(e.target)) close(); });
  });

  // Mobile navigation
  const mobile = $('[data-mobile-nav]');
  if (mobile) {
    const panel = $('.mobile-nav__panel', mobile);
    let close = null;
    const doOpen = () => {
      if (close) return;
      lockScroll('menu');
      $$('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
      close = openDialog(mobile, panel, { onClose: () => { unlockScroll('menu'); close = null; $$('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'false')); } });
    };
    $$('[data-menu-open]').forEach((b) => b.addEventListener('click', doOpen));
    $$('[data-menu-close]', mobile).forEach((b) => b.addEventListener('click', () => close && close()));
    // Close when a menu link is followed (e.g. anchor on the same page) or when opening search/cart from it.
    mobile.addEventListener('click', (e) => { if (e.target.closest('a[href], [data-search-open], [data-cart-open]')) close && close(); });
  }
}
