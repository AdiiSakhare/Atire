/**
 * Content for static and brand pages. Everything here is PLACEHOLDER copy
 * written in the Atire voice — replace facts (dates, numbers, addresses,
 * policies) with the real ones before launch.
 * Shopify: pages, blogs/articles, metaobjects and policy settings.
 */

const PH = '/assets/images/placeholders';
const unsplash = (id, w = 1600, h = Math.round(w * 1.25)) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

/* -------------------------------------------------------------- Shop */
export const collections = {
  all: { title: 'All Products', text: 'Every tee, hoodie and couple set we make. Oversized, heavyweight and impossible to ignore.' },
  men: { title: 'Men', text: 'Oversized tees, textees and hoodies with something to say.' },
  women: { title: 'Women', text: 'Boxy fits, bold prints and textees that say it so you don’t have to.' },
  couples: { title: 'Couple Edit', text: 'Matching sets for the one who matches your energy.' },
  developers: { title: 'For Developers', text: 'Tees that compile on the first try. Unlike your code.' },
  textees: { title: 'Textees', text: 'Sarcasm, honesty and inside jokes — printed in high-density ink.' },
  hoodies: { title: 'Hoodies', text: '320 GSM fleece, puff prints and a hood that actually stays up.' },
  bestseller: { title: 'Bestsellers', text: 'The ones that keep selling out. Restocked weekly.' },
  new: { title: 'New Arrivals', text: 'Fresh drops every Friday at 7 PM.' },
  printed: { title: 'Printed T-shirts', text: 'Artwork-first graphic tees, screen printed in small batches.' },
};

export const shopFilters = {
  categories: [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Bestsellers', value: 'bestseller' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Couples', value: 'couples' },
    { label: 'Textees', value: 'textees' },
    { label: 'Developers', value: 'developers' },
    { label: 'Hoodies', value: 'hoodies' },
  ],
  prices: [
    { label: 'Under ₹999', min: 0, max: 99899 },
    { label: '₹999 – ₹1,499', min: 99900, max: 149900 },
    { label: 'Above ₹1,499', min: 149901, max: Infinity },
  ],
  sorts: [
    { label: 'Featured', value: 'featured' },
    { label: 'Bestselling', value: 'bestselling' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Rated', value: 'rating' },
  ],
};

/* -------------------------------------------------------------- About */
export const about = {
  hero: {
    eyebrow: 'Our Story',
    title: 'We make tees that say the thing you were thinking.',
    text: 'Atire started with one oversized tee, one inside joke and a group chat that wouldn’t stop asking where it was from.',
    image: `${PH}/hero-same-different.jpg`,
  },
  manifesto:
    'Clothes should start conversations. Not small talk — real ones. The “where’s that from?”, the “that’s so me”, the stranger on the metro who laughs at your back. That’s the whole point.',
  timeline: [
    { year: '2022', title: 'The first print', text: 'Fifty tees, screen printed in a borrowed studio. Sold out to friends of friends in four days.' },
    { year: '2023', title: 'Textees go viral', text: 'One “I’m here for the degree” photo later, our inbox became a full-time job.' },
    { year: '2024', title: 'The couple edit', text: 'You kept buying two of everything. So we started designing them as pairs.' },
    { year: '2025', title: '2 lakh+ fits shipped', text: 'Our own print floor, 600+ original designs and a community that names half our drops.' },
  ],
  values: [
    { icon: 'sparkle', title: 'Original, always', text: 'Every print is drawn in-house. No templates, no stock graphics, no copies.' },
    { icon: 'shield', title: 'Built heavy', text: '240 GSM combed cotton tees and 320 GSM fleece. Made to survive 100 washes and your weekends.' },
    { icon: 'return', title: 'Fair & easy', text: 'Honest prices, 7-day returns and real humans on WhatsApp when something isn’t right.' },
    { icon: 'heart', title: 'Community-made', text: 'Half our drops start as your comments. You vote, we print.' },
  ],
  process: [
    { step: '01', title: 'Sketch', text: 'Ideas from the community, sketched by our in-house illustrators.', image: `${PH}/ugc-04.jpg` },
    { step: '02', title: 'Sample', text: 'Every print is tested on fabric for weight, colour and stretch.', image: `${PH}/cat-printed.jpg` },
    { step: '03', title: 'Print', text: 'High-density screen printing in small batches, by hand.', image: `${PH}/tee-blue-graphic.jpg` },
    { step: '04', title: 'Pack & ship', text: 'Quality checked, packed plastic-free and out within 24 hours.', image: `${PH}/ugc-09.jpg` },
  ],
  stats: [
    { value: '2.4L+', label: 'Happy customers' },
    { value: '600+', label: 'Original prints' },
    { value: '4.7★', label: 'Average rating' },
    { value: '28', label: 'States delivered to' },
  ],
};

