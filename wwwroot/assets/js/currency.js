// CAD / USD switch. The choice is stored in a cookie the edge reads when rendering prices.
import { $$ } from './ui.js';

export function initCurrency() {
  $$('.currency__opt[data-currency]').forEach((btn) => btn.addEventListener('click', () => {
    const cur = btn.dataset.currency;
    const exp = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `te_currency=${cur}; path=/; expires=${exp}; secure; samesite=lax`;
    location.reload();
  }));
}
