// amount of suitcases on one page for  catalog_page
export const PER_PAGE = 12;

// time for showing pop-up message (delay) in ms
export const TIME_DELAY = 1500;

// contact us page - feedback form
export const USER_NAME_REGEX = /[A-Z]{1}[a-z]{1,30}/;
export const USER_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USER_TOPIC_REGEX = /[a-zA-Z0-9.,_%+-]{3,30}/;
export const USER_MESSAGE_REGEX = /[a-zA-Z0-9.,_%+!?@#&-]{10,300}/;
// modal - logIn form
export const USER_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).+$/;

// product details page - section "you may also like"
export const NUMBER_RANDOM_PRODUCTS = 4;

// cart page - min sum for discount, discount percent, shipping pay
export const MIN_SUM_DISCOUNT = 3000;
export const DISCOUNT_PERCENT = 10;
export const SHIPPING_PAY = 30;
