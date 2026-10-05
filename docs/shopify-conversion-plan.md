# Atire → Shopify: Conversion Plan

**Goal:** a complete Online Store 2.0 theme in `theme/` that looks and moves exactly like the current prototype, with all content editable in the Shopify admin and all commerce running on Shopify.

**Non-goals:** redesigning anything, changing motion, or touching the prototype. The Vite prototype stays as the visual reference until the theme reaches parity.

---

## 1. Principles

1. **One source.** Theme CSS/JS are built from `src/`. Nothing is copy-pasted into `theme/`; only Liquid is written there.
2. **Parity first.** Every phase ends with a side-by-side check against the prototype at 390 px and 1440 px. No "improvements" mixed in.
3. **Shopify owns commerce.** Cart, checkout, discounts, accounts, orders and inventory are native. We only style and wire them.
4. **Content is data, not code.** Anything hard-coded in `src/data/*.js` becomes a section setting, block, menu, metafield or metaobject.
5. **Small, shippable phases.** Each phase leaves the theme loadable on a dev store.

---

## 2. Page inventory → Shopify template

The prototype has 21 pages.

| Prototype page | Shopify target | Ownership |
|---|---|---|
| `index` | `templates/index.json` | Theme sections |
| `product` | `templates/product.json` | Theme + Shopify product |
| `shop` | `templates/collection.json`, `search.json`, `list-collections.json` | Theme + native filtering |
| `cart` | `templates/cart.json` + cart drawer | Theme + AJAX Cart API |
| `checkout`, `order-confirmed` | **Shopify native checkout** | Not themed (see risk R3) |
| `account` | `customers/login`, `register`, `account`, `order`, `addresses`, `reset_password`, `activate_account` | Theme markup, Shopify forms |
| `track-order` | `templates/page.track-order.json` linking to the native order status page | Shopify |
| `wishlist` | `templates/page.wishlist.json` (client-side, localStorage) | Theme JS |
| `about`, `contact`, `faq`, `size-guide`, `bulk-orders` | `templates/page.<name>.json` | Theme sections |
| `journal`, `article` | `templates/blog.json`, `article.json` | Shopify blog |
| `shipping`, `returns`, `privacy`, `terms` | `templates/page.policy.json` (one template, four pages) | Shopify pages |
| `404` | `templates/404.json` | Theme |
| (new) | `gift_card.liquid`, `password.liquid` | Required by Shopify |

---

## 3. Target architecture

```
theme/
├── layout/       theme.liquid, password.liquid
├── templates/    *.json (section order + defaults only; no markup)
├── sections/     one Liquid file per section, each with {% schema %}
│                 header-group + footer-group wire the layout sections
├── snippets/     product-card, price, icon (generated), cart-drawer, quick-shop, …
├── blocks/       reusable theme blocks (if adopted)
├── assets/       BUILT output of src/ (do not edit)
├── config/       settings_schema.json, settings_data.json
└── locales/      en.default.json, en.default.schema.json
```

**Section strategy:** a prototype `.hbs` section becomes one Liquid section file. Repeated items inside it (testimonials, campaign cards, FAQ items, trust badges) become **blocks** so the merchant can add, remove and reorder them. Headings, images and links become **settings**.

**Data strategy**

| Prototype source | Shopify home |
|---|---|
| `products.js` core fields | Native product fields |
| tagline, card title, badge, ratings, chips, highlights, story | Product metafields, namespace `custom` (definitions created in admin or via a setup script) |
| `site.js` announcements | Announcement bar section blocks |
| `site.js` nav + mega menu | Menus (`main-menu`, `footer`) + mega-menu blocks in the header section |
| `site.js` social/brand | Theme settings |
| `home.js` | Home section settings and blocks |
| `pages.js` (about, faq, contact, size guide, bulk, policies) | Section settings/blocks on page templates |
| reviews | Reviews app (decision D1) |
| collections (`?c=men` etc.) | Real collections + smart-collection rules |

**Front-end contract (already built in Phase 1)**
- `src/shopify/catalog.js` and `src/shopify/cart.js` replace the prototype data and cart at build time.
- Per-template bundles: `page-home.js`, `page-product.js`, `page-shop.js`, …; one `theme.css`.

---

## 4. Phases

Sizing: **S** ≈ a few hours, **M** ≈ a day, **L** ≈ 2–3 days of focused work.

### Phase 0 — Foundations (done)
Theme folder, theme build, icon snippet, `theme.liquid`, catalog + cart modules, settings skeleton.
**Exit:** `npm run build:theme` passes. ✅

### Phase 1 — Environment & tooling (S)
- Create a free **dev store**; install Shopify CLI.
- `shopify theme dev --path theme` wired into `package.json` scripts.
- Add `shopify theme check` (Liquid linter) and `.theme-check.yml`.
- **Product import script:** generate a Shopify product CSV from `src/data/products.js` (titles, variants, prices, tags, images, metafields) so the dev store has the same catalogue.
- Create metafield definitions (script or documented admin steps).
- Create collections, menus and pages (Men, Women, Couples, New Arrivals…).
**Exit:** dev store shows the real catalogue; `theme dev` serves a blank-but-valid theme; `theme check` runs.

### Phase 2 — Global layout (M)
Sections: announcement bar, header (burger, mega menu, search, wishlist, cart count), footer, `header-group`/`footer-group`.
Snippets: logo, menu-drawer, mobile-nav, cart-drawer, quick-shop, welcome-popup, card-library, page-hero, breadcrumb, section-head, empty-state.
**Exit:** every page shows correct header/footer; cart drawer opens, adds, changes and removes lines against the real cart; search suggestions work (Shopify predictive search endpoint replaces the local product search); header menu is driven by the Navigation admin.

