import { SITE } from '../config.js';
import { getAllProducts, getCategories } from '../lib/store.js';
import { escape } from '../lib/html.js';

export async function renderSitemap(c) {
  const [products, categories] = await Promise.all([getAllProducts(c.ctx, SITE.defaultCurrency), getCategories(c.ctx)]);
  const statics = ['/', '/shop/', '/why-titanium/', '/our-story/', '/recipes/', '/support/', '/support/faq/', '/support/warranty/', '/support/care/', '/support/instructions/', '/support/shipping/', '/support/videos/', '/contact/'];
  const urls = [
    ...statics.map((p) => ({ loc: p, priority: p === '/' ? '1.0' : '0.7' })),
    ...categories.map((k) => ({ loc: `/product-category/${k.slug}/`, priority: '0.8' })),
    ...products.map((p) => ({ loc: p.permalink, priority: '0.6' })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${escape(SITE.canonicalOrigin + u.loc)}</loc><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
