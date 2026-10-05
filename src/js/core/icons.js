/**
 * Lucide runtime: swaps <i data-lucide="…"> placeholders for SVGs at the
 * theme standard (18px, 1.5 stroke). A MutationObserver covers anything
 * rendered later (cart lines, quick shop, toasts, cloned cards).
 * The library itself is loaded from the CDN in layout/head.
 */
import { ICON_SIZE, ICON_STROKE } from '../../data/icons.js';

const toPascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

export function hydrateIcons(root = document) {
  const lucide = window.lucide;
  if (!lucide?.icons || !root?.querySelectorAll) return;

  root.querySelectorAll('i[data-lucide]').forEach((placeholder) => {
    const node = lucide.icons[toPascal(placeholder.dataset.lucide)];
    if (!node) return;
    const svg = lucide.createElement(node, {
      width: ICON_SIZE,
      height: ICON_SIZE,
      'stroke-width': ICON_STROKE,
      fill: placeholder.hasAttribute('data-fill') ? 'currentColor' : 'none',
      'aria-hidden': 'true',
      focusable: 'false',
    });
    svg.classList.add('lucide', `lucide-${placeholder.dataset.lucide}`);
    placeholder.replaceWith(svg);
  });
}

export function initIcons() {
  const run = () => {
    hydrateIcons(document);
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches('i[data-lucide]')) hydrateIcons(node.parentNode);
          else if (node.querySelector('i[data-lucide]')) hydrateIcons(node);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  };

  // The CDN script is deferred and ordered before our module, but guard anyway.
  if (window.lucide) run();
  else document.querySelector('script[data-lucide-cdn]')?.addEventListener('load', run, { once: true });
}
