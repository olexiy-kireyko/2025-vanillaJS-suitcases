import {
  loadHTML,
  showAuthorization,
  updateCartCounter,
  pageLinkColoration,
  burger,
} from "./main.js";

// load html-components (header, footer)
await loadHTML("header", "../components/header.html", true);
await loadHTML("footer", "../components/footer.html", true);

// default update cart counter in header
updateCartCounter();

// default update active page link coloration in header
await pageLinkColoration("about-us-page");

// active burger function
burger();

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", showAuthorization);
