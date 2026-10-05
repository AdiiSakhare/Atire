# Shopify port — status & conventions

Prototype (Vite + Handlebars → static HTML) stays the working reference. The Shopify theme lives in `theme/`
and is built from the same `src/`. Run it with `shopify theme dev --path theme` once the theme is complete.

## Build
| Command | Output |
|---|---|
| `npm run build:theme` | `theme/assets/` — `theme.css`, `page-<template>.js`, shared `chunk-*.js` (no hashes) |
| `npm run theme:icons` | regenerates `theme/snippets/icon.liquid` from `src/data/icons.js` |

`vite.theme.config.js` swaps two modules at build time so no UI code changes:
- `src/data/products.js` → `src/shopify/catalog.js` (reads `<script id="atire-catalog">`, printed by `snippets/catalog-json.liquid`)
- `src/js/core/cart.js` → `src/shopify/cart.js` (Shopify AJAX Cart API; initial state from `<script id="atire-cart">`)

## Handlebars → Liquid map
`{{> sections/x}}` → `{% section 'x' %}` / `{% render 'x' %}` · `{{money p}}` → `{{ p | money_without_trailing_zeros }}` ·
`{{icon "bag"}}` → `{% render 'icon', name: 'bag' %}` · `{{#each}}` → `{% for %}` · `{{#if}}` → `{% if %}`.
Copy that is hard-coded in `src/data/*.js` becomes section settings/blocks (editable in the theme editor).

## Product metafields (namespace `custom`)
tagline, card_title, badge, rating_value, rating_count, collection_label, chips (list), highlights (JSON), story (JSON).
Colour variants: option "Color", size: option "Size"; image alt text = colour name to link a photo to a colour.

## Known limits
- Catalogue JSON is capped at 50 products (Liquid loop limit) — move to the Storefront API when the store outgrows it.
- Coupons, checkout, order-confirmed and order tracking are prototype-only; Shopify owns them natively.

## Status
- [x] Phase 1 — theme scaffold, theme build, icon snippet, theme.liquid, catalog + cart modules, settings
- [~] Phase 2 — header/footer/announcement/drawers (written, lint-clean, untested on a store)
- [~] Phase 3 — home sections + `templates/index.json` (written, lint-clean, untested on a store)
- [~] Phase 4 — product page + `templates/product.json` (written, lint-clean, untested on a store)
- [~] Phase 5 — collection/search, cart, customer account (written, lint-clean, untested on a store)
- [~] Phase 6 — content pages (written, lint-clean, untested on a store)
