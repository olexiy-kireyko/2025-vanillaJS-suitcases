import {
  loadHTML,
  loadJSON,
  updateCartCounter,
  showMessage,
  showAuthorization,
  addToCart,
  burger,
} from "./main.js";

import { stars, checkFormValue } from "./utils.js";

import {
  USER_NAME_REGEX,
  USER_EMAIL_REGEX,
  USER_MESSAGE_REGEX,
  NUMBER_RANDOM_PRODUCTS,
} from "./constants.js";

// load html-components (header, footer)
await loadHTML("header", "../components/header.html", true);
await loadHTML("footer", "../components/footer.html", true);

// default update cart counter in header
updateCartCounter();

// active burger function
burger();

// get current product from LocalStorage and JSON-data
const currentId = localStorage.getItem("currentId");
const mainData = await loadJSON(false);
const currentProduct = await mainData.filter((item) => item.id == currentId)[0];

// load 'product-cart' template
await loadHTML("product-section", "../components/product-card.html", false);

// update product card info and image
const product_card_main_img = document.getElementById("product-card-main-img");
product_card_main_img.src = currentProduct.imageUrl.replace(
  /\.\/src\/assets/g,
  "../assets"
);
product_card_main_img.alt = currentProduct.name;

const product_card_info_name = document.getElementById(
  "product-card-info-name"
);
product_card_info_name.innerHTML = currentProduct.name;

const product_details_exist_header = document.getElementById(
  "product-details-exist-header"
);

product_details_exist_header.innerText = `1 review for ${currentProduct.name}`;

const product_card_stars = document.getElementById("product-card-stars");
product_card_stars.innerHTML = stars(currentProduct.popularity);

const product_reviews_stars = document.getElementById("product-reviews-stars");
product_reviews_stars.innerHTML = stars(currentProduct.popularity);

const product_card_info_price = document.getElementById(
  "product-card-info-price"
);
product_card_info_price.innerHTML = `$${currentProduct.price}`;

// --------- selects logic
//1 select - size
const product_size_wrapper = document.getElementById("product-size-wrapper");
//2 select - color
const product_color_wrapper = document.getElementById("product-color-wrapper");
//3 select - category
const product_category_wrapper = document.getElementById(
  "product-category-wrapper"
);

const arraySelectsParents = [
  product_size_wrapper,
  product_color_wrapper,
  product_category_wrapper,
];
// add listeners for select parent element
arraySelectsParents.map((item) => {
  item.addEventListener("click", selectOption);
});

async function selectOption(e) {
  const elem = e.target;
  const selectValue = elem.dataset.selectValue;
  if (selectValue === undefined) return;

  // change select value and style if "click" on li
  const parentElem = e.currentTarget;
  parentElem.firstElementChild.textContent = selectValue;
  parentElem.firstElementChild.classList.add("active");
}

// -------- "add to cart" logic
const product_card_cart_decrement = document.getElementById(
  "product-card-cart-decrement"
);
product_card_cart_decrement.addEventListener("click", productAmountDecrement);

const product_card_cart_counter = document.getElementById(
  "product-card-cart-counter"
);

const product_card_cart_increment = document.getElementById(
  "product-card-cart-increment"
);
product_card_cart_increment.addEventListener("click", productAmountIncrement);

const product_card_cart_addbtn = document.getElementById(
  "product-card-cart-addbtn"
);
product_card_cart_addbtn.addEventListener("click", productAddToCart);

function productAmountDecrement() {
  let count = +product_card_cart_counter.innerHTML;
  if (count === 1) return;
  product_card_cart_counter.innerText = count - 1;
}

function productAmountIncrement() {
  let count = +product_card_cart_counter.innerText;
  product_card_cart_counter.innerText = count + 1;
}

function productAddToCart() {
  let count = +product_card_cart_counter.innerText;
  let suitcasesInCart = JSON.parse(localStorage.suitcasesInCart);
  let productInCart = suitcasesInCart.find((item) => item.id === currentId);
  if (productInCart === undefined) {
    suitcasesInCart.push({
      id: currentId,
      amount: count,
    });
  } else {
    let index = suitcasesInCart.indexOf(productInCart);
    suitcasesInCart[index] = {
      id: currentId,
      amount: +productInCart.amount + count,
    };
  }
  localStorage.suitcasesInCart = JSON.stringify(suitcasesInCart);
  updateCartCounter();
}

