import Numeric from "./Numeric";
import RangePlot from "./RangePlot";
import UpgradeButton from "./UpgradeButton";

export default function Prophet(props) {
  return props.data.p && props.data.pr && props.data.prophet ? (
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
        plotStyles={props.plotStyles}
      />
    </>
  ) : (
    <UpgradeButton port={props.port} />
  );
}
