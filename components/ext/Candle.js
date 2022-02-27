import Pattern from "./Pattern";
import UpgradeButton from "./UpgradeButton";

export default function Candle(props) {
  return props.data.pattern ? (
    <Pattern
      pattern={props.data.pattern}
      style={{
        width: "100%",
        ...props.style,
      }}
    />
  ) : (
    <UpgradeButton port={props.port} />
  );
}
