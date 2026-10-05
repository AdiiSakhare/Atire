/** Tiny DOM helpers */

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Delegated listener: on(document, 'click', '[data-x]', (e, el) => …) */
export function on(root, type, selector, handler, options) {
  root.addEventListener(
    type,
    (event) => {
      const target = event.target.closest(selector);
      if (target && root.contains(target)) handler(event, target);
    },
    options,
  );
}

/** html`<div>…</div>` → Element */
export function toElement(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

// `?static` disables motion — handy for visual QA screenshots.
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('static');

export const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
