/**
 * Recently viewed rail — clones pre-rendered cards from the card library
 * (single source of card markup), excluding the current product.
 */
import { qs } from '../core/dom.js';
import { read } from '../core/storage.js';
import { initRail } from '../components/rail.js';
import { syncCards, syncWishlistButtons } from '../components/product-card.js';

export function initRecentlyViewed(currentHandle) {
  const rail = qs('[data-client-rail="recently-viewed"]');
  const library = qs('[data-card-library]');
  if (!rail || !library) return;

  const handles = read('atire:recently-viewed', []).filter((h) => h !== currentHandle);
  const cards = handles
    .map((handle) => library.content.querySelector(`[data-handle="${handle}"]`))
    .filter(Boolean)
    .map((card) => card.cloneNode(true));

  if (!cards.length) return;

  const track = qs('[data-rail-track]', rail);
  track.replaceChildren(...cards);
  rail.hidden = false;
  syncCards(rail);
  syncWishlistButtons(rail);
  initRail(rail);
}
