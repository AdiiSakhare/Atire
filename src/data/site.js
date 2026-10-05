/**
 * Store-wide content. In Shopify these become theme settings, menus
 * (linklists), section blocks and metaobjects.
 */

const PH = '/assets/images/placeholders';

export const site = {
  name: 'Atire',
  instagram: '@atire.india',
  freeShippingThreshold: 99900, // paise

  announcements: [
    { icon: 'sparkle', text: 'Get free delivery on all prepaid orders' },
    { icon: 'tag', text: 'Flat ₹100 off with code PREPAID100' },
    { icon: 'return', text: '7-day easy returns & exchange' },
  ],

  nav: [
    {
      title: 'Products',
      url: '/shop.html',
      mega: {
        columns: [
          { title: 'Men', links: ['Oversized Tees', 'Printed Tees', 'Textees', 'Hoodies', 'New Arrivals'] },
          { title: 'Women', links: ['Oversized Tees', 'Textees', 'Hoodies', 'Co-ord Sets', 'New Arrivals'] },
          { title: 'Shop by Vibe', links: ['Sarcasm', 'Football', 'Developer', 'Couple Goals', 'Minimal'] },
        ],
        cards: [
          { title: 'Couple Hoodies', image: `${PH}/cat-couple-hoodies.jpg`, url: '/shop.html?c=couples' },
          { title: 'For Developers', image: `${PH}/cat-developers.jpg`, url: '/shop.html?c=developers' },
        ],
      },
    },
    {
      title: 'Collections',
      url: '/shop.html',
      mega: {
        columns: [
          { title: 'Collections', links: ['Bestsellers', 'Winter Couple Edit', 'For Developers', 'Textees', 'Printed T-shirts'] },
          { title: 'Price', links: ['Under ₹999', 'Under ₹1,499', 'Combos & Sets'] },
        ],
        cards: [
          { title: 'Winter Couple Edit', image: `${PH}/feature-couple-winter.jpg`, url: '/shop.html?c=winter' },
          { title: 'Printed T-shirts', image: `${PH}/cat-printed.jpg`, url: '/shop.html?c=printed' },
        ],
      },
    },
    { title: 'Trending', url: '/shop.html?sort=bestselling' },
    { title: 'Our Story', url: '/about.html' },
  ],

  offers: [
    { title: 'Get FLAT ₹100 OFF on all Prepaid orders above Rs.1,199.', code: 'PREPAID100' },
    { title: 'Get FLAT ₹500 OFF on all Prepaid orders above Rs.2,599.', code: null },
    { title: 'Get FREE delivery on all Prepaid orders.', code: null },
    { title: 'Buy any 3 Textees for ₹1,999. Mix & match sizes.', code: 'TEXTEE3' },
  ],

  trust: [
    { icon: 'truck', title: 'Free Shipping', text: 'On all prepaid orders' },
    { icon: 'return', title: '7-Day Returns', text: 'Easy return & exchange' },
    { icon: 'cash', title: 'COD Available', text: 'Pay when it arrives' },
    { icon: 'shield', title: 'Secure Payments', text: 'UPI, cards & wallets' },
  ],

  footer: {
    blurb: 'Clothing that starts conversations. Designed in India for people who say it with their tees.',
    columns: [
      {
        title: 'Shop',
        links: [
          { title: 'Men', url: '/shop.html?c=men' },
          { title: 'Women', url: '/shop.html?c=women' },
          { title: 'Couples', url: '/shop.html?c=couples' },
          { title: 'All Products', url: '/shop.html' },
          { title: 'Best Sellers', url: '/shop.html?c=bestseller' },
        ],
      },
      {
        title: 'Help',
        links: [
          { title: 'Track Order', url: '/track-order.html' },
          { title: 'Contact Us', url: '/contact.html' },
          { title: 'FAQs', url: '/faq.html' },
          { title: 'Size Guide', url: '/size-guide.html' },
          { title: 'Return & Exchange', url: '/returns.html' },
        ],
      },
      {
        title: 'Atire',
        links: [
          { title: 'Our Story', url: '/about.html' },
          { title: 'Bulk & Custom Orders', url: '/bulk-orders.html' },
          { title: 'Journal', url: '/journal.html' },
          { title: 'Instagram', url: 'https://instagram.com/atire.india' },
        ],
      },
    ],
    legal: [
      { title: 'Terms of service', url: '/terms.html' },
      { title: 'Privacy Policy', url: '/privacy.html' },
      { title: 'Shipping Policy', url: '/shipping.html' },
      { title: 'Refund Policy', url: '/returns.html' },
    ],
  },

  /** Body measurements in inches — garment is oversized, so ~4–6" ease. */
  sizeChart: {
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

  ugc: [
    { src: `${PH}/tee-college-survivor.jpg`, handle: '@ananya.k' },
    { src: `${PH}/tee-football-fans.jpg`, handle: '@rohit_19' },
    { src: `${PH}/tee-couple-roast.jpg`, handle: '@thatcouple' },
    { src: `${PH}/ugc-08.jpg`, handle: '@meera.draws' },
    { src: `${PH}/cat-women.jpg`, handle: '@sana.m' },
    { src: `${PH}/ugc-01.jpg`, handle: '@kabir.fits' },
    { src: `${PH}/tee-conversation-starter.jpg`, handle: '@dev.ops.guy' },
    { src: `${PH}/ugc-11.jpg`, handle: '@skatewithtara' },
  ],
};

/** Reviews — Shopify: product reviews app / metaobjects. */
export const reviews = {
  average: 4.6,
  count: 102,
  distribution: [
    { stars: 5, count: 78 },
    { stars: 4, count: 15 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 2 },
  ],
  fit: { label: 'True to size', percent: 82, position: 52 }, // position: 0 = runs small, 100 = runs large
  photos: [`${PH}/ugc-01.jpg`, `${PH}/ugc-07.jpg`, `${PH}/ugc-13.jpg`, `${PH}/ugc-06.jpg`, `${PH}/ugc-12.jpg`, `${PH}/ugc-02.jpg`],
  items: [
    {
      name: 'Aarav M.',
      initials: 'AM',
      rating: 5,
      date: '2 weeks ago',
      variant: 'Blue / M',
      title: 'The print is even better in person',
      body: 'Got stopped twice on the metro by people asking where it’s from. The raised print feels premium and hasn’t cracked after 6 washes.',
      helpful: 24,
      photo: `${PH}/ugc-07.jpg`,
    },
    {
      name: 'Riya S.',
      initials: 'RS',
      rating: 5,
      date: '1 month ago',
      variant: 'Black / L',
      title: 'Oversized done right',
      body: 'Drops perfectly on the shoulders without looking sloppy. I’m usually an M and took L for the baggy look — exactly what I wanted.',
      helpful: 18,
    },
    {
      name: 'Kunal D.',
      initials: 'KD',
      rating: 4,
      date: '1 month ago',
      variant: 'Red / XL',
      title: 'Thick fabric, great colour',
      body: 'Proper heavyweight cotton, not the see-through kind. Colour is a little brighter than the photos but honestly I like it more.',
      helpful: 9,
    },
    {
      name: 'Sneha P.',
      initials: 'SP',
      rating: 5,
      date: '2 months ago',
      variant: 'Blue / S',
      title: 'Bought it for my brother, stole it back',
      body: 'Soft, breathable and the blue is gorgeous. Delivery took 3 days to Pune. Already eyeing the hoodie.',
      helpful: 15,
      photo: `${PH}/ugc-13.jpg`,
    },
  ],
};
