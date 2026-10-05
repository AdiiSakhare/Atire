/** Seeds for: journal (blog), article, wishlist, track-order, password. Used by scripts/seed-theme-templates.mjs */
import { blocks, template } from './_helpers.mjs';

export default function pagesC() {
  const blog = template();
  blog.add('main', 'main-blog', {
    eyebrow: 'The Atire Journal',
    title: 'Stories, style & behind the print',
    sub: 'Style guides, culture and the people who wear the conversation.',
    show_featured: true,
    news_title: 'Get the good stuff first',
    news_text: 'New stories, drops and members-only combos. Once a week, max.',
  });

  const article = template();
  article.add('main', 'main-article', {
    fallback_author: 'Team Atire',
    author_role: 'Style desk',
    products_title: 'Shop the story',
    more_eyebrow: 'Keep reading',
    more_title: 'More from the Journal',
  });

  const wishlist = template();
  wishlist.add('main', 'main-wishlist', {
    eyebrow: 'Saved for later',
    title: 'Your Wishlist',
    sub: 'Hearted it? It lives here. Prices and stock update live.',
    empty_title: 'Nothing saved yet',
    empty_text: 'Tap the heart on anything you love and it’ll wait for you here — even if you leave.',
    empty_cta: 'Discover Bestsellers',
    empty_url: '/collections/bestseller',
  });
  wishlist.add('recommendations', 'product-rail', { title: 'You might also love', subtitle: '', source: 'collection', limit: 8 });

  const track = template();
  track.add('main', 'main-track-order', {
    eyebrow: 'Order status',
    title: 'Track your order',
    sub: 'Enter your order number and the mobile number or email used at checkout.',
    tracking_url: '',
    help_url: '/pages/contact',
  }, blocks([
    { icon: 'bolt', title: 'Fastest help', text: 'WhatsApp us your order number — we reply in under 10 minutes.' },
    { icon: 'return', title: 'Returns made easy', text: 'Free pickup within 48 hours, refund in 5–7 days.' },
  ], 'help', (h) => h));

  const password = template();
  password.add('main', 'main-password', {
    show_signup: true,
    signup_title: 'Be first in line',
    signup_button: 'Notify me',
    password_title: 'Have the password?',
  });

  return {
    'blog': blog.done(),
    'article': article.done(),
    'page.wishlist': wishlist.done(),
    'page.track-order': track.done(),
    'password': password.done(),
  };
}
