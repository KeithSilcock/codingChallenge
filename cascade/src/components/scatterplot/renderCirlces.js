import React from "react";

class RenderCircles extends React.Component {
  render() {
    const { scale, temp } = this.props;
    let renderCircles = this.props.data.map((coords, index) => {
      const style =
        coords[1] < temp.min || coords[1] > temp.max
          ? { fill: "rgb(255, 0, 0)" }
          : { fill: "rgb(25, 158, 199)" };

      return (
        <circle
          cx={scale.x(coords[0])}
          cy={scale.y(coords[1])}
          r="8"
          style={style}
          key={index}
        />
      );
    });
    return <g>{renderCircles}</g>;
  }
}

export default RenderCircles;
