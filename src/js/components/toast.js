/** Lightweight toast notifications. */
import { qs } from '../core/dom.js';
import { icon } from '../../data/icons.js';

export function toast(message, { iconName = 'check-circle', duration = 2600 } = {}) {
  const stack = qs('[data-toasts]');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon(iconName)}<span>${message}</span>`;
  stack.append(el);
  setTimeout(() => {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, duration);
}
