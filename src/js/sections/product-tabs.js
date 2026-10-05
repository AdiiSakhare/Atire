/** "Browse All You Need" tabs — sliding pill + tag filtering (first 6 shown). */
import { gsap } from 'gsap';
import { qs, qsa, prefersReducedMotion } from '../core/dom.js';

const LIMIT = 6;

export function initProductTabs() {
  const root = qs('[data-product-tabs]');
  if (!root) return;

  const tabs = qsa('[data-tab]', root);
  const items = qsa('[data-tab-item]', root);
  const pill = qs('[data-tabs-pill]', root);

  const movePill = (tab) => {
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const select = (tab, { animate = true } = {}) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    movePill(tab);

    const tag = tab.dataset.tab;
    let shown = 0;
    const visible = [];
    items.forEach((item) => {
      const match = item.dataset.tags.split(' ').includes(tag) && shown < LIMIT;
      item.classList.toggle('is-hidden', !match);
      if (match) {
        shown++;
        visible.push(item);
      }
    });

    if (animate && !prefersReducedMotion()) {
      gsap.fromTo(visible, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 });
    }

    const more = qs('[data-tabs-more]', root);
    if (more) more.href = `/shop.html?c=${tag}`;
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
  window.addEventListener('resize', () => movePill(qs('[aria-selected="true"]', root)));
  // Fonts change tab widths — re-measure once they're in.
  document.fonts?.ready.then(() => movePill(qs('[aria-selected="true"]', root)));

  select(tabs[0], { animate: false });
}
