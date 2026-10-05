/** Seeds: page.about, 404, page.policy */
import { about } from '../../src/data/pages.js';
import { home } from '../../src/data/home.js';
import { site } from '../../src/data/site.js';
import { ph, url, blocks, template } from './_helpers.mjs';

export default function seed() {
  const a = template();
  a.add('hero', 'about-hero', { eyebrow: about.hero.eyebrow, title: about.hero.title, text: about.hero.text, placeholder: ph(about.hero.image) });
  a.add('manifesto', 'about-manifesto', { text: about.manifesto });
  a.add('timeline', 'about-timeline', { eyebrow: 'How it started', title: 'From a group chat to 2 lakh+ wardrobes' },
    blocks(about.timeline, 'milestone', (t) => ({ year: t.year, title: t.title, text: t.text })));
  a.add('values', 'about-values', { eyebrow: 'What we stand for', title: 'Four rules we don’t break' },
    blocks(about.values, 'value', (v) => ({ icon: v.icon, title: v.title, text: v.text })));
  a.add('process', 'about-process', { eyebrow: 'The process', title: 'How a tee becomes an Atire' },
    blocks(about.process, 'step', (s) => ({ step: s.step, title: s.title, text: s.text, placeholder: ph(s.image) })));
  a.add('stats', 'about-stats', {}, blocks(about.stats, 'stat', (s) => ({ value: s.value, label: s.label })));
  a.add('ugc-tilt', 'ugc-tilt', { title: 'Every Atire Starts a Conversation.', subtitle: 'The community that inspires every drop.', cta_label: `Tag ${site.instagram} to get featured` },
    blocks(site.ugc, 'photo', (u) => ({ placeholder: ph(u.src), handle: u.handle })));
  a.add('rail', 'product-rail', { title: 'Start your collection', subtitle: 'Our most-loved pieces.', source: 'collection', limit: 8 });
  a.add('closing', 'closing-banner', { title: home.closing.title, text: home.closing.text, cta: home.closing.cta, url: url(home.closing.url), placeholder: ph(home.closing.image), image_alt: 'Atire tees on a rack' });

  const n = template();
  n.add('main', 'main-404', { placeholder: 'cat-developers.jpg' },
    blocks([['Bestsellers', '/shop.html?c=bestseller'], ['New drops', '/shop.html?c=new'], ['Help center', '/faq.html']], 'link', ([label, u]) => ({ label, url: url(u) })));

  const p = template();
  p.add('main', 'main-policy', { menu: 'footer-legal', help_url: url('/contact.html') });

  return { 'page.about': a.done(), '404': n.done(), 'page.policy': p.done() };
}
