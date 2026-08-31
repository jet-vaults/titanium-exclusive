// Titanium Exclusive — Cloudflare Pages edge worker.
//
// Responsibilities
//   1. Render storefront pages at the edge from the live WooCommerce Store API.
//   2. Pass WooCommerce checkout, account, admin, media and REST traffic through
//      to the WordPress origin so all existing commerce keeps working untouched.
//   3. Serve the static design assets in wwwroot/ for everything else.

import { REDIRECTS } from './config.js';
import { isProxiedPath, proxyToWordPress, currencyFor } from './lib/proxy.js';
import { routes } from './routes.js';
import { renderError } from './pages/error.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Static design assets never go through the router.
    if (path.startsWith('/assets/') || path === '/favicon.ico' || path === '/robots.txt' || path === '/sitemap.xml' || path.startsWith('/.well-known/')) {
      if (path === '/sitemap.xml') return routes.sitemap(makeCtx(request, env, ctx, url));
      return env.ASSETS.fetch(request);
    }

    // Everything WooCommerce owns is proxied verbatim. Any non-GET request (classic
    // add-to-cart, form posts, AJAX) belongs to WordPress as well.
    if (isProxiedPath(url) || (request.method !== 'GET' && request.method !== 'HEAD')) return proxyToWordPress(request, url);

    // Legacy URL redirects (301) for pages whose address changed in the redesign.
    const redirect = REDIRECTS[path] || REDIRECTS[path + '/'];
    if (redirect && redirect !== path) {
      const target = new URL(redirect, url.origin);
      if (!target.search) target.search = url.search;
      return Response.redirect(target.toString(), 301);
    }

    // Canonical trailing slash for page routes (not for files).
    if (!path.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(path) && path !== '/search') {
      return Response.redirect(new URL(path + '/' + url.search, url.origin).toString(), 301);
    }

    const c = makeCtx(request, env, ctx, url);
    try {
      for (const route of routes.table) {
        const m = route.pattern.exec(path);
        if (m) {
          if (route.methods && !route.methods.includes(request.method)) continue;
          return await route.handler(c, m.groups || {});
        }
      }
      return renderError(c, 404);
    } catch (err) {
      console.error('render failure', path, err && err.stack || err);
      return renderError(c, 500, err);
    }
  },
};

function makeCtx(request, env, ctx, url) {
  return {
    request,
    env,
    ctx,
    url,
    path: url.pathname,
    currency: currencyFor(request),
    // Convenience for handlers that need the static asset store (e.g. content JSON).
    assets: env.ASSETS,
  };
}
