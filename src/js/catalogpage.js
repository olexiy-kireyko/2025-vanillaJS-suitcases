import {
  loadHTML,
  loadJSON,
  updateCartCounter,
  pageLinkColoration,
  addToCart,
  drawProducts,
  showMessage,
  showAuthorization,
  burger,
} from "./main.js";

import { stars } from "./utils.js";

import { PER_PAGE } from "./constants.js";

// load html-components (header, footer)
await loadHTML("header", "../components/header.html", true);
await loadHTML("footer", "../components/footer.html", true);

// default update cart counter in header
updateCartCounter();

// default update active page link coloration in header
await pageLinkColoration("catalog-page");

// active burger function
burger();

// pagination page numbers
const catalogPaginationPageList = document.getElementById(
  "catalog-pagination-page-list"
);

// pagination buttons
const nextPageButton = document.getElementById("next-page");
const prevPageButton = document.getElementById("prev-page");

// search product
const searchButton = document.getElementById("catalog-search-btn");
searchButton.addEventListener("click", searchProduct);

const searchInputElem = document.getElementById("catalog-search-input");

// textinfo about total AmountOfProducts and AmountOfProducts on page logic
const amountOfProductsText = document.getElementById("amount-of-products");

// define current page variable for pagination
let currentPageOfProductsList = 1;

//  draw on default  all products items in catalog section
let totalAmountOfProducts = await drawProducts(
  "catalog",
  "Add To Cart",
  "none",
  "none",
  "none",
  "none",
  1
);

// draw on default pages numbers
drawPagesNumbers(
  Math.ceil(totalAmountOfProducts / PER_PAGE),
  currentPageOfProductsList
);

//  update default textinfo about total AmountOfProducts and AmountOfProducts on page
updateAmountOfProductsText();

// draw default pages navigation buttons
showPageNavButtons();

// function to draw 3 TopBestSets from 'luggage sets' in minor column
export async function drawTopBestSets() {
  const mainData = await loadJSON(false);
  const topBestSets = mainData.filter(
    (item) => item.category === "luggage sets"
  );
  topBestSets.splice(3);
  const topBestSetsBox = document.getElementById("catalog-topbest-list");
  const resultHTMLText = topBestSets
    .map((item) => {
      item.imageUrl = "." + item.imageUrl;
      let starsRow = stars(item.popularity);
      return `<li class="catalog-topbest-item">
                    <img
                      class="catalog-topbest-img"
                      src=${item.imageUrl}
                      alt=${item.name}
                    />
                    <div class="catalog-topbest-info text-main">
                      <p class="">${item.name}</p>
                      <ul class="catalog-topbest-stars">
                        ${starsRow}
                      </ul>
                      <p>${item.price}</p>
                    </div>
                  </li>`;
    })
    .join("");

  topBestSetsBox.innerHTML = resultHTMLText;
}

// draw TopBest sets
drawTopBestSets();

// textinfo about total AmountOfProducts and AmountOfProducts on page logic
function updateAmountOfProductsText() {
  amountOfProductsText.textContent = `Showing ${
    (currentPageOfProductsList - 1) * PER_PAGE + 1
  }-${
    totalAmountOfProducts > currentPageOfProductsList * PER_PAGE
      ? PER_PAGE
      : totalAmountOfProducts
  } Of ${totalAmountOfProducts} Results`;
}

// --------- filtering and sortinglogic
//1 filter - category
const filterCategory = document.getElementById("catalog-category-wrapper");

//2 filter - color
const filterColor = document.getElementById("catalog-color-wrapper");

//3 filter - size
const filterSize = document.getElementById("catalog-size-wrapper");

//4 filter - salesStatus
const filterSalesStatus = document.getElementById(
  "catalog-salesStatus-wrapper"
);

// sort order
const sortOrder = document.getElementById("catalog-sortOrder-wrapper");

const arrayFiltersParents = [
  filterCategory,
  filterColor,
  filterSize,
  filterSalesStatus,
];

// add listeners for filters and sort parent element
[...arrayFiltersParents, sortOrder].map((item) => {
  item.addEventListener("click", selectFilter);
});

// collect all current filters & filters values, sorting order function
async function collectFiltersAndSortValue() {
  // collect and keep in arrays all current filters & filters values
  const filters = [];
  const filtersValues = [];
  arrayFiltersParents.map((parentElem) => {
    let text = parentElem.firstElementChild.textContent;
    if (!text.includes("Choose")) {
      if (text === "true") text = true;
      if (text === "false") text = false;
      filters.push(parentElem.dataset.filter);
      filtersValues.push(text);
    }
  });
  // read and keep current sorting order
  let sort = true;
  let sortValue = sortOrder.firstElementChild.textContent;
  if (sortValue === "Default Sorting") sort = "none";
  return [filters, filtersValues, sort, sortValue];
}

