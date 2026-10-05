/** Brand & content pages: about, contact, FAQ, size guide, bulk, journal, policies, 404. */
import { initApp, initMotion } from '../app.js';
import '../../styles/pages/checkout.css';
import '../../styles/pages/content.css';
import '../../styles/sections/home.css'; // shared: stats, shop-the-look list
import { initContentPages } from '../sections/content.js';

initApp();
initContentPages();
initMotion();
