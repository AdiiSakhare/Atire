/**
 * Handlebars helpers — each mirrors a Liquid filter/tag so templates port
 * cleanly to Shopify:
 *   money        → | money_without_trailing_zeros
 *   discount     → (compare_at_price - price) * 100 / compare_at_price | round
 *   icon         → {% render 'icon', name: 'bag' %}
 *   json         → | json
 */
import Handlebars from 'handlebars';
import { formatMoney, discountPercent } from '../js/core/money.js';
import { icon } from '../data/icons.js';
import { getProduct } from '../data/products.js';

const safe = (html) => new Handlebars.SafeString(html);

export const helpers = {
  money: (paise) => formatMoney(paise),
  discount: (price, compareAt) => discountPercent(price, compareAt),
  icon: (name) => safe(icon(name)),
  json: (value) => safe(JSON.stringify(value).replace(/</g, '\\u003c')),

  /** {{#with (findProduct handle)}} — Shopify: all_products[handle] */
  findProduct: (handle) => getProduct(handle),

  eq: (a, b) => a === b,
  gt: (a, b) => a > b,
  or: (...args) => args.slice(0, -1).some(Boolean),
  add: (a, b) => a + b,
  array: (...args) => args.slice(0, -1),
  concat: (...args) => args.slice(0, -1).join(''),
  /** Append the current page title to a breadcrumb trail */
  crumbsWith: (trail = [], title) => [...trail, { title }],
  join: (items = [], sep) => items.join(typeof sep === 'string' ? sep : ' '),
  lowercase: (s) => String(s ?? '').toLowerCase(),
  percent: (part, total) => (total ? Math.round((part / total) * 100) : 0),
  slugify: (s) =>
    String(s ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),

  /** Five stars with partial fill, e.g. {{stars 4.6}} */
  stars: (rating = 0) => {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    const row = icon('star').repeat(5);
    return safe(
      `<span class="stars" style="--fill:${pct}%" role="img" aria-label="Rated ${rating} out of 5">` +
        `<span class="stars__base">${row}</span><span class="stars__fill">${row}</span></span>`,
    );
  },

  /** {{#times 6}}…{{@index}}…{{/times}} — keeps @root and the outer context */
  times(n, options) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const data = Handlebars.createFrame(options.data);
      data.index = i;
      data.first = i === 0;
      out += options.fn(this, { data });
    }
    return out;
  },

  /** {{#limit items 4}}…{{/limit}} */
  limit(items = [], n, options) {
    return items
      .slice(0, n)
      .map((item, i) => {
        const data = Handlebars.createFrame(options.data);
        data.index = i;
        return options.fn(item, { data });
      })
      .join('');
  },
};
