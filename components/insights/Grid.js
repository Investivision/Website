import { useEffect, useMemo, useState, useRef } from "react";
import styles from "./grid.module.css";
import SortToggle from "./SortToggle";
import { useTheme } from "@mui/styles";
import { color } from "@mui/system";
// import AddchartRoundedIcon from "@mui/icons-material/AddchartRounded";
import PlayListAddRounded from "@material-ui/icons/PlaylistAddRounded";
import GradeOutlined from "@material-ui/icons/GradeOutlined";
import Grade from "@material-ui/icons/Grade";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";

let draggedPosition;

const internationalNumberFormat = new Intl.NumberFormat("en-US");

const toPercentage = (value, color) => {
  const val = Math.round(value * 100 * 10) / 10;
  return internationalNumberFormat.format(val) + "%";
};

const roundTo2Decimals = (value, color) => {
  return internationalNumberFormat.format(Math.round(value * 100) / 100);
};

const addPercentSign = (value, color) => {
  return roundTo2Decimals(value) + "%";
};

const toPercentageChange = (value, color) => {
  let val = Math.round(value * 100 * 10) / 10;
  if (val >= 0) {
    val = internationalNumberFormat.format(val) + "%";
    if (val.charAt(0) == "-") {
      val = val.substring(1);
    }
    return "+" + val;
  }
  return internationalNumberFormat.format(val) + "%";
};

const noop = (value, color) => {
  const out = internationalNumberFormat.format(value);
  if (isNaN(out)) return value;
  return out;
};

const toList = (value, color) => {
  console.log(color, "color");
  if (value.length) {
    return value.map((item) => {
      return (
        <span
          className={styles.listItem}
          style={{
            background: color,
          }}
        >
          {item}
        </span>
      );
    });
  }
  return (
    <span
      style={{
        opacity: 0.5,
      }}
    >
      None
    </span>
  );
};

const toDollars = (value, color) => {
  let out = "$" + roundTo2Decimals(value);
  if (out.charAt(out.length - 2) == ".") {
    out += "0";
  }
  return out;
};

const controlMap = {
  filter: "Custom Filters",
  columns: "Show/Hide Columns",
  pref: "Preferences",
};

const cellColors = {
  dark: [
    [255, 0, 0],
    [170, 170, 0],
    [0, 220, 40],
  ],
  light: [
    [255, 0, 0],
    [160, 160, 0],
    [0, 200, 0],
  ],
};

function getCellColor(percentile, mode, opacity) {
  const colors = cellColors[mode];
  const interp = (Math.min(percentile, 0.999999) % 0.5) * 2;
  let lowColor;
  let highColor;
  if (percentile >= 0.5) {
    lowColor = colors[1];
    highColor = colors[2];
  } else {
    lowColor = colors[0];
    highColor = colors[1];
  }
  let out = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    out[i] = lowColor[i] + (highColor[i] - lowColor[i]) * interp;
  }
  // const opacity =
  //   colors[3] + (Math.abs(0.5 - percentile) / 0.5) * (colors[4] - colors[3]);
  out = `rgba(${out}, ${opacity})`; //${(Math.abs(0.5 - percentile) / 0.5) * colors[3]})

  return out;
}

// const formatCellValue = (value, col) => {
//   col = col.toLowerCase();
//   if (col.includes("%ile") || col.includes("")) {
//     return toPercentage(value);
//   }
//   if (col.includes("forecast")) return value;
// };

