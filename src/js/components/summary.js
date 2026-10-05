/** Shared price-summary + coupon UI for cart page and checkout. */
import { qs, qsa } from '../core/dom.js';
import { formatMoney } from '../core/money.js';
import { COUPONS, applyCoupon, removeCoupon, evaluateCoupon, getCoupon } from '../core/pricing.js';
import { getCart } from '../core/cart.js';

export function renderSummary(root, totals) {
  const rows = [
    ['Total MRP', formatMoney(totals.mrp)],
    ['Discount on MRP', `− ${formatMoney(totals.productSavings)}`, 'is-save'],
  ];
  if (totals.coupon?.ok) rows.push([`Coupon <em>${totals.coupon.code}</em> <button type="button" class="summary__remove" data-coupon-remove>Remove</button>`, `− ${formatMoney(totals.couponDiscount)}`, 'is-save']);
  rows.push(['Delivery', totals.shipping === null ? 'Calculated at checkout' : totals.shipping ? formatMoney(totals.shipping) : '<span class="is-free">FREE</span>']);

  qs('[data-summary-rows]', root).innerHTML =
    rows.map(([k, v, cls = '']) => `<div class="${cls}"><dt>${k}</dt><dd>${v}</dd></div>`).join('') +
    `<div class="summary__total"><dt>Total <small>Incl. of all taxes</small></dt><dd>${formatMoney(totals.total)}</dd></div>`;

  const savings = qs('[data-summary-savings]', root);
  if (savings) savings.textContent = totals.totalSavings > 0 ? `🎉 You’re saving ${formatMoney(totals.totalSavings)} on this order` : '';
}

/** Wire coupon form(s) + offer chips inside `root`. `onChange` re-renders. */
export function initCouponUi(root, { getPaymentMethod = () => 'prepaid', onChange }) {
  const form = qs('[data-coupon-form]', root);
  const msg = qs('[data-coupon-msg]', root);
  const offers = qs('[data-coupon-offers]', root);

  const setMsg = (text, ok) => {
    msg.textContent = text;
    msg.className = `summary__msg ${ok ? 'is-ok' : 'is-error'}`;
  };

  const tryApply = async (code) => {
    const cart = await getCart();
    const result = evaluateCoupon(code, cart, { paymentMethod: getPaymentMethod() });
    if (result.ok) {
      applyCoupon(result.code);
      setMsg(`✓ ${result.code} applied — you saved ${formatMoney(result.discount)}`, true);
    } else {
      setMsg(result.message, false);
    }
    onChange();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    if (input.value.trim()) tryApply(input.value);
  });

  root.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-offer]');
    if (chip) tryApply(chip.dataset.offer);
    if (event.target.closest('[data-coupon-remove]')) {
      removeCoupon();
      setMsg('', true);
      onChange();
    }
  });

  // Only render client-side offers when the store defines some (the theme keeps Liquid-rendered ones).
  if (offers && Object.keys(COUPONS).length) {
    offers.innerHTML = Object.entries(COUPONS)
      .map(([code, c]) => `<button class="offer-chip" type="button" data-offer="${code}"><strong>${code}</strong><span>${c.label}</span><em>Apply</em></button>`)
      .join('');
  }

  const current = getCoupon();
  if (current) qsa('[data-coupon-form] input', root).forEach((i) => (i.value = current));
}