/* -------------------------------------------------------------- Contact */
export const contact = {
  channels: [
    { icon: 'bolt', title: 'WhatsApp', text: 'Fastest replies, usually under 10 minutes.', value: '+91 90000 00000', url: 'https://wa.me/919000000000' },
    { icon: 'tag', title: 'Email', text: 'For orders, returns and collabs.', value: 'hello@atire.in', url: 'mailto:hello@atire.in' },
    { icon: 'instagram', title: 'Instagram', text: 'DMs open. Memes appreciated.', value: '@atire.india', url: 'https://instagram.com/atire.india' },
    { icon: 'pin', title: 'Studio', text: 'Visits by appointment only.', value: 'Pune, Maharashtra', url: '#' },
  ],
  hours: 'Mon – Sat · 10 AM to 7 PM IST',
  topics: ['Order status', 'Return or exchange', 'Size help', 'Payment issue', 'Bulk / custom order', 'Collaboration', 'Something else'],
};

/* -------------------------------------------------------------- FAQ */
export const faqs = [
  {
    category: 'Orders & Shipping',
    icon: 'truck',
    items: [
      { q: 'How long does delivery take?', a: 'Metro cities: 2–4 business days. Rest of India: 4–7 business days. Every order ships within 24 hours on weekdays.' },
      { q: 'Is delivery free?', a: 'Delivery is free on all prepaid orders. For Cash on Delivery, it’s free above ₹999 and ₹79 below that.' },
      { q: 'How do I track my order?', a: 'You’ll get a tracking link on WhatsApp and email once it ships. You can also use the Track Order page with your order number.' },
      { q: 'Can I change my address after ordering?', a: 'Yes, until the order is packed. Message us on WhatsApp with your order number as soon as possible.' },
    ],
  },
  {
    category: 'Returns & Exchange',
    icon: 'return',
    items: [
      { q: 'What is your return policy?', a: 'You can return or exchange within 7 days of delivery. Items must be unworn, unwashed and have tags attached.' },
      { q: 'How do I start a return?', a: 'Go to Track Order, enter your order number and tap “Return or exchange”. We’ll schedule a free pickup.' },
      { q: 'When will I get my refund?', a: 'Refunds reach your original payment method within 5–7 business days after the pickup is quality checked. COD refunds go to your bank or as store credit.' },
    ],
  },
  {
    category: 'Products & Sizing',
    icon: 'ruler',
    items: [
      { q: 'How do your oversized tees fit?', a: 'Boxy with a dropped shoulder. Take your usual size for the intended oversized look, or size down for a closer fit.' },
      { q: 'Will the print crack or fade?', a: 'We use high-density screen printing tested for 30+ washes. Wash inside out in cold water and skip the dryer for best results.' },
      { q: 'Do the tees shrink?', a: 'Our cotton is pre-shrunk and bio-washed, so expect less than 3% shrinkage when washed cold.' },
    ],
  },
  {
    category: 'Payments',
    icon: 'cash',
    items: [
      { q: 'Which payment methods do you accept?', a: 'UPI, all major credit and debit cards, net banking, wallets and Cash on Delivery.' },
      { q: 'Is Cash on Delivery available?', a: 'Yes, on most pincodes across India. Check yours on any product page.' },
      { q: 'Are there extra charges for COD?', a: 'No COD fee. Delivery is free for COD orders above ₹999.' },
    ],
  },
];

