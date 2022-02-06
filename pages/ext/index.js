import { useState, useEffect } from "react";
import { alterHsl } from "tsparticles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Report from "../../components/ext/Report";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { StylesContext } from "@material-ui/styles";
import styles from "./index.module.css";
import ThemeToggle from "../../components/ThemeToggle";
import InfoScreen from "../../components/ext/InfoScreen";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const processSymbolData = (data) => {
  if (!data) {
    return undefined;
  }
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
    // if (timeframe == "z") {
    //   out.global[feature + "_z"] = value;
    //   continue;
    // }
    if (!(timeframe in out)) {
      out[timeframe] = {};
    }

    out[timeframe][feature] = value;
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
  if (!data) {
    return undefined;
  }
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

let curtimeframe = undefined;

export default function Ext(props) {
  const formatted = processSymbolData(
    props.data ? props.data.insights[props.data.args[0]] : undefined
  );
  const frames = orderTimeFrames(formatted);
  const [data, setData] = useState(formatted);
  const [name, setName] = useState(props.data?.name);
  const [args, setArgs] = useState(props.data?.args);
  const [loading, setLoading] = useState(!props.data);
  const [forbidden, setForbidden] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [port, setPort] = useState(undefined);
  const [timeFrames, setTimeFrames] = useState(frames);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(
    frames ? frames[0] : undefined
  );
  if (frames) {
    curtimeframe = frames[0];
  }
  const [haveMadeRequest, setHaveMadeRequest] = useState(props.data);

  useEffect(() => {
    console.log("props.data", props.data);
    const formatted = processSymbolData(
      props.data ? props.data.insights[props.data.args[0]] : undefined
    );
    const frames = orderTimeFrames(formatted);
    console.log(
      "try to set new time frame",
      frames,
      curtimeframe,
      frames.includes(curtimeframe)
    );
    if (
      frames &&
      (curtimeframe === undefined || !frames.includes(curtimeframe))
    ) {
      setCurrentTimeFrame(frames[0]);
      curtimeframe = frames[0];
    }
    setData(formatted);
    setName(props.data?.name);
    setArgs(props.data?.args);
    setTimeFrames(frames);
  }, [props.data]);

  useEffect(() => {
    console.log("props", props);
    if (props.name) {
      return;
    }
    document.body.classList.add("transparent");
    if (!port) {
      const port = chrome.runtime.connect(extId, { name: "" + Math.random() });
      port.onMessage.addListener(function (data) {
        console.log("got data", data);
        setRateLimited(data.status == "rateLimited");
        if (["forbidden", "rateLimited"].includes(data.status)) {
          setLoading(false);
        }
        if (data.status == "forbidden") {
          setForbidden(true);
        }
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
          if (data.insights && data.args.length == 1) {
            if (Object.keys(data.insights).length > 0) {
              // if insights exist for this symbol
              const formatted = processSymbolData(data.insights[data.args[0]]);
              setArgs(data.args);
              const frames = orderTimeFrames(formatted);
              console.log("formatted", JSON.stringify(formatted));
              if (
                curtimeframe === undefined ||
                !frames.includes(curtimeframe)
              ) {
                setCurrentTimeFrame(frames[0]);
                curtimeframe = frames[0];
              }
              setData(formatted);
              setTimeFrames(frames);
            }
            setLoading(false);
            setForbidden(false);
          }
          setHaveMadeRequest(true);
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
  // useEffect(() => {
  //   if (!props.data) {
  //     document.body.style.backgroundColor = "transparent";
  //   }
  //   postMessage("iframe loaded", "*");
  // });
  console.log("currentTimeFrame", currentTimeFrame);
  return (
    <div
      className={props.className}
      style={Object.assign(
        {
          width: "100%",
          overflow: "hidden",
          // overflowY: "scroll",
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        props.style
      )}
    >
      <>
        {loading && !props.data ? (
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
          <InfoScreen
            message="see pricing"
            text="This symbol falls outside your 50 symbol coverage."
            styles={styles}
          />
        ) : rateLimited ? (
          <InfoScreen
            message="see pricing"
            text="You've already accessed 10 insights in the past 24 hours."
            styles={styles}
          />
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
                  top: -20,
                  right: -10,
                }}
              />
            )}
            {props.hideHeader ? null : (
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
            )}
            <h1 className={styles.symbol}>{args ? args[0] : "no args yet"}</h1>
            <h3 className={styles.company}>{data.global.name}</h3>
            <FormControl>
              <InputLabel>Time Frame</InputLabel>
              <Select
                value={currentTimeFrame}
                style={{
                  width: 190,
                }}
                label="Time Frame"
                onChange={(event) => {
                  console.log("event", event);
                  if (event.target.value) {
                    setCurrentTimeFrame(event.target.value);
                    curtimeframe = event.target.value;
                  }
                  console.log(
                    "set current time frame to",
                    event.target.value,
                    typeof event.target.value
                  );
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
            {data[currentTimeFrame] ? (
              <>
                <Report
                  global={data.global}
                  data={data[currentTimeFrame]}
                  port={port}
                  currentTimeFrame={currentTimeFrame}
                  symbol={args[0]}
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
              </>
            ) : null}
          </div>
        ) : haveMadeRequest ? (
          <InfoScreen text="not tracking this symbol" styles={styles} />
        ) : null}
      </>
    </div>
  );
}
