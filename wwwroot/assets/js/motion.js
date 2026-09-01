// Scroll-driven and hover motion. transform/opacity only; honours prefers-reduced-motion.
import { $, $$, reducedMotion } from './ui.js?v=6';

export function initMotion() {
  reveals();
  heroParallax();
  stickyStory();
  hotspots();
  carousels();
  videoFacades();
  accordions();
}

function reveals() {
  const els = $$('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || reducedMotion()) { els.forEach((el) => el.classList.add('is-visible')); return; }
  // Stagger siblings inside grids/lists.
  $$('[data-stagger]').forEach((parent) => $$('.reveal', parent).forEach((el, i) => el.style.setProperty('--delay', `${Math.min(i, 8) * 70}ms`)));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

function heroParallax() {
  const img = $('[data-parallax]');
  if (!img || reducedMotion()) return;
  const strength = Number(img.dataset.parallax || 8);
  let ticking = false;
  const run = () => {
    const r = img.parentElement.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) { ticking = false; return; }
    const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
    img.style.transform = `translate3d(0, ${(-p * strength).toFixed(2)}%, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
  run();
}

function stickyStory() {
  const story = $('[data-story]');
  if (!story) return;
  const steps = $$('[data-step]', story);
  const imgs = $$('[data-step-img]', story);
  if (!steps.length) return;
  const activate = (i) => {
    steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
    imgs.forEach((im, j) => im.classList.toggle('is-active', i === j));
  };
  activate(0);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) activate(steps.indexOf(en.target)); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  steps.forEach((s) => io.observe(s));
}

function hotspots() {
  const root = $('[data-anatomy]');
  if (!root) return;
  const spots = $$('[data-hotspot]', root);
  const features = $$('[data-feature]', root);
  const set = (key) => {
    spots.forEach((s) => s.classList.toggle('is-active', s.dataset.hotspot === key));
    features.forEach((f) => { const on = f.dataset.feature === key; f.classList.toggle('is-active', on); f.setAttribute('aria-expanded', on ? 'true' : 'false'); });
  };
  spots.forEach((s) => { s.addEventListener('click', () => set(s.dataset.hotspot)); s.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') set(s.dataset.hotspot); }); });
  features.forEach((f) => { f.addEventListener('click', () => set(f.dataset.feature)); f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(f.dataset.feature); } }); });
  set(features[0] && features[0].dataset.feature);
  // Gentle auto-advance on desktop until the user interacts.
  if (!reducedMotion() && window.matchMedia('(min-width: 64em)').matches) {
    let i = 0; let stopped = false;
    const timer = setInterval(() => { if (stopped) return clearInterval(timer); i = (i + 1) % features.length; set(features[i].dataset.feature); }, 3800);
    root.addEventListener('pointerdown', () => { stopped = true; }, { once: true });
    root.addEventListener('keydown', () => { stopped = true; }, { once: true });
  }
}

function carousels() {
  $$('[data-carousel]').forEach((root) => {
    const track = $('.carousel__track', root);
    const prev = $('.carousel__btn--prev', root);
    const next = $('.carousel__btn--next', root);
    if (!track) return;
    const step = () => { const first = track.firstElementChild; return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24) : track.clientWidth * 0.8; };
    const updateBtns = () => {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reducedMotion() ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reducedMotion() ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns);
    updateBtns();
    // Mouse drag
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) { moved = true; track.classList.add('is-dragging'); } track.scrollLeft = startLeft - dx; });
    const up = () => { if (!down) return; down = false; track.classList.remove('is-dragging'); };
    track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up); track.addEventListener('pointerleave', up);
    track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });
}

function videoFacades() {
  $$('[data-video]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.video;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = el.dataset.title || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      el.replaceChildren(iframe);
      el.classList.add('is-playing');
    }, { once: true });
  });
}

// Animate <details> open/close height so accordions do not jump.
function accordions() {
  if (reducedMotion() || !('animate' in Element.prototype)) return;
  $$('details.accordion__item').forEach((d) => {
    const summary = $('summary', d);
    const panel = $('.accordion__panel', d);
    if (!summary || !panel) return;
    let anim = null;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) anim.cancel();
      if (d.open) {
        const h = panel.offsetHeight;
        anim = panel.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
        anim.onfinish = () => { d.open = false; panel.style.height = ''; anim = null; };
      } else {
        // Close siblings sharing the same name (exclusive accordion).
        if (d.getAttribute('name')) $$(`details[name="${d.getAttribute('name')}"][open]`).forEach((o) => { if (o !== d) o.open = false; });
        d.open = true;
        const h = panel.offsetHeight;
        anim = panel.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
        anim.onfinish = () => { anim = null; };
      }
    });
  });
}
