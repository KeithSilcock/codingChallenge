import React from "react";
import RenderCircles from "./scatterplot/renderCirlces";
import Axis from "./scatterplot/axis";
import { scaleLinear, max, axisLeft, axisBottom, select } from "d3";

import sampleData from "../sample";

class DataDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: { min: 62, max: 75 }
    };
  }

  render() {
    const { temp } = this.state;
    // const { data } = this.props;
    // const data = [
    //   [0, 3],
    //   [5, 13],
    //   [10, 22],
    //   [15, 36],
    //   [20, 48],
    //   [25, 59],
    //   [30, 77],
    //   [35, 85],
    //   [40, 95],
    //   [45, 105],
    //   [50, 120],
    //   [55, 150],
    //   [60, 147],
    //   [65, 168],
    //   [70, 176],
    //   [75, 188],
    //   [80, 199],
    //   [85, 213],
    //   [90, 222],
    //   [95, 236],
    //   [100, 249]
    // ];
    const data = Object.keys(sampleData.hourly.data).map((hourIndex, index) => {
      return [hourIndex, sampleData.hourly.data[hourIndex].temperature];
    });

    //boilerplate logic borrowed from https://gist.github.com/isaaguilar/fb92517c1ce878f7d3780cf9aa74a709
    const margin = { top: 20, right: 15, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const x = scaleLinear()
      .domain([
        0,
        max(data, function(d) {
          return d[0];
        })
      ])
      .range([0, width]);

    const y = scaleLinear()
      .domain([
        0,
        max(data, function(d) {
          return d[1];
        })
      ])
      .range([height, 0]);

    return (
      <div className="data-display container">
        <div className="data-display scatter-plot-container">
          <svg
            width={width + margin.right + margin.left}
            height={height + margin.top + margin.bottom}
            className="scatter-plot"
          >
            <g
              transform={"translate(" + margin.left + "," + margin.top + ")"}
              width={width}
              height={height}
              className="main"
            >
              <RenderCircles temp={temp} data={data} scale={{ x, y }} />
              <line
                x1={0}
                x2={width}
                y1={y(temp.min)}
                y2={y(temp.min)}
                style={{ stroke: "black", strokeWidth: "2" }}
              />
              <line
                x1={0}
                x2={width}
                y1={y(temp.max)}
                y2={y(temp.max)}
                style={{ stroke: "black", strokeWidth: "2" }}
              />
              <Axis
                axis="x"
                transform={"translate(0," + height + ")"}
                scale={axisBottom().scale(x)}
              />
              <Axis
                axis="y"
                transform="translate(0,0)"
                scale={axisLeft().scale(y)}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default DataDisplay;
