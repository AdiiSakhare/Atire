# Atire — Website

Static, component-based storefront for **Atire**, built with HTML, CSS and JS, plus GSAP and Lenis. Vite compiles the Handlebars partials into plain HTML. The structure mirrors a Shopify theme so it can be ported to Liquid later.

## Run

```bash
# Node lives in ~/.local/node (installed without admin rights)
export PATH="$HOME/.local/node/bin:$PATH"

npm install
npm run dev       # http://localhost:5173/  ·  /product.html
npx vite --host   # also serve on your Wi-Fi (open http://<mac-ip>:5173 on your phone)
npm run build     # → dist/
npm run images    # re-cut placeholder images from the mockups
```

Add `?static` to any URL to turn off all motion. Useful for QA screenshots.

## Structure

```
atire/
├── design/mockups/               source design mockups (not shipped)
├── index.html, product.html      pages (Shopify: templates/*.json)
├── public/assets/images/         images (placeholders/ = temporary)
├── scripts/                      tooling (placeholder extraction)
└── src/
    ├── data/                     products.js (Shopify Product shape), site.js, icons.js, context.js
    ├── templates/
    │   ├── layout/               head, top (announcement + header), bottom (footer + drawers)
    │   ├── sections/             header, footer, main-product, product-bundle, product-reviews …
    │   ├── snippets/             product-card, cart-drawer, size-guide, sticky-atc, logo …
    │   └── helpers.js            Handlebars helpers ↔ Liquid filters (money, discount, icon, json)
    ├── styles/
    │   ├── base/                 tokens.css (design system), reset, global
    │   ├── components/           button, form atoms, product-card, overlays, cart-drawer
    │   └── sections/             one file per section
    └── js/
        ├── app.js                global bootstrap (every page)
        ├── core/                 cart store, wishlist, events, smooth-scroll, motion, money
        ├── components/           drawer, header, cart-drawer, product-card, rail, lightbox …
        ├── sections/             main-product, gallery, sticky-atc, bundle, reviews, ugc-tilt …
        └── pages/                per-page entry points
```

## Shopify mapping

| Here | Shopify |
|---|---|
| `src/templates/sections/*.hbs` | `sections/*.liquid` |
| `src/templates/snippets/*.hbs` | `snippets/*.liquid` |
| `{{> snippets/product-card product=this}}` | `{% render 'product-card', product: product %}` |
| `{{money price}}` / `{{icon "bag"}}` | `{{ price \| money }}` / `{% render 'icon-bag' %}` |
| `src/data/products.js` | Product objects (prices in paise; `variants`, `options`, `metafields`) |
| `js/core/cart.js` (`addItems`, `changeItem`) | `/cart/add.js`, `/cart/change.js` |
| `cart:change`, `variant:change` events | Same pattern as the Dawn theme |
| `tokens.css` | `settings_schema.json` colours and typography |

## Design tokens (from the mockups)

- **Yellow** `#FFC800` is used only for primary CTAs. **Ink** is `#111`. **Panel grey** is `#F8F8F8` and **media grey** is `#E4E4E4`.
- **Host Grotesk** is used for all interface and heading text, with -0.035em tracking on headings. **Montserrat** is for promo text (coupon codes).
- **Radii:** 6px (card buttons), 8px (size pills), 12–16px (cards), 24px (panels), pill.
- **Signature button:** a pill CTA plus a separate round ↗ button (`.btn-arrow`).

## Status

- ✅ Foundation: tokens, components, header (mega menu, search), footer, cart drawer
- ✅ Product page: your mockup built 1:1 above the fold, plus the full lower half
- ✅ Home page: full revamp (16 sections)
- ⏳ Listing page → About and other pages → motion polish
