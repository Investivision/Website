import Numeric from "./Numeric";

export default function Growth(props) {
  console.log("Growth props", props);
  return (
    <>
      <Numeric
        percentile={props.data["alpha%"]}
        value={`${Math.round(props.data.alpha * 100 * 10) / 10}%`}
        desc={"Alpha"}
        style={{
          margin: 4,
        }}
        toolTip="Annualized share price growth per year, exponentially"
      />
      <Numeric
        percentile={props.data["div%"] || 0}
        value={`${Math.round((props.data.div || 0) * 100 * 10) / 10}%`}
        desc={"Dividend"}
        style={{
          margin: 4,
        }}
        toolTip="Average annual compounding dividend yield"
      />
      <Numeric
        percentile={1 - props.data["beta%"]}
        value={`${Math.round(props.data.beta * 100 * 10) / 10}%`}
        desc={"Beta"}
        style={{
          margin: 4,
        }}
        toolTip={`Degree of correlation between ${props.symbol} and the S&P 500`}
      />
      <Numeric
        percentile={props.data["drawup%"]}
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
    </>
  );
}
