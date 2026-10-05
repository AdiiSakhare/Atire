/**
 * Storefront URLs built by client scripts. Prototype version; the Shopify
 * theme swaps this for src/shopify/routes.js (see vite.theme.config.js).
 */
const q = encodeURIComponent;

export const routes = {
  search: (term) => `/shop.html?q=${q(term)}`,
  collection: (tag) => `/shop.html?c=${q(tag)}`,
  size: (size) => `/shop.html?size=${q(size)}`,
  /** Prototype has no checkout page flow for Buy Now: it opens the cart drawer instead. */
  checkout: null,
  wishlist: '/wishlist.html',
};
