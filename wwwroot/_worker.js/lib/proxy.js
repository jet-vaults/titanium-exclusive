// Reverse proxy to the WordPress / WooCommerce origin.
//
// WordPress keeps titaniumexclusive.com as its site URL. The browser only ever talks to
// this host, so WooCommerce session cookies, nonces, add-to-cart, checkout, account pages
// and the admin all keep working exactly as before. The new front-end simply replaces
// how catalog and content pages are rendered.

import { WP } from '../config.js';

const HOP_BY_HOP = ['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'proxy-connection', 'te', 'trailer', 'content-length'];

export function isProxiedPath(url) {
  const p = url.pathname;
  if (WP.proxyPrefixes.some((prefix) => p === prefix || p.startsWith(prefix))) return true;
  for (const key of WP.proxyQueryKeys) if (url.searchParams.has(key)) return true;
  return false;
}

// Decide the shopper's currency from the WooCommerce Multi Currency cookie, falling back
// to Cloudflare's country lookup (WooCommerce would otherwise geolocate the edge, not the user).
export function currencyFor(request) {
  const cookie = readCookie(request.headers.get('cookie'), WP.currencyCookie);
  if (cookie && /^[A-Z]{3}$/.test(cookie)) return cookie;
  const country = request.cf && request.cf.country;
  return country === 'US' ? 'USD' : 'CAD';
}

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function originRequest(request, url, currency) {
  const target = new URL(url.pathname + url.search, WP.originUrl);
  const headers = new Headers(request.headers);
  for (const h of HOP_BY_HOP) headers.delete(h);
  headers.set('host', new URL(WP.originUrl).host);
  headers.set('x-forwarded-host', url.host);
  headers.set('x-forwarded-proto', 'https');
  headers.set('accept-encoding', 'identity');
  // Make sure WooCommerce Multi Currency sees the shopper's currency even on the first request.
  const cookie = headers.get('cookie') || '';
  if (!new RegExp(`(?:^|;\\s*)${WP.currencyCookie}=`).test(cookie)) {
    headers.set('cookie', cookie ? `${cookie}; ${WP.currencyCookie}=${currency}` : `${WP.currencyCookie}=${currency}`);
  }
  const init = {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'manual',
  };
  if (WP.resolveOverride) init.cf = { resolveOverride: WP.resolveOverride };
  return new Request(target.toString(), init);
}

export async function proxyToWordPress(request, url) {
  const currency = currencyFor(request);
  const upstream = await fetch(originRequest(request, url, currency));
  const headers = new Headers(upstream.headers);
  for (const h of HOP_BY_HOP) headers.delete(h);
  headers.delete('content-encoding');
  // Keep redirects on this host (WordPress emits absolute URLs on its site URL).
  const location = headers.get('location');
  if (location) headers.set('location', rewriteToHost(location, url));
  // Session cookies must be scoped to the host the browser is on.
  const cookies = upstream.headers.getSetCookie ? upstream.headers.getSetCookie() : [];
  headers.delete('set-cookie');
  for (const c of cookies) headers.append('set-cookie', c.replace(/;\s*domain=[^;]*/i, ''));
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
}

export function rewriteToHost(location, url) {
  try {
    const target = new URL(location, WP.originUrl);
    const origin = new URL(WP.originUrl);
    if (target.host === origin.host) {
      target.protocol = 'https:';
      target.host = url.host;
      return target.toString();
    }
  } catch { /* leave as-is */ }
  return location;
}

// Server-side fetch of an origin URL (used for the Store API and page scraping).
export async function fetchOrigin(path, init = {}, currency = WP.defaultCurrency) {
  const target = new URL(path, WP.originUrl);
  const headers = new Headers(init.headers || {});
  headers.set('accept', headers.get('accept') || 'application/json');
  headers.set('user-agent', 'TitaniumExclusive-Edge/1.0');
  headers.set('cookie', `${WP.currencyCookie}=${currency}; wmc_current_currency_old=${currency}`);
  const options = { ...init, headers };
  if (WP.resolveOverride) options.cf = { ...(init.cf || {}), resolveOverride: WP.resolveOverride };
  return fetch(target.toString(), options);
}
