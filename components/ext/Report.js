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
import MetricSection from "./MetricSection";

export default function Report(props) {
  console.log("report props", props);
  return (
    <div className={styles.report}>
      <h3>Growth</h3>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Growth}
        props={props}
      />
      {/* <Growth {...props} /> */}
      <h3>Risk Management</h3>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Risk}
        props={props}
      />
      <h3>Candle Patterns</h3>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Candle}
        props={props}
      />
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
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Prophet}
        props={props}
      />
      <h3>Current Momentum</h3>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Momentum}
      />
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
      {props.data[0].sup !== undefined ? (
        // <Pivots
        //   sup={props.data.sup}
        //   res={props.data.res}
        //   lastClose={props.global.lastclose}
        // />
        <MetricSection
          allData={props.data}
          allGlobal={props.global}
          propTransform={(elementProps) => {
            return {
              sup: elementProps.data.sup,
              res: elementProps.data.res,
              lastClose: elementProps.global.lastclose,
            };
          }}
          component={Pivots}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
      <h3>Cycle Studies</h3>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Cycle}
      />
      <h3>Notes</h3>
      {props.global[0].notes !== undefined ? (
        // <TextArea
        //   symbol={props.global.symbol}
        //   notes={props.global.notes}
        //   port={props.port}
        //   localFirebase={props.localFirebase}
        // />
        <MetricSection
          allData={props.data}
          allGlobal={props.global}
          propTransform={(elementProps) => {
            return {
              symbol: elementProps.global.symbol,
              notes: elementProps.global.notes,
            };
          }}
          component={TextArea}
          props={{
            localFirebase: props.localFirebase,
          }}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
    </div>
  );
}
