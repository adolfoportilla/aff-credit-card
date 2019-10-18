import React from "react";
import { shallow } from "enzyme";

import Button from "../Button";

describe("Input", () => {
  const baseProps = {
    baseClassName: "class-name",
    text: "text"
  };

  test("renders basic layout", () => {
    const wrapper = shallow(<Button {...baseProps} />);

    expect(wrapper.find("button")).toHaveLength(1);
    expect(wrapper.find("button").text()).toBe(baseProps.text);
    expect(wrapper.find("button").props().className).toBe(
      "button " + baseProps.baseClassName
    );
    expect(wrapper).toMatchSnapshot();
  });
});
