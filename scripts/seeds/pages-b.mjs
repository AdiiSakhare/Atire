/** Seeds for page.contact / page.faq / page.size-guide / page.bulk-orders from src/data/pages.js. */
import { contact, faqs, sizeGuide, bulk } from '../../src/data/pages.js';
import { ph, url, blocks, merge, template } from './_helpers.mjs';

const faqPreview = faqs.flatMap((g) => g.items).slice(0, 5);

export default function seed() {
  /* contact */
  const c = template();
  c.add('main', 'main-contact', {
    eyebrow: 'We’re here to help',
    title: 'Talk to a real human',
    sub: 'Questions about an order, sizing or a collab? Pick the fastest way to reach us.',
    topics: contact.topics.join('\n'),
    hours: contact.hours,
    more_url: url('/faq.html'),
  }, merge(
    blocks(contact.channels, 'channel', (ch) => ({ icon: ch.icon, title: ch.title, text: ch.text, value: ch.value, url: ch.url })),
    blocks(faqPreview, 'faq', (f) => ({ question: f.q, answer: f.a })),
  ));

  /* faq: group block followed by its question blocks */
  const faqBlocks = {};
  const faqOrder = [];
  faqs.forEach((g, gi) => {
    const gid = `group-${gi + 1}`;
    faqBlocks[gid] = { type: 'group', settings: { heading: g.category, icon: g.icon } };
    faqOrder.push(gid);
    g.items.forEach((item, qi) => {
      const qid = `question-${gi + 1}-${qi + 1}`;
      faqBlocks[qid] = { type: 'question', settings: { question: item.q, answer: item.a } };
      faqOrder.push(qid);
    });
  });
  const f = template();
  f.add('main', 'main-faq', { whatsapp_url: 'https://wa.me/919000000000', contact_url: url('/contact.html') }, { blocks: faqBlocks, block_order: faqOrder });

  /* size guide */
  const s = template();
  s.add('main', 'main-size-guide', { chart_title: sizeGuide.charts[0].title, chart_note: sizeGuide.charts[0].note, shop_url: '/collections/all' }, merge(
    blocks([
      { label: 'Chest', text: 'Lay your best-fitting tee flat. Measure armpit to armpit and double it.' },
      { label: 'Length', text: 'From the highest point of the shoulder straight down to the hem.' },
      { label: 'Shoulder', text: 'Seam to seam across the back.' },
    ], 'tip', (t) => t),
    blocks(sizeGuide.fits, 'fit', (x) => ({ title: x.title, text: x.text })),
  ));

  /* bulk orders */
  const b = template();
  b.add('main', 'main-bulk-orders', {
    placeholder: ph(bulk.hero.image), eyebrow: bulk.hero.eyebrow, title: bulk.hero.title, text: bulk.hero.text,
  }, merge(
    blocks(bulk.useCases, 'use_case', (text) => ({ text })),
    blocks(bulk.steps, 'step', (x) => ({ title: x.title, text: x.text })),
    blocks(bulk.tiers, 'tier', (t) => ({ qty: t.qty, price: t.price, note: t.note, popular: !!t.popular })),
    blocks(bulk.perks, 'perk', (text) => ({ text })),
  ));

  return { 'page.contact': c.done(), 'page.faq': f.done(), 'page.size-guide': s.done(), 'page.bulk-orders': b.done() };
}
