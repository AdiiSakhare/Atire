/**
 * Hero slideshow: crossfade + Ken Burns (CSS), GSAP headline reveal,
 * autoplay with progress bars, arrows, swipe, pause on hover / hidden tab.
 */
import { gsap } from 'gsap';
import { qs, qsa, prefersReducedMotion } from '../core/dom.js';

const DURATION = 6.5; // seconds per slide

function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = 'true';
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="word" aria-hidden="true"><span>${w}</span></span>`)
    .join(' ');
}

export function initHero() {
  const hero = qs('[data-hero]');
  if (!hero) return;

  const slides = qsa('[data-hero-slide]', hero);
  const bars = qsa('[data-hero-go]', hero);
  const reduced = prefersReducedMotion();
  let index = 0;
  let progress = null;

  slides.forEach((slide) => splitWords(qs('[data-hero-title]', slide)));

  const animateIn = (slide) => {
    if (reduced) return;
    gsap.fromTo(
      qsa('[data-hero-title] .word > span', slide),
      { yPercent: 110 },
      { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06, delay: 0.15 },
    );
    gsap.fromTo(
      qsa('[data-hero-fade]', slide),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.45 },
    );
  };

  const runProgress = () => {
    progress?.kill();
    bars.forEach((bar, i) => {
      bar.classList.toggle('is-done', i < index);
      bar.classList.toggle('is-active', i === index);
      bar.querySelector('span').style.setProperty('--p', i < index ? 1 : 0);
    });
    if (reduced) return;
    const fill = bars[index].querySelector('span');
    progress = gsap.fromTo(
      fill,
      { '--p': 0 },
      { '--p': 1, duration: DURATION, ease: 'none', onComplete: () => goTo(index + 1) },
    );
  };

  function goTo(i) {
    const next = (i + slides.length) % slides.length;
    if (next === index && progress) return;
    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    index = next;
    slides[index].classList.add('is-active');
    slides[index].removeAttribute('aria-hidden');
    animateIn(slides[index]);
    runProgress();
  }

  qs('[data-hero-prev]', hero).addEventListener('click', () => goTo(index - 1));
  qs('[data-hero-next]', hero).addEventListener('click', () => goTo(index + 1));
  bars.forEach((bar) => bar.addEventListener('click', () => goTo(Number(bar.dataset.heroGo))));

  hero.addEventListener('mouseenter', () => progress?.pause());
  hero.addEventListener('mouseleave', () => progress?.resume());
  document.addEventListener('visibilitychange', () => (document.hidden ? progress?.pause() : progress?.resume()));

  // Swipe
  let startX = null;
  hero.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  animateIn(slides[0]);
  runProgress();
}
