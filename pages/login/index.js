import HeaderAndFooter from "../../components/HeaderAndFooter";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import styles from "./index.module.css";
import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import Wave from "react-wavify";
import ***REMOVED***
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
***REMOVED*** from "firebase/auth";
import ***REMOVED*** auth, formatErrorCode ***REMOVED*** from "../../firebase";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Login() ***REMOVED***
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => ***REMOVED***
    onAuthStateChanged(auth, (user) => ***REMOVED***
      if (user) ***REMOVED***
        window.location.href = "/account";
      ***REMOVED***
    ***REMOVED***);
    window.addEventListener("keydown", (event) => ***REMOVED***
      if (event.keyCode === 13) ***REMOVED***
        document.getElementById("submit").click();
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***, []);

  const handleSubmit = async () => ***REMOVED***
    if (email && password) ***REMOVED***
      setSubmitLoading(true);
      try ***REMOVED***
        if (isLogin) ***REMOVED***
          await signInWithEmailAndPassword(auth, email, password);
        ***REMOVED*** else if (checked) ***REMOVED***
          await createUserWithEmailAndPassword(auth, email, password);
        ***REMOVED***
      ***REMOVED*** catch (e) ***REMOVED***
        const message = formatErrorCode(e.code);
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarIsOpen(true);
      ***REMOVED***
      setSubmitLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <HeaderAndFooter bodyClassName=***REMOVED***styles.body***REMOVED*** hideFooterWave>
      ***REMOVED***[1, 2].map((i) => ***REMOVED***
        return (
          <Wave
            key=***REMOVED***i***REMOVED***
            className=***REMOVED***`absoluteBottom $***REMOVED***styles.wave***REMOVED***`***REMOVED***
            fill="url(#gradient)"
            paused=***REMOVED***false***REMOVED***
            options=***REMOVED******REMOVED***
              height: 50,
              amplitude: 170,
              speed: 0.07,
              points: 4,
            ***REMOVED******REMOVED***
          >
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#81A3FFc0" />
                <stop offset="100%" stopColor="#81A3F124" />
              </linearGradient>
            </defs>
          </Wave>
        );
      ***REMOVED***)***REMOVED***
      ***REMOVED***/* <h1 className=***REMOVED***styles.title***REMOVED***>Account</h1> */***REMOVED***
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange=***REMOVED***(event, nextView) => ***REMOVED***
          setIsLogin(nextView == "login");
        ***REMOVED******REMOVED***
        className=***REMOVED***styles.toggle***REMOVED***
      >
        <ToggleButton value="login" selected=***REMOVED***isLogin***REMOVED***>
          Login
        </ToggleButton>
        <ToggleButton value="signup" selected=***REMOVED***!isLogin***REMOVED*** color="primary">
          Sign Up
        </ToggleButton>
      </ToggleButtonGroup>
      <div className=***REMOVED***styles.box***REMOVED***>
        <TextField
          autoComplete="email"
          label="Email"
          variant="outlined"
          value=***REMOVED***email***REMOVED***
          onChange=***REMOVED***(e) => ***REMOVED***
            setEmail(e.target.value);
          ***REMOVED******REMOVED***
          className=***REMOVED***styles.textInput***REMOVED***
          color="primary"
        />
        <TextField
          autoComplete=***REMOVED***`$***REMOVED***isLogin ? "current" : "new"***REMOVED***-password`***REMOVED***
          label="Password"
          variant="outlined"
          value=***REMOVED***password***REMOVED***
          onChange=***REMOVED***(e) => ***REMOVED***
            setPassword(e.target.value);
          ***REMOVED******REMOVED***
          className=***REMOVED***styles.textInput***REMOVED***
          color="primary"
          type="password"
        />
        ***REMOVED***isLogin ? (
          <div className=***REMOVED***styles.checkboxContainer***REMOVED***>
            <p
              onClick=***REMOVED***async () => ***REMOVED***
                try ***REMOVED***
                  await sendPasswordResetEmail(auth, email);
                  setSnackbarMessage(`Sent password reset email to $***REMOVED***email***REMOVED***`);
                  setSnackbarSeverity("success");
                ***REMOVED*** catch (e) ***REMOVED***
                  setSnackbarMessage(formatErrorCode(e.code));
                  setSnackbarSeverity("error");
                ***REMOVED***
                setSnackbarIsOpen(true);
              ***REMOVED******REMOVED***
              style=***REMOVED******REMOVED***
                cursor: "pointer",
              ***REMOVED******REMOVED***
            >
              Forgot login? Reset password
            </p>
          </div>
        ) : (
          <div className=***REMOVED***styles.checkboxContainer***REMOVED***>
            <Checkbox
              checked=***REMOVED***checked***REMOVED***
              onChange=***REMOVED***(e) => ***REMOVED***
                console.log(e.target.checked);
                setChecked(e.target.checked);
              ***REMOVED******REMOVED***
            />
            <p>
              I have read and acknowledged the <a>Terms and Conditions</a>.
            </p>
          </div>
        )***REMOVED***
        <LoadingButton
          loading=***REMOVED***submitLoading***REMOVED***
          variant="contained"
          className=***REMOVED***styles.submit***REMOVED***
          color="primary"
          type="submit"
          disabled=***REMOVED***!(email && password && (isLogin || checked))***REMOVED***
          onClick=***REMOVED***handleSubmit***REMOVED***
          id="submit"
        >
          ***REMOVED***isLogin ? "Login" : "Sign Up"***REMOVED***
        </LoadingButton>
      </div>
      <Snackbar
        open=***REMOVED***snackbarIsOpen***REMOVED***
        anchorOrigin=***REMOVED******REMOVED*** vertical: "top", horizontal: "right", zIndex: 9999 ***REMOVED******REMOVED***
        onClose=***REMOVED***() => ***REMOVED***
          setSnackbarIsOpen(false);
        ***REMOVED******REMOVED***
        autoHideDuration=***REMOVED***3000***REMOVED***
        message=***REMOVED***snackbarMessage***REMOVED***
      >
        <Alert severity=***REMOVED***snackbarSeverity***REMOVED*** sx=***REMOVED******REMOVED*** zIndex: 99999 ***REMOVED******REMOVED***>
          ***REMOVED***snackbarMessage***REMOVED***
        </Alert>
      </Snackbar>
    </HeaderAndFooter>
  );
***REMOVED***
