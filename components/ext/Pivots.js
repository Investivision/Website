import styles from "./pivots.module.css";
import { useTheme } from "@mui/styles";
import { absoluteAngleDegrees } from "@nivo/core";

export default function Pivots(props) {
  const theme = useTheme();

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
              (props.res >= 1000
                ? Math.round(props.res)
                : Math.round(props.res * 100) / 100) +
              " or +" +
              Math.round(
                ((props.res - props.lastClose) / props.lastClose) * 100 * 10
              ) /
                10 +
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
              : `${
                  ((props.res - props.lastClose) / (props.res - props.sup)) *
                  100
                }%`,
            transform: "translateY(-50%)",
          }}
        >
          <div className={styles.line}>
            <span
              style={
                !props.res ||
                (props.res - props.lastClose) / (props.res - props.sup) < 0.1
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
              (props.sup >= 1000
                ? Math.round(props.sup)
                : Math.round(props.sup * 100) / 100) +
              " or " +
              Math.round(
                ((props.sup - props.lastClose) / props.lastClose) * 100 * 10
              ) /
                10 +
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
