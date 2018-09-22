import React, { Component } from "react";
import FetchData from "./fetchData";
import "../assets/CSS/App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        Hellow
        <FetchData />
      </div>
    );
  }
}

export default App;
