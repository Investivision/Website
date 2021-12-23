import { useState, useEffect, useRef } from "react";
import { alterHsl } from "tsparticles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Numeric from "./Numeric";
import Pattern from "./Pattern";
import RangePlot from "./RangePlot";
import styles from "./report.module.css";

let autosaveInterval;

function zToPercentile(z) {
  // z == number of standard deviations from the mean

  // if z is greater than 6.5 standard deviations from the mean the
  // number of significant digits will be outside of a reasonable range

  if (z < -6.5) {
    return 0.0;
  }

  if (z > 6.5) {
    return 1.0;
  }

  var factK = 1;
  var sum = 0;
  var term = 1;
  var k = 0;
  var loopStop = Math.exp(-23);

  while (Math.abs(term) > loopStop) {
    term =
      (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
        (2 * k + 1) /
        Math.pow(2, k)) *
        Math.pow(z, k + 1)) /
      factK;
    sum += term;
    k++;
    factK *= k;
  }

  sum += 0.5;

  return sum;
}

function UpgradeButton(props) {
  return (
    <Button
      variant="contained"
      // color="secondary"
      onClick={() => {
        props.port.postMessage({
          message: "see pricing",
        });
      }}
    >
      Upgrade to Unlock
    </Button>
  );
}

let savedValue;

export default function Report(props) {
  savedValue = props.global.notes;
  const notesRef = useRef(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.value = savedValue;
    }
  }, [notesRef, props]);

  return (
    <div className={styles.report}>
      <h3>Growth</h3>
      {props.data.alpha ? (
        <Numeric
          percentile={zToPercentile(props.data.alpha_z)}
          value={`${Math.round(props.data.alpha * 100 * 10) / 10}%`}
          desc={"Annualized Gain"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      {props.data.beta ? (
        <Numeric
          percentile={1 - zToPercentile(props.data.beta_z)}
          value={`${Math.round(props.data.beta * 100 * 10) / 10}%`}
          desc={"Movement vs. S&P"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      {props.data.drawup ? (
        <Numeric
          percentile={zToPercentile(props.data.drawup_z)}
          value={`${Math.round(props.data.drawup * 100)}%`}
          desc={"Max Bull Run"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      <h3>Risk Management</h3>
      {props.data.natr ? (
        <Numeric
          percentile={1 - zToPercentile(props.data.natr_z)}
          value={`${Math.round(props.data.natr * 100) / 100}`}
          desc={"Volatility Index"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      {props.data.sharpe ? (
        <Numeric
          percentile={zToPercentile(props.data.sharpe_z)}
          value={`${Math.round(props.data.sharpe * 100) / 100}`}
          desc={"Reward / Risk"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      {props.data.drawdown ? (
        <Numeric
          percentile={zToPercentile(props.data.drawdown_z)}
          value={`${Math.round(props.data.drawdown * 100 * 10) / 10}%`}
          desc={"Max Loss"}
          style={{
            margin: 10,
          }}
        />
      ) : null}
      <h3>Candle Patterns</h3>
      {props.global.pattern ? (
        <Pattern
          pattern={props.global.pattern}
          style={{
            width: "100%",
          }}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
      <h3>AI Forecast</h3>
      {props.data.p && props.data.pr && props.data.prophet ? (
        <>
          <Numeric
            percentile={zToPercentile(props.data.p_z)}
            value={`${Math.round(props.data.p * 10) / 10}%`}
            desc={"Predicted Gain"}
            style={{
              margin: 10,
            }}
          />
          <Numeric
            percentile={zToPercentile(props.data.pr_z)}
            value={`${Math.round(props.data.pr * 10) / 10}%`}
            desc={"Prediction Range"}
            style={{
              margin: 10,
            }}
          />
          <RangePlot
            points={props.data.prophet}
            lastClose={props.global.lastclose}
          />
        </>
      ) : (
        <UpgradeButton port={props.port} />
      )}
      <h3>Notes</h3>
      {props.global.notes !== undefined ? (
        <>
          <p
            style={{
              marginTop: -16,
              marginBottom: 16,
              fontSize: 12,
              opacity: 0.3,
            }}
          >
            {saved ? "Saved" : "Syncing..."}
          </p>
          <textarea
            placeholder="In January, set limit sell order."
            ref={notesRef}
            onChange={() => {
              console.log(
                "current",
                notesRef.current.value,
                "saved",
                savedValue
              );
              setSaved(notesRef.current.value == savedValue);
            }}
            onFocus={() => {
              autosaveInterval = setInterval(() => {
                const curr = notesRef.current.value;
                if (curr !== savedValue) {
                  props.port.postMessage({
                    symbol: props.global.symbol,
                    notes: curr,
                  });
                  console.log("new saved value is", curr);
                  savedValue = curr;
                  console.log("reading from saved value", savedValue);
                }
                setSaved(true);
              }, 10000);
            }}
            onBlur={() => {
              clearInterval(autosaveInterval);
              const curr = notesRef.current.value;
              if (curr != savedValue) {
                props.port.postMessage({
                  symbol: props.global.symbol,
                  notes: curr,
                });
                savedValue = curr;
                setSaved(true);
              }
            }}
          ></textarea>
        </>
      ) : (
        <UpgradeButton port={props.port} />
      )}
    </div>
  );
}