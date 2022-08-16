import HeaderAndFooter from "../../components/HeaderAndFooter";
import Ext from "../ext";
import styles from "./index.module.css";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getLastInsightUpdateTime } from "../../utils/insights";

const data = {
  insights: {
    AAPL: {
      sector: "Technology",
      p_1: 10.4,
      p_3mo: 2.07,
      drawdown_1: -0.283,
      period_3mo: 22.3,
      drawdown_5: -0.385,
      sharpe_5: 1.12,
      natr_1: 2.13,
      date: "2022-08-12",
      cycfit_5: 0.407,
      cycup_5: 1.55,
      sharpe_1: 0.645,
      res_3mo: 0.0286,
      natr_5: 2.13,
      period_1: 93.4,
      cycup_1: 0.157,
      pr_1: 12.1,
      "market cap": 2980000000000,
      phase_3mo: 0.437,
      period_5: 630,
      lastclose: 172,
      pr_5: 87.1,
      cycfit_1: 0.155,
      name: "Apple Inc.",
      symbol: "AAPL",
      rsi_1: 75.3,
      rsi_5: 52.4,
      alpha_1: 0.00486,
      drawup_1: 0.325,
      alpha_5: 0.431,
      drawup_5: 4.27,
      beta_3mo: 1.27,
      sup_3mo: -0.0171,
      cycup_3mo: 0.0777,
      industry: "Computer Manufacturing",
      phase_5: 0.899,
      cycdown_1: 0.12,
      sharpe_3mo: 1.91,
      alpha_3mo: 1.14,
      phase_1: 0.167,
      cycdown_5: 0.198,
      res_1: 0.143,
      drawdown_3mo: -0.14,
      "ipo year": 1980,
      sup_1: -0.0469,
      res_5: 0.0331,
      pr_3mo: 7.96,
      cycdown_3mo: 0.0259,
      sup_5: -0.268,
      adx_3mo: 63.5,
      country: "United States",
      rsi_3mo: 81.6,
      drawup_3mo: 0.325,
      natr_3mo: 2.13,
      pattern_5: {
        "3OUTSIDE": 100,
        CLOSINGMARUBOZU: 100,
        LONGLINE: 100,
      },
      adx_5: 12.3,
      beta_1: 1.26,
      pattern_3mo: {
        CLOSINGMARUBOZU: 100,
        LONGLINE: 100,
      },
      pattern_1: {
        LONGLINE: 100,
        CLOSINGMARUBOZU: 100,
        MARUBOZU: 100,
        BELTHOLD: 100,
      },
      cycfit_3mo: 0.055,
      beta_5: 1.24,
      adx_1: 45.6,
      p_5: 60.5,
      cycup_10: 7.39,
      adx_10: 10.7,
      pr_10: 186,
      drawup_10: 14,
      sup_10: -0.395,
      p_10: 118,
      phase_10: 0.767,
      rsi_10: 51,
      alpha_10: 0.287,
      cycfit_10: 0.521,
      res_10: 0.00962,
      period_10: 1250,
      sharpe_10: 0.906,
      cycdown_10: 0.495,
      natr_10: 2.13,
      pattern_10: {
        LONGLINE: 100,
        CLOSINGMARUBOZU: 100,
        MARUBOZU: 100,
        BELTHOLD: 100,
      },
      beta_10: 1.18,
      drawdown_10: -0.438,
      "p%_1": 0.594,
      "p%_3mo": 0.557,
      "drawdown%_1": 0.723,
      "drawdown%_5": 0.888,
      "sharpe%_5": 0.994,
      "natr%_1": 0.232,
      "sharpe%_1": 0.796,
      "natr%_5": 0.212,
      "pr%_1": 0.229,
      "pr%_5": 0.391,
      "alpha%_1": 0.732,
      "drawup%_1": 0.326,
      "alpha%_5": 0.991,
      "drawup%_5": 0.78,
      "beta%_3mo": 0.709,
      "sharpe%_3mo": 0.772,
      "alpha%_3mo": 0.938,
      "drawdown%_3mo": 0.707,
      "pr%_3mo": 0.178,
      "drawup%_3mo": 0.577,
      "natr%_3mo": 0.234,
      "beta%_1": 0.681,
      "beta%_5": 0.739,
      "p%_5": 0.639,
      "pr%_10": 0.421,
      "drawup%_10": 0.994,
      "p%_10": 0.589,
      "alpha%_10": 0.971,
      "sharpe%_10": 0.963,
      "natr%_10": 0.222,
      "beta%_10": 0.712,
      "drawdown%_10": 0.823,
      notes: "",
      p400: [184.5, 205.3, 225.8],
      p63: [168.9, 175.7, 182.9],
      p252: [178.4, 190.1, 201.4],
      p30: [168, 175.3, 182.4],
      p100: [172.8, 180.9, 188.2],
      p700: [172.6, 224.7, 271.7],
      p45: [166.9, 173.6, 181],
      cycargs_3mo: [
        3.949459849192281, 22.324634692202046, 0.4374493298860084,
        0.3333719815240209, 156.70110076445258,
      ],
      p1260: [146.1, 276.1, 386.5],
      cycargs_5: [
        30.557363922342205, 629.9390836826481, 0.8987815817688252,
        0.09885658456257301, 145.97584342016296,
      ],
      cycargs_1: [
        11.477476921115603, 93.40624279260237, 0.16655066124323115,
        0.02886365005891165, 166.941579098853,
      ],
      p15: [168.3, 175.3, 182.5],
      p160: [175.9, 185.1, 192.9],
      p2515: [0, 375.5, 698.6],
      cycargs_10: [
        46.41561136389778, 1251.0635246187167, 0.7666911961284001,
        0.04163048385744696, 102.42166811405612,
      ],
      p1750: [92.7, 310.6, 495.9],
    },
  },
  args: ["AAPL", "AAPL"],
};

