# Offers & payment rules → Shopify

The prototype fakes its offers in `src/js/core/pricing.js`. In the theme, Shopify must do the real maths
(`src/shopify/pricing.js` only displays and hands codes over). This table says how to create each offer.
Items marked **needs decision** cannot be done with a plain Shopify discount; capabilities change, so confirm
in your admin (Discounts) before relying on any row.

| Prototype offer | Where it shows | Native Shopify setup | Gap / decision |
|---|---|---|---|
| `PREPAID100` — ₹100 off prepaid orders above ₹1,199 | announcement bar, PDP offers, cart chips | Discount code: fixed ₹100 off, minimum subtotal ₹1,199 | **needs decision** — a discount cannot depend on the payment method. Options: an app (checkout/COD apps), a custom Shopify Function, or drop the "prepaid only" condition |
| Free delivery on prepaid, ₹79 on COD under ₹999 | cart, quick shop, trust strip | Shipping rates: free above ₹999 order value | **needs decision** — rates can't vary by payment method natively; same options as above |
| `WELCOME10` — 10% off first order (max ₹300) | welcome popup, account | Discount code: 10%, one use per customer, limit to new customers | "max ₹300" cap is not native — use a fixed ₹ amount or a Function |
| `TEXTEE3` — any 3 Textees for ₹1,999 | home, shop promo, deals | Bundle app (Shopify Bundles) or Buy-X-Get-Y automatic discount on the *Textees* collection | Fixed bundle price across mixed products needs the Bundles app or a Function |
| PDP "Complete the look" — ₹200 off for 3 | product page | Automatic discount: Buy 3 from the bundle collection, ₹200 off | Display is a theme setting (`discount`); keep it equal to the discount you create |
| `CASHBACK20` — "20% cashback" | home ticket banner | Discount code: 20% off, min ₹1,000 | "Cashback" implies store credit paid later; either rename to "20% off" or implement store credit. **Don't ship wording that promises something the discount doesn't do** |

## Payment methods
- **UPI, cards, wallets, RuPay**: enable through Shopify Payments or a supported Indian gateway (Razorpay etc.).
- **COD**: Settings → Payments → Manual payment methods → Cash on Delivery. Restrict by pincode with a COD app if needed.
- The footer payment labels are a text setting in the footer section — keep it matching what the store actually accepts.

## Checkout
Shopify's checkout is not themeable on non-Plus plans beyond logo, colours and fonts (Settings → Checkout and customer accounts → Customize).
The prototype's multi-step checkout page is design reference only.
