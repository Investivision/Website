import { useState, useEffect } from "react";
import { alterHsl } from "tsparticles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Tooltip from "./ToolTip";
import InfoIcon from "@material-ui/icons/Info";

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(startAngle, endAngle) {
  const x = 0;
  const y = 90;
  const radius = 80;

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

const interpolateColor = (color1, color2, factor) => {
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

export default function Numeric(props) {
  const hue =
    -10 +
    130 * (props.colorsReversed ? 1 - props.percentile : props.percentile);
  const color = `hsl(${hue}, 100%, 38%)`;
  return (
    <div
      style={Object.assign(
        {
          width: 120,
        },
        props.style || {}
      )}
    >
      <svg
        viewBox="-100 0 200 100"
        style={{
          width: "100%",
        }}
      >
        <path
          d={describeArc(-90, 90)}
          stroke={color}
          stroke-width="20"
          fill="none"
          stroke-linecap="round"
          stroke-opacity="0.2"
        />
        <path
          d={describeArc(-90, 180 * props.percentile - 90)}
          stroke={color}
          stroke-width="20"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
      <p
        style={{
          position: "absolute",
          width: "100%",
          textAlign: "center",
          top: "62%",
          fontSize: 33 - props.value.length * 2.1,
          transform: `translateY(-50%)`,
        }}
      >
        {props.value}
      </p>

      <Tooltip title={props.toolTip} arrow>
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            marginBottom: -6,
          }}
        >
          {props.desc}
          <InfoIcon
            style={{
              width: 14,
              marginLeft: 3,
              marginTop: -2,
              opacity: 0.3,
              verticalAlign: "middle",
            }}
          />
        </p>
      </Tooltip>
    </div>
  );
}
