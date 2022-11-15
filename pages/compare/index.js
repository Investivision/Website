import HeaderAndFooter from "../../components/HeaderAndFooter";
import Ext from "../../components/ext";
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
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(true);
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

const dataCache = {};

export async function getScopedSymbolData(symbolList) {
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

  let errorMessage = "";

  if (!queryAllSymbols) {
    let symbols;
    if (dataCache.topSymbols) {
      symbols = dataCache.topSymbols;
    } else {
      const res = await fetch(
        "https://raw.githubusercontent.com/Investivision/insight-engine/master/symbols.txt"
      );
      symbols = new Set((await res.text()).split("\n"));
      dataCache.topSymbols = symbols;
    }
    const noAccessSymbols = [];
    const neededSymbols = [];
    for (const symbol of symbolList) {
      if (!symbols.has(symbol)) {
        noAccessSymbols.push(symbol);
      } else {
        neededSymbols.push(symbol);
      }
    }
    if (noAccessSymbols.length) {
      errorMessage +=
        noAccessSymbols.join(", ") + " not available in your current plan. ";
    }
    symbolList = neededSymbols;
  }

  // const symbolData = []

  const prom = [];

  function noReject(symbol) {
    return new Promise(async (accept) => {
      try {
        if (dataCache[symbol]) {
          // alert("using cache");
          accept({
            symbol: symbol,
            data: dataCache[symbol],
          });
        } else {
          const res = await fetch(
            `https://raw.githubusercontent.com/blakesanie/insight-engine/insights/${symbol}.json`
          );
          const json = await res.json();
          dataCache[symbol] = { ...json }; // otherwise keys get removed from cache entry
          accept({
            symbol: symbol,
            data: json,
          });
        }
      } catch (e) {
        accept({
          symbol: symbol,
        });
      }
    });
  }

  for (const symbol of symbolList) {
    prom.push(noReject(symbol));
  }

  const responses = await Promise.all(prom);

  const notFound = [];

  const symbolData = responses
    .filter((res) => {
      // debugger;
      if (!res.data) {
        notFound.push(res.symbol);
        return false;
      }
      return true;
    })
    .map((resp) => {
      // debugger;
      const { symbol, data } = resp;
      if (!["bullish", "buffet"].includes(role)) {
        console.log("11/14 all keys", Object.keys(data));
        for (const key in data) {
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
            key.startsWith("phase") ||
            key.startsWith("bullP") ||
            key.startsWith("bearP")
          ) {
            console.log("11/14 removing key", key);
            delete data[key];
          }
        }
      }
      const out = {};
      out[symbol] = data;
      return out;
    });

  if (notFound.length) {
    errorMessage += notFound.join(", ") + " not tracked. ";
    const notFoundSet = new Set(notFound);
    symbolList = symbolList.filter((symbol) => !notFoundSet.has(symbol));
  }

  let out = {
    args: symbolList,
    insights: {},
  };

  // debugger;
  for (const obj of symbolData) {
    out.insights = Object.assign(out.insights, obj);
  }

  if (role == "buffet") {
    const proms = [];

    const symbs = Object.keys(out.insights);

    for (const key of symbs) {
      proms.push(
        getDoc(doc(getFirestore(), "notes", `${currentUser.uid}-${key}`))
      );
    }

    const snapshots = await Promise.all(proms);

    for (let i = 0; i < snapshots.length; i++) {
      const document = snapshots[i];
      const data =
        document.exists && document.data() ? document.data().notes || "" : "";
      // if (data) {
      out.insights[symbs[i]].notes = data;
      // }
    }
  }
  // debugger;
  return [out, errorMessage];
}
