/**
 * Home page entry (Shopify: templates/index.json).
 */
import { initApp, initMotion } from '../app.js';

import '../../styles/sections/home.css';
import '../../styles/sections/ugc-tilt.css';

import { initHero } from '../sections/home-hero.js';
import { initCountdowns } from '../sections/countdown.js';
import { initProductTabs } from '../sections/product-tabs.js';
import { initVibes } from '../sections/vibes.js';
import { initUgcTilt } from '../sections/ugc-tilt.js';
import { initHomeMotion } from '../sections/home-motion.js';
import { initHotspots } from '../sections/hotspots.js';
import { initRecentlyViewed } from '../sections/recently-viewed.js';

initApp();

initHero();
initCountdowns();
initProductTabs();
initVibes();
initUgcTilt();
initHomeMotion();
initHotspots();
initRecentlyViewed();

initMotion();
