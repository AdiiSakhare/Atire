/**
 * First-visit offer popup. Respectful by default:
 *  - waits 20s (or exit intent on desktop), never on first paint
 *  - shows at most once every 14 days, never after subscribing
 *  - skipped on the product page so it never interrupts a purchase
 */
import { qs } from '../core/dom.js';
import { read, write } from '../core/storage.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';

const KEY = 'atire:welcome';
const COOLDOWN = 14 * 24 * 60 * 60 * 1000;

export function initWelcomePopup() {
  const popup = qs('[data-welcome]');
  if (!popup || document.body.classList.contains('template-product')) return;

  const saved = read(KEY, {});
  if (saved.subscribed || (saved.dismissedAt && Date.now() - saved.dismissedAt < COOLDOWN)) return;

  let shown = false;

  const open = () => {
    if (shown || document.querySelector('.drawer.is-open, .quick-shop.is-open')) return;
    shown = true;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    stopScroll();
    requestAnimationFrame(() => qs('#welcome-email', popup)?.focus({ preventScroll: true }));
  };

  const close = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    startScroll();
    if (!read(KEY, {}).subscribed) write(KEY, { dismissedAt: Date.now() });
  };

  const timer = setTimeout(open, 20000);
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget && event.clientY <= 0 && window.matchMedia('(hover: hover)').matches) {
      clearTimeout(timer);
      open();
    }
  });

  popup.addEventListener('click', (event) => {
    if (event.target === popup || event.target.closest('[data-welcome-close]')) close();
  });
  document.addEventListener('keydown', (event) => event.key === 'Escape' && popup.classList.contains('is-open') && close());

  qs('[data-welcome-form]', popup).addEventListener('submit', (event) => {
    event.preventDefault();
    // Shopify theme: the form has a real action (customer form) — post it for real.
    const form = event.currentTarget;
    if (form.getAttribute('action')) fetch(form.action, { method: 'POST', body: new FormData(form) }).catch(() => {});
    write(KEY, { subscribed: true });
    qs('[data-welcome-form-wrap]', popup).hidden = true;
    qs('[data-welcome-success]', popup).hidden = false;
  });
}
