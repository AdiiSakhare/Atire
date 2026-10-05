# Atire — Project Log

Chronological record of project work. **Newest entry first.** Maintained per `CLAUDE.md`.

## Entry template

```
### YYYY-MM-DD · <Phase/area> · <short title>
**Status:** done | partial | blocked
**What was done:** …
**Files:** added / changed / removed (paths)
**Commands & results:** …
**Decisions (and why):** …
**Verification:** …
**Issues / blockers:** …
**Next:** …
```

## Phase status

| Phase | Scope | Status |
|---|---|---|
| 0 | Theme scaffold, theme build, cart + catalog modules | Done |
| 1 | Dev store, CLI, theme check, product import, metafields | Partial — tooling done; store login/import waiting on D3 |
| 2 | Global layout (header, footer, drawers) | Built + theme-check clean; **not yet run against a store** |
| 3 | Home page | Built + theme-check clean; **not yet run against a store** |
| 4 | Product page | Built + theme-check clean; **not yet run against a store** |
| 5 | Collection/search, cart, account | Built + theme-check clean; **not yet run against a store** |
| 6 | Content pages | Built + theme-check clean; **not yet run against a store** |
| 7 | Commerce parity (offers, COD), cleanup, locales | Partial — offers mapped in docs; locales not done; needs your decisions |
| 8 | Quality gate | Partial — lint/build gates pass; parity, accessibility, Lighthouse need a store |
| 9 | Release | Partial — CI workflow added; launch needs a store |

## Open decisions

| ID | Question | Recommendation | Answer |
|---|---|---|---|
| D1 | Reviews: app or hand-maintained metaobject | App | pending |
| D2 | Collection filters: native or custom UI | Native | pending |
| D3 | Shopify (dev) store available | Create free dev store | pending — blocks Phase 1 completion |
| D4 | Real product photos vs placeholders | Placeholders until Phase 8 | pending |

## Entries

