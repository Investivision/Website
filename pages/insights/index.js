import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { onAuthStateChanged } from "firebase/auth";
import { auth, formatErrorCode } from "../../firebase";
import Skeleton from "@mui/material/Skeleton";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import XLSX from "xlsx";
import Filter from "../../components/insights/Filter";
import Sort from "../../components/insights/Sort";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import { WrapperVariantContext } from "@mui/lab/internal/pickers/wrappers/WrapperVariantContext";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "../../components/insights/Grid";

const sortByBearishCandles = (a, b) => {
  return 0;
};

const sortByBullishCandles = (a, b) => {
  return 0;
};

const commonConfigurations = [
  {
    name: "Stable Long-Term Picks",
    sort: ["Sharpe - 10yr", "desc"],
    desc: "Best Sharpe - 10yr",
  },
  {
    name: "Past-Year Champions",
    sort: ["Alpha - 1yr", "desc"],
    desc: "Best Alpha - 1yr",
  },
  {
    name: "Nearby Expected Rebounds",
    sort: ["Pivot Progress - 3mo", "asc"],
    desc: "Close to Support Line with weak Relative Strength",
  },
  {
    name: "Short-Term Bearish Candles",
    sort: sortByBearishCandles,
    desc: "High net number of bearish candle patterns",
  },
  {
    name: "Short-Term Bullish Candles",
    sort: sortByBullishCandles,
    desc: "High net number of bullish candle patterns",
  },
];

let outsideRows;

