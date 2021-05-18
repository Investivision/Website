import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import Head from "next/head";
import ***REMOVED*** auth ***REMOVED*** from "/utils/firebase";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import styles from "./index.module.css";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import NavBar from "../../components/NavBar";
import ***REMOVED*** predict ***REMOVED*** from "../../ml";

const intervalWidths = ***REMOVED***
  30: "Extreme",
  50: "High",
  70: "Medium",
  90: "Low",
***REMOVED***;

export default function Analysis() ***REMOVED***
  const [userLoaded, setUserLoaded] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [intervalWidth, setIntervalWidth] = useState(70);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [trainingData, setTrainingData] = useState([]);

  auth.onAuthStateChanged((user) => ***REMOVED***
    setUserLoaded(true);
  ***REMOVED***);

  useEffect(() => ***REMOVED******REMOVED***, [userLoaded]);

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js">
          ***REMOVED***" "***REMOVED***
        </script>
      </Head>
      <NavBar />
      <div className=***REMOVED***styles.page***REMOVED***>
        <div className=***REMOVED***styles.inputContainer***REMOVED***>
          <h2>Analyze</h2>
          <TextField
            className="textField"
            size="small"
            variant="outlined"
            label="Symbol"
            value=***REMOVED***symbol***REMOVED***
            onChange=***REMOVED***(event) => ***REMOVED***
              setSymbol(event.target.value.toUpperCase());
            ***REMOVED******REMOVED***
          />
          <h2>with</h2>
          <Select
            value=***REMOVED***intervalWidth***REMOVED***
            variant="outlined"
            onChange=***REMOVED***(event) => ***REMOVED***
              setIntervalWidth(event.target.value);
            ***REMOVED******REMOVED***
            className="select"
          >
            ***REMOVED***Object.entries(intervalWidths).map((pair) => ***REMOVED***
              return (
                <MenuItem value=***REMOVED***pair[0]***REMOVED*** key=***REMOVED***pair[0]***REMOVED***>
                  ***REMOVED***pair[1]***REMOVED***
                </MenuItem>
              );
            ***REMOVED***)***REMOVED***
          </Select>
          <h2>risk tolerance</h2>
        </div>
        <Button
          variant="contained"
          disableElevation
          className="actionButton"
          color="primary"
          onClick=***REMOVED***() => ***REMOVED***
            setHasSubmitted(true);
          ***REMOVED******REMOVED***
        >
          Compute
        </Button>
        ***REMOVED***hasSubmitted ? null : (
          <div className=***REMOVED***styles.placeholderContainer***REMOVED***>
            <DashboardRoundedIcon className="icon" color="secondary" />
            <p>Press Compute to Start Processing Report</p>
          </div>
        )***REMOVED***
      </div>
    </>
  );
***REMOVED***
