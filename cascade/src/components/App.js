import React, { Component } from "react";
import axios from "axios";
import config from "../config";

import { getArrayOfDaysInMonth } from "../helpers";
import ScatterPlot from "./scatterplot/scatterPlot";

import "../assets/CSS/App.css";
import "../assets/CSS/loader.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      month: 1,
      year: 2018,
      hoursOnThisMonth: 0,
      hoursTotalThisMonth: 0,
      tempRange: { min: 62, max: 75 },
      waitingForData: false,
      scatterPlot: {
        size: {
          width: 250,
          height: 150
        },
        range: { x: null, y: { min: 30, max: 90 } },
        margin: { top: 5, right: 20, bottom: 20, left: 50 },
        dots: {
          size: 3,
          HVACOnColor: "rgb(255, 0, 0)",
          HVACOffColor: "rgb(25, 158, 199)"
        },
        ticks: { x: 5, y: 5 },
        lineStyle: { stroke: "black", strokeWidth: "1" }
      }
    };

    this.initialCoords = {
      lat: 45.5898,
      long: -122.5951
    };
  }

  componentDidMount() {
    this.submitNewMonthDataRequest();
  }

  getDataForDay(day) {
    const apiPath = `https://api.darksky.net/forecast/${config.darkSkyAPIKey}/${
      this.initialCoords.lat
    },${this.initialCoords.long},${day.getTime() /
      1000}?exclude=currently,minutely,daily,alerts,flags`;

    axios
      .get(apiPath)
      .then(response => {
        const updatedData = this.addHoursHVACIsOnAndUpdateTotal(response.data);

        this.setState({
          ...this.state,
          data: {
            ...this.state.data,
            [day]: updatedData
          }
        });
      })
      .catch(error => {
        //throw error
        debugger;
      });
  }

  addHoursHVACIsOnAndUpdateTotal(data) {
    const { tempRange, hoursOnThisMonth, hoursTotalThisMonth } = this.state;
    //reduce numbers of on vs off and add to state
    const hoursOnToday = data.hourly.data.reduce((acc, cur) => {
      if (cur.temperature < tempRange.min || cur.temperature > tempRange.max) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.setState({
      ...this.state,
      hoursOnThisMonth: hoursOnToday + hoursOnThisMonth,
      hoursTotalThisMonth: hoursTotalThisMonth + data.hourly.data.length
    });
    return { ...data, hoursOnToday };
  }

  inputChange(e) {
    const { name, value } = e.target;
    this.setState(
      {
        ...this.state,
        [name]: value,
        data: {},
        waitingForData: false
      },
      () => {
        this.submitNewMonthDataRequest();
      }
    );
  }

  submitNewMonthDataRequest() {
    const { month, year } = this.state;
    const days = getArrayOfDaysInMonth(month, year);

    this.setState({
      ...this.state,
      hoursOnThisMonth: 0,
      hoursTotalThisMonth: 0,
      waitingForData: true
    });

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const day = days[dayIndex];
      this.getDataForDay(day);
    }
  }

  render() {
    const {
      data,
      year,
      month,
      scatterPlot,
      hoursOnThisMonth,
      hoursTotalThisMonth,
      waitingForData,
      tempRange
    } = this.state;
    const daysInThisMonth = new Date(year, month, 0).getDate();
    const dataHasBeenLoaded = Object.keys(data).length === daysInThisMonth;

    //format object and sort chronologically before converting to set of scatter plots
    const listOfScatterplots = Object.keys(data)
      .map((day, index) => {
        return data[day];
      })
      .sort((a, b) => {
        return a.hourly.data[0].time - b.hourly.data[0].time;
      })
      .map((dayInfo, index) => {
        return (
          <ScatterPlot
            key={index}
            tempRange={tempRange}
            scatterPlotInfo={scatterPlot}
            currentData={dayInfo}
          />
        );
      });

    //year choices (arbitrary year Dark Sky api was created)
    const yearSelect = [];
    for (let year = new Date().getFullYear(); year >= 2012; year--) {
      const yearOption = (
        <option key={year} value={`${year}`}>
          {year}
        </option>
      );
      yearSelect.push(yearOption);
    }

    const hoursOnDisplay = dataHasBeenLoaded ? (
      <div className="total-hours-month">
        <p>
          Total Hours HVAC On this Month: {hoursOnThisMonth} /{" "}
          {hoursTotalThisMonth}
        </p>
        <p>
          {((hoursOnThisMonth / hoursTotalThisMonth) * 100).toFixed(2)}% On Time
        </p>
      </div>
    ) : null;

    const scatterPlotsDisplay = dataHasBeenLoaded ? (
      <div className="scatter-plots container">{listOfScatterplots}</div>
    ) : null;

    const loaderDisplay =
      !dataHasBeenLoaded && waitingForData ? (
        <div className="loader-container">
          <div className="loader loader1" />
          <div className="loader loader2" />
          <div className="loader loader3" />
          <div className="loader loader4" />
          <div className="loader loader5" />
        </div>
      ) : null;

    const darkSkyInfoDisplay = dataHasBeenLoaded ? (
      <a className="sponsored-by" href="https://darksky.net/poweredby/">
        Powered by Dark Sky
      </a>
    ) : (
      <a className="sponsored-by no-data" href="https://darksky.net/poweredby/">
        Powered by Dark Sky
      </a>
    );

    return (
      <div className="App">
        <div className="header">
          <div className="header-image">
            <a href="https://cascadeenergy.com/">
              <img
                src="http://cascadeenergy.com/wp-content/uploads/2018/04/cascade-energy-logo-2.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="inputs">
          <select
            className="months"
            name="month"
            onChange={e => this.inputChange(e)}
            value={month}
          >
            {/* <option value="">--Select Month--</option> */}
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            className="years"
            name="year"
            value={year}
            onChange={e => this.inputChange(e)}
          >
            {/* <option value="">--Select Year--</option> */}
            {yearSelect}
          </select>

          <button onClick={e => this.submitNewMonthDataRequest(e)}>
            Request New Month
          </button>
        </div>
        {hoursOnDisplay}
        {scatterPlotsDisplay}
        {loaderDisplay}
        {darkSkyInfoDisplay}
      </div>
    );
  }
}

export default App;
