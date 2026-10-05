/**
 * Drawers (cart, menu, size guide). Open with [data-drawer-open="id"],
 * close with [data-drawer-close], overlay click or Escape.
 */
import { qs, qsa, on } from '../core/dom.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';
import { emit } from '../core/events.js';

let active = null;
let lastFocus = null;

const overlay = () => qs('[data-overlay]');

export function openDrawer(id) {
  const drawer = document.getElementById(id);
  if (!drawer || drawer === active) return;
  if (active) closeDrawer({ restoreFocus: false });

  lastFocus = document.activeElement;
  active = drawer;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay()?.classList.add('is-open');
  document.documentElement.style.overflow = 'hidden';
  stopScroll();

  requestAnimationFrame(() => qs('[data-drawer-close]', drawer)?.focus({ preventScroll: true }));
  emit('drawer:open', { id });
}

export function closeDrawer({ restoreFocus = true } = {}) {
  if (!active) return;
  const id = active.id;
  active.classList.remove('is-open');
  active.setAttribute('aria-hidden', 'true');
  overlay()?.classList.remove('is-open');
  document.documentElement.style.overflow = '';
  startScroll();
  active = null;
  if (restoreFocus) lastFocus?.focus?.({ preventScroll: true });
  emit('drawer:close', { id });
}

/** Keep Tab inside the open drawer. */
function trapFocus(event) {
  if (!active || event.key !== 'Tab') return;
  const focusables = qsa('a[href], button:not([disabled]), input, select, textarea', active).filter(
    (el) => el.offsetParent !== null,
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initDrawers() {
  on(document, 'click', '[data-drawer-open]', (event, trigger) => {
    event.preventDefault();
    openDrawer(trigger.dataset.drawerOpen);
  });
  on(document, 'click', '[data-drawer-close]', () => closeDrawer());
  overlay()?.addEventListener('click', () => closeDrawer());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
    trapFocus(event);
  });
}
