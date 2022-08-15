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
import Candle from "./Candle";
import UpgradeButton from "./UpgradeButton";
import Momentum from "./Momentum";
import Prophet from "./Prophet";
import Cycle from "./Cycle";

export default function Report(props) {
  return (
    <div className={styles.report}>
      <h3>Growth</h3>
      <Growth {...props} />
      <h3>Risk Management</h3>
      <Risk {...props} />
      <h3>Candle Patterns</h3>
      <Candle {...props} />
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
      <Prophet {...props} />

      <h3>Current Momentum</h3>
      <Momentum {...props} />

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
      <h3>Cycle Studies</h3>
      <Cycle {...props} />
      <h3>Notes</h3>
      <div className={styles.metricZone}>
        {
          <div className={styles.metric}>
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
        }
      </div>
    </div>
  );
}
