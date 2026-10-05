/**
 * Theme build replacement for core/pricing.js.
 * Shopify owns discounts, shipping and tax, so the storefront only displays what
 * the cart already knows and hands discount codes to Shopify:
 *   apply a code → /discount/CODE?redirect=/cart  (stored for checkout)
 * Shipping is calculated at checkout (null = “calculated at checkout”).
 */
import { getCart } from './cart.js';

const root = (window.Shopify?.routes?.root ?? '/').replace(/\/?$/, '/');

let threshold = 99900;
try {
  threshold = Number(JSON.parse(document.getElementById('atire-settings')?.textContent || '{}').free_shipping_threshold ?? 999) * 100;
} catch {
  /* keep default */
}

export const COUPONS = {};
export const SHIPPING_FEE = 0;
export const FREE_SHIPPING_MIN = threshold;

let appliedCart = null;
getCart().then((cart) => (appliedCart = cart));

/** The discount code already applied to this cart, if Shopify reports one. */
export const getCoupon = () => appliedCart?.discount?.code ?? null;

/** Shopify validates codes at checkout; accept anything non-empty here. */
export function evaluateCoupon(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return { ok: false, message: 'Enter a discount code.' };
  return { ok: true, code: normalized, discount: 0, message: `${normalized} will be applied at checkout` };
}

export function applyCoupon(code) {
  const normalized = encodeURIComponent(String(code).trim());
  location.href = `${root}discount/${normalized}?redirect=${encodeURIComponent(`${root}cart`)}`;
}

/** Codes can only be removed at checkout. */
export function removeCoupon() {
  location.href = `${root}checkout`;
}

export function summarize(cart) {
  const mrp = cart.total_compare;
  const subtotal = cart.total_price;
  const productSavings = Math.max(0, mrp - subtotal);
  const code = cart.discount?.code ?? null;
  const couponDiscount = cart.discount?.amount ?? 0;
  const coupon = code ? { ok: true, code, discount: couponDiscount } : null;

  return {
    mrp,
    subtotal,
    productSavings,
    coupon,
    couponDiscount,
    shipping: null, // calculated at checkout
    total: subtotal,
    totalSavings: productSavings + couponDiscount,
  };
}
