import Ext from "../../components/ext";
import { useEffect, useState, useMemo } from "react";
import styles from "./index.module.css";
import Button from "@mui/material/Button";
import ThemeToggle from "../../components/ThemeToggle";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getScopedSymbolData } from "../compare";
import InfoScreen from "../../components/ext/InfoScreen";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const sites = [
  {
    title: "Robinhood",
    url: "https://robinhood.com/stocks/AAPL",
  },
  {
    title: "Finviz",
    url: "https://finviz.com/quote.ashx?t=AAPL",
  },
  {
    title: "Etrade",
    url: "https://us.etrade.com/etx/mkt/quotes?symbol=AAPL",
  },
  {
    title: "TradingView",
    url: "https://www.tradingview.com/chart/2TiSDQa7/?symbol=NASDAQ%3AAAPL",
  },
  { title: "Zachs", url: "https://www.zacks.com/stock/quote/AAPL?q=AAPL" },
  {
    title: "WallStreetZen",
    url: "https://www.wallstreetzen.com/stocks/us/nasdaq/aapl",
  },
  {
    title: "MorningStar",
    url: "https://www.morningstar.com/stocks/xnas/aapl/quote",
  },
  {
    title: "The Motley Fool",
    url: "https://www.fool.com/quote/nasdaq/aapl/",
  },
];

let lastArgs;

export default function ExtPage(props) {
  const [port, setPort] = useState();
  const [user, setUser] = useState(undefined);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (u) => {
      // port.postMessage({ redirect: window.location.origin + "/login" });
      setUser(u || null);
      console.log("user change", u, data);
      if (u && lastArgs) {
        const [symbolData, message] = await getScopedSymbolData(lastArgs);
        if (message) {
          setMessage(message);
        }
        setData(symbolData);
        if (!message) {
          setMessage(undefined);
        }
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const port = chrome.runtime.connect(extId, { name: "" + Math.random() });
    port.onMessage.addListener(async function (data) {
      console.log("11/14 got chrome data", data);
      if (data.args) {
        setLoading(true);
        lastArgs = data.args;
        const [symbolData, message] = await getScopedSymbolData(data.args);
        if (message) {
          setMessage(message);
        }
        setData(symbolData);
        if (!message) {
          setMessage(undefined);
        }
        setLoading(false);
        console.log("got data from ext", data);
      }
    });
    port.onDisconnect.addListener(function () {
      setPort(undefined);
    });
    window.onbeforeunload = function (event) {
      port.disconnect();
      setPort(undefined);
    };
    setPort(port);
  }, []);

  const ExtComponent = useMemo(() => {
    if (data) {
      try {
        return (
          <Ext
            data={data}
            style={{
              opacity: loading ? 0.2 : 1,
            }}
            port={port}
          />
        );
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [data, loading]);

  if (user === undefined || !port) {
    return null;
  }

  if (message) {
    if (message.includes("not available in your current plan")) {
      // out of role
      return (
        <InfoScreen
          styles={styles}
          text={message}
          message={"forbidden"}
          port={port}
          url="/pricing"
          buttonText={"Upgrade for Unlimited Access"}
        />
      );
    } else if (message.includes("not tracked")) {
      // not tracked
      return <InfoScreen styles={styles} text={message} />;
    }
    return <p>other message</p>;
  }

  console.log("data before render", data);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <ThemeToggle style={{}} />
      </div>
      <h2>
        {user ? "Welcome, " + user.displayName.split(" ")[0] : "Investivision"}
      </h2>
      <Button
        onClick={() => {
          if (user) {
            signOut(getAuth());
          } else {
            port.postMessage({ redirect: window.location.origin + "/login" });
          }
        }}
        sx={{
          minWidth: 100,
          padding: "2px 10px",
        }}
        // style={{
        //   marginTop: 0,
        // }}
      >
        {user ? "Sign out" : "Sign in"}
      </Button>
      {data ? (
        <>
          {ExtComponent}
          <Button
            variant="outlined"
            size="large"
            style={{
              marginTop: 50,
              marginBottom: 20,
              fontWeight: 400,
            }}
            disableElevation
            onClick={() => {
              port.postMessage({
                redirect: window.location.origin,
              });
            }}
          >
            More on Investivision.com
          </Button>
        </>
      ) : (
        <div className={styles.waitingForData}>
          <img src="/images/tensor_logo.svg" />
          <p>Start by navigating to a stock research page, such as:</p>
          <div className={styles.sites}>
            {sites.map((site) => (
              <Button
                onClick={() => {
                  port.postMessage({
                    redirect: site.url,
                  });
                }}
                variant="outlined"
                size="large"
              >
                {site.title}
              </Button>
            ))}
          </div>
        </div>
      )}
      {loading ? (
        <div
          style={{
            position: "fixed",
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {/* <img src="/images.logo.svg" /> */}
        </div>
      ) : null}
    </div>
  );
}
