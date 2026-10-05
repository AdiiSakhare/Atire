/**
 * Global bootstrap shared by every page (Shopify: assets/global.js).
 * Page entries import this, then initialise their own sections.
 */
import '../styles/main.css';

import { initSmoothScroll, scrollToElement } from './core/smooth-scroll.js';
import { initReveals, initSplitHeadings, initParallax } from './core/motion.js';
import { on } from './core/dom.js';
import { initIcons } from './core/icons.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAnnouncement } from './components/announcement.js';
import { initHeader } from './components/header.js';
import { initDrawers } from './components/drawer.js';
import { initCartDrawer } from './components/cart-drawer.js';
import { initProductCards } from './components/product-card.js';
import { initRails } from './components/rail.js';
import { initCopy } from './components/copy.js';
import { initAccordions } from './components/accordion.js';
import { toast } from './components/toast.js';
import { initQuickShop } from './components/quick-shop.js';
import { initWelcomePopup } from './components/welcome-popup.js';
import { initSearchSuggestions } from './components/search.js';

function initAnchors() {
  on(document, 'click', '[data-scroll-to]', (event, link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
  });
}

function initNewsletter() {
  on(document, 'submit', '[data-newsletter]', (event, form) => {
    event.preventDefault();
    form.reset();
    toast('You’re on the list. Check your inbox for 10% off!', { iconName: 'sparkle' });
  });
}

export function initApp() {
  initIcons();
  initSmoothScroll();
  initAnnouncement();
  initHeader();
  initDrawers();
  initCartDrawer();
  initProductCards();
  initQuickShop();
  initSearchSuggestions();
  initWelcomePopup();
  initRails();
  initCopy();
  initAccordions();
  initAnchors();
  initNewsletter();
}

/** Run after page sections have mounted so reveals see final DOM. */
export function initMotion() {
  initSplitHeadings();
  initReveals();
  initParallax();

  // Lazy images and late fonts shift layout — keep trigger positions honest.
  let timer;
  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 200);
  };
  window.addEventListener('load', refresh);
  document.fonts?.ready.then(refresh);
  document.addEventListener('load', (event) => event.target.tagName === 'IMG' && refresh(), true);
}
