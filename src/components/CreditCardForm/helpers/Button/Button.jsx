import React from "react";

import "./Button.scss";

const Button = ({ wrapperClassName, baseClassName, text, onClick }) => {
  let buttonClassName = "button";
  if (baseClassName) {
    buttonClassName += ` ${baseClassName}`;
  }
  return (
    <div className={wrapperClassName}>
      <button onClick={onClick} className={buttonClassName}>
        {text}
      </button>
    </div>
  );
};

export default Button;
