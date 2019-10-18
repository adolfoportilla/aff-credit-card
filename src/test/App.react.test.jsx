import React from "react";
import { shallow } from "enzyme";

import App from "../App";
import CreditCardForm from "../components/CreditCardForm/CreditCardForm";

describe("<App />", () => {
  test("renders", () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(CreditCardForm)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
