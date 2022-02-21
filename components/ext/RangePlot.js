import styles from "./rangePlot.module.css";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function RangePlot(props) {
  const theme = useTheme();

  const totalLength = props.points[props.points.length - 1].days;
  let min = Infinity;
  let max = -Infinity;
  for (var point of props.points) {
    min = Math.min(min, point.low);
    max = Math.max(max, point.high);
  }

  const range = max - min;

  let lows = props.points.map((point) => [
    point.days / totalLength,
    (point.low - min) / range,
  ]);
  let mids = props.points.map((point) => [
    point.days / totalLength,
    (point.mid - min) / range,
  ]);
  let highs = props.points.map((point) => [
    point.days / totalLength,
    (point.high - min) / range,
  ]);

  const getFutureDate = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + Math.round((days * 365.25) / 252));
    return today;
  };

  const data = [
    {
      id: "Lower",
      color:
        theme.palette.mode == "dark"
          ? theme.palette.primary.main + "80"
          : theme.palette.primary.main + "40",
      data: props.points.map((point) => {
        return { x: getFutureDate(point.days), y: point.low };
      }),
    },
    {
      id: "Expected",
      color:
        theme.palette.mode == "dark"
          ? theme.palette.primary.light
          : theme.palette.primary.main,
      data: props.points.map((point) => {
        return { x: getFutureDate(point.days), y: point.mid };
      }),
    },
    {
      id: "Upper",
      color:
        theme.palette.mode == "dark"
          ? theme.palette.primary.main + "80"
          : theme.palette.primary.main + "40",
      data: props.points.map((point) => {
        return { x: getFutureDate(point.days), y: point.high };
      }),
    },
  ];

  const daysBetween =
    props.points[props.points.length - 1].days - props.points[0].days;

  return (
    <div className={styles.container} style={props.style}>
      <p
        style={{
          fontSize: 12,
          margin: "15px 0",
          opacity: 0.4,
        }}
      >
        80% Confidence Range
      </p>
      <div className={styles.plot}>
        <ResponsiveLine
          data={data}
          theme={{
            fontSize: 12,
            fontFamily: "rubik",
            color: "red",
            grid: {
              line: {
                stroke:
                  theme.palette.mode == "dark" ? "#ffffff20" : "#00000020",
                strokeWidth: 1,
              },
            },
            crosshair: {
              line: {
                stroke: theme.palette.mode == "dark" ? "#ffffff" : "#000000",
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeDasharray: "6 6",
              },
            },
          }}
          margin={{ top: 7, right: 50, bottom: 20, left: 10 }}
          xScale={{ type: "time" }}
          // xFormat="time:%Y-%m-%dT%H:%M:%S.%L%Z"
          // axisBottom={{
          //     tickValues: "every 6 months",
          //     tickRotation: 90,
          //     format: (values) => `${getRequiredDateFormat(values, "MMMM-DD")}`,
          //     legendOffset: -80,
          //     legendPosition: "start"
          //   }}

          yScale={{
            type: "linear",
            base: 1.01,
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,

            // ((val - props.lastClose) / props.lastClose) * 100 - 100
          }}
          curve="natural"
          colors={(d) => d.color}
          axisTop={null}
          axisRight={{
            orient: "right",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: "",
            format: (val) => {
              val = ((val - props.lastClose) / props.lastClose) * 100;
              if (val < 10) {
                return `${Math.round(val * 10) / 10}%`;
              }
              return `${Math.round(val)}%`;
            },
            legendOffset: 0,
            tickValues: 6,
            //   tickValues: [
            //     0,
            //     props.points[props.points.length - 1].high,
            //     props.points[props.points.length - 1].mid,
            //     props.points[props.points.length - 1].low,
            //   ],
          }}
          axisBottom={{
            tickValues: daysBetween < 150 ? 3 : 5,
            tickSize: 5,
            tickPadding: 1,
            tickRotation: 0,
            format: (value) => {
              if (daysBetween < 150)
                return `${value.getDate()} ${monthNames[value.getMonth()]}`;
              if (daysBetween < 252 * 3)
                return `${monthNames[value.getMonth()]} '${
                  value.getYear() % 100
                }`;
              return `'${value.getYear() % 100}`;
            },
            background: "white",
          }}
          sliceTooltip={({ slice }) => {
            const { points } = slice;
            if (!points[2]) {
              return null;
            }
            return (
              <div className={styles.toolTip}>
                <p
                  className={styles.toolTipHeader}
                >{`${points[0].data.x.getDate()} ${
                  monthNames[points[0].data.x.getMonth()]
                } '${points[0].data.x.getYear() % 100}`}</p>
                <p className={styles.toolTipExpected}>{`$${
                  points[1].data.y
                } or ${
                  points[1].data.y > props.lastClose ? "+" : ""
                }${Math.round(
                  ((points[1].data.y - props.lastClose) / props.lastClose) * 100
                )}%`}</p>
                <p className={styles.toolTipRange}>
                  {`$${points[2].data.y} to $${points[0].data.y}`}
                </p>
                <p className={styles.toolTipRange}>
                  {`${
                    points[2].data.y > props.lastClose ? "+" : ""
                  }${Math.round(
                    ((points[2].data.y - props.lastClose) / props.lastClose) *
                      100
                  )}% to ${
                    points[0].data.y > props.lastClose ? "+" : ""
                  }${Math.round(
                    ((points[0].data.y - props.lastClose) / props.lastClose) *
                      100
                  )}%`}
                </p>
              </div>
            );
          }}
          axisLeft={null}
          enableGridX={true}
          enableGridY={true}
          pointSize={3}
          pointColor={{ theme: "background" }}
          pointBorderWidth={3}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          // enableArea={(item) => {
          //
          //   return false;
          // }}
          // areaOpacity={1}
          enableSlices="x"
          crosshairType="bottom-right"
          useMesh={true}
          legends={[]}
          lineWidth={2}
          layers={[
            "grid",
            "markers",
            "areas",
            "crosshair",
            "lines",
            "points",
            "slices",
            "mesh",
            "legends",
            "axes",
          ]}
          motionConfig={{
            mass: 1,
            tension: 499,
            friction: 36,
            clamp: true,
            precision: 0.01,
            velocity: 0,
          }}
        />
      </div>
    </div>
  );
}
