import Pattern from "./Pattern";
import UpgradeButton from "./UpgradeButton";

export default function Candle(props) {
  console.log("11/14 candle props", props);
  return props.data.bullPattern !== undefined ? (
    <Pattern
      bullish={props.data.bullPattern}
      bearish={props.data.bearPattern}
      style={{
        width: "100%",
        ...props.style,
      }}
    />
  ) : (
    <UpgradeButton port={props.port} />
  );
}
