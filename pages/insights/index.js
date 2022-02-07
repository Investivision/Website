import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, getBlob, getBytes } from "firebase/storage";
import firebase, { auth, formatErrorCode } from "../../firebase";
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
import TextField from "@mui/material/TextField";
import ArrowIcon from "@material-ui/icons/ArrowForwardIosRounded";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import { v4 as uuidv4 } from "uuid";
import { common } from "@mui/material/colors";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@material-ui/core";
import ExtView from "../ext";
import candleMap from "../../components/insights/candleMap";
import Base256 from "base256-encoding";
import Base128 from "base128-encoding";
import base91 from "node-base91";
import Base64String from "../../components/insights/LZString";

let tempFilters = [{ feature: "", relation: "", value: "", valid: true }];
let filterChanges = false;

let tempSelectedCols = [];
let selectedColsSet = new Set();
let selectedColsChanges = false;

const rawData = {};

function getLastInsightUpdateTime() {
  const date = new Date();
  const initialOffset = date.getTimezoneOffset();
  date.setTime(date.getTime() + initialOffset * 60 * 1000); // utc
  let estOffset = -300;
  if (date.isDstObserved()) {
    estOffset += 60;
  }
  date.setTime(date.getTime() + estOffset * 60 * 1000); // est
  if (date.getHours() < 17) {
    date.setTime(date.getTime() - 1000 * 60 * 60 * 24);
  }
  date.setHours(17, 0, 0, 0);
  const dayOffsets = {
    0: -2,
    6: -1,
  };
  console.log("date before offset", date);
  const offset = dayOffsets[date.getDay()];
  console.log("offset is", offset);
  if (offset) {
    date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * offset);
  }
  console.log("date in eastern time", date);
  date.setTime(date.getTime() - estOffset * 60 * 1000);
  date.setTime(date.getTime() - initialOffset * 60 * 1000);
  return date;
}

// extend the string prototype to title case
String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// String.prototype.toTitleCase = () => {
//   console.log("toTitleCase", this);
//   return this.replace(/\w\S*/g, function (txt) {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// };

Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

function blobToBase64(blob) {
  console.log("blob before base64", blob);
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = (result) => {
      console.log("blog to base64", result.currentTarget.result);
      resolve(result.currentTarget.result);
    };
    reader.readAsDataURL(blob);
  });
}

function downloadBlob(blob, name = "file.txt") {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}

var workbook;

