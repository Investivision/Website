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
import TextArea from "./TextArea";
import Growth from "./Growth";
import Risk from "./Risk";

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

export default function Report(props) {
  return (
    <div className={styles.report}>
      <h3>Growth</h3>
      <Growth {...props} />
      <h3>Risk Management</h3>
      <Risk {...props} />
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
            percentile={props.data["p%"]}
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
            percentile={props.data["pr%"]}
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

      <h3>Current Momentum</h3>
      {props.data.rsi && props.data.adx ? (
        <>
          <Numeric
            percentile={props.data.rsi / 100}
            value={`${Math.round(props.data.rsi * 10) / 10}`}
            desc={"Trend Direction"}
            style={{
              margin: 4,
            }}
            toolTip={`Backed by the Relative Strength Index, low readings (<30) indicate undersold, high readings (>70) indicate oversold. Such signals often identify price movement reversals.`}
          />
          <Numeric
            percentile={Math.min(1, 0.14 * Math.pow(props.data.adx, 0.45))}
            value={`${Math.round(props.data.adx * 10) / 10}`}
            desc={"Trend Strength"}
            style={{
              margin: 4,
            }}
            toolTip={`Backed by the Average Directional Index, high readings (>20) indicate a strong, clear, consistent trend`}
          />
        </>
      ) : (
        // <Numeric
        //   percentile={props.data.rsi / 100}
        //   value={`${Math.round(props.data.rsi * 10) / 10}%`}
        //   desc={"Relative Strength"}
        //   style={{
        //     margin: 4,
        //   }}
        //   colorsReversed
        //   toolTip={`Low relative strength indicates an undersold asset, and a high relative strength indicates an oversold asset. Such signals often identify movement reversals.`}
        // />
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
        <TextArea
          symbol={props.global.symbol}
          notes={props.global.notes}
          port={props.port}
          localFirebase={props.localFirebase}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
    </div>
  );
}
