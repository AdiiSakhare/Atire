/** Cart page (Shopify: templates/cart.json). */
import { initApp, initMotion } from '../app.js';
import '../../styles/pages/checkout.css';
import { initCartPage } from '../sections/cart-page.js';

initApp();
initCartPage();
initMotion();