// ----------main function for filtering and sorting content
async function selectFilter(e) {
  const elem = e.target;
  const filterValue = elem.dataset.filterValue;
  if (filterValue === undefined) return;

  currentPageOfProductsList = 1;
  // change filter/sort value and style if "click" on li
  const parentElem = e.currentTarget;
  parentElem.firstElementChild.textContent = filterValue;
  parentElem.firstElementChild.classList.add("active");

  // collect all current filters & filters values, sorting order
  let filtersAndSortValues = await collectFiltersAndSortValue();

  // re-draw products depending on filter/sort values
  totalAmountOfProducts = await drawProducts(
    "catalog",
    "Add To Cart",
    ...filtersAndSortValues,
    currentPageOfProductsList
  );
  // re-draw new pages numbers
  drawPagesNumbers(
    Math.ceil(totalAmountOfProducts / PER_PAGE),
    currentPageOfProductsList
  );

  //  update textinfo about total AmountOfProducts and AmountOfProducts on page
  updateAmountOfProductsText();
  // update pages navigation buttons
  showPageNavButtons();
}

//  all filters and sort reset-button
const resetButton = document.getElementById("catalog-filters-reset");
resetButton.addEventListener("click", resetFiltersAndSort);

async function resetFiltersAndSort() {
  currentPageOfProductsList = 1;
  // change all current filters values on default
  arrayFiltersParents.map((parentElem) => {
    parentElem.firstElementChild.textContent =
      "Choose the " + parentElem.dataset.filter;
    parentElem.firstElementChild.style.textShadow = "none";
    parentElem.firstElementChild.style.background = "none";
  });

  // change sort current  value on default
  sortOrder.firstElementChild.textContent = "Default Sorting";
  sortOrder.firstElementChild.style.textShadow = "none";
  sortOrder.firstElementChild.style.background = "none";

  // re-draw default suitcase catalog
  totalAmountOfProducts = await drawProducts(
    "catalog",
    "Add To Cart",
    "none",
    "none",
    "none",
    "none",
    currentPageOfProductsList
  );

  // re-draw new pages numbers
  drawPagesNumbers(
    Math.ceil(totalAmountOfProducts / PER_PAGE),
    currentPageOfProductsList
  );
  //  update textinfo about total AmountOfProducts and AmountOfProducts on page
  updateAmountOfProductsText();
  // update pages navigation buttons
  showPageNavButtons();
}

// search product
export async function searchProduct() {
  const mainData = await loadJSON(false);
  let searchValue = searchInputElem.value;
  const searchedProduct = mainData.filter((item) => item.name === searchValue);
  // clear input and show message if product does not exist
  if (searchedProduct.length === 0) {
    searchValue = "";
    showMessage("error", "Product not found");
    return;
  }
  // update current id in Local Storage
  localStorage.setItem("currentId", searchedProduct[0].id);

  // re-flow to product card
  window.location.href = "./product-details-template.html";
}

// draw pages numbers with one active page
function drawPagesNumbers(totalPage, currentPage) {
  const pageArray = [];
  for (let i = 1; i <= totalPage; i++) {
    pageArray.push(
      `<li class="catalog-pagination-page-item ${
        i !== currentPage && "not-active"
      }">${i}</li>`
    );
  }
  catalogPaginationPageList.innerHTML = pageArray.join("");
}

// pagination
function showPageNavButtons() {
  totalAmountOfProducts > currentPageOfProductsList * PER_PAGE
    ? nextPageButton.classList.remove("hidden")
    : nextPageButton.classList.add("hidden");

  currentPageOfProductsList === 1
    ? prevPageButton.classList.add("hidden")
    : prevPageButton.classList.remove("hidden");
}

nextPageButton.addEventListener("click", goNextOrPrevPage);
prevPageButton.addEventListener("click", goNextOrPrevPage);

async function goNextOrPrevPage(e) {
  let step = -1;
  if (e.currentTarget.id === "next-page") step = 1;
  currentPageOfProductsList += step;

  // collect all current filters & filters values, sorting order
  let filtersAndSortValues = await collectFiltersAndSortValue();

  // re-draw products depending on filter/sort values
  totalAmountOfProducts = await drawProducts(
    "catalog",
    "Add To Cart",
    ...filtersAndSortValues,
    currentPageOfProductsList
  );

  // re-draw new pages numbers
  drawPagesNumbers(
    Math.ceil(totalAmountOfProducts / PER_PAGE),
    currentPageOfProductsList
  );

  //  update textinfo about total AmountOfProducts and AmountOfProducts on page
  updateAmountOfProductsText();

  // update pages navigation buttons
  showPageNavButtons();
}

// add to cart through 'click' on products logic
const catalog = document.getElementById("catalog");
catalog.addEventListener("click", addToCart);

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", showAuthorization);
