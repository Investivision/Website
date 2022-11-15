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
  symbol,
  currentTimeFrame,
  children,
  toolTip,
  onlySymbol,
}) {
  if (symbol.length == 1) {
    return (
      <ToolTip title={toolTip} arrow>
        <h3>{children}</h3>
      </ToolTip>
    );
  }
  return (
    <MetricSection noDivider>
      {symbol.map((symb, i) => (
        <ToolTip title={toolTip} arrow>
          <h3>
            <span className={styles.sectionHeaderSpan}>{`${symb}`}</span>{" "}
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
  console.log("11/14 report props", props);
  return (
    <div className={styles.report}>
      <SectionHeader
        symbol={props.symbol}
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
        symbol={props.symbol}
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
        symbol={props.symbol}
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
        symbol={props.symbol}
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
        symbol={props.symbol}
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
        symbol={props.symbol}
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

      <MetricSection
        allData={props.data}
        allGlobal={props.global}
        propTransform={(elementProps) => {
          console.log("11/14 elementProps", elementProps);
          return {
            sup: elementProps.data.sup,
            res: elementProps.data.res,
            lastClose: elementProps.global.lastClose,
          };
        }}
        component={Pivots}
      />
      <SectionHeader
        symbol={props.symbol}
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
        symbol={props.symbol}
        currentTimeFrame={props.currentTimeFrame}
        onlySymbol
      >
        Notes
      </SectionHeader>
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
    </div>
  );
}
