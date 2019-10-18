import React from "react";
import { FiAlertTriangle as Icon } from "react-icons/fi";
import { format } from "util";

import Button from "./helpers/Button/Button";
import CardType from "./components/CardType";
import creditCards from "./cards";
import Input from "./helpers/Input/Input";

import "./CreditCardForm.scss";
import errors from "./errors";

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
    if (!this.isValidForm()) {
      this.displayErrorMessage();
    } else {
      /*
        This is where I would trigger an API call with the payment information.
        Right now all the info is not encrypted so I would encrypt it before
        sending it to the backend.
      */
      alert("Congratulations!!! You submitted the form correctly");
      this.clearForm();
    }
  }

  displayErrorMessage() {
    const { cvc, name, expiry, number, cardType } = this.state;
    const cardValidator = creditCards.validators[cardType];

    if (!cardValidator.isValidName(name)) {
      this.setState({ errorMessage: errors.invalidName });
    } else if (!cardValidator.isNumberComplete(number)) {
      this.setState({
        errorMessage: errors.incompleteNumber
      });
    } else if (!cardValidator.isValidNumber(number)) {
      this.setState({ errorMessage: errors.invalidNumber });
    } else if (!cardValidator.isExpiryComplete(expiry)) {
      this.setState({
        errorMessage: errors.incompleteExpiry
      });
    } else if (!cardValidator.isValidExpiry(expiry)) {
      this.setState({
        errorMessage: format(errors.invalidExpiry, cardValidator.expirationDate)
      });
    } else if (!cardValidator.isCVCComplete(cvc)) {
      this.setState({
        errorMessage: errors.incompleteCVC
      });
    } else {
      this.setState({
        errorMessage: errors.invalidCardType
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
          value={name}
          wrapperClassName="m-b-med credit-card-input flex"
          autocomplete="cc-name"
        />
        <div className="m-b-med credit-card-input flex">
          <CardType type={this.state.cardType} wrapperClassName="flex" />
          <Input
            inputMode="numeric"
            maxLength={numberLength}
            name="number"
            onChange={this.handleChange}
            placeholder={staticText.numberPlaceholder}
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
