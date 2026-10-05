import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import handlebars from 'vite-plugin-handlebars';
import { helpers } from './src/templates/helpers.js';
import { getPageContext } from './src/data/context.js';

const root = import.meta.dirname;

// Every top-level HTML file is a page (Shopify: templates/*.json).
const pages = [
  'index', 'product', 'shop', 'cart', 'checkout', 'order-confirmed', 'wishlist', 'account', 'track-order',
  'about', 'contact', 'faq', 'size-guide', 'bulk-orders', 'journal', 'article',
  'shipping', 'returns', 'privacy', 'terms', '404',
];

export default defineConfig({
  plugins: [
    handlebars({
      // Partials are addressed by path: {{> sections/header}}, {{> snippets/product-card}}
      partialDirectory: resolve(root, 'src/templates'),
      helpers,
      context: (pagePath) => getPageContext(pagePath),
    }),
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(root, `${page}.html`)])),
      output: {
        // Readable shared bundles (Shopify: assets/vendor.js, assets/global.js)
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          if (/src\/(js\/(core|components|app)|data|styles\/(base|components|main))/.test(id)) return 'global';
        },
      },
    },
  },
});
