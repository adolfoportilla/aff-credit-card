import React from "react";
import { shallow } from "enzyme";

import { ReactComponent as Visa } from "payment-icons/min/flat/visa.svg";
import { ReactComponent as Amex } from "payment-icons/min/flat/amex.svg";
import { ReactComponent as Default } from "payment-icons/min/mono/default.svg";
import CardType from "../CardType";

describe("Input", () => {
  test("renders amex", () => {
    const wrapper = shallow(<CardType type="AMEX" />);

    expect(wrapper.find(Amex)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  test("renders visa", () => {
    const wrapper = shallow(<CardType type="VISA" />);

    expect(wrapper.find(Visa)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  test("renders default", () => {
    const wrapper = shallow(<CardType type="DEFAULT" />);

    expect(wrapper.find(Default)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
