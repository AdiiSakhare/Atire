/**
 * App-wide events on `document` — mirrors the custom events Shopify
 * themes (Dawn) use, e.g. `cart:change`, `variant:change`.
 */

export const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

export const listen = (name, handler) => {
  const wrapped = (event) => handler(event.detail);
  document.addEventListener(name, wrapped);
  return () => document.removeEventListener(name, wrapped);
};
