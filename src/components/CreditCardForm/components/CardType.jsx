import React from "react";

import { ReactComponent as Visa } from "payment-icons/min/flat/visa.svg";
import { ReactComponent as Amex } from "payment-icons/min/flat/amex.svg";
import { ReactComponent as Default } from "payment-icons/min/mono/default.svg";

import "./CardType.scss";

const CardType = ({ type, wrapperClassName }) => {
  switch (type) {
    case "AMEX":
      return (
        <div className={wrapperClassName}>
          <Amex className="card-type" />
        </div>
      );
    case "VISA":
      return (
        <div className={wrapperClassName}>
          <Visa className="card-type" />
        </div>
      );
    default:
      return (
        <div className={wrapperClassName}>
          <Default className="card-type" />
        </div>
      );
  }
};

export default CardType;
