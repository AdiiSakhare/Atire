/** Live search suggestions from the product catalogue (Shopify: Predictive Search API). */
import { qs } from '../core/dom.js';
import { formatMoney } from '../core/money.js';
import { products } from '../../data/products.js';
import { routes } from '../core/routes.js';

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function initSearchSuggestions() {
  const input = qs('[data-search-input]');
  const results = qs('[data-search-results]');
  const suggest = qs('[data-search-suggest]');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      results.hidden = true;
      suggest.hidden = false;
      return;
    }

    const terms = q.split(/\s+/);
    const matches = products
      .filter((p) => {
        const hay = [p.title, p.card_title, p.tagline, p.product_type, p.collection, ...p.tags].join(' ').toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 6);

    suggest.hidden = true;
    results.hidden = false;
    results.innerHTML = matches.length
      ? `<p class="eyebrow">Products</p><ul class="search__list">${matches
          .map(
            (p) => `<li><a class="search__item" href="${p.url}">
              <img src="${p.images[0].src}" alt="" />
              <span><strong>${escape(p.card_title ?? p.title)}</strong><small>${escape(p.product_type)} · ${escape(p.collection)}</small></span>
              <span class="price"><span class="price__current">${formatMoney(p.price)}</span><s class="price__compare">${formatMoney(p.compare_at_price)}</s></span>
            </a></li>`,
          )
          .join('')}</ul><a class="search__all" href="${routes.search(q)}">See all results for “${escape(q)}” →</a>`
      : `<p class="search__empty">No matches for “${escape(q)}”. Try “oversized”, “hoodie” or “couple”.</p>`;
  });
}
