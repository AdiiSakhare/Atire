/**
 * Icons — Lucide (https://lucide.dev), loaded from the unpkg CDN.
 *
 * Standard: 18 × 18px, 1.5px stroke (applied in js/core/icons.js).
 * `icon('bag')` returns a placeholder <i data-lucide="shopping-bag"> that the
 * runtime swaps for the SVG — on load and for anything JS renders later.
 * Keep the theme's short names here so templates never depend on Lucide naming.
 * Shopify: snippets/icon.liquid with the same names.
 */

export const LUCIDE_VERSION = '1.52.0';
export const ICON_SIZE = 18;
export const ICON_STROKE = 1.5;

/** theme name → [lucide name, filled?] */
const MAP = {
  sparkle: ['sparkle', true],
  star: ['star', true],
  bag: ['shopping-bag'],
  user: ['user'],
  search: ['search'],
  heart: ['heart'],
  share: ['share-2'],
  'arrow-left': ['arrow-left'],
  'arrow-right': ['arrow-right'],
  'arrow-up-right': ['arrow-up-right'],
  'chevron-down': ['chevron-down'],
  'chevron-right': ['chevron-right'],
  close: ['x'],
  plus: ['plus'],
  minus: ['minus'],
  trash: ['trash-2'],
  copy: ['copy'],
  check: ['check'],
  'check-circle': ['circle-check'],
  truck: ['truck'],
  return: ['undo-2'],
  cash: ['banknote'],
  shield: ['shield-check'],
  tag: ['tag'],
  ruler: ['ruler'],
  'thumbs-up': ['thumbs-up'],
  menu: ['menu'],
  pin: ['map-pin'],
  camera: ['camera'],
  zoom: ['zoom-in'],
  verified: ['badge-check'],
  bolt: ['zap', true],
  eye: ['eye'],
  home: ['house'],
  grid: ['layout-grid'],
  fire: ['flame', true],
};

/**
 * Lucide 1.x dropped brand marks, so Instagram is drawn here in the same
 * grid, size and stroke as the rest of the set.
 */
const CUSTOM = {
  instagram: `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${ICON_STROKE}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`,
};

export function icon(name) {
  if (CUSTOM[name]) return CUSTOM[name];
  const [lucide = name, filled = false] = MAP[name] ?? [];
  return `<i class="lucide-icon" data-lucide="${lucide}"${filled ? ' data-fill' : ''} aria-hidden="true"></i>`;
}
