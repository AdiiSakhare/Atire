/** Account, wishlist and order tracking (Shopify: customers/* templates). */
import { initApp, initMotion } from '../app.js';
import '../../styles/pages/checkout.css';
import '../../styles/pages/account.css';
import { initAccountPages } from '../sections/account.js';

initApp();
initAccountPages();
initMotion();
