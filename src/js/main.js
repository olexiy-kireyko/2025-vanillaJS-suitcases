import {
  USER_EMAIL_REGEX,
  USER_PASSWORD_REGEX,
  PER_PAGE,
  TIME_DELAY,
} from "./constants.js";

import { checkFormValue } from "./utils.js";

// load html-components logic (with caching from SessionStorage)
export async function loadHTML(id, url, isChangePath) {
  let text;
  const cached = sessionStorage.getItem(id);
  if (cached) {
    text = cached;
  } else {
    const res = await fetch(url);
    text = await res.text();
    sessionStorage.setItem(id, text);
  }

  if (isChangePath !== undefined) {
    // change path if page is not homepage
    text = text.replace(/\.\/assets/g, "../assets");
    text = text.replace(/\.\/index\.html/g, "../index.html");
    text = text.replace(/\.\/pages\//g, "./");
  }
  document.getElementById(id).innerHTML = text;
}

// update cart counter in header logic
export function updateCartCounter() {
  let cartCounter = document.getElementById("cart-counter");
  let suitcasesInCartJSON = localStorage.suitcasesInCart;
  if (suitcasesInCartJSON === undefined) {
    cartCounter.textContent = "";
    cartCounter.classList.remove("header-usermenu-counter");
    return;
  }

  let suitcasesInCart = JSON.parse(suitcasesInCartJSON);
  cartCounter.textContent = suitcasesInCart.reduce(
    (acc, item) => (acc += +item.amount),
    0
  );
  cartCounter.classList.add("header-usermenu-counter");
}

// active page link coloration in header
export async function pageLinkColoration(pageName) {
  const pageLink = document.getElementById(pageName);
  pageLink.classList.add("header-nav-item-active");
}

// load json-data logic
export async function loadJSON(isHomePage) {
  let path = isHomePage ? "./assets/data.json" : "../assets/data.json";
  const res = await fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid network response ");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch operation problem:", error);
    });
  return res.data;
}

// homepage&other page "add a product to cart" logic
export async function addToCart(e) {
  const elem = e.target;
  if (elem.dataset.id === undefined) return;
  const id = elem.dataset.id;

  localStorage.setItem("currentId", id);

  let suitcasesInCartJSON = localStorage.suitcasesInCart;
  let suitcasesInCart;

  if (suitcasesInCartJSON === undefined) {
    suitcasesInCart = [{ id, amount: 1 }];
  } else {
    suitcasesInCart = JSON.parse(suitcasesInCartJSON);
    let productInCart = suitcasesInCart.find((item) => item.id === id);
    let index = suitcasesInCart.indexOf(productInCart);

    if (productInCart !== undefined) {
      suitcasesInCart.splice(index, 1, {
        id,
        amount: +productInCart.amount + 1,
      });
    } else {
      suitcasesInCart.push({ id, amount: 1 });
    }
  }
  localStorage.suitcasesInCart = JSON.stringify(suitcasesInCart);

  updateCartCounter();
}

// draw products  card (all, filtered, sorted, paginated)
export async function drawProducts(
  parentId,
  buttonText,
  filters,
  filtersValues,
  sort,
  sortValue,
  pageNumber = null,
  isHomePage = false
) {
  // load main JSON data
  const mainData = await loadJSON(isHomePage);
  let resultHtmlText;
  let rawHtmlText = mainData;

  //main filter block
  if (filters !== "none") {
    if (filters === "blocks") {
      rawHtmlText = rawHtmlText.filter((item) =>
        item.blocks.includes(filtersValues)
      );
    } else {
      for (let i = 0; i < filters.length; i++) {
        rawHtmlText = rawHtmlText.filter(
          (item) => item[filters[i]] === filtersValues[i]
        );
      }
    }
  }
  //sort block
  if (sort !== "none") {
    if (sortValue === "fromLowestPrice")
      rawHtmlText.sort((a, b) => +a.price - +b.price);
    if (sortValue === "fromHighestPrice")
      rawHtmlText.sort((a, b) => +b.price - +a.price);
    if (sortValue === "fromMostPopular")
      rawHtmlText.sort((a, b) => +b.popularity - +a.popularity);
    if (sortValue === "fromHighestRating")
      rawHtmlText.sort((a, b) => +b.rating - +a.rating);
  }

  const totalAmountOfProducts = rawHtmlText.length;

  //pagination block
  if (pageNumber !== null) {
    rawHtmlText.splice(0, (pageNumber - 1) * PER_PAGE);
    rawHtmlText.splice(pageNumber * PER_PAGE);
  }

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

  // show message if not found products
  if (!resultHtmlText) showMessage("error", "Product not found");

  document.getElementById(parentId).innerHTML = resultHtmlText;

  return totalAmountOfProducts;
}

// pop-up message function for different pages
export function showMessage(type, text) {
  //<type> enum: ['error', 'success]
  const message = `<div class="message-box">
        <div class="text-main message ${type}">${text}</div>
      </div>`;
  document.body.insertAdjacentHTML("afterbegin", message);

  setTimeout(() => {
    document.body.firstElementChild.remove();
  }, TIME_DELAY);
}

