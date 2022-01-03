import { useState, useEffect, useRef } from "react";
import { alterHsl } from "tsparticles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Numeric from "./Numeric";
import Pattern from "./Pattern";
import RangePlot from "./RangePlot";
import styles from "./report.module.css";
import Pivots from "./Pivots";
import ToolTip from "./ToolTip";
import InfoIcon from "@material-ui/icons/Info";

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
          desc={"Alpha"}
          style={{
            margin: 4,
          }}
          toolTip="Annualized share price growth per year, exponentially"
        />
      ) : null}
      {props.data.beta ? (
        <Numeric
          percentile={1 - zToPercentile(props.data.beta_z)}
          value={`${Math.round(props.data.beta * 100 * 10) / 10}%`}
          desc={"Beta"}
          style={{
            margin: 4,
          }}
          toolTip={`Degree of correlation between ${props.symbol} and the S&P 500`}
        />
      ) : null}
      {props.data.drawup ? (
        <Numeric
          percentile={zToPercentile(props.data.drawup_z)}
          value={`${Math.round(props.data.drawup * 100)}%`}
          desc={"Max Profit"}
          style={{
            margin: 4,
          }}
          toolTip={`Maximum gain achieved between any two points over the past ${
            props.currentTimeFrame == "3mo"
              ? "3 months"
              : `${props.currentTimeFrame} year${
                  props.currentTimeFrame != "1" ? "s" : ""
                }`
          }`}
        />
      ) : null}
      <h3>Risk Management</h3>
      {props.data.natr ? (
        <Numeric
          percentile={1 - zToPercentile(props.data.natr_z)}
          value={`${Math.round(props.data.natr * 100) / 100}`}
          desc={"True Range"}
          style={{
            margin: 4,
          }}
          toolTip={`Normalized distance between price highs and lows over time`}
        />
      ) : null}
      {props.data.sharpe ? (
        <Numeric
          percentile={zToPercentile(props.data.sharpe_z)}
          value={`${Math.round(props.data.sharpe * 100) / 100}`}
          desc={"Sharpe Ratio"}
          style={{
            margin: 4,
          }}
          toolTip={`Reward-to-Risk coefficient. Higher values indicate more stable returns`}
        />
      ) : null}
      {props.data.drawdown ? (
        <Numeric
          percentile={zToPercentile(props.data.drawdown_z)}
          value={`${Math.round(props.data.drawdown * 100 * 10) / 10}%`}
          desc={"Max Loss"}
          style={{
            margin: 4,
          }}
          toolTip={`Greatest loss sufferred between any two points over the past ${
            props.currentTimeFrame == "3mo"
              ? "3 months"
              : `${props.currentTimeFrame} year${
                  props.currentTimeFrame != "1" ? "s" : ""
                }
              `
          }`}
        />
      ) : null}
      <h3>Candle Patterns</h3>
      {props.data.pattern ? (
        <Pattern
          pattern={props.data.pattern}
          style={{
            width: "100%",
          }}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
      <ToolTip
        title={`Prediction computed from ${props.symbol}-specific AI model.`}
        arrow
      >
        <h3>
          AI Forecast
          <InfoIcon
            style={{
              width: 14,
              marginLeft: 3,
              marginTop: -2,
              opacity: 0.3,
              verticalAlign: "middle",
            }}
          />
        </h3>
      </ToolTip>
      {props.data.p && props.data.pr && props.data.prophet ? (
        <>
          <Numeric
            percentile={zToPercentile(props.data.p_z)}
            value={`${Math.round(props.data.p * 10) / 10}%`}
            desc={"Predicted Gain"}
            style={{
              margin: 4,
            }}
            toolTip={`Predicted total price growth ${
              props.currentTimeFrame == "3mo"
                ? "3 months"
                : `${props.currentTimeFrame} year${
                    props.currentTimeFrame != "1" ? "s" : ""
                  }
                `
            } into the future`}
          />
          <Numeric
            percentile={zToPercentile(props.data.pr_z)}
            value={`${Math.round(props.data.pr * 10) / 10}%`}
            desc={"Forecast Range"}
            style={{
              margin: 4,
            }}
            toolTip={`The relative width of the predicted price gain interval`}
          />
          <RangePlot
            points={props.data.prophet}
            lastClose={props.global.lastclose}
          />
        </>
      ) : (
        <UpgradeButton port={props.port} />
      )}
      <ToolTip
        title="Movement is often bound between demonstrated support and resistance levels. However, when price exceeds these bounds, movement tends to break-out in that direction."
        arrow
      >
        <h3>
          Pivot Points
          <InfoIcon
            style={{
              width: 14,
              marginLeft: 3,
              marginTop: -2,
              opacity: 0.3,
              verticalAlign: "middle",
            }}
          />
        </h3>
      </ToolTip>
      {props.data.sup !== undefined ? (
        <Pivots
          sup={props.data.sup}
          res={props.data.res}
          lastClose={props.global.lastclose}
        />
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
