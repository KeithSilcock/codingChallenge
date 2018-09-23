import React from "react";

class RenderCircles extends React.Component {
  render() {
    const { scale, temp, data, scatterPlotInfo } = this.props;

    let renderCircles = data.map((coords, index) => {
      const style =
        coords[1] < temp.min || coords[1] > temp.max
          ? { fill: scatterPlotInfo.dots.HVACOnColor }
          : { fill: scatterPlotInfo.dots.HVACOffColor };
      return (
        <g key={index}>
          <circle
            cx={scale.x(coords[0])}
            cy={scale.y(coords[1])}
            r={`${scatterPlotInfo.dots.size}`}
            style={style}
          />
        </g>
      );
    });
    return renderCircles;
  }
}

export default RenderCircles;
