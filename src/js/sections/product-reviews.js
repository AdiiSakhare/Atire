/** Reviews: filter chips, helpful votes, animated bars, photo viewer, load more. */
import { gsap } from 'gsap';
import { qs, qsa, on, prefersReducedMotion } from '../core/dom.js';
import { openLightbox } from '../components/lightbox.js';
import { initReveals } from '../core/motion.js';

export function initReviews() {
  const root = qs('[data-reviews]');
  if (!root) return;

  const list = qs('[data-review-list]', root);

  // Filters
  on(root, 'click', '[data-review-filter]', (event, chip) => {
    qsa('[data-review-filter]', root).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const filter = chip.dataset.reviewFilter;
    qsa('.review-card', list).forEach((card) => {
      const show =
        filter === 'all' ||
        (filter === 'photos' && card.hasAttribute('data-has-photo')) ||
        card.dataset.rating === filter;
      card.hidden = !show;
    });
  });

  // Helpful
  on(root, 'click', '[data-helpful]', (event, button) => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    const count = button.querySelector('span');
    count.textContent = Number(count.textContent) + (pressed ? -1 : 1);
    button.setAttribute('aria-pressed', String(!pressed));
  });

  // Photos
  const photos = [...new Set(qsa('[data-review-photo]', root).map((b) => b.dataset.reviewPhoto))];
  on(root, 'click', '[data-review-photo]', (event, button) => {
    openLightbox(photos, photos.indexOf(button.dataset.reviewPhoto));
  });

  // Load more (demo: recycles the server-rendered set)
  let loads = 0;
  qs('[data-reviews-more]', root)?.addEventListener('click', (event) => {
    qsa('.review-card', list)
      .slice(0, 4)
      .forEach((card) => {
        const clone = card.cloneNode(true);
        delete clone.dataset.revealed;
        clone.hidden = false;
        list.append(clone);
      });
    initReveals(list);
    if (++loads >= 2) event.currentTarget.hidden = true;
  });

  // Rating bars grow in
  if (!prefersReducedMotion()) {
    gsap.from(qsa('[data-bar]', root), {
      scaleX: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: qs('.reviews__bars', root), start: 'top 85%', once: true },
    });
  }

  qs('[data-write-review]', root)?.addEventListener('click', () => {
    import('../components/toast.js').then(({ toast }) => toast('Review form coming soon — thanks for the love!', { iconName: 'star' }));
  });
}
