import styles from "./index.module.css";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import { useTheme } from "@mui/styles";
import { useState, useRef } from "react";

export default function Question({ question }) {
  const theme = useTheme();

  const [answerHeight, setAnswerHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);
  const topRef = useRef(null);
  const rootRef = useRef(null);

  return (
    <div
      className={styles.question}
      onClick={() => {
        if (open) {
          setTimeout(() => {
            answerRef.current.style.display = "none";
            rootRef.current.style.height = "auto";
          }, 100);
          const height = rootRef.current.clientHeight;
          rootRef.current.style.height = `${height}px`;
          rootRef.current.style.height = `${
            topRef.current.clientHeight + 60
          }px`;
        } else {
          const height = rootRef.current.clientHeight;
          rootRef.current.style.height = `${height}px`;
          answerRef.current.style.display = "block";
          rootRef.current.style.height = `${rootRef.current.scrollHeight}px`;
          setTimeout(() => {
            rootRef.current.style.height = "auto";
          }, 100);
        }
        setOpen(!open);
      }}
      ref={rootRef}
    >
      <p
        className={styles.q}
        style={{
          color:
            theme.palette.mode == "dark"
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
        }}
        ref={topRef}
      >
        {question.q}
        {open ? <RemoveRoundedIcon /> : <AddCircleOutlineRoundedIcon />}
      </p>
      {/* <div
        className={styles.spacer}
        style={{
          height: open ? 20 : 0,
        }}
      ></div> */}
      <div ref={answerRef} className={styles.a}>
        <p>{question.a}</p>
      </div>
    </div>
  );
}
