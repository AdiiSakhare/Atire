/**
 * Cart store with the same shape as Shopify's AJAX Cart API (/cart.js).
 * Methods return Promises so they can be swapped for real fetch() calls:
 *
 *   addItems([{ id, quantity }])   → POST /cart/add.js
 *   changeItem(key, quantity)      → POST /cart/change.js
 *   getCart()                      → GET  /cart.js
 */
import { read, write } from './storage.js';
import { emit } from './events.js';
import { products } from '../../data/products.js';

const KEY = 'atire:cart';

const variantIndex = new Map();
for (const product of products) {
  for (const variant of product.variants) variantIndex.set(variant.id, { product, variant });
}

export const findVariant = (id) => variantIndex.get(Number(id));

let lines = read(KEY, []).filter((line) => variantIndex.has(line.id));

function toCart() {
  const items = lines.map(({ id, quantity }) => {
    const { product, variant } = findVariant(id);
    return {
      key: String(id),
      id,
      variant_id: id,
      handle: product.handle,
      url: product.url,
      product_title: product.card_title ?? product.title,
      variant_title: variant.title,
      image: (product.images.find((img) => img.color === variant.option1) ?? product.images[0]).src,
      price: variant.price,
      compare_at_price: variant.compare_at_price,
      quantity,
      line_price: variant.price * quantity,
    };
  });

  return {
    items,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    total_price: items.reduce((sum, item) => sum + item.line_price, 0),
    total_compare: items.reduce((sum, item) => sum + (item.compare_at_price ?? item.price) * item.quantity, 0),
  };
}

function commit(detail = {}) {
  write(KEY, lines);
  const cart = toCart();
  emit('cart:change', { cart, ...detail });
  return cart;
}

export const getCart = async () => toCart();

export const getQuantity = (id) => lines.find((line) => line.id === Number(id))?.quantity ?? 0;

export async function addItems(items) {
  for (const { id, quantity = 1 } of items) {
    const line = lines.find((l) => l.id === Number(id));
    if (line) line.quantity += quantity;
    else lines.push({ id: Number(id), quantity });
  }
  return commit({ added: items });
}

export async function changeItem(id, quantity) {
  lines = quantity > 0
    ? lines.map((line) => (line.id === Number(id) ? { ...line, quantity } : line))
    : lines.filter((line) => line.id !== Number(id));
  return commit({ changed: { id, quantity } });
}
