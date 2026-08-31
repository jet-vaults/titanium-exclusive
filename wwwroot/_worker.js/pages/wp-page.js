// Legal pages (privacy policy, secure shopping) from the catalog snapshot.
import { html, raw, textOf, truncate } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { breadcrumbs, breadcrumbLd } from '../ui/components.js';
import { getPage } from '../lib/store.js';
import { renderError } from './error.js';

export async function renderWpPage(c, { slug }) {
  const shell = await shellData(c);
  const wp = getPage(slug);
  if (!wp) return renderError(c, 404);
  const title = textOf(wp.title);
  const content = sanitize(wp.content);
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
    .replace(/https?:\/\/titaniumexclusive\.com/gi, '')
    .replace(/�/g, '’')
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '');
}
