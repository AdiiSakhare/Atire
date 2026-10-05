/**
 * Wishlist, account (demo auth + dashboard) and order tracking.
 * Shopify: customer accounts API / order status page replace the demo parts.
 */
import { qs, qsa, on } from '../core/dom.js';
import { read, write } from '../core/storage.js';
import { listen } from '../core/events.js';
import * as wishlist from '../core/wishlist.js';
import { getOrders, getOrder, formatDate, estimateDelivery } from '../core/orders.js';
import { formatMoney } from '../core/money.js';
import { syncCards, syncWishlistButtons } from '../components/product-card.js';
import { toast } from '../components/toast.js';
import { icon } from '../../data/icons.js';

const SESSION = 'atire:session';
const WISHLIST_KEY = 'atire:wishlist';

/* ---------------------------------------------------------------- Wishlist */
function initWishlist() {
  const root = qs('[data-wishlist-page]');
  const library = qs('[data-card-library]');
  if (!root || !library) return;

  const render = () => {
    const handles = read(WISHLIST_KEY, []);
    const cards = handles
      .map((h) => library.content.querySelector(`[data-handle="${h}"]`))
      .filter(Boolean)
      .map((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove('product-card--compact');
        return clone;
      });
    qs('[data-wl-grid]', root).replaceChildren(...cards);
    qs('[data-wl-empty]', root).hidden = cards.length > 0;
    qs('[data-wl-bar]', root).hidden = cards.length === 0;
    qs('[data-wl-count]', root).textContent = cards.length;
    syncCards(root);
    syncWishlistButtons(root);
  };

  qs('[data-wl-clear]', root).addEventListener('click', () => {
    read(WISHLIST_KEY, []).forEach((h) => wishlist.toggle(h));
  });
  qs('[data-wl-share]', root).addEventListener('click', async () => {
    const url = `${location.origin}/wishlist.html?items=${read(WISHLIST_KEY, []).join(',')}`;
    try { await navigator.clipboard.writeText(url); } catch { /* blocked */ }
    toast('Wishlist link copied — send it to someone with good taste', { iconName: 'share' });
  });

  // Shared links (?items=a,b) import into this browser's wishlist
  const shared = new URLSearchParams(location.search).get('items');
  if (shared) shared.split(',').forEach((h) => !wishlist.hasItem(h) && wishlist.toggle(h));

  listen('wishlist:change', render);
  render();
}

/* ---------------------------------------------------------------- Account */
const orderCard = (order) => `
  <article class="order-card">
    <div class="order-card__head">
      <div><strong>#${order.id}</strong><small>Placed ${formatDate(order.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</small></div>
      <span class="order-card__status">${icon('truck')} Arriving ${formatDate(order.eta)}</span>
    </div>
    <div class="order-card__items">
      ${order.items.slice(0, 4).map((i) => `<img src="${i.image}" alt="${i.product_title}" title="${i.product_title}" />`).join('')}
      ${order.items.length > 4 ? `<span>+${order.items.length - 4}</span>` : ''}
    </div>
    <div class="order-card__foot">
      <span>${order.items.reduce((n, i) => n + i.quantity, 0)} items · <strong>${formatMoney(order.totals.total)}</strong></span>
      <a class="section-head__link" href="/track-order.html?order=${order.id}">Track<span>${icon('arrow-up-right')}</span></a>
    </div>
  </article>`;

const noOrders = `<div class="dash__empty">${icon('bag')}<p>No orders yet. Your first fit is a tap away.</p><a class="btn btn--primary btn--sm" href="/shop.html">Start shopping</a></div>`;