let commonConfigurations = [
  {
    name: "Stable Long-Term Picks",
    sort: ["Sharpe, 10yr", "asc"],
    cols: ["Sharpe, 10yr", "Alpha, 10yr", "Last Close"],
    desc: "Best Sharpe, 10yr",
    filters: [
      {
        feature: "Sharpe, 10yr",
        relation: "exists",
        value: "",
      },
    ],
  },
  {
    name: "Past-Year Champions",
    sort: ["Alpha, 1yr", "asc"],
    cols: ["Alpha, 1yr", "Sharpe, 1yr", "Last Close"],
    desc: "Best Alpha, 1yr",
    filters: [
      {
        feature: "Alpha, 1yr",
        relation: "exists",
        value: "",
      },
    ],
  },
  {
    name: "Nearby Expected Rebounds",
    sort: ["Support, 3mo", "asc"],
    desc: "Close to Support Line with weak Relative Strength",
    filters: [
      {
        feature: "Resistance, 3mo",
        relation: "exists",
        value: "",
      },
      {
        feature: "Resistance, 3mo",
        relation: ">",
        value: "Support, 3mo + 0.07",
      },
    ],
    cols: ["Support, 3mo", "Resistance, 3mo", "Last Close"],
  },
  {
    name: "High Volatility Movers",
    desc: "Choppy prices with extreme movements",
    sort: ["True Range, 1yr", "asc"],
    filters: [],
    cols: ["True Range, 1yr", "Beta, 1yr", "Resistance, 3mo", "Support, 3mo"],
  },
  // {
  //   name: "Short-Term Bearish Candles",
  //   sort: sortByBearishCandles,
  //   desc: "High net number of bearish candle patterns",
  // },
  // {
  //   name: "Short-Term Bullish Candles",
  //   sort: sortByBullishCandles,
  //   desc: "High net number of bullish candle patterns",
  // },
];

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
  const [downloading, setDownloading] = useState(false);

  const [sortAttr, setSortAttr] = useState("Market Cap");
  const [sortDir, setSortDir] = useState("asc");

  const [filters, setFilters] = useState([]);

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
          const stored = window.localStorage.getItem("insightsTimestamp");
          console.log("stored insights", stored);
          if (stored && Date.parse(stored) > getLastInsightUpdateTime()) {
            setDownloading(true);
            extractWorkbook(
              XLSX.read(
                Base64String.decompressFromUTF16(
                  localStorage.getItem("insights")
                ),
                {
                  type: "base64",
                }
              )
            );
          }
        }
      } else {
        setUser(undefined);
        setUserLoaded(true);
      }
    });
  }, []);

  console.log(firstConfigRef);
  useEffect(() => {
    if (firstConfigRef.current) {
      setFirstConfigWidth(firstConfigRef.current.clientWidth);
    }
  }, [rows]);

  const extractWorkbook = async (wb) => {
    workbook = wb;
    var first_worksheet = wb.Sheets[wb.SheetNames[0]];
    var second_worksheet = wb.Sheets[wb.SheetNames[1]];
    let data = XLSX.utils.sheet_to_json(first_worksheet, {
      header: 1,
    });
    let data2 = XLSX.utils.sheet_to_json(second_worksheet, {
      header: 1,
    });
    data.slice(1).forEach((row) => {
      const obj = {};
      for (let i = 0; i < data[0].length; i++) {
        if (row[i]) {
          obj[data[0][i]] = data[0][i].includes("pattern")
            ? JSON.parse(row[i].replaceAll("'", '"'))
            : row[i];
        }
      }
      obj.notes = "";
      console.log("rawObj", obj);
      rawData[obj.symbol] = obj;
    });
    data2.slice(1).forEach((row) => {
      const obj = {};
      for (let i = 0; i < data2[0].length; i++) {
        if (row[i]) {
          obj[data2[0][i]] = data2[0][i].startsWith("p")
            ? JSON.parse(row[i])
            : row[i];
        }
      }
      rawData[obj.symbol] = { ...rawData[obj.symbol], ...obj };
    });
    console.log("rawData", rawData);
    // const rawCols = data[0];
    console.log("raw data", data);

    // data = [data[0]].concat(
    //   data.slice(1).map((row) => {
    //     row = { ...row };
    //     for (const timeFrame of ["3mo", "1", "5", "10"]) {
    //       const colName = `pattern_${timeFrame}`;
    //       const rawStr = row[colName];
    //       if (rawStr) {
    //         const bullish = [];
    //         const bearish = [];
    //         const list = JSON.parse(rawStr);
    //         for (const [key, value] of Object.entries(list)) {
    //           if (value > 0) {
    //             bullish.push(candleMap[key]);
    //           } else {
    //             bearish.push(candleMap[key]);
    //           }
    //         }
    //         delete row[colName];
    //         const split = colName.split("_");
    //         row["Bullish Pattern" + split[1]] = bullish.join(", ");
    //         row["Bearish Pattern" + split[1]] = bearish.join(", ");
    //       }
    //     }
    //     return row;
    //   })
    // );
    // console.log("data after formatting", data);
    const formattedCols = data[0].map((col) => {
      //   original = col
      // #     col = col.title().replace('Res_', 'Resistance_').replace(
      // #         'Sup_', 'Support_').replace('%_', ' %ile_').replace('Lastclose', 'Last Close').replace('Drawup', 'Max Gain').replace('P_', 'AI Forecast_').replace('Pr_', 'Forecast Range_').replace('P %', 'AI Forecast %').replace('Pr 5', 'Forecast Range %').replace('Natr', 'True Range').replace('3Mo', '3mo')
      // #     if col.endswith('_10'):
      // #         col = col.replace('_10', '_10yr')
      // #     elif col.endswith('_1'):
      // #         col = col.replace('_1', '_1yr')
      // #     col = col.replace('_5', '_5yr').replace('_', ', ')
      // #     if 'Forecast' in col:
      // #         col = col.replace(', ', ' in ')
      // #     nameChanges[original] = col
      let out = col
        .toTitleCase()
        .replace("Res_", "Resistance_")
        .replace("Sup_", "Support_")
        .replace("%_", " %ile_")
        .replace("Lastclose", "Last Close")
        .replace("Drawup", "Max Gain")
        .replace("P_", "AI Forecast_")
        .replace("Pr_", "Forecast Range_")
        .replace("P %", "AI Forecast %")
        .replace("Pr 5", "Forecast Range %")
        .replace("Natr", "True Range")
        .replace("3Mo", "3mo");
      if (out.endsWith("_10")) {
        out = out.replace("_10", "_10yr");
      } else if (out.endsWith("_1")) {
        out = out.replace("_1", "_1yr");
      } else if (out.endsWith("_5")) {
        out = out.replace("_5", "_5yr");
      }
      out = out.replace("_", ", ");
      if (out.includes("Forecast")) {
        out = out.replace(", ", " in ");
      }
      return out;
    });
    const myRows = data.slice(1).map((row) => {
      const obj = {};
      for (let i = 0; i < formattedCols.length; i++) {
        if (row[i]) {
          if (formattedCols[i].includes("Pattern")) {
            let rawStr = row[i];
            if (rawStr) {
              const bullish = [];
              const bearish = [];
              rawStr = rawStr.replaceAll("'", '"');
              const list = JSON.parse(rawStr);
              for (const [key, value] of Object.entries(list)) {
                if (value > 0) {
                  bullish.push(candleMap[key]);
                } else {
                  bearish.push(candleMap[key]);
                }
              }
              const split = formattedCols[i].split("Pattern");
              obj["Bullish Patterns" + split[1]] = bullish;
              obj["Bearish Patterns" + split[1]] = bearish;
            }
          } else {
            obj[formattedCols[i]] = row[i];
          }
        }
      }
      return obj;
    });
    const set = new Set(formattedCols);
    set.delete("Symbol");
    for (const timeFrame of ["3mo", "1yr", "5yr", "10yr"]) {
      set.delete("Pattern, " + timeFrame);
      set.add("Bullish Patterns, " + timeFrame);
      set.add("Bearish Patterns, " + timeFrame);
    }
    const sorted = ["Symbol", ...Array.from(set).sort()];
    set.add("Symbol");
    setCols(set);
    const withoutPercentiles = sorted.filter((col) => !col.includes("%ile"));
    selectedColsSet = new Set(withoutPercentiles);
    tempSelectedCols = [...withoutPercentiles];
    setSelectedCols(withoutPercentiles);
    setSortedCols(sorted);
    console.log("sortedCols", sorted);
    console.log("myRows", myRows);
    try {
      console.log("uid is", auth.currentUser.uid);
      const remoteConfigsRes = await getDocs(
        query(
          collection(getFirestore(), "configs"),
          where("uid", "==", auth.currentUser.uid)
        )
      );

      const freshRemoteConfigs = [];
      remoteConfigsRes.forEach((doc) => {
        freshRemoteConfigs.push({ ...doc.data(), id: doc.id });
      });

      setUserConfigs(freshRemoteConfigs);
    } catch (e) {
      console.error("error getting user configs", e);
    }

    setRows(myRows);

    try {
      console.log("uid is", user.uid);
      const remoteConfigsRes = await getDocs(
        query(
          collection(getFirestore(), "configs"),
          where("uid", "==", user.uid)
        )
      );

      const freshRemoteConfigs = [];
      remoteConfigsRes.forEach((doc) => {
        freshRemoteConfigs.push({ ...doc.data(), id: doc.id });
      });

      setUserConfigs(freshRemoteConfigs);
    } catch (e) {
      console.error("error getting user configs", e);
    }

    setDownloading(false);
    window.onbeforeunload = function () {
      return "test";
    };
  };

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

  console.log("theme", theme);

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
          "hsl(165, 75%, 80%)",
          "hsl(170, 75%, 79%)",
          "hsl(175, 75%, 77%)",
          "hsl(180, 75%, 79%)",
          "hsl(190, 75%, 80%)",
          "hsl(195, 75%, 81%)",
          "hsl(200, 75%, 82%)",
        ];

  // if (theme.palette.mode && !commonConfigurations[0].color) {
  //   alert(theme.palette.mode);
  //   commonConfigurations = commonConfigurations.map((config) => {
  //     config.color = colors[Math.floor(Math.random() * colors.length)];
  //     return config;
  //   });
  // }

  const [colTypes, timeFrames] = useMemo(() => {
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

  const selectableCols = useMemo(() => {
    if (!sortedCols) {
      return undefined;
    }
    return sortedCols.filter((col) => {
      if (col == "Symbol") {
        return false;
      }
      console.log("determining if", col, "is to be selectable");
      console.log("toggled items", toggledCols, toggledFrames);
      let split = col.split(", ");
      if (split.length == 1) {
        split = col.split(" in ");
      }
      if (split.length == 2 && !toggledFrames.has(split[1])) {
        console.log(
          "filtering col on first condition",
          col,
          split[1],
          Array.from(toggledFrames)
        );

        console.log("determining if", col, "is to be selectable", false);
        return false;
      }
      console.log("toggledCols", toggledCols, col, split[0]);
      if (showPercentiles) {
        split[0] = split[0].replace(" %ile", "");
      }

      console.log("determining if", col, toggledCols.has(split[0]));
      return toggledCols.has(split[0]);
    });
  }, [sortedCols, toggledCols, toggledFrames, showPercentiles]);

  // let selectableCols;
  // if (sortedCols) {
  //   selectableCols = sortedCols.filter((col) => {
  //     console.log("toggled items", toggledCols, toggledFrames);
  //     let split = col.split(", ");
  //     if (split.length == 1) {
  //       split = col.split(" in ");
  //     }
  //     if (split.length == 2 && !toggledFrames.has(split[1])) {
  //       console.log(
  //         "filtering col on first condition",
  //         col,
  //         split[1],
  //         Array.from(toggledFrames)
  //       );
  //       return false;
  //     }
  //     console.log("toggledCols", toggledCols, col, split[0]);
  //     if (showPercentiles) {
  //       split[0] = split[0].replace(" (%ile)", "");
  //     }
  //     return toggledCols.has(split[0]);
  //   });
  // }

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
    console.log(
      "values for sort dict",
      valuesForSort,
      sortAttr,
      valuesForSort[sortAttr]
    );
    let out = [...rows];
    if (sortAttr == prevSortAttr && sortDir != prevSortDir) {
      // console.log("sortedRows", prevSortedRows);
      // alert("naive");
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
      console.log("filterString", filter);
      if (
        feature &&
        relation &&
        (value || relation == "exists") &&
        valid != false
      ) {
        const negate = relation == "excludes";
        relation = relation
          .replace("≥", ">=")
          .replace("≤", "<=")
          .replace("≠", "!=")
          .replace("=", "==")
          .replace("starts with", "startsWith")
          .replace("ends with", "endsWith")
          .replace("contains", "includes")
          .replace("excludes", "includes")
          .replace("exists", "!== ''");
        let filterString = `row['${feature}']`;
        if (/[a-zA-Z]/.test(relation.charAt(0))) {
          filterString += `.${relation}(VAL)`;
        } else {
          filterString += ` ${relation} VAL`;
        }
        if (relation != "exists") {
          let accessibleValue = value;
          for (const col of sortedCols) {
            accessibleValue = accessibleValue.replaceAll(col, `row['${col}']`);
          }
          // if all letters are alphabetic
          if (/^[a-zA-Z]+$/.test(accessibleValue)) {
            accessibleValue = `"${accessibleValue}"`;
          }
          filterString = filterString.replace("VAL", accessibleValue);
        } else {
          filterString = filterString.replace("VAL", "");
        }
        if (negate) {
          filterString = `!(${filterString})`;
        }
        console.log("filterString", filterString);
        filtered = filtered.filter((row) => {
          console.log("sharpe 10", row["Sharpe, 10yr"]);
          const pass = eval(filterString);
          console.log(pass, "row during filtering", row);
          return pass;
        });
      } else {
        console.log("ignoring filter", filter);
      }
    }
    console.log("new filtered rows", filtered);
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
    return <ExtView hideHeader localFirebase data={dataForExt} />;
  }, [dataForExt]);

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
                  window.location.href = "/pricing";
                  return;
                }
                const blob = await getBlob(ref(getStorage(), "/all_raw.xlsx"));

                // console.log("bytes from firebase", bytes);
                // const base64 = base91.encode(bytes);
                // console.log("encoded length", base64.length);
                // console.log("encoded string", base64);
                let base64 = (await blobToBase64(blob)).split(",")[1];
                console.log("encoded LZ", Base64String.compressToUTF16);
                const lz = Base64String.compressToUTF16(base64);
                console.log("encoded length", base64.length, lz.length);
                console.log("encoded string", base64, lz);
                // console.log("LZString", LZString);
                try {
                  // window.localStorage.setItem("insights", base64);
                  window.localStorage.insights = lz;
                  console.log("successfully set localStorage insights");
                } catch (e) {
                  console.error(e);
                  console.error("failed to set localStorage");
                }
                window.localStorage.setItem("insightsTimestamp", new Date());
                extractWorkbook(
                  XLSX.read(base64.split(",")[1], {
                    type: "base64",
                  })
                );
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
                        ref={i == 0 ? firstConfigRef : null}
                        onClick={() => {
                          if (config.sort) {
                            setSortAttr(config.sort[0]);
                            setSortDir(config.sort[1]);
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
              <h3 className={styles.sectionTitle}>Your Configurations</h3>
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
                          };
                          const filts = filters.filter((filt) => {
                            return filt.feature && filt.relation && filt.valid;
                          });
                          if (filts.length) {
                            obj.filters = filts;
                          }
                          const key =
                            user.uid + "-" + uuidv4().replaceAll("-", "");
                          await setDoc(
                            doc(getFirestore(), "configs", key),
                            obj
                          );
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
                    Manage Filters
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
                    Manage Columns
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
                    Export to XLSX
                  </LoadingButton>
                </div>
                <Grid
                  cols={selectedCols}
                  allCols={sortedCols}
                  rows={pageRows}
                  sortAttr={sortAttr}
                  sortDir={sortDir}
                  onChange={(params) => {
                    const { dir, attr } = params;
                    console.log("change sort", params);
                    prevSortDir = sortDir;
                    prevSortAttr = sortAttr;
                    setSortDir(dir);
                    setSortAttr(attr);
                  }}
                  onOrderChange={(newCols) => {
                    setSelectedCols(newCols);
                  }}
                  controlOpen={controlOpen}
                  onRowClick={(symb) => {
                    if (symb != symbolForExt) {
                      console.log("rowClick new symbol", symbolForExt, "=>", {
                        symb: symb,
                      });
                      symbolForExt = symb;

                      setDataForExt({
                        insights: {
                          [symb]: rawData[symb],
                        },
                        args: [symb],
                      });
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
                            showDelete={filters.length > 1}
                            onDelete={() => {
                              tempFilters = filters
                                .slice(0, i)
                                .concat(filters.slice(i + 1));
                              filterChanges = true;
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
                              color={
                                theme.palette.mode == "dark"
                                  ? "secondary"
                                  : "primary"
                              }
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
                  {dataForExt ? extView : null}
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