const getColFormatters = (cols) => {
  const percentageChanges = [
    "%ile",
    "Alpha",
    "Drawdown",
    "Max Gain",
    "Resistance",
    "Support",
    "Cycle Gain",
    "Cycle Loss",
  ];
  const percentages = ["Beta", "Phase", "Cycle Fit"];
  const rounding = [
    "Sharpe",
    "True Range",
    "Relative Direction",
    "Trend Strength",
    "Period",
  ];
  const dollars = ["Last Close"];
  const percentSign = ["AI", "Forecast"];
  const out = {};
  cols.forEach((col) => {
    const originalCol = col;
    col = col.replace(", ", " ");
    const words = new Set(col.split(" "));
    for (let target of percentageChanges) {
      // check that all words exist
      target = target.split(" ");
      let foundMatch = true;
      for (const t of target) {
        if (!words.has(t)) {
          foundMatch = false;
          break;
        }
      }
      if (foundMatch) {
        out[originalCol] = toPercentageChange;
        return;
      }
    }
    for (let target of percentages) {
      target = target.split(" ");
      let foundMatch = true;
      for (const t of target) {
        if (!words.has(t)) {
          foundMatch = false;
          break;
        }
      }
      if (foundMatch) {
        out[originalCol] = toPercentage;
        return;
      }
    }
    for (let target of rounding) {
      target = target.split(" ");
      let foundMatch = true;
      for (const t of target) {
        if (!words.has(t)) {
          foundMatch = false;
          break;
        }
      }
      if (foundMatch) {
        out[originalCol] = roundTo2Decimals;
        return;
      }
    }
    if (words.has("Patterns")) {
      out[originalCol] = toList;
      return;
    }
    for (let target of dollars) {
      if (target == col) {
        out[originalCol] = toDollars;
        return;
      }
    }
    for (let target of percentSign) {
      if (col.startsWith(target)) {
        out[originalCol] = addPercentSign;
        return;
      }
    }
    out[originalCol] = noop;
  });

  return out;
};

