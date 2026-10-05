/**
 * Shopify theme build → theme/assets (stable file names, no hashes).
 *   npm run build:theme
 * Same source as the prototype; only the data, site-settings + cart modules are swapped for
 * the Shopify-backed ones in src/shopify/.
 */
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const swap = {
  [resolve(root, 'src/data/products.js')]: resolve(root, 'src/shopify/catalog.js'),
  [resolve(root, 'src/data/site.js')]: resolve(root, 'src/shopify/site.js'),
  [resolve(root, 'src/js/core/routes.js')]: resolve(root, 'src/shopify/routes.js'),
  [resolve(root, 'src/js/sections/shop.js')]: resolve(root, 'src/shopify/shop.js'),
  [resolve(root, 'src/js/core/pricing.js')]: resolve(root, 'src/shopify/pricing.js'),
  [resolve(root, 'src/js/core/cart.js')]: resolve(root, 'src/shopify/cart.js'),
};

// checkout + account bundles are prototype-only: Shopify renders checkout, and customer pages are server-rendered.
const pages = ['home', 'product', 'shop', 'cart', 'content'];

export default defineConfig({
  publicDir: false,
  plugins: [
    {
      name: 'atire-shopify-swap',
      enforce: 'pre',
      async resolveId(source, importer, options) {
        if (!importer || !source.startsWith('.')) return null;
        const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
        return resolved && swap[resolved.id] ? swap[resolved.id] : null;
      },
    },
  ],
  build: {
    outDir: 'theme/assets',
    emptyOutDir: false,
    // One stylesheet (theme.css): Shopify can't inject CSS per module like Vite does.
    cssCodeSplit: false,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [`page-${p}`, resolve(root, `src/js/pages/${p}.js`)])),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunk-[name].js',
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'theme.css' : '[name][extname]'),
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          if (/src\/(js\/(core|components|app)|data|shopify|styles\/(base|components|main))/.test(id)) return 'global';
        },
      },
    },
  },
});