// authorization modal window function for different pages
export async function showAuthorization(e, isHomePage = false) {
  const closed_eye_path = isHomePage
    ? "./assets/img/icons/modal_auth/closed_eye.svg"
    : "../assets/img/icons/modal_auth/closed_eye.svg";
  const opened_eye_path = isHomePage
    ? "./assets/img/icons/modal_auth/opened_eye.svg"
    : "../assets/img/icons/modal_auth/opened_eye.svg";
  const check_mark_path = isHomePage
    ? "./assets/img/product_details_page/check-mark.png"
    : "../assets/img/product_details_page/check-mark.png";

  const modalWindow = ` <div class="message-box modal-box">
      <div class="modal">
        <form id="modal-form" class="form" enctype="text/plain" novalidate>
          <label
            for="modal-email-label"
            id="modal-email-label"
            class="text-main error-modal-email"
            >Email Address <span>*</span></label
          ><input name="modal-email" type="email" id="modal-email" required />

          <label
            for="modal-password-label"
            id="modal-password-label"
            class="text-main error-modal-password modal-password"
            >Password <span>*</span>
            <img
              id="modal-password-closed-eye"
              class="modal-password-eye"
              src=${closed_eye_path}
              alt="closed-eye" />
            <img
              id="modal-password-opened-eye"
              class="modal-password-eye modal-password-opened-eye hidden"
              src=${opened_eye_path}
              alt="opened-eye" /></label
          ><input
            name="modal-password"
            id="modal-password"
            type="password"
            required
          />

          <div class="modal-btnbox">
            <label
              for="modal-remember"
              id="modal-remember-label"
              class="text-main modal-remember-label"
            >
              <input
                type="checkbox"
                name="modal-remember"
                id="modal-remember"
              />
              <div class="modal-remember-custombox">
                <img
                  class="modal-remember-icon"
                  src=${check_mark_path}
                  alt="check save info"
                  width="16"
                  height="16"
                />
              </div>
              Remember me
            </label>

            <button
              id="modal-password-forgetbtn"
              class="modal-password-forgetbtn"
            >
              Forgot Your Password?
            </button>
          </div>
          <button id="modal-password-submitbtn" class="button" type="submit">
            LOG IN
          </button>
        </form>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("afterbegin", modalWindow);

  // show/hide password in modal window LogIn
  const modal_password_closed_eye = document.getElementById(
    "modal-password-closed-eye"
  );
  const modal_password_opened_eye = document.getElementById(
    "modal-password-opened-eye"
  );
  const modal_password = document.getElementById("modal-password");

  modal_password_closed_eye.addEventListener("click", showPassword);
  modal_password_opened_eye.addEventListener("click", hidePassword);

  function showPassword() {
    modal_password.type = "text";
    modal_password_closed_eye.classList.add("hidden");
    modal_password_opened_eye.classList.remove("hidden");
  }

  function hidePassword() {
    modal_password.type = "password";
    modal_password_opened_eye.classList.add("hidden");
    modal_password_closed_eye.classList.remove("hidden");
  }

  // LogIn submit logic
  const modal_form = document.getElementById("modal-form");
  const modal_email_label = document.getElementById("modal-email-label");
  const modal_email = document.getElementById("modal-email");
  const modal_password_label = document.getElementById("modal-password-label");
  modal_form.addEventListener("submit", logIn);

  modal_email.addEventListener("input", () =>
    checkFormValue(modal_email, USER_EMAIL_REGEX, modal_email_label)
  );

  modal_password.addEventListener("input", () =>
    checkFormValue(modal_password, USER_PASSWORD_REGEX, modal_password_label)
  );

  function logIn(e) {
    e.preventDefault();

    const emailCheck = checkFormValue(
      modal_email,
      USER_EMAIL_REGEX,
      modal_email_label
    );
    const passwordCheck = checkFormValue(
      modal_password,
      USER_PASSWORD_REGEX,
      modal_password_label
    );

    if (emailCheck && passwordCheck) {
      modal_form.reset();
      document.body.firstElementChild.remove();
      showMessage("success", "Successfully Log In!");
    }
  }

  // password_forget button (require enter valid email before)
  const modal_password_forgetbtn = document.getElementById(
    "modal-password-forgetbtn"
  );
  modal_password_forgetbtn.addEventListener("click", passwordForget);

  async function passwordForget(e) {
    e.preventDefault();
    const emailCheck = checkFormValue(
      modal_email,
      USER_EMAIL_REGEX,
      modal_email_label
    );
    if (emailCheck) {
      modal_form.reset();
      document.body.firstElementChild.remove();
      showMessage("success", "Your password sent to your email!");
      setTimeout(() => {
        showAuthorization();
      }, TIME_DELAY + 100);
    }
  }
}

// show/hide nav menu through clicking on "burger"/"closeBUTTON" on mobile devices
export function burger() {
  const header_burger = document.getElementById("header-burger");
  header_burger.addEventListener("click", openBurgerMenu);
  const header_nav = document.getElementById("header-nav");
  const header_nav_slose = document.getElementById("header-nav-slose");
  header_nav_slose.addEventListener("click", closeBurgerMenu);

  function openBurgerMenu() {
    header_nav.classList.add("active");
  }

  function closeBurgerMenu() {
    header_nav.classList.remove("active");
  }
}
