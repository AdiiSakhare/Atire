/** Demo order history (Shopify: customer.orders / Order Status page). */
import { read, write } from './storage.js';

const KEY = 'atire:orders';

export const getOrders = () => read(KEY, []);
export const getOrder = (id) => getOrders().find((order) => order.id === id);

export function saveOrder(order) {
  write(KEY, [order, ...getOrders()].slice(0, 20));
  return order;
}

export const newOrderId = () => `ATR${Math.floor(100000 + Math.random() * 900000)}`;

/** Business-day delivery estimate, skipping Sundays. */
export function estimateDelivery(from = new Date(), days = 4) {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added++;
  }
  return date;
}

export const formatDate = (date, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  new Date(date).toLocaleDateString('en-IN', opts);
