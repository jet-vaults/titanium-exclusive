// Product page: gallery, options (add-ons / variations), quantity, add to cart, sticky bar.
import { $, $$, toast, money, reducedMotion } from './ui.js';
import { addLine, open as openCart } from './cart.js';

const form = $('[data-buy-form]');
if (form) init(form);

function init(form) {
  const cfg = JSON.parse(form.dataset.product);
  const qtyInput = $('[data-qty-input]', form);
  const totalEl = $('[data-buy-total]', form);
  const submit = $('[data-buy-submit]', form);
  const stickyTotal = $('[data-sticky-total]');

  const selectedOptions = () => $$('input[data-addon-price]:checked', form).map((i) => ({
    field: i.name, value: i.value, label: i.dataset.addonLabel || i.value, price: Math.round(Number(i.dataset.addonPrice) * 100),
  }));

  function selectedVariation() {
    if (!cfg.variations || !cfg.variations.length) return null;
    const chosen = {};
    $$('[data-attr]', form).forEach((sel) => { chosen[sel.dataset.attr] = sel.value; });
    if (Object.values(chosen).some((v) => !v)) return null;
    return cfg.variations.find((v) => v.attributes.every((a) => !a.value || chosen[a.name] === a.value)) || null;
  }

  const recalc = () => {
    const unit = cfg.price + selectedOptions().reduce((s, o) => s + o.price, 0);
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    const text = money(unit * qty, cfg.currency, cfg.minorUnit);
    if (totalEl) totalEl.textContent = text;
    if (stickyTotal) stickyTotal.textContent = text;
  };

  $$('[data-qty]', form).forEach((b) => b.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) + Number(b.dataset.qty)); recalc(); }));
  form.addEventListener('change', recalc);
  qtyInput.addEventListener('input', recalc);
  recalc();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!cfg.inStock) return;
    const variation = selectedVariation();
    if (cfg.variations && cfg.variations.length && !variation) { toast('Please choose an option first.', { error: true }); $('[data-attr]', form)?.focus(); return; }
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    addLine({
      id: cfg.id, name: cfg.name, permalink: cfg.permalink, image: cfg.image, price: cfg.price, currency: cfg.currency, minorUnit: cfg.minorUnit,
      max: cfg.max, soldIndividually: cfg.soldIndividually, options: selectedOptions(),
      variation: variation ? variation.attributes.map((a) => ({ name: a.name, value: a.value })) : [], variationId: variation ? variation.id : null,
    }, qty);
    toast(`${cfg.name} added to your cart`);
    openCart();
  });

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

  thumbs.forEach((t) => t.addEventListener('click', () => {
    thumbs.forEach((x) => x.classList.toggle('is-active', x === t));
    if (!mainImg) return;
    if (reducedMotion()) { mainImg.src = t.dataset.full; return; }
    main.classList.add('is-fading');
    setTimeout(() => { mainImg.src = t.dataset.full; mainImg.alt = t.dataset.alt || ''; mainImg.onload = () => main.classList.remove('is-fading'); }, 180);
  }));

  if (main && mainImg) {
    main.addEventListener('click', () => main.classList.toggle('is-zoomed'));
    main.addEventListener('pointermove', (e) => {
      if (!main.classList.contains('is-zoomed')) return;
      const r = main.getBoundingClientRect();
      mainImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    main.addEventListener('pointerleave', () => main.classList.remove('is-zoomed'));
  }

  if (track && dots.length) {
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { const i = Math.round(track.scrollLeft / track.clientWidth); dots.forEach((d, j) => d.classList.toggle('is-active', j === i)); ticking = false; });
    }, { passive: true });
  }
}
