/** Theme build replacement for core/routes.js — real Shopify URLs. */
const root = (window.Shopify?.routes?.root ?? '/').replace(/\/?$/, '/');
const q = encodeURIComponent;

export const routes = {
  search: (term) => `${root}search?type=product&q=${q(term)}`,
  collection: (handle) => `${root}collections/${q(handle)}`,
  size: (size) => `${root}collections/all?filter.v.option.size=${q(size)}`,
  checkout: `${root}checkout`,
  wishlist: `${root}pages/wishlist`,
};
