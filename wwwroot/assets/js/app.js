// Entry point: wires the shared shell behaviours. Page-specific modules load themselves.
import { initNav } from './nav.js?v=5';
import { initMotion } from './motion.js?v=5';
import { initCart } from './cart.js?v=5';
import { initSearch } from './search.js?v=5';
import { initCurrency } from './currency.js?v=5';

document.documentElement.classList.remove('no-js');
initNav();
initMotion();
initCart();
initSearch();
initCurrency();

// Mark the document loaded for the staged hero entrance once fonts are usable.
// Start the staged hero entrance right away; fonts swap in as they arrive.
requestAnimationFrame(() => document.body.classList.add('is-loaded'));
