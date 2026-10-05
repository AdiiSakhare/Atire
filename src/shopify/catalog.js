/**
 * Theme build replacement for data/products.js (see vite.theme.config.js).
 * Same exports, but the catalogue comes from Liquid: snippets/catalog-json
 * prints every product into <script id="atire-catalog"> in the Product shape
 * the prototype uses, so components work unchanged.
 */
const read = () => {
  try {
    return JSON.parse(document.getElementById('atire-catalog')?.textContent || '[]');
  } catch {
    return [];
  }
};

export const products = read();

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
export const COLORS = {};

export const getProduct = (handle) => products.find((p) => p.handle === handle);
export const getProductsByHandles = (handles) => handles.map(getProduct).filter(Boolean);

export function getRecommendations(product, limit = 8) {
  const others = products.filter((p) => p.handle !== product.handle);
  const same = others.filter((p) => p.collection === product.collection);
  const rest = others.filter((p) => p.collection !== product.collection);
  return [...same, ...rest].slice(0, limit);
}
