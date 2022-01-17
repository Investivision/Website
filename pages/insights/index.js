import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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

let selectedColsSet = new Set();

const getColValuesForSort = (cols) => {
  const out = {};
  cols.forEach((col) => {
    if (col.includes("patterns")) {
      out[col] = (val) => {
        return val.length;
      };
      return;
    }
    out[col] = (val) => val;
  });
  return out;
};

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

  const [controlOpen, setControlOpen] = useState(undefined);

  const [toggledCols, setToggledCols] = useState(new Set(["All"]));
  const [toggledFrames, setToggledFrames] = useState(new Set(["All"]));

  const [showPercentiles, setShowPercentiles] = useState(false);

  const [selectedCols, setSelectedCols] = useState([]);

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

  const [colTypes, timeFrames] = useMemo(() => {
    if (!sortedCols) {
      return [undefined, undefined];
    }
    let types = [];
    let frames = [];
    const visitedColTypes = new Set();
    const visitedTimeFrames = new Set();
    for (const col of sortedCols) {
      let split = col.split(" - ");
      if (split.length == 1) {
        split = col.split(" for ");
      }
      const type = split[0];
      const frame = split[1];
      if (
        type != "Symbol" &&
        !visitedColTypes.has(type) &&
        !type.includes("%ile")
      ) {
        types.push(type);
        visitedColTypes.add(type);
      }
      if (frame && !visitedTimeFrames.has(frame)) {
        frames.push(frame);
        visitedTimeFrames.add(frame);
      }
    }
    console.log("timeFrames", frames);
    frames = frames
      .map((frame) => {
        console.log("timeFrame", frame);
        return frame.toLowerCase().replace("yr", "00yr");
      })
      .sort((a, b) => {
        a = parseInt(a);
        b = parseInt(b);
        return Math.sign(b - a);
      })
      .map((frame) => {
        return frame.replace("00yr", "yr");
      });

    if (toggledCols.has("All")) {
      setToggledCols(new Set(types.filter((type) => !type.includes("%ile")))); //.filter((type) => !type.includes("(%ile)"))
    }
    if (toggledFrames.has("All")) {
      setToggledFrames(new Set(frames));
    }
    return [types, frames];
  }, [sortedCols]);

  const handleButtonToggle = (e, original, set, setter) => {
    if (e.target.value == "All") {
      return setter(new Set(original));
    }
    if (e.target.value == "None") {
      return setter(new Set());
    }
    if (set.has(e.target.value)) {
      set.delete(e.target.value);
    } else {
      set.add(e.target.value);
    }
    console.log("new set", set, setter);
    setter(new Set(set));
  };

  console.log("sortedCols", sortedCols);

  let selectableCols;
  if (sortedCols) {
    selectableCols = sortedCols.filter((col) => {
      console.log("toggled items", toggledCols, toggledFrames);
      let split = col.split(" - ");
      if (split.length == 1) {
        split = col.split(" for ");
      }
      if (split.length == 2 && !toggledFrames.has(split[1])) {
        console.log(
          "filtering col on first condition",
          col,
          split[1],
          Array.from(toggledFrames)
        );
        return false;
      }
      console.log("toggledCols", toggledCols, col, split[0]);
      if (showPercentiles) {
        split[0] = split[0].replace(" (%ile)", "");
      }
      return toggledCols.has(split[0]);
    });
  }

  const valuesForSort = useMemo(() => {
    if (!sortedCols) {
      return {};
    }
    return getColValuesForSort(sortedCols);
  }, [sortedCols]);

  const rowsForGrid = useMemo(() => {
    if (!rows) {
      return undefined;
    }
    console.log(
      "values for sort dict",
      valuesForSort,
      sortAttr,
      valuesForSort[sortAttr]
    );
    return rows.sort((a, b) => {
      a = a[sortAttr];
      b = b[sortAttr];
      if (valuesForSort[sortAttr]) {
        a = valuesForSort[sortAttr](a);
        b = valuesForSort[sortAttr](b);
      }
      // console.log("values for sort dict a b", a, b);
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
    });
  }, [rows, sortAttr, sortDir, valuesForSort]);

  return (
    <HeaderAndFooter
      bodyClassName={styles.body}
      onClick={() => {
        setControlOpen(false);
      }}
    >
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
                const set = new Set(data[0]);
                setCols(set);
                set.delete("Symbol");
                const sorted = ["Symbol", ...Array.from(set).sort()];
                const withoutPercentiles = sorted.filter(
                  (col) => !col.includes("(%ile)")
                );
                selectedColsSet = new Set(withoutPercentiles);
                setSelectedCols(withoutPercentiles);
                setSortedCols(sorted);
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
                window.onbeforeunload = function () {
                  return "test";
                };
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

              <div
                style={{
                  height: "calc(100vh - 100px)",
                  minHeight: 500,
                  width: "100%",
                  // overflow: "scroll",
                }}
              >
                <div className={styles.gridActions}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      const name = "filter";
                      setControlOpen(controlOpen == name ? false : name);
                      e.stopPropagation();
                    }}
                    variant="outlined"
                    color="secondary"
                  >
                    Filter
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => {
                      const name = "columns";
                      setControlOpen(controlOpen == name ? false : name);
                      e.stopPropagation();
                    }}
                    variant="outlined"
                    color="secondary"
                  >
                    Columns
                  </Button>
                  <Button size="small" variant="outlined" color="success">
                    Export
                  </Button>
                </div>
                <Grid
                  cols={selectedCols}
                  allCols={sortedCols}
                  rows={rowsForGrid}
                  sortAttr={sortAttr}
                  sortDir={sortDir}
                  onChange={(params) => {
                    const { dir, attr } = params;
                    console.log("change sort", params);
                    setSortDir(dir);
                    setSortAttr(attr);
                  }}
                  controlOpen={controlOpen}
                >
                  {controlOpen == "filter" ? (
                    <>
                      {filters.map((filter, i) => {
                        return (
                          <Filter
                            cols={cols}
                            showDelete={filters.length > 1}
                            onDelete={() => {
                              setFilters(
                                filters.slice(0, i).concat(filters.slice(i + 1))
                              );
                            }}
                            onChange={(changes) => {
                              setFilters(
                                filters.map((filter, j) =>
                                  j == i
                                    ? Object.assign(filter, changes)
                                    : filter
                                )
                              );
                            }}
                            {...filter}
                          />
                        );
                      })}
                      <div className={styles.controlActions}>
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          sx={{
                            padding: 0,
                          }}
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
                          + New
                        </Button>
                        <Button
                          color="warning"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setControlOpen(false);
                          }}
                        >
                          Exit
                        </Button>
                      </div>
                    </>
                  ) : controlOpen == "columns" ? (
                    <>
                      <p>Features</p>
                      <ToggleButtonGroup
                        size="small"
                        value={Array.from(toggledCols)}
                        onChange={(e) => {
                          handleButtonToggle(
                            e,
                            colTypes,
                            toggledCols,
                            setToggledCols
                          );
                        }}
                      >
                        <ToggleButton
                          value="All"
                          sx={{
                            backgroundColor: theme.palette.primary.dark,
                          }}
                        >
                          All
                        </ToggleButton>
                        {colTypes.map((colType, i) => {
                          return (
                            <ToggleButton key={i} value={colType}>
                              {colType}
                            </ToggleButton>
                          );
                        })}
                        <ToggleButton
                          value="None"
                          sx={{
                            backgroundColor: theme.palette.primary.dark,
                          }}
                        >
                          None
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <FormGroup className={styles.percentileCheckbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={showPercentiles}
                              onChange={(e) =>
                                setShowPercentiles(e.target.checked)
                              }
                              color="secondary"
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 22,
                                },
                              }}
                            />
                          }
                          label="Show Percentiles"
                        />
                      </FormGroup>
                      <p>Time Frames</p>
                      <ToggleButtonGroup
                        size="small"
                        value={Array.from(toggledFrames)}
                        onChange={(e) => {
                          handleButtonToggle(
                            e,
                            timeFrames,
                            toggledFrames,
                            setToggledFrames
                          );
                        }}
                        id="timeFrameToggle"
                      >
                        <ToggleButton
                          value="All"
                          sx={{
                            backgroundColor: theme.palette.primary.dark,
                          }}
                        >
                          All
                        </ToggleButton>
                        {timeFrames.map((frame, i) => {
                          return (
                            <ToggleButton key={i} value={frame}>
                              {frame}
                            </ToggleButton>
                          );
                        })}
                        <ToggleButton
                          value="None"
                          sx={{
                            backgroundColor: theme.palette.primary.dark,
                          }}
                        >
                          None
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <FormGroup className={styles.colsGroup}>
                        {selectableCols.map((col, i) => {
                          return (
                            <FormControlLabel
                              key={col}
                              control={
                                <Checkbox
                                  checked={selectedColsSet.has(col)}
                                  onChange={(e) => {
                                    // todo, just use selectedColsSet.entries()
                                    if (e.target.checked) {
                                      selectedColsSet.add(col);
                                      selectedCols.push(col);
                                    } else {
                                      selectedColsSet.delete(col);
                                      const index = selectedCols.indexOf(col);
                                      if (index > -1) {
                                        selectedCols.splice(index, 1);
                                      }
                                    }
                                    console.log(
                                      "new selectedCols",
                                      selectedCols,
                                      selectedColsSet,
                                      col,
                                      selectedColsSet.has(col)
                                    );
                                    setSelectedCols([...selectedCols]);
                                  }}
                                  color="primary"
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 18,
                                    },
                                  }}
                                />
                              }
                              label={col}
                            />
                          );
                        })}
                      </FormGroup>
                      <div className={styles.controlActions}>
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() => {
                            for (const col of selectableCols) {
                              if (!selectedColsSet.has(col)) {
                                selectedColsSet.add(col);
                                selectedCols.push(col);
                              }
                            }
                            setSelectedCols([...selectedCols]);
                          }}
                        >
                          Check All
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() => {
                            const toRemove = new Set(selectableCols);
                            for (const col of selectableCols) {
                              if (selectedColsSet.has(col)) {
                                selectedColsSet.delete(col);
                              }
                            }

                            setSelectedCols([
                              ...selectedCols.filter(
                                (col) => !toRemove.has(col)
                              ),
                            ]);
                          }}
                        >
                          Check None
                        </Button>
                        <Button
                          color="warning"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setControlOpen(false);
                          }}
                        >
                          Exit
                        </Button>
                      </div>
                    </>
                  ) : null}
                </Grid>
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
