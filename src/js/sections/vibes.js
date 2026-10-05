/** Shop-by-vibe: floating preview image follows the cursor over the list. */
import { gsap } from 'gsap';
import { qs, qsa } from '../core/dom.js';

export function initVibes() {
  const root = qs('[data-vibes]');
  const float = qs('[data-vibe-float]', root ?? document);
  if (!root || !float || !window.matchMedia('(hover: hover)').matches) return;

  const img = float.querySelector('img');
  const xTo = gsap.quickTo(float, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(float, 'y', { duration: 0.5, ease: 'power3.out' });

  root.addEventListener('mousemove', (event) => {
    const rect = root.getBoundingClientRect();
    xTo(event.clientX - rect.left - float.offsetWidth / 2);
    yTo(event.clientY - rect.top - float.offsetHeight / 2);
  });

  qsa('[data-vibe-image]', root).forEach((row) => {
    row.addEventListener('mouseenter', () => {
      img.src = row.dataset.vibeImage;
      gsap.to(float, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.4, ease: 'power3.out' });
    });
  });

  qs('.vibes__list', root).addEventListener('mouseleave', () =>
    gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }),
  );
}
