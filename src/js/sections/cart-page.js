/** Full cart page: rich line items, save-for-later, coupons, totals. */
import { qs, on } from '../core/dom.js';
import { listen } from '../core/events.js';
import { getCart, changeItem } from '../core/cart.js';
import { summarize, FREE_SHIPPING_MIN } from '../core/pricing.js';
import { formatMoney, discountPercent } from '../core/money.js';
import * as wishlist from '../core/wishlist.js';
import { icon } from '../../data/icons.js';
import { renderSummary, initCouponUi } from '../components/summary.js';
import { toast } from '../components/toast.js';

const line = (item) => `
  <li class="cp-line" data-line="${item.id}">
    <a class="cp-line__media" href="${item.url}"><img src="${item.image}" alt="" /></a>
    <div class="cp-line__info">
      <div class="cp-line__top">
        <div>
          <a class="cp-line__title" href="${item.url}">${item.product_title}</a>
          <p class="cp-line__variant">${item.variant_title.replace(' / ', ' · Size ')}</p>
        </div>
        <div class="price cp-line__price">
          <span class="price__current">${formatMoney(item.line_price)}</span>
          ${item.compare_at_price ? `<s class="price__compare">${formatMoney(item.compare_at_price * item.quantity)}</s><span class="price__off">${discountPercent(item.price, item.compare_at_price)}% OFF</span>` : ''}
        </div>
      </div>
      <p class="cp-line__ship">${icon('truck')} Ships in 24 hours · Easy 7-day returns</p>
      <div class="cp-line__actions">
        <div class="stepper stepper--outline">
          <button type="button" data-qty="${item.quantity - 1}" aria-label="Decrease">${icon(item.quantity === 1 ? 'trash' : 'minus')}</button>
          <span class="stepper__count">${item.quantity}</span>
          <button type="button" data-qty="${item.quantity + 1}" aria-label="Increase">${icon('plus')}</button>
        </div>
        <button class="cp-line__link" type="button" data-save-later="${item.handle}">${icon('heart')} Save for later</button>
        <button class="cp-line__link" type="button" data-qty="0">${icon('trash')} Remove</button>
      </div>
    </div>
  </li>`;

export function initCartPage() {
  const root = qs('[data-cart-page]');
  if (!root) return;

  const render = async () => {
    const cart = await getCart();
    const totals = summarize(cart);
    const empty = cart.item_count === 0;

    qs('[data-cp-count]', root).textContent = empty ? '' : `(${cart.item_count})`;
    qs('[data-cp-layout]', root).hidden = empty;
    qs('[data-cp-ship]', root).hidden = empty;
    qs('[data-cp-empty]', root).hidden = !empty;
    document.querySelector('[data-cp-mobile-bar]').hidden = empty;

    qs('[data-cp-items]', root).innerHTML = cart.items.map(line).join('');
    renderSummary(root, totals);
    document.querySelector('[data-cp-mobile-total]').textContent = formatMoney(totals.total);

    const left = FREE_SHIPPING_MIN - cart.total_price;
    qs('[data-cp-ship-text]', root).innerHTML =
      left > 0
        ? `${icon('truck')} Prepaid orders ship FREE. For COD, add <strong>${formatMoney(left)}</strong> more for free delivery.`
        : `${icon('truck')} 🎉 <strong>Free delivery unlocked</strong> on every payment method.`;
    qs('[data-cp-ship-bar]', root).style.setProperty('--progress', `${Math.min(100, (cart.total_price / FREE_SHIPPING_MIN) * 100)}%`);
  };

  on(root, 'click', '[data-qty]', (e, btn) => changeItem(btn.closest('[data-line]').dataset.line, Number(btn.dataset.qty)));
  on(root, 'click', '[data-save-later]', (e, btn) => {
    if (!wishlist.hasItem(btn.dataset.saveLater)) wishlist.toggle(btn.dataset.saveLater);
    changeItem(btn.closest('[data-line]').dataset.line, 0);
    toast('Moved to your wishlist', { iconName: 'heart' });
  });

  initCouponUi(root, { onChange: render });
  listen('cart:change', render);
  render();
}
