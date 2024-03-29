import styles from "./pivots.module.css";
import { useTheme } from "@mui/styles";
import { absoluteAngleDegrees } from "@nivo/core";
import UpgradeButton from "./UpgradeButton";

export default function Pivots(props) {
  console.log("11/14 pivot props", props);
  const theme = useTheme();
  let res;
  let sup;
  if (props.res) {
    res = (props.res + 1) * props.lastClose;
  }
  if (props.sup) {
    sup = (props.sup + 1) * props.lastClose;
  }

  if (!props.res) {
    return <UpgradeButton port={props.port} />;
  }

  return (
    <div
      className={`${styles.container} ${
        !props.res ? styles.noRes : !props.sup ? styles.noSup : ""
      }`}
      style={props.style}
    >
      <div className={styles.level}>
        <div
          style={{
            flex: 1,
            height: 2,
            opacity: props.res ? 1 : 0.5,
            marginTop: props.res ? 0 : -10,
          }}
        >
          <span
            style={{
              transform: "translateY(5px)",
            }}
          >
            {props.res ? `Resistance` : "No Resistance Detected"}
          </span>
        </div>
        {props.res ? (
          <p>
            {"$" +
              (res >= 1000 ? Math.round(res) : Math.round(res * 100) / 100) +
              " or +" +
              Math.round(props.res * 100 * 10) / 10 +
              "%"}
          </p>
        ) : null}
        <div
          style={{
            flex: 1,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 24,
          bottom: 24,
          width: "100%",
        }}
        className={styles.close}
      >
        <div
          className={styles.level}
          style={{
            width: "100%",
            top: !props.res
              ? 0
              : !props.sup
              ? "100%"
              : `${((res - props.lastClose) / (res - sup)) * 100}%`,
            transform: "translateY(-50%)",
          }}
        >
          <div className={styles.line}>
            <span
              style={
                !props.res || (res - props.lastClose) / (res - sup) < 0.1
                  ? {
                      transform: "translateY(5px)",
                    }
                  : {}
              }
            >
              Close
            </span>
          </div>
          <p>{"$" + Math.round(props.lastClose * 100) / 100}</p>
          <div className={styles.line} />
        </div>
      </div>
      <div
        className={styles.level}
        style={{
          bottom: 0,
          top: "auto",
          transform: "translateY(50%)",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 2,
          }}
        >
          <span
            style={
              props.sup
                ? {}
                : {
                    opacity: props.sup ? 1 : 0.5,
                    marginTop: props.sup ? 0 : 10,
                  }
            }
          >
            {props.sup ? `Support` : "No Support Detected"}
          </span>
        </div>
        {props.sup ? (
          <p>
            {"$" +
              (sup >= 1000 ? Math.round(sup) : Math.round(sup * 100) / 100) +
              " or " +
              Math.round(props.sup * 100 * 10) / 10 +
              "%"}
          </p>
        ) : null}
        <div
          style={{
            flex: 1,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div className={styles.baseLines}></div>
      </div>
    </div>
  );
}
