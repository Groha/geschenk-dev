import "./app.min.js";
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
document.querySelectorAll(".cart-item").forEach((item) => {
  const input = item.querySelector("input");
  const plus = item.querySelector(".plus");
  const minus = item.querySelector(".minus");
  parseFloat(item.querySelector(".cart-item__price").dataset.price);
  const updateTotal = () => {
    const subtotal = Array.from(document.querySelectorAll(".cart-item")).reduce((sum, el) => {
      const qty = parseInt(el.querySelector("input").value);
      const pr = parseFloat(el.querySelector(".cart-item__price").dataset.price);
      return sum + qty * pr;
    }, 0);
    document.querySelector(".summary__subtotal").textContent = `${subtotal} ₴`;
    document.querySelector(".summary__total-sum").textContent = `${subtotal} ₴`;
  };
  plus.addEventListener("click", () => {
    input.value = parseInt(input.value) + 1;
    animatePriceChange(item);
    updateTotal();
  });
  minus.addEventListener("click", () => {
    if (input.value > 1) {
      input.value = parseInt(input.value) - 1;
      animatePriceChange(item);
      updateTotal();
    }
  });
  item.querySelector(".cart-item__remove").addEventListener("click", () => {
    item.classList.add("fade-out");
    setTimeout(() => {
      item.remove();
      updateTotal();
    }, 400);
  });
});
function animatePriceChange(item) {
  const price = item.querySelector(".cart-item__price");
  price.style.transition = "transform 0.2s ease";
  price.style.transform = "scale(1.1)";
  setTimeout(() => {
    price.style.transform = "scale(1)";
  }, 200);
}
