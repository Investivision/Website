import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTheme } from "@mui/styles";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import Skeleton from "@mui/material/Skeleton";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import XLSX from "xlsx";
import Filter from "../../components/insights/Filter";
import Sort from "../../components/insights/Sort";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "../../components/insights/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import ArrowIcon from "@material-ui/icons/ArrowForwardIosRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import { v4 as uuidv4 } from "uuid";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@material-ui/core";
import ExtView from "../ext";
import { useRouter } from "next/router";
import Slider from "@mui/material/Slider";
import { NextSeo } from "next-seo";
import {
  tryToExtractExistingInsights,
  pullRemoteInsights,
  getExistingSymbolInsights,
  getRemoteUserConfigs,
  setRemoteUserConfig,
  getLikes,
  likeSymbol,
  unlikeSymbol,
} from "../../utils/insights";
import commonConfigurations from "../../utils/commonConfigurations";
import { getCalendarPickerSkeletonUtilityClass } from "@mui/lab";

let tempFilters = [{ feature: "", relation: "", value: "", valid: true }];
let filterChanges = false;

let tempSelectedCols = [];
let selectedColsSet = new Set();
let selectedColsChanges = false;

let scrollPositionFunction;

// extend the string prototype to title case
String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var workbook;

let prevSortedRows = undefined;

const getColValuesForSort = (cols) => {
  const out = {};
  cols.forEach((col) => {
    if (col.includes("Patterns")) {
      out[col] = (val) => {
        return val?.length || 0;
      };
      return;
    }
    out[col] = (val) => val;
  });
  return out;
};

let prevSortAttr = undefined;
let prevSortDir = undefined;

let symbolForExt = undefined;

