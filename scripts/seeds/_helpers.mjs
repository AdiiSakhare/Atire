/** Shared helpers for theme template seeders (scripts/seed-theme-templates.mjs + scripts/seeds/*.mjs). */
const PH = '/assets/images/placeholders/';

/** /assets/images/placeholders/x.jpg → x.jpg (theme asset); external URLs unchanged. */
export const ph = (src) => (src?.startsWith(PH) ? src.slice(PH.length) : src ?? '');

/** Prototype URLs → real Shopify URLs. */
export function url(path = '') {
  const m = path.match(/[?&](c|vibe|q)=([^&]+)/);
  if (m?.[1] === 'c') return `/collections/${m[2]}`;
  if (m?.[1] === 'vibe') return `/search?type=product&q=${m[2]}`;
  if (path.includes('sort=bestselling')) return '/collections/bestseller';
  const pages = { '/about.html': '/pages/about', '/contact.html': '/pages/contact', '/faq.html': '/pages/faq', '/size-guide.html': '/pages/size-guide', '/bulk-orders.html': '/pages/bulk-orders', '/journal.html': '/blogs/journal', '/track-order.html': '/pages/track-order', '/wishlist.html': '/pages/wishlist', '/shipping.html': '/pages/shipping', '/returns.html': '/pages/returns', '/privacy.html': '/pages/privacy', '/terms.html': '/pages/terms', '/account.html': '/account', '/cart.html': '/cart' };
  if (pages[path]) return pages[path];
  return path.startsWith('/shop.html') ? '/collections/all' : path;
}

/** Build { blocks, block_order } from an array. */
export const blocks = (items, type, map) => {
  const out = {};
  const order = [];
  items.forEach((item, i) => {
    const id = `${type}-${i + 1}`;
    out[id] = { type, settings: map(item, i) };
    order.push(id);
  });
  return { blocks: out, block_order: order };
};

/** Merge several block groups (different types) into one. */
export const merge = (...groups) => ({
  blocks: Object.assign({}, ...groups.map((g) => g.blocks)),
  block_order: groups.flatMap((g) => g.block_order),
});

/** Tiny template builder: const t = template(); t.add(id, type, settings, extra); t.done() */
export function template() {
  const sections = {};
  const order = [];
  return {
    add(id, type, settings = {}, extra = {}) {
      sections[id] = { type, settings, ...extra };
      order.push(id);
    },
    done: () => ({ sections, order }),
  };
}
