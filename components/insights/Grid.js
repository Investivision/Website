import { useEffect, useMemo, useState, useRef } from "react";
import styles from "./grid.module.css";
import SortToggle from "./SortToggle";
import { useTheme } from "@mui/styles";
import Tooltip from "../ext/ToolTip";
import { color } from "@mui/system";

let draggedPosition;

const internationalNumberFormat = new Intl.NumberFormat("en-US");

const toPercentage = (value) => {
  const val = Math.round(value * 100 * 10) / 10;
  return internationalNumberFormat.format(val) + "%";
};

const addPercentSign = (value) => {
  return internationalNumberFormat.format(value) + "%";
};

const toPercentageChange = (value) => {
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

const roundTo2Decimals = (value) => {
  return internationalNumberFormat.format(Math.round(value * 100) / 100);
};

const noop = (value) => {
  const out = internationalNumberFormat.format(value);
  if (isNaN(out)) return value;
  return out;
};

const toList = (value) => {
  if (value.length) {
    return value.map((item) => {
      return <span className={styles.listItem}>{item}</span>;
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

const toDollars = (value) => {
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
  dark: [[255, 0, 0], [170, 170, 0], [0, 220, 40], 0.5, 0.7],
  light: [[255, 0, 0], [170, 170, 0], [0, 255, 0], 0.7, 1],
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
  ];
  const percentages = ["Beta"];
  const rounding = [
    "Sharpe",
    "True Range",
    "Relative Direction",
    "Trend Strength",
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

let toolTipTimeout;

export default function Grid(props) {
  const colFormatters = useMemo(() => {
    return getColFormatters(props.allCols);
  }, [props.allCols]);

  const [toolTipOpen, setToolTipOpen] = useState(false);

  const theme = useTheme();

  const rowComponents = useMemo(() => {
    return props.rows.slice(0, 20).map((row) => {
      const cells = [];

      for (const col of props.cols) {
        const val = row[col];
        let colorValue = undefined;
        if (val) {
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

          cells.push(
            <td
              className={col == "Name" ? styles.capWidth : ""}
              style={
                colorValue === undefined
                  ? {}
                  : {
                      backgroundColor: getCellColor(
                        colorValue,
                        theme.palette.type,
                        props.colorOpacity
                      ),
                    }
              }
            >
              {colFormatters[col](val)}
            </td>
          );
        } else {
          cells.push(
            <td
              style={{
                opacity: 0.5,
              }}
            >
              n/a
            </td>
          );
        }
      }
      //   alert("new rows to render");
      return (
        <tr
          key={row["Symbol"]}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onRowClick(row["Symbol"]);
            clearTimeout(toolTipTimeout);
            setToolTipOpen(false);
          }}
        >
          {cells}
        </tr>
      );
    });
  }, [props.rows, props.cols, props.colorOpacity]);

  // useEffect(() => {
  //   if (props.children) {
  //     window.alert("found children");
  //     if (toolTipTimeout) {
  //       clearInterval(toolTipTimeout);
  //       setToolTipOpen(false);
  //     }
  //   }
  // }, [props.children]);
  props.extractScrollPositionFunction(() => {
    tableRef.current.scrollLeft = 0;
  });

  const tableRef = useRef();

  return (
    <Tooltip
      id="tableTooltip"
      className={styles.toolTip}
      open={toolTipOpen}
      title="Click on row to open in graphical view"
      followCursor
      // style={{
      //   textAlign: "center",
      //   maxWidth: "none",
      // }}
      onMouseEnter={() => {
        if (!props.children) {
          if (toolTipTimeout) {
            clearTimeout(toolTipTimeout);
          }
          toolTipTimeout = setTimeout(() => {
            setToolTipOpen(true);
            toolTipTimeout = setTimeout(() => {
              setToolTipOpen(false);
            }, 7000);
          }, 4000);
        }
      }}
      onMouseLeave={() => {
        if (toolTipTimeout) {
          clearTimeout(toolTipTimeout);
        }
        setToolTipOpen(false);
      }}
    >
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
    </Tooltip>
  );
}
