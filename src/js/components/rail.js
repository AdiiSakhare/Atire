/** Horizontal rails: arrow buttons scroll one "page", disabled at the ends. */
import { qs, qsa } from '../core/dom.js';

export function initRail(rail) {
  const track = qs('[data-rail-track]', rail);
  const prev = qs('[data-rail-prev]', rail);
  const next = qs('[data-rail-next]', rail);
  if (!track) return;

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
  };

  const page = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: 'smooth' });
  prev?.addEventListener('click', () => page(-1));
  next?.addEventListener('click', () => page(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export const initRails = (root = document) => qsa('[data-rail]', root).forEach(initRail);
