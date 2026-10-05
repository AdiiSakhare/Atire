/**
 * Money helpers — amounts are integer paise, like Shopify's cents.
 * Isomorphic: used by Handlebars helpers at build time and by client JS.
 */

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 129900 → "₹1,299" (Shopify: {{ price | money_without_trailing_zeros }}) */
export const formatMoney = (paise = 0) => `₹${inr.format(Math.round(paise / 100))}`;

/** Whole-number discount percentage, e.g. (99900, 129900) → 23 */
export const discountPercent = (price, compareAt) =>
  compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
