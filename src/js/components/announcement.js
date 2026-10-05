/**
 * Rotating announcement messages. When the cart has items, a live
 * free-delivery progress message joins the rotation (and leads it).
 */
import { qs, qsa, prefersReducedMotion } from '../core/dom.js';
import { listen } from '../core/events.js';
import { getCart } from '../core/cart.js';
import { formatMoney } from '../core/money.js';
import { site } from '../../data/site.js';
import { icon } from '../../data/icons.js';

function shippingMessage(cart) {
  if (!cart.item_count) return null;
  const left = site.freeShippingThreshold - cart.total_price;
  return left > 0
    ? `You’re <strong>${formatMoney(left)}</strong> away from FREE delivery`
    : `🎉 You’ve unlocked <strong>FREE delivery</strong>`;
}

export function initAnnouncement() {
  const bar = qs('[data-announcement]');
  if (!bar) return;
  const track = qs('.announcement__track', bar);

  // Dynamic slot (hidden until the cart has something in it)
  const live = document.createElement('p');
  live.className = 'announcement__item announcement__item--live';
  live.setAttribute('aria-hidden', 'true');
  track.prepend(live);

  const update = (cart) => {
    const message = shippingMessage(cart);
    live.dataset.empty = message ? 'false' : 'true';
    if (message) live.innerHTML = `<span class="announcement__icon">${icon('truck')}</span>${message}`;
  };
  getCart().then(update);
  listen('cart:change', ({ cart }) => update(cart));

  if (prefersReducedMotion()) return;

  let index = qsa('.announcement__item', bar).findIndex((el) => el.classList.contains('is-active'));
  let timer;

  const next = () => {
    const items = qsa('.announcement__item', bar).filter((el) => el.dataset.empty !== 'true');
    if (items.length < 2) return;
    const current = qsa('.announcement__item.is-active', bar)[0];
    index = (items.indexOf(current) + 1) % items.length;
    const upcoming = items[index];

    current?.classList.add('is-leaving');
    current?.classList.remove('is-active');
    current?.setAttribute('aria-hidden', 'true');
    upcoming.classList.remove('is-leaving');
    upcoming.classList.add('is-active');
    upcoming.removeAttribute('aria-hidden');
    setTimeout(() => current?.classList.remove('is-leaving'), 600);
  };

  const start = () => (timer = setInterval(next, 4000));
  bar.addEventListener('mouseenter', () => clearInterval(timer));
  bar.addEventListener('mouseleave', start);
  start();
}
