import { useState, useEffect } from "react";
import { alterHsl } from "tsparticles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Report from "./Report";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { StylesContext } from "@material-ui/styles";
import styles from "./index.module.css";
import ThemeToggle from "../../components/ThemeToggle";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const processSymbolData = (data) => {
  let out = {
    global: {},
  };
  let prophet = [];
  for (let [key, value] of Object.entries(data)) {
    const [feature, timeframe, z] = key.split("_");
    if (!timeframe) {
      if (feature.charAt(0) == "p" && parseInt(feature.charAt(1))) {
        const days = parseInt(feature.substring(1));
        let obj = {
          days: days,
          low: value[0],
          mid: value[1],
          high: value[2],
        };
        prophet.push(obj);
      } else {
        out.global[feature] = value;
      }
      continue;
    }
    if (timeframe == "z") {
      out.global[feature + "_z"] = value;
      continue;
    }
    if (!(timeframe in out)) {
      out[timeframe] = {};
    }
    const newKey = feature + (z ? "_z" : "");

    out[timeframe][newKey] = value;
  }
  prophet.sort((a, b) => {
    return a.days - b.days;
  });
  const roundedClose = Math.round(out.global.lastclose, 1);
  prophet.unshift({
    days: 0,
    low: roundedClose,
    mid: roundedClose,
    high: roundedClose,
  });

  const forcastLengths = [
    [63, "3mo"],
    [252, 1],
    [1260, 5],
    [2520, 10],
  ];
  let j = 0;
  for (var i = 1; i < prophet.length; i++) {
    if (prophet[i].days == forcastLengths[j][0]) {
      out[forcastLengths[j][1]]["prophet"] = prophet.slice(0, i + 1);
      j++;
    }
  }

  return out;
};

const termMap = {
  10: "Long-term - 10yr",
  5: "Med-term - 5yr",
  1: "Short-term - 1yr",
  "3mo": "Swing Trade - 3mo",
};

const orderTimeFrames = (data) => {
  let keys = [];
  for (const key of Object.keys(data)) {
    if (key != "global") {
      keys.push(key);
    }
  }
  const out = keys.sort((a, b) => {
    if (a.indexOf("mo") > -1) {
      return 1;
    }
    if (b.indexOf("mo") > -1) {
      return -1;
    }
    if (parseInt(a) > parseInt(b)) {
      return -1;
    }
  });
  console.log(out);
  return out;
};

