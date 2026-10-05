/** Size guide: inch/cm toggle + highlight the currently selected size. */
import { qs, qsa } from '../core/dom.js';
import { listen } from '../core/events.js';

export function initSizeGuide() {
  const root = qs('[data-size-guide]');
  if (!root) return;

  qsa('[data-unit]', root).forEach((button) =>
    button.addEventListener('click', () => {
      const cm = button.dataset.unit === 'cm';
      qsa('[data-unit]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      qsa('[data-inches]', root).forEach((cell) => {
        const inches = Number(cell.dataset.inches);
        cell.textContent = cm ? Math.round(inches * 2.54) : inches;
      });
    }),
  );

  listen('variant:change', ({ state }) => {
    qsa('tbody tr', root).forEach((row) => row.classList.toggle('is-selected', row.cells[0].textContent === state.Size));
  });
}
