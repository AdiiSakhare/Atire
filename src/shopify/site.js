/**
 * Theme build replacement for data/site.js. Only what client scripts read;
 * values come from theme settings via <script id="atire-settings"> (theme.liquid).
 */
let settings = {};
try {
  settings = JSON.parse(document.getElementById('atire-settings')?.textContent || '{}');
} catch {
  /* fall through to defaults */
}

export const site = {
  freeShippingThreshold: Number(settings.free_shipping_threshold ?? 999) * 100, // paise, like the prototype
};