// ---------- show different subsections (details) logic
// read subsections buttons
const product_details_btn = document.getElementById("product-details-btn");
const product_reviews_btn = document.getElementById("product-reviews-btn");
const product_shiping_btn = document.getElementById("product-shiping-btn");
const subsectionsButtons = [
  product_details_btn,
  product_reviews_btn,
  product_shiping_btn,
];
subsectionsButtons.map((item) =>
  item.addEventListener("click", showSubsection)
);
// read subsections
const product_subsection_details = document.getElementById(
  "product-subsection-details"
);
const product_subsection_reviews = document.getElementById(
  "product-subsection-reviews"
);
const product_subsection_shipping = document.getElementById(
  "product-subsection-shipping"
);
const subsections = [
  product_subsection_details,
  product_subsection_reviews,
  product_subsection_shipping,
];
// show/hide relevant subsections
function showSubsection(e) {
  const clickedButton = e.currentTarget;
  const index = subsectionsButtons.indexOf(clickedButton);
  if (!subsections[index].classList.contains("hidden")) return;

  subsections.map((item, i) => {
    if (i === index) item.classList.remove("hidden");
    else {
      item.classList.add("hidden");
    }
  });

  subsectionsButtons.map((item, i) => {
    if (i === index) item.classList.add("active");
    else {
      item.classList.remove("active");
    }
  });
}

// ---------- add new review logic
// change rating (stars)
const product_add_reviews_stars = document.getElementById(
  "product-add-reviews-stars"
);
product_add_reviews_stars.addEventListener("click", addReviewStars);

function addReviewStars(e) {
  const clickedStar = e.target;
  const childrenArray = Array.from(product_add_reviews_stars.children);
  const clickedLi = clickedStar.parentElement;
  const elemNumber = childrenArray.indexOf(clickedLi);
  product_add_reviews_stars.innerHTML = stars(elemNumber * 20, "edge");
}

//---form logic
const form = document.getElementById("review-form");

form.addEventListener("submit", formSubmit);
// submit form function
function formSubmit(e) {
  e.preventDefault();
  if (
    checkFormValue(user_name, USER_NAME_REGEX, user_name_label) &&
    checkFormValue(user_email, USER_EMAIL_REGEX, user_email_label) &&
    checkFormValue(user_message, USER_MESSAGE_REGEX, user_message_label)
  ) {
    form.reset();
    product_add_reviews_stars.innerHTML = stars(-20, "edge");

    showMessage("success", "Successed submit your review! Thank you!");
    user_name_label.innerHTML = `Your Name<span>*</span>`;
    user_email_label.innerHTML = `Your Email<span>*</span>`;
    user_message_label.innerHTML = `Your Review<span>*</span>`;
  }
}

// read required form fields and their labels
const user_name = document.getElementById("user-name");
const user_name_label = document.getElementById("user-name-label");
user_name.addEventListener("input", () =>
  checkFormValue(user_name, USER_NAME_REGEX, user_name_label, "hide-label")
);

const user_email = document.getElementById("user-email");
const user_email_label = document.getElementById("user-email-label");
user_email.addEventListener("input", () =>
  checkFormValue(user_email, USER_EMAIL_REGEX, user_email_label, "hide-label")
);

const user_message = document.getElementById("user-message");
const user_message_label = document.getElementById("user-message-label");
user_message.addEventListener("input", () =>
  checkFormValue(
    user_message,
    USER_MESSAGE_REGEX,
    user_message_label,
    "hide-label"
  )
);

// ----------- draw 4 random products in section "You May Also Like"
const product_also_like_list = document.getElementById(
  "product-also-like-list"
);
product_also_like_list.addEventListener("click", addToCart);

// draw products  card (all, filtered, sorted, paginated)
export async function drawRandomProducts(
  parentId,
  buttonText,
  resultNumberOfProducts,
  isHomePage = false
) {
  // load main JSON data
  const mainData = await loadJSON(isHomePage);
  let resultHtmlText;
  let rawHtmlText = mainData;

  const totalAmountOfProducts = mainData.length;

  //search random products without repeated numbers
  const randomNumbersArray = [];
  for (let i = 0; i < resultNumberOfProducts; ) {
    const number = Math.floor(Math.random() * totalAmountOfProducts);
    if (randomNumbersArray.includes(number)) continue;
    randomNumbersArray.push(number);
    i++;
  }

  rawHtmlText = rawHtmlText.filter((item, i) => randomNumbersArray.includes(i));

  resultHtmlText = rawHtmlText
    .map((item) => {
      //trunk long name
      if (item.name.length > 35) {
        item.name = item.name.slice(0, 34) + "...";
      }
      //change path if page is not homepage
      if (!isHomePage) {
        item.imageUrl = "." + item.imageUrl;
      }

      return `<li class="selected-products-item">
    <img src=${item.imageUrl} alt=${item.name} />
    <p class="header-nav-text selected-products-name">${item.name}</p>
    <p class="header-nav-text selected-products-price">$${item.price}</p>
    <a data-id=${item.id} class="button selected-products-addbutton" href="${
        !isHomePage
          ? "./product-details-template.html"
          : "./pages/product-details-template.html"
      }">
      ${buttonText}
    </a>${
      item.salesStatus
        ? `<p class="button selected-products-sale-shortcut">SALE</p>`
        : ""
    }
  </li>`;
    })
    .join("");

  document.getElementById(parentId).innerHTML = resultHtmlText;
}

drawRandomProducts(
  "product-also-like-list",
  "Add To Cart",
  NUMBER_RANDOM_PRODUCTS
);

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", showAuthorization);
