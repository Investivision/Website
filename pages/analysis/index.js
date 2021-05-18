import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { auth } from "/utils/firebase";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import styles from "./index.module.css";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import NavBar from "../../components/NavBar";
import { predict } from "../../ml";

const intervalWidths = {
  30: "Extreme",
  50: "High",
  70: "Medium",
  90: "Low",
};

export default function Analysis() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [intervalWidth, setIntervalWidth] = useState(70);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [trainingData, setTrainingData] = useState([]);

  auth.onAuthStateChanged((user) => {
    setUserLoaded(true);
  });

  useEffect(() => {}, [userLoaded]);

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js">
          {" "}
        </script>
      </Head>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.inputContainer}>
          <h2>Analyze</h2>
          <TextField
            className="textField"
            size="small"
            variant="outlined"
            label="Symbol"
            value={symbol}
            onChange={(event) => {
              setSymbol(event.target.value.toUpperCase());
            }}
          />
          <h2>with</h2>
          <Select
            value={intervalWidth}
            variant="outlined"
            onChange={(event) => {
              setIntervalWidth(event.target.value);
            }}
            className="select"
          >
            {Object.entries(intervalWidths).map((pair) => {
              return (
                <MenuItem value={pair[0]} key={pair[0]}>
                  {pair[1]}
                </MenuItem>
              );
            })}
          </Select>
          <h2>risk tolerance</h2>
        </div>
        <Button
          variant="contained"
          disableElevation
          className="actionButton"
          color="primary"
          onClick={() => {
            setHasSubmitted(true);
          }}
        >
          Compute
        </Button>
        {hasSubmitted ? null : (
          <div className={styles.placeholderContainer}>
            <DashboardRoundedIcon className="icon" color="secondary" />
            <p>Press Compute to Start Processing Report</p>
          </div>
        )}
      </div>
    </>
  );
}
