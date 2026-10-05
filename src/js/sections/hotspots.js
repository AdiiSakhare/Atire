/** Shop-the-look hotspots: tap/click toggles the product card. */
import { qsa, on } from '../core/dom.js';

export function initHotspots() {
  const spots = qsa('[data-hotspot]');
  if (!spots.length) return;

  const closeAll = (except) =>
    spots.forEach((dot) => {
      if (dot === except) return;
      dot.setAttribute('aria-expanded', 'false');
      dot.parentElement.classList.remove('is-open');
    });

  on(document, 'click', '[data-hotspot]', (event, dot) => {
    const open = dot.getAttribute('aria-expanded') !== 'true';
    closeAll(dot);
    dot.setAttribute('aria-expanded', String(open));
    dot.parentElement.classList.toggle('is-open', open);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.hotspot')) closeAll();
  });

  // Open the first hotspot by default on larger screens so the interaction is discoverable
  if (window.matchMedia('(min-width: 1024px)').matches) {
    spots[0].setAttribute('aria-expanded', 'true');
    spots[0].parentElement.classList.add('is-open');
  }
}
