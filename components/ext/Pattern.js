import styles from "./pattern.module.css";
import { useTheme } from "@mui/styles";
import candleMap from "../insights/candleMap";

// const candleMap = {
//   "2CROWS": "Two Crows",
//   "3BLACKCROWS": "Three Black Crows",
//   "3INSIDE": "Three Inside Up/Down",
//   "3LINESTRIKE": "Three-Line Strike",
//   "3OUTSIDE": "Three Outside Up/Down",
//   "3STARSINSOUTH": "Three Stars In The South",
//   "3WHITESOLDIERS": "Three Advancing White Soldiers",
//   ABANDONEDBABY: "Abandoned Baby",
//   ADVANCEBLOCK: "Advance Block",
//   BELTHOLD: "Belt-hold",
//   BREAKAWAY: "Breakaway",
//   CLOSINGMARUBOZU: "Closing Marubozu",
//   CONCEALBABYSWALL: "Concealing Baby Swallow",
//   COUNTERATTACK: "Counterattack",
//   DARKCLOUDCOVER: "Dark Cloud Cover",
//   DOJI: "Doji",
//   DOJISTAR: "Doji Star",
//   DRAGONFLYDOJI: "Dragonfly Doji",
//   ENGULFING: "Engulfing Pattern",
//   EVENINGDOJISTAR: "Evening Doji Star",
//   EVENINGSTAR: "Evening Star",
//   GAPSIDESIDEWHITE: "Up/Down-Gap Side-by-Side White Lines",
//   GRAVESTONEDOJI: "Gravestone Doji",
//   HAMMER: "Hammer",
//   HANGINGMAN: "Hanging Man",
//   HARAMI: "Harami Pattern",
//   HARAMICROSS: "Harami Cross Pattern",
//   HIGHWAVE: "High-Wave Candle",
//   HIKKAKE: "Hikkake Pattern",
//   HIKKAKEMOD: "Modified Hikkake Pattern",
//   HOMINGPIGEON: "Homing Pigeon",
//   IDENTICAL3CROWS: "Identical Three Crows",
//   INNECK: "In-Neck Pattern",
//   INVERTEDHAMMER: "Inverted Hammer",
//   KICKING: "Kicking",
//   KICKINGBYLENGTH: "Kicking",
//   LADDERBOTTOM: "Ladder Bottom",
//   LONGLEGGEDDOJI: "Long Legged Doji",
//   LONGLINE: "Long Line Candle",
//   MARUBOZU: "Marubozu",
//   MATCHINGLOW: "Matching Low",
//   MATHOLD: "Mat Hold",
//   MORNINGDOJISTAR: "Morning Doji Star",
//   MORNINGSTAR: "Morning Star",
//   ONNECK: "On-Neck Pattern",
//   PIERCING: "Piercing Pattern",
//   RICKSHAWMAN: "Rickshaw Man",
//   RISEFALL3METHODS: "Rising/Falling Three Methods",
//   SEPARATINGLINES: "Separating Lines",
//   SHOOTINGSTAR: "Shooting Star",
//   SHORTLINE: "Short Line Candle",
//   SPINNINGTOP: "Spinning Top",
//   STALLEDPATTERN: "Stalled Pattern",
//   STICKSANDWICH: "Stick Sandwich",
//   TAKURI: "Takuri (Dragonfly Doji with very long lower shadow)",
//   TASUKIGAP: "Tasuki Gap",
//   THRUSTING: "Thrusting Pattern",
//   TRISTAR: "Tristar Pattern",
//   UNIQUE3RIVER: "Unique 3 River",
//   UPSIDEGAP2CROWS: "Upside Gap Two Crows",
//   XSIDEGAP3METHODS: "Upside/Downside Gap Three Methods",
// };

const Item = function (props) {
  return (
    <div
      className={`${styles.patternContainer} ${props.className || ""}`}
      style={{
        backgroundColor: props.background,
        ...props.style,
      }}
    >
      <p>{props.pattern}</p>
      {!props.isNull ? (
        <a
          href={`https://www.investopedia.com/search?q=${props.pattern
            .split(" ")
            .join("+")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor:
              props.theme.palette.mode != "dark" ? "white" : "black",
          }}
        >
          ?
        </a>
      ) : null}
    </div>
  );
};

const NullItem = function (props) {
  return (
    <Item
      className={styles.noneDetected}
      pattern="None detected"
      isNull
      theme={props.theme}
    />
  );
};

export default function Pattern({ bullish = [], bearish = [], style = {} }) {
  // const bullish = [];
  // const bearish = [];
  // for (const [pattern, value] of Object.entries(props.pattern)) {
  //   if (value > 0) {
  //     bullish.push(candleMap[pattern]);
  //   } else if (value < 0) {
  //     bearish.push(candleMap[pattern]);
  //   }
  // }

  bullish = bullish.map((name) => candleMap[name]);
  bearish = bearish.map((name) => candleMap[name]);

  const theme = useTheme();

  return (
    <div className={styles.container} style={style}>
      <div>
        <h4>Bullish</h4>
        {bullish.length == 0 ? (
          <NullItem theme={theme} />
        ) : (
          bullish.map((pattern, index) => (
            <Item
              background="#00990040"
              pattern={pattern}
              key={index}
              theme={theme}
            />
          ))
        )}
      </div>
      <div>
        <h4>Bearish</h4>
        {bearish.length == 0 ? (
          <NullItem theme={theme} />
        ) : (
          bearish.map((pattern, index) => (
            <Item
              background="#ff000030"
              pattern={pattern}
              key={index}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  );
}