/* -------------------------------------------------------------- Size guide */
export const sizeGuide = {
  charts: [
    {
      id: 'tees',
      title: 'Oversized Tees',
      note: 'Garment measurements in inches. Relaxed, boxy fit.',
      columns: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
      rows: [
        ['S', 42, 27.5, 21, 9],
        ['M', 44, 28, 22, 9.5],
        ['L', 46, 29, 23, 10],
        ['XL', 48, 30, 24, 10.5],
        ['2XL', 50, 31, 25, 11],
        ['3XL', 52, 32, 26, 11.5],
      ],
    },
    {
      id: 'hoodies',
      title: 'Hoodies',
      note: 'Garment measurements in inches. Relaxed fit with ribbed cuffs.',
      columns: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
      rows: [
        ['S', 44, 26.5, 20.5, 23.5],
        ['M', 46, 27, 21.5, 24],
        ['L', 48, 28, 22.5, 24.5],
        ['XL', 50, 29, 23.5, 25],
        ['2XL', 52, 30, 24.5, 25.5],
        ['3XL', 54, 31, 25.5, 26],
      ],
    },
  ],
  fits: [
    { title: 'Oversized', text: 'Dropped shoulder, boxy body, longer sleeve. Our signature. Take your usual size.' },
    { title: 'Relaxed', text: 'Room to move without the drape. For a cleaner look, size down from your usual.' },
  ],
};

/* -------------------------------------------------------------- Bulk */
export const bulk = {
  hero: {
    eyebrow: 'Bulk & Custom Orders',
    title: 'Merch your team will actually wear.',
    text: 'Custom tees and hoodies for startups, colleges, events and creators — designed with you, printed in-house, delivered pan-India.',
    image: unsplash('1559697242-7c922c6198c6', 1600, 1100),
  },
  useCases: ['Startup & team merch', 'College fests & clubs', 'Events & conferences', 'Creator drops', 'Weddings & groups'],
  steps: [
    { title: 'Share your idea', text: 'Tell us quantity, timeline and vibe. Logos and rough sketches welcome.' },
    { title: 'Free mockups', text: 'Our designers send digital mockups within 48 hours. Revise till it’s right.' },
    { title: 'Sample & approve', text: 'Optional physical sample for orders above 100 pieces.' },
    { title: 'Print & deliver', text: 'Printed in-house in 7–10 days and shipped to one or many addresses.' },
  ],
  tiers: [
    { qty: '25 – 49', price: '₹649', note: 'per tee' },
    { qty: '50 – 99', price: '₹579', note: 'per tee', popular: true },
    { qty: '100 – 249', price: '₹519', note: 'per tee' },
    { qty: '250+', price: 'Custom', note: 'best pricing' },
  ],
  perks: ['240 GSM premium cotton', 'Free design support', 'Up to 4 print locations', 'Individual name personalisation', 'Pan-India multi-address shipping', 'GST invoice'],
};

/* -------------------------------------------------------------- Journal */
export const journal = [
  {
    slug: 'how-to-style-an-oversized-tee',
    category: 'Style Guide',
    title: 'How to style an oversized tee without looking like you borrowed it',
    excerpt: 'Proportions, tucks and the one trouser cut that makes a boxy tee look intentional.',
    image: unsplash('1616006897093-5e4635c0de35', 1400, 1000),
    date: 'Sep 28, 2026',
    read: '4 min read',
    featured: true,
    products: ['college-survivor-oversized-tee', 'blue-graphic-printed-tee', 'football-fans-oversized-tee'],
  },
  {
    slug: 'inside-our-print-floor',
    category: 'Behind the Print',
    title: 'Inside our print floor: why high-density ink matters',
    excerpt: 'The raised feel, the 30-wash test and the reason we print in batches of 50.',
    image: `${PH}/tee-blue-graphic.jpg`,
    date: 'Sep 19, 2026',
    read: '6 min read',
    products: ['blue-graphic-printed-tee', 'red-splash-printed-tee'],
  },
  {
    slug: 'couple-outfits-that-arent-cringe',
    category: 'Couple Goals',
    title: 'Matching outfits that aren’t cringe (we checked)',
    excerpt: 'Twin without trying too hard: colour, contrast and the art of the inside joke.',
    image: `${PH}/feature-couple-winter.jpg`,
    date: 'Sep 10, 2026',
    read: '3 min read',
    products: ['couple-roast-matching-tees', 'manifest-more-love-hoodie'],
  },
  {
    slug: 'tee-care-guide',
    category: 'Care',
    title: 'Make your tee last 100 washes: the honest care guide',
    excerpt: 'Inside out, cold water, no dryer. And three myths we need to talk about.',
    image: unsplash('1562157873-818bc0726f68', 1400, 1000),
    date: 'Aug 30, 2026',
    read: '5 min read',
    products: ['conversation-starter-oversized-tee'],
  },
  {
    slug: 'developer-dress-code',
    category: 'Culture',
    title: 'The unofficial developer dress code, decoded',
    excerpt: 'Hoodies, standups and why your tee is your status message.',
    image: `${PH}/ugc-12.jpg`,
    date: 'Aug 21, 2026',
    read: '4 min read',
    products: ['error-404-developer-tee', 'works-on-my-machine-tee'],
  },
];

