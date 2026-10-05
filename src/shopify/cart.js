/**
 * Theme build replacement for core/cart.js — talks to Shopify's AJAX Cart API.
 * Same exports and `cart:change` event as the prototype store.
 *   addItems    → POST /cart/add.js
 *   changeItem  → POST /cart/change.js
 *   getCart     → GET  /cart.js
 * Initial state is printed by Liquid into <script id="atire-cart">.
 */
import { emit } from '../js/core/events.js';
import { products } from './catalog.js';

const variantIndex = new Map();
for (const product of products) {
  for (const variant of product.variants) variantIndex.set(Number(variant.id), { product, variant });
}
export const findVariant = (id) => variantIndex.get(Number(id));

const root = window.Shopify?.routes?.root ?? '/';
const json = { 'Content-Type': 'application/json', Accept: 'application/json' };

function normalize(raw = {}) {
  const items = (raw.items ?? []).map((line) => ({
    key: line.key,
    id: line.variant_id,
    variant_id: line.variant_id,
    handle: line.handle,
    url: line.url,
    product_title: line.product_title,
    variant_title: line.variant_title ?? '',
    image: line.featured_image?.url ?? line.image ?? '',
    price: line.final_price ?? line.price,
    compare_at_price: line.original_price > line.final_price ? line.original_price : null,
    quantity: line.quantity,
    line_price: line.final_line_price ?? line.line_price,
  }));
  const application = (raw.cart_level_discount_applications ?? [])[0];
  return {
    items,
    discount: application ? { code: application.title, amount: raw.total_discount ?? 0 } : null,
    item_count: raw.item_count ?? 0,
    total_price: raw.total_price ?? 0,
    total_compare: items.reduce((sum, item) => sum + (item.compare_at_price ?? item.price) * item.quantity, 0),
  };
}

function readInitial() {
  try {
    return JSON.parse(document.getElementById('atire-cart')?.textContent || '{}');
  } catch {
    return {};
  }
}

let cart = normalize(readInitial());

const commit = (raw, detail = {}) => {
  cart = normalize(raw);
  emit('cart:change', { cart, ...detail });
  return cart;
};

const refresh = async () => (await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' } })).json();

export const getCart = async () => cart;

export const getQuantity = (id) => cart.items.find((line) => line.id === Number(id))?.quantity ?? 0;

export async function addItems(items) {
  const response = await fetch(`${root}cart/add.js`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ items: items.map(({ id, quantity = 1 }) => ({ id: Number(id), quantity })) }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).description || 'Could not add to cart');
  return commit(await refresh(), { added: items });
}

export async function changeItem(id, quantity) {
  const line = cart.items.find((item) => item.id === Number(id));
  if (!line) return cart;
  const response = await fetch(`${root}cart/change.js`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ id: line.key, quantity }),
  });
  if (!response.ok) throw new Error('Could not update cart');
  return commit(await response.json(), { changed: { id, quantity } });
}
