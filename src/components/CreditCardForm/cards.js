// TODO: Add schema validation.
// const Joi = require("@hapi/joi");

const d = new Date();
const currentMonth = d.getMonth();
const currentYear = d.getFullYear();
const last2Year = currentYear.toString().substr(2);

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
const isValidName = (name = "") =>
  name.length > 0 && name.length <= DEFAULT_NAME_LENGTH;

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
 * Formats a credit card number with spaces after each group of (4,6,5) characters.
 * i.e. "12345" => "1234 5"
 * i.e. "1234 1234567" => "1234 123456 7"
 *
 * @param {string} num - Credit card number.
 * @returns {string} Number formatted with spaces after 4 chars.
 */
const formatNumberAmex = num => {
  let formattedText = num.split(" ").join("");
  if (formattedText.length > 0) {
    // Splits a string after 4, 6, and 5 chars.
    // i.e "12345" => ["1234", "5"]
    // i.e "12345678901" => ["1234", "567890", "01"]
    let regex = /([\d?]{1,4})([\d]{0,6})([\d]{0,5})/g;
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
 * i.e. "12" => "12 / "
 * i.e. "12/2019" => "12 / 19"
 * i.e. "1219" => "12 / 19"
 * i.e. "12 / " => "12"
 *
 * @param {string} exp - Expiration MMYY.
 * @returns {string} Expiration formatted with " / " between month and year.
 */
const formatExpiry = exp => {
  let formattedText = exp.split(" / ").join("");

  // This is for autofills that include MM/YYYY. It splits correctly the
  // months and the years.
  if (formattedText.length === 7) {
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
 * Supported card types.
 *
 * Note: To add another card:
 * - Add it to the types object
 * - Add type in the validators object. Make sure to extend the validatorsSharedDefault
 *    and then override any functions that are different.
 */
const types = Object.freeze({
  AMEX: "AMEX",
  VISA: "VISA",
  DEFAULT: ""
});

const DEFAULT_NAME_LENGTH = 30; // Can change to anything
const DEFAULT_NUMBER_LENGTH = 19; // 16 numbers + 3 spaces.
const DEFAULT_EXPIRY_LENGTH = 7; // "MM / YY"
const DEFAULT_CVC_LENGTH = 4;

/**
 * Properties to share amongs different cards.
 */
const validatorsSharedDefaults = {
  CVCLength: DEFAULT_CVC_LENGTH,
  expirationDate: `${currentMonth}/${last2Year}`,
  expiryMaxLength: DEFAULT_EXPIRY_LENGTH,
  formatExpiry,
  formatNumber: formatNumberDefault,
  isCardType: () => true,
  isCVCComplete: (l = "") => l.length === DEFAULT_CVC_LENGTH,
  isExpiryComplete: (l = "") => l.length === DEFAULT_EXPIRY_LENGTH,
  isNumberComplete: (l = "") => l.length === DEFAULT_NUMBER_LENGTH,
  isValidCardType: () => false,
  isValidCVC: (l = "") => l.length === DEFAULT_CVC_LENGTH,
  isValidExpiry,
  isValidName,
  isValidNumber: isValidNumberDefault,
  nameMaxLength: DEFAULT_NAME_LENGTH,
  numberLength: DEFAULT_NUMBER_LENGTH
};

/**
 * Card validators for different credit cards. Each card type can specify
 * how to validate input.
 * When adding a type, make sure to spread the validatorsSharedDefaults
 * and override any functions you want to change.
 *
 * Current supported cards are AMEX and VISA.
 */
const validators = {
  [types.AMEX]: {
    type: types.AMEX,
    ...validatorsSharedDefaults,
    formatNumber: formatNumberAmex,
    isCardType: (s = "") => ["34", "37"].includes(s.substr(0, 2)), // Can also add here regex for the specific card to make it more real.
    isNumberComplete: (l = "") => l.length === 17,
    isValidCardType: () => true,
    isValidNumber: (number = "") => number.split(" ").join("").length === 15,
    numberLength: 17 // 15 chars + 2 spaces.
  },
  [types.VISA]: {
    type: types.VISA,
    ...validatorsSharedDefaults,
    CVCLength: 3,
    isCardType: (s = "") => s.substr(0, 1) === "4",
    isCVCComplete: (l = "") => l.length === 3,
    isValidCardType: () => true,
    isValidCVC: (cvc = "") => cvc.length === 3,
    isValidNumber: (number = "") => number.split(" ").join("").length === 16
  },
  [types.DEFAULT]: {
    type: types.DEFAULT,
    ...validatorsSharedDefaults
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
