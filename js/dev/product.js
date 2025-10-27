import { g as getCart, s as saveCart, u as updateCartCount } from "./app.min.js";
import "./slider.min.js";
/* empty css           */
function addToCart() {
  document.addEventListener("click", addToCartAction);
  function addToCartAction(e) {
    const targetElement = e.target;
    if (targetElement.closest("[data-fls-addtocart-button]")) {
      let addToCart2 = document.querySelector("[data-fls-addtocart]");
      const addToCartButton = targetElement.closest("[data-fls-addtocart-button]");
      const addToCartProduct = addToCartButton.closest("[data-fls-addtocart-product]");
      if (addToCartProduct) {
        let addToCartQuantity = addToCartProduct.querySelector("[data-fls-addtocart-quantity]");
        addToCartQuantity = addToCartQuantity ? +addToCartQuantity.value : 1;
        const addToCartImage = addToCartProduct.querySelector("[data-fls-addtocart-image]");
        const flyImgSpeed = +addToCartImage?.dataset?.flsAddtocartImage || 500;
        addToCartImage ? addToCartImageFly(addToCartImage, addToCart2, flyImgSpeed) : null;
        setTimeout(() => {
          addToCart2.innerHTML = +addToCart2.innerHTML + addToCartQuantity;
        }, addToCartImage ? flyImgSpeed : 0);
      } else {
        addToCart2.innerHTML = +addToCart2.innerHTML + 1;
      }
    }
  }
  function addToCartImageFly(addToCartImage, addToCart2, flyImgSpeed) {
    const flyImg = document.createElement("img");
    flyImg.src = addToCartImage.src;
    flyImg.style.cssText = `
			position: absolute;
			left: ${addToCartImage.getBoundingClientRect().left + scrollX}px;
			top: ${addToCartImage.getBoundingClientRect().top + scrollY}px;
			width: ${addToCartImage.offsetWidth}px;
			transition: all ${flyImgSpeed}ms;
		`;
    document.body.insertAdjacentElement("beforeend", flyImg);
    flyImg.style.left = `${addToCart2.getBoundingClientRect().left + scrollX}px`;
    flyImg.style.top = `${addToCart2.getBoundingClientRect().top + scrollY}px`;
    flyImg.style.width = 0;
    flyImg.style.opacity = `0`;
    setTimeout(() => {
      flyImg.remove();
    }, flyImgSpeed);
  }
}
document.querySelector("[data-fls-addtocart]") ? window.addEventListener("load", addToCart) : null;
let toastTimeout;
let lastClickedBtn = null;
document.addEventListener("click", (e) => {
  const addToCartBtn = e.target.closest(".add-to-cart");
  if (addToCartBtn) {
    lastClickedBtn = addToCartBtn;
    const id = addToCartBtn.dataset.id;
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id,
        title: addToCartBtn.dataset.title,
        price: parseFloat(addToCartBtn.dataset.price),
        qty: 1,
        img: addToCartBtn.dataset.img
      });
    }
    saveCart(cart);
    updateCartCount();
    showToast();
  }
  if (e.target.closest("#toast-close")) {
    closeToast();
  }
});
function showToast() {
  const toast = document.querySelector(".product__toast");
  toast.classList.add("show");
  lastClickedBtn.style.pointerEvents = "none";
  lastClickedBtn.style.opacity = "0.8";
  toastTimeout = setTimeout(closeToast, 3e3);
}
function closeToast() {
  const toast = document.querySelector(".product__toast");
  toast.classList.remove("show");
  clearTimeout(toastTimeout);
  if (lastClickedBtn) {
    lastClickedBtn.style.pointerEvents = "auto";
    lastClickedBtn.style.opacity = "1";
  }
}
