/**
 * Coupons + order totals. One source of truth for cart page, checkout and
 * order confirmation. Shopify: discount codes / Functions do this server-side.
 */
import { read, write } from './storage.js';
import { emit } from './events.js';
import { getProduct } from '../../data/products.js';

const KEY = 'atire:coupon';

export const COUPONS = {
  PREPAID100: { label: '₹100 off prepaid orders above ₹1,199', min: 119900, prepaidOnly: true, amount: () => 10000 },
  WELCOME10: { label: '10% off your first order (max ₹300)', min: 0, amount: (cart) => Math.min(Math.round(cart.total_price * 0.1), 30000) },
  TEXTEE3: {
    label: 'Any 3 Textees for ₹1,999',
    min: 0,
    amount: (cart) => {
      const units = cart.items
        .filter((item) => getProduct(item.handle)?.tags.includes('textees'))
        .flatMap((item) => Array(item.quantity).fill(item.price))
        .sort((a, b) => b - a);
      if (units.length < 3) return 0;
      return Math.max(0, units.slice(0, 3).reduce((a, b) => a + b, 0) - 199900);
    },
    hint: 'Add 3 Textees to your cart to unlock',
  },
};

export const SHIPPING_FEE = 7900;
export const FREE_SHIPPING_MIN = 99900;

export const getCoupon = () => read(KEY, null);

/** Validate a code against a cart. Returns { ok, code, discount, message }. */
export function evaluateCoupon(code, cart, { paymentMethod = 'prepaid' } = {}) {
  const normalized = String(code || '').trim().toUpperCase();
  const coupon = COUPONS[normalized];
  if (!coupon) return { ok: false, message: 'That code doesn’t exist. Try PREPAID100 or WELCOME10.' };
  if (cart.total_price < coupon.min) return { ok: false, message: `Add items worth ₹${(coupon.min - cart.total_price) / 100} more to use ${normalized}.` };
  if (coupon.prepaidOnly && paymentMethod === 'cod') return { ok: false, message: `${normalized} works on prepaid orders only.` };
  const discount = coupon.amount(cart);
  if (!discount) return { ok: false, message: coupon.hint ?? `${normalized} doesn’t apply to this cart.` };
  return { ok: true, code: normalized, discount, label: coupon.label, message: `${normalized} applied` };
}

export function applyCoupon(code) {
  write(KEY, String(code).trim().toUpperCase());
  emit('coupon:change', { code });
}

export function removeCoupon() {
  write(KEY, null);
  emit('coupon:change', { code: null });
}

/** Full order totals for a cart. */
export function summarize(cart, { paymentMethod = 'prepaid', shippingSpeed = 'standard' } = {}) {
  const mrp = cart.total_compare;
  const subtotal = cart.total_price;
  const productSavings = mrp - subtotal;

  const code = getCoupon();
  const coupon = code ? evaluateCoupon(code, cart, { paymentMethod }) : null;
  const couponDiscount = coupon?.ok ? coupon.discount : 0;

  let shipping = paymentMethod === 'prepaid' || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  if (shippingSpeed === 'express') shipping += 9900;
  if (!cart.item_count) shipping = 0;

  const total = Math.max(0, subtotal - couponDiscount + shipping);
  return { mrp, subtotal, productSavings, coupon, couponDiscount, shipping, total, totalSavings: productSavings + couponDiscount };
}
