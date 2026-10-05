/** Copy coupon codes ([data-copy="CODE"]). */
import { on } from '../core/dom.js';
import { icon } from '../../data/icons.js';
import { toast } from './toast.js';

export function initCopy() {
  on(document, 'click', '[data-copy]', async (event, button) => {
    const code = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked — the toast still tells them the code */
    }
    const original = button.innerHTML;
    button.innerHTML = icon('check');
    setTimeout(() => (button.innerHTML = original), 1600);
    toast(`Code <strong>${code}</strong> copied — apply at checkout`, { iconName: 'tag' });
  });
}
