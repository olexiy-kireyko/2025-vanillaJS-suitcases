import {
  loadHTML,
  updateCartCounter,
  pageLinkColoration,
  addToCart,
  drawProducts,
  showAuthorization,
  burger,
} from "./main.js";

// load html-components (header, footer)
await loadHTML("header", "./src/components/header.html");
await loadHTML("footer", "./src/components/footer.html");

// update cart counter in header
updateCartCounter();

// active page link coloration in header
await pageLinkColoration("home-page");

// active burger function
burger();

// -------carousel logic
const carousel = document.getElementById("carousel");
let prevbtn = document.getElementById("carousel-navbtn-prev");
let nextbtn = document.getElementById("carousel-navbtn-next");
// scroll step
let step = 300;

prevbtn.addEventListener("click", prevClick);
nextbtn.addEventListener("click", nextClick);

function nextClick() {
  prevbtn.classList.remove("nav-button-disabled");
  carousel.scrollLeft += step;

  const isAtEnd =
    carousel.scrollLeft + carousel.clientWidth + step + 1 >=
    carousel.scrollWidth;
  if (isAtEnd) {
    nextbtn.classList.add("nav-button-disabled");
  }
}

function prevClick() {
  nextbtn.classList.remove("nav-button-disabled");
  carousel.scrollLeft -= step;
  const isAtEnd = carousel.scrollLeft <= step;
  if (isAtEnd) {
    prevbtn.classList.add("nav-button-disabled");
  }
}

// draw selected_products section items
drawProducts(
  "selected-products-list",
  "Add To Cart",
  "blocks",
  "Selected Products",
  "none",
  "none",
  null,
  true
);

// add to cart from selected_products section items logic
const selectedProductsList = document.getElementById("selected-products-list");
selectedProductsList.addEventListener("click", addToCart);

// draw new_products section items
drawProducts(
  "new-products-list",
  "View Product",
  "blocks",
  "New Products Arrival",
  "none",
  "none",
  null,
  true
);

// event listener "click" on "View Product" in new_products section
const new_products_list = document.getElementById("new-products-list");
new_products_list.addEventListener("click", updateCurrentProduct);

function updateCurrentProduct(e) {
  const elem = e.target;
  if (elem.dataset.id === undefined) return;
  const id = elem.dataset.id;
  localStorage.setItem("currentId", id);
}

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", (e) => showAuthorization(e, true));
