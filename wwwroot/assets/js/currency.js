// CAD / USD switch. WooCommerce Multi Currency reads the wmc_current_currency cookie,
// and the edge renders prices for whichever currency the cookie holds.
import { $$ } from './ui.js';

export function initCurrency() {
  $$('[data-currency]').forEach((btn) => btn.addEventListener('click', () => {
    const cur = btn.dataset.currency;
    const exp = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `wmc_current_currency=${cur}; path=/; expires=${exp}; secure; samesite=lax`;
    document.cookie = `wmc_current_currency_old=${cur}; path=/; expires=${exp}; secure; samesite=lax`;
    location.reload();
  }));
}
