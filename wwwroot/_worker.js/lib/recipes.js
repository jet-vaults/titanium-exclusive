// Recipes from the catalog snapshot (originally the WordPress "Cooked" plugin).
// The rendered HTML is parsed once into ingredients and steps.

import { getRawRecipes } from './store.js';
import { decodeEntities, textOf } from './html.js';

let cache = null;

export async function getRecipes() {
  if (!cache) cache = getRawRecipes().map(normalizeRecipe).sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export async function getRecipeBySlug(_ctx, slug) {
  const all = await getRecipes();
  return all.find((r) => r.slug === slug) || null;
}

function normalizeRecipe(r) {
  const content = r.content || '';
  const ingredients = [];
  const ingRe = /<div[^>]*class="[^"]*cooked-single-ingredient[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  let m;
  while ((m = ingRe.exec(content))) {
    const block = m[1];
    const amount = pick(block, 'cooked-ing-amount');
    const unit = pick(block, 'cooked-ing-measurement');
    const name = pick(block, 'cooked-ing-name');
    if (name) ingredients.push({ amount, unit, name });
  }
  const steps = [];
  const dirRe = /<div[^>]*class="[^"]*cooked-dir-content[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  while ((m = dirRe.exec(content))) {
    const text = textOf(m[1]).replace(/\s+/g, ' ').trim();
    if (text) steps.push(text);
  }
  const title = decodeEntities(textOf(r.title));
  return {
    id: r.id,
    slug: r.slug,
    title,
    image: r.image,
    imageThumb: r.thumb || r.image,
    date: r.date,
    ingredients,
    steps,
    category: guessCategory(title, ingredients),
    pan: suggestPan(title, steps.join(' ')),
    time: null, // The source recipes carry no prep or cook times; we do not invent them.
    description: r.description || '',
  };
}

function pick(block, cls) {
  const m = block.match(new RegExp(`class="${cls}"[^>]*>([\\s\\S]*?)<\\/span>`));
  return m ? decodeEntities(textOf(m[1])).replace(/\s+/g, ' ').trim() : '';
}

function guessCategory(title, ingredients) {
  const t = title.toLowerCase();
  const names = ingredients.map((i) => i.name.toLowerCase()).join(' ');
  if (/soup|broth/.test(t)) return 'Soups';
  if (/chicken|beef|pork|lamb|fish|salmon|steak|burger/.test(t) || /chicken breast|beef|steak/.test(names)) return 'Mains';
  if (/potato|cauliflower|mushroom|eggplant|vegetable|salad/.test(t)) return 'Vegetables & sides';
  return 'Recipes';
}

function suggestPan(title, steps) {
  const t = `${title} ${steps}`.toLowerCase();
  if (/soup|simmer for 1 hour|stock/.test(t)) return { slug: 'titanium-soup-pots', label: 'a soup pot' };
  if (/stir|saute|sauté|wok/.test(t)) return { slug: 'titanium-specialty-cookware', label: 'a wok or large frying pan' };
  if (/casserole dish|roast|roasted|whole/.test(t)) return { slug: 'titanium-roasting-pots', label: 'a roasting pot or casserole' };
  if (/skillet|pan fry|fry/.test(t)) return { slug: 'titanium-frying-pans', label: 'a frying pan' };
  if (/baking sheet|bake|tray/.test(t)) return { slug: 'titanium-specialty-cookware', label: 'the titanium cookie sheet' };
  return { slug: 'titanium-frying-pans', label: 'a frying pan' };
}

export function recipeLd(r, origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.title,
    image: r.image ? [r.image.startsWith('http') ? r.image : origin + r.image] : undefined,
    author: { '@type': 'Organization', name: 'Titanium Exclusive' },
    datePublished: r.date,
    recipeCategory: r.category,
    recipeIngredient: r.ingredients.map((i) => [i.amount, i.unit, i.name].filter(Boolean).join(' ')),
    recipeInstructions: r.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
    url: `${origin}/recipes/${r.slug}/`,
  };
}
