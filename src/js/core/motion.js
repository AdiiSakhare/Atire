/**
 * Scroll-reveal primitives (GSAP + ScrollTrigger).
 *   [data-reveal]  fade + rise when entering the viewport (batched → stagger)
 *   [data-split]   headline words rise from a mask
 * Kept quick and subtle — motion supports the products, never delays them.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qsa, prefersReducedMotion } from './dom.js';

gsap.registerPlugin(ScrollTrigger);

export function initReveals(root = document) {
  if (prefersReducedMotion()) return;
  document.documentElement.classList.add('motion-ready');

  const items = qsa('[data-reveal]', root).filter((el) => !el.dataset.revealed);
  items.forEach((el) => (el.dataset.revealed = 'pending'));

  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      // Move the hidden state inline, drop the CSS one, then animate and hand
      // transform/opacity back to CSS so hover transforms keep working.
      gsap.set(batch, { opacity: 0, y: 24 });
      batch.forEach((el) => (el.dataset.revealed = 'done'));
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        clearProps: 'transform,opacity',
      });
    },
  });
}

/** Wrap each word in a mask and animate it up. */
export function initSplitHeadings(root = document) {
  qsa('[data-split]', root).forEach((heading) => {
    if (heading.dataset.splitDone) return;
    heading.dataset.splitDone = 'true';

    const words = heading.textContent.trim().split(/\s+/);
    heading.setAttribute('aria-label', heading.textContent.trim());
    heading.innerHTML = words
      .map((word) => `<span class="word" aria-hidden="true"><span>${word}</span></span>`)
      .join(' ');

    if (prefersReducedMotion()) return;

    gsap.from(heading.querySelectorAll('.word > span'), {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.05,
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    });
  });
}

/** Subtle parallax for [data-parallax] image wrappers. */
export function initParallax(root = document) {
  if (prefersReducedMotion()) return;
  qsa('[data-parallax]', root).forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}
