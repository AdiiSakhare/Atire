/**
 * Collection listing: category, search, facets, sort, density and
 * "load more" pagination — all client-side over server-rendered cards,
 * with state mirrored to the URL so results are shareable.
 * Shopify: replace with Storefront filtering (?filter.v.option.size=…).
 */
import { gsap } from 'gsap';
import { qs, qsa, on, prefersReducedMotion, isDesktop } from '../core/dom.js';
import { shopFilters } from '../../data/pages.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';

const PAGE_SIZE = 9;

export function initShop() {
  const root = qs('[data-shop]');
  if (!root) return;

  const collections = JSON.parse(root.dataset.collections);
  const grid = qs('[data-shop-grid]', root);
  const items = qsa('[data-shop-item]', grid);
  const promo = qs('[data-shop-promo]', grid);
  const filtersPanel = qs('[data-shop-filters]', root);
  const overlay = qs('[data-shop-overlay]');

  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get('c') ?? 'all',
    q: (params.get('q') ?? '').trim(),
    sort: params.get('sort') ?? 'featured',
    sizes: new Set(),
    colors: new Set(),
    prices: new Set(),
    rating: 0,
    discount: 0,
    shown: PAGE_SIZE,
  };

  /* ------------------------------------------------------------ logic */
  const matches = (item) => {
    const d = item.dataset;
    const tags = d.tags.split(' ');
    if (state.cat !== 'all' && !tags.includes(state.cat)) return false;
    if (state.q && !state.q.toLowerCase().split(/\s+/).every((term) => d.search.includes(term))) return false;
    if (state.colors.size && !d.colors.split('|').some((c) => state.colors.has(c))) return false;
    if (state.prices.size) {
      const price = Number(d.price);
      const ok = [...state.prices].some((i) => price >= shopFilters.prices[i].min && price <= shopFilters.prices[i].max);
      if (!ok) return false;
    }
    if (state.rating && Number(d.rating) < state.rating) return false;
    if (state.discount && Number(d.discount) < state.discount) return false;
    return true; // sizes: every product ships in the full run, so size never empties a result
  };

  const sorters = {
    featured: (a, b) => a.dataset.index - b.dataset.index,
    bestselling: (a, b) => b.dataset.reviews - a.dataset.reviews,
    newest: (a, b) => b.dataset.id - a.dataset.id,
    'price-asc': (a, b) => a.dataset.price - b.dataset.price,
    'price-desc': (a, b) => b.dataset.price - a.dataset.price,
    rating: (a, b) => b.dataset.rating - a.dataset.rating,
  };

  const activeFilterCount = () =>
    state.sizes.size + state.colors.size + state.prices.size + (state.rating ? 1 : 0) + (state.discount ? 1 : 0);

  /* ----------------------------------------------------------- render */
  function render({ animate = true } = {}) {
    const results = items.filter(matches).sort(sorters[state.sort] ?? sorters.featured);
    const visible = results.slice(0, state.shown);

    items.forEach((item) => (item.hidden = true));
    visible.forEach((item) => {
      item.hidden = false;
      grid.append(item);
    });

    // Promo tile after the 4th product when there's room
    promo.hidden = results.length < 6;
    if (!promo.hidden) visible[3]?.after(promo);

    // Header copy
    const collection = collections[state.cat] ?? collections.all;
    const title = state.q ? `Results for “${state.q}”` : collection.title;
    qs('[data-shop-title]').textContent = title;
    qs('[data-shop-text]').textContent = state.q
      ? `${results.length} product${results.length === 1 ? '' : 's'} match your search.`
      : collection.text;
    const crumb = qs('[data-shop-crumb]');
    if (crumb) crumb.textContent = title;
    document.title = `${title} — Atire`;

    qsa('[data-shop-count], [data-shop-count-btn]').forEach((el) => (el.textContent = results.length));
    qs('[data-shop-empty]', root).hidden = results.length > 0;

    // Pagination
    const more = qs('[data-shop-more]', root);
    more.hidden = results.length <= PAGE_SIZE;
    qs('[data-shop-shown]', root).textContent = visible.length;
    qs('[data-shop-total]', root).textContent = results.length;
    qs('[data-shop-progress]', root).style.width = `${(visible.length / Math.max(results.length, 1)) * 100}%`;
    qs('[data-shop-load]', root).hidden = visible.length >= results.length;

    // Controls state
    qsa('[data-shop-cat]', root).forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.shopCat === state.cat)));
    qsa('[data-filter="size"]', root).forEach((b) => b.setAttribute('aria-pressed', String(state.sizes.has(b.dataset.value))));
    qsa('[data-filter="color"]', root).forEach((b) => b.setAttribute('aria-pressed', String(state.colors.has(b.dataset.value))));
    qsa('[data-filter="price"]', root).forEach((i) => (i.checked = state.prices.has(Number(i.value))));
    qs('[data-filter="rating"]', root).checked = Boolean(state.rating);
    qs('[data-filter="discount"]', root).checked = Boolean(state.discount);
    qs('[data-shop-sort]', root).value = state.sort;

    const count = activeFilterCount();
    const badge = qs('[data-filter-count]', root);
    badge.hidden = !count;
    badge.textContent = count;

    renderActiveChips();
    syncUrl();

    if (animate && !prefersReducedMotion()) {
      gsap.fromTo(visible.slice(0, 9), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  }

  function renderActiveChips() {
    const chips = [];
    if (state.q) chips.push({ type: 'q', value: '', label: `“${state.q}”` });
    state.sizes.forEach((v) => chips.push({ type: 'size', value: v, label: `Size ${v}` }));
    state.colors.forEach((v) => chips.push({ type: 'color', value: v, label: v }));
    state.prices.forEach((v) => chips.push({ type: 'price', value: v, label: shopFilters.prices[v].label }));
    if (state.rating) chips.push({ type: 'rating', value: '', label: `${state.rating}★ & above` });
    if (state.discount) chips.push({ type: 'discount', value: '', label: `${state.discount}%+ off` });

    qs('[data-shop-active]', root).innerHTML = chips
      .map((c) => `<button class="active-chip" type="button" data-remove="${c.type}" data-value="${c.value}">${c.label}<span aria-hidden="true">×</span><span class="visually-hidden">Remove filter</span></button>`)
      .join('');
  }

  function syncUrl() {
    const url = new URL(location.href);
    url.search = '';
    if (state.cat !== 'all') url.searchParams.set('c', state.cat);
    if (state.q) url.searchParams.set('q', state.q);
    if (state.sort !== 'featured') url.searchParams.set('sort', state.sort);
    history.replaceState(null, '', url);
  }

  const update = (changes = {}) => {
    Object.assign(state, changes, { shown: PAGE_SIZE });
    render();
  };

  /* ----------------------------------------------------------- events */
  on(root, 'click', '[data-shop-cat]', (e, chip) => update({ cat: chip.dataset.shopCat, q: '' }));

  on(root, 'click', '[data-filter="size"], [data-filter="color"]', (e, btn) => {
    const set = btn.dataset.filter === 'size' ? state.sizes : state.colors;
    set.has(btn.dataset.value) ? set.delete(btn.dataset.value) : set.add(btn.dataset.value);
    update();
  });

  on(root, 'change', '[data-filter="price"]', (e, input) => {
    input.checked ? state.prices.add(Number(input.value)) : state.prices.delete(Number(input.value));
    update();
  });
  on(root, 'change', '[data-filter="rating"]', (e, input) => update({ rating: input.checked ? Number(input.value) : 0 }));
  on(root, 'change', '[data-filter="discount"]', (e, input) => update({ discount: input.checked ? Number(input.value) : 0 }));
  qs('[data-shop-sort]', root).addEventListener('change', (e) => update({ sort: e.target.value }));

  on(root, 'click', '[data-remove]', (e, chip) => {
    const { remove, value } = chip.dataset;
    if (remove === 'q') state.q = '';
    if (remove === 'size') state.sizes.delete(value);
    if (remove === 'color') state.colors.delete(value);
    if (remove === 'price') state.prices.delete(Number(value));
    if (remove === 'rating') state.rating = 0;
    if (remove === 'discount') state.discount = 0;
    update();
  });

  on(root, 'click', '[data-shop-clear]', () => {
    state.sizes.clear();
    state.colors.clear();
    state.prices.clear();
    update({ rating: 0, discount: 0, q: '' });
  });

  qs('[data-shop-load]', root).addEventListener('click', () => {
    state.shown += PAGE_SIZE;
    render();
  });

  // Density
  on(root, 'click', '[data-density]', (e, btn) => {
    grid.dataset.density = btn.dataset.density;
    qsa('[data-density]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  });

  // Filter panel: collapsible sidebar on desktop, drawer on mobile
  const toggle = qs('[data-shop-filter-toggle]', root);
  const layout = qs('[data-shop-layout]', root);
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
    grid.dataset.density = '2';
  }

  render({ animate: false });
}
