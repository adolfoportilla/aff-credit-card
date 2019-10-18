import React from "react";
import { shallow } from "enzyme";
import { format } from "util";

import CreditCardForm from "../CreditCardForm";
import CardType from "../components/CardType";
import Button from "../helpers/Button/Button";
import Input from "../helpers/Input/Input";
import creditCards from "../cards";
import errors from "../errors";

describe("CreditCardForm", () => {
  const d = new Date();
  const month = d.getMonth().toString();
  const year = d
    .getFullYear()
    .toString()
    .substr(2);

  describe("handleChange", () => {
    test("finds correct validator", () => {
      const wrapper = shallow(<CreditCardForm />);
      const event = {
        target: {
          name: "number",
          value: "4"
        }
      };

      wrapper
        .find(Input)
        .first()
        .simulate("change", event);

      expect(wrapper.state().cardType).toEqual(creditCards.types.VISA);
    });

    test("correctly updates name", () => {
      const wrapper = shallow(<CreditCardForm />);
      const event = {
        target: {
          name: "name",
          value: "Test"
        }
      };

      wrapper
        .find(Input)
        .first()
        .simulate("change", event);

      expect(wrapper.state().name).toEqual("Test");
    });

    test("correctly updates number and sets cardType", () => {
      const wrapper = shallow(<CreditCardForm />);
      const event = {
        target: {
          name: "number",
          value: "123456"
        }
      };

      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event);

      expect(wrapper.state().number).toEqual("1234 56");
      expect(wrapper.state().cardType).toEqual(creditCards.types.DEFAULT);
    });

    test("correctly updates expiry", () => {
      const wrapper = shallow(<CreditCardForm />);
      const event = {
        target: {
          name: "expiry",
          value: "123"
        }
      };

      wrapper
        .find(Input)
        .at(1)
        .simulate("change", event);

      expect(wrapper.state().expiry).toEqual("12 / 3");
    });

    test("correctly updates cvc", () => {
      const wrapper = shallow(<CreditCardForm />);
      const event = {
        target: {
          name: "cvc",
          value: "123"
        }
      };

      wrapper
        .find(Input)
        .first()
        .simulate("change", event);

      expect(wrapper.state().cvc).toEqual("123");
    });
  });

  describe("handleSubmit", () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };

    test("invalid input renders error", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({
        name: "Random name",
        number: "Card number",
        expiry: "MM / YY",
        cvc: "123"
      });
      wrapper.find(Button).simulate("click", mockEvent);

      expect(wrapper.state("errorMessage")).not.toBe("");
      expect(wrapper.find(".error-message")).toHaveLength(1);
    });

    test("valid input does not render error and clears form", () => {
      const wrapper = shallow(<CreditCardForm />);
      jest.spyOn(window, "alert").mockImplementation(() => {});

      wrapper.setState({
        name: "Random name",
        number: "4141 1234 1234 1234",
        expiry: "12 / 20",
        cvc: "123",
        cardType: "VISA"
      });
      wrapper.find(Button).simulate("click", mockEvent);

      expect(window.alert).toHaveBeenCalled();
      expect(wrapper.state("errorMessage")).toBe("");
      expect(wrapper.find(".error-message")).toHaveLength(0);
      expect(wrapper.state("name")).toBe("");
      expect(wrapper.state("number")).toBe("");
      expect(wrapper.state("expiry")).toBe("");
      expect(wrapper.state("cvc")).toBe("");
      expect(wrapper.state("cardType")).toBe("");
    });
  });

  describe("displayErrorMessage", () => {
    test("sets invalid name", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.invalidName);
    });

    test("sets incomplete number", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({ name: "valid", number: "123" });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.incompleteNumber);
    });

    test("sets invalid number", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({ name: "valid", number: "1234567890123456789" });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.invalidNumber);
    });

    test("sets incomplete expiry", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({
        name: "valid",
        number: "1234 1234 1234 1234",
        expiry: "01"
      });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.incompleteExpiry);
    });

    test("sets invalid expiry", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({
        name: "valid",
        number: "1234 1234 1234 1234",
        expiry: "01 / 19"
      });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(
        format(errors.invalidExpiry, `${month}/${year}`)
      );
    });

    test("sets incomplete cvc", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({
        name: "valid",
        number: "1234 1234 1234 1234",
        expiry: "01 / 25",
        cvc: "0"
      });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.incompleteCVC);
    });

    test("sets invalid card type", () => {
      const wrapper = shallow(<CreditCardForm />);

      wrapper.setState({
        name: "valid",
        number: "1234 1234 1234 1234",
        expiry: "01 / 25",
        cvc: "0000"
      });
      wrapper.instance().displayErrorMessage();

      expect(wrapper.state("errorMessage")).toBe(errors.invalidCardType);
    });
  });

  test("clearForm sets state to empty string", () => {
    const wrapper = shallow(<CreditCardForm />);

    wrapper.setState({ number: "1234", expiry: "12 / 20" });
    wrapper.instance().clearForm();

    expect(wrapper.state("number")).toBe("");
    expect(wrapper.state("expiry")).toBe("");
  });

  test("renders basic layout", () => {
    const wrapper = shallow(<CreditCardForm />);

    expect(wrapper.find("form")).toHaveLength(1);
    expect(wrapper.find(CardType)).toHaveLength(1);
    // Inputs for name, number, expiry, and cvc
    expect(wrapper.find(Input)).toHaveLength(4);
    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