### Phase 3 — Home (L)
16 sections in `sections/` (hero, marquee, ticket, categories, product tabs, deals, campaigns, shop-the-look, feature, combo, UGC tilt, vibes, UGC wall, testimonials, trust, closing) plus product-rail and product-card snippet. `templates/index.json` sets the same order as `index.html`.
**Exit:** parity screenshots match; hero, countdown, tabs, hotspots, motion all work; every text/image/link editable in the theme editor.

### Phase 4 — Product page (L)
`main-product`, product-bundle, product-reviews, product-story, product-rail, sticky add-to-cart, size guide, gallery/lightbox. Variant selection by colour/size reads the injected variants and updates the URL (`?variant=`). Bundle adds several variants in one `/cart/add.js` call.
**Exit:** add to cart, Buy Now (direct to checkout), sold-out and low-stock states, gallery colour linking, recently viewed all work on real products.

### Phase 5 — Collection, search, cart, account (L)
- **Collection:** replace the client-side filtering in `src/js/sections/shop.js` with Shopify **native filtering** (`collection.filters`, Search & Discovery app) re-rendered via the Section Rendering API; sorting and pagination native. (Decision D2.)
- **Cart page:** native line items, notes, discount-code entry (`/discount/CODE`), shipping-threshold bar from theme setting.
- **Account:** keep the markup/styling, post to Shopify's customer forms; orders and addresses from Liquid objects.
**Exit:** filter, sort, paginate, search all work; sign up/sign in/order history work on the dev store.

### Phase 6 — Content pages (M)
about, contact (native `{% form 'contact' %}`), faq, size-guide, bulk-orders (contact form with custom fields), journal/article (blog), policy pages, 404, wishlist, track-order, gift card, password page.
**Exit:** every prototype page has a theme equivalent.

### Phase 7 — Commerce parity & settings (M)
- Prepaid discount (₹100 off) → automatic discount; "3 Textees for ₹1,999" → Shopify bundle discount (or app).
- COD → manual payment method with its own rules; free-shipping threshold → shipping rates.
- Remove prototype-only code from the theme build (`pricing.js`, `orders.js`, checkout/order-confirmed scripts) so nothing dead ships.
- Pull remaining hard-coded strings into `locales/en.default.json`.

### Phase 8 — Quality gate (M)
- `shopify theme check` clean.
- Visual parity: screenshots of every template at 390 px and 1440 px vs the prototype.
- Accessibility pass (keyboard, focus, contrast, alt text).
- Performance: Lighthouse mobile ≥ 90; images moved to `image_url` with responsive `srcset` and proper `loading` hints; Unsplash placeholders replaced by uploaded images.
- SEO: meta, canonical, structured data (Product, Breadcrumb, Organization), sitemap/robots defaults.
- Cross-browser (Safari iOS, Chrome Android, desktop).

### Phase 9 — Release (S)
- Connect the GitHub repo to the store (theme branch) or push with CLI.
- CI: build theme, run `theme check`, fail on errors; built `theme/assets` committed so Shopify can read them.
- Launch checklist: domains, payments, taxes, shipping, policies, analytics, redirects from any old URLs.

---

## 5. Cross-cutting rules

| Topic | Rule |
|---|---|
| **Handlebars → Liquid** | `{{> sections/x}}` → `{% section %}` / `{% render %}`; `{{money p}}` → `money_without_trailing_zeros`; `{{#each}}` → `{% for %}`; icons → `{% render 'icon' %}` |
| **Images** | `image_url` + `image_tag` with `widths`/`sizes`; never hard-code CDN URLs |
| **Strings** | Merchant-facing text via settings; fixed UI text via `locales` (`{{ 'key' | t }}`) |
| **Accessibility** | Preserve existing ARIA/focus behaviour; forms keep labels and error states |
| **Reduced motion** | Existing `?static`/`prefers-reduced-motion` behaviour preserved |
| **Git** | One branch per phase (`theme/phase-2-layout` …), PR into `main`; built assets regenerated on each PR |
| **Definition of done (per section)** | Valid Liquid · schema with sensible defaults · works with zero blocks · parity screenshot · no console errors |

---

## 6. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | 50-product limit on the injected catalogue | Fine for launch. Later: Storefront API or per-collection JSON via Section Rendering |
| R2 | Native filtering will look different from the custom filter UI | Re-skin Shopify's facet markup with the existing CSS; keep the same layout |
| R3 | Checkout styling is limited on non-Plus plans | Ship native checkout with brand colour/logo via Checkout settings; the prototype checkout page is design reference only |
| R4 | Real cart pricing differs from the prototype's mock coupon logic | Phase 7 maps each offer to a real Shopify discount before launch |
| R5 | Reviews are static data today | Decide D1 early; the section is built to take an app block |
| R6 | Placeholder images are hot-linked | Replace with uploaded assets before Phase 8 sign-off |

---

## 7. Decisions needed from you

| ID | Decision | Recommendation |
|---|---|---|
| D1 | Reviews: an app (Judge.me / Shopify's reviews) or a metaobject you maintain by hand? | An app |
| D2 | Collection filters: native Shopify filtering or keep a custom client-side UI? | Native |
| D3 | Do you have a Shopify store / dev store I can test against? | Create a free dev store |
| D4 | Real product photos available, or keep placeholders for now? | Placeholders until Phase 8 |
| D5 | Plan type (affects checkout branding and bundle discounts) | Basic is fine to start |
| D6 | One language/currency (INR) at launch? | Yes |

---

## 8. Order of work

`0 ✅ → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9`

Phases 3, 4 and 6 are independent once Phase 2 lands, so they can be built in parallel.