### 2026-10-05 · Phases 6–9 · Content pages, offers mapping, CI
**Status:** partial. All pages exist as Liquid and lint clean; nothing has been rendered on a store.
**What was done:**
- **Phase 6** (three parallel helpers, then independently verified by me): about (6 sections), 404, policy, contact, FAQ, size guide, bulk orders, blog, article, wishlist, track order, gift card, password page + layout, generic page. All have seeded JSON templates (`scripts/seeds/pages-{a,b,c}.mjs`, loaded by the main seed script).
- **Phase 7:** `docs/shopify-offers.md` maps each prototype offer to a Shopify discount and lists what Shopify cannot do natively. Prototype-only code (checkout, account, coupon logic) is excluded or swapped in the theme build.
- **Phase 9:** `.github/workflows/theme.yml` (build prototype, build theme, assets-are-committed check, theme check).
**Files:** added `theme/sections/{about-*,main-404,main-policy,main-contact,main-faq,main-size-guide,main-bulk-orders,main-blog,main-article,main-wishlist,main-track-order,main-password,main-page}.liquid`, `theme/snippets/{page-hero,breadcrumb}.liquid`, `theme/layout/password.liquid`, `theme/templates/{404,blog,article,gift_card.liquid,page,page.*,password}.json`, `scripts/seeds/{_helpers,pages-a,pages-b,pages-c}.mjs`, `docs/shopify-offers.md`, `.github/workflows/theme.yml`; changed `scripts/seed-theme-templates.mjs` (shared helpers + loads `scripts/seeds/*`), `src/js/core/routes.js` + `src/shopify/routes.js` (`wishlist`), `src/js/sections/account.js` (wishlist share link via `routes.wishlist` — it pointed at `/wishlist.html`, which would 404 on Shopify; prototype unchanged), `README.md`.
**Commands & results (run by me after the helpers finished):** `npm run theme:seed` → 14 templates written; `npm run build:theme` OK; `npx vite build` OK; `shopify theme check` → 0 offenses; script check that every JSON template references an existing section and a valid order → OK.
**Decisions / deviations from the prototype (need a look from the designer):**
1. Policy pages render the Shopify page content; the prototype's table of contents and per-section anchors are gone.
2. Contact and bulk-order forms are real Shopify contact forms (the prototype's demo-form JS would block the post, so those hooks were dropped).
3. Article and track-order pages dropped the `data-article` / `data-track*` hooks, because the prototype JS would overwrite real content with demo data; track order now links logged-in customers to their Shopify orders and offers an optional courier tracking URL.
4. Size guide page shows one chart (the prototype had two: tees and hoodies); the theme stores a single chart.
5. Journal chips come from blog tags, pagination is Previous/Next links.
6. Gift card QR code loads `qrcodejs` from cdnjs.
**Verification:** static + the checks above. Not verified: any runtime behaviour on a store (forms, FAQ filter, size finder, blog markup against the existing styles, gift card and password pages' look).
**Not done / honest gaps:** (a) Locales: copy is still inline in templates, not in `locales/*.json` — only worth doing if a second language is planned. (b) Phase 8 items that need a running store: parity screenshots, Lighthouse, accessibility and cross-browser passes; image width/height attributes (check disabled, see Phase 3). (c) Shopify's native product recommendations (rails use the product's first collection). (d) Self-hosting fonts/Lucide (CDN for now). (e) Theme CSS/JS bundle is ~150 kB CSS + ~165 kB shared JS, unchanged from the prototype.
**Next:** needs a store (D3). With one: `docs/shopify-setup.md`, import `shopify/import/products.csv`, run `npm run theme:dev`, then work through the Phase 8 checklist and fix whatever the real render shows.

### 2026-10-05 · Phase 5 · Collection, search, cart, customer accounts
**Status:** partial (code complete, lint-clean; not rendered on a store). Contains the first intentional UI deviations — see Decisions.
**What was done:**
- *Collection + search* (`main-collection`, `collection.json`, `search.json`, `list-collections.json`): Shopify-native filtering/sorting/pagination (decision D2). New `src/shopify/shop.js` replaces the prototype's client-side filter script in the theme build: filters, sort and category chips re-render the section via the Section Rendering API and update the URL; "Load more" appends the next page; density toggle and filter drawer kept. Every control is a real link, so it works without JS.
- *Cart* (`main-cart`, `cart.json`): same page markup; lines and totals still rendered by `cart-page.js` from the live Shopify cart. Prototype coupon/shipping logic replaced in the theme build by `src/shopify/pricing.js`: codes are handed to Shopify (`/discount/CODE?redirect=/cart`), shipping shows "Calculated at checkout", the checkout button goes to `/checkout`.
- *Customer accounts* (`templates/customers/{login,register,account,addresses,order,reset_password,activate_account}.json` + `main-*` sections): server-rendered with Shopify's customer forms, reusing the prototype's `auth`/`dash` classes.
**Files:** added `src/shopify/{shop,pricing}.js`, `theme/sections/{main-collection,main-list-collections,main-cart,main-login,main-register,main-account,main-addresses,main-order,main-reset-password,main-activate-account}.liquid`, `theme/snippets/empty-state.liquid`, `theme/templates/{collection,search,list-collections,cart}.json`, `theme/templates/customers/*.json`; changed `vite.theme.config.js` (swaps: shop, pricing; page bundles now home/product/shop/cart/content only), `src/shopify/cart.js` (exposes the applied discount), `src/js/components/summary.js` (null shipping = "Calculated at checkout"; client offers only rendered when defined), `src/styles/pages/account.css` (`.auth__tabs a` alongside `button`), `theme/snippets/page-script.liquid`.
**Commands & results:** `npm run build:theme` OK (shop code verified present in the bundle); `npx vite build` OK; `shopify theme check` → 0 offenses. Static check: all classes from the prototype shop/cart templates are present; the dropped `data-*` attributes are only the prototype's client-filter plumbing.
**Decisions (deviations from the prototype, forced by Shopify):**
1. **Rating and “25% off” filters removed** — Shopify filters can't use ratings/discount %. Size, colour, price presets and any other native filter (availability, type, …) are kept. Price presets are blocks in the section.
2. **Sign-in is email + password**, not mobile OTP — OTP isn't available in Shopify's theme accounts. Needs a decision later if OTP login is a hard requirement (apps exist).
3. The Details/Payment/order-confirmed/track screens are Shopify's native checkout; the prototype's checkout & account JS bundles are excluded from the theme build.
4. Customer templates assume **classic customer accounts**. With Shopify's newer hosted "customer accounts", login/account pages are not themeable — switch the store setting to classic if you want these templates used.
**Verification:** static only. Unverified: facet URLs/`value.url_to_add` behaviour, price-range active detection (units assumed minor), Section Rendering swap on a real store, discount redirect, order/address forms.
**Issues / blockers:** category chips need a menu called `shop-categories` (setup doc updated). Rating/discount loss should be confirmed with the designer.
**Next:** Phase 6 (content pages).

### 2026-10-05 · Phase 4 · Product page
**Status:** partial (code complete, lint-clean, DOM contract checked statically; not rendered on a store)
**What was done:** Converted the product page to Liquid: main-product (gallery, options, price, offers, delivery check, trust, accordions), product-bundle, product-story, product-reviews (hand-maintained review blocks + an app-block slot for a reviews app), sticky add-to-cart and size-guide drawer. Extracted a single `product-json` snippet used by both the catalogue and the page so the JS always gets the same product shape. Added `templates/product.json`, generated from the prototype data by the seed script.
**Files:** added `theme/sections/{main-product,product-bundle,product-story,product-reviews}.liquid`, `theme/snippets/{product-json,size-guide,size-chart-table,sticky-atc}.liquid`; changed `theme/snippets/catalog-json.liquid` (now renders product-json; **fixed a bug from Phase 0: Color option values must be objects with swatch/light, not strings**), `theme/sections/product-rail.liquid` (new "related" source), `theme/config/settings_{schema,data}.json` (size chart settings), `theme/templates/product.json` (generated), `scripts/seed-theme-templates.mjs` (+product template), `src/js/core/routes.js` + `src/shopify/routes.js` (`checkout`), `src/js/sections/main-product.js` (Buy Now goes to `/checkout` in the theme; unchanged in the prototype where `routes.checkout` is null).
**Commands & results:** `npm run theme:seed` → index 18 sections, product 7 sections; `npm run build:theme` OK; `shopify theme check` → 0 offenses. Static class/data-attribute diff vs the Handlebars originals: nothing missing except the intentionally extracted snippets.
**Decisions:** (1) Fixed copy (description bullets, care, returns) became editable accordion blocks; the fake “38 people bought this” line is now an optional merchant-entered field, empty by default, so no invented statistic ships. (2) Reviews: static blocks now, `@app` block ready for D1 (recommended: Judge.me or similar). (3) “Recommendations” uses the product’s first collection for now; Shopify’s native recommendations endpoint is a Phase 8 upgrade. (4) Size chart lives in Theme settings (shared by the drawer and the Phase 6 size-guide page). (5) “Lowest price” chip is now a ₹-off setting.
**Verification:** static only. Not verified: variant switching with real option names, gallery colour linking (needs variant images from the CSV), sticky bar, bundle add.
**Issues / blockers:** The bundle’s “₹200 off for 3 items” is only displayed; the cart total will not reflect it until a real automatic discount exists (Phase 7). The pincode check is a prototype stub (always succeeds) — needs a real service or removal before launch.
**Next:** Phase 5 (collection/search, cart, account).

### 2026-10-05 · Phase 3 · Home page sections
**Status:** partial (code complete, lint-clean, DOM contract checked statically; not rendered on a store)
**What was done:** Converted all 16 home sections (plus product-rail used twice) to Liquid sections with schema, settings and blocks. Added shared snippets (responsive-image with placeholder fallback, price, section-head, product-title, btn-arrow). Default content for `templates/index.json` is **generated from `src/data/home.js`** so it can't drift. Placeholder images are copied into `theme/assets` and used until real photos are uploaded.
**Files:** added `theme/sections/{hero-slideshow,marquee,ticket-banner,collection-categories,deal-tiles,campaign-grid,product-rail,product-tabs,shop-the-look,feature-banner,promo-band,vibes-list,ugc-tilt,ugc-wall,testimonials,trust-strip,closing-banner}.liquid`, `theme/snippets/{responsive-image,price,section-head,product-title,btn-arrow}.liquid`, `scripts/{seed-theme-templates,copy-theme-placeholders}.mjs`; changed `theme/templates/index.json` (generated), `theme/.theme-check.yml` (ImgWidthAndHeight off, see decisions), `package.json` (`theme:seed`, `build:theme` now also copies placeholders).
**Commands & results:** `npm run theme:seed` → 18 sections; `npm run build:theme` OK (+30 placeholder files); `shopify theme check` → 0 offenses. Static DOM-contract check: every class and `data-*` attribute used in each `.hbs` section appears in its Liquid counterpart (only the extracted `btn-arrow`/`price` snippets differ, by design).
**Decisions:** (1) Repeating items → blocks, headings/images/links → settings. (2) "Shop the look" total is now computed from the chosen products instead of hard-coded ₹4,097. (3) UGC wall columns come from a per-photo "Column" setting. (4) Product tabs/rails use `collections.all` unless a collection is picked; tab tag must equal a product tag (handleized). (5) Disabled the `ImgWidthAndHeight` check: prototype images are sized by CSS; revisit in Phase 8. (6) Prototype `/shop.html?c=x` links map to `/collections/x`; vibes map to a product search.
**Verification:** static only. Not verified: image rendering, product pickers with real products, countdown/hero/tab JS against Liquid output, collection URLs (collections must exist — see docs/shopify-setup.md).
**Issues / blockers:** none new. Real photos still needed for production (D4).
**Next:** Phase 4 (product page).

### 2026-10-05 · Phase 2 · Global layout in Liquid
**Status:** partial (code complete and lint-clean; needs a live store to verify behaviour — see D3)
**What was done:** Converted the global layout to Liquid: announcement bar, header (desktop nav with mega-menu blocks, search overlay, mobile menu drawer), footer, cart drawer, quick-shop, welcome popup, mobile bottom nav, product-card, card-library, logo, stars, swatch-colour snippets; section groups `header-group.json` / `footer-group.json`. Added theme settings for the welcome popup. Made three client modules swappable in the theme build (`site` settings, `routes`) and made two forms post to Shopify when they carry a real action.
**Files:** added `theme/sections/{announcement-bar,header,footer}.liquid`, `theme/sections/{header,footer}-group.json`, `theme/snippets/{logo,stars,swatch-color,product-card,card-library,mobile-nav,cart-drawer,quick-shop,welcome-popup}.liquid`, `src/shopify/{site,routes}.js`, `src/js/core/routes.js`; changed `theme/layout/theme.liquid` (settings JSON, card-library, removed separate menu-drawer render — drawer now lives in the header section so it can read the mega blocks), `theme/config/settings_{schema,data}.json`, `vite.theme.config.js` (swap table: products, site, routes, cart), `src/js/app.js` + `src/js/components/welcome-popup.js` (real form post when `action` present; prototype forms have none, so unchanged), `src/js/components/search.js`, `src/js/sections/{product-tabs,content}.js` (URLs via `routes`).
**Commands & results:** `shopify theme check` → 22 files, 0 offenses (was 5 errors); `npm run build:theme` OK; `npx vite build` OK; prototype home page reloaded with no console errors.
**Decisions:** mega menu = header blocks keyed by top-level link title (merchant keeps navigation in the Menus admin, panels in the theme editor); card-library capped at 24 products to limit HTML weight; swatch colours resolve native swatch → brand palette → grey; hard-coded `.html` URLs in client JS go through `routes` (remaining: account.js, checkout.js — replaced in Phases 5/7).
**Verification:** static only (theme-check + builds + prototype console). Not rendered on a store: header menus, mega panels, drawer data, form posts and settings defaults are untested.
**Issues / blockers:** cart-drawer upsell and some chrome depend on `card-library`; `pages.wishlist` / `pages['track-order']` URLs fall back to `/pages/...` until those pages exist (Phase 6). Footer groups reference menus `footer-help` and `footer-company` that the setup doc must create.
**Next:** Phase 3 (home sections) — also need to add the missing menus (`footer-help`, `footer-company`, `footer-legal`) to docs/shopify-setup.md.

### 2026-10-05 · Phase 1 · Tooling, product import, setup guide
**Status:** partial (everything not needing a store is done; store connection pending D3)
**What was done:** Installed Shopify CLI locally, added theme-check config, wrote the catalogue → Shopify CSV exporter, fixed colour-to-image linking in the catalogue snippet, documented the one-time store setup. Created `log.md` and `CLAUDE.md` (logging rule).
**Files:** added `theme/.theme-check.yml`, `scripts/export-shopify-products.mjs`, `shopify/import/{products.csv,missing-images.txt}`, `docs/shopify-setup.md`, `CLAUDE.md`, `log.md`; changed `package.json` (devDependency `@shopify/cli` 4.8.4; scripts `theme:dev`, `theme:check`, `shopify:products`), `theme/snippets/catalog-json.liquid` (image colour now derived from variant featured image, so real alt text is kept; alt is no longer overloaded).
**Commands & results:** `npm install -D @shopify/cli` OK; `npm run shopify:products` → 14 products, 158 CSV rows, 15 local images skipped (17 image refs, 15 unique files, listed in missing-images.txt); `shopify theme check` → 5 errors, all MissingTemplate for snippets scheduled for Phase 2 (menu-drawer, cart-drawer, quick-shop, welcome-popup, mobile-nav); RemoteAsset warnings disabled deliberately (Google Fonts/Lucide CDN; self-host in Phase 8).
**Decisions:** metafield columns use the `Name (product.metafields.custom.key)` CSV header form; images with a colour become that colour's Variant Image; prices exported in rupees (CSV convention), prototype stays in paise.
**Verification:** CSV generated and inspected; **not yet imported** into a store, so the header format and metafield import are unverified. Liquid snippets checked by theme-check only.
**Issues / blockers:** need a Shopify store to log in to (D3). `shopify auth login` is interactive and must be done by the user.
**Next:** Phase 2 (global layout) can proceed without a store; store-dependent verification waits for D3.

### 2026-10-05 · Phase 0 · Shopify theme foundation
**Status:** done
**What was done:** Created the `theme/` skeleton and a separate theme build so the existing JS/CSS ship in a Shopify theme without UI changes. Real AJAX cart and Liquid-fed catalogue replace the prototype data at build time only. Wrote `layout/theme.liquid`, the generated icon snippet, catalogue/cart JSON snippets, settings schema, locale file.
**Files:** added `theme/{layout/theme.liquid, snippets/{icon,catalog-json,page-script}.liquid, config/*, locales/en.default.json, templates/index.json}`, `theme/assets/*` (generated), `src/shopify/{catalog,cart}.js`, `vite.theme.config.js`, `scripts/build-icon-snippet.mjs`, `docs/shopify-port.md`, `docs/shopify-conversion-plan.md`; changed `package.json` (scripts `build:theme`, `theme:icons`).
**Commands & results:** `npm run build:theme` → OK (one `theme.css` 148 kB, per-page `page-*.js`, shared `chunk-global.js`); `npm run theme:icons` → 36 icons; confirmed the swap by grepping the bundle for `atire-catalog` and `cart/add.js`.
**Decisions:** theme lives in `theme/` (Shopify needs fixed folder names at its root); single `theme.css` because Shopify cannot inject per-module CSS; catalogue JSON capped at 50 products (Liquid loop limit).
**Verification:** build only. Liquid not yet run against a store; `theme.liquid` references snippets/sections not written yet, so the theme is not loadable.
**Issues:** none open.
**Next:** Phase 1.

### 2026-10-05 · Housekeeping · Restructure to flat project root
**Status:** done
**What was done:** Moved everything from `website/` into the project root (including `.git`), removed the empty folder; moved mockup PNGs to `design/mockups/` with spaces removed; updated `scripts/extract-placeholders.mjs`, `.claude/launch.json`, README structure tree.
**Commands & results:** `npx vite build` OK; dev server renders the home page.
**Decisions:** pages stay at the root (Vite serves root HTML files as URLs and they mirror Shopify templates); `src/`, `public/` kept.
**Verification:** build + visual check of the home page in the preview.
**Next:** theme conversion.

### 2026-10-05 · Housekeeping · Untrack node_modules
**Status:** done (not committed by Claude)
**What was done:** Added `.gitignore` (node_modules, dist, caches, logs, env, OS/editor files, `.claude/`); ran `git rm -r --cached` on `node_modules` (918 files) and `.DS_Store`. Files stay on disk. User committed afterwards.
**Verification:** `git ls-files -ci --exclude-standard` empty; `package.json`/`package-lock.json` still tracked.
