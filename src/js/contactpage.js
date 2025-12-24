import {
  loadHTML,
  updateCartCounter,
  pageLinkColoration,
  showMessage,
  showAuthorization,
  burger,
} from "./main.js";

import {
  USER_NAME_REGEX,
  USER_EMAIL_REGEX,
  USER_TOPIC_REGEX,
  USER_MESSAGE_REGEX,
} from "./constants.js";

import { checkFormValue } from "./utils.js";

// load html-components (header, footer)
await loadHTML("header", "../components/header.html", true);
await loadHTML("footer", "../components/footer.html", true);

// default update cart counter in header
updateCartCounter();

// default update active page link coloration in header
await pageLinkColoration("contact-us-page");

// active burger function
burger();

//----------form logic
const form = document.getElementById("contact-form");

form.addEventListener("submit", formSubmit);
// submit form function
function formSubmit(e) {
  e.preventDefault();
  const nameCheck = checkFormValue(user_name, USER_NAME_REGEX, user_name_label);

  const emailCheck = checkFormValue(
    user_email,
    USER_EMAIL_REGEX,
    user_email_label
  );

  const topicCheck = checkFormValue(
    user_topic,
    USER_TOPIC_REGEX,
    user_topic_label
  );

  const messageCheck = checkFormValue(
    user_message,
    USER_MESSAGE_REGEX,
    user_message_label
  );

  if (nameCheck && emailCheck && topicCheck && messageCheck) {
    form.reset();
    showMessage("success", "Successed submit your feedback! Thank you!");
  }
}

// read all form fields and their labels
const user_name = document.getElementById("user-name");
const user_name_label = document.getElementById("user-name-label");
user_name.addEventListener("input", () =>
  checkFormValue(user_name, USER_NAME_REGEX, user_name_label)
);

const user_email = document.getElementById("user-email");
const user_email_label = document.getElementById("user-email-label");
user_email.addEventListener("input", () =>
  checkFormValue(user_email, USER_EMAIL_REGEX, user_email_label)
);

const user_topic = document.getElementById("user-topic");
const user_topic_label = document.getElementById("user-topic-label");
user_topic.addEventListener("input", () =>
  checkFormValue(user_topic, USER_TOPIC_REGEX, user_topic_label)
);

const user_message = document.getElementById("user-message");
const user_message_label = document.getElementById("user-message-label");
user_message.addEventListener("input", () =>
  checkFormValue(user_message, USER_MESSAGE_REGEX, user_message_label)
);

// authorization modal window
const header_user_login = document.getElementById("header-user-login");
header_user_login.addEventListener("click", showAuthorization);
