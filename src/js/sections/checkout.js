/**
 * Demo checkout + order confirmation. Validates inline, saves the order
 * locally and redirects to the thank-you page. Shopify Checkout replaces
 * this in production; no payment credentials are ever collected here.
 */
import { qs, qsa } from '../core/dom.js';
import { getCart, changeItem } from '../core/cart.js';
import { summarize, removeCoupon } from '../core/pricing.js';
import { formatMoney } from '../core/money.js';
import { saveOrder, getOrder, getOrders, newOrderId, estimateDelivery, formatDate } from '../core/orders.js';
import { renderSummary, initCouponUi } from '../components/summary.js';
import { icon } from '../../data/icons.js';

const lineMini = (item) => `
  <li class="co-line">
    <span class="co-line__media"><img src="${item.image}" alt="" /><b>${item.quantity}</b></span>
    <span class="co-line__info"><strong>${item.product_title}</strong><small>${item.variant_title}</small></span>
    <span class="co-line__price">${formatMoney(item.line_price)}</span>
  </li>`;

// Tiny pincode → city lookup for the demo (Shopify/3PL APIs do this for real)
const PIN_CITY = { 4: ['Pune', 'Maharashtra'], 40: ['Mumbai', 'Maharashtra'], 11: ['New Delhi', 'Delhi'], 56: ['Bengaluru', 'Karnataka'], 60: ['Chennai', 'Tamil Nadu'], 50: ['Hyderabad', 'Telangana'], 70: ['Kolkata', 'West Bengal'], 38: ['Ahmedabad', 'Gujarat'] };

function initCheckout() {
  const root = qs('[data-checkout]');
  if (!root) return;
  const form = qs('[data-checkout-form]', root);

  const payment = () => form.payment.value === 'cod' ? 'cod' : 'prepaid';
  const speed = () => form.speed.value;

  const render = async () => {
    const cart = await getCart();
    if (!cart.item_count) {
      location.href = '/cart.html';
      return;
    }
    qs('[data-co-count]', root).textContent = `(${cart.item_count} item${cart.item_count > 1 ? 's' : ''})`;
    qs('[data-co-items]', root).innerHTML = cart.items.map(lineMini).join('');
    const totals = summarize(cart, { paymentMethod: payment(), shippingSpeed: speed() });
    renderSummary(root, totals);
    qs('[data-place-order]', root).textContent = payment() === 'cod' ? `Place Order · ${formatMoney(totals.total)}` : `Pay ${formatMoney(totals.total)}`;
    return { cart, totals };
  };

  // Delivery ETAs
  qsa('[data-eta]', root).forEach((el) => (el.textContent = `Arrives by ${formatDate(estimateDelivery(new Date(), Number(el.dataset.eta)))}`));

  // Pincode autofill
  qs('[data-pin]', form).addEventListener('input', (e) => {
    const pin = e.target.value;
    if (pin.length !== 6) return;
    const match = PIN_CITY[pin.slice(0, 2)] ?? PIN_CITY[pin.slice(0, 1)];
    if (match) {
      form.city.value ||= match[0];
      form.state.value = match[1];
    }
  });

  form.addEventListener('change', render);
  qs('[data-pay-note]', root).hidden = false;

  initCouponUi(root, { getPaymentMethod: payment, onChange: render });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = qs('[data-checkout-error]', root);
    qsa('.input.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));

    const invalid = qsa('input[required], select[required]', form).filter((el) => !el.checkValidity());
    if (invalid.length) {
      invalid.forEach((el) => el.closest('.input')?.classList.add('is-invalid'));
      error.hidden = false;
      error.textContent = 'Please check the highlighted fields.';
      invalid[0].focus();
      return;
    }
    error.hidden = true;

    const button = qs('[data-place-order]', root);
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span> ${payment() === 'cod' ? 'Placing order…' : 'Redirecting to payment…'}`;

    const { cart, totals } = await render();
    const data = Object.fromEntries(new FormData(form));
    const order = saveOrder({
      id: newOrderId(),
      createdAt: Date.now(),
      eta: estimateDelivery(new Date(), speed() === 'express' ? 2 : 4).toISOString(),
      customer: { name: data.name, email: data.email, phone: data.phone },
      address: { line1: data.line1, line2: data.line2, city: data.city, state: data.state, pincode: data.pincode, type: data.addrType },
      payment: form.payment.value,
      items: cart.items,
      totals,
    });

    // Clear cart + coupon, then go to thank-you
    for (const item of cart.items) await changeItem(item.id, 0);
    removeCoupon();
    setTimeout(() => (location.href = `/order-confirmed.html?order=${order.id}`), 900);
  });

  render();
}

function initOrderDone() {
  const root = qs('[data-order-done]');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('order');
  const order = (id && getOrder(id)) || getOrders()[0];

  if (!order) {
    qsa('.order-done__hero, .order-done__grid, .order-done__share', root).forEach((el) => (el.hidden = true));
    qs('[data-od-empty]', root).hidden = false;
    return;
  }

  qs('[data-od-name]', root).textContent = order.customer.name.split(' ')[0];
  qs('[data-od-id]', root).textContent = `#${order.id}`;
  qs('[data-od-email]', root).textContent = order.customer.email;
  qs('[data-od-items]', root).innerHTML = order.items.map(lineMini).join('');
  qs('[data-od-track]', root).href = `/track-order.html?order=${order.id}`;

  const t = order.totals;
  qs('[data-od-rows]', root).innerHTML = `
    <div><dt>Subtotal</dt><dd>${formatMoney(t.subtotal)}</dd></div>
    ${t.couponDiscount ? `<div class="is-save"><dt>Coupon</dt><dd>− ${formatMoney(t.couponDiscount)}</dd></div>` : ''}
    <div><dt>Delivery</dt><dd>${t.shipping ? formatMoney(t.shipping) : '<span class="is-free">FREE</span>'}</dd></div>
    <div class="summary__total"><dt>${order.payment === 'cod' ? 'To pay on delivery' : 'Paid'}</dt><dd>${formatMoney(t.total)}</dd></div>`;

  const a = order.address;
  qs('[data-od-address]', root).innerHTML = `<p class="summary__title">${icon('pin')} Delivering to</p><p><strong>${order.customer.name}</strong> · ${a.type}<br />${a.line1}${a.line2 ? `, ${a.line2}` : ''}<br />${a.city}, ${a.state} ${a.pincode}</p>`;

  const placed = new Date(order.createdAt);
  qs('[data-od-timeline]', root).innerHTML = [
    ['Order placed', formatDate(placed), 'done'],
    ['Packed & shipped', formatDate(estimateDelivery(placed, 1)), 'next'],
    ['Out for delivery', formatDate(new Date(new Date(order.eta) - 0)), ''],
    ['Delivered', `Expected ${formatDate(order.eta)}`, ''],
  ]
    .map(([title, date, state]) => `<li class="timeline__step ${state ? `is-${state}` : ''}"><span class="timeline__dot"></span><strong>${title}</strong><small>${date}</small></li>`)
    .join('');
}

export function initCheckoutFlow() {
  initCheckout();
  initOrderDone();
}
