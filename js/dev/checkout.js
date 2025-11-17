import { g as getCart, a as gotoBlock, s as saveCart } from "./app.min.js";
import { f as formValidate } from "./form.min.js";
const cart = getCart();
if (!cart.length) {
  alert("Ваша корзина пуста! Добавьте товары перед оформлением заказа.");
  window.location.href = "https://groha.github.io/geschenk-dev/";
}
function renderCheckoutCart() {
  const cart2 = getCart();
  const list = document.querySelector(".checkout__items");
  list.innerHTML = "";
  let totalQty = 0;
  let totalSum = 0;
  cart2.forEach((item) => {
    totalQty += Number(item.qty);
    totalSum += Number(item.qty) * Number(item.price);
    list.innerHTML += `
      <li class="checkout-item" data-id="${item.id}">
        ${item.title} — ${item.qty} шт. — ${item.price * item.qty} ₴
      </li>
    `;
  });
  document.querySelector(".checkout__subtotal").textContent = `${totalQty} шт.`;
  document.querySelector(".checkout__total").textContent = `${totalSum} ₴`;
}
function initCheckoutForm() {
  const form = document.querySelector(".checkout__form");
  if (!form) return;
  form.setAttribute("novalidate", true);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errors = formValidate.getErrors(form);
    if (errors > 0) {
      if (form.hasAttribute("data-fls-form-gotoerr")) {
        const selector = form.dataset.flsFormGotoerr || ".--form-error";
        gotoBlock(selector);
      }
      return;
    }
    const formData = new FormData(form);
    const data = {
      cart: getCart(),
      customer: Object.fromEntries(formData.entries())
    };
    console.log("Данные для отправки:", data);
    formValidate.formClean(form);
    saveCart([]);
    renderCheckoutCart();
    window.location.href = "https://groha.github.io/geschenk-dev/thank-you";
  });
}
renderCheckoutCart();
initCheckoutForm();
