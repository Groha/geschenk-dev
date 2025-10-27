import { g as getCart, s as saveCart } from "./app.min.js";
const cart = getCart();
if (!cart.length) {
  alert("Ваша корзина пуста! Добавьте товары перед оформлением заказа.");
  window.location.href = "/";
}
function renderCheckoutCart() {
  const cart2 = getCart();
  const list = document.querySelector(".checkout__items");
  list.innerHTML = "";
  let totalQty = 0;
  let totalSum = 0;
  cart2.forEach((item) => {
    totalQty += item.qty;
    totalSum += item.qty * item.price;
    list.innerHTML += `
      <li class="checkout-item" data-id="${item.id}">
        ${item.title} — ${item.qty} шт. — ${item.price * item.qty} ₴
      </li>
    `;
  });
  document.querySelector(".checkout__subtotal").textContent = `${totalQty} шт.`;
  document.querySelector(".checkout__total").textContent = `${totalSum} ₴`;
}
const form = document.querySelector(".checkout__form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cart2 = getCart();
  if (!cart2.length) {
    alert("Корзина пуста!");
    return;
  }
  const formData = new FormData(form);
  const data = {
    cart: cart2,
    customer: Object.fromEntries(formData.entries())
  };
  console.log("Данные для отправки:", data);
  document.querySelector(".checkout__message").textContent = "Спасибо! Ваш заказ принят.";
  saveCart([]);
  renderCheckoutCart();
});
renderCheckoutCart();
