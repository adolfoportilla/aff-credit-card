// TODO: Add schema validation.
// const Joi = require("@hapi/joi");

/**
 * Constants
 */
const types = Object.freeze({
  AMEX: "AMEX",
  VISA: "VISA",
  DEFAULT: ""
});
const d = new Date();
const currentMonth = d.getMonth();
const currentYear = d.getFullYear();

// const compose = (...functions) => args =>
// functions.reduceRight((arg, fn) => fn(arg), args);

//Shared validators accross cards

/**
 * Checks if expiration is after current month and year.
 *  i.e. 10 / 19 => false.
 *  i.e. 11 / 19 => true.
 *  i.e. 01 / 29 => true.
 *
 * @param {string} exp - Expiration in format "MM / YY"
 * @returns {boolean} Validity of expiration
 *
 * Note: Can take advantage of function composition here and make
 * this function more readable.
 */
const isValidExpiry = (exp = "") => {
  if (exp.length < 7) {
    return false;
  }
  let month = parseInt(exp.substr(0, 2));
  let year = 2000 + parseInt(exp.substr(5));
  if (year < currentYear) {
    return false;
  }
  // If its the current year, make sure the month is after current one.
  if (year === currentYear && month <= currentMonth + 1) {
    return false;
  }
  if (month < 1 || month > 12) {
    return false;
  }
  return true;
};

/**
 *
 * @param {name} name - Name
 * @returns {boolean} if string is valid
 *
 */
const isValidName = (name = "") => name.length > 0;

/**
 * Formats a credit card number with spaces every 4 characters.
 * i.e. "12345" => "1234 5"
 * i.e. "1234 12345" => "1234 1234 5"
 *
 * @param {string} num - Credit card number.
 * @returns {string} Number formatted with spaces after 4 chars.
 */
const formatNumberDefault = num => {
  let formattedText = num.split(" ").join("");
  if (formattedText.length > 0) {
    // Splits a string every 4 chars and joins them by a space.
    // i.e "12345" => "1234 5"
    // i.e "1234123412" => "1234 1234 12"
    formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ");
  }
  return formattedText;
};

/**
 * Formats a credit card number with spaces after each group of (4,5,6) characters.
 * i.e. "12345" => "1234 5"
 * i.e. "1234 123456" => "1234 12345 6"
 *
 * @param {string} num - Credit card number.
 * @returns {string} Number formatted with spaces after 4 chars.
 */
const formatNumberAmex = num => {
  let formattedText = num.split(" ").join("");
  if (formattedText.length > 0) {
    // Splits a string after 4, 5, and 6 chars.
    // i.e "12345" => ["1234", "5"]
    // i.e "12345678901" => ["1234", "56789", "01"]
    let regex = /([\d?]{1,4})([\d]{0,5})([\d]{0,6})/g;
    let regexResult = regex.exec(formattedText);
    formattedText = regexResult
      .slice(1, 4)
      .join(" ")
      .trim();
  }
  return formattedText;
};

/**
 * Formats an expiration "MMYY" => "MM / YY".
 * i.e. "12" => "12"
 * i.e. "1219" => "12 / 19"
 * i.e. "12 / " => "12"
 * i.e. "12 /" => "12"
 *
 * @param {string} exp - Expiration MMYY.
 * @returns {string} Expiration formatted with " / " between month and year.
 */
const formatExpiry = exp => {
  let formattedText = exp.split(" / ").join("");

  // This is for autofills that include MM/YYYY. It splits correctly the
  // months and the years.
  if (exp.length === 7) {
    exp = exp.split("/");
    exp = exp[0] + " / " + exp[1].substr(2);
    return exp;
  }

  // Remove the " / " if the user deletes the year
  // i.e. "03 / " => "03"
  // i.e. "12 /" => "12"
  if (exp.length === 5 || exp.length === 4) {
    exp = exp
      .trim()
      .split("/")
      .join("")
      .trim();
    // This is for autocomplete to work correctly. The issue is that if
    // the autocomplete fills four numbers, I need to split the numbers.
    // The other scenario of length 4 is when the users deletes the year.
    if (exp.length === 4) {
      exp = exp.match(new RegExp(".{1,2}", "g")).join(" / ");
    }
    return exp;
  }
  if (formattedText.length > 0) {
    // Pre append 0 if the user enters a digit greater than 1.
    // i.e 2 => 02
    // i.e 3 => 03
    if (formattedText.length === 1 && formattedText > 1) {
      formattedText = "0" + formattedText + " / ";
    } else if (formattedText.length === 2) {
      formattedText = formattedText + " / "; // append " / " after 2 digits
    } else {
      // Split string every 2 characters and join with " / "
      formattedText = formattedText
        .match(new RegExp(".{1,2}", "g"))
        .join(" / ");
    }
  }
  return formattedText;
};

/**
 * Function that validates credit card number.
 * Right now is simple and returns true if its 16 chars long.
 *
 * @param {string} number - Credit card number
 * @returns {boolean} true if 16 chars long.
 */
const isValidNumberDefault = (number = "") =>
  number.split(" ").join("").length === 16;

/**
 * Properties to share amongs different cards.
 */
const validatorsSharedDefaults = {
  expiryMaxLength: 7, // "MM / YY"
  formatExpiry,
  formatNumber: formatNumberDefault,
  isValidExpiry,
  isValidName,
  isValidNumber: isValidNumberDefault,
  nameMaxLength: 30, // Arbitrary, can change to anything
  numberLength: 19 // 16 numbers + 3 spaces.
};

/**
 * Card validators for different credit cards. Each card specifies how to validate
 * input.
 * There is a default card validator that can be set to any format.
 *
 * Current supported cards are AMEX and VISA.
 */
const validators = {
  [types.AMEX]: {
    type: types.AMEX,
    ...validatorsSharedDefaults,
    CVCLength: 4,
    numberLength: 17, // 15 chars + 2 spaces.
    isCardType: (s = "") => ["34", "37"].includes(s.substr(0, 2)), // Can also add here regex for the specific card to make it more real.
    isValidCardType: () => true,
    isValidCVC: (cvc = "") => cvc.length === 4,
    isValidNumber: (number = "") => number.split(" ").join("").length === 15,
    formatNumber: formatNumberAmex
  },
  [types.VISA]: {
    type: types.VISA,
    ...validatorsSharedDefaults,
    CVCLength: 3,
    isCardType: (s = "") => s.substr(0, 1) === "4",
    isValidCardType: () => true,
    isValidCVC: (cvc = "") => cvc.length === 3,
    isValidNumber: (number = "") => number.split(" ").join("").length === 16
  },
  [types.DEFAULT]: {
    type: types.DEFAULT,
    ...validatorsSharedDefaults,
    CVCLength: 4,
    isCardType: () => true,
    isValidCardType: () => false,
    isValidCVC: (cvc = "") => cvc.length === 4
  }
};

// Validate schema with joi!
// TODO: not working.
// Can validate schema to make sure all cards have all properties
// implemented correctly.
/*
let cardSchema = Joi.object().keys({
  type: Joi.string(),
  isCardType: Joi.string(),
  isValidNumber: Joi.string(),
  validCVV: Joi.string()
});
const schema = Joi.array().items(cardSchema);
schema.validate(validators);
*/

export default {
  validators,
  types
};
