import { html } from '../lib/html.js';
import { SITE } from '../config.js';
import { page, shellData } from '../ui/layout.js';
import { recipeCard, breadcrumbs, breadcrumbLd, sectionHead, textLink, productCard } from '../ui/components.js';
import { getRecipes, getRecipeBySlug, recipeLd } from '../lib/recipes.js';
import { renderError } from './error.js';

export async function renderRecipes(c) {
  const shell = await shellData(c);
  const recipes = await getRecipes(c.ctx);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Recipes', href: '/recipes/' }];
  return page(c, {
    shell,
    title: 'Recipes',
    description: 'Recipes cooked in Titanium Exclusive cookware: roasted vegetables, soups, stir-fries and sides that need little or no oil.',
    bodyClass: 'page-recipes',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin)],
    body: html`
      <section class="container page-hero">
        ${breadcrumbs(crumbs)}
        <h1 class="page-hero__title">Cook something <em class="accent">tonight.</em></h1>
        <p class="lead">Simple recipes that suit a pan which needs little or no oil and holds its heat. Each one names the piece we would reach for.</p>
      </section>
      <section class="container section--sm">
        <div class="grid grid--3" data-stagger>${recipes.map((r) => recipeCard(r))}</div>
        ${!recipes.length ? html`<p class="muted">Recipes are being updated. Please check back soon.</p>` : ''}
      </section>`,
  });
}

export async function renderRecipe(c, { slug }) {
  const shell = await shellData(c);
  const recipe = await getRecipeBySlug(c.ctx, slug);
  if (!recipe) return renderError(c, 404);
  const all = await getRecipes(c.ctx);
  const more = all.filter((r) => r.slug !== slug).slice(0, 3);
  const pan = shell.products.filter((p) => p.family === 'cookware' && p.inStock && p.categories.some((k) => k.slug === recipe.pan.slug)).sort((a, b) => a.price - b.price);
  const suggested = pan[Math.floor(pan.length / 2)] || shell.products.find((p) => p.family === 'cookware' && /frying/i.test(p.name) && p.inStock);
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Recipes', href: '/recipes/' }, { label: recipe.title, href: `/recipes/${slug}/` }];
  return page(c, {
    shell,
    title: `${recipe.title} — recipe`,
    description: `${recipe.title}: ${recipe.ingredients.length} ingredients, ${recipe.steps.length} steps. Cooked in ${recipe.pan.label} from Titanium Exclusive.`,
    canonicalPath: `/recipes/${slug}/`,
    ogImage: recipe.image || undefined,
    ogType: 'article',
    bodyClass: 'page-recipe',
    ld: [breadcrumbLd(crumbs, SITE.canonicalOrigin), recipeLd(recipe, SITE.canonicalOrigin)],
    body: html`
      <div class="container">
        <div class="pdp__crumbs">${breadcrumbs(crumbs)}</div>
        <article class="recipe" style="padding-block:var(--space-6) var(--section)">
          <div class="recipe__media">
            ${recipe.image ? html`<figure class="media" style="--ratio:1"><img src="${recipe.image}" alt="${recipe.title}" width="1000" height="700" fetchpriority="high"></figure>` : ''}
            ${suggested ? html`
              <a class="recipe__pan" href="${suggested.permalink}">
                <img src="${suggested.images[0] ? suggested.images[0].thumb : ''}" alt="" width="80" height="80" loading="lazy">
                <span><span class="eyebrow" style="margin-bottom:.2rem">Cook it in</span><span style="font-weight:500;display:block">${suggested.name}</span><span class="muted" style="font-size:var(--text-xs)">${recipe.pan.label} — little or no oil needed</span></span>
              </a>` : ''}
          </div>
          <div>
            <p class="eyebrow">${recipe.category}</p>
            <h1 class="h1">${recipe.title}</h1>
            <p class="page-hero__meta" style="margin-top:1rem"><span>${recipe.ingredients.length} ingredients</span><span>${recipe.steps.length} steps</span></p>
            <h2 class="h3" style="margin-top:2.5rem">Ingredients</h2>
            <ul class="recipe__ingredients" style="margin-top:1rem">
              ${recipe.ingredients.map((i) => html`<li><span class="amt">${[i.amount, i.unit].filter(Boolean).join(' ')}</span><span>${i.name}</span></li>`)}
            </ul>
            <h2 class="h3" style="margin-top:2.5rem">Method</h2>
            <ol class="recipe__steps" style="margin-top:1rem">${recipe.steps.map((s) => html`<li><span>${s}</span></li>`)}</ol>
          </div>
        </article>
      </div>
      ${more.length ? html`
        <section class="section section--line">
          <div class="container">
            ${sectionHead({ eyebrow: 'More', title: 'Next <em class="accent">dinner.</em>', link: { href: '/recipes/', label: 'All recipes' } })}
            <div class="grid grid--3" data-stagger>${more.map((r) => recipeCard(r))}</div>
          </div>
        </section>` : ''}`,
  });
}
