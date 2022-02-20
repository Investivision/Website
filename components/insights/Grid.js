import { useMemo, useState } from "react";
import styles from "./grid.module.css";
import SortToggle from "./SortToggle";
import { useTheme } from "@mui/material/styles";
import Tooltip from "../ext/ToolTip";

let draggedPosition;

const toPercentage = (value) => {
  const val = Math.round(value * 100 * 10) / 10;
  return val + "%";
};

const toPercentageChange = (value) => {
  const val = Math.round(value * 100 * 10) / 10;
  if (val >= 0) {
    return "+" + val + "%";
  }
  return val + "%";
};

const roundTo2Decimals = (value) => {
  return Math.round(value * 100) / 100;
};

const noop = (value) => {
  return value;
};

const toList = (value) => {
  return value.join(", ");
};

const controlMap = {
  filter: "Custom Filters",
  columns: "Show/Hide Columns",
};

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
    "Forecast",
    "Drawdown",
    "Max Gain",
    "Resistance",
    "Support",
  ];
  const percentages = ["Beta"];
  const rounding = ["Sharpe", "True Range"];
  const out = {};
  cols.forEach((col) => {
    console.log("getting formatting for col", col);
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
    if (originalCol == "Last Close") {
      out[originalCol] = roundTo2Decimals;
      return;
    }
    out[originalCol] = noop;
  });
  console.log("col formats", out);
  return out;
};

let toolTipTimeout;

export default function Grid(props) {
  const colFormatters = useMemo(() => {
    return getColFormatters(props.allCols);
  }, [props.allCols]);
  console.log("colFormatters", colFormatters);

  const [toolTipOpen, setToolTipOpen] = useState(false);

  const theme = useTheme();

  const rowComponents = useMemo(() => {
    return props.rows.slice(0, 20).map((row) => {
      const cells = [];
      for (const col of props.cols) {
        const val = row[col];
        if (val) {
          console.log("push cell", col, val, colFormatters);
          console.log(val, colFormatters[col](val));
          cells.push(
            <td className={col == "Name" ? styles.capWidth : ""}>
              {colFormatters[col](val)}
            </td>
          );
        } else {
          cells.push(<td></td>);
        }
      }
      //   alert("new rows to render");
      console.log("new rows to render", props.rows, props.cols);
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
  }, [props.rows, props.cols]);

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
        if (toolTipTimeout) {
          clearTimeout(toolTipTimeout);
        }
        toolTipTimeout = setTimeout(() => {
          setToolTipOpen(true);
          toolTipTimeout = setTimeout(() => {
            setToolTipOpen(false);
          }, 7000);
        }, 4000);
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
          style={{
            overflow: props.controlOpen ? "hidden" : "scroll",
            maxWidth: "100%",
            height: "100%",
            minHeight: 400,
            maxHeight: "calc(100vh - 100px)",
          }}
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
                        console.log("drag start", e);
                        // document.body.style.cursor = "move";
                        e.target.style.opacity = 0.3;
                        draggedPosition = i;

                        // e.dataTransfer.effectAllowed = "copyMove";
                      }}
                      onDragEnd={(e) => {
                        console.log("drag end");
                        e.target.style.opacity = 1;
                      }}
                      onDragOver={(e) => {
                        if (i > 0 && e.target.tagName == "TH") {
                          if (i > draggedPosition) {
                            e.target.style.borderRight = "4px solid red";
                          } else if (i < draggedPosition) {
                            e.target.style.borderLeft = "4px solid red";
                          }
                        }
                        console.log(
                          "drag over",
                          e.target.innerText,
                          i > draggedPosition
                        );
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
                        console.log("drop", e.target.innerText);
                        e.target.style.borderLeft = "0px solid transparent";
                        e.target.style.borderRight = "0px solid transparent";
                        if (i > draggedPosition) {
                          const newOrder = [
                            ...props.cols.slice(0, draggedPosition),
                            props.cols.slice(draggedPosition + 1, i + 1),
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