export default function Insights() {
  const router = useRouter();

  const [downloading, setDownloading] = useState(false);

  const [sortAttr, setSortAttr] = useState("Market Cap");
  const [sortDir, setSortDir] = useState("asc");

  const [filters, setFilters] = useState([]);

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

  const [pageSize, setPageSize] = useState(20);

  const [currentPage, setCurrentPage] = useState(1);

  const pageTextFieldRef = useRef();

  const [checkboxRerender, setCheckboxRerender] = useState(0);

  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigDesc, setNewConfigDesc] = useState("");

  const [userConfigs, setUserConfigs] = useState([]);

  const [configToDelete, setConfigToDelete] = useState(undefined);
  const [deleteConfigLoading, setDeleteConfigLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);

  const [dataForExt, setDataForExt] = useState(undefined);
  const [extOpen, setExtOpen] = useState(false);

  const [sliderRerender, setSliderRerender] = useState(0);

  const gridRef = useRef(null);

  const [likes, setLikes] = useState(new Set());

  const handleExtractWorkbook = useCallback((result) => {
    const { cols, selectedCols, sortedCols, rows, wb } = result;
    setCols(cols);
    setSelectedCols(selectedCols);
    setSortedCols(sortedCols);
    setRows(rows);
    workbook = wb;
    selectedColsSet = new Set(selectedCols);
    tempSelectedCols = [...selectedCols];
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await auth.currentUser.getIdTokenResult(true);
        if (token.claims.role !== "buffet") {
          setUser(undefined);
          setUserLoaded(true);
        } else {
          setUser(user);
          setUserLoaded(true);
          setDownloading(true);
          const existing = await tryToExtractExistingInsights();
          if (existing) {
            handleExtractWorkbook(existing);
            setUserConfigs(await getRemoteUserConfigs());
            setLikes(await getLikes());
          }
          setDownloading(false);
        }
      } else {
        setUser(undefined);
        setUserLoaded(true);
      }
    });
  }, []);

  const handleControlChange = () => {
    if (filterChanges) {
      setFilters([...tempFilters]);
      filterChanges = false;
    }
    if (selectedColsChanges) {
      setSelectedCols([...tempSelectedCols]);
      selectedColsChanges = false;
    }
  };

  const theme = useTheme();

  const colors =
    theme.palette.mode == "dark"
      ? [theme.palette.primary.main + "50"]
      : [theme.palette.primary.main + "24"];

  const [colTypes, timeFrames] = useMemo(() => {
    // extract all column types (base, not including %ile) and timeframes
    if (!sortedCols) {
      return [undefined, undefined];
    }
    let types = [];
    let frames = [];
    const visitedColTypes = new Set();
    const visitedTimeFrames = new Set();
    for (const col of sortedCols) {
      let split = col.split(", ");
      if (split.length == 1) {
        split = col.split(" in ");
      }
      const type = split[0];
      const frame = split[1];
      if (
        type != "Symbol" &&
        !visitedColTypes.has(type) &&
        !type.includes("%ile") // this prevents P and Pr
      ) {
        types.push(type);
        visitedColTypes.add(type);
      }
      if (frame && !visitedTimeFrames.has(frame)) {
        frames.push(frame);
        visitedTimeFrames.add(frame);
      }
    }
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
    setter(new Set(set));
  };

  const selectableCols = useMemo(() => {
    if (!sortedCols) {
      return undefined;
    }
    return sortedCols.filter((col) => {
      if (col == "Symbol") {
        return false;
      }
      let split = col.split(", ");
      if (split.length == 1) {
        split = col.split(" in ");
      }
      if (split.length == 2 && !toggledFrames.has(split[1])) {
        return false;
      }
      if (showPercentiles) {
        split[0] = split[0].replace(" %ile", "");
      }

      return toggledCols.has(split[0]);
    });
  }, [sortedCols, toggledCols, toggledFrames, showPercentiles]);

  const valuesForSort = useMemo(() => {
    if (!sortedCols) {
      return {};
    }
    return getColValuesForSort(sortedCols);
  }, [sortedCols]);

  const sortedRows = useMemo(() => {
    if (!rows) {
      return undefined;
    }
    let out = [...rows];
    if (sortAttr == prevSortAttr && sortDir != prevSortDir) {
      return [...prevSortedRows].reverse();
    }
    out = out.sort((a, b) => {
      a = a[sortAttr];
      b = b[sortAttr];
      if (valuesForSort[sortAttr]) {
        a = valuesForSort[sortAttr](a);
        b = valuesForSort[sortAttr](b);
      }
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
    return out; // spread to create new object
  }, [rows, sortAttr, sortDir, valuesForSort]);

  prevSortedRows = sortedRows;

  const filteredRows = useMemo(() => {
    if (!sortedRows) {
      return undefined;
    }
    let filtered = [...sortedRows];
    for (const filter of filters) {
      let { feature, relation, value, valid } = filter;
      if (value) {
        for (const col of cols) {
          value = value.replace(col, `row["${col}"]`);
        }
      }
      if (
        feature &&
        relation &&
        (value || relation == "exists") &&
        valid != false
      ) {
        let op;
        if (relation == "=") {
          op = "LEFT == RIGHT";
        } else if (relation == ">") {
          op = "LEFT > RIGHT";
        } else if (relation == "<") {
          op = "LEFT < RIGHT";
        } else if (relation == "≥") {
          op = "LEFT >= RIGHT";
        } else if (relation == "≤") {
          op = "LEFT <= RIGHT";
        } else if (relation == "≠") {
          op = "LEFT != RIGHT";
        } else if (relation == "starts with") {
          op = "LEFT.startsWith(RIGHT)";
        } else if (relation == "ends with") {
          op = "LEFT.endsWith(RIGHT)";
        } else if (relation == "contains") {
          op = "LEFT.includes(RIGHT)";
        } else if (relation == "exists") {
          op = "LEFT";
        } else if (relation == "excludes") {
          op = "!(LEFT.includes(RIGHT))";
        } else if (relation == "custom (JS)") {
          op = "LEFT RIGHT";
        }

        op = op.replace("RIGHT", value).replace("LEFT", `row["${feature}"]`);

        filtered = filtered.filter((row) => {
          return eval(op);
        });
      } else {
        console.log("ignoring filter", filter);
      }
    }
    return filtered;
  }, [filters, sortedRows]);

  const [pageRows, totalPages] = useMemo(() => {
    if (!filteredRows) {
      return [undefined, 0];
    }
    return [
      [
        ...filteredRows.slice(
          (currentPage - 1) * pageSize,
          (currentPage - 1) * pageSize + pageSize
        ),
      ],
      Math.ceil(filteredRows.length / pageSize),
    ];
  }, [filteredRows, currentPage, pageSize]);

  const extView = useMemo(() => {
    if (!dataForExt) {
      return null;
    }
    return (
      <ExtView
        hideHeader
        localFirebase
        data={dataForExt}
        onClose={() => {
          setExtOpen(false);
          symbolForExt = undefined;
        }}
        initialLikes={likes}
        newLikes={likes}
        onLike={(symb) => {
          likes.add(symb);
          setLikes(new Set(likes));
          // if (symb == symbolForExt) {
          //   setDataForExt(JSON.parse);
          // }
        }}
        onUnlike={(symb) => {
          likes.delete(symb);
          setLikes(new Set(likes));
          // if (symb == symbolForExt) {
          //   setDataForExt({ ...dataForExt });
          // }
        }}
      />
    );
  }, [dataForExt, likes]);

  return (
    <HeaderAndFooter
      bodyClassName={styles.body}
      onClick={() => {
        handleControlChange();
        setControlOpen(false);
        setExtOpen(false);
        symbolForExt = undefined;
      }}
    >
      <NextSeo title="Insight Screener" />
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
          <h1 className="pageHeader">Insight Screener</h1>
          <h2 className={styles.subHeader}>
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
                if (!user) {
                  router.push("/pricing");
                  return;
                }
                handleExtractWorkbook(await pullRemoteInsights());
                setUserConfigs(await getRemoteUserConfigs());
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
              <h3 className={styles.sectionTitle}>Common Configurations</h3>
              <div className={styles.configContainer}>
                <div className={styles.configCenter}>
                  {commonConfigurations.map((config, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (config.sort) {
                            setSortAttr(config.sort[0]);
                            setSortDir(config.sort[1]);
                            setCurrentPage(1);
                            pageTextFieldRef.current.value = 1;
                          }
                          if (config.cols) {
                            const columns = ["Symbol", ...config.cols];
                            setSelectedCols(columns);
                            selectedColsSet = new Set(columns);
                            tempSelectedCols = [...columns];
                            setCheckboxRerender(checkboxRerender + 1);
                            console.log(
                              "loaded config",
                              selectedColsSet,
                              tempSelectedCols
                            );
                          }
                          if (config.filters) {
                            console.log("7/10 set filters", config.filters);
                            setFilters(config.filters);
                          }
                        }}
                        style={{
                          backgroundColor: colors[i % colors.length],
                        }}
                        className={styles.config}
                      >
                        <h5>{config.name}</h5>
                        <p>{config.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <h3 className={styles.sectionTitle}>Your Presets</h3>
              <div className={styles.configContainer}>
                <div className={styles.configCenter}>
                  <div className={`${styles.config} ${styles.configAdd}`}>
                    <TextField
                      // label="Name"
                      placeholder="Name"
                      size="small"
                      variant="standard"
                      value={newConfigName}
                      onChange={(e) => setNewConfigName(e.target.value)}
                    ></TextField>
                    <TextField
                      placeholder="Description"
                      size="small"
                      variant="standard"
                      value={newConfigDesc}
                      onChange={(e) => setNewConfigDesc(e.target.value)}
                    ></TextField>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!newConfigName || !newConfigDesc}
                        onClick={async () => {
                          const obj = {
                            name: newConfigName,
                            sort: [sortAttr, sortDir],
                            cols: selectedCols.filter(
                              (col) => col !== "Symbol"
                            ),
                            desc: newConfigDesc,
                            uid: user.uid,
                            filters: filters.filter((filt) => {
                              return (
                                filt.feature && filt.relation && filt.valid
                              );
                            }),
                          };
                          const key =
                            user.uid + "-" + uuidv4().replaceAll("-", "");

                          await setRemoteUserConfig(key, obj);
                          setUserConfigs([{ ...obj, id: key }, ...userConfigs]);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  {userConfigs.map((config, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (config.sort) {
                            setSortAttr(config.sort[0]);
                            setSortDir(config.sort[1]);
                            setCurrentPage(1);
                            pageTextFieldRef.current.value = 1;
                          }
                          if (config.cols) {
                            const columns = ["Symbol", ...config.cols];
                            setSelectedCols(columns);
                            selectedColsSet = new Set(columns);
                            tempSelectedCols = [...columns];
                            setCheckboxRerender(checkboxRerender + 1);
                            console.log(
                              "loaded config",
                              selectedColsSet,
                              tempSelectedCols
                            );
                          }
                          setFilters(config.filters || []);
                        }}
                        style={{
                          backgroundColor: colors[i % colors.length],
                        }}
                        className={styles.config}
                      >
                        <h5>{config.name}</h5>
                        <p>{config.desc}</p>
                        <DeleteForeverRoundedIcon
                          className={styles.configDelete}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfigToDelete(config);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  // minHeight: 500,
                  width: "100%",
                  // overflow: "scroll",
                }}
              >
                <div className={styles.gridActions}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      const name = "filter";
                      handleControlChange();
                      setControlOpen(controlOpen == name ? false : name);
                      e.stopPropagation();
                    }}
                    variant="outlined"
                    color={
                      theme.palette.mode == "dark" ? "secondary" : "primary"
                    }
                  >
                    {`Filters${filters.length ? ` (${filters.length})` : ""}`}
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => {
                      const name = "columns";
                      handleControlChange();
                      setControlOpen(controlOpen == name ? false : name);
                      e.stopPropagation();
                    }}
                    variant="outlined"
                    color={
                      theme.palette.mode == "dark" ? "secondary" : "primary"
                    }
                  >
                    {`Columns${
                      selectedCols.length - 1
                        ? ` (${selectedCols.length - 1})`
                        : "" // -1 is because symbol is always chosen
                    }`}
                  </Button>
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    color="success"
                    loading={exportLoading}
                    onClick={async (e) => {
                      setExportLoading(true);
                      const now = new Date();
                      XLSX.writeFile(
                        workbook,
                        `Investivision Insights ${
                          now.getMonth() + 1
                        }-${now.getDate()}-${now.getFullYear()}.xlsx`,
                        {
                          compression: true,
                        }
                      );
                      setExportLoading(false);
                    }}
                  >
                    XLSX↓
                  </LoadingButton>
                </div>
                <Grid
                  cols={selectedCols}
                  extractScrollPositionFunction={(func) => {
                    scrollPositionFunction = func;
                  }}
                  likes={likes}
                  onLike={async (symbol) => {
                    likeSymbol(symbol);
                    setLikes(new Set(likes).add(symbol));
                  }}
                  onUnlike={async (symbol) => {
                    unlikeSymbol(symbol);
                    likes.delete(symbol);
                    setLikes(new Set(likes));
                  }}
                  allCols={sortedCols}
                  rows={pageRows}
                  sortAttr={sortAttr}
                  sortDir={sortDir}
                  extSymbol={extOpen ? dataForExt?.args[0] : undefined}
                  onChange={(params) => {
                    const { dir, attr } = params;
                    console.log("change sort", params);
                    prevSortDir = sortDir;
                    prevSortAttr = sortAttr;
                    setSortDir(dir);
                    setSortAttr(attr);
                    setCurrentPage(1);
                    pageTextFieldRef.current.value = 1;
                    if (attr != "Symbol") {
                      setSelectedCols([
                        "Symbol",
                        attr,
                        ...selectedCols.filter((col) => {
                          return col != attr && col != "Symbol";
                        }),
                      ]);
                    }
                    scrollPositionFunction();
                  }}
                  onOrderChange={(newCols) => {
                    console.log("change order", newCols);
                    setSelectedCols(newCols);
                  }}
                  controlOpen={controlOpen}
                  onRowClick={(symb) => {
                    if (symb != symbolForExt) {
                      console.log("rowClick new symbol", symbolForExt, "=>", {
                        symb: symb,
                      });
                      symbolForExt = symb;
                      const symbolData = getExistingSymbolInsights(symb);
                      console.log("rowClick new symbol data", {
                        insights: {
                          [symb]: symbolData,
                        },
                        args: [symb],
                      });
                      setDataForExt({
                        insights: {
                          [symb]: symbolData,
                        },
                        args: [symb],
                      });
                      console.log(symbolForExt);
                      setExtOpen(true);
                    } else {
                      console.log(
                        "rowClick same symbol",
                        symbolForExt,
                        "=>",
                        symb
                      );
                      symbolForExt = undefined;
                      setExtOpen(false);
                    }
                  }}
                >
                  {controlOpen == "filter" ? (
                    <>
                      {filters.map((filter, i) => {
                        console.log("filter to render", filter);
                        return (
                          <Filter
                            key={filter}
                            cols={cols}
                            showDelete={filters.length > 0}
                            onDelete={() => {
                              // tempFilters = filters
                              //   .slice(0, i)
                              //   .concat(filters.slice(i + 1));
                              // filterChanges = true;
                              setFilters(
                                filters.slice(0, i).concat(filters.slice(i + 1))
                              );
                            }}
                            onChange={(changes) => {
                              console.log("filter change", changes);
                              tempFilters = filters.map((filter, j) =>
                                j == i ? Object.assign(filter, changes) : filter
                              );
                              console.log("new temp filters", tempFilters);
                              filterChanges = true;
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
                                valid: true,
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
                            handleControlChange();
                            setControlOpen(false);
                          }}
                        >
                          Exit
                        </Button>
                      </div>
                    </>
                  ) : controlOpen == "columns" ? (
                    <>
                      <p>Potential Features</p>
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
                            backgroundColor:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.dark
                                : theme.palette.primary.main,
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
                            backgroundColor:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.dark
                                : theme.palette.primary.main,
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
                              color={"primary"}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 22,
                                },
                              }}
                            />
                          }
                          label="Enable Percentiles"
                        />
                      </FormGroup>
                      <p>Potential Time Frames</p>
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
                            backgroundColor:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.dark
                                : theme.palette.primary.main,
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
                            backgroundColor:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.dark
                                : theme.palette.primary.main,
                          }}
                        >
                          None
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <FormGroup className={styles.colsGroup}>
                        {selectableCols.map((col, i) => {
                          return (
                            <FormControlLabel
                              key={col + selectedColsSet.has(col)}
                              control={
                                <Checkbox
                                  defaultChecked={selectedColsSet.has(col)}
                                  onChange={(e) => {
                                    // todo, just use selectedColsSet.entries()
                                    if (e.target.checked) {
                                      selectedColsSet.add(col);
                                      tempSelectedCols.push(col);
                                    } else {
                                      selectedColsSet.delete(col);
                                      const index =
                                        tempSelectedCols.indexOf(col);
                                      if (index > -1) {
                                        tempSelectedCols.splice(index, 1);
                                      }
                                    }
                                    selectedColsChanges = true;
                                    console.log(
                                      "temp Selected Cols",
                                      tempSelectedCols
                                    );
                                    // setSelectedCols([...selectedCols]);
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
                                tempSelectedCols.push(col);
                              }
                            }
                            console.log("temp Selected Cols", tempSelectedCols);
                            // setSelectedCols([...selectedCols]);
                            selectedColsChanges = true;
                            setCheckboxRerender(checkboxRerender + 1);
                          }}
                        >
                          Check All Above
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

                            tempSelectedCols = selectedCols.filter(
                              (col) => !toRemove.has(col)
                            );
                            console.log("temp Selected Cols", tempSelectedCols);
                            selectedColsChanges = true;
                            setCheckboxRerender(checkboxRerender + 1);
                          }}
                        >
                          Clear All Above
                        </Button>
                        <Button
                          color="warning"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            handleControlChange();
                            setControlOpen(false);
                          }}
                        >
                          Exit
                        </Button>
                      </div>
                    </>
                  ) : null}
                </Grid>
                <div className={styles.pageControl}>
                  {currentPage > 1 ? (
                    <ArrowIcon
                      onClick={() => {
                        pageTextFieldRef.current.value = currentPage - 1;
                        setCurrentPage(currentPage - 1);
                      }}
                      style={{
                        color: theme.palette.text.primary,
                        transform: "rotate(180deg)",
                      }}
                    />
                  ) : null}
                  <TextField
                    inputRef={pageTextFieldRef}
                    variant="outlined"
                    type="number"
                    defaultValue={currentPage}
                    label="Page"
                    color="primary"
                    size="small"
                    style={{
                      width: 90,
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      const validated = Math.round(
                        Math.min(totalPages, Math.max(1, val))
                      );
                      if (val != validated) {
                        e.target.value = validated;
                      }
                      setCurrentPage(validated);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode == "13") {
                        e.target.blur();
                      }
                    }}
                  />
                  <p>{`of ${totalPages}`}</p>
                  {currentPage < totalPages ? (
                    <ArrowIcon
                      onClick={() => {
                        pageTextFieldRef.current.value = currentPage + 1;
                        setCurrentPage(currentPage + 1);
                      }}
                      style={{
                        color: theme.palette.text.primary,
                      }}
                    />
                  ) : null}
                </div>
                <div
                  style={{
                    backgroundColor:
                      theme.palette.mode == "dark" ? "#00000090" : "#ffffffa0",
                    transform: `translate(${
                      extOpen ? 0 : "calc(100% + 30px)"
                    }, -50%)`,
                  }}
                  className={styles.extView}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {extView}
                </div>
                {/* <DataGrid
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  rows={rows.map((row) => {
                    return { id: row.symbol, ...row };
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
              <Snackbar
                open={configToDelete}
                autoHideDuration={5000}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                  zIndex: 9999,
                }}
                onClose={() => {
                  setConfigToDelete(undefined);
                }}
              >
                <Alert
                  severity="warning"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  action={
                    <div>
                      <LoadingButton
                        color="warning"
                        size="small"
                        loading={deleteConfigLoading}
                        style={{
                          marginRight: 8,
                        }}
                        variant="outlined"
                        onClick={async (e) => {
                          setDeleteConfigLoading(true);
                          await deleteDoc(
                            doc(getFirestore(), "configs", configToDelete.id)
                          );
                          setUserConfigs(
                            userConfigs.filter(
                              (c) => c.id !== configToDelete.id
                            )
                          );
                          setConfigToDelete(undefined);
                          setTimeout(() => {
                            setDeleteConfigLoading(false);
                          }, 200);
                        }}
                      >
                        Delete
                      </LoadingButton>
                      <Button
                        size="small"
                        color="inherit"
                        onClick={async (e) => {
                          setConfigToDelete(undefined);
                        }}
                        style={{
                          opacity: 0.5,
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                >
                  {`Delete config ${configToDelete?.name}?`}
                </Alert>
              </Snackbar>
            </>
          )}
        </>
      )}
    </HeaderAndFooter>
  );
}
