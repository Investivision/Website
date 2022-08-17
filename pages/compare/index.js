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

export default function Compare(props) {
  const [data, setData] = useState({
    args: [],
    insights: {},
  });

  const extElement = useMemo(() => {
    if (data.args.length) {
      return (
        <div className={styles.extHolder}>
          <Ext
            data={data}
            localFirebase
            hideHeader
            onClose={(i) => {
              // debugger;
              data.args.splice(i, 1);

              setData({ ...data });
            }}
          />
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
      symbols = (await setSymbolWhitelist()).symbols;
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
  const out = { symbols: symbols, timestamp: new Date().getTime() };
  window.localStorage.setItem("basicSymbols", JSON.stringify(out));
  return out;
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
