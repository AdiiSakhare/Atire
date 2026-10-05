/**
 * Product card behaviour (delegated, so client-rendered cards just work):
 *  - Add to Cart → yellow quantity stepper (mockup interaction)
 *  - Quick-add size picker on hover
 *  - Wishlist hearts everywhere ([data-wishlist-toggle])
 */
import { qsa, on } from '../core/dom.js';
import { listen } from '../core/events.js';
import { addItems, changeItem, getQuantity } from '../core/cart.js';
import * as wishlist from '../core/wishlist.js';
import { getProduct } from '../../data/products.js';
import { icon } from '../../data/icons.js';
import { toast } from './toast.js';
import { openQuickShop } from './quick-shop.js';

const defaultVariant = (product, size = 'M') =>
  product.variants.find((v) => v.option2 === size && v.available) ?? product.variants.find((v) => v.available);

const stepperTemplate = (variantId, quantity) => `
  <div class="stepper" data-card-stepper="${variantId}">
    <button type="button" data-card-qty="${quantity - 1}" aria-label="${quantity === 1 ? 'Remove' : 'Decrease'}">${icon(quantity === 1 ? 'trash' : 'minus')}</button>
    <span class="stepper__count" aria-live="polite">${quantity}</span>
    <button type="button" data-card-qty="${quantity + 1}" aria-label="Increase">${icon('plus')}</button>
  </div>`;

const buttonTemplate = () => `<button class="btn btn--primary btn--block" type="button" data-card-atc>Add to Cart</button>`;

/** Render each card's CTA slot from cart state. */
function syncCard(card) {
  const product = getProduct(card.dataset.handle);
  const slot = card.querySelector('[data-atc-slot]');
  if (!product || !slot) return;
  const inCart = product.variants.find((v) => getQuantity(v.id) > 0);
  const variantId = Number(card.dataset.variantId) || inCart?.id || defaultVariant(product).id;
  const quantity = getQuantity(variantId);
  slot.innerHTML = quantity ? stepperTemplate(variantId, quantity) : buttonTemplate();
  if (quantity) card.dataset.variantId = variantId;
}

export const syncCards = (root = document) => qsa('[data-product-card]', root).forEach(syncCard);

export function syncWishlistButtons(root = document) {
  qsa('[data-wishlist-toggle]', root).forEach((button) => {
    button.setAttribute('aria-pressed', String(wishlist.hasItem(button.dataset.wishlistToggle)));
  });
  qsa('[data-wishlist-count], [data-wishlist-count-mobile]').forEach((badge) => {
    badge.textContent = wishlist.count();
    badge.classList.toggle('is-visible', wishlist.count() > 0);
  });
}

export function initProductCards() {
  syncCards();
  syncWishlistButtons();

  // Add to Cart asks for size first (quick shop) instead of guessing one
  on(document, 'click', '[data-card-atc]', (event, button) => {
    openQuickShop(button.closest('[data-product-card]').dataset.handle);
  });

  // Remember which variant came from quick shop so the card stepper tracks it
  listen('quick-shop:add', ({ handle, variantId }) => {
    qsa(`[data-product-card][data-handle="${handle}"]`).forEach((card) => (card.dataset.variantId = variantId));
  });

  on(document, 'click', '[data-card-qty]', (event, button) => {
    const id = button.closest('[data-card-stepper]').dataset.cardStepper;
    changeItem(id, Number(button.dataset.cardQty));
  });

  on(document, 'click', '[data-quick-size]', (event, button) => {
    const card = button.closest('[data-product-card]');
    const product = getProduct(card.dataset.handle);
    const variant = defaultVariant(product, button.dataset.quickSize);
    card.dataset.variantId = variant.id;
    addItems([{ id: variant.id, quantity: 1 }]);
  });

  on(document, 'click', '[data-wishlist-toggle]', (event, button) => {
    event.preventDefault();
    const active = wishlist.toggle(button.dataset.wishlistToggle);
    toast(active ? 'Saved to your wishlist' : 'Removed from wishlist', { iconName: 'heart' });
  });

  listen('cart:change', () => syncCards());
  listen('wishlist:change', () => syncWishlistButtons());
}
