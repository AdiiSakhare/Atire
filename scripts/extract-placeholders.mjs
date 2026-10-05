/**
 * Cuts placeholder imagery out of the design mockups so the site can be
 * built and reviewed before real photography lands.
 *
 * Run:  npm run images
 * Out:  public/assets/images/placeholders/*.jpg
 *
 * Delete this script (and the placeholders folder) once real assets exist.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LANDING = resolve(ROOT, 'design/mockups/landing-page.png');
const HERO = resolve(ROOT, 'design/mockups/hero-image.png');
const OUT = resolve(ROOT, 'public/assets/images/placeholders');

// Inset trims the rounded corners baked into the mockup cards.
const INSET = 6;

/** [name, left, top, width, height, targetWidth] — coordinates on the 1440px landing mockup */
const crops = [
  // Bestseller grid
  ['tee-college-survivor', 88, 2450, 394, 438, 1000],
  ['tee-football-fans', 523, 2450, 394, 438, 1000],
  ['tee-conversation-starter', 958, 2450, 394, 438, 1000],
  ['tee-couple-roast', 88, 3176, 394, 438, 1000],
  ['hoodie-manifest-love', 523, 3176, 394, 438, 1000],
  ['tee-blue-graphic', 958, 3176, 394, 438, 1000],

  // Category tiles
  ['cat-printed', 80, 1148, 180, 225, 600],
  ['cat-men', 300, 1148, 180, 225, 600],
  ['cat-women', 520, 1148, 180, 225, 600],
  ['cat-couple-tees', 740, 1148, 180, 225, 600],
  ['cat-couple-hoodies', 960, 1148, 180, 225, 600],
  ['cat-developers', 1180, 1148, 180, 225, 600],

  // Feature + closing banner
  ['feature-couple-winter', 90, 1621, 700, 428, 1600],
  ['banner-rack', 720, 6010, 640, 400, 1400],

  // UGC wall
  ['ugc-01', 80, 4955, 146, 150, 500],
  ['ugc-02', 80, 5121, 146, 180, 500],
  ['ugc-03', 242, 4952, 146, 90, 500],
  ['ugc-04', 242, 5164, 146, 140, 500],
  ['ugc-05', 404, 4968, 146, 320, 500],
  ['ugc-06', 566, 4948, 146, 360, 500],
  ['ugc-07', 728, 4948, 146, 360, 500],
  ['ugc-08', 890, 4968, 146, 320, 500],
  ['ugc-09', 1052, 4952, 146, 90, 500],
  ['ugc-10', 1052, 5058, 146, 90, 500],
  ['ugc-11', 1052, 5164, 146, 140, 500],
  ['ugc-12', 1214, 4955, 146, 150, 500],
  ['ugc-13', 1214, 5121, 146, 180, 500],
];

await mkdir(OUT, { recursive: true });

for (const [name, left, top, width, height, target] of crops) {
  await sharp(LANDING)
    .extract({ left: left + INSET, top: top + INSET, width: width - INSET * 2, height: height - INSET * 2 })
    .resize({ width: target, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(OUT, `${name}.jpg`));
}

// Hero ships at full resolution plus a portrait crop for mobile.
await sharp(HERO).jpeg({ quality: 82, mozjpeg: true }).toFile(resolve(OUT, 'hero-same-different.jpg'));
await sharp(HERO)
  .extract({ left: 520, top: 120, width: 640, height: 821 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(resolve(OUT, 'hero-same-different-portrait.jpg'));

// Hero tee doubles as a product shot.
await sharp(HERO)
  .extract({ left: 600, top: 380, width: 540, height: 561 })
  .resize({ width: 1000 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(resolve(OUT, 'tee-same-different.jpg'));

console.log(`✓ ${crops.length + 3} placeholders written to ${OUT}`);
