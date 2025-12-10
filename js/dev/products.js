import "./app.min.js";
/* empty css           */
let allProducts = [];
let filteredProducts = [];
const productsList = document.querySelector(".products-page__cards");
const html = document.documentElement;
const filters = document.querySelector(".filters");
const openBtn = filters.querySelector(".filters__btn");
const overlay = filters.querySelector(".filters__overlay");
const resetBtn = filters.querySelector(".filters__reset");
const closeBtn = document.querySelector(".filters__close");
const filterForm = document.getElementById("filters-form");
function openFilters() {
  filters.classList.add("filters--open");
  html.setAttribute("data-fls-scrolllock", "");
}
function closeFilters() {
  filters.classList.remove("filters--open");
  html.removeAttribute("data-fls-scrolllock");
}
async function loadProducts() {
  try {
    const res = await fetch("https://groha.github.io/geschenk-dev/files/products.json");
    if (!res.ok) throw new Error("Ошибка загрузки товаров");
    allProducts = await res.json();
    filteredProducts = allProducts;
    renderProducts(filteredProducts);
  } catch (err) {
    console.error(err);
    productsList.innerHTML = `<p class="error">Не удалось загрузить товары 😢</p>`;
  }
}
function renderProducts(products) {
  const existingCards = Array.from(productsList.querySelectorAll(".product"));
  existingCards.forEach((card, index) => {
    card.classList.add("fade-out");
    card.style.transitionDelay = `${index * 100}ms`;
  });
  const removeDelay = 300 + existingCards.length * 50;
  setTimeout(() => {
    productsList.innerHTML = "";
    if (!products.length) {
      productsList.innerHTML = `<p class="no-results">Ничего не найдено 😔</p>`;
      return;
    }
    products.forEach((p, index) => {
      const delay = index * 200;
      const card = document.createElement("article");
      card.className = "products__card card fade-in";
      card.style.animationDelay = `${delay}ms`;
      card.innerHTML = `
        <a href="/product" class="card__link">
          <div class="card__image">
            <img src="${p.img}" alt="${p.title}">
          </div>
          <div class="card__text">
            <h4 class="card__title">${p.title}</h4>
            <p class="card__description">${p.description}</p>
            <div class="card__footer button" role="button">
              <div>kaufen</div>
              <span>|</span>
              <p class="card__price">${p.price}€</p>
            </div>
          </div>
        </a>
      `;
      productsList.appendChild(card);
    });
  }, removeDelay);
}
function applyFilters() {
  const category = document.querySelector('input[name="category"]:checked')?.value || "all";
  const priceRadio = document.querySelector('input[name="price"]:checked')?.value || "all";
  const size = document.querySelector('input[name="size"]:checked')?.value || "all";
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "all";
  filteredProducts = allProducts.filter((p) => {
    const byCategory = category === "all" || p.category === category;
    let byPrice = true;
    if (priceRadio === "low") byPrice = p.price <= 30;
    else if (priceRadio === "mid") byPrice = p.price > 30 && p.price <= 60;
    else if (priceRadio === "high") byPrice = p.price > 60;
    const bySize = size === "all" || p.size === size;
    const byGender = gender === "all" || p.gender === gender;
    return byCategory && byPrice && bySize && byGender;
  });
  renderProducts(filteredProducts);
}
document.getElementById("filters-form").addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
  closeFilters();
});
openBtn.addEventListener("click", openFilters);
closeBtn.addEventListener("click", closeFilters);
overlay.addEventListener("click", closeFilters);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filters.classList.contains("filters--open")) {
    closeFilters();
  }
});
resetBtn.addEventListener("click", () => {
  filterForm.reset();
  applyFilters();
  closeFilters();
});
loadProducts();
