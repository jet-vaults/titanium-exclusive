// Renders a WordPress page (privacy policy, secure shopping) inside the new design.
// The content stays editable in WordPress.
import { html, raw, textOf, truncate } from '../lib/html.js';
import { SITE, WP } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { breadcrumbs, breadcrumbLd } from '../ui/components.js';
import { cachedJson } from '../lib/cache.js';
import { fetchOrigin } from '../lib/proxy.js';
import { renderError } from './error.js';

export async function renderWpPage(c, { slug }) {
  const shell = await shellData(c);
  const wp = await cachedJson(c.ctx, `wp-page:${slug}`, WP.catalogTtl * 6, async () => {
    const res = await fetchOrigin(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=title,content,modified`);
    if (!res.ok) return null;
    const list = await res.json();
    return list[0] || null;
  });
  if (!wp) return renderError(c, 404);
  const title = textOf(wp.title.rendered);
  const content = sanitize(wp.content.rendered);
  const crumbs = [{ label: 'Home', href: '/' }, { label: title, href: `/${slug}/` }];
  return page(c, {
    shell,
    title,
    description: truncate(textOf(content), 200),
    canonicalPath: `/${slug}/`,
    bodyClass: 'page-wp',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin)],
    body: html`
      <section class="container page-hero">${breadcrumbs(crumbs)}<h1 class="page-hero__title">${title}</h1><p class="muted" style="font-size:var(--text-sm)">Last updated ${new Date(wp.modified).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p></section>
      <section class="container" style="padding-bottom:var(--section)"><div class="prose">${raw(content)}</div></section>`,
  });
}

function sanitize(htmlStr) {
  return String(htmlStr || '')
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\s(style|class|id)="[^"]*"/gi, '')
    .replace(/�/g, '’')
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '');
}
