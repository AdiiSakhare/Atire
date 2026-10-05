/** Animate native <details> open/close height with GSAP. */
import { gsap } from 'gsap';
import { qsa, prefersReducedMotion } from '../core/dom.js';

export function initAccordions(root = document) {
  if (prefersReducedMotion()) return;

  qsa('details.accordion', root).forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.accordion__content');
    if (!summary || !content) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.open) {
        gsap.to(content, {
          height: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            details.open = false;
            gsap.set(content, { clearProps: 'height' });
          },
        });
      } else {
        details.open = true;
        gsap.fromTo(content, { height: 0 }, { height: 'auto', duration: 0.45, ease: 'power3.out', clearProps: 'height' });
      }
    });
  });
}
