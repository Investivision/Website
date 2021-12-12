import HeaderAndFooter from "../../components/HeaderAndFooter";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import styles from "./index.module.css";
import { useState, useEffect } from "react";
import Wave from "react-wavify";
import { useTheme } from "@mui/material/styles";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, formatErrorCode } from "../../firebase";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/account";
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        document.getElementById("submit").click();
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (email && password) {
      setSubmitLoading(true);
      try {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else if (checked) {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      } catch (e) {
        const message = formatErrorCode(e.code);
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarIsOpen(true);
      }
      setSubmitLoading(false);
    }
  };

  return (
    <HeaderAndFooter bodyClassName={styles.body} hideFooterWave>
      {[0, 1].map((i) => {
        return (
          <Wave
            key={i}
            className={`absoluteBottom ${styles.wave}`}
            fill="url(#gradient)"
            paused={false}
            options={{
              height: 50,
              amplitude: 120,
              speed: 0.08 - i * 0.02,
              points: 4,
            }}
          >
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop
                  offset="0%"
                  stopColor={
                    theme.palette.mode == "dark" ? "#45ADEB" : "#7BC1FFa0"
                  }
                />
                <stop
                  offset="100%"
                  stopColor={
                    theme.palette.mode == "dark" ? "#456BEBa0" : "#638CDE50"
                  }
                />
              </linearGradient>
            </defs>
          </Wave>
        );
      })}
      {/* <h1 className={styles.title}>Account</h1> */}
      <ToggleButtonGroup
        color={theme.palette.mode == "dark" ? "secondary" : "primary"}
        exclusive
        onChange={(event, nextView) => {
          setIsLogin(nextView == "login");
        }}
        className={styles.toggle}
      >
        <ToggleButton
          value="login"
          selected={isLogin}
          // color={!isLogin ? "primary" : "secondary"}
        >
          Login
        </ToggleButton>
        <ToggleButton
          value="signup"
          selected={!isLogin}
          // color={isLogin ? "primary" : "secondary"}
        >
          Sign Up
        </ToggleButton>
      </ToggleButtonGroup>
      <div className={styles.box}>
        <TextField
          autoComplete="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className={styles.textInput}
          color={theme.palette.mode == "dark" ? "secondary" : "primary"}
        />
        <TextField
          autoComplete={`${isLogin ? "current" : "new"}-password`}
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className={styles.textInput}
          color={theme.palette.mode == "dark" ? "secondary" : "primary"}
          type="password"
        />

        {isLogin ? (
          <div className={styles.checkboxContainer}>
            <p
              onClick={async () => {
                try {
                  await sendPasswordResetEmail(auth, email);
                  setSnackbarMessage(`Sent password reset email to ${email}`);
                  setSnackbarSeverity("success");
                } catch (e) {
                  setSnackbarMessage(formatErrorCode(e.code));
                  setSnackbarSeverity("error");
                }
                setSnackbarIsOpen(true);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              Reset or generate password
            </p>
          </div>
        ) : (
          <div className={styles.checkboxContainer}>
            <Checkbox
              checked={checked}
              onChange={(e) => {
                console.log(e.target.checked);
                setChecked(e.target.checked);
              }}
            />
            <p>
              I have read and acknowledged the <a>Terms and Conditions</a>.
            </p>
          </div>
        )}
        <LoadingButton
          loading={submitLoading}
          variant="contained"
          className={styles.submit}
          color="primary"
          type="submit"
          disabled={!(email && password && (isLogin || checked))}
          onClick={handleSubmit}
          id="submit"
        >
          {isLogin ? "Login" : "Sign Up"}
        </LoadingButton>
        <div
          onClick={async () => {
            // sign in with google firebase
            setSubmitLoading(true);
            var provider = new GoogleAuthProvider();
            provider.addScope("profile");
            provider.addScope("email");
            // get password scope

            try {
              const res = await signInWithPopup(auth, provider);
              console.log(res);
            } catch (e) {
              setSnackbarMessage(formatErrorCode(e.code));
              setSnackbarSeverity("error");
              setSnackbarIsOpen(true);
              setSubmitLoading(false);
            }
          }}
          className={styles.google}
        >
          <img src="https://cdn.icon-icons.com/icons2/836/PNG/512/Google_icon-icons.com_66793.png" />
          <p
          // style={{
          //   color: theme.palette.primary.main,
          // }}
          >
            Continue with Google
          </p>
        </div>
      </div>
      <Snackbar
        open={snackbarIsOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right", zIndex: 9999 }}
        onClose={() => {
          setSnackbarIsOpen(false);
        }}
        autoHideDuration={3000}
        message={snackbarMessage}
      >
        <Alert severity={snackbarSeverity} sx={{ zIndex: 99999 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </HeaderAndFooter>
  );
}
