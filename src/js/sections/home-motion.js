/** Home-only scroll motion: UGC wall column drift, stat counters, combo fan-in. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, prefersReducedMotion } from '../core/dom.js';

gsap.registerPlugin(ScrollTrigger);

export function initHomeMotion() {
  const reduced = prefersReducedMotion();

  // Stat counters (run even with reduced motion — just jump to the value)
  qsa('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    const decimals = String(target).includes('.') ? 1 : 0;
    const render = (v) => (el.textContent = v.toFixed(decimals));
    if (reduced) return render(target);
    const counter = { v: 0 };
    gsap.to(counter, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => render(counter.v),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  if (reduced) return;

  // UGC wall — alternate columns drift at different speeds
  qsa('[data-ugc-col]').forEach((col, i) => {
    const distance = [40, -30, 60, -50, 30, -60, 50, -20][i % 8];
    gsap.fromTo(
      col,
      { y: distance },
      { y: -distance, ease: 'none', scrollTrigger: { trigger: col.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  // Combo cards fan in — CSS transitions do the motion so hover states keep working
  const stack = qs('.combo__stack');
  if (stack) {
    stack.classList.add('is-waiting');
    ScrollTrigger.create({
      trigger: stack,
      start: 'top 80%',
      once: true,
      onEnter: () => stack.classList.remove('is-waiting'),
    });
  }
}
