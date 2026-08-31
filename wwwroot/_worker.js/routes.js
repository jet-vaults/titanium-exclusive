// Route table for the storefront. Order matters: first match wins.

import { renderHome } from './pages/home.js';
import { renderShop, renderCategory } from './pages/shop.js';
import { renderProduct } from './pages/product.js';
import { renderCart, renderCheckout } from './pages/cart.js';
import { renderSearchPage, searchApi, suggestApi, productApi } from './pages/search.js';
import { renderStory } from './pages/story.js';
import { renderWhyTitanium } from './pages/why.js';
import { renderRecipes, renderRecipe } from './pages/recipes.js';
import { renderSupport, renderSupportTopic } from './pages/support.js';
import { renderContact } from './pages/contact.js';
import { renderSitemap } from './pages/sitemap.js';
import { renderWpPage } from './pages/wp-page.js';

const route = (pattern, handler, methods) => ({ pattern, handler, methods });

export const routes = {
  sitemap: renderSitemap,
  table: [
    route(/^\/$/, renderHome),
    route(/^\/shop\/$/, renderShop),
    route(/^\/product-category\/(?<slug>[^/]+)\/$/, renderCategory),
    route(/^\/product\/(?<slug>[^/]+)\/$/, renderProduct),
    route(/^\/cart\/$/, renderCart),
    route(/^\/checkout\/$/, renderCheckout),
    route(/^\/search$/, renderSearchPage),
    route(/^\/search\/$/, renderSearchPage),
    route(/^\/api\/search\/$/, searchApi),
    route(/^\/api\/suggest\/$/, suggestApi),
    route(/^\/api\/product\/$/, productApi),
    route(/^\/our-story\/$/, renderStory),
    route(/^\/why-titanium\/$/, renderWhyTitanium),
    route(/^\/recipes\/$/, renderRecipes),
    route(/^\/recipes\/(?<slug>[^/]+)\/$/, renderRecipe),
    route(/^\/support\/$/, renderSupport),
    route(/^\/support\/(?<topic>[^/]+)\/$/, renderSupportTopic),
    route(/^\/contact\/$/, renderContact),
    route(/^\/(?<slug>privacy-policy|secure-shopping)\/$/, renderWpPage),
  ],
};
