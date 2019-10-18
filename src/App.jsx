import React from "react";

import CreditCardForm from "./components/CreditCardForm/CreditCardForm";
import "./App.scss";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <div className="flex flex-wrap">
            <CreditCardForm />
          </div>
        </header>
      </div>
    );
  }
}
