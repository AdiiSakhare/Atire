/**
 * Exports src/data/products.js → shopify/import/products.csv (Shopify product import).
 *
 *   npm run shopify:products -- --base-url=https://example.com
 *
 * Prices are written in rupees (CSV format; the prototype stores paise).
 * Local placeholder images (/assets/images/…) are not reachable by Shopify, so
 * they are only emitted when --base-url points at a public host serving /public.
 * Otherwise they are skipped and listed in shopify/import/missing-images.txt.
 * Create the metafield definitions first (docs/shopify-setup.md).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { products } from '../src/data/products.js';

const root = resolve(import.meta.dirname, '..');
const baseArg = process.argv.find((a) => a.startsWith('--base-url='));
const baseUrl = baseArg?.split('=')[1]?.replace(/\/$/, '');

const MF = {
  tagline: 'Tagline (product.metafields.custom.tagline)',
  card_title: 'Card title (product.metafields.custom.card_title)',
  badge: 'Badge (product.metafields.custom.badge)',
  rating_value: 'Rating value (product.metafields.custom.rating_value)',
  rating_count: 'Rating count (product.metafields.custom.rating_count)',
  collection_label: 'Collection label (product.metafields.custom.collection_label)',
  chips: 'Chips (product.metafields.custom.chips)',
  highlights: 'Highlights (product.metafields.custom.highlights)',
  story: 'Story (product.metafields.custom.story)',
};

const columns = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
  'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Image Src', 'Image Position', 'Image Alt Text', 'Variant Image', 'Status',
  ...Object.values(MF),
];

const esc = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rupees = (paise) => (paise ? (paise / 100).toFixed(2) : '');

const missing = [];
const imageUrl = (src) => {
  if (/^https?:/.test(src)) return src;
  if (baseUrl) return `${baseUrl}${src}`;
  missing.push(src);
  return '';
};

const rows = [];
for (const p of products) {
  const [colorOpt, sizeOpt] = p.options;
  const colorNames = colorOpt.values.map((c) => c.name);
  // First image tagged with a colour is that colour's variant image.
  const colorImage = Object.fromEntries(
    p.images.filter((i) => i.color).map((i) => [i.color, imageUrl(i.src)]),
  );
  const meta = {
    [MF.tagline]: p.tagline,
    [MF.card_title]: p.card_title ?? '',
    [MF.badge]: p.badge ?? '',
    [MF.rating_value]: p.rating?.value,
    [MF.rating_count]: p.rating?.count,
    [MF.collection_label]: p.collection,
    [MF.chips]: JSON.stringify(p.metafields.chips ?? []),
    [MF.highlights]: JSON.stringify(p.metafields.highlights ?? []),
    [MF.story]: p.metafields.story ? JSON.stringify(p.metafields.story) : '',
  };

  p.variants.forEach((v, i) => {
    const first = i === 0;
    const row = {
      Handle: p.handle,
      Title: first ? p.title : '',
      'Body (HTML)': first ? `<p>${p.tagline}</p>` : '',
      Vendor: first ? p.vendor : '',
      Type: first ? p.product_type : '',
      Tags: first ? p.tags.join(', ') : '',
      Published: first ? 'TRUE' : '',
      'Option1 Name': first ? colorOpt.name : '',
      'Option1 Value': v.option1,
      'Option2 Name': first ? sizeOpt.name : '',
      'Option2 Value': v.option2,
      'Variant SKU': v.sku,
      'Variant Grams': 250,
      'Variant Inventory Tracker': 'shopify',
      'Variant Inventory Qty': v.available ? v.inventory_quantity : 0,
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': rupees(v.price),
      'Variant Compare At Price': rupees(v.compare_at_price),
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Variant Image': colorImage[v.option1] ?? '',
      Status: first ? 'active' : '',
    };
    if (first) Object.assign(row, meta);
    rows.push(row);
  });

  // Gallery images go on their own rows (Shopify convention): handle + image columns only.
  p.images.forEach((img, i) => {
    const src = imageUrl(img.src);
    if (!src) return;
    rows.push({ Handle: p.handle, 'Image Src': src, 'Image Position': i + 1, 'Image Alt Text': img.alt });
  });
  void colorNames;
}

const csv = [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n');
writeFileSync(resolve(root, 'shopify/import/products.csv'), csv + '\n');
writeFileSync(resolve(root, 'shopify/import/missing-images.txt'), [...new Set(missing)].join('\n') + (missing.length ? '\n' : ''));
console.log(`products.csv: ${products.length} products, ${rows.length} rows; local images skipped: ${new Set(missing).size}`);
