// Shopper currency: cookie first, then Cloudflare's country lookup.
import { SITE } from '../config.js';

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function currencyFor(request) {
  const cookie = readCookie(request.headers.get('cookie'), SITE.currencyCookie);
  if (cookie && SITE.currencies.includes(cookie)) return cookie;
  const country = request.cf && request.cf.country;
  return country === 'US' ? 'USD' : SITE.defaultCurrency;
}
