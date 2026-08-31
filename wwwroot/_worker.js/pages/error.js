import { html } from '../lib/html.js';
import { page, shellData } from '../ui/layout.js';
import { button } from '../ui/components.js';

export async function renderError(c, status, err) {
  let shell = null;
  try { shell = await shellData(c); } catch { /* render without menus if the catalog is unreachable */ }
  const is404 = status === 404;
  return page(c, {
    status,
    noindex: true,
    shell,
    title: is404 ? 'Page not found' : 'Something went wrong',
    description: is404 ? 'The page you were looking for is not here.' : 'A temporary problem occurred.',
    bodyClass: 'page-error',
    body: html`
      <section class="error-hero container">
        <p class="eyebrow">${is404 ? 'Error 404' : `Error ${status}`}</p>
        <h1 class="display">${is404 ? 'This page has moved on.' : 'We hit a snag.'}</h1>
        <p class="lead">${is404
          ? 'The address may be out of date. The cookware is exactly where it always was.'
          : 'Our catalog did not respond in time. Please try again in a moment; your cart and account are unaffected.'}</p>
        <div class="btn-row">
          ${button({ href: '/shop/', label: 'Shop cookware' })}
          ${button({ href: '/support/', label: 'Get help', variant: 'ghost' })}
        </div>
      </section>`,
  });
}
