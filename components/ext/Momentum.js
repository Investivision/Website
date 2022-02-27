import Numeric from "./Numeric";
import UpgradeButton from "./UpgradeButton";

export default function Momentum(props) {
  return props.data.rsi && props.data.adx ? (
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
  );
}
