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
    }
    if (!port) {
      const port = chrome.runtime.connect(extId, { name: "" + Math.random() });
      port.onMessage.addListener(function (data) {
        console.log("got data", data);
        if (data.status == "loading") {
          setLoading(true);
        } else if (data.status == "done") {
          setLoading(false);
        } else {
          // do we need to test data.status == 'done'
          if (
            data.insights &&
            Object.keys(data.insights).length > 0 &&
            data.args.length == 1
          ) {
            const formatted = processSymbolData(data.insights[data.args[0]]);
            setArgs(data.args);
            setName(data.name);
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
  return (
    <div
      className={props.className}
      style={Object.assign(
        {
          width: "100%",
          overflowX: "hidden",
          overflowY: "scroll",
          padding: "20px 10px",
          opacity: loading ? 0.3 : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        props.style
      )}
    >
      {loading || !timeFrames ? null : (
        <>
          {props.data ? null : (
            <ThemeToggle
              style={{
                position: "absolute",
                top: 0,
                right: 0,
              }}
            />
          )}
          {/* <img
            src="https://investivision.com/newLogo.svg"
            className={styles.icon}
          /> */}
          <div className={styles.header}>
            <h2>{name ? "Welcome, Blake" : "Investivision"}</h2>
            <p
              onClick={() => {
                if (name) {
                  port.postMessage({ message: "sign out" });
                  alert("will sign out");
                } else {
                  alert("will redirect");
                }
              }}
            >
              {name ? "Sign out" : "Sign in"}
            </p>
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

          <Report global={data.global} data={data[currentTimeFrame]} />
          {props.data ? null : (
            <Button
              variant="contained"
              size="large"
              style={{
                marginTop: 50,
                marginBottom: 20,
                fontWeight: 400,
              }}
              disableElevation
            >
              More on Investivision.com
            </Button>
          )}
        </>
      )}
    </div>
  );
}
