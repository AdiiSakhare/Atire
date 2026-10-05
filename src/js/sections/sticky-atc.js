/**
 * Sticky add-to-cart bar. Visible once the main CTAs scroll above the
 * viewport; hidden again near the footer. Sizes stay in sync with the form.
 */
import { qs, qsa } from '../core/dom.js';
import { listen } from '../core/events.js';

export function initStickyAtc(mainProduct) {
  const bar = qs('[data-sticky-atc]');
  const ctas = qs('[data-main-ctas]');
  if (!bar || !ctas || !mainProduct) return;

  const footer = qs('.site-footer');
  let ticking = false;

  // Position check (not IntersectionObserver) so jumps past the CTAs — anchor
  // links, fast flings — still reveal the bar.
  const update = () => {
    const pastCtas = ctas.getBoundingClientRect().bottom < 0;
    const nearFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    const visible = pastCtas && !nearFooter;
    bar.classList.toggle('is-visible', visible);
    bar.setAttribute('aria-hidden', String(!visible));
    document.documentElement.classList.toggle('sticky-atc-visible', visible);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();

  qsa('[data-sticky-size]', bar).forEach((btn) =>
    btn.addEventListener('click', () => mainProduct.selectSize(btn.dataset.stickySize)),
  );

  qs('[data-sticky-add]', bar).addEventListener('click', () => mainProduct.addToCart());

  listen('variant:change', ({ product, state }) => {
    qsa('[data-sticky-size]', bar).forEach((btn) => {
      const variant = product.variants.find((v) => v.option1 === state.Color && v.option2 === btn.dataset.stickySize);
      btn.setAttribute('aria-checked', String(btn.dataset.stickySize === state.Size));
      btn.toggleAttribute('data-unavailable', !variant?.available);
      btn.disabled = !variant?.available;
    });
  });
}
