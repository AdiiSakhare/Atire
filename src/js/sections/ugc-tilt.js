/** Scroll-linked drift for the tilted UGC strip. */
import { gsap } from 'gsap';
import { qsa, prefersReducedMotion } from '../core/dom.js';

export function initUgcTilt() {
  qsa('[data-ugc-tilt]').forEach((section) => {
    const track = section.querySelector('[data-ugc-track]');
    if (!track) return;

    if (prefersReducedMotion()) {
      section.querySelector('.ugc-tilt__viewport').style.overflowX = 'auto';
      return;
    }

    gsap.fromTo(
      track,
      { x: () => -track.scrollWidth * 0.08 },
      {
        x: () => -track.scrollWidth * 0.32,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}
