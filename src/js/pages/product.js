/**
 * Product page entry (Shopify: templates/product.json).
 */
import { initApp, initMotion } from '../app.js';

import '../../styles/sections/main-product.css';
import '../../styles/sections/product-sections.css';
import '../../styles/sections/ugc-tilt.css';

import { initMainProduct } from '../sections/main-product.js';
import { initStickyAtc } from '../sections/sticky-atc.js';
import { initBundle } from '../sections/product-bundle.js';
import { initReviews } from '../sections/product-reviews.js';
import { initUgcTilt } from '../sections/ugc-tilt.js';
import { initRecentlyViewed } from '../sections/recently-viewed.js';
import { initSizeGuide } from '../sections/size-guide.js';

initApp();

const mainProduct = initMainProduct();
initStickyAtc(mainProduct);
initBundle();
initReviews();
initUgcTilt();
initSizeGuide();
initRecentlyViewed(mainProduct?.product().handle);

initMotion();
