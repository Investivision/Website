import Numeric from "./Numeric";

export default function Risk(props) {
  return (
    <>
      <Numeric
        percentile={1 - props.data["natr%"]}
        value={`${Math.round(props.data.natr * 100) / 100}`}
        desc={"True Range"}
        style={{
          margin: 4,
        }}
        toolTip={`Normalized distance between price highs and lows over time`}
      />
      <Numeric
        percentile={props.data["sharpe%"]}
        value={`${Math.round(props.data.sharpe * 100) / 100}`}
        desc={"Sharpe Ratio"}
        style={{
          margin: 4,
        }}
        toolTip={`Reward-to-Risk coefficient. Higher values indicate more stable returns`}
      />
      <Numeric
        percentile={props.data["drawdown%"]}
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
    </>
  );
}