export default function Grid(props) {
  const colFormatters = useMemo(() => {
    return getColFormatters(props.allCols);
  }, [props.allCols]);

  const theme = useTheme();

  const rowComponents = useMemo(() => {
    return props.rows.slice(0, 20).map((row) => {
      const cells = [];

      for (const col of props.cols) {
        const val = row[col];
        let colorValue = undefined;
        if (val) {
          if (col == "Symbol") {
            cells.push(
              <td className={styles.symbolCell}>
                <GradeOutlined className={styles.likeIcon} />
                <span>{val}</span>
                <ManageSearchRoundedIcon
                  className={styles.rowExpandIcon}
                  onClick={(e) => {
                    props.onRowClick(val);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  style={
                    val == props.extSymbol
                      ? {
                          opacity: 1,
                        }
                      : {}
                  }
                />
              </td>
            );
            continue;
          }
          if (col != "Symbol" && col != "Last Close") {
            if (col.includes("Patterns")) {
              colorValue = Math.min(val.length * 0.1, 0.5);
              colorValue =
                0.5 + (col.startsWith("Bullish") ? 1 : -1) * colorValue;
            } else if (col.startsWith("Resistance")) {
              const support = row[col.replace("Resistance", "Support")];
              colorValue = Math.min((val / (val - support)) * 0.5, 0.5); // 0.7 just to make more entries be blank
            } else if (col.startsWith("Support")) {
              const res = row[col.replace("Support", "Resistance")];
              colorValue = Math.max(0.5, 1 + (val / (res - val)) * 0.5);
            } else if (col.startsWith("Relative Direction")) {
              colorValue = Math.min((val - 20) / 0.6 / 100, 1);
            } else if (col.startsWith("Trend Strength")) {
              colorValue = Math.min(1, 0.14 * Math.pow(val, 0.45));
            } else if (col.startsWith("Cycle")) {
              if (col.startsWith("Cycle Fit")) {
                colorValue = val;
              } else {
                // const gain = row[col.replace('Loss', 'Gain')]
                // const loss = row[col.replace('Gain', 'Loss')] * (1 + gain)
                // if (col.endsWith('Gain')) {
                //   return 0.5 + gain / loss
                // } else {
                // }
              }
            } else {
              colorValue = col.includes("%")
                ? val
                : row[col.replace(",", " %ile,").replace(" in ", " %ile in ")];
              if (colorValue < 0 || colorValue > 1) {
                colorValue = undefined;
              }
              if (
                col.startsWith("Beta") ||
                col.startsWith("True Range") ||
                col.startsWith("Forecast Range")
              ) {
                colorValue = 1 - colorValue;
              }
            }
          }
          const cellColor = getCellColor(colorValue, theme.palette.type, 1);
          let borderColor;
          if (col.includes("Patterns")) {
            borderColor = getCellColor(colorValue, theme.palette.type, 0.12);
          }
          cells.push(
            <td
              className={colorValue === undefined ? styles.capWidth : ""}
              style={
                colorValue === undefined
                  ? {}
                  : {
                      color: cellColor,
                    }
              }
            >
              {colFormatters[col](val, borderColor)}
            </td>
          );
        } else {
          cells.push(
            <td
              style={{
                opacity: 0.3,
              }}
            >
              n/a
            </td>
          );
        }
      }
      //   alert("new rows to render");
      return <tr key={row["Symbol"]}>{cells}</tr>;
    });
  }, [props.rows, props.cols, props.colorOpacity, props.extSymbol]);

  props.extractScrollPositionFunction(() => {
    tableRef.current.scrollLeft = 0;
  });

  const tableRef = useRef();

  return (
    <div className={styles.div}>
      <div
        className={styles.aroundTable}
        style={{
          overflow: props.controlOpen ? "hidden" : "scroll",
          maxWidth: "100%",
          // height: "100%",
          // minHeight: 400,
          // height: "calc(100vh - 120px)",
          // maxHeight: "660px",
        }}
        ref={tableRef}
      >
        <table>
          <thead>
            <tr>
              {props.cols.map((col, i) => {
                return (
                  <th
                    key={col}
                    index={i}
                    draggable={i > 0}
                    onDragStart={(e) => {
                      // document.body.style.cursor = "move";
                      e.target.style.opacity = 0.3;
                      draggedPosition = i;

                      // e.dataTransfer.effectAllowed = "copyMove";
                    }}
                    onDragEnd={(e) => {
                      e.target.style.opacity = 1;
                    }}
                    onDragOver={(e) => {
                      if (i > 0 && e.target.tagName == "TH") {
                        if (i > draggedPosition) {
                          e.target.style.borderRight = `4px solid ${theme.palette.primary.main}`;
                        } else if (i < draggedPosition) {
                          e.target.style.borderLeft = `4px solid ${theme.palette.primary.main}`;
                        }
                      }

                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onDragLeave={(e) => {
                      e.target.style.borderLeft = "0px solid transparent";
                      e.target.style.borderRight = "0px solid transparent";
                    }}
                    onDrop={(e) => {
                      if (i == 0) {
                        return;
                      }

                      e.target.style.borderLeft = "0px solid transparent";
                      e.target.style.borderRight = "0px solid transparent";
                      if (i > draggedPosition) {
                        const newOrder = [
                          ...props.cols.slice(0, draggedPosition),
                          ...props.cols.slice(draggedPosition + 1, i + 1),
                          props.cols[draggedPosition],
                          ...props.cols.slice(i + 1),
                        ];
                        props.onOrderChange(newOrder);
                      } else if (i < draggedPosition) {
                        const newOrder = [
                          ...props.cols.slice(0, i),
                          props.cols[draggedPosition],
                          ...props.cols.slice(i, draggedPosition),
                          ...props.cols.slice(draggedPosition + 1),
                        ];
                        props.onOrderChange(newOrder);
                      }
                    }}
                  >
                    {col}
                    <SortToggle
                      direction={
                        props.sortAttr == col ? props.sortDir : undefined
                      }
                      onClick={() => {
                        props.onChange({
                          attr: col,
                          dir:
                            props.sortAttr == col
                              ? props.sortDir == "asc"
                                ? "desc"
                                : "asc"
                              : "asc",
                        });
                      }}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{rowComponents}</tbody>
        </table>
      </div>
      <div
        className={styles.overlay}
        style={{
          opacity: props.controlOpen ? 1 : 0,
          pointerEvents: props.controlOpen ? "all" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div>
          <p>{controlMap[props.controlOpen]}</p>
          {props.children}
        </div>
      </div>
    </div>
  );
}
