// Entry point: wires the shared shell behaviours. Page-specific modules load themselves.
import { initNav } from './nav.js';
import { initMotion } from './motion.js';
import { initCart } from './cart.js';
import { initSearch } from './search.js';
import { initCurrency } from './currency.js';

document.documentElement.classList.remove('no-js');
initNav();
initMotion();
initCart();
initSearch();
initCurrency();

// Mark the document loaded for the staged hero entrance once fonts are usable.
const loaded = () => document.body.classList.add('is-loaded');
if (document.fonts && document.fonts.ready) {
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(loaded);
} else {
  setTimeout(loaded, 120);
}
