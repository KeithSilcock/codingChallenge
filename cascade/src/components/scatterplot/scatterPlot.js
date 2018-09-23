import React from "react";
import RenderCircles from "./renderCirlces";
import Axis from "./axis";
import { scaleLinear, max, min, axisLeft, axisBottom } from "d3";

import "../../assets/CSS/scatterPlots.css";

class ScatterPlot extends React.Component {
  render() {
    const { currentData, scatterPlotInfo, tempRange } = this.props;
    const { margin } = scatterPlotInfo;
    const date = new Date(currentData.hourly.data[0].time * 1000);

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
        scatterPlotInfo.range.y.min > min(data, d => d[1])
          ? min(data, d => d[1])
          : scatterPlotInfo.range.y.min;
      const maxHeightRange =
        scatterPlotInfo.range.y.max < max(data, d => d[1])
          ? max(data, d => d[1])
          : scatterPlotInfo.range.y.max;
      const y = scaleLinear()
        .domain([minHeightRange, maxHeightRange])
        .range([height, 0]);

      return (
        <div
          style={{
            width: `${width + margin.right + margin.left}px`
          }}
          className="scatter-plot container"
        >
          <p className="scatter-plot name">{`${date.getFullYear()}/${date.getMonth() +
            1}/${date.getDate()}`}</p>
          <span className="time-on">
            Daily Operating Time: {currentData.hoursOnToday} h
          </span>
          <span className="scatter-plot y-axis-label">Temp (&deg;F)</span>
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
                  temp={tempRange}
                  currentData={currentData}
                  data={data}
                  scale={{ x, y }}
                />
                <line
                  x1={0}
                  x2={width}
                  y1={y(tempRange.min)}
                  y2={y(tempRange.min)}
                  style={scatterPlotInfo.lineStyle}
                />
                <line
                  x1={0}
                  x2={width}
                  y1={y(tempRange.max)}
                  y2={y(tempRange.max)}
                  style={scatterPlotInfo.lineStyle}
                />
                <Axis
                  axis="x"
                  transform={"translate(0," + height + ")"}
                  scale={axisBottom()
                    .scale(x)
                    .ticks(scatterPlotInfo.ticks.x)}
                />
                <Axis
                  axis="y"
                  transform="translate(0,0)"
                  scale={axisLeft()
                    .scale(y)
                    .ticks(scatterPlotInfo.ticks.y)}
                />
              </g>
            </svg>
          </div>
          <span className="x-axis-label">Time (h)</span>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ScatterPlot;
