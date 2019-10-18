import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FiAlertTriangle as Icon } from "react-icons/fi";

import Button from "./helpers/Button/Button";
import CardType from "./components/CardType";
import creditCards from "./cards";
import Input from "./helpers/Input/Input";

import "./CreditCardForm.scss";

const staticText = {
  button: "PAY",
  namePlaceholder: "Name",
  numberPlaceholder: "1234 1234 1234 1234",
  expiryPlaceholder: "MM / YY",
  CVCPlaceholder: "CVC"
};

class CreditCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardType: creditCards.types.DEFAULT,
      // errorMessage: "remove this before submitting"
      errorMessage: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.displayErrorMessage = this.displayErrorMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const [targetValue, targetName] = [e.target.value, e.target.name];

    const cardValidator = Object.values(creditCards.validators).find(card =>
      card.isCardType(targetValue)
    );

    console.log("------------------");
    console.log("called");
    console.log("------------------");

    switch (targetName) {
      case "number":
        const newCardType = cardValidator.type;
        const formattedNumber = cardValidator.formatNumber(targetValue);

        this.setState({ [targetName]: formattedNumber, cardType: newCardType });
        break;
      case "expiry":
        const formattedExpiry = cardValidator.formatExpiry(targetValue);

        this.setState({ [targetName]: formattedExpiry });
        break;
      default:
        this.setState({
          [targetName]: targetValue
        });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    if (!this.isValidForm()) {
      this.displayErrorMessage();
    } else {
      /*
        This is where I would send an API call with the payment information.
        Right now all the info is not encrypted so I would encrypt it before
        sending it to the backend to deal with it.
      */
      alert("You submitted the form correctly");
      this.clearForm();
    }
  }

  displayErrorMessage() {
    const { cvc, name, expiry, number, cardType } = this.state;
    const cardValidator = creditCards.validators[cardType];

    if (!cardValidator.isValidName(name)) {
      this.setState({ errorMessage: "Please input a name" });
    } else if (!cardValidator.isValidNumber(number)) {
      this.setState({ errorMessage: "Invalid card number" });
    } else if (!cardValidator.isValidExpiry(expiry)) {
      this.setState({ errorMessage: "Invalid expiration" });
    } else if (!cardValidator.isValidCVC(cvc)) {
      this.setState({ errorMessage: "Invalid CVC" });
    } else {
      this.setState({
        errorMessage:
          "Invalid credit type, please enter a card which starts with 4, 34, or 37"
      });
    }
  }

  clearForm() {
    const newState = {};
    const inputNames = Object.keys(this.state);
    inputNames.forEach(inputName => {
      newState[inputName] = "";
    });
    this.setState({
      ...newState
    });
  }

  isValidForm() {
    const { cvc, name, expiry, number, cardType } = this.state;
    let cardValidator = creditCards.validators[cardType];

    return (
      cardValidator.isValidCVC(cvc) &&
      cardValidator.isValidNumber(number) &&
      cardValidator.isValidExpiry(expiry) &&
      cardValidator.isValidName(name) &&
      cardValidator.isValidCardType()
    );
  }

  renderInputs() {
    const { name, number, cvc, expiry, cardType, errorMessage } = this.state;
    const numberLength = creditCards.validators[cardType].numberLength;
    const CVCLength = creditCards.validators[cardType].CVCLength;
    const nameMaxLength = creditCards.validators[cardType].nameMaxLength;
    return (
      <>
        <Input
          maxLength={nameMaxLength}
          name="name"
          onChange={this.handleChange}
          placeholder={staticText.namePlaceholder}
          type="text"
          value={name}
          wrapperClassName="m-b-med credit-card-input flex"
          autocomplete="cc-name"
          required
        />
        <div className="m-b-med credit-card-input flex">
          <CardType type={this.state.cardType} wrapperClassName="flex" />
          <Input
            inputMode="numeric"
            maxLength={numberLength}
            name="number"
            onChange={this.handleChange}
            onKeyDown={this.handleSpace}
            placeholder={staticText.numberPlaceholder}
            type="text"
            value={number}
            wrapperClassName="flex"
            autocomplete="cc-number"
          />
        </div>
        <div className="m-b-xl flex">
          <Input
            inputMode="numeric"
            maxLength="7"
            name="expiry"
            onChange={this.handleChange}
            placeholder={staticText.expiryPlaceholder}
            value={expiry}
            wrapperClassName="m-r-med credit-card-input half flex"
            autocomplete="cc-exp"
          />
          <Input
            maxLength={CVCLength}
            name="cvc"
            onChange={this.handleChange}
            placeholder={staticText.CVCPlaceholder}
            type="text"
            value={cvc}
            wrapperClassName="credit-card-input half flex"
            autocomplete="cc-csc"
          />
        </div>
        <Button
          wrapperClassName="flex-horizontal-center"
          baseClassName="credit-card-button"
          text={staticText.button}
          onClick={this.handleSubmit}
        />
        {errorMessage && (
          <div className=" flex-horizontal-center error">
            <div className="flex-vertical-center">
              {/* <IoIosCloseCircle color="#E95757" /> */}
              <Icon color="#E95757" />
              <p className="p-l-xs error-message">{errorMessage}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  render() {
    return (
      <form className="credit-card-form">
        <div className="m-l-xl m-r-xl">{this.renderInputs()}</div>
      </form>
    );
  }
}

export default CreditCardForm;
