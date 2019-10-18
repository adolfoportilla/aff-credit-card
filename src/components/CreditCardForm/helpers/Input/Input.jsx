import React from "react";

import "./Input.scss";

const Input = ({
  autocomplete,
  baseClassName,
  inputMode,
  maxLength,
  name,
  onChange,
  placeholder,
  type,
  value,
  wrapperClassName
}) => {
  return (
    <div className={wrapperClassName}>
      <input
        type={type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className={baseClassName}
        maxLength={maxLength}
        value={value}
        inputMode={inputMode}
        autoComplete={autocomplete}
      />
    </div>
  );
};

export default Input;
