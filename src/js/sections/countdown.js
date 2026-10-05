/**
 * Offer countdown to a real campaign end (`data-ends-at`, ISO 8601).
 * Hides itself when the offer is over — no fake rolling timers (false
 * urgency is a listed dark pattern under India’s 2023 CCPA guidelines).
 */
import { qsa } from '../core/dom.js';

const pad = (n) => String(n).padStart(2, '0');

export function initCountdowns() {
  qsa('[data-countdown]').forEach((timer) => {
    const end = Date.parse(timer.dataset.endsAt);
    if (Number.isNaN(end)) return (timer.hidden = true);

    const tick = () => {
      const left = end - Date.now();
      if (left <= 0) {
        timer.hidden = true;
        clearInterval(id);
        return;
      }
      const parts = {
        d: Math.floor(left / 86400000),
        h: Math.floor(left / 3600000) % 24,
        m: Math.floor(left / 60000) % 60,
        s: Math.floor(left / 1000) % 60,
      };
      qsa('[data-cd]', timer).forEach((el) => (el.textContent = pad(parts[el.dataset.cd])));
    };

    const id = setInterval(tick, 1000);
    tick();
  });
}
