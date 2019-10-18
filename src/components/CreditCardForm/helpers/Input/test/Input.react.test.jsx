import React from "react";
import { shallow } from "enzyme";

import Input from "../Input";

describe("Input", () => {
  const baseProps = {
    baseClassName: "base-class",
    value: "value"
  };

  test("renders basic layout", () => {
    const wrapper = shallow(<Input {...baseProps} />);

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").props().value).toBe(baseProps.value);
    expect(wrapper.find("input").props().className).toBe(
      baseProps.baseClassName
    );
    expect(wrapper).toMatchSnapshot();
  });
});
