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

const termMap = {
  1: "1yr",
  5: "5yr",
  10: "10yr",
  "3mo": "3mo",
};

function SectionHeader({
  global,
  currentTimeFrame,
  children,
  toolTip,
  onlySymbol,
}) {
  if (global.length == 1) {
    return (
      <ToolTip title={toolTip} arrow>
        <h3>{children}</h3>
      </ToolTip>
    );
  }
  return (
    <MetricSection noDivider>
      {global.map((glob, i) => (
        <ToolTip title={toolTip} arrow>
          <h3>
            <span className={styles.sectionHeaderSpan}>{`${glob.symbol}`}</span>{" "}
            {children}
            {onlySymbol ? null : (
              <span className={styles.sectionHeaderSpan}>{`, ${
                termMap[currentTimeFrame[i]]
              }`}</span>
            )}
          </h3>
        </ToolTip>
      ))}
    </MetricSection>
  );
}

export default function Report(props) {
  console.log("report props", props);
  return (
    <div className={styles.report}>
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
        Growth
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Growth}
        props={props}
      />
      {/* <Growth {...props} /> */}
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
        Risk
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Risk}
        props={props}
      />
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
        Candle Patterns
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Candle}
        props={props}
      />
      <SectionHeader
        toolTip={`Prediction computed from ${props.symbol}-specific AI model.`}
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
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
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Prophet}
        props={props}
      />
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
        Momentum
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        component={Momentum}
        props={props}
      />

      <SectionHeader
        toolTip="Movement is often bound between demonstrated support and resistance levels. However, when price exceeds these bounds, movement tends to break-out in that direction."
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
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
      </SectionHeader>
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
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
      >
        Cycle Studies
      </SectionHeader>
      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        props={{
          ...props,
          sup: props.data.sup,
        }}
        component={Cycle}
      />
      <SectionHeader
        global={props.global}
        currentTimeFrame={props.currentTimeFrame}
        onlySymbol
      >
        Notes
      </SectionHeader>
      {props.global[0].notes !== undefined ? (
        <MetricSection
          allData={props.data}
          allGlobal={props.global}
          propTransform={(elementProps) => {
            return {
              symbol: elementProps.global.symbol,
              notes: elementProps.global.notes,
            };
          }}
          props={props}
          component={TextArea}
        />
      ) : (
        <UpgradeButton port={props.port} />
      )}
    </div>
  );
}
