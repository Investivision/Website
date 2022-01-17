import { useMemo } from "react";
import styles from "./grid.module.css";
import SortToggle from "./SortToggle";

const toPercentage = (value) => {
  return Math.round(value * 100 * 10) / 10 + "%";
};

const roundTo2Decimals = (value) => {
  return Math.round(value * 100) / 100;
};

const noop = (value) => {
  return value;
};

const toList = (value) => {
  return value
    .substring(1, value.length - 1)
    .replaceAll("'", "")
    .replaceAll('"', "");
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
  const percentages = [
    "(%ile)",
    "Alpha",
    "Beta",
    "Forecast",
    "Drawdown",
    "Max Gain",
    "Resistance",
    "Support",
  ];
  const rounding = ["Sharpe", "True Range"];
  const out = {};
  cols.forEach((col) => {
    console.log("getting formatting for col", col);
    col = col.replace(", ", "");
    const words = new Set(col.split(" "));
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
        out[col] = toPercentage;
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
        out[col] = roundTo2Decimals;
        return;
      }
    }
    if (words.has("Patterns")) {
      out[col] = toList;
      return;
    }
    out[col] = noop;
  });
  console.log("col formats", out);
  return out;
};

export default function Grid(props) {
  const colFormatters = useMemo(() => {
    return getColFormatters(props.allCols);
  }, [props.allCols]);
  console.log("colFormatters", colFormatters);

  const rowComponents = useMemo(() => {
    return props.rows.slice(0, 100).map((row) => {
      const cells = [];
      for (const col of props.cols) {
        const val = row[col];
        if (val) {
          console.log("push cell", col, val);
          //   console.log(val, colFormatters[col](val));
          cells.push(<td>{colFormatters[col](val)}</td>);
        } else {
          cells.push(<td></td>);
        }
      }
      //   alert("new rows to render");
      console.log("new rows to render", props.rows, props.cols);
      return <tr key={row["Symbol"]}>{cells}</tr>;
    });
  }, [props.rows.map((row) => row.Symbol).join(" "), props.cols]);

  return (
    <div className={styles.div}>
      <div
        className={styles.div}
        style={{
          overflow: props.controlOpen ? "hidden" : "scroll",
        }}
      >
        <table>
          <thead>
            <tr>
              {props.cols.map((col) => {
                return (
                  <th key={col}>
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