export default function Ext(props) {
  const [data, setData] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [args, setArgs] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [port, setPort] = useState(undefined);
  const [timeFrames, setTimeFrames] = useState(undefined);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(undefined);

  useEffect(() => {
    console.log("props", props);
    if (Object.keys(props).length > 0) {
      setData(props.data);
      setName(props.name);
      setCurrentTimeFrame(props.currentTimeFrame);
      setTimeFrames(props.timeFrames);
      setArgs(props.args);
      setLoading(false);
      return;
    } else {
      // alert("make transparent", props);
      // document.body.style.backgroundColor = "red !important";
      document.body.classList.add("transparent");
    }
    if (!port) {
      const port = chrome.runtime.connect(extId, { name: "" + Math.random() });
      port.onMessage.addListener(function (data) {
        console.log("got data", data);
        setForbidden(data.status == "forbidden");
        setRateLimited(data.status == "rateLimited");
        if (["forbidden", "rateLimited"].includes(data.status)) {
          setLoading(false);
        }
        setForbidden(data.status == "forbidden");
        if (data.status == "loading") {
          setLoading(true);
        } else if (data.status == "done") {
          setLoading(false);
        } else {
          // do we need to test data.status == 'done'
          if (data.name) {
            console.log("got new name", data);
            setName(data.name);
          }
          if (data.removeName) {
            console.log("removing name", data);
            setName(undefined);
          }
          if (
            data.insights &&
            Object.keys(data.insights).length > 0 &&
            data.args.length == 1
          ) {
            // if insights exist for this symbol
            const formatted = processSymbolData(data.insights[data.args[0]]);
            setArgs(data.args);
            const frames = orderTimeFrames(formatted);
            console.log("formatted", formatted);
            setCurrentTimeFrame(frames[0]);
            setData(formatted);
            setTimeFrames(frames);
            setLoading(false);
          }
        }
      });
      port.onDisconnect.addListener(function () {
        alert("disconnecting");
        setPort(undefined);
      });
      window.onbeforeunload = function (event) {
        alert("disconnecting");
        port.disconnect();
      };
      setPort(port);
    }
    // }
  }, [port]);
  console.log(
    "data",
    JSON.stringify(data),
    "name",
    name,
    "currentTimeFrame",
    currentTimeFrame,
    "timeFrames",
    timeFrames,
    "loading",
    loading,
    "args",
    args
  );
  // useEffect(() => {
  //   if (!props.data) {
  //     document.body.style.backgroundColor = "transparent";
  //   }
  //   postMessage("iframe loaded", "*");
  // });
  return (
    <div
      className={props.className}
      style={Object.assign(
        {
          width: "100%",
          overflowX: "hidden",
          overflowY: "scroll",
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        props.style
      )}
    >
      <>
        {loading ? (
          <div
            style={{
              position: "fixed",
              width: "100%",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
            }}
          >
            <img
              className={styles.loadingLogo + " " + styles.logoAnimated}
              src="/images/logo.svg"
            />
          </div>
        ) : null}
      </>
      <>
        {forbidden ? (
          <div
            style={{
              position: "fixed",
              width: "100%",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: 20,
              opacity: loading ? 0 : 1,
            }}
          >
            <img className={styles.loadingLogo} src="/images/logo.svg" />
            <p
              style={{
                fontSize: 18,
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              This symbol falls outside your 50 symbol coverage
            </p>
            <Button
              variant="contained"
              onClick={() => {
                port.postMessage({
                  message: "see pricing",
                });
              }}
            >
              Upgrade for Unlimited Coverage
            </Button>
          </div>
        ) : rateLimited ? (
          <div
            style={{
              position: "fixed",
              width: "100%",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: 20,
              opacity: loading ? 0 : 1,
            }}
          >
            <img className={styles.loadingLogo} src="/images/logo.svg" />
            <p
              style={{
                fontSize: 18,
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              You've already accessed 10 insights in the past 24 hours.
            </p>
            <Button
              variant="contained"
              onClick={() => {
                port.postMessage({
                  message: "see pricing",
                });
              }}
            >
              Upgrade for Unlimited Insights
            </Button>
          </div>
        ) : timeFrames ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              opacity: loading ? 0.2 : 1,
            }}
          >
            {props.data ? null : (
              <ThemeToggle
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />
            )}
            <div className={styles.header}>
              <h2>
                {name ? "Welcome, " + name.split(" ")[0] : "Investivision"}
              </h2>
              <Button
                onClick={() => {
                  if (name) {
                    port.postMessage({ message: "sign out from extension" });
                  } else {
                    port.postMessage({ message: "sign in from extension" });
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
                {name ? "Sign out" : "Sign in"}
              </Button>
            </div>
            <h1 className={styles.symbol}>{args ? args[0] : "no args yet"}</h1>
            <FormControl>
              <InputLabel>Time Frame</InputLabel>
              <Select
                value={currentTimeFrame}
                style={{
                  width: 190,
                }}
                label="Time Frame"
                onChange={(event) => {
                  setCurrentTimeFrame(event.target.value);
                }}
              >
                {timeFrames.map((key) => {
                  return (
                    <MenuItem value={key} key={key}>
                      {termMap[key]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Report
              global={data.global}
              data={data[currentTimeFrame]}
              port={port}
            />
            {props.data ? null : (
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
                    message: "redirect to investivision",
                  });
                }}
              >
                More on Investivision.com
              </Button>
            )}
          </div>
        ) : null}
      </>
    </div>
  );
}
