import { u as updateCartCount, g as getCart, s as saveCart } from "./app.min.js";
/* empty css           */
function formQuantity() {
  document.addEventListener("click", quantityActions);
  document.addEventListener("input", quantityActions);
  function quantityActions(e) {
    const type = e.type;
    const targetElement = e.target;
    if (type === "click") {
      if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
        const valueElement = targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]");
        let value = parseInt(valueElement.value);
        if (targetElement.hasAttribute("data-fls-quantity-plus")) {
          value++;
          if (+valueElement.dataset.flsQuantityMax && +valueElement.dataset.flsQuantityMax < value) {
            value = valueElement.dataset.flsQuantityMax;
          }
        } else {
          --value;
          if (+valueElement.dataset.flsQuantityMin) {
            if (+valueElement.dataset.flsQuantityMin > value) {
              value = valueElement.dataset.flsQuantityMin;
            }
          } else if (value < 1) {
            value = 1;
          }
        }
        targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]").value = value;
      }
    } else if (type === "input") {
      if (targetElement.closest("[data-fls-quantity-value]")) {
        const valueElement = targetElement.closest("[data-fls-quantity-value]");
        valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value) ? valueElement.value = 1 : null;
      }
    }
  }
}
document.querySelector("[data-fls-quantity]") ? window.addEventListener("load", formQuantity) : null;
function renderCart() {
  const cart = getCart();
  const list = document.querySelector(".cart__items");
  list.innerHTML = "";
  cart.forEach((item) => {
    list.innerHTML += `
      <article class="cart-item fade-in" data-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" class="cart-item__img">
        <div class="cart-item__body">
          <div class="cart-item__info">
            <h3 class="cart-item__title">${item.title}</h3>
            <p class="cart-item__meta">Артикул: ${item.id}</p>
          </div>

          <div class="cart-item__controls">
            <span class="cart-item__price" data-price="${item.price}">${item.price * item.qty} ₴</span>
            <div class="cart-item__quantity">
              <button class="qty-btn minus">−</button>
              <input type="number" value="${item.qty}">
              <button class="qty-btn plus">+</button>
            </div>
            <button class="cart-item__remove">🗑️</button>
          </div>
        </div>
      </article>
    `;
  });
  attachCartEvents();
  updateTotals();
}
function updateTotals() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.querySelector(".summary__total-sum").textContent = `${total} ₴`;
}
function attachCartEvents() {
  document.querySelectorAll(".cart-item").forEach((item) => {
    const id = item.dataset.id;
    item.querySelector("input");
    item.querySelector(".plus").addEventListener("click", () => {
      changeQty(id, 1);
    });
    item.querySelector(".minus").addEventListener("click", () => {
      changeQty(id, -1);
    });
    item.querySelector(".cart-item__remove").addEventListener("click", () => {
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
}
function removeItem(id) {
  let cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}
renderCart();
updateCartCount();
