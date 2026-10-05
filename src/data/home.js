/**
 * Home page content. Shopify: section settings + blocks in templates/index.json.
 * Images are placeholders (mockup crops + Unsplash) until real shoots land.
 */

const PH = '/assets/images/placeholders';
const unsplash = (id, w = 1600, h = Math.round(w * 1.25)) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

export const home = {
  hero: [
    {
      title: 'Modern Fashion',
      text: 'Discover our wide ranging and timeless lifestyle products. Pick your favourite stuff that matches your personal taste and style.',
      cta: 'Start Shopping',
      url: '/shop.html',
      image: `${PH}/hero-same-different.jpg`,
      imageMobile: `${PH}/hero-same-different-portrait.jpg`,
      position: '60% 40%',
      look: 'same-sht-different-day-tee',
    },
    {
      title: 'Twin in Winter.',
      text: 'The couple hoodie edit is here. Matching fits for the one who matches your energy.',
      cta: 'Shop Couple Edit',
      url: '/shop.html?c=couples',
      image: unsplash('1635650805023-f2529440b5aa', 2400, 1350),
      imageMobile: unsplash('1635650805023-f2529440b5aa', 900, 1200),
      position: '50% 50%',
      look: 'manifest-more-love-hoodie',
    },
    {
      title: 'Say it with your tee.',
      text: 'Textees that start conversations. 40+ new prints dropped this week.',
      cta: 'Shop Textees',
      url: '/shop.html?c=textees',
      image: unsplash('1523398002811-999ca8dec234', 2400, 1350),
      imageMobile: unsplash('1523398002811-999ca8dec234', 900, 1200),
      position: '50% 35%',
      look: 'conversation-starter-oversized-tee',
    },
  ],

  marquee: ['New Drop Every Friday', 'Oversized Fits', 'Couple Sets', 'For Developers', 'Textees', '240 GSM Cotton', 'Free Prepaid Delivery'],

  // endsAt must be the real campaign end — the timer hides itself once it passes.
  ticket: { title: 'GET 20% CASHBACK', subtitle: 'On All Orders Above ₹1000', code: 'CASHBACK20', endsAt: '2026-10-12T23:59:59+05:30' },

  heroProof: { rating: 4.7, reviews: '12,400+', customers: '2.4 lakh+' },

  deals: [
    { kicker: 'Combo', big: '3 for ₹1,999', text: 'Any three Textees. Mix sizes, mix prints.', url: '/shop.html?c=textees', theme: 'yellow' },
    { kicker: 'Prepaid', big: '₹100 OFF', text: 'On orders above ₹1,199 with PREPAID100.', url: '/shop.html', theme: 'dark', code: 'PREPAID100' },
    { kicker: 'Couples', big: 'Set @ ₹1,499', text: 'Matching tees for two. Save ₹700.', url: '/shop.html?c=couples', theme: 'grey' },
    { kicker: 'Shipping', big: 'FREE', text: 'Delivery on every prepaid order, pan-India.', url: '/shop.html', theme: 'outline' },
  ],

  categories: [
    { title: 'Printed T-shirts', image: `${PH}/cat-printed.jpg`, url: '/shop.html?c=printed' },
    { title: 'Men Textees', image: `${PH}/cat-men.jpg`, url: '/shop.html?c=men' },
    { title: 'Female Textees', image: `${PH}/cat-women.jpg`, url: '/shop.html?c=women' },
    { title: 'Couple T-shirts', image: `${PH}/cat-couple-tees.jpg`, url: '/shop.html?c=couples' },
    { title: 'Couple Hoodies', image: `${PH}/cat-couple-hoodies.jpg`, url: '/shop.html?c=hoodies' },
    { title: 'For Developers', image: `${PH}/cat-developers.jpg`, url: '/shop.html?c=developers' },
  ],

  campaignsLarge: [
    {
      kicker: 'The Winter Couple Edit',
      title: 'Matching never looked this good.',
      cta: 'Shop Couple Edit',
      url: '/shop.html?c=couples',
      image: unsplash('1608145550502-f53571aa63e1', 1400, 1600),
    },
    {
      kicker: 'The Developer Drop',
      title: 'It works on my machine. And on me.',
      cta: 'Shop Dev Tees',
      url: '/shop.html?c=developers',
      image: unsplash('1503341504253-dff4815485f1', 1400, 1600),
    },
  ],

  campaignsSmall: [
    { title: 'Textees', meta: '120+ prints', url: '/shop.html?c=textees', image: unsplash('1621446511130-0ed6519bfeb6', 900, 1200) },
    { title: 'Oversized', meta: 'Drop-shoulder fits', url: '/shop.html?c=oversized', image: unsplash('1616006897093-5e4635c0de35', 900, 1200) },
    { title: 'Hoodies', meta: '320 GSM fleece', url: '/shop.html?c=hoodies', image: unsplash('1564557287817-3785e38ec1f5', 900, 1200) },
  ],

  tabs: [
    { label: 'Bestseller', tag: 'bestseller' },
    { label: 'Men', tag: 'men' },
    { label: 'Women', tag: 'women' },
    { label: 'Textees', tag: 'textees' },
    { label: 'For Developers', tag: 'developers' },
    { label: 'For Couples', tag: 'couples' },
  ],

  feature: {
    title: 'Explore our most selling winter couple collection',
    text: 'Curated for couples who want to twin with their partners this winter.',
    points: ['320 GSM brushed fleece that actually keeps you warm', 'Puff-printed artwork that won’t crack or peel', 'Sold as singles — mix sizes for both of you'],
    cta: 'Explore Couple Collection',
    url: '/shop.html?c=couples',
    image: `${PH}/feature-couple-winter.jpg`,
  },

  combo: {
    kicker: 'Limited-time combo',
    title: 'Any 3 Textees',
    price: '₹1,999',
    compare: '₹3,597',
    text: 'Pick any three. Mix prints, mix sizes. Applied automatically at checkout.',
    url: '/shop.html?c=textees',
    images: [`${PH}/tee-college-survivor.jpg`, `${PH}/tee-football-fans.jpg`, `${PH}/tee-conversation-starter.jpg`],
  },

  vibes: [
    { title: 'Sarcasm', count: 48, image: `${PH}/tee-conversation-starter.jpg` },
    { title: 'Football', count: 22, image: `${PH}/tee-football-fans.jpg` },
    { title: 'Developer', count: 31, image: `${PH}/cat-developers.jpg` },
    { title: 'Couple Goals', count: 26, image: `${PH}/tee-couple-roast.jpg` },
    { title: 'Minimal', count: 19, image: `${PH}/tee-blue-graphic.jpg` },
    { title: 'Winter', count: 14, image: `${PH}/hoodie-manifest-love.jpg` },
  ],

  ugcWall: [
    [`${PH}/ugc-01.jpg`, `${PH}/ugc-02.jpg`],
    [`${PH}/ugc-03.jpg`, `${PH}/ugc-09.jpg`, `${PH}/ugc-04.jpg`],
    [`${PH}/ugc-05.jpg`],
    [`${PH}/ugc-06.jpg`],
    [`${PH}/ugc-07.jpg`],
    [`${PH}/ugc-08.jpg`],
    [`${PH}/ugc-10.jpg`, `${PH}/ugc-11.jpg`],
    [`${PH}/ugc-12.jpg`, `${PH}/ugc-13.jpg`],
  ],

  testimonials: [
    { name: 'Sarah M.', role: 'Fashion & Lifestyle Blogger', initials: 'SM', product: 'college-survivor-oversized-tee', text: 'The ink on these shirts is incredibly durable. I’ve washed mine dozens of times and the print still looks brand new.' },
    { name: 'James T.', role: 'Creative Agency Founder', initials: 'JT', product: 'conversation-starter-oversized-tee', text: 'Ordered custom merch for our studio. The screen printing alignment is perfect and the team keeps asking for more.' },
    { name: 'Priya K.', role: 'Event Director & Marketer', initials: 'PK', product: 'blue-graphic-printed-tee', text: 'Ordered 150 tees for our annual summit. Everyone kept talking about the print detail. Highly recommended.' },
    { name: 'Rohan D.', role: 'Software Engineer', initials: 'RD', product: 'error-404-developer-tee', text: 'The 404 tee got more reactions at standup than my last three PRs combined. Fabric is properly heavy too.' },
    { name: 'Ananya S.', role: 'College Student', initials: 'AS', product: 'college-survivor-oversized-tee', text: 'Wore the college survivor tee on result day. Iconic. Fits oversized exactly like the photos.' },
    { name: 'Kabir & Meher', role: 'Couple, Mumbai', initials: 'KM', product: 'manifest-more-love-hoodie', text: 'Our matching hoodies are the warmest thing we own. Delivery was 3 days and the packaging was cute.' },
  ],

  reviewSummary: { rating: 4.7, count: '12,400+', recommend: 96 },

  shopTheLook: {
    eyebrow: 'Shop the look',
    title: 'Same fit. Different day.',
    text: 'The parking-lot fit from our latest drop — tap the hotspot or grab the full look below.',
    image: `${PH}/hero-same-different-portrait.jpg`,
    hotspots: [{ x: 48, y: 62, handle: 'same-sht-different-day-tee' }],
    products: ['same-sht-different-day-tee', 'manifest-more-love-hoodie', 'error-404-developer-tee'],
  },

  stats: [
    { value: 2.4, suffix: 'L+', label: 'Happy customers' },
    { value: 4.7, suffix: '★', label: 'Average rating' },
    { value: 600, suffix: '+', label: 'Original prints' },
    { value: 3, suffix: ' days', label: 'Avg. delivery' },
  ],

  closing: {
    title: 'Wear What Speaks for You.',
    text: 'Every design is crafted to reflect your personality, spark conversations, and become your everyday favorite.',
    cta: 'Discover Your Next Favorite',
    url: '/shop.html',
    image: `${PH}/banner-rack.jpg`,
  },
};
