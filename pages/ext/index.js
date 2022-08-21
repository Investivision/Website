import { useState, useEffect, useCallback, useMemo } from "react";
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
import MetricSection from "../../components/ext/MetricSection";
import LikeButton from "../../components/insights/LikeButton";
import IconButton from "@mui/material/IconButton";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { getLikes, likeSymbol, unlikeSymbol } from "../../utils/insights";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const processSymbolData = (data) => {
  console.log("prophet props process", data);
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
        console.log("prophet props pass", key);
        const days = parseInt(feature.substring(1));
        let obj = {
          days: days,
          low: value[0],
          mid: value[1],
          high: value[2],
        };
        prophet.push(obj);
      } else {
        console.log("prophet props fail", key);
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
    [2520 - 5, 10],
  ];
  let j = 0;
  for (var i = 1; i < prophet.length; i++) {
    if (prophet[i].days == forcastLengths[j][0]) {
      out[forcastLengths[j][1]]["prophet"] = prophet.slice(0, i + 1);
      j++;
    }
  }
  console.log("prophet props out", out);
  return out;
};

const termMap = {
  10: "Long-term - 10yr",
  5: "Med-term - 5yr",
  1: "Short-term - 1yr",
  "3mo": "Swing Trade - 3mo",
};

const orderTimeFrames = (data, sort = true) => {
  if (!data) {
    return undefined;
  }
  let keys = [];
  for (const key of Object.keys(data)) {
    if (key != "global") {
      keys.push(key);
    }
  }

  if (!sort) {
    return keys;
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

  return out;
};

// let curtimeframe = undefined;

let selectedFrames;
let currentTimeFrames;
let prevArgs;

let raw = {}; // for some reason, rawData reads as undefined from inside component

export default function Ext(props) {
  const [rawData, setRawData] = useState(props.data);
  // const [name, setName] = useState(undefined)
  // const [name, setName] = useState(props.data?.name);
  // const [args, setArgs] = useState(props.data?.args);
  const [loading, setLoading] = useState(!props.data);
  const [forbidden, setForbidden] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [port, setPort] = useState(undefined);
  // const [timeFrames, setTimeFrames] = useState(frames);
  // const [currentTimeFrame, setCurrentTimeFrame] = useState(selectedFrames);
  // const [framesPerSymbol, setFramesPerSymbol] = useState(framesPerSym);
  const [likes, setLikes] = useState(props.initialLikes || new Set());
  const [role, setRole] = useState(undefined);

  const [haveMadeRequest, setHaveMadeRequest] = useState(props.data);

  const router = useRouter();

  useEffect(() => {
    // handle data formatting and augmentation
    if (props.data) {
      console.log("ext data before render new props", props.data);
      setRawData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    // alert("new likes");
    if (props.newLikes) {
      setLikes(props.newLikes);
    }
  }, [props.newLikes]);

  useEffect(() => {
    if (props.localFirebase) {
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          const token = await user.getIdTokenResult(true);

          if (token.claims.role) {
            if (["bullish", "buffet"].includes(token.claims.role)) {
              setLikes(await getLikes());
            }
            setRole(token.claims.role);
          }
        } else {
          setRole("");
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   if (props.likes) {
  //     setLikes(props.likes)
  //   }
  // }, [props.likes]);

  useEffect(() => {
    if (props.name) {
      return;
    }
    document.body.classList.add("transparent");
    if (window.chrome && !port && !props.localFirebase && !props.data) {
      const port = chrome.runtime.connect(extId, { name: "" + Math.random() });

      // window.onbeforeunload = function (event) {
      //   alert("refresh");
      //   port.disconnect();
      // };
      port.onMessage.addListener(function (data) {
        console.log("got data from port", data, rawData);
        setRateLimited(data.status == "rateLimited");
        setForbidden(data.status == "forbidden");
        setLoading(data.status == "loading");

        if (data.insights) {
          raw = data;
          setRawData(data);
        } else if (data.name) {
          raw.name = data.name;
          setRawData({ ...raw });
        } else if (data.removeName) {
          // debugger;
          delete raw.name;
          setRawData({ ...raw });
        }

        // if (data.status == 'rateLimited') {
        //   setRateLimited(true)
        // } else if (data.status == 'forbidden') {
        //   setForbidden(false)
        // }
        // setForbidden(data.status == 'forbidden')
        // if (data.status == "loading") {
        //   setLoading(true);
        // } else if (data.status == "done") {
        //   setLoading(false);
        // } else {
        //   setRawData(data);
        //   setForbidden(false);
        //   setRateLimited()
        //   setLoading(false);
        // }
      });
      port.onDisconnect.addListener(function () {
        setPort(undefined);
      });
      window.onbeforeunload = function (event) {
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
  //
  // console.log("ext before render", data, currentTimeFrame);

  // const likes = new Set();

  // for (let i = 0; i < args.length; i++) {
  //   debugger;
  //   if (data[i].liked) {
  //     likes.add(args[i]);
  //   }
  // }]

  const args = rawData?.args;
  const name = rawData?.name;

  const [data, framesPerSymbol, currentTimeFramesForRender] = useMemo(() => {
    // debugger;
    if (rawData) {
      prevArgs = args;
      const formattedData = [];
      const framesPerSymbol = [];
      let commonFrameNum = 4;
      for (const symbol of rawData.args) {
        const formatted = processSymbolData(rawData.insights[symbol]);
        const frames = orderTimeFrames(formatted);
        framesPerSymbol.push(frames);
        // maxFrames.push(frames[0]);
        if (frames.length < commonFrameNum) {
          commonFrameNum = frames.length;
        }
        // for (const frame of frames) {
        //   if (!allFramesSet.has(frame)) {
        //     allFramesSet.add(frame);
        //     allFrames = [...allFrames, frame];
        //   }
        // }
        formattedData.push(formatted);
      }
      if (!currentTimeFrames) {
        currentTimeFrames = rawData.args.map(
          () => framesPerSymbol[0][4 - commonFrameNum]
        );
      }

      if (
        formattedData.length == 1 &&
        framesPerSymbol &&
        (!currentTimeFrames ||
          !currentTimeFrames[0] ||
          !framesPerSymbol[0].includes(currentTimeFrames[0]))
      ) {
        currentTimeFrames = [framesPerSymbol[0][0]];
        // curtimeframe = frames[0];
      }
      // debugger;
      if (rawData.args.length > currentTimeFrames.length) {
        currentTimeFrames = [
          ...currentTimeFrames,
          framesPerSymbol[framesPerSymbol.length - 1][0],
        ];
      }

      // else if (rawData.args.length < currentTimeFrames.length && prevArgs) {
      //   let missingIndex = -1;
      //   for (let i = 0; i < args.length; i++) {

      //   }
      //   currentTimeFrames =
      // }

      return [formattedData, framesPerSymbol, [...currentTimeFrames]];
    }
    return [];
  }, [rawData]);

  // for (const arg of data) {
  //   debugger;
  //   if (data[arg].liked) {
  //     likes.add(arg);
  //   }
  // }

  // const likes = useMemo(() => {
  //   const out = new Set();
  //   for (let i = 0; i < args.length; i++) {
  //     if (data[i].liked) {
  //       out.add(args[i]);
  //     }
  //   }
  //   return out;
  // }, [data]);
  // debugger;
  console.log(
    "ext data before render",
    data,
    currentTimeFramesForRender,
    currentTimeFrames
  );
  return (
    <div
      className={props.className}
      style={Object.assign(
        {
          width: "100%",
          overflow: "hidden",
          overflowX: "scroll",
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
            port={port}
            message="see pricing"
            text="This symbol falls outside your 50 symbol coverage."
            styles={styles}
          />
        ) : rateLimited ? (
          <InfoScreen
            port={port}
            message="see pricing"
            text="You've already accessed 10 insights in the past 24 hours."
            styles={styles}
          />
        ) : currentTimeFramesForRender ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "100%",
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
            {/* <h1 className={styles.symbol}>{args ? args[0] : "no args yet"}</h1> */}
            <MetricSection
            // style={{
            //   position: "sticky",
            //   top: 0,
            // }}
            >
              {args.map((arg, i) => {
                return (
                  <h1 className={styles.symbol}>
                    <LikeButton
                      onLike={async () => {
                        if (role !== undefined) {
                          if (["bullish", "buffet"].includes(role)) {
                            likes.add(arg);
                            likeSymbol(arg);
                            setLikes(new Set(likes));
                            if (props.onLike) {
                              props.onLike(arg);
                            }
                          } else {
                            if (props.port) {
                              // send like attempt to ext background
                            } else {
                              router.prefetch("/pricing");
                              router.push("/pricing");
                            }
                          }
                        }
                      }}
                      onUnlike={() => {
                        if (role !== undefined) {
                          if (["bullish", "buffet"].includes(role)) {
                            likes.delete(arg);
                            unlikeSymbol(arg);
                            setLikes(new Set(likes));
                            if (props.onUnlike) {
                              props.onUnlike(arg);
                            }
                          } else {
                            if (props.port) {
                              // send like attempt to ext background
                            } else {
                              router.prefetch("/pricing");
                              router.push("/pricing");
                            }
                          }
                        }
                      }}
                      likes={likes}
                      val={arg}
                    />
                    {arg}
                    <IconButton
                      size="small"
                      style={
                        props.onClose
                          ? {}
                          : {
                              pointerEvents: "none",
                              opacity: 0,
                            }
                      }
                      onClick={() => {
                        if (props.onClose) {
                          // debugger;
                          currentTimeFrames.splice(i, 1);
                          props.onClose(i);
                        }
                      }}
                    >
                      <ClearRoundedIcon
                        style={{
                          opacity: 0.3,
                        }}
                      />
                    </IconButton>
                  </h1>
                );
              })}
            </MetricSection>
            <MetricSection>
              {data.map((d) => (
                <h3 className={styles.company}>{d.global.name}</h3>
              ))}
            </MetricSection>
            {/* <MetricSection>
              {data.map((d) => (
                <h3 className={styles.company}>{d.global.name}</h3>
              ))}
            </MetricSection> */}
            {/* <h3 className={styles.company}>{data[0].global.name}</h3> */}
            <MetricSection>
              {currentTimeFramesForRender.map((frame, i) => (
                <FormControl
                  style={{
                    marginTop: 20,
                  }}
                >
                  <InputLabel>Time Frame</InputLabel>
                  <Select
                    value={frame}
                    style={{
                      width: 190,
                    }}
                    label="Time Frame"
                    onChange={(event) => {
                      if (event.target.value) {
                        currentTimeFrames[i] = event.target.value;
                        // setCurrentTimeFrame([...currentTimeFrame]);
                        setRawData({ ...rawData });
                        // curtimeframe = event.target.value;
                      }
                    }}
                  >
                    {framesPerSymbol[i].map((key) => {
                      return (
                        <MenuItem value={key} key={key}>
                          {termMap[key]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              ))}
            </MetricSection>
            {data[0][currentTimeFramesForRender[0]] ? (
              <>
                <Report
                  global={data.map((d) => d.global)}
                  data={data.map((d, i) => d[currentTimeFramesForRender[i]])}
                  port={port}
                  currentTimeFrame={currentTimeFramesForRender}
                  symbol={args}
                  localFirebase={props.localFirebase}
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
          <InfoScreen
            text="not tracking this symbol"
            styles={styles}
            port={port}
          />
        ) : null}
      </>
    </div>
  );
}

module.exports.processSymbolData = processSymbolData;