export default function Compare(props) {
  const [data, setData] = useState({
    args: [],
    insights: {},
  });

  const extElement = useMemo(() => {
    if (data.args.length) {
      return (
        <div className={styles.extHolder}>
          <Ext data={data} localFirebase hideHeader />
        </div>
      );
    }
    return null;
  }, [data]);

  const [newSymbol, setNewSymbol] = useState("");

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      <h1 className="pageHeader">Insight Comparison</h1>
      <h2 className={styles.subHeader}>
        A playground for side-by-side graphical comparisons between symbols,
        timeframes, and insight categories.
      </h2>
      <TextField
        style={{
          width: 170,
          marginBottom: 10,
        }}
        label="Add Symbol"
        value={newSymbol}
        onChange={(e) => {
          setNewSymbol(e.target.value.toUpperCase());
        }}
        // className={styles.textInput}
        color="primary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={async () => {
                  if (newSymbol) {
                    const scopedData = await getScopedSymbolData(newSymbol);
                    console.log("scoped data", scopedData);
                    data.args.push(newSymbol);
                    data.insights[newSymbol] = scopedData;
                    setData(JSON.parse(JSON.stringify(data)));
                  }
                }}
              >
                <AddCircleRoundedIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      ></TextField>
      {extElement}
    </HeaderAndFooter>
  );
}

async function getScopedSymbolData(symbol) {
  const currentUser = getAuth().currentUser;
  let queryAllSymbols = false;
  let token;
  let role;
  if (currentUser) {
    await currentUser.getIdToken(true);
    token = await currentUser.getIdTokenResult();
    console.log("got token for user", token);
    role = token?.claims?.role;
    if (["bullish", "buffet"].includes(role)) {
      queryAllSymbols = true;
    }
  }

  // if (!currentUser || !["bullish", "buffet"].includes(role)) {
  //   if (!(await requestAccess(thisTabData.args))) {
  //     (await waitForPort(tabId)).postMessage({
  //       status: "rateLimited",
  //     });
  //     sentMap[tabId] = thisTabData;
  //     delete updateMap[tabId];
  //     return;
  //   }
  // }

  if (!queryAllSymbols) {
    let { symbols, timestamp } = await getSymbolWhitelist();
    if (
      !symbols ||
      !timestamp ||
      new Date() - timestamp > 1000 * 60 * 60 * 24 * 7 // one week
    ) {
      console.log("resetting symbols");
      symbols = (await setSymbolWhitelist()).basicSymbols.symbols;
    } else {
      console.log("not resetting symbols");
    }
    if (!symbols.includes(symbol)) {
      //forbidden
      alert("forbidden");
      return;
    } else {
    }
  }
  // debugger;
  const docData = await getSymbolInsights(symbol);
  if (Object.keys(docData).length > 0) {
    if (
      !(
        currentUser &&
        token.claims &&
        ["bullish", "buffet"].includes(token.claims.role)
      )
    ) {
      // remove insights from free user
      for (const symbol in docData) {
        for (const key in docData[symbol]) {
          if (
            key.startsWith("p_") ||
            key.startsWith("pr_") ||
            (key.startsWith("p") &&
              key.charAt(1) >= "0" &&
              key.charAt(1) <= "9") ||
            key.startsWith("sup") ||
            key.startsWith("res") ||
            key.startsWith("adx") ||
            key.startsWith("rsi")
          ) {
            delete docData[symbol][key];
          }
        }
        delete docData[symbol].pattern;
      }
    }
  }

  if (Object.keys(docData).length && token?.claims?.role == "buffet") {
    const document = await getDoc(
      doc(getFirestore(), "notes", `${currentUser.uid}-${symbol}`)
    );
    console.log("got notes doc data", document.data());
    docData.notes =
      document.exists && document.data() ? document.data().notes || "" : "";
  }

  return docData;
}

async function getSymbolInsights(symbol) {
  const stored = validCacheEntries(symbol);
  console.log("scoped data stored", stored);
  if (!stored) {
    const docRef = doc(getFirestore(), "quotes", symbol);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      window.localStorage.setItem(
        symbol,
        JSON.stringify({
          insights: docSnap.data(),
          timestamp: new Date().getTime(),
        })
      );
      return docSnap.data();
    }
    return {};
  }
  return stored;
}

export function validCacheEntries(symbol) {
  const timestampCutoff = getLastInsightUpdateTime();

  let stored = window.localStorage.getItem(symbol);
  if (!stored) {
    return;
  }

  stored = JSON.parse(stored);

  console.log("stored", stored);
  let { insights, timestamp } = stored;
  if (timestamp < timestampCutoff) {
    console.log("found expired cached insight for", symbol);
    return;
  } else {
    console.log("found valid cached insight for", symbol);
    return insights;
  }
}

async function setSymbolWhitelist() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Investivision/insight-engine/master/symbols.txt"
  );
  const text = await res.text();
  const symbols = text.split("\n");
  window.localStorage.setItem(
    "basicSymbols",
    JSON.stringify({ symbols: symbols, timestamp: new Date().getTime() })
  );
}

async function getSymbolWhitelist() {
  const stored = window.localStorage.getItem("basicSymbols");
  return stored
    ? JSON.parse(stored)
    : {
        symbols: undefined,
        timestamp: undefined,
      };
}
