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

// const formatCellValue = (value, col) => {
//   col = col.toLowerCase();
//   if (col.includes("%ile") || col.includes("")) {
//     return toPercentage(value);
//   }
//   if (col.includes("forecast")) return value;
// };

const getColFormatters = (rows, cols) => {
  const percentageCols = new Set(cols);
  const out = {};
  for (const row of rows) {
    for (const col of Array.from(percentageCols)) {
      if (row[col]) {
        if (/[a-zA-Z]/g.test(row[col])) {
          console.log(col, row[col], "is alphabetic");
          percentageCols.delete(col);
          out[col] = noop;
        } else if (row[col] < -5 || row[col] > 5) {
          percentageCols.delete(col);
          console.log(col, row[col], "is not a percentage");
          out[col] = roundTo2Decimals;
        }
      }
    }
  }
  for (const col of Array.from(percentageCols)) {
    out[col] = toPercentage;
  }
  return out;
};

export default function Grid(props) {
  const colFormatters = useMemo(() => {
    return getColFormatters(props.rows, props.cols);
  }, [props.cols]);
  console.log("colFormatters", colFormatters);
  return (
    <div className={styles.wrapper}>
      <table className={styles.table} cellSpacing={0}>
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
        <tbody>
          {props.rows.slice(0, 100).map((row) => {
            const cells = [];
            for (const col of props.cols) {
              const val = row[col];
              if (val) {
                //   console.log(val, colFormatters[col](val));
                cells.push(<td>{colFormatters[col](val)}</td>);
              } else {
                cells.push(<td></td>);
              }
            }
            return <tr key={row["Symbol"]}>{cells}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
