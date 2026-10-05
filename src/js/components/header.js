/**
 * Header: hide on scroll down / reveal on scroll up, shadow once scrolled,
 * mega menus with hover intent + keyboard support, search overlay.
 */
import { qs, qsa } from '../core/dom.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';

function initScrollBehaviour(header) {
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const goingDown = y > lastY;
    const pastTop = y > 160;
    const megaOpen = header.querySelector('.site-nav__item.is-open');

    header.classList.toggle('is-scrolled', y > 8);
    header.classList.toggle('is-hidden', goingDown && pastTop && !megaOpen && Math.abs(y - lastY) > 2);
    document.documentElement.classList.toggle('header-hidden', header.classList.contains('is-hidden'));

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
}

function initMegaMenus(header) {
  qsa('[data-mega]', header).forEach((item) => {
    const link = item.querySelector('.site-nav__link');
    let openTimer;
    let closeTimer;

    const open = () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => {
        qsa('.site-nav__item.is-open', header).forEach((other) => other !== item && other.classList.remove('is-open'));
        item.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      }, 80);
    };

    const close = () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        link.setAttribute('aria-expanded', 'false');
      }, 140);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) close();
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
        link.focus();
      }
    });
  });
}

function initSearch() {
  const search = qs('[data-search]');
  if (!search) return;
  const input = qs('[data-search-input]', search);

  const open = () => {
    search.hidden = false;
    stopScroll();
    requestAnimationFrame(() => input.focus());
  };
  const close = () => {
    search.hidden = true;
    startScroll();
  };

  qsa('[data-search-open]').forEach((btn) => btn.addEventListener('click', open));
  qs('[data-search-close]', search)?.addEventListener('click', close);
  search.addEventListener('click', (event) => event.target === search && close());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !search.hidden) close();
    if (event.key === '/' && search.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      open();
    }
  });
}

export function initHeader() {
  const header = qs('[data-header]');
  if (!header) return;
  initScrollBehaviour(header);
  initMegaMenus(header);
  initSearch();
}
