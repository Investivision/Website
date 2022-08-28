import styles from "./cycle.module.css";
import Numeric from "./Numeric";
import UpgradeButton from "./UpgradeButton";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "./ToolTip";
import NotFound from "./NotFound";

import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { useTheme } from "@mui/styles";
import {
  OutdoorGrillRounded,
  OutlinedFlag,
  PlusOneSharp,
} from "@material-ui/icons";

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

export default function Cycle(props) {
  //   const { cycamp, period, periodO, cycslope, cycO, cycfit } = props;

  console.log("cycle props", props);

  const theme = useTheme();

  //   for (const val in [cycamp, period, periodO, cycslope, cycO, cycfit]) {
  //     if (val === undefined) {
  //       return <UpgradeButton port={props.port} />;
  //     }
  //   }
  if (
    !(
      props.data.cycargs !== undefined &&
      props.data.cycfit !== undefined &&
      props.data.cycup !== undefined &&
      props.data.cycdown !== undefined &&
      props.data.period !== undefined &&
      props.data.phase !== undefined
    )
  ) {
    if (props.data.sup) {
      return <NotFound message="No fluctuating cycle found" />;
    }
    return <UpgradeButton port={props.port} />;
  }

  if (props.data.cycup < 0 || props.data.cycdown < 0) {
    return <NotFound message="No fluctuating cycle found" />;
  }

  const [amp, period, phase, slope, yOffset] = props.data.cycargs;

  const daysBetween = period * 2;

  const resolution = 15; // points per cycle

  // let beforePoints = [];
  let insidePoints = [];
  // let afterPoints = [];

  const extrema = [];

  const now = new Date();

  function wave(x, p = phase) {
    return (
      -amp * Math.cos(2 * Math.PI * (x / period + p)) + slope * x + yOffset
    );
  }

  const msPeriod = (period * 24 * 3600 * 1000 * 7) / 5;

  const msAgoCycleStart = msPeriod * phase;

  // for (let i = -2; i <= 4; i++) {
  //   const instant = new Date();
  //   instant.setTime(now.getTime() - msAgoCycleStart + (i * msPeriod) / 2);
  //   const point = {
  //     x: instant,
  //     p: (i * period) / 2,
  //     y: wave((i * period) / 2, 0),
  //   };
  //   if (i <= 0) {
  //     beforePoints.push(point);
  //   }
  //   if (i >= 0 && i <= 2) {
  //     insidePoints.push(point);
  //   }
  //   if (i >= 2) {
  //     afterPoints.push(point);
  //   }
  // }

  // const numPointsBetween = 10;

  // function interpolatePoints(points) {
  //   debugger;
  //   const out = [points[0]];
  //   for (let i = 0; i < points.length - 1; i++) {
  //     const x1 = points[i].p;
  //     const x2 = points[i + 1].p;
  //     console.log("cycle plot 1");
  //     for (let j = 0; j < numPointsBetween; j++) {
  //       const instance = new Date();
  //       instance.setTime(
  //         points[i].x.getTime() +
  //           ((j + 1) * msPeriod) / 2 / (numPointsBetween + 1)
  //       );
  //       console.log("cycle plot 2");
  //       const point = {
  //         x: instance,
  //         y: wave(x1 + ((x2 - x1) / (numPointsBetween + 1)) * (j + 1), 0),
  //       };
  //       console.log("cycle plot 3");
  //       out.push(point);
  //       console.log("cycle plot 4");
  //     }
  //     out.push(points[i + 1]);
  //     console.log("cycle plot 5");
  //   }
  //   console.log("cycle plot 6");
  //   return out;
  // }

  // beforePoints = interpolatePoints(beforePoints);
  // afterPoints = interpolatePoints(afterPoints);
  // insidePoints = interpolatePoints(insidePoints);

  for (let i = -resolution; i < resolution; i++) {
    const instant = new Date();
    instant.setTime(now.getTime() + (i / resolution) * msPeriod);
    const point = {
      x: instant,
      y: wave((i / resolution) * period),
    };
    insidePoints.push(point);
    // if (i < -phase * resolution) {
    //   beforePoints.push(point);
    // } else if (i > (1 - phase) * resolution) {
    //   afterPoints.push(point);
    // } else {
    //   insidePoints.push(point);
    // }
  }

  const cycleStart = new Date();
  cycleStart.setTime(now.getTime() - phase * msPeriod);

  const cycleEnd = new Date();
  cycleEnd.setTime(now.getTime() - phase * msPeriod + msPeriod);

  // insidePoints = [
  //   {
  //     x: instant,
  //     y: wave(-phase * period),
  //   },
  //   ...insidePoints,
  //   {
  //     x: instant2,
  //     y: wave(-phase * period + period),
  //   },
  // ];

  // beforePoints.push(insidePoints[0]);
  // afterPoints = [insidePoints[insidePoints.length - 1], ...afterPoints];

  //   console.log(
  //     "cycle points",
  //     points,
  //     amp,
  //     period,
  //     phase,
  //     slope,
  //     yOffset,
  //     wave((10 / resolution) * period)
  //   );

  const data = [
    // {
    //   id: "Before" + props.global.symbol,
    //   color:
    //     theme.palette.mode == "dark"
    //       ? theme.palette.primary.main + "80"
    //       : theme.palette.primary.main + "40",
    //   data: beforePoints,
    // },
    // {
    //   id: "After" + props.global.symbol,
    //   color:
    //     theme.palette.mode == "dark"
    //       ? theme.palette.primary.main + "80"
    //       : theme.palette.primary.main + "40",
    //   data: afterPoints,
    // },
    {
      id: "Inside" + props.global.symbol,
      color:
        theme.palette.mode == "dark"
          ? theme.palette.primary.light
          : theme.palette.primary.main,
      data: insidePoints,
    },
  ];

  const lineColor =
    theme.palette.mode == "dark"
      ? theme.palette.primary.light
      : theme.palette.primary.main;

  const outsideColor =
    theme.palette.mode == "dark"
      ? theme.palette.primary.main + "60"
      : theme.palette.primary.main + "40";

  console.log("theme", theme);

  return (
    <>
      <Numeric
        percentile={props.data.cycfit}
        value={`${Math.round(props.data.cycfit * 1000) / 10}%`}
        desc={"Cycle Fit"}
        style={{
          margin: 4,
        }}
        toolTip={`Goodness of fit to a cyclic price movement pattern into the future`}
      />
      <div>
        <ArrowBox
          upPercent={props.data.cycup * 100}
          downPercent={props.data.cycdown * 100}
        />
        <Tooltip title="Cyclical stock price rise and fall" arrow>
          <p
            style={{
              fontSize: 13,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Cycle Movement
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
      <div className={styles.phaseStudy}>
        <p className={styles.phase}>
          {Math.round(props.data.phase * 1000) / 10 + "%"}
        </p>
        <p className={styles.phaseSentence}>{`Day ${Math.round(
          props.data.period * props.data.phase
        )} of ${Math.round(props.data.period)} (Period)`}</p>
        <Tooltip
          title="The current progression through a standard cycle. 0% denotes the first low, 50% the peak, and 100% the final low."
          arrow
        >
          <p
            style={{
              fontSize: 13,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            Phase
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
        <div className={styles.plot}>
          <svg
            style={{
              maxHeight: 0,
              maxWidth: 0,
            }}
          >
            <defs aria-hidden="true">
              <linearGradient
                id="gradientA"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
                gradientTransform="rotate(-90, 0.5, 0.5)"
              >
                <stop
                  offset="0%"
                  stop-color={outsideColor}
                  stop-opacity="1"
                ></stop>
                <stop
                  offset={`${50 - 50 * phase}%`}
                  stop-color={outsideColor}
                  stop-opacity="1"
                ></stop>
                <stop
                  offset={`${50 - 50 * phase}%`}
                  stop-color={lineColor}
                  stop-opacity="1"
                ></stop>
                <stop
                  offset={`${100 - 50 * phase}%`}
                  stop-color={lineColor}
                  stop-opacity="1"
                ></stop>
                <stop
                  offset={`${100 - 50 * phase}%`}
                  stop-color={outsideColor}
                  stop-opacity="1"
                ></stop>
                <stop
                  offset="100%"
                  stop-color={outsideColor}
                  stop-opacity="1"
                ></stop>
              </linearGradient>
            </defs>
          </svg>
          <ResponsiveLine
            data={data}
            // defs={[
            //   linearGradientDef(
            //     "gradientA",
            //     [
            //       { offset: 0, color: outsideColor },
            //       { offset: 10, color: outsideColor },
            //       { offset: 10, color: lineColor },
            //       { offset: 60, color: lineColor },
            //       { offset: 60, color: outsideColor },
            //       { offset: 100, color: outsideColor },
            //     ],
            //     {
            //       gradientTransform: "rotate(180 0.5 0.5)",
            //     }
            //   ),
            // ]}
            theme={{
              fontSize: 12,
              fontFamily: "rubik",
              color: "red",
              grid: {
                line: {
                  stroke: theme.palette.mode == "dark" ? "#444" : "#ccc",
                  strokeWidth: 2,
                },
              },
            }}
            margin={{ top: 5, right: 20, bottom: 26, left: 20 }}
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
              base: 1,
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,

              // ((val - props.lastClose) / props.lastClose) * 100 - 100
            }}
            curve="basis"
            // colors={(d) => d.color}
            colors={["url(#gradientA)"]}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickValues: [cycleStart, cycleEnd], //daysBetween < 150 ? 4 : 5,
              tickSize: 0,
              tickPadding: 4,
              tickRotation: 0,
              format: (value) => {
                if (daysBetween < 150)
                  return `${value.getDate()} ${monthNames[value.getMonth()]}`;

                return `${monthNames[value.getMonth()]} '${
                  value.getYear() % 100
                }`;
              },
              background: "white",
            }}
            // gridXValues={[cycleStart, cycleEnd]}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            enablePoints={false}
            // enableArea={(item) => {
            //
            //   return false;
            // }}
            // areaOpacity={1}
            // enableSlices="x"
            // crosshairType="bottom-right"
            useMesh={false}
            legends={[]}
            lineWidth={4}
            layers={[
              "areas",
              "crosshair",
              "lines",
              "points",
              "slices",
              "mesh",
              "legends",
              "axes",
              "markers",
              "grid",
            ]}
            motionConfig={{
              mass: 1,
              tension: 499,
              friction: 36,
              clamp: true,
              precision: 0.01,
              velocity: 0,
            }}
            markers={[
              {
                axis: "x",
                value: now,
                lineStyle: {
                  stroke: theme.palette.mode == "dark" ? "#ffffff" : "#000000",
                  strokeWidth: 2,
                  strokeOpacity: 1,
                  strokeDasharray: "6 6",
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function ArrowBox({ upPercent, downPercent }) {
  // downPercent = -downPercent;
  const origUpPercent = upPercent;
  const origDownPercent = downPercent;
  // debugger;
  if (upPercent > downPercent) {
    downPercent *= 1 + upPercent / 100;
  } else {
    upPercent *= 1 + downPercent / 100;
  }

  const downwards = downPercent > upPercent;
  const width = 40;
  const height = 100;
  const strokeWidth = 8;

  const max = Math.max(upPercent, downPercent);

  const downYOffset = !downwards ? height * (1 - downPercent / upPercent) : 0;
  const upYOffset = downwards ? height * (1 - upPercent / downPercent) : 0;

  const downBottom = downYOffset + (downPercent / max) * height;
  const upBottom = upYOffset + (upPercent / max) * height;

  return (
    <div className={styles.arrowContainer}>
      <div
        className={styles.arrowLabel}
        style={{
          top: `${
            ((downYOffset + (downBottom - downYOffset) / 2) / height) * 100
          }%`,
        }}
      >
        <p>{`-${Math.round(origDownPercent)}%`}</p>
        <p>Down</p>
      </div>
      <svg className={styles.arrowSvg} viewBox={`0 0 ${width} ${height}`}>
        {/* <defs>
        <marker
          id="arrow"
          //   markerWidth={strokeWidth * 10}
          //   markerHeight={strokeWidth * 10}
          refX="center"
          refY="center"
          orient="auto"
          markerUnits="strokeWidth"
          viewBox="0 0 10 10"
        >
          <polyline points="0 0, 10 5, 0 10" fill="none" stroke="red" />
        </marker>
      </defs> */}
        <line
          className={styles.down}
          x1={strokeWidth}
          y1={downYOffset}
          x2={strokeWidth}
          y2={downBottom}
          strokeWidth={strokeWidth}
          markerStart="url(#arrow)"
          strokeLinecap="round"
        />
        <polyline
          className={styles.down}
          points={`0 ${height - strokeWidth}, ${strokeWidth} ${height} , ${
            strokeWidth * 2
          } ${height - strokeWidth}`}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          className={styles.up}
          x1={width - strokeWidth}
          y1={upYOffset}
          x2={width - strokeWidth}
          y2={upBottom}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <polyline
          className={styles.up}
          points={`${width - strokeWidth * 2} ${upYOffset + strokeWidth}, ${
            width - strokeWidth
          } ${upYOffset} , ${width} ${upYOffset + strokeWidth}`}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* <line x1={0} y1={0} x2={0} y2={100} stroke="red" strokeWidth={strokeWidth} /> */}
      </svg>
      <div
        className={styles.arrowLabel}
        style={{
          top: `${((upYOffset + (upBottom - upYOffset) / 2) / height) * 100}%`,
        }}
      >
        <p>{`+${Math.round(origUpPercent)}%`}</p>
        <p>Up</p>
      </div>
    </div>
  );
}
