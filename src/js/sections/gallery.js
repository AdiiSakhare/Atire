/**
 * PDP gallery: transform-based slider with drag/swipe, arrows (mockup
 * states: translucent when disabled, white when active), dots, thumbs,
 * keyboard and full-screen lightbox.
 */
import { gsap } from 'gsap';
import { qs, qsa, prefersReducedMotion } from '../core/dom.js';
import { openLightbox } from '../components/lightbox.js';

export function createGallery(root) {
  const viewport = qs('[data-gallery-viewport]', root);
  const track = qs('[data-gallery-track]', root);
  const prev = qs('[data-gallery-prev]', root);
  const next = qs('[data-gallery-next]', root);
  let slides = qsa('[data-gallery-slide]', root);
  let index = 0;

  const goTo = (i, { animate = true } = {}) => {
    index = Math.max(0, Math.min(slides.length - 1, i));
    gsap.to(track, {
      xPercent: -100 * index,
      duration: animate && !prefersReducedMotion() ? 0.6 : 0,
      ease: 'power3.out',
    });
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    qsa('[data-gallery-dot]', root).forEach((dot) => {
      const active = Number(dot.dataset.galleryDot) === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  root.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-gallery-dot]');
    if (dot) goTo(Number(dot.dataset.galleryDot));
  });

  root.tabIndex = -1;
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(index - 1);
    if (event.key === 'ArrowRight') goTo(index + 1);
  });

  // Drag / swipe
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let moved = false;

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
  });

  window.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) < 6 || Math.abs(event.clientY - startY) > Math.abs(dx)) return;
    moved = true;
    const width = viewport.clientWidth;
    const resistance = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0) ? 0.3 : 1;
    gsap.set(track, { xPercent: -100 * index + (dx / width) * 100 * resistance });
  });

  window.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    dragging = false;
    const dx = event.clientX - startX;
    if (moved && Math.abs(dx) > viewport.clientWidth * 0.15) goTo(index + (dx < 0 ? 1 : -1));
    else goTo(index);
  });

  // Full-screen
  const zoom = () => openLightbox(slides.map((s) => s.querySelector('img').src), index);
  qs('[data-gallery-zoom]', root)?.addEventListener('click', zoom);
  viewport.addEventListener('click', () => !moved && zoom());

  /** Swap images (colour change / client-side product hydration). */
  const setImages = (images) => {
    track.innerHTML = images
      .map(
        (img, i) => `<li class="pdp-gallery__slide" data-gallery-slide><img src="${img.src}" alt="${img.alt}" ${i ? 'loading="lazy"' : ''} draggable="false" /></li>`,
      )
      .join('');
    qs('[data-gallery-dots]', root).innerHTML = images
      .map((_, i) => `<button class="pdp-gallery__dot" type="button" role="tab" aria-label="Image ${i + 1}" data-gallery-dot="${i}"></button>`)
      .join('');
    const thumbs = qs('[data-gallery-thumbs]', root);
    if (thumbs) {
      thumbs.innerHTML = images
        .map((img, i) => `<li><button class="pdp-gallery__thumb" type="button" data-gallery-dot="${i}" aria-label="Show image ${i + 1}"><img src="${img.src}" alt="" /></button></li>`)
        .join('');
    }
    slides = qsa('[data-gallery-slide]', root);
    goTo(0, { animate: false });
  };

  goTo(0, { animate: false });
  return { goTo, setImages };
}
