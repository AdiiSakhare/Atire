# Shopify store setup (one-time)

Needed before the theme can be tested for real. Create a free **development store** from a Shopify Partners account
(or use an existing store). Currency INR, region India.

## 1. Connect the CLI
```bash
export PATH="$HOME/.local/node/bin:$PATH"
npx shopify auth login --store <your-store>.myshopify.com   # opens the browser; done by you, not Claude
npm run theme:dev                                            # serves ./theme on http://127.0.0.1:9292
```

## 2. Product metafield definitions (Settings → Custom data → Products → Add definition)
Namespace `custom`. Create these **before** importing products.

| Name | Key | Type |
|---|---|---|
| Tagline | `tagline` | Single line text |
| Card title | `card_title` | Single line text |
| Badge | `badge` | Single line text |
| Rating value | `rating_value` | Decimal |
| Rating count | `rating_count` | Integer |
| Collection label | `collection_label` | Single line text |
| Chips | `chips` | JSON |
| Highlights | `highlights` | JSON |
| Story | `story` | JSON |

Enable "Storefronts" access on each so Liquid can read them.

## 3. Import the catalogue
```bash
npm run shopify:products -- --base-url=https://<public-host>   # optional, see below
```
Imports `shopify/import/products.csv` via Products → Import. 14 products, 18 variants each (colour × size).
17 of 31 images are local placeholders Shopify cannot fetch; they are listed in `shopify/import/missing-images.txt`.
Either pass `--base-url` pointing at a public host serving `public/`, or upload those images in the admin afterwards.
Colour-to-photo linking relies on each colour's **variant image** (the CSV sets it).

## 4. Collections (Products → Collections, smart/automated, rule: tag equals)
Men (`men`), Women (`women`), Couples (`couples`), Developers (`developers`), Textees (`textees`), Hoodies (`hoodies`),
New Arrivals (`new`), Bestsellers (`bestseller`). Keep **All** (built in).

## 4b. Menus (Content → Menus)
`main-menu` (Products, Collections, Trending, Our Story), `footer` (Shop links), `footer-help`, `footer-company`, `footer-legal`, and `shop-categories` (the chips above the product grid: New, Bestsellers, Men, Women, Couples, Textees, Developers, Hoodies → their collections).
Install **Shopify Search & Discovery** and enable filters for Size, Colour (option names must be `Size` and `Color`), Price and Availability.
Settings → Customer accounts → choose **Classic** (the theme's login/account templates only apply to classic accounts).
In the theme editor, add Header → *Mega menu* blocks whose "Menu item title" matches `Products` / `Collections` and point their columns at sub-menus (create e.g. `mega-men`, `mega-women`, `mega-vibe`).
Settings → Theme settings → Brand: set free-shipping threshold; Welcome popup: set the code and create the discount in Discounts.

## 5. Pages (Content → Pages) with template suffix
About (`about`), Contact (`contact`), FAQ (`faq`), Size Guide (`size-guide`), Bulk Orders (`bulk-orders`), Track Order (`track-order`),
Wishlist (`wishlist`), Shipping / Returns / Privacy / Terms (`policy`). Suffix names match `templates/page.<suffix>.json` (built in Phases 6).
