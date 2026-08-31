// Titanium Exclusive — Cloudflare Pages edge worker.
//
// Renders every storefront page from the bundled catalog (data/catalog.js) and serves the
// static design assets and media in wwwroot/. The site is standalone: it makes no requests
// to any other server. Checkout is a placeholder until a commerce back-end is connected.

import { REDIRECTS } from './config.js';
import { currencyFor } from './lib/currency.js';
import { routes } from './routes.js';
import { renderError } from './pages/error.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Static files never go through the router.
    if (path.startsWith('/assets/') || path.startsWith('/media/') || path === '/favicon.ico' || path === '/robots.txt' || path.startsWith('/.well-known/')) {
      const res = await env.ASSETS.fetch(request);
      if (res.status === 200 && (path.startsWith('/assets/') || path.startsWith('/media/'))) {
        const out = new Response(res.body, res);
        out.headers.set('cache-control', 'public, max-age=31536000, immutable');
        return out;
      }
      return res;
    }
    if (path === '/sitemap.xml') return routes.sitemap(makeCtx(request, env, ctx, url));

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
      if (request.method !== 'GET' && request.method !== 'HEAD') return renderError(c, 405);
      for (const route of routes.table) {
        const m = route.pattern.exec(path);
        if (m) return await route.handler(c, m.groups || {});
      }
      return renderError(c, 404);
    } catch (err) {
      console.error('render failure', path, (err && err.stack) || err);
      return renderError(c, 500, err);
    }
  },
};

function makeCtx(request, env, ctx, url) {
  return { request, env, ctx, url, path: url.pathname, currency: currencyFor(request), assets: env.ASSETS };
}
