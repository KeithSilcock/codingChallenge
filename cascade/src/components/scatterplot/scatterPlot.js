import React from "react";
import RenderCircles from "./renderCirlces";
import Axis from "./axis";
import { scaleLinear, max, axisLeft, axisBottom, select } from "d3";

import "../../assets/CSS/scatterPlots.css";

class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: { min: 62, max: 75 }
    };
  }

  render() {
    const { temp } = this.state;
    const { currentData, scatterPlotInfo } = this.props;
    const { margin } = scatterPlotInfo;

    if (Object.keys(currentData).length) {
      const data = Object.keys(currentData.hourly.data).map(
        (hourIndex, index) => {
          return [index, currentData.hourly.data[hourIndex].temperature];
        }
      );

      //boilerplate logic borrowed from https://gist.github.com/isaaguilar/fb92517c1ce878f7d3780cf9aa74a709
      const width = scatterPlotInfo.size.width - margin.left - margin.right;
      const height = scatterPlotInfo.size.height - margin.top - margin.bottom;

      const x = scaleLinear()
        .domain([
          0,
          max(data, function(d) {
            return d[0];
          })
        ])
        .range([0, width]);

      const minHeightRange =
        90 < max(data, d => d[1]) ? max(data, d => d[1]) : 90;
      const y = scaleLinear()
        .domain([0, minHeightRange])
        .range([height, 0]);

      return (
        <div className="scatter-plot svg">
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
              <RenderCircles
                scatterPlotInfo={scatterPlotInfo}
                temp={temp}
                currentData={currentData}
                data={data}
                scale={{ x, y }}
              />
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
      );
    } else {
      return null;
    }
  }
}

export default ScatterPlot;
