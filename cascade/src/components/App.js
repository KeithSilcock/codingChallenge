import React, { Component } from "react";
import FetchData from "./fetchData";
import DisplayData from "./displayData";
import "../assets/CSS/App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };
  }

  render() {
    return (
      <div className="App">
        Hellow
        {/* <FetchData /> */}
        <DisplayData />
        <a href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
      </div>
    );
  }
}

export default App;
