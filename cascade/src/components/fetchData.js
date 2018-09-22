import React from "react";
import axios from "axios";

import { getEveryDayBetweenTwoMonths } from "../helpers";
import config from "../config";

class FetchData extends React.Component {
  constructor(props) {
    super(props);

    //Port of Portland
    this.initialCoords = {
      lat: 45.5898,
      long: -122.5951
    };

    this.state = {
      data: null,
      coords: this.initialCoords,
      days: null
    };
  }

  componentDidMount() {
    this.getDaysBetween();
  }

  getDaysBetween() {
    const startingDate = new Date("2018-1-1");
    const endingDate = new Date("2018-5-1");

    const daysArray = getEveryDayBetweenTwoMonths(startingDate, endingDate);
    this.setState(
      {
        ...this.state,
        days: daysArray
      },
      e => {
        this.getDataForDay(daysArray[1]);
      }
    );
  }

  getDataForDay(day) {
    const { coords } = this.state;
    const apiPath = `https://api.darksky.net/forecast/${config.darkSkyAPIKey}/${
      coords.lat
    },${coords.long},${day.getTime() /
      1000}?exclude=currently,minutely,daily,alerts,flags`;

    const date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;

    axios
      .get(apiPath, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      })
      .then(resp => {
        debugger;

        this.setState({
          ...this.state,
          data: { [date]: resp.data }
        });
      })
      .catch(error => {
        //throw error
        error;
        debugger;
      });
  }

  render() {
    const { data } = this.state;

    if (data) {
      debugger;
    }
    return <div>fetching</div>;
  }
}

export default FetchData;
