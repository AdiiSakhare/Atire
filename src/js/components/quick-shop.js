/**
 * Quick shop modal — pick colour + size, add without leaving the page.
 * Opened by any [data-quick-shop="<handle>"] and by card "Add to Cart".
 * Prevents the classic mistake of silently adding a default size.
 */
import { qs, qsa, on } from '../core/dom.js';
import { addItems } from '../core/cart.js';
import { formatMoney, discountPercent } from '../core/money.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';
import { emit } from '../core/events.js';
import { getProduct } from '../../data/products.js';
import { icon } from '../../data/icons.js';

let modal;
let product;
let state = { color: null, size: null };
let lastFocus;

const variantFor = (color, size) => product.variants.find((v) => v.option1 === color && v.option2 === size);

function starRow(value) {
  const row = icon('star').repeat(5);
  return `<span class="stars stars--sm" style="--fill:${(value / 5) * 100}%"><span class="stars__base">${row}</span><span class="stars__fill">${row}</span></span>`;
}

function render() {
  const colorImage = product.images.find((img) => img.color === state.color) ?? product.images[0];
  const second = product.images.find((img) => img !== colorImage);
  qs('[data-qs-media]', modal).innerHTML = [colorImage, second]
    .filter(Boolean)
    .map((img) => `<img src="${img.src}" alt="${img.alt}" />`)
    .join('');

  qs('[data-qs-badge]', modal).textContent = product.badge ?? '';
  qs('[data-qs-badge]', modal).hidden = !product.badge;
  qs('[data-qs-title]', modal).textContent = product.card_title ?? product.title;
  qs('[data-qs-rating]', modal).innerHTML = `${starRow(product.rating.value)} <strong>${product.rating.value}</strong> · ${product.rating.count} reviews`;
  qs('[data-qs-price]', modal).innerHTML = `
    <span class="price__current">${formatMoney(product.price)}</span>
    <s class="price__compare">${formatMoney(product.compare_at_price)}</s>
    <span class="price__off">${discountPercent(product.price, product.compare_at_price)}% OFF</span>
    <span class="price__note">Inclusive of all taxes</span>`;

  qs('[data-qs-color-name]', modal).textContent = state.color;
  qs('[data-qs-colors]', modal).innerHTML = product.options[0].values
    .map(
      (c) => `<button class="swatch" type="button" role="radio" style="--swatch:${c.swatch}" aria-checked="${c.name === state.color}" aria-label="${c.name}" data-qs-color="${c.name}" ${c.light ? 'data-light' : ''}>${icon('check')}</button>`,
    )
    .join('');

  qs('[data-qs-size-name]', modal).textContent = state.size ?? '';
  qs('[data-qs-sizes]', modal).innerHTML = product.options[1].values
    .map((size) => {
      const v = variantFor(state.color, size);
      const low = v?.available && v.inventory_quantity <= 3;
      return `<button class="size-pill" type="button" role="radio" aria-checked="${size === state.size}" data-qs-size="${size}" ${v?.available ? '' : 'data-unavailable disabled'}>${size}${low ? `<span class="size-pill__flag">${v.inventory_quantity} left</span>` : ''}</button>`;
    })
    .join('');

  const variant = state.size ? variantFor(state.color, state.size) : null;
  const hint = qs('[data-qs-hint]', modal);
  hint.className = 'pdp-option__hint';
  hint.textContent = variant && variant.inventory_quantity <= 5 ? `Only ${variant.inventory_quantity} left in ${state.size}` : variant ? 'In stock · Ships within 24 hours' : '';
  if (variant && variant.inventory_quantity <= 5) hint.classList.add('is-urgent');

  const add = qs('[data-qs-add]', modal);
  add.textContent = variant ? `Add to Cart · ${formatMoney(variant.price)}` : 'Select a size';
  add.classList.toggle('is-pending', !variant);
  qs('[data-qs-link]', modal).href = product.url;
}

export function openQuickShop(handle, { size } = {}) {
  product = getProduct(handle);
  if (!product || !modal) return;
  state = { color: product.options[0].values[0].name, size: size ?? null };
  render();
  lastFocus = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
  stopScroll();
  requestAnimationFrame(() => qs('[data-qs-sizes] .size-pill:not([disabled])', modal)?.focus({ preventScroll: true }));
}

export function closeQuickShop() {
  if (!modal?.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  startScroll();
  lastFocus?.focus?.({ preventScroll: true });
}

export function initQuickShop() {
  modal = qs('[data-quick-shop-modal]');
  if (!modal) return;

  on(document, 'click', '[data-quick-shop]', (event, trigger) => {
    event.preventDefault();
    openQuickShop(trigger.dataset.quickShop);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('[data-quick-shop-close]')) return closeQuickShop();

    const color = event.target.closest('[data-qs-color]');
    if (color) {
      state.color = color.dataset.qsColor;
      if (state.size && !variantFor(state.color, state.size)?.available) state.size = null;
      return render();
    }

    const size = event.target.closest('[data-qs-size]');
    if (size) {
      state.size = size.dataset.qsSize;
      return render();
    }

    if (event.target.closest('[data-qs-add]')) {
      const variant = state.size && variantFor(state.color, state.size);
      if (!variant) {
        const sizes = qs('[data-qs-sizes]', modal);
        sizes.classList.remove('is-shaking');
        void sizes.offsetWidth;
        sizes.classList.add('is-shaking');
        const hint = qs('[data-qs-hint]', modal);
        hint.textContent = 'Pick your size to continue';
        hint.className = 'pdp-option__hint is-error';
        return;
      }
      emit('quick-shop:add', { handle: product.handle, variantId: variant.id });
      closeQuickShop();
      addItems([{ id: variant.id, quantity: 1 }]);
    }
  });

  document.addEventListener('keydown', (event) => event.key === 'Escape' && closeQuickShop());
}
