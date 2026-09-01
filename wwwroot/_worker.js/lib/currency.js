// Shopper currency: cookie first, then Cloudflare's country lookup.
// Also fetches the CAD->USD reference rate (ECB via frankfurter.dev) with caching + fallback.
import { SITE, CURRENCY } from '../config.js';

let rateCache = { rate: CURRENCY.fallbackUsdRate, at: 0, real: false };

export async function getUsdRate(ctx) {
  const now = Date.now();
  if (rateCache.real && now - rateCache.at < CURRENCY.rateTtlMs) return rateCache.rate;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=CAD&symbols=USD', { signal: ctl.signal, cf: { cacheTtl: 43200, cacheEverything: true } });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const r = Number(data && data.rates && data.rates.USD);
      if (r > 0.4 && r < 1.2) { rateCache = { rate: r, at: now, real: true }; return r; }
    }
  } catch { /* fall through to cached/fallback */ }
  rateCache.at = now - CURRENCY.rateTtlMs + 10 * 60 * 1000; // retry in 10 min
  return rateCache.rate;
}

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
