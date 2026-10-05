/**
 * Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one RAF loop. Disabled when the user prefers reduced motion.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './dom.js';

gsap.registerPlugin(ScrollTrigger);

export let lenis = null;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

/** Smooth-scroll to an element, accounting for the sticky header. */
export function scrollToElement(target, offset = -96) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
