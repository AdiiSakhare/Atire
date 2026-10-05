/**
 * Theme build replacement for js/sections/shop.js.
 * Shopify does the filtering, sorting and pagination (storefront filters /
 * Search & Discovery); this script only makes it feel instant:
 *   - filter, sort and category clicks re-render the section through the
 *     Section Rendering API (?section_id=…) and update the URL
 *   - "Load more" appends the next page of products
 *   - density toggle and the filter panel (sidebar on desktop, drawer on mobile)
 * Without JS every control is a plain link, so the page still works.
 */
import { gsap } from 'gsap';
import { qs, qsa, on, prefersReducedMotion, isDesktop } from '../js/core/dom.js';
import { stopScroll, startScroll } from '../js/core/smooth-scroll.js';
import { syncCards, syncWishlistButtons } from '../js/components/product-card.js';

/** Regions swapped after each navigation (everything else keeps its UI state). */
const LIVE = [
  '[data-shop-title]',
  '[data-shop-text]',
  '[data-shop-crumb]',
  '[data-shop-cats]',
  '[data-shop-active]',
  '[data-shop-filters-body]',
  '[data-shop-grid]',
  '[data-shop-empty]',
  '[data-shop-more]',
  '[data-shop-sort]',
];
const COUNTS = '[data-shop-count], [data-shop-count-btn]';

export function initShop() {
  const root = qs('[data-shop]');
  if (!root) return;

  const sectionId = root.dataset.sectionId;
  const layout = qs('[data-shop-layout]', root);
  const filtersPanel = qs('[data-shop-filters]', root);
  const overlay = qs('[data-shop-overlay]');
  const toggle = qs('[data-shop-filter-toggle]', root);
  let controller;

  const sectionUrl = (url, extra = {}) => {
    const u = new URL(url, location.origin);
    u.searchParams.set('section_id', sectionId);
    Object.entries(extra).forEach(([k, v]) => u.searchParams.set(k, v));
    return u;
  };

  const parse = async (url) => {
    controller?.abort();
    controller = new AbortController();
    const response = await fetch(sectionUrl(url), { signal: controller.signal, headers: { Accept: 'text/html' } });
    return new DOMParser().parseFromString(await response.text(), 'text/html');
  };

  /** Accordions keep their open/closed state across re-renders. */
  const openSummaries = () => new Set(qsa('[data-shop-filters-body] details[open] summary', root).map((s) => s.textContent.trim()));

  function swap(doc) {
    const open = openSummaries();
    LIVE.forEach((selector) => {
      const next = qs(selector, doc);
      const current = qs(selector, document);
      if (next && current) current.replaceWith(next);
    });
    qsa(COUNTS, document).forEach((el) => {
      const fresh = qs(el.hasAttribute('data-shop-count') ? '[data-shop-count]' : '[data-shop-count-btn]', doc);
      if (fresh) el.textContent = fresh.textContent;
    });
    qsa('[data-shop-filters-body] details', root).forEach((d) => (d.open = open.has(qs('summary', d).textContent.trim())));
    const title = qs('[data-shop-title]', doc)?.textContent;
    if (title) document.title = `${title} — ${document.title.split('—').pop().trim()}`;

    const grid = qs('[data-shop-grid]', document);
    syncCards(grid);
    syncWishlistButtons(grid);
    if (!prefersReducedMotion()) {
      gsap.fromTo(qsa('[data-shop-item]', grid).slice(0, 9), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  }

  async function go(url, { push = true } = {}) {
    root.setAttribute('aria-busy', 'true');
    try {
      const doc = await parse(url);
      swap(doc);
      if (push) history.pushState(null, '', new URL(url, location.origin).href);
    } catch (error) {
      if (error.name !== 'AbortError') location.href = url; // fall back to a normal navigation
    } finally {
      root.removeAttribute('aria-busy');
    }
  }

  /* --------------------------------------------------------- navigation */
  // Category chips, facet values and active-filter chips are links/buttons carrying their target URL.
  on(root, 'click', '[data-shop-url]', (event, el) => {
    event.preventDefault();
    go(el.dataset.shopUrl);
  });
  on(root, 'click', 'a[data-shop-cat]', (event, link) => {
    event.preventDefault();
    go(link.href);
  });

  on(root, 'change', '[data-shop-sort]', (event, select) => {
    const url = new URL(location.href);
    url.searchParams.set('sort_by', select.value);
    url.searchParams.delete('page');
    go(url.href);
  });

  // Price presets → filter.v.price.gte / lte (rupees → minor units handled by Shopify in store currency)
  on(root, 'click', '[data-price-preset]', (event, button) => {
    const url = new URL(location.href);
    url.searchParams.delete('page');
    const active = button.getAttribute('aria-pressed') === 'true';
    url.searchParams.delete('filter.v.price.gte');
    url.searchParams.delete('filter.v.price.lte');
    if (!active) {
      const { priceMin, priceMax } = button.dataset;
      if (priceMin) url.searchParams.set('filter.v.price.gte', priceMin);
      if (priceMax) url.searchParams.set('filter.v.price.lte', priceMax);
    }
    go(url.href);
  });

  on(root, 'click', '[data-shop-clear]', (event, button) => {
    event.preventDefault();
    go(button.dataset.shopClearUrl || location.pathname);
  });

  window.addEventListener('popstate', () => go(location.href, { push: false }));

  on(root, 'click', '[data-shop-load]', async (event, button) => {
    event.preventDefault();
    const next = button.dataset.nextUrl;
    if (!next) return;
    button.disabled = true;
    const doc = await parse(next);
    const grid = qs('[data-shop-grid]', root);
    const promo = qs('[data-shop-promo]', grid);
    qsa('[data-shop-item]', doc).forEach((item) => (promo ? promo.before(item) : grid.append(item)));
    const more = qs('[data-shop-more]', doc);
    if (more) qs('[data-shop-more]', root).replaceWith(more);
    syncCards(grid);
    syncWishlistButtons(grid);
  });

  /* ------------------------------------------------------------- layout */
  on(root, 'click', '[data-density]', (e, btn) => {
    qs('[data-shop-grid]', root).dataset.density = btn.dataset.density;
    qsa('[data-density]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  });

  const openMobile = () => {
    filtersPanel.classList.add('is-open');
    overlay.classList.add('is-open');
    stopScroll();
  };
  const closeMobile = () => {
    filtersPanel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    startScroll();
  };

  toggle.addEventListener('click', () => {
    if (isDesktop()) {
      const collapsed = layout.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      qs('[data-filter-label]', toggle).textContent = collapsed ? 'Show filters' : 'Hide filters';
    } else {
      openMobile();
    }
  });
  on(root, 'click', '[data-shop-filter-close]', closeMobile);
  overlay.addEventListener('click', closeMobile);

  if (!isDesktop()) {
    qs('[data-filter-label]', toggle).textContent = 'Filter';
    qs('[data-shop-grid]', root).dataset.density = '2';
  }
}
