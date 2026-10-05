/** "Complete the look" bundle: live totals + add all selected to cart. */
import { qs, qsa } from '../core/dom.js';
import { addItems } from '../core/cart.js';
import { formatMoney } from '../core/money.js';
import { getProduct } from '../../data/products.js';
import { toast } from '../components/toast.js';

export function initBundle() {
  const root = qs('[data-bundle]');
  if (!root) return;

  const discount = Number(root.dataset.bundleDiscount);
  const items = qsa('[data-bundle-item]', root);

  const selected = () => items.filter((item) => qs('[data-bundle-check]', item).checked);

  const update = () => {
    const chosen = selected();
    const allChosen = chosen.length === items.length;
    const price = chosen.reduce((sum, item) => sum + Number(item.dataset.price), 0) - (allChosen ? discount : 0);
    const compare = chosen.reduce((sum, item) => sum + Number(item.dataset.compare), 0);

    items.forEach((item) => item.classList.toggle('is-excluded', !qs('[data-bundle-check]', item).checked));
    qs('[data-bundle-count]', root).textContent = chosen.length;
    qs('[data-bundle-total]', root).textContent = formatMoney(price);
    qs('[data-bundle-compare]', root).textContent = formatMoney(compare);
    qs('[data-bundle-save]', root).textContent = `You save ${formatMoney(compare - price)}`;
    qs('[data-bundle-add]', root).textContent = chosen.length > 1 ? `Add ${chosen.length} Items to Cart` : 'Add to Cart';
  };

  root.addEventListener('change', update);

  qs('[data-bundle-add]', root).addEventListener('click', () => {
    const lines = selected().map((item) => {
      const product = getProduct(item.dataset.handle);
      const size = qs('[data-bundle-size]', item).value;
      const variant =
        product.variants.find((v) => v.option2 === size && v.available) ?? product.variants.find((v) => v.available);
      return { id: variant.id, quantity: 1 };
    });
    addItems(lines);
    toast(`${lines.length} items added — bundle savings applied at checkout`);
  });

  update();
}
