/**
 * Build-time template context per page (Shopify: the objects Liquid exposes
 * to each template — `product`, `collection`, `settings` …).
 */
import { site, reviews } from './site.js';
import { home } from './home.js';
import { collections, shopFilters, about, contact, faqs, sizeGuide, bulk, journal, policies } from './pages.js';
import { COLORS, SIZES } from './products.js';
import { products, getProduct, getRecommendations, getProductsByHandles } from './products.js';

const FEATURED_HANDLE = 'blue-graphic-printed-tee';

const pageContexts = {
  '/index.html': () => ({
    page: { title: 'Atire — Clothing that starts conversations', template: 'index' },
    home,
    newArrivals: [...products].sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new'))).slice(0, 8),
  }),

  '/product.html': () => {
    const product = getProduct(FEATURED_HANDLE);
    return {
      page: { title: `${product.title} — Atire`, template: 'product' },
      product,
      reviews,
      recommendations: getRecommendations(product, 8),
      bundle: getProductsByHandles([product.handle, 'manifest-more-love-hoodie', 'error-404-developer-tee']),
      breadcrumbs: [
        { title: 'Home', url: '/' },
        { title: product.collection, url: `/shop.html?c=${product.collection.toLowerCase()}` },
        { title: `${product.product_type}s`, url: '/shop.html' },
      ],
    };
  },
};

const crumbs = (...items) => [{ title: 'Home', url: '/' }, ...items];

const policyPage = (key) => () => ({
  page: { title: `${policies[key].title} — Atire`, template: 'policy' },
  policy: { key, ...policies[key] },
  policyLinks: Object.entries(policies).map(([k, v]) => ({ key: k, title: v.title, url: `/${k}.html`, active: k === key })),
  breadcrumbs: crumbs({ title: policies[key].title }),
});

Object.assign(pageContexts, {
  '/shop.html': () => ({
    page: { title: 'Shop All — Atire', template: 'shop' },
    collection: collections.all,
    collections,
    shopFilters,
    colors: Object.values(COLORS),
    sizes: SIZES,
    breadcrumbs: crumbs({ title: 'Shop' }),
  }),
  '/cart.html': () => ({
    page: { title: 'Your Cart — Atire', template: 'cart' },
    recommendations: products.filter((p) => p.tags.includes('bestseller')).slice(0, 8),
  }),
  '/checkout.html': () => ({ page: { title: 'Checkout — Atire', template: 'checkout' } }),
  '/order-confirmed.html': () => ({
    page: { title: 'Order Confirmed — Atire', template: 'order' },
    recommendations: products.slice(0, 8),
  }),
  '/wishlist.html': () => ({
    page: { title: 'Wishlist — Atire', template: 'wishlist' },
    recommendations: products.filter((p) => p.tags.includes('bestseller')).slice(0, 8),
    breadcrumbs: crumbs({ title: 'Wishlist' }),
  }),
  '/account.html': () => ({ page: { title: 'My Account — Atire', template: 'account' } }),
  '/track-order.html': () => ({
    page: { title: 'Track Your Order — Atire', template: 'track' },
    breadcrumbs: crumbs({ title: 'Track Order' }),
  }),
  '/about.html': () => ({
    page: { title: 'Our Story — Atire', template: 'about' },
    about,
    home,
    newArrivals: products.slice(0, 8),
  }),
  '/contact.html': () => ({
    page: { title: 'Contact Us — Atire', template: 'contact' },
    contact,
    faqPreview: faqs.flatMap((group) => group.items).slice(0, 5),
    breadcrumbs: crumbs({ title: 'Contact' }),
  }),
  '/faq.html': () => ({
    page: { title: 'FAQs — Atire', template: 'faq' },
    faqs,
    breadcrumbs: crumbs({ title: 'Help Center' }),
  }),
  '/size-guide.html': () => ({
    page: { title: 'Size Guide — Atire', template: 'size-guide' },
    sizeGuide,
    breadcrumbs: crumbs({ title: 'Size Guide' }),
  }),
  '/bulk-orders.html': () => ({
    page: { title: 'Bulk & Custom Orders — Atire', template: 'bulk' },
    bulk,
    breadcrumbs: crumbs({ title: 'Bulk & Custom Orders' }),
  }),
  '/journal.html': () => ({
    page: { title: 'Journal — Atire', template: 'journal' },
    featured: journal.find((post) => post.featured),
    posts: journal.filter((post) => !post.featured),
    categories: [...new Set(journal.map((post) => post.category))],
    breadcrumbs: crumbs({ title: 'Journal' }),
  }),
  '/article.html': () => {
    const post = journal[0];
    return {
      page: { title: `${post.title} — Atire Journal`, template: 'article' },
      post,
      journal,
      related: journal.filter((p) => p.slug !== post.slug).slice(0, 3),
      postProducts: getProductsByHandles(post.products),
      breadcrumbs: crumbs({ title: 'Journal', url: '/journal.html' }, { title: post.category }),
    };
  },
  '/shipping.html': policyPage('shipping'),
  '/returns.html': policyPage('returns'),
  '/privacy.html': policyPage('privacy'),
  '/terms.html': policyPage('terms'),
  '/404.html': () => ({
    page: { title: 'Page Not Found — Atire', template: '404' },
    recommendations: products.filter((p) => p.tags.includes('bestseller')).slice(0, 4),
  }),
});

export function getPageContext(pagePath) {
  const path = pagePath === '/' ? '/index.html' : pagePath;
  const pageContext = pageContexts[path]?.() ?? { page: { title: 'Atire' } };
  return { site, products, year: new Date().getFullYear(), ...pageContext };
}
