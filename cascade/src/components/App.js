import React, { Component } from "react";
import axios from "axios";
import config from "../config";

import { getDaysOfMonth } from "../helpers";
import ScatterPlot from "./scatterplot/scatterPlot";
import dummyData from "../sample";

import "../assets/CSS/App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      month: 8,
      hoursOnThisMonth: 0,
      hoursTotalThisMonth: 0,
      year: 2018,
      date: new Date("2018-01-01"),
      temp: { min: 62, max: 75 },
      scatterPlot: {
        size: {
          width: 250,
          height: 150
        },
        range: { x: null, y: { min: 30, max: 90 } },
        margin: { top: 5, right: 20, bottom: 20, left: 50 },
        dots: {
          size: 3
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
    //  this.addHoursHVACOnAndUpdateTotal(dummyData);
  }

  getDataForDay(day) {
    const apiPath = `https://api.darksky.net/forecast/${config.darkSkyAPIKey}/${
      this.initialCoords.lat
    },${this.initialCoords.long},${day.getTime() /
      1000}?exclude=currently,minutely,daily,alerts,flags`;

    axios
      .get(apiPath)
      .then(response => {
        const updatedData = this.addHoursHVACOnAndUpdateTotal(response.data);

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
        error;
        debugger;
      });
  }

  addHoursHVACOnAndUpdateTotal(data) {
    const { temp, hoursOnThisMonth, hoursTotalThisMonth } = this.state;
    //reduce numbers of on vs off and add to state
    const hoursOnToday = data.hourly.data.reduce((acc, cur) => {
      if (cur.temperature < temp.min || cur.temperature > temp.max) {
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
    debugger;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  submitNewMonthRequest() {
    const { month, year } = this.state;
    const days = getDaysOfMonth(month, year);

    this.setState({
      ...this.state,
      hoursOnThisMonth: 0,
      hoursTotalThisMonth: 0
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
      hoursTotalThisMonth
    } = this.state;

    //format and sort data from object of date to array
    const listOfDataPoints = Object.keys(data)
      .map((day, index) => {
        return data[day];
      })
      .sort((a, b) => {
        return a.hourly.data[0].time - b.hourly.data[0].time;
      });

    const listOfScatterplots = listOfDataPoints.map((dayInfo, index) => {
      const date = new Date(dayInfo.hourly.data[0].time * 1000);

      return (
        <div className="scatter-plot container">
          <p className="scatter-plot name">{`${date.getFullYear()}/${date.getMonth() +
            1}/${date.getDate()}`}</p>
          <span className="time-on">
            Total Operating Time: {dayInfo.hoursOnToday} h
          </span>
          <span className="scatter-plot y-axis-label">
            Temperature (&deg;F)
          </span>
          <ScatterPlot scatterPlotInfo={scatterPlot} currentData={dayInfo} />
          <span className="x-axis-label">Time (h)</span>
        </div>
      );
    });

    const yearSelect = [];
    for (let year = new Date().getFullYear(); year > 2005; year--) {
      const option = <option value={`${year}`}>{year}</option>;
      yearSelect.push(option);
    }

    const hoursOn = Object.keys(data).length ? (
      <p className="total-hours-month">
        Total Hours On this Month: {hoursOnThisMonth} / {hoursTotalThisMonth}
        <p>
          {((hoursOnThisMonth / hoursTotalThisMonth) * 100).toFixed(2)}% On Time
        </p>
      </p>
    ) : null;

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
            <option value="1">Janaury</option>
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

          <button onClick={e => this.submitNewMonthRequest(e)}>
            Request new month
          </button>
        </div>
        {hoursOn}
        <div className="scatter-plots container">
          {/* <div className="scatter-plot container">
            <p className="scatter-plot name">{`${date.getFullYear()}/${date.getMonth() +
              1}/${date.getDate()}`}</p>
            <span className="scatter-plot y-axis-label">
              Temperature (&deg;F)
            </span>
            <ScatterPlot
              scatterPlotInfo={scatterPlot}
              currentData={dummyData}
            />
            <span className="x-axis-label">Time (h)</span>
          </div> */}
          {listOfScatterplots}
        </div>
        <a className="sponsored-by" href="https://darksky.net/poweredby/">
          Powered by Dark Sky
        </a>
      </div>
    );
  }
}

export default App;
