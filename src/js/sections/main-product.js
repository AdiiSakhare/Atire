/**
 * Main product section: variant picking, price/stock state, add to cart
 * (button → stepper), buy now, pincode check, share, recently viewed.
 *
 * Shopify: product JSON comes from {{ product | json }}; addItems() maps to
 * /cart/add.js. `?handle=` hydration is a static-demo convenience only.
 */
import { qs, qsa, on } from '../core/dom.js';
import { emit, listen } from '../core/events.js';
import { addItems, changeItem, getQuantity } from '../core/cart.js';
import { formatMoney, discountPercent } from '../core/money.js';
import { read, write } from '../core/storage.js';
import { icon } from '../../data/icons.js';
import { getProduct } from '../../data/products.js';
import { createGallery } from './gallery.js';
import { openDrawer } from '../components/drawer.js';
import { toast } from '../components/toast.js';

const RECENT_KEY = 'atire:recently-viewed';

export function initMainProduct() {
  const section = qs('[data-main-product]');
  if (!section) return null;

  let product = JSON.parse(qs('[data-product-json]', section).textContent);
  const gallery = createGallery(qs('[data-gallery]', section));

  // Static demo: let product cards deep-link into this template.
  const requested = new URLSearchParams(location.search).get('handle');
  if (requested && requested !== product.handle && getProduct(requested)) {
    product = getProduct(requested);
    hydrate(section, product, gallery);
  }

  const state = {
    Color: product.options[0].values[0].name,
    Size: qs('[data-option="Size"][aria-checked="true"]', section)?.dataset.value ?? null,
  };

  const currentVariant = () =>
    product.variants.find((v) => v.option1 === state.Color && v.option2 === state.Size) ?? null;

  /* -------------------------------------------------------------- render */
  function render() {
    // Option buttons
    qsa('[data-option]', section).forEach((btn) => {
      btn.setAttribute('aria-checked', String(state[btn.dataset.option] === btn.dataset.value));
    });
    qsa('[data-option-value]', section).forEach((el) => (el.textContent = state[el.dataset.optionValue] ?? ''));

    // Size availability for the selected colour
    qsa('[data-option="Size"]', section).forEach((btn) => {
      const variant = product.variants.find((v) => v.option1 === state.Color && v.option2 === btn.dataset.value);
      btn.toggleAttribute('data-unavailable', !variant?.available);
      btn.querySelector('.size-pill__flag')?.remove();
      if (variant?.available && variant.inventory_quantity <= 3) {
        btn.insertAdjacentHTML('beforeend', `<span class="size-pill__flag">${variant.inventory_quantity} left</span>`);
      }
    });

    const variant = currentVariant();
    const hint = qs('[data-stock-hint]', section);
    hint.className = 'pdp-option__hint';
    if (!variant) {
      hint.textContent = '';
    } else if (!variant.available) {
      hint.textContent = `${state.Size} is sold out in ${state.Color}. Try another size — or tap to get notified.`;
      hint.classList.add('is-urgent');
    } else if (variant.inventory_quantity <= 5) {
      hint.textContent = `Hurry! Only ${variant.inventory_quantity} left in ${state.Size}.`;
      hint.classList.add('is-urgent');
    } else {
      hint.textContent = 'In stock · Ships within 24 hours';
    }

    // Price
    const priced = variant ?? product.variants[0];
    qsa('[data-price-current]').forEach((el) => (el.textContent = formatMoney(priced.price)));
    const compare = qs('[data-price-compare]', section);
    if (compare) compare.textContent = formatMoney(priced.compare_at_price);
    const off = qs('[data-price-off]', section);
    if (off) off.textContent = `${discountPercent(priced.price, priced.compare_at_price)}% OFF`;

    const sku = qs('[data-variant-sku]', section);
    if (sku) sku.textContent = priced.sku;

    renderCta();
    emit('variant:change', { product, variant, state: { ...state } });
  }

  /** ATC slot mirrors cart quantity for the selected variant (mockup stepper). */
  function renderCta() {
    const slot = qs('[data-main-ctas] [data-atc-slot]', section);
    const variant = currentVariant();
    const quantity = variant ? getQuantity(variant.id) : 0;
    const soldOut = variant && !variant.available;

    slot.innerHTML = quantity
      ? `<div class="stepper">
           <button type="button" data-pdp-qty="${quantity - 1}" aria-label="Decrease">${icon(quantity === 1 ? 'trash' : 'minus')}</button>
           <span class="stepper__count" aria-live="polite">${quantity} in cart</span>
           <button type="button" data-pdp-qty="${quantity + 1}" aria-label="Increase">${icon('plus')}</button>
         </div>`
      : `<button class="btn btn--primary btn--block btn--lg" type="button" data-pdp-atc ${soldOut ? 'disabled' : ''}>${soldOut ? 'Sold Out' : 'Add to Cart'}</button>`;
  }

  /* ------------------------------------------------------------ actions */
  function requireSize() {
    if (state.Size) return true;
    const group = qs('[data-size-group]', section);
    const hint = qs('[data-stock-hint]', section);
    hint.textContent = 'Please select a size first';
    hint.className = 'pdp-option__hint is-error';
    group.classList.remove('is-shaking');
    void group.offsetWidth;
    group.classList.add('is-shaking');
    group.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  }

  async function addToCart({ openCart = true } = {}) {
    if (!requireSize()) return false;
    const variant = currentVariant();
    if (!variant?.available) return false;
    await addItems([{ id: variant.id, quantity: 1 }]);
    if (!openCart) return true;
    return true;
  }

  on(section, 'click', '[data-option]', (event, btn) => {
    state[btn.dataset.option] = btn.dataset.value;
    if (btn.dataset.option === 'Color') {
      const imageIndex = product.images.findIndex((img) => img.color === btn.dataset.value);
      if (imageIndex > -1) gallery.goTo(imageIndex);
    }
    render();
  });

  on(section, 'click', '[data-pdp-atc]', () => addToCart());

  on(section, 'click', '[data-pdp-qty]', (event, btn) => {
    changeItem(currentVariant().id, Number(btn.dataset.pdpQty));
  });

  on(document, 'click', '[data-pdp-buy]', async () => {
    const variant = currentVariant();
    if (!requireSize()) return;
    if (!getQuantity(variant.id)) await addItems([{ id: variant.id, quantity: 1 }]);
    openDrawer('cart-drawer');
    toast('Ready when you are — tap Checkout', { iconName: 'bolt' });
  });

  // Pincode
  qs('[data-pincode-form]', section)?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = event.target.pincode.value.trim();
    const result = qs('[data-pincode-result]', section);
    if (!/^[1-9]\d{5}$/.test(value)) {
      result.className = 'pdp-delivery__result is-error';
      result.textContent = 'Please enter a valid 6-digit pincode.';
      return;
    }
    const date = new Date();
    let added = 0;
    while (added < 3) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) added++;
    }
    const label = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    result.className = 'pdp-delivery__result';
    result.innerHTML = `${icon('check-circle')}<span>Delivery by <strong>${label}</strong> to ${value} · COD available</span>`;
    write('atire:pincode', value);
  });
  const savedPin = read('atire:pincode', '');
  if (savedPin) {
    qs('#pincode', section).value = savedPin;
  }

  // Share
  qs('[data-share]', section)?.addEventListener('click', async () => {
    const data = { title: product.title, url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* dismissed */ }
    } else {
      try { await navigator.clipboard.writeText(location.href); } catch { /* blocked */ }
      toast('Link copied to clipboard', { iconName: 'share' });
    }
  });

  // Recently viewed
  const recent = read(RECENT_KEY, []).filter((h) => h !== product.handle);
  write(RECENT_KEY, [product.handle, ...recent].slice(0, 12));

  listen('cart:change', renderCta);
  render();

  return {
    product: () => product,
    selectSize: (size) => {
      state.Size = size;
      render();
    },
    addToCart,
    requireSize,
  };
}

