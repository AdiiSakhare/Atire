import{C as e,N as t,O as n,b as r,c as i,g as a,h as o,i as s,j as c,k as l,n as u,p as d,r as f,s as p,t as m,w as h,x as g}from"./chunk-global.js";/* empty css              */var _=e=>`
  <li class="cp-line" data-line="${e.id}">
    <a class="cp-line__media" href="${e.url}"><img src="${e.image}" alt="" /></a>
    <div class="cp-line__info">
      <div class="cp-line__top">
        <div>
          <a class="cp-line__title" href="${e.url}">${e.product_title}</a>
          <p class="cp-line__variant">${e.variant_title.replace(` / `,` · Size `)}</p>
        </div>
        <div class="price cp-line__price">
          <span class="price__current">${g(e.line_price)}</span>
          ${e.compare_at_price?`<s class="price__compare">${g(e.compare_at_price*e.quantity)}</s><span class="price__off">${r(e.price,e.compare_at_price)}% OFF</span>`:``}
        </div>
      </div>
      <p class="cp-line__ship">${l(`truck`)} Ships in 24 hours · Easy 7-day returns</p>
      <div class="cp-line__actions">
        <div class="stepper stepper--outline">
          <button type="button" data-qty="${e.quantity-1}" aria-label="Decrease">${l(e.quantity===1?`trash`:`minus`)}</button>
          <span class="stepper__count">${e.quantity}</span>
          <button type="button" data-qty="${e.quantity+1}" aria-label="Increase">${l(`plus`)}</button>
        </div>
        <button class="cp-line__link" type="button" data-save-later="${e.handle}">${l(`heart`)} Save for later</button>
        <button class="cp-line__link" type="button" data-qty="0">${l(`trash`)} Remove</button>
      </div>
    </div>
  </li>`;function v(){let r=t(`[data-cart-page]`);if(!r)return;let i=async()=>{let e=await h(),n=s(e),i=e.item_count===0;t(`[data-cp-count]`,r).textContent=i?``:`(${e.item_count})`,t(`[data-cp-layout]`,r).hidden=i,t(`[data-cp-ship]`,r).hidden=i,t(`[data-cp-empty]`,r).hidden=!i,document.querySelector(`[data-cp-mobile-bar]`).hidden=i,t(`[data-cp-items]`,r).innerHTML=e.items.map(_).join(``),u(r,n),document.querySelector(`[data-cp-mobile-total]`).textContent=g(n.total);let a=f-e.total_price;t(`[data-cp-ship-text]`,r).innerHTML=a>0?`${l(`truck`)} Prepaid orders ship FREE. For COD, add <strong>${g(a)}</strong> more for free delivery.`:`${l(`truck`)} 🎉 <strong>Free delivery unlocked</strong> on every payment method.`,t(`[data-cp-ship-bar]`,r).style.setProperty(`--progress`,`${Math.min(100,e.total_price/f*100)}%`)};c(r,`click`,`[data-qty]`,(t,n)=>e(n.closest(`[data-line]`).dataset.line,Number(n.dataset.qty))),c(r,`click`,`[data-save-later]`,(t,n)=>{o(n.dataset.saveLater)||a(n.dataset.saveLater),e(n.closest(`[data-line]`).dataset.line,0),d(`Moved to your wishlist`,{iconName:`heart`})}),m(r,{onChange:i}),n(`cart:change`,i),i()}p(),v(),i();