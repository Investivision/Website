import UpIcon from "@material-ui/icons/ArrowUpwardRounded";
import styles from "./sortToggle.module.css";

export default function SortToggle(props) {
  return (
    <div
      className={styles.icon}
      style={{
        opacity: props.direction ? 1 : 0,
      }}
      onClick={props.onClick}
    >
      <UpIcon
        style={{
          transform: props.direction == "desc" ? "rotate(180deg)" : "none",
        }}
      ></UpIcon>
    </div>
  );
}
