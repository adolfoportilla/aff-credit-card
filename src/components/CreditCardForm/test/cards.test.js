import creditCards from "../cards";

describe("cards", () => {
  describe("DEFAULT", () => {
    let validator = creditCards.validators[creditCards.types.DEFAULT];
    test("formatExpiry", () => {
      const format = validator.formatExpiry;

      // If user enters 0 or 1, it does not change the values
      expect(format("0")).toBe("0");
      expect(format("1")).toBe("1");

      // If user enters number greater than 1, it prefixes 0 and appends spacing
      expect(format("2")).toBe("02 / ");
      expect(format("9")).toBe("09 / ");

      // After user enters 2 digits, it adds space
      expect(format("12")).toBe("12 / ");

      // Cases when the user deletes a char
      expect(format("12 /")).toBe("12");
      expect(format("12 / ")).toBe("12");

      // Auto fill cases. Either it fills MMYY or MMYYYY
      expect(format("1219")).toBe("12 / 19");
      expect(format("12/19")).toBe("12 / 19");
      expect(format("12/2019")).toBe("12 / 19");

      // Does not alter already formatted expiry
      expect(format("12 / 19")).toBe("12 / 19");
    });

    test("formatNumber", () => {
      const format = validator.formatNumber;

      // If user enters 0-4, it does not change the values
      expect(format("0")).toBe("0");
      expect(format("01")).toBe("01");
      expect(format("012")).toBe("012");
      expect(format("0123")).toBe("0123");

      // Every 4 characters, it adds a space
      expect(format("01234")).toBe("0123 4");
      expect(format("1234 1234")).toBe("1234 1234");
      expect(format("1234 12341")).toBe("1234 1234 1");
      expect(format("1234123412341234")).toBe("1234 1234 1234 1234");
    });

    test("isCVCComplete", () => {
      const format = validator.isCVCComplete;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1244")).toBe(true);
    });

    test("isExpiryComplete", () => {
      const format = validator.isExpiryComplete;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("12 / 44")).toBe(true);
    });

    test("isNumberComplete", () => {
      const format = validator.isNumberComplete;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1234 1234 1234 1234")).toBe(true);
    });

    test("isValidCardType", () => {
      const format = validator.isValidCardType;

      expect(format()).toBe(false);
    });

    test("isValidCVC", () => {
      const format = validator.isValidCVC;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1244")).toBe(true);
    });

    test("isValidExpiry", () => {
      const format = validator.isValidExpiry;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("12 / 44")).toBe(true);
    });

    test("isValidName", () => {
      const format = validator.isValidName;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(true);
      expect(format("a".repeat(30))).toBe(true);
      expect(format("a".repeat(31))).toBe(false);
    });

    test("isValidNumber", () => {
      const format = validator.isValidNumber;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1234 1234 1234 1234")).toBe(true);
    });
  });

  describe("AMEX", () => {
    let validator = creditCards.validators[creditCards.types.AMEX];
    test("formatNumber", () => {
      const format = validator.formatNumber;

      // If user enters 0-4, it does not change the values
      expect(format("0")).toBe("0");
      expect(format("01")).toBe("01");
      expect(format("012")).toBe("012");
      expect(format("0123")).toBe("0123");

      // Every 4 characters, it adds a space
      expect(format("01234")).toBe("0123 4");
      expect(format("1234 12345")).toBe("1234 12345");
      expect(format("1234 123451")).toBe("1234 12345 1");
      expect(format("123412345123456")).toBe("1234 12345 123456");
    });

    test("isCardType", () => {
      const format = validator.isCardType;

      expect(format("")).toBe(false);
      expect(format("4")).toBe(false);
      expect(format("34")).toBe(true);
      expect(format("3434 34343 434343")).toBe(true);
      expect(format("37")).toBe(true);
      expect(format("3737 37373 737373")).toBe(true);
    });

    test("isNumberComplete", () => {
      const format = validator.isNumberComplete;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1234 12345 123456")).toBe(true);
    });

    test("isValidCardType", () => {
      const format = validator.isValidCardType;

      expect(format()).toBe(true);
    });

    test("isValidNumber", () => {
      const format = validator.isValidNumber;

      expect(format("")).toBe(false);
      expect(format("12345678901234567")).toBe(false);
      expect(format("1234 12345 123456")).toBe(true);
    });
  });

  describe("VISA", () => {
    let validator = creditCards.validators[creditCards.types.VISA];
    test("isCardType", () => {
      const format = validator.isCardType;

      expect(format("")).toBe(false);
      expect(format("4")).toBe(true);
      expect(format("34")).toBe(false);
      expect(format("3434 34343 434343")).toBe(false);
      expect(format("37")).toBe(false);
      expect(format("3737 37373 737373")).toBe(false);
      expect(format("4737 37373 737373")).toBe(true);
    });

    test("isCVCComplete", () => {
      const format = validator.isCVCComplete;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1244")).toBe(false);
      expect(format("124")).toBe(true);
    });

    test("isValidCardType", () => {
      const format = validator.isValidCardType;

      expect(format()).toBe(true);
    });

    test("isValidCVC", () => {
      const format = validator.isValidCVC;

      expect(format("")).toBe(false);
      expect(format("1")).toBe(false);
      expect(format("1244")).toBe(false);
      expect(format("124")).toBe(true);
    });

    test("isValidNumber", () => {
      const format = validator.isValidNumber;

      expect(format("")).toBe(false);
      expect(format("1234567890123456789")).toBe(false);
      expect(format("1234 1234 1234 1234")).toBe(true);
    });
  });
});
