import HeaderAndFooter from "../../components/HeaderAndFooter";
import Ext from "../ext";
import styles from "./index.module.css";
import TextField from "@mui/material/TextField";
import { useMemo, useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { getLastInsightUpdateTime } from "../../utils/insights";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/router";
import { useTheme } from "@mui/styles";
import { getLikes } from "../../utils/insights";

export default function Compare(props) {
  const [data, setData] = useState({
    args: [],
    insights: {},
  });

  const router = useRouter();

  const theme = useTheme();

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [likes, setLikes] = useState(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (router.isReady) {
      let symbols = router.query.symbols;
      if (!symbols) return;
      symbols = symbols.split(" ");
      setLoading(true);
      onAuthStateChanged(getAuth(), async (user) => {
        const [symbolData, message] = await getScopedSymbolData(symbols);
        if (message) {
          setSnackbarSeverity("warning");
          setSnackbarMessage(message);
          setSnackbarIsOpen(true);
        }
        console.log("initial message", message);
        if (symbolData.args.length) {
          setData(symbolData);
          setLoading(false);
        }
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const token = await user.getIdTokenResult(true);

        if (token.claims.role) {
          if (["bullish", "buffet"].includes(token.claims.role)) {
            setLikes(await getLikes());
            return;
          }
        }
      }
      setLikes(new Set());
    });
  }, []);

  useEffect(() => {
    let nextUrl;
    if (data?.args.length) {
      nextUrl =
        window.location.href.split("?")[0] +
        "?symbols=" +
        encodeURIComponent(`${data.args.join(" ")}`);
    } else if (window.location.search.startsWith("?symbol=")) {
      nextUrl = window.location.href.split("?")[0];
    }
    if (nextUrl) {
      window.history.replaceState(undefined, undefined, nextUrl);
    }
  }, [data]);

  const extElement = useMemo(() => {
    if (data.args.length && likes) {
      return (
        <div className={styles.extHolder}>
          <Ext
            data={data}
            localFirebase
            hideHeader
            initialLikes={likes}
            onClose={(i) => {
              // debugger;
              data.args.splice(i, 1);
              setData({ ...data });
            }}
            // onLike={(symbol) => {
            //   likes.add(symbol);
            //   likeSymbol(symbol);
            //   setLikes(new Set(likes));
            // }}
            // onUnlike={(symbol) => {
            //   likes.delete(symbol);
            //   unlikeSymbol(symbol);
            //   setLikes(new Set(likes));

            // }}
          />
        </div>
      );
    }
    return null;
  }, [data, likes]);

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
                style={{
                  pointerEvents: loading || !newSymbol ? "none" : "all",
                }}
                onClick={async () => {
                  if (newSymbol && !loading) {
                    setLoading(true);
                    const [scopedData, message] = await getScopedSymbolData([
                      newSymbol,
                    ]);

                    if (message) {
                      setSnackbarSeverity("warning");
                      setSnackbarMessage(message);
                      setSnackbarIsOpen(true);
                      setLoading(false);
                      return;
                    }

                    data.args = data.args.concat(scopedData.args);
                    data.insights = {
                      ...data.insights,
                      ...scopedData.insights,
                    };

                    // data.args.push(newSymbol);
                    // data.insights[newSymbol] = scopedData;
                    setData(JSON.parse(JSON.stringify(data)));
                    setLoading(false);
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={20} thickness={6} />
                ) : (
                  <AddCircleRoundedIcon
                    style={{
                      color:
                        theme.palette.mode == "dark"
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                      opacity: !newSymbol ? 0.5 : 1,
                    }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      ></TextField>
      {extElement}
      <Snackbar
        open={snackbarIsOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
          zIndex: 9999,
        }}
        onClose={() => {
          setSnackbarIsOpen(false);
        }}
        autoHideDuration={3000}
      >
        <Alert severity={snackbarSeverity} sx={{ zIndex: 99999 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </HeaderAndFooter>
  );
}

async function getScopedSymbolData(symbolList) {
  const currentUser = getAuth().currentUser;
  let queryAllSymbols = false;
  let token;
  let role;
  if (currentUser) {
    await currentUser.getIdToken(true);
    token = await currentUser.getIdTokenResult();
    console.log("got token for user", token);
    // debugger;
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

  let errorMessage = "";
  const noAccessSymbols = [];

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
    symbols = new Set(symbols);
    const newSymbolList = [];
    for (const symbol of symbolList) {
      if (symbols.has(symbol)) {
        newSymbolList.push(symbol);
      } else {
        noAccessSymbols.push(symbol);
      }
    }
    symbolList = newSymbolList;
    if (noAccessSymbols.length) {
      errorMessage +=
        noAccessSymbols.join(", ") + " not available in your current plan. ";
    }
  }
  const [docData, notFound] = await getSymbolInsights(symbolList);
  console.log("not found symbols", notFound);
  if (notFound.length) {
    errorMessage += notFound.join(", ") + " not tracked. ";
    const notFoundSet = new Set(notFound);
    symbolList = symbolList.filter((symbol) => !notFoundSet.has(symbol));
  }

  console.log("filtered docData", docData, symbolList);
  if (Object.keys(docData).length > 0) {
    if (
      !(
        currentUser &&
        token.claims &&
        ["bullish", "buffet"].includes(token.claims.role)
      )
    ) {
      // console.log(
      //   "weird access",
      //   currentUser,
      //   token.claims,
      //   ["bullish", "buffet"].includes(token.claims.role)
      // );
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
            key.startsWith("rsi") ||
            key.startsWith("phase")
          ) {
            delete docData[symbol][key];
          }
        }
        delete docData[symbol].pattern;
      }
    }
  }
  let out = {
    args: symbolList,
    insights: docData,
  };
  console.log("8/21/22 formed out", out);
  if (
    Object.keys(out.insights).length &&
    token &&
    token.claims &&
    token.claims.role == "buffet"
  ) {
    const proms = [];

    const symbs = Object.keys(out.insights);

    for (const key of symbs) {
      proms.push(
        getDoc(doc(getFirestore(), "notes", `${currentUser.uid}-${key}`))
      );

      const document = await getDoc(
        doc(getFirestore(), "notes", `${currentUser.uid}-${key}`)
      );
      out.insights[key].notes =
        document.exists && document.data() ? document.data().notes || "" : "";
    }

    const snapshots = await Promise.all(proms);

    for (let i = 0; i < snapshots.length; i++) {
      const document = snapshots[i];
      out.insights[symbs[i]].notes =
        document.exists && document.data() ? document.data().notes || "" : "";
    }

    console.log("8/21/22 processed notes", out);
  }

  return [out, errorMessage];
}

async function getSymbolInsights(symbols) {
  let { docData, neededSymbols } = await validCacheEntries(symbols);
  console.log("got cache entries", docData, neededSymbols);
  neededSymbols = Array.from(new Set(neededSymbols));
  // console.log("neededSymbols", neededSymbols);
  const notFound = [];
  if (neededSymbols.length > 0) {
    const querySnapshot = await getDocs(
      query(
        collection(getFirestore(), "quotes"),
        where("symbol", "in", neededSymbols)
      )
    );

    console.log("query snapshot:", querySnapshot);
    if (querySnapshot.empty) {
      console.log("query snapshot is empty");
    } else {
      querySnapshot.forEach(async (doc) => {
        console.log(doc.id, "=>", doc.data());
        docData[doc.id] = doc.data();
        window.localStorage.setItem(
          doc.id,
          JSON.stringify({
            insights: docData[doc.id],
            timestamp: new Date().getTime(),
          })
        );
      });
    }

    for (const symbol of symbols) {
      // debugger;
      if (!docData[symbol]) {
        notFound.push(symbol);
      }
    }
  }
  return [docData, notFound];
}

export async function validCacheEntries(symbols) {
  let docData = {};
  let neededSymbols = [];
  const timestampCutoff = getLastInsightUpdateTime();
  for (const symbol of symbols) {
    let stored = window.localStorage.getItem(symbol);
    // debugger;
    if (!stored) {
      console.log("no cached insight for", symbol);
      neededSymbols.push(symbol);
      continue;
    }
    stored = JSON.parse(stored);
    if (!stored || !stored.timestamp || !stored.insights) {
      console.log("no cached insight for", symbol);
      neededSymbols.push(symbol);
      continue;
    }
    console.log("stored", stored);
    let { insights, timestamp } = stored;
    if (timestamp < timestampCutoff) {
      console.log("found expired cached insight for", symbol);
      neededSymbols.push(symbol);
    } else {
      console.log("found valid cached insight for", symbol);
      docData[symbol] = insights;
    }
  }
  console.log("valid cache entries", { docData, neededSymbols });
  return { docData, neededSymbols };
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
