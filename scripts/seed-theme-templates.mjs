/**
 * Generates the default content of the theme's JSON templates from the
 * prototype's data files, so the theme opens looking like the prototype.
 *   npm run theme:seed        → theme/templates/index.json, product.json
 * Re-run after changing src/data/home.js. Merchant edits made in the theme
 * editor live in the store, not here.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { home } from '../src/data/home.js';
import { site, reviews } from '../src/data/site.js';

import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ph, url, blocks, merge } from './seeds/_helpers.mjs';

const root = resolve(import.meta.dirname, '..');

let sections = {};
let order = [];
const add = (id, type, settings, extra = {}) => {
  sections[id] = { type, settings, ...extra };
  order.push(id);
};

add('hero', 'hero-slideshow', { proof_rating: home.heroProof.rating, proof_reviews: home.heroProof.reviews, proof_customers: home.heroProof.customers },
  blocks(home.hero, 'slide', (s) => ({
    title: s.title, text: s.text, cta: s.cta, url: url(s.url), position: s.position, look: s.look,
    placeholder: ph(s.image), placeholder_mobile: ph(s.imageMobile),
  })));
add('marquee', 'marquee', {}, blocks(home.marquee, 'item', (text) => ({ text })));
add('ticket', 'ticket-banner', { title: home.ticket.title, subtitle: home.ticket.subtitle, code: home.ticket.code, ends_at: home.ticket.endsAt });
add('categories', 'collection-categories', { eyebrow: 'Shop by category', title: 'Find your fit', link: '/collections/all', link_label: 'Shop all' },
  blocks(home.categories, 'category', (c) => ({ title: c.title, url: url(c.url), placeholder: ph(c.image) })));
add('recently-viewed', 'product-rail', { title: 'Pick up where you left off', subtitle: 'The ones you were eyeing. Still here — for now.', source: 'recently_viewed', limit: 8 });
add('product-tabs', 'product-tabs', { eyebrow: 'Bestsellers', title: 'Browse All You Need', sub: 'The tees everyone’s talking about — restocked weekly.' },
  blocks(home.tabs, 'tab', (t) => ({ label: t.label, tag: t.tag })));
add('deals', 'deal-tiles', { eyebrow: 'Offers', title: 'Deals you can’t scroll past', sub: 'Stack them. Seriously, they stack.', link: '/collections/all', link_label: 'All offers' },
  blocks(home.deals, 'deal', (d) => ({ kicker: d.kicker, big: d.big, text: d.text, code: d.code ?? '', url: url(d.url), theme: d.theme })));
add('campaigns', 'campaign-grid', {}, (() => {
  const large = blocks(home.campaignsLarge, 'large', (c) => ({ kicker: c.kicker, title: c.title, cta: c.cta, url: url(c.url), placeholder: ph(c.image) }));
  const small = blocks(home.campaignsSmall, 'small', (c) => ({ title: c.title, meta: c.meta, url: url(c.url), placeholder: ph(c.image) }));
  return { blocks: { ...large.blocks, ...small.blocks }, block_order: [...large.block_order, ...small.block_order] };
})());
const stl = home.shopTheLook;
add('shop-the-look', 'shop-the-look', { eyebrow: stl.eyebrow, title: stl.title, text: stl.text, placeholder: ph(stl.image), image_alt: 'Model wearing the Same Sh*t Different Day tee' }, (() => {
  const spots = blocks(stl.hotspots, 'hotspot', (h) => ({ product: h.handle, x: h.x, y: h.y }));
  const items = blocks(stl.products, 'item', (handle) => ({ product: handle }));
  return { blocks: { ...spots.blocks, ...items.blocks }, block_order: [...spots.block_order, ...items.block_order] };
})());
const f = home.feature;
add('feature', 'feature-banner', { title: f.title, text: f.text, cta: f.cta, url: url(f.url), placeholder: ph(f.image), image_alt: 'Couple wearing matching Manifest More Love hoodies' },
  blocks(f.points, 'point', (text) => ({ text })));
const c = home.combo;
add('combo', 'promo-band', { kicker: c.kicker, title: c.title, price: c.price, compare: c.compare, text: c.text, cta: 'Build Your Combo', url: url(c.url) },
  blocks(c.images, 'card', (src) => ({ placeholder: ph(src) })));
add('ugc-tilt', 'ugc-tilt', { title: 'Every Atire Starts a Conversation.', subtitle: 'Real people. Real reactions. Tag us to get featured.', cta_label: `Tag ${site.instagram} to get featured` },
  blocks(site.ugc, 'photo', (u) => ({ placeholder: ph(u.src), handle: u.handle })));
add('vibes', 'vibes-list', { eyebrow: 'Shop by vibe', title: 'What’s your tee saying today?', link: '/collections/all', link_label: 'Browse all prints' },
  blocks(home.vibes, 'vibe', (v) => ({ title: v.title, count: v.count, url: `/search?type=product&q=${v.title.toLowerCase().replace(/\s+/g, '+')}`, placeholder: ph(v.image) })));
add('new-arrivals', 'product-rail', { title: 'Fresh off the press', subtitle: 'New prints drop every Friday at 7 PM.', source: 'collection', limit: 8, anchor: 'new-arrivals' });
add('ugc-wall', 'ugc-wall', { eyebrow: '#WearAtire', title: 'Straight from the community', sub: 'Tag @atire.india for a chance to be featured — and a ₹500 voucher.', link_label: 'Follow on Instagram' }, (() => {
  const items = [];
  home.ugcWall.forEach((col, i) => col.forEach((src) => items.push({ src, column: i + 1 })));
  return blocks(items, 'photo', (p) => ({ placeholder: ph(p.src), column: p.column }));
})());
const t = blocks(home.testimonials, 'testimonial', (x) => ({ name: x.name, role: x.role, text: x.text, product: x.product }));
const st = blocks(home.stats, 'stat', (s) => ({ value: s.value, suffix: s.suffix, label: s.label }));
add('testimonials', 'testimonials', { rating: home.reviewSummary.rating, review_count: home.reviewSummary.count, recommend: home.reviewSummary.recommend },
  { blocks: { ...t.blocks, ...st.blocks }, block_order: [...t.block_order, ...st.block_order] });
add('trust', 'trust-strip', {}, blocks(site.trust, 'item', (x) => ({ icon: x.icon, title: x.title, text: x.text })));
add('closing', 'closing-banner', { title: home.closing.title, text: home.closing.text, cta: home.closing.cta, url: url(home.closing.url), placeholder: ph(home.closing.image), image_alt: 'Atire tees on a rack' });

const write = (name) => {
  writeFileSync(resolve(root, `theme/templates/${name}.json`), JSON.stringify({ sections, order }, null, 2) + '\n');
  console.log(`${name}.json: ${order.length} sections`);
  sections = {};
  order = [];
};
write('index');

/* ------------------------------------------------------------ product.json */
const p = (text) => `<p>${text}</p>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const accordions = [
  { title: 'Product Description', show_description: true, content: ul(['Bio-washed for a soft, broken-in feel from day one', 'High-density print that won’t crack or fade', 'Ribbed crew neck that doesn’t stretch out']) },
  { title: 'Size & Fit', show_size_chart_link: true, content: p('<strong>Oversized fit.</strong> Take your regular size for a relaxed look, or size down for a closer fit.') + p('Model is 6\'0" / 183 cm and wears size M.') },
  { title: 'Materials & Care', content: ul(['100% combed cotton, 240 GSM', 'Machine wash cold, inside out', 'Do not iron directly on print', 'Tumble dry low or line dry in shade']) },
  { title: 'Returns & Exchange', content: p('Easy 7-day returns and exchanges from the date of delivery. Items must be unworn with tags attached. Refunds to the original payment method within 5–7 business days.') },
  { title: 'Manufacturer Details', show_sku: true, content: p('Country of origin: India. Manufactured & marketed by Atire Inc. Net quantity: 1 N.') },
];
add('main', 'main-product', { lowest_price_delta: 100, social_proof: '' },
  merge(
    blocks(home.offersForProduct ?? site.offers, 'offer', (o) => ({ title: o.title, code: o.code ?? '' })),
    blocks(site.trust, 'trust', (x) => ({ icon: x.icon, title: x.title, text: x.text })),
    blocks(accordions, 'accordion', (a) => ({ title: a.title, content: a.content, show_description: !!a.show_description, show_size_chart_link: !!a.show_size_chart_link, show_sku: !!a.show_sku })),
  ));
add('bundle', 'product-bundle', { title: 'Complete the look', sub: 'Bought together by 1,200+ people. Save ₹200 when you take all three.', discount: 200 },
  blocks(['manifest-more-love-hoodie', 'error-404-developer-tee'], 'item', (handle) => ({ product: handle })));
add('story', 'product-story', {}, blocks([{ value: '240', label: 'GSM cotton' }, { value: '3', label: 'colourways' }, { value: '0', label: 'cracks after 30 washes' }], 'fact', (f) => f));
add('reviews', 'product-reviews', {
  average: reviews.average, count: reviews.count, distribution: reviews.distribution.map((d) => d.count).join(','),
  fit_percent: reviews.fit.percent, fit_label: reviews.fit.label, fit_position: reviews.fit.position, more_photos: 24,
}, merge(
  blocks(reviews.photos, 'photo', (src) => ({ placeholder: ph(src) })),
  blocks(reviews.items, 'review', (r) => ({
    name: r.name, rating: r.rating, date: r.date, variant: r.variant, title: r.title, body: r.body, helpful: r.helpful, placeholder: ph(r.photo ?? ''),
  })),
));
add('ugc-tilt', 'ugc-tilt', { title: 'Spotted in the wild.', subtitle: 'How the Atire fam styles it. Every tee starts a conversation.', cta_label: `Tag ${site.instagram} to get featured` },
  blocks(site.ugc, 'photo', (u) => ({ placeholder: ph(u.src), handle: u.handle })));
add('recommendations', 'product-rail', { title: 'You may also like', subtitle: 'Picked for you based on this tee.', source: 'related', limit: 8, anchor: 'recommendations' });
add('recently-viewed', 'product-rail', { title: 'Recently viewed', source: 'recently_viewed', limit: 8 });
write('product');

/* ----------------------------------------------------- scripts/seeds/*.mjs */
// Each seed module default-exports () => ({ '<template-file-name>': { sections, order }, ... })
// e.g. { 'page.about': {...} } → theme/templates/page.about.json
for (const file of readdirSync(resolve(root, 'scripts/seeds')).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))) {
  const { default: seed } = await import(pathToFileURL(resolve(root, 'scripts/seeds', file)).href);
  for (const [name, tpl] of Object.entries(seed())) {
    writeFileSync(resolve(root, `theme/templates/${name}.json`), JSON.stringify(tpl, null, 2) + '\n');
    console.log(`${name}.json: ${tpl.order.length} sections (from seeds/${file})`);
  }
}
