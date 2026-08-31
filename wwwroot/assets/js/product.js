// Product page: gallery, options (add-ons / variations), quantity, add to cart, sticky bar.
import { $, $$, toast, money, reducedMotion } from './ui.js';
import { addItem, addWithForm, open as openCart } from './cart.js';

const form = $('[data-buy-form]');
if (form) init(form);

function init(form) {
  const cfg = JSON.parse(form.dataset.product);
  const qtyInput = $('[data-qty-input]', form);
  const totalEl = $('[data-buy-total]', form);
  const submit = $('[data-buy-submit]', form);
  const stickyTotal = $('[data-sticky-total]');

  // ---- Price calculation (add-ons are flat fees added by WooCommerce; mirrored here for display)
  const recalc = () => {
    let unit = cfg.price;
    $$('input[data-addon-price]:checked', form).forEach((i) => { unit += Math.round(Number(i.dataset.addonPrice) * 100); });
    const variation = selectedVariation();
    if (variation && variation.price) unit = variation.price;
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    const text = money(unit * qty, cfg.currency, cfg.minorUnit);
    if (totalEl) totalEl.textContent = text;
    if (stickyTotal) stickyTotal.textContent = text;
  };

  // ---- Variations (only the few household products)
  function selectedVariation() {
    if (!cfg.variations || !cfg.variations.length) return null;
    const chosen = {};
    $$('[data-attr]', form).forEach((sel) => { chosen[sel.dataset.attr] = sel.value; });
    return cfg.variations.find((v) => v.attributes.every((a) => !chosen[a.name] || chosen[a.name] === a.value)) || null;
  }

  // ---- Quantity
  $$('[data-qty]', form).forEach((b) => b.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) + Number(b.dataset.qty)); recalc(); }));
  form.addEventListener('change', recalc);
  qtyInput.addEventListener('input', recalc);
  recalc();

  // ---- Add to cart
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cfg.inStock) return;
    if (cfg.variations && cfg.variations.length && !selectedVariation()) { toast('Please choose an option first.', { error: true }); return; }
    submit.classList.add('is-busy');
    try {
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      if (cfg.hasAddons) {
        const fd = new FormData();
        fd.append('add-to-cart', cfg.id);
        fd.append('quantity', qty);
        $$('input[data-addon-price]:checked', form).forEach((i) => fd.append(i.name, i.value));
        await addWithForm(cfg.permalink, fd);
      } else if (cfg.variations && cfg.variations.length) {
        const v = selectedVariation();
        await addItem(v.id, qty, v.attributes.map((a) => ({ attribute: a.name, value: a.value })));
      } else {
        await addItem(cfg.id, qty);
      }
      toast(`${cfg.name} added to your cart`);
      openCart();
    } catch (err) {
      toast(err.message || 'Could not add to cart', { error: true });
    } finally { submit.classList.remove('is-busy'); }
  });

  // ---- Sticky bar appears once the buy button scrolls out of view
  const bar = $('[data-sticky-bar]');
  if (bar && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => bar.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(submit);
    $('[data-sticky-submit]', bar)?.addEventListener('click', () => { form.requestSubmit(); });
  }

  gallery();
}

function gallery() {
  const g = $('[data-gallery]');
  if (!g) return;
  const main = $('.gallery__main', g);
  const mainImg = main && $('img', main);
  const thumbs = $$('.gallery__thumb', g);
  const track = $('.gallery__track', g);
  const dots = $$('.gallery__dots span', g);

  thumbs.forEach((t, i) => t.addEventListener('click', () => {
    thumbs.forEach((x) => x.classList.toggle('is-active', x === t));
    if (!mainImg) return;
    if (reducedMotion()) { mainImg.src = t.dataset.full; return; }
    main.classList.add('is-fading');
    setTimeout(() => { mainImg.src = t.dataset.full; mainImg.alt = t.dataset.alt || ''; mainImg.onload = () => main.classList.remove('is-fading'); }, 160);
  }));

  // Hover zoom on desktop; click toggles.
  if (main && mainImg) {
    main.addEventListener('click', () => main.classList.toggle('is-zoomed'));
    main.addEventListener('pointermove', (e) => {
      if (!main.classList.contains('is-zoomed')) return;
      const r = main.getBoundingClientRect();
      mainImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    main.addEventListener('pointerleave', () => main.classList.remove('is-zoomed'));
  }

  // Mobile swipe track: sync dots.
  if (track && dots.length) {
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { const i = Math.round(track.scrollLeft / track.clientWidth); dots.forEach((d, j) => d.classList.toggle('is-active', j === i)); ticking = false; });
    }, { passive: true });
  }
}
