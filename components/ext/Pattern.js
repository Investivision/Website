import styles from "./pattern.module.css";
import { useTheme } from "@mui/styles";

const candleMap = {
  CDL2CROWS: "Two Crows",
  CDL3BLACKCROWS: "Three Black Crows",
  CDL3INSIDE: "Three Inside Up/Down",
  CDL3LINESTRIKE: "Three-Line Strike",
  CDL3OUTSIDE: "Three Outside Up/Down",
  CDL3STARSINSOUTH: "Three Stars In The South",
  CDL3WHITESOLDIERS: "Three Advancing White Soldiers",
  CDLABANDONEDBABY: "Abandoned Baby",
  CDLADVANCEBLOCK: "Advance Block",
  CDLBELTHOLD: "Belt-hold",
  CDLBREAKAWAY: "Breakaway",
  CDLCLOSINGMARUBOZU: "Closing Marubozu",
  CDLCONCEALBABYSWALL: "Concealing Baby Swallow",
  CDLCOUNTERATTACK: "Counterattack",
  CDLDARKCLOUDCOVER: "Dark Cloud Cover",
  CDLDOJI: "Doji",
  CDLDOJISTAR: "Doji Star",
  CDLDRAGONFLYDOJI: "Dragonfly Doji",
  CDLENGULFING: "Engulfing Pattern",
  CDLEVENINGDOJISTAR: "Evening Doji Star",
  CDLEVENINGSTAR: "Evening Star",
  CDLGAPSIDESIDEWHITE: "Up/Down-Gap Side-by-Side White Lines",
  CDLGRAVESTONEDOJI: "Gravestone Doji",
  CDLHAMMER: "Hammer",
  CDLHANGINGMAN: "Hanging Man",
  CDLHARAMI: "Harami Pattern",
  CDLHARAMICROSS: "Harami Cross Pattern",
  CDLHIGHWAVE: "High-Wave Candle",
  CDLHIKKAKE: "Hikkake Pattern",
  CDLHIKKAKEMOD: "Modified Hikkake Pattern",
  CDLHOMINGPIGEON: "Homing Pigeon",
  CDLIDENTICAL3CROWS: "Identical Three Crows",
  CDLINNECK: "In-Neck Pattern",
  CDLINVERTEDHAMMER: "Inverted Hammer",
  CDLKICKING: "Kicking",
  CDLKICKINGBYLENGTH: "Kicking",
  CDLLADDERBOTTOM: "Ladder Bottom",
  CDLLONGLEGGEDDOJI: "Long Legged Doji",
  CDLLONGLINE: "Long Line Candle",
  CDLMARUBOZU: "Marubozu",
  CDLMATCHINGLOW: "Matching Low",
  CDLMATHOLD: "Mat Hold",
  CDLMORNINGDOJISTAR: "Morning Doji Star",
  CDLMORNINGSTAR: "Morning Star",
  CDLONNECK: "On-Neck Pattern",
  CDLPIERCING: "Piercing Pattern",
  CDLRICKSHAWMAN: "Rickshaw Man",
  CDLRISEFALL3METHODS: "Rising/Falling Three Methods",
  CDLSEPARATINGLINES: "Separating Lines",
  CDLSHOOTINGSTAR: "Shooting Star",
  CDLSHORTLINE: "Short Line Candle",
  CDLSPINNINGTOP: "Spinning Top",
  CDLSTALLEDPATTERN: "Stalled Pattern",
  CDLSTICKSANDWICH: "Stick Sandwich",
  CDLTAKURI: "Takuri (Dragonfly Doji with very long lower shadow)",
  CDLTASUKIGAP: "Tasuki Gap",
  CDLTHRUSTING: "Thrusting Pattern",
  CDLTRISTAR: "Tristar Pattern",
  CDLUNIQUE3RIVER: "Unique 3 River",
  CDLUPSIDEGAP2CROWS: "Upside Gap Two Crows",
  CDLXSIDEGAP3METHODS: "Upside/Downside Gap Three Methods",
};

export default function Pattern(props) {
  const bullish = [];
  const bearish = [];
  for (const [pattern, value] of Object.entries(props.pattern)) {
    if (value > 0) {
      bullish.push(candleMap[pattern]);
    } else if (value < 0) {
      bearish.push(candleMap[pattern]);
    }
  }

  const theme = useTheme();

  console.log("theme from pattern", theme);

  return (
    <div className={styles.container} style={props.style}>
      <div>
        <h4>Bullish</h4>
        {bullish.length == 0 ? (
          <p className={styles.noneDetected}>None detected</p>
        ) : (
          bullish.map((pattern, index) => (
            <p
              key={index}
              style={{
                backgroundColor: "#00990040",
                lineHeight: "150%",
              }}
            >
              {pattern}
              <a
                target="_blank"
                href={`https://www.investopedia.com/search?q=${pattern
                  .split(" ")
                  .join("+")}`}
                style={{
                  backgroundColor:
                    theme.palette.mode != "dark" ? "white" : "rgba(0,0,0,0.7)",
                }}
              >
                ?
              </a>
            </p>
          ))
        )}
      </div>
      <div>
        <h4>Bearish</h4>
        {bearish.length == 0 ? (
          <p className={styles.noneDetected}>None detected</p>
        ) : (
          bearish.map((pattern, index) => (
            <p
              key={index}
              style={{
                backgroundColor: "#ff000030",
              }}
            >
              {pattern}
              <a
                href={`https://www.investopedia.com/search?q=${pattern
                  .split(" ")
                  .join("+")}`}
                style={{
                  backgroundColor:
                    theme.palette.mode != "dark" ? "white" : "rgba(0,0,0,0.6)",
                }}
              >
                ?
              </a>
            </p>
          ))
        )}
      </div>
    </div>
  );
}
