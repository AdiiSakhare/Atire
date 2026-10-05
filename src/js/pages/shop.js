/** Collection / search page (Shopify: templates/collection.json + search.json). */
import { initApp, initMotion } from '../app.js';
import '../../styles/pages/shop.css';
import { initShop } from '../sections/shop.js';
import { initRecentlyViewed } from '../sections/recently-viewed.js';

initApp();
initShop();
initRecentlyViewed();
initMotion();
