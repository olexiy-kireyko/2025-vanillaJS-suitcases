// utility function for draw stars in TopBest / exist & new review
export function stars(num, formEmptyStar = "empty") {
  const fullStarPath = "../assets/img/icons/star-full.svg";
  const emptyStarPath =
    formEmptyStar === "empty"
      ? "../assets/img/icons/star-empty.svg"
      : "../assets/img/icons/product_details_page/star-edge.svg";
  const resultHTMLText = [];
  const amountFullStar = Math.ceil(num / 20);

  for (let i = 0; i < 5; i++) {
    i <= amountFullStar
      ? resultHTMLText.push(`<li>
      <img src=${fullStarPath} alt="star-full" />
      </li>`)
      : resultHTMLText.push(`<li>
      <img src=${emptyStarPath} alt="star-empty" />
      </li>`);
  }
  return resultHTMLText.join("");
}

// utility function for check form elements values and show labels psevdo-elements (error messages)
export function checkFormValue(formElem, regex, labelId, hideLabel) {
  if (hideLabel === "hide-label") labelId.innerHTML = "";
  if (!regex.test(formElem.value)) {
    labelId.classList.add("error-value");
    return false;
  } else {
    labelId.classList.remove("error-value");
    return true;
  }
}