/** Rewrite the server-rendered product with another product (demo only). */
function hydrate(section, product, gallery) {
  document.title = `${product.title} — Atire`;
  qs('[data-product-title]', section).textContent = product.title;
  qs('[data-product-breadcrumb]', section).textContent = product.card_title ?? product.title;
  qs('[data-lowest-price]', section).textContent = `Get it for as low as ${formatMoney(product.price - 10000)}`;
  qsa('[data-wishlist-toggle]', section).forEach((b) => (b.dataset.wishlistToggle = product.handle));

  const rating = qs('.pdp-info__rating', section);
  rating.querySelector('.stars').style.setProperty('--fill', `${(product.rating.value / 5) * 100}%`);
  rating.querySelector('span:not([class])').textContent = product.rating.value;
  rating.querySelector('.pdp-info__reviews').textContent = `${product.rating.count} reviews`;

  const badge = qs('.pdp-gallery__badge', section);
  if (badge) {
    badge.hidden = !product.badge;
    badge.textContent = product.badge ?? '';
  }

  const chips = qs('.pdp-info__chips', section);
  chips.innerHTML = (product.metafields.chips ?? ['100% Cotton', 'Oversized Fit'])
    .map((chip) => `<li class="chip">${chip}</li>`)
    .join('');

  qs('.swatches', section).innerHTML = product.options[0].values
    .map(
      (c, i) =>
        `<button class="swatch" type="button" role="radio" style="--swatch:${c.swatch}" aria-checked="${i === 0}" aria-label="${c.name}" data-option="Color" data-value="${c.name}" ${c.light ? 'data-light' : ''}>${icon('check')}</button>`,
    )
    .join('');

  qs('.pdp-highlights', section).innerHTML = product.metafields.highlights
    .map((h) => `<div><dt>${h.label}</dt><dd>${h.value}</dd></div>`)
    .join('');

  gallery.setImages(product.images);

  const sticky = qs('[data-sticky-atc]');
  if (sticky) {
    qs('.sticky-atc__title', sticky).textContent = product.card_title ?? product.title;
    qs('.sticky-atc__thumb', sticky).src = product.images[0].src;
  }

  if (!product.metafields.story) qs('[data-story]')?.remove();
}
