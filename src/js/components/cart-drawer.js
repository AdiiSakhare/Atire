/**
 * Cart drawer + header counter. Re-renders on every `cart:change`.
 * Shopify: replace getCart()/changeItem() with /cart.js fetches or the
 * Section Rendering API — the markup contract stays the same.
 */
import { qs, on } from '../core/dom.js';
import { listen } from '../core/events.js';
import { getCart, changeItem, addItems } from '../core/cart.js';
import { formatMoney } from '../core/money.js';
import { icon } from '../../data/icons.js';
import { products } from '../../data/products.js';
import { openDrawer } from './drawer.js';

const lineTemplate = (item) => `
  <li class="cart-line" data-line="${item.id}">
    <a class="cart-line__media" href="${item.url}"><img src="${item.image}" alt="" loading="lazy" /></a>
    <div class="cart-line__info">
      <a class="cart-line__title" href="${item.url}">${item.product_title}</a>
      <p class="cart-line__variant">${item.variant_title}</p>
      <div class="cart-line__row">
        <div class="stepper stepper--outline">
          <button type="button" data-line-change="${item.quantity - 1}" aria-label="Decrease quantity">${icon(item.quantity === 1 ? 'trash' : 'minus')}</button>
          <span class="stepper__count">${item.quantity}</span>
          <button type="button" data-line-change="${item.quantity + 1}" aria-label="Increase quantity">${icon('plus')}</button>
        </div>
        <div class="price">
          <span class="price__current">${formatMoney(item.line_price)}</span>
          ${item.compare_at_price ? `<s class="price__compare">${formatMoney(item.compare_at_price * item.quantity)}</s>` : ''}
        </div>
      </div>
    </div>
  </li>`;

const upsellTemplate = (product) => `
  <div class="upsell-item">
    <img src="${product.images[0].src}" alt="" loading="lazy" />
    <div>
      <a class="upsell-item__title" href="${product.url}">${product.card_title ?? product.title}</a>
      <div class="price"><span class="price__current">${formatMoney(product.price)}</span><s class="price__compare">${formatMoney(product.compare_at_price)}</s></div>
    </div>
    <button class="icon-btn icon-btn--sm" type="button" data-upsell-add="${product.variants.find((v) => v.option2 === 'M')?.id ?? product.variants[0].id}" aria-label="Add ${product.title}">${icon('plus')}</button>
  </div>`;

function render(cart) {
  const drawer = qs('[data-cart-drawer]');
  const count = cart.item_count;

  document.querySelectorAll('[data-cart-count], [data-cart-count-mobile]').forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle('is-visible', count > 0);
  });
  if (!drawer) return;

  qs('[data-cart-drawer-count]', drawer).textContent = count ? `(${count})` : '';
  qs('[data-cart-items]', drawer).innerHTML = cart.items.map(lineTemplate).join('');
  qs('[data-cart-empty]', drawer).hidden = count > 0;
  qs('[data-cart-foot]', drawer).hidden = count === 0;
  qs('[data-cart-subtotal]', drawer).textContent = formatMoney(cart.total_price);

  const savings = cart.total_compare - cart.total_price;
  qs('[data-cart-savings]', drawer).textContent = savings > 0 ? `You’re saving ${formatMoney(savings)} on this order 🎉` : '';

  // Free-shipping progress
  const ship = qs('[data-free-ship]', drawer);
  const threshold = Number(ship.dataset.threshold);
  const remaining = Math.max(0, threshold - cart.total_price);
  ship.hidden = count === 0;
  qs('[data-free-ship-text]', ship).innerHTML = remaining
    ? `You’re <strong>${formatMoney(remaining)}</strong> away from <strong>FREE delivery</strong>`
    : `🎉 You’ve unlocked <strong>FREE delivery</strong>`;
  qs('[data-free-ship-bar]', ship).style.setProperty('--progress', `${Math.min(100, (cart.total_price / threshold) * 100)}%`);

  // Upsell: bestsellers not already in the cart
  const inCart = new Set(cart.items.map((item) => item.handle));
  const picks = products.filter((p) => !inCart.has(p.handle) && p.tags.includes('bestseller')).slice(0, 3);
  qs('[data-cart-upsell]', drawer).hidden = count === 0 || !picks.length;
  qs('[data-cart-upsell-list]', drawer).innerHTML = picks.map(upsellTemplate).join('');
}

export async function initCartDrawer() {
  render(await getCart());
  listen('cart:change', ({ cart, added }) => {
    render(cart);
    if (added) openDrawer('cart-drawer');
  });

  on(document, 'click', '[data-line-change]', (event, button) => {
    const line = button.closest('[data-line]');
    changeItem(line.dataset.line, Number(button.dataset.lineChange));
  });

  on(document, 'click', '[data-upsell-add]', (event, button) => {
    addItems([{ id: Number(button.dataset.upsellAdd), quantity: 1 }]);
  });
}
