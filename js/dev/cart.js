import { u as updateCartCount, g as getCart, s as saveCart } from "./app.min.js";
/* empty css           */
let isFirstRender = true;
function renderCart() {
  const cart = getCart();
  const list = document.querySelector(".cart__items");
  const summary = document.querySelector(".cart__summary");
  list.innerHTML = "";
  if (!cart.length) {
    summary.innerHTML = `
      <p style="text-align:center">Ваша корзина пуста.</p>
      <a href="/products.html" data-fls-button class="summary__button button">Перейти к товарам</a>
    `;
    return;
  }
  cart.forEach((item) => {
    list.innerHTML += `
      <article class="cart-item ${isFirstRender ? "fade-in" : ""}" data-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" class="cart-item__img">
        <div class="cart-item__body">
          <div class="cart-item__info">
            <h3 class="cart-item__title">${item.title}</h3>
            <p class="cart-item__meta">Артикул: ${item.id}</p>
          </div>

          <div class="cart-item__controls">
            <span class="cart-item__price" data-price="${item.price}">${item.price * item.qty} ₴</span>
            <div class="cart-item__quantity">
              <div class="double-btn">
                ${item.qty > 1 ? '<button class="qty-btn minus">−</button>' : '<button class="qty-btn remove --icon-trash"></button>'}
              </div>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn plus">+</button>
            </div>
          </div>
        </div>
      </article>
    `;
  });
  attachCartEvents();
  updateTotals();
  isFirstRender = false;
}
function updateTotals() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.querySelector(".summary__total-sum").textContent = `${total} ₴`;
  document.querySelector(".summary__subtotal").textContent = `${totalQty} шт.`;
}
function attachCartEvents() {
  document.querySelectorAll(".cart-item").forEach((item) => {
    const id = item.dataset.id;
    item.querySelector(".plus").addEventListener("click", () => {
      changeQty(id, 1);
    });
    item.querySelector(".minus")?.addEventListener("click", () => {
      changeQty(id, -1);
    });
    item.querySelector(".remove")?.addEventListener("click", () => {
      removeItem(id);
    });
  });
}
function changeQty(id, delta) {
  let cart = getCart();
  const product = cart.find((i) => i.id === id);
  product.qty = Math.max(1, product.qty + delta);
  saveCart(cart);
  renderCart();
  const priceEl = document.querySelector(`.cart-item[data-id="${id}"] .cart-item__price`);
  animatePriceChange(priceEl, product.price * product.qty);
  updateCartCount();
}
function removeItem(id) {
  let cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function animatePriceChange(el, newValue) {
  el.style.transition = "transform 0.3s ease";
  el.style.transform = "scale(1.2)";
  setTimeout(() => {
    el.textContent = `${newValue} ₴`;
    el.style.transform = "scale(1)";
  }, 200);
}
renderCart();
updateCartCount();
