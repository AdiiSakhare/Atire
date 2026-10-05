/**
 * Product catalogue — mirrors the Shopify Product object so templates and
 * scripts port 1:1 to Liquid / the Storefront API.
 *
 *   price, compare_at_price  → integer paise (Shopify stores cents)
 *   options                  → [{ name, values }]
 *   variants                 → option1 = Color, option2 = Size
 *   metafields               → custom.* namespace (tagline, highlights …)
 *
 * Images are placeholders: local crops from the mockups + Unsplash.
 * Isomorphic: imported by vite.config (build-time) and by client JS.
 */

const PH = '/assets/images/placeholders';
const unsplash = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 1.25)}&q=75`;

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

export const COLORS = {
  blue: { name: 'Blue', swatch: '#1F5BE0' },
  red: { name: 'Red', swatch: '#E4161B' },
  black: { name: 'Black', swatch: '#111111' },
  white: { name: 'Off White', swatch: '#F3F1EA', light: true },
  beige: { name: 'Beige', swatch: '#E6D9C2', light: true },
  grey: { name: 'Grey Melange', swatch: '#D2D2D2', light: true },
  maroon: { name: 'Maroon', swatch: '#6E1E2B' },
};

const DEFAULT_HIGHLIGHTS = [
  { label: 'Fit', value: 'Oversized' },
  { label: 'Fabric', value: '100% Cotton, 240 GSM' },
  { label: 'Neck', value: 'Round Neck' },
  { label: 'Sleeve', value: 'Half Sleeve' },
  { label: 'Print', value: 'High-density Screen Print' },
  { label: 'Wash Care', value: 'Machine Wash' },
];

// Low stock on a couple of sizes so urgency messaging has something to show.
const LOW_STOCK = { L: 3, '3XL': 2 };
const SOLD_OUT = ['3XL'];

let variantSeq = 1000;

function buildProduct({ colors, soldOut = SOLD_OUT, lowStock = LOW_STOCK, ...p }) {
  const variants = [];
  for (const color of colors) {
    for (const size of SIZES) {
      variants.push({
        id: ++variantSeq,
        title: `${COLORS[color].name} / ${size}`,
        option1: COLORS[color].name,
        option2: size,
        sku: `${p.handle}-${color}-${size}`.toUpperCase(),
        price: p.price,
        compare_at_price: p.compare_at_price,
        available: !(color === colors[colors.length - 1] && soldOut.includes(size)),
        inventory_quantity: lowStock[size] ?? 40,
      });
    }
  }

  return {
    vendor: 'Atire',
    tags: [],
    ...p,
    url: `/product.html?handle=${p.handle}`,
    featured_image: p.images[0],
    options: [
      { name: 'Color', values: colors.map((c) => COLORS[c]) },
      { name: 'Size', values: SIZES },
    ],
    variants,
    metafields: {
      highlights: DEFAULT_HIGHLIGHTS,
      ...p.metafields,
    },
  };
}

export const products = [
  buildProduct({
    id: 1,
    handle: 'blue-graphic-printed-tee',
    title: "Men's Blue Graphic Printed T-shirt | 100% cotton",
    card_title: 'Minimal Design. Maximum Attention.',
    tagline: 'A clean graphic tee that speaks without trying too hard.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'printed', 'bestseller', 'new'],
    badge: 'New Drop',
    price: 99900,
    compare_at_price: 129900,
    rating: { value: 4.6, count: 102 },
    colors: ['blue', 'red', 'black'],
    images: [
      { src: `${PH}/tee-blue-graphic.jpg`, alt: 'Blue graphic printed tee, back view', color: 'Blue' },
      { src: unsplash('1589902860314-e910697dea18'), alt: 'Model wearing a blue tee on the street' },
      { src: `${PH}/cat-printed.jpg`, alt: 'Red colourway of the graphic tee', color: 'Red' },
      { src: unsplash('1593278641722-49b1047ede21'), alt: 'Model wearing the tee, front view' },
      { src: unsplash('1532202193792-e95ef22f1bce'), alt: 'Black colourway styled on model', color: 'Black' },
    ],
    metafields: {
      chips: ['100% Cotton', 'Oversized Fit', 'Bio-washed'],
      story: {
        eyebrow: 'The story behind the print',
        title: 'A splash of rebellion on a calm blue canvas.',
        body: 'Hand-drawn in our studio, then screen-printed in high-density ink so the splash sits slightly raised on the fabric. The tiny chest mark is the only thing on the front — on purpose.',
      },
    },
  }),
  buildProduct({
    id: 2,
    handle: 'college-survivor-oversized-tee',
    title: 'Oversized Tee for Every College Survivor',
    tagline: 'Wear your degree. Laugh at the trauma.',
    product_type: 'T-shirt',
    collection: 'Women',
    tags: ['women', 'textees', 'bestseller'],
    badge: 'Bestseller',
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.4, count: 318 },
    colors: ['white', 'black'],
    images: [
      { src: `${PH}/tee-college-survivor.jpg`, alt: 'College survivor oversized tee' },
      { src: unsplash('1616006897093-5e4635c0de35'), alt: 'Model in off-white oversized tee' },
    ],
  }),
  buildProduct({
    id: 3,
    handle: 'football-fans-oversized-tee',
    title: "Football Fans' Favorite Oversized Tee",
    tagline: 'For the ones who never stopped believing.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'textees', 'bestseller'],
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.5, count: 211 },
    colors: ['beige', 'white'],
    images: [
      { src: `${PH}/tee-football-fans.jpg`, alt: 'Football fans oversized tee' },
      { src: unsplash('1627225793904-a2f900a6e4cf'), alt: 'Model in white oversized tee' },
    ],
  }),
  buildProduct({
    id: 4,
    handle: 'conversation-starter-oversized-tee',
    title: 'The Conversation Starter Oversized Tee',
    tagline: 'Bold enough to turn heads. Funny enough to break the ice.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'textees', 'bestseller'],
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.3, count: 164 },
    colors: ['beige', 'black'],
    images: [
      { src: `${PH}/tee-conversation-starter.jpg`, alt: 'Conversation starter oversized tee' },
      { src: unsplash('1503341504253-dff4815485f1'), alt: 'Model in black tee' },
    ],
  }),
  buildProduct({
    id: 5,
    handle: 'couple-roast-matching-tees',
    title: 'Matching Tees for Couples Who Love to Roast Each Other',
    tagline: 'Cute. Funny. Made to wear together.',
    product_type: 'Couple Set',
    collection: 'Couples',
    tags: ['couples', 'bestseller'],
    badge: 'Couple Set',
    price: 149900,
    compare_at_price: 219900,
    rating: { value: 4.7, count: 96 },
    colors: ['black'],
    images: [
      { src: `${PH}/tee-couple-roast.jpg`, alt: 'Matching couple tees with minion print' },
      { src: unsplash('1608145550502-f53571aa63e1'), alt: 'Couple wearing matching outfits' },
    ],
  }),
  buildProduct({
    id: 6,
    handle: 'manifest-more-love-hoodie',
    title: "The Hoodie You'll Never Want to Take Off",
    tagline: 'Comfort that looks as good as it feels.',
    product_type: 'Hoodie',
    collection: 'Couples',
    tags: ['couples', 'hoodies', 'bestseller', 'winter'],
    badge: 'Winter Edit',
    price: 219900,
    compare_at_price: 299900,
    rating: { value: 4.8, count: 142 },
    colors: ['grey', 'black'],
    images: [
      { src: `${PH}/hoodie-manifest-love.jpg`, alt: 'Manifest more love hoodie, couple' },
      { src: `${PH}/cat-couple-hoodies.jpg`, alt: 'Couple wearing manifest hoodies' },
    ],
    metafields: {
      highlights: [
        { label: 'Fit', value: 'Relaxed' },
        { label: 'Fabric', value: '3-thread Fleece, 320 GSM' },
        { label: 'Neck', value: 'Hooded' },
        { label: 'Sleeve', value: 'Full Sleeve' },
        { label: 'Print', value: 'Puff Print' },
        { label: 'Wash Care', value: 'Machine Wash' },
      ],
    },
  }),
  buildProduct({
    id: 7,
    handle: 'same-sht-different-day-tee',
    title: 'Same Sh*t Different Day Tee',
    tagline: 'Monday, Thursday, whatever. Same energy.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'textees', 'new'],
    badge: 'New Drop',
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.5, count: 58 },
    colors: ['red', 'black'],
    images: [
      { src: `${PH}/tee-same-different.jpg`, alt: 'Same sh*t different day red tee' },
      { src: unsplash('1621446511130-0ed6519bfeb6'), alt: 'Graphic tee back view' },
    ],
  }),
  buildProduct({
    id: 8,
    handle: 'error-404-developer-tee',
    title: 'Error 404: Human Not Found Tee',
    tagline: 'For devs who debug everything except their sleep cycle.',
    product_type: 'T-shirt',
    collection: 'Developers',
    tags: ['developers', 'men'],
    badge: 'For Devs',
    price: 99900,
    compare_at_price: 129900,
    rating: { value: 4.6, count: 77 },
    colors: ['white', 'black'],
    images: [
      { src: `${PH}/cat-developers.jpg`, alt: 'Error 404 developer tee' },
      { src: unsplash('1529374255404-311a2a4f1fd9'), alt: 'White printed tee flat lay' },
    ],
  }),
  buildProduct({
    id: 9,
    handle: 'played-dumb-oversized-tee',
    title: 'I Played Dumb Oversized Tee',
    tagline: 'But I always knew. Obviously.',
    product_type: 'T-shirt',
    collection: 'Women',
    tags: ['women', 'textees'],
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.4, count: 133 },
    colors: ['white'],
    images: [
      { src: `${PH}/cat-women.jpg`, alt: 'I played dumb oversized tee' },
      { src: unsplash('1622445275992-e7efb32d2257'), alt: 'Model in white tee and black jacket' },
    ],
  }),
  buildProduct({
    id: 10,
    handle: 'nothing-to-worry-couple-tees',
    title: 'Nothing to Worry About Couple Tees',
    tagline: 'One asks, one answers. Perfectly balanced.',
    product_type: 'Couple Set',
    collection: 'Couples',
    tags: ['couples'],
    price: 149900,
    compare_at_price: 219900,
    rating: { value: 4.5, count: 64 },
    colors: ['maroon'],
    images: [
      { src: `${PH}/cat-couple-tees.jpg`, alt: 'Nothing to worry about couple tees' },
      { src: unsplash('1761167474214-5a5bb557629d'), alt: 'Couple in caps and hoodies' },
    ],
  }),
  buildProduct({
    id: 11,
    handle: 'beautiful-things-oversized-tee',
    title: 'Beautiful Things Oversized Tee',
    tagline: 'Honest. A little too honest.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'textees'],
    price: 89900,
    compare_at_price: 119900,
    rating: { value: 4.2, count: 89 },
    colors: ['white'],
    images: [
      { src: `${PH}/cat-men.jpg`, alt: 'Beautiful things oversized tee' },
      { src: unsplash('1593278641722-49b1047ede21'), alt: 'Model in white tee' },
    ],
  }),
  buildProduct({
    id: 12,
    handle: 'red-splash-printed-tee',
    title: 'Red Splash Printed Tee',
    tagline: 'Same splash, louder colour.',
    product_type: 'T-shirt',
    collection: 'Men',
    tags: ['men', 'printed'],
    price: 99900,
    compare_at_price: 129900,
    rating: { value: 4.5, count: 41 },
    colors: ['red', 'blue'],
    images: [
      { src: `${PH}/cat-printed.jpg`, alt: 'Red splash printed tee', color: 'Red' },
      { src: `${PH}/tee-blue-graphic.jpg`, alt: 'Blue colourway', color: 'Blue' },
    ],
  }),
  buildProduct({
    id: 13,
    handle: 'works-on-my-machine-tee',
    title: 'Works On My Machine Oversized Tee',
    tagline: 'The official excuse of every deploy gone wrong.',
    product_type: 'T-shirt',
    collection: 'Developers',
    tags: ['developers', 'men', 'textees', 'new'],
    badge: 'For Devs',
    price: 99900,
    compare_at_price: 129900,
    rating: { value: 4.7, count: 53 },
    colors: ['black', 'white'],
    images: [
      { src: `${PH}/ugc-12.jpg`, alt: 'Developer wearing a creative coding tee' },
      { src: unsplash('1503341504253-dff4815485f1'), alt: 'Model in black tee' },
    ],
  }),
  buildProduct({
    id: 14,
    handle: 'ctrl-z-oversized-tee',
    title: 'Ctrl + Z My Life Oversized Tee',
    tagline: 'If only it worked outside the IDE.',
    product_type: 'T-shirt',
    collection: 'Developers',
    tags: ['developers', 'women', 'textees'],
    price: 99900,
    compare_at_price: 129900,
    rating: { value: 4.5, count: 38 },
    colors: ['black'],
    images: [
      { src: `${PH}/ugc-04.jpg`, alt: 'Developer at a desk in a graphic tee' },
      { src: unsplash('1532202193792-e95ef22f1bce'), alt: 'Model in black tee' },
    ],
  }),
];

export const getProduct = (handle) => products.find((p) => p.handle === handle);

export const getProductsByHandles = (handles) => handles.map(getProduct).filter(Boolean);

/** Shopify-like recommendations: same collection first, then bestsellers. */
export function getRecommendations(product, limit = 8) {
  const others = products.filter((p) => p.handle !== product.handle);
  const same = others.filter((p) => p.collection === product.collection);
  const rest = others.filter((p) => p.collection !== product.collection);
  return [...same, ...rest].slice(0, limit);
}
