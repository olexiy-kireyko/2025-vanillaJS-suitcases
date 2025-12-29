import {
  loadHTML,
  loadJSON,
  updateCartCounter,
  showMessage,
  showAuthorization,
  burger,
} from "./main.js";

import {
  MIN_SUM_DISCOUNT,
  DISCOUNT_PERCENT,
  SHIPPING_PAY,
} from "./constants.js";

// load html-components (header, footer)
await loadHTML("header", "../components/header.html", true);
await loadHTML("footer", "../components/footer.html", true);

// default update cart counter in header
updateCartCounter();

// active burger function
burger();

// draw main table logic
const cart_main_table_body = document.getElementById("cart-main-table-body");
const cart_main_table = document.getElementById("cart-main-table");
const cart_clear = document.getElementById("cart-clear");

async function drawMainTable(isCheckout = false) {
  let suitcasesInCartJSON = localStorage.suitcasesInCart;

  if (suitcasesInCartJSON === undefined) {
    if (isCheckout) {
      showMessage("error", "Thank you for your purchase.");
    } else {
      showMessage(
        "error",
        "Your cart is empty. Use the catalog to add new items."
      );
    }
    cart_main_table.classList.add("hidden");
    cart_clear.classList.add("hidden");
  } else {
    const mainData = await loadJSON(false);
    const suitcasesInCart = JSON.parse(suitcasesInCartJSON);
    const resultHTML = suitcasesInCart
      .map((item) => {
        const id = item.id;
        const currentProduct = mainData.find((item) => item.id === id);
        currentProduct.imageUrl = currentProduct.imageUrl.replace(
          /\.\/src\/assets/g,
          "../assets"
        );
        return ` <tr>
                  <td><img src=${currentProduct.imageUrl} alt=${
          currentProduct.name
        } width="120" /></td>
                  <td>${currentProduct.name}</td>
                  <td>$ ${currentProduct.price}</td>
                  <td>
                    <div class="cart-counter-box">
                      <button
                        data-id=${currentProduct.id}
                        data-action="decrement"
                        class="cart-increment"
                        type="button"
                      >
                        -
                      </button>
                      <p data-product-id=${
                        currentProduct.id
                      } class="cart-counter">${item.amount}</p>
                      <button
                        data-id=${currentProduct.id}
                        data-action="increment"
                        class="cart-increment"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>$${currentProduct.price * item.amount}</td>
                  <td>
                    <img
                      data-id=${currentProduct.id}
                      data-action="remove"
                      class="cart-garbage"
                      src="../assets/img/icons/cart_page/garbage.svg"
                      alt="cart-garbage"
                    />
                  </td>
                </tr>`;
      })
      .join("");

    cart_main_table_body.innerHTML = resultHTML;
  }
}

// draw default main table from LocalStorage
await drawMainTable();

// event "click on tbody" processing
cart_main_table_body.addEventListener("click", actionsWithProduct);

async function actionsWithProduct(e) {
  const elem = e.target;
  if (elem.dataset.id === undefined) return;
  const id = elem.dataset.id;
  const suitcasesInCart = JSON.parse(localStorage.suitcasesInCart);
  let newSuitcasesInCart;
  // decrement action
  if (elem.dataset.action === "decrement") {
    newSuitcasesInCart = suitcasesInCart.map((item) => {
      if (item.id === id) {
        if (item.amount === 1) return item;
        else {
          item.amount -= 1;
        }
      }
      return item;
    });
  }
  // increment action
  if (elem.dataset.action === "increment") {
    newSuitcasesInCart = suitcasesInCart.map((item) => {
      if (item.id === id) {
        item.amount += 1;
      }
      return item;
    });
  }
  // remove action
  if (elem.dataset.action === "remove") {
    if (suitcasesInCart.length === 1) {
      localStorage.removeItem("suitcasesInCart");
      return;
    } else {
      newSuitcasesInCart = suitcasesInCart.filter((item) => item.id !== id);
    }
  }
  // udate Local Storage
  localStorage.suitcasesInCart = JSON.stringify(newSuitcasesInCart);
  //  re-draw main & total tables and update cart couter
  await drawMainTable();
  updateCartCounter();
  await drawTotalTable();
}

// draw total table logic
const cart_total_table = document.getElementById("cart-total-table");

async function drawTotalTable() {
  let suitcasesInCartJSON = localStorage.suitcasesInCart;
  if (suitcasesInCartJSON === undefined) {
    const cart_total_table_box = document.getElementById(
      "cart-total-table-box"
    );
    cart_total_table_box.classList.add("hidden");
    return;
  }

  const mainData = await loadJSON(false);
  let resultHTML;
  let suitcasesInCart = JSON.parse(suitcasesInCartJSON);

  const subTotal = suitcasesInCart.reduce((acc, item) => {
    const currentProduct = mainData.find((product) => product.id === item.id);
    return (acc += item.amount * currentProduct.price);
  }, 0);

  const discount =
    subTotal >= MIN_SUM_DISCOUNT ? Math.floor(subTotal / DISCOUNT_PERCENT) : 0;

  const total = subTotal + SHIPPING_PAY - discount;

  resultHTML = `  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td>$ ${subTotal}</td>
                    </tr>

                    ${
                      discount > 0
                        ? `<tr>
                      <td>Discount</td>
                      <td>$ ${discount}</td>
                    </tr>`
                        : ""
                    }

                    <tr>
                      <td>Shipping</td>
                      <td>$ ${SHIPPING_PAY}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td>$ ${total}</td>
                    </tr>
                  </tfoot>`;

  cart_total_table.innerHTML = resultHTML;
}

await drawTotalTable();

// clear cart button
cart_clear.addEventListener("click", cartClear);

async function cartClear() {
  localStorage.removeItem("suitcasesInCart");

  await drawMainTable();
  await drawTotalTable();
  updateCartCounter();
}

// cart checkout button
const cart_checkout = document.getElementById("cart-checkout");
cart_checkout.addEventListener("click", cartCheckout);

async function cartCheckout() {
  localStorage.removeItem("suitcasesInCart");

  await drawMainTable(true);
  await drawTotalTable();
  updateCartCounter();
}

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", showAuthorization);
