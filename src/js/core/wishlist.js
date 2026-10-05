/** Wishlist (product handles) — Shopify: customer metafield or app. */
import { read, write } from './storage.js';
import { emit } from './events.js';

const KEY = 'atire:wishlist';
let handles = new Set(read(KEY, []));

export const hasItem = (handle) => handles.has(handle);
export const count = () => handles.size;

export function toggle(handle) {
  handles.has(handle) ? handles.delete(handle) : handles.add(handle);
  write(KEY, [...handles]);
  emit('wishlist:change', { handle, active: handles.has(handle), count: handles.size });
  return handles.has(handle);
}