function initAccount() {
  const root = qs('[data-account]');
  if (!root) return;

  const render = () => {
    const session = read(SESSION, null);
    qs('[data-auth]', root).hidden = Boolean(session);
    qs('[data-dash]', root).hidden = !session;
    if (!session) return;

    const orders = getOrders();
    const name = session.name || 'Atire fan';
    qs('[data-dash-name]', root).textContent = name;
    qs('[data-dash-first]', root).textContent = name.split(' ')[0];
    qs('[data-dash-initials]', root).textContent = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    qs('[data-dash-phone]', root).textContent = session.phone ? `+91 ${session.phone}` : '';
    qs('[data-dash-orders]', root).textContent = orders.length;
    qs('[data-dash-wish]', root).textContent = wishlist.count();
    qs('[data-dash-since]', root).textContent = formatDate(session.since, { month: 'short', year: 'numeric' });
    qs('[data-dash-recent]', root).innerHTML = orders.length ? orders.slice(0, 2).map(orderCard).join('') : noOrders;
    qs('[data-dash-order-list]', root).innerHTML = orders.length ? orders.map(orderCard).join('') : noOrders;

    const addresses = [...new Map(orders.map((o) => [`${o.address.line1}${o.address.pincode}`, o])).values()];
    qs('[data-dash-addresses]', root).innerHTML =
      addresses
        .map(
          (o, i) => `<div class="address-card">${i === 0 ? '<span class="address-card__tag">Default</span>' : ''}<strong>${o.customer.name} · ${o.address.type}</strong><p>${o.address.line1}${o.address.line2 ? `, ${o.address.line2}` : ''}<br />${o.address.city}, ${o.address.state} ${o.address.pincode}</p><small>+91 ${o.customer.phone}</small></div>`,
        )
        .join('') + `<button class="address-card address-card--add" type="button">${icon('plus')} Add new address</button>`;

    const profile = qs('[data-profile-form]', root);
    profile.name.value = session.name ?? '';
    profile.email.value = session.email ?? '';
    profile.phone.value = session.phone ?? '';
  };

  // Auth tabs
  on(root, 'click', '[data-auth-tab]', (e, tab) => {
    qsa('[data-auth-tab]', root).forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    qsa('[data-auth-form]', root).forEach((f) => (f.hidden = f.dataset.authForm !== tab.dataset.authTab));
  });

  // Login with OTP (demo)
  const login = qs('[data-auth-form="login"]', root);
  login.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!login.phone.checkValidity()) return login.phone.reportValidity();
    const otp = qs('[data-otp]', login);
    if (otp.hidden) {
      otp.hidden = false;
      login.otp.required = true;
      qs('[data-auth-submit]', login).textContent = 'Verify & Sign in';
      login.otp.focus();
      toast(`OTP sent to +91 ${login.phone.value}`, { iconName: 'check-circle' });
      return;
    }
    if (!login.otp.checkValidity()) return login.otp.reportValidity();
    write(SESSION, { phone: login.phone.value, name: '', since: Date.now() });
    render();
  });

  const signup = qs('[data-auth-form="signup"]', root);
  signup.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!signup.checkValidity()) return signup.reportValidity();
    write(SESSION, { name: signup.name.value, phone: signup.phone.value, email: signup.email.value, since: Date.now() });
    toast('Welcome to Atire! Your 10% code is in Overview', { iconName: 'sparkle' });
    render();
  });

  // Dashboard tabs
  on(root, 'click', '[data-dash-tab]', (e, tab) => {
    qsa('[data-dash-tab]', root).forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    qsa('[data-dash-panel]', root).forEach((p) => (p.hidden = p.dataset.dashPanel !== tab.dataset.dashTab));
  });

  qs('[data-logout]', root).addEventListener('click', () => {
    write(SESSION, null);
    render();
  });

  qs('[data-profile-form]', root).addEventListener('submit', (e) => {
    e.preventDefault();
    const session = read(SESSION, {});
    write(SESSION, { ...session, name: e.target.name.value, email: e.target.email.value });
    toast('Profile saved');
    render();
  });

  render();
}

/* ---------------------------------------------------------------- Tracking */
function initTracking() {
  const root = qs('[data-track]');
  if (!root) return;
  const form = qs('[data-track-form]', root);

  const show = (order) => {
    const placed = new Date(order.createdAt);
    const eta = new Date(order.eta);
    const now = Date.now();
    const steps = [
      ['Order placed', placed],
      ['Packed', estimateDelivery(placed, 0)],
      ['Shipped', estimateDelivery(placed, 1)],
      ['Out for delivery', new Date(eta.getTime() - 6 * 3600e3)],
      ['Delivered', eta],
    ];
    // Demo progression: placed + packed immediately, shipped after 2h
    const reached = (i) => i <= 1 || (i === 2 && now - placed > 2 * 3600e3) || now > steps[i][1];
    const current = steps.findLastIndex((_, i) => reached(i));

    qs('[data-tr-id]', root).textContent = `#${order.id}`;
    qs('[data-tr-status]', root).textContent = steps[current][0] === 'Delivered' ? 'Delivered 🎉' : steps[current][0];
    qs('[data-tr-eta]', root).textContent = `Expected delivery: ${formatDate(eta, { weekday: 'long', day: 'numeric', month: 'long' })}`;
    qs('[data-tr-steps]', root).innerHTML = steps
      .map(([title, date], i) => `<li class="tracker__step ${i <= current ? 'is-done' : ''} ${i === current ? 'is-current' : ''}"><span class="tracker__dot">${i <= current ? icon('check') : ''}</span><strong>${title}</strong><small>${i <= current ? formatDate(date) : 'Pending'}</small></li>`)
      .join('');
    qs('[data-tr-items]', root).innerHTML = order.items
      .map((i) => `<li class="co-line"><span class="co-line__media"><img src="${i.image}" alt="" /><b>${i.quantity}</b></span><span class="co-line__info"><strong>${i.product_title}</strong><small>${i.variant_title}</small></span><span class="co-line__price">${formatMoney(i.line_price)}</span></li>`)
      .join('');
    qs('[data-track-result]', root).hidden = false;
    qs('[data-track-hint]', root).textContent = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = form.order.value.trim().toUpperCase().replace('#', '');
    const contact = form.contact.value.trim().toLowerCase();
    const order = getOrder(id);
    const matches = order && [order.customer.phone, order.customer.email.toLowerCase()].includes(contact);
    if (!matches) {
      qs('[data-track-result]', root).hidden = true;
      qs('[data-track-hint]', root).textContent = 'We couldn’t find that order. Check the number in your confirmation email, or WhatsApp us.';
      return;
    }
    show(order);
  });

  qs('[data-tr-return]', root).addEventListener('click', () =>
    toast('Return request started — we’ll WhatsApp you a pickup slot', { iconName: 'return' }),
  );

  // Deep link from confirmation / account (?order=)
  const deep = new URLSearchParams(location.search).get('order');
  const order = deep && getOrder(deep);
  if (order) {
    form.order.value = order.id;
    form.contact.value = order.customer.phone;
    show(order);
  } else {
    const last = getOrders()[0];
    if (last) qs('[data-track-hint]', root).innerHTML = `Recent order: <button type="button" class="link" data-fill="${last.id}">#${last.id}</button>`;
  }
  on(root, 'click', '[data-fill]', (e, btn) => {
    const o = getOrder(btn.dataset.fill);
    form.order.value = o.id;
    form.contact.value = o.customer.phone;
    show(o);
  });
}

export function initAccountPages() {
  initWishlist();
  initAccount();
  initTracking();
}