/* -------------------------------------------------------------- Policies */
export const policies = {
  shipping: {
    title: 'Shipping Policy',
    updated: 'October 1, 2026',
    sections: [
      { heading: 'Processing time', body: ['Orders placed before 2 PM IST on business days ship the same day. Orders after 2 PM or on Sundays ship the next business day.'] },
      { heading: 'Delivery timelines', body: ['Metro cities: 2–4 business days.', 'Tier 2 & 3 cities: 4–6 business days.', 'Remote areas & North-East: 6–9 business days.'] },
      { heading: 'Shipping charges', body: ['Free delivery on all prepaid orders.', 'Cash on Delivery orders are free above ₹999; ₹79 is charged below that.'] },
      { heading: 'Tracking', body: ['A tracking link is sent on WhatsApp, SMS and email once your order ships. You can also track it any time on our Track Order page.'] },
      { heading: 'Delays', body: ['Delivery estimates can be affected by weather, festivals or courier issues. If your order is more than 3 days late, contact us and we will escalate it.'] },
    ],
  },
  returns: {
    title: 'Return & Exchange Policy',
    updated: 'October 1, 2026',
    sections: [
      { heading: '7-day returns', body: ['You can return or exchange any item within 7 days of delivery. Items must be unworn, unwashed and have original tags attached.'] },
      { heading: 'How to request', body: ['Visit Track Order, enter your order number and select “Return or exchange”. We schedule a free reverse pickup within 48 hours.'] },
      { heading: 'Exchanges', body: ['Size exchanges are free, one time per item, subject to stock. If your size isn’t available you will receive store credit or a refund.'] },
      { heading: 'Refunds', body: ['Prepaid orders are refunded to the original payment method within 5–7 business days after quality check.', 'COD orders are refunded via bank transfer or as Atire store credit (with 5% bonus).'] },
      { heading: 'Non-returnable items', body: ['Custom/bulk orders, items bought on final sale and gift cards cannot be returned.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'October 1, 2026',
    sections: [
      { heading: 'What we collect', body: ['Contact details, shipping address and order history when you place an order or create an account. Payment details are processed by our payment partners and never stored by us.'] },
      { heading: 'How we use it', body: ['To process and deliver orders, provide support, prevent fraud and — only with your consent — send offers and new drop alerts.'] },
      { heading: 'Sharing', body: ['We share data only with service providers needed to run the store (payments, couriers, messaging) under strict agreements. We never sell your personal data.'] },
      { heading: 'Your rights', body: ['You can access, correct or delete your data, and withdraw marketing consent at any time by writing to privacy@atire.in.'] },
      { heading: 'Cookies', body: ['We use essential cookies to run the store and, with consent, analytics cookies to improve it.'] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'October 1, 2026',
    sections: [
      { heading: 'Using this site', body: ['By using atire.in you agree to these terms. You must be 18 or older, or use the site with a guardian’s consent.'] },
      { heading: 'Products & pricing', body: ['Prices are in INR and include GST. We try to show colours accurately, but screens vary. We may correct pricing errors and cancel affected orders with a full refund.'] },
      { heading: 'Orders', body: ['An order is confirmed when you receive a confirmation email. We may cancel orders that look fraudulent or exceed reasonable quantities.'] },
      { heading: 'Intellectual property', body: ['All designs, artwork and content on this site belong to Atire and may not be copied or resold without written permission.'] },
      { heading: 'Contact', body: ['Questions about these terms? Email legal@atire.in.'] },
    ],
  },
};
