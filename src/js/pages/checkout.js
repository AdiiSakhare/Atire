/** Demo checkout + order confirmation (Shopify Checkout in production). */
import { initApp, initMotion } from '../app.js';
import '../../styles/pages/checkout.css';
import { initCheckoutFlow } from '../sections/checkout.js';

initApp();
initCheckoutFlow();
initMotion();