export default function Insights() {
  const [downloading, setDownloading] = useState(false);

  const [sortAttr, setSortAttr] = useState("Market Cap");
  const [sortDir, setSortDir] = useState("desc");

  const [filters, setFilters] = useState([
    { feature: "", relation: "", value: "" },
  ]);

  const [firstConfigWidth, setFirstConfigWidth] = useState(0);
  const firstConfigRef = useRef(null);

  const [user, setUser] = useState(undefined);
  const [userLoaded, setUserLoaded] = useState(false);

  const [rows, setRows] = useState(undefined);
  const [cols, setCols] = useState(undefined);
  const [sortedCols, setSortedCols] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setUserLoaded(true);
    });
  }, []);

  console.log(firstConfigRef);
  useEffect(() => {
    if (firstConfigRef.current) {
      setFirstConfigWidth(firstConfigRef.current.clientWidth);
    }
  }, [rows]);

  console.log("filters", filters);

  //   if (!userLoaded) {
  //     return (
  //       <Skeleton
  //         variant="text"
  //         animation="wave"
  //         height={60}
  //         style={{
  //           width: "100%",
  //           maxWidth: 300,
  //           marginTop: 20,
  //         }}
  //         sx={{
  //           transform: "none",
  //         }}
  //       />
  //     );
  //   }

  const theme = useTheme();

  const colors =
    theme.palette.mode == "dark"
      ? [
          "hsl(165, 100%, 25%)",
          "hsl(170, 100%, 24%)",
          "hsl(175, 100%, 22%)",
          "hsl(180, 100%, 24%)",
          "hsl(190, 100%, 25%)",
          "hsl(195, 100%, 26%)",
          "hsl(200, 100%, 27%)",
        ]
      : [
          "hsl(165, 60%, 55%)",
          "hsl(170, 60%, 54%)",
          "hsl(175, 60%, 52%)",
          "hsl(180, 60%, 54%)",
          "hsl(190, 60%, 55%)",
          "hsl(195, 60%, 56%)",
          "hsl(200, 60%, 57%)",
        ];

  if (rows) {
    console.log(
      "table rows",
      rows.map((row) => {
        return { id: row.Symbol, ...row };
      })
    );
  }

  console.log("sortedCols", sortedCols);

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      {!userLoaded ? (
        <>
          <Skeleton
            animation="wave"
            height={60}
            style={{
              width: "100%",
              maxWidth: 300,
              marginTop: 20,
            }}
            sx={{
              transform: "none",
            }}
          />
          <Skeleton
            animation="wave"
            height={30}
            style={{
              width: "100%",
              maxWidth: 700,
              marginTop: 30,
            }}
            sx={{
              transform: "none",
            }}
          />
          <Skeleton
            animation="wave"
            height={30}
            style={{
              width: "100%",
              maxWidth: 300,
              marginTop: 40,
            }}
            sx={{
              transform: "none",
            }}
          />
        </>
      ) : (
        <>
          <h1 className="pageHeader">Insight Library</h1>
          <h2>
            Explore our complete database according to your personalized
            criteria
          </h2>
          {rows === undefined ? (
            <LoadingButton
              variant="contained"
              size="large"
              style={{
                marginTop: 24,
              }}
              loading={downloading}
              onClick={async () => {
                setDownloading(true);
                const res = await fetch("/all.xlsx");
                let start = new Date();
                console.log("res", res);
                var workbook = XLSX.read(
                  new Uint8Array(await res.arrayBuffer()),
                  {
                    type: "array",
                  }
                );
                console.log("read workbook timer", new Date() - start);
                start = new Date();
                console.log(workbook);
                var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
                var data = XLSX.utils.sheet_to_json(first_worksheet, {
                  header: 1,
                });
                console.log("workbook to json timer", new Date() - start);
                start = new Date();
                console.log("xslx data", data);
                setCols(new Set(data[0]));
                setSortedCols(data[0]); //remove sort for now .sort()
                console.log(
                  "set cols and sorted cols timer",
                  new Date() - start
                );
                start = new Date();
                const myRows = data.slice(1).map((row) => {
                  const obj = {};
                  for (let i = 0; i < data[0].length; i++) {
                    obj[data[0][i]] = row[i];
                  }
                  return obj;
                });
                console.log("transform rows timer", new Date() - start);
                start = new Date();
                outsideRows = myRows;
                console.log("set outsideRows timer", new Date() - start);
                start = new Date();
                // let rows = [];
                // for (const row of data.slice(1)) {
                //   const obj = {};
                //   for (let i = 0; i < data[0].length; i++) {
                //     obj[data[0][i]] = row[i];
                //   }
                //   rows.push(obj);
                // }
                setRows(myRows);
                console.log("set rows timer", new Date() - start);
                setDownloading(false);
              }}
              disabled={rows !== undefined}
            >
              {rows === undefined
                ? "First, Download Today's Insights"
                : "Data Downloaded"}
            </LoadingButton>
          ) : (
            <>
              <h3>Common Configurations</h3>
              <div className={styles.configContainer}>
                <div
                  className={styles.spacer}
                  style={
                    firstConfigRef.current
                      ? {
                          minWidth: `calc(50% - ${
                            firstConfigWidth / 2 + 10
                          }px)`,
                        }
                      : {}
                  }
                ></div>
                {commonConfigurations.map((config, i) => {
                  return (
                    <div
                      key={i}
                      ref={i == 0 ? firstConfigRef : null}
                      onClick={() => {
                        if (config.sort) {
                          setSortAttr(config.sort[0]);
                          setSortDir(config.sort[1]);
                        }
                      }}
                      style={{
                        backgroundColor:
                          colors[Math.floor(Math.random() * colors.length)],
                      }}
                      className={styles.config}
                    >
                      <h5>{config.name}</h5>
                      <p>{config.desc}</p>
                    </div>
                  );
                })}
              </div>
              <h3>Your Configurations</h3>
              <div className={styles.configContainer}>
                <div
                  className={styles.spacer}
                  style={
                    firstConfigRef.current
                      ? {
                          minWidth: `calc(50% - ${
                            firstConfigWidth / 2 + 10 + 160
                          }px)`,
                        }
                      : {}
                  }
                ></div>
                <div
                  onClick={() => {
                    alert("will save");
                  }}
                  className={`${styles.config} ${styles.configAdd}`}
                >
                  <p>Save Current Configuration</p>
                </div>
                {commonConfigurations.map((config, i) => {
                  return (
                    <div
                      key={i}
                      ref={i == 0 ? firstConfigRef : null}
                      onClick={() => {
                        if (config.sort) {
                          setSortAttr(config.sort[0]);
                          setSortDir(config.sort[1]);
                        }
                      }}
                      style={{
                        backgroundColor:
                          colors[Math.floor(Math.random() * colors.length)],
                      }}
                      className={styles.config}
                    >
                      <h5>{config.name}</h5>
                      <p>{config.desc}</p>
                    </div>
                  );
                })}
              </div>
              <h3>Advanced</h3>
              <div className={styles.advanced}>
                <div className={styles.controlSection}>
                  <h4>Columns</h4>
                  <div className={styles.buttonGroup}>
                    <div>
                      <Button size="small">Select All</Button>
                      <Button size="small">Uncheck All</Button>
                    </div>
                    <div>
                      <Button size="small">Select All Percentiles</Button>
                      <Button size="small">Uncheck All Percentiles</Button>
                    </div>
                    <div>
                      <Button size="small">Select All 10yr</Button>
                      <Button size="small">Select All 5yr</Button>
                      <Button size="small">Select All 1yr</Button>
                      <Button size="small">Select All 3mo</Button>
                    </div>
                  </div>
                  <FormGroup className={styles.colsGroup}>
                    {Array.from(cols)
                      .sort()
                      .map((col, i) => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked
                                color="primary"
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 18,
                                  },
                                }}
                              />
                            }
                            label={col}
                            key={i}
                          />
                        );
                      })}
                  </FormGroup>
                </div>
                <div className={styles.controlSection}>
                  <h4>Filters</h4>
                  {filters.map((filter, i) => {
                    return (
                      <Filter
                        cols={cols}
                        onDelete={() => {
                          setFilters(
                            filters.slice(0, i).concat(filters.slice(i + 1))
                          );
                        }}
                        onChange={(changes) => {
                          setFilters(
                            filters.map((filter, j) =>
                              j == i ? Object.assign(filter, changes) : filter
                            )
                          );
                        }}
                        {...filter}
                      />
                    );
                  })}
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={
                      {
                        // padding: 0,
                      }
                    }
                    onClick={() => {
                      setFilters([
                        ...filters,
                        {
                          feature: "",
                          relation: "",
                          value: "",
                        },
                      ]);
                    }}
                  >
                    + new
                  </Button>
                </div>
                {/* <div className={styles.controlSection}>
                  <h4>Sorting</h4>
                  <Sort
                    cols={sortedCols}
                    dir={sortDir}
                    attr={sortAttr}
                    onChange={(changes) => {
                      if (changes.attr) {
                        setSortAttr(changes.attr);
                      }
                      if (changes.dir) {
                        setSortDir(changes.dir);
                      }
                    }}
                  />
                </div> */}
              </div>
              <div
                style={{
                  height: "calc(100vh - 100px)",
                  minHeight: 500,
                  width: "100%",
                  // overflow: "scroll",
                }}
              >
                <Grid
                  cols={sortedCols}
                  rows={rows.sort((a, b) => {
                    a = a[sortAttr];
                    b = b[sortAttr];
                    if (!a && !b) {
                      return 0;
                    }
                    if (!a) {
                      return 1;
                    }
                    if (!b) {
                      return -1;
                    }
                    let res = a > b ? 1 : a < b ? -1 : 0;
                    if (sortDir == "asc") {
                      res *= -1;
                    }
                    return res;
                  })}
                  sortAttr={sortAttr}
                  sortDir={sortDir}
                  onChange={(params) => {
                    const { dir, attr } = params;
                    console.log("change sort", params);
                    setSortDir(dir);
                    setSortAttr(attr);
                  }}
                />
                {/* <DataGrid
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  rows={rows.map((row) => {
                    return { id: row.Symbol, ...row };
                  })}
                  columns={sortedCols.map((col) => {
                    return {
                      field: col,
                      headerName: col,
                      width: 20 + col.length * 9,
                    };
                  })}
                /> */}
              </div>
            </>
          )}
        </>
      )}
    </HeaderAndFooter>
  );
}
