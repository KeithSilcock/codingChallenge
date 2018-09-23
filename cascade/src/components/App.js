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
      hoursOn: 0,
      hoursTotal: 0,
      year: 2018,
      date: new Date("2018-01-01"),
      temp: { min: 62, max: 75 },
      scatterPlot: {
        size: {
          width: 250,
          height: 150
        },
        range: { x: null, y: { min: 30, max: 90 } },
        margin: { top: 5, right: 10, bottom: 20, left: 60 },
        dots: {
          size: 2
        },
        ticks: { x: 5, y: 5 }
      }
    };

    this.initialCoords = {
      lat: 45.5898,
      long: -122.5951
    };
  }

  componentDidMount() {
    // this.updateHVACOnTime(dummData);
  }

  getDataForDay(day) {
    const apiPath = `https://api.darksky.net/forecast/${config.darkSkyAPIKey}/${
      this.initialCoords.lat
    },${this.initialCoords.long},${day.getTime() /
      1000}?exclude=currently,minutely,daily,alerts,flags`;

    axios
      .get(apiPath)
      .then(response => {
        this.updateHVACOnTime(response.data);

        this.setState({
          ...this.state,
          data: {
            ...this.state.data,
            [day]: response.data
          }
        });
      })
      .catch(error => {
        //throw error
        error;
        debugger;
      });
  }

  updateHVACOnTime(data) {
    const { temp, hoursTotal } = this.state;
    //reduce numbers of on vs off
    const hoursOn = data.hourly.data.reduce((acc, cur) => {
      if (cur.temperature < temp.min || cur.temperature > temp.max) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.setState({
      ...this.state,
      hoursOn,
      hoursTotal: hoursTotal + data.hourly.data.length
    });
  }

  // changeDate(e) {
  //   const date = new Date(e.target.value + "T00:00:00");

  //   //get new data
  //   this.getDataForDay(date);

  //   this.setState({
  //     ...this.state,
  //     date: date.getTime()
  //   });
  // }

  inputChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  submitNewMonthRequest() {
    const { month, year } = this.state;
    const days = getDaysOfMonth(month, year);

    for (let dayIndex = 0; dayIndex < 3 /*days.length*/; dayIndex++) {
      const day = days[dayIndex];
      this.getDataForDay(day);
    }
  }

  render() {
    const { data, year, month, scatterPlot } = this.state;

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
          <span className="scatter-plot y-axis-label">
            Temperature (&deg;F)
          </span>
          <ScatterPlot scatterPlotInfo={scatterPlot} currentData={dayInfo} />
          <span className="x-axis-label">Time (h)</span>
        </div>
      );
    });

    const date = new Date();

    return (
      <div className="App">
        <label htmlFor="month">Month</label>
        <input
          type="number"
          name="month"
          value={month}
          onChange={e => this.inputChange(e)}
          className="month"
        />
        <label htmlFor="year">Year</label>
        <input
          type="number"
          name="year"
          value={year}
          onChange={e => this.inputChange(e)}
          className="year"
        />
        <button onClick={e => this.submitNewMonthRequest(e)}>
          Request new month
        </button>
        {/* <input
          name={"date"}
          type="date"
          value="2018-01-01"
          // onChange={e => this.changeDate(e)}
        /> */}
        {/* <FetchData /> */}
        {/* <ScatterPlot currentData={data} /> */}

        <div className="scatter-plots container">
          <div className="scatter-plot container">
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
          </div>
          {listOfScatterplots}
        </div>
        <a href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
      </div>
    );
  }
}

export default App;
