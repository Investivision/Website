import XLSX from "xlsx";
import Base64String from "../../components/insights/LZString";
import candleMap from "../../components/insights/candleMap";
import { getStorage, ref, getBlob, getBytes } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

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
  const offset = dayOffsets[date.getDay()];
  if (offset) {
    date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * offset);
  }
  date.setTime(date.getTime() - estOffset * 60 * 1000);
  date.setTime(date.getTime() - initialOffset * 60 * 1000);
  return date;
}

function blobToBase64(blob) {
  
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = (result) => {
      
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

let rawData = {};

const extractWorkbook = async (wb) => {
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
  
  
  const formattedCols = data[0].map((col) => {
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
      .replace("Pr %", "Forecast Range %")
      .replace("Natr", "True Range")
      .replace("3Mo", "3mo")
      .replace("Adx", "Trend Strength")
      .replace("Rsi", "Relative Direction");
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
  const withoutPercentiles = sorted.filter((col) => !col.includes("%ile"));

  
  

  // try {
  //   
  //   const remoteConfigsRes = await getDocs(
  //     query(
  //       collection(getFirestore(), "configs"),
  //       where("uid", "==", user.uid)
  //     )
  //   );

  //   const freshRemoteConfigs = [];
  //   remoteConfigsRes.forEach((doc) => {
  //     freshRemoteConfigs.push({ ...doc.data(), id: doc.id });
  //   });

  //   setUserConfigs(freshRemoteConfigs);
  // } catch (e) {
  //   console.error("error getting user configs", e);
  // }

  // setDownloading(false);
  const out = {
    cols: set,
    selectedCols: withoutPercentiles,
    sortedCols: sorted,
    rows: myRows,
    wb: wb,
  };
  
  return out;
};

async function extractInsightsWorkbook() {
  return await extractWorkbook(
    XLSX.read(
      Base64String.decompressFromUTF16(localStorage.getItem("insights")),
      {
        type: "base64",
      }
    )
  );
}

export async function tryToExtractExistingInsights() {
  const stored = window.localStorage.getItem("insightsTimestamp");
  if (!stored || Date.parse(stored) <= getLastInsightUpdateTime()) {
    return undefined;
  }
  return await extractInsightsWorkbook();
}

export async function pullRemoteInsights() {
  const blob = await getBlob(ref(getStorage(), "/all_raw.xlsx"));
  let base64 = (await blobToBase64(blob)).split(",")[1];
  const lz = Base64String.compressToUTF16(base64);
  try {
    window.localStorage.insights = lz;
  } catch (e) {
    console.error(e);
  }
  window.localStorage.setItem("insightsTimestamp", new Date());
  return extractWorkbook(
    XLSX.read(base64, {
      type: "base64",
    })
  );
}

export function getExistingSymbolInsights(symbol) {
  return rawData[symbol];
}

export async function getRemoteUserConfigs() {
  try {
    const remoteConfigsRes = await getDocs(
      query(
        collection(getFirestore(), "configs"),
        where("uid", "==", getAuth().currentUser.uid)
      )
    );

    const freshRemoteConfigs = [];
    remoteConfigsRes.forEach((doc) => {
      freshRemoteConfigs.push({ ...doc.data(), id: doc.id });
    });

    return freshRemoteConfigs;
  } catch (e) {
    console.error("error getting user configs", e);
    return [];
  }
}

export async function setRemoteUserConfig(key, obj) {
  await setDoc(doc(getFirestore(), "configs", key), obj);
}
