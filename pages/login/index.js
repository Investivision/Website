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
import { useTheme } from "@mui/styles";
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
import { useRouter } from "next/router";
import {
  NextSeo,
  SoftwareAppJsonLd,
  SocialProfileJsonLd,
  DefaultSeo,
} from "next-seo";
import Link from "next/link";
import Box from "@mui/material/Box";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();

  const theme = useTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/account");
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
        } else {
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

  const altBackground =
    theme.palette.mode == "dark"
      ? "#00000020"
      : theme.palette.primary.main + "15";

  const altBackgroundHover =
    theme.palette.mode == "dark"
      ? "#00000040"
      : theme.palette.primary.main + "30";

  return (
    <HeaderAndFooter bodyClassName={styles.body} hideFooterWave>
      <NextSeo noindex title="Login" />
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
          type="email"
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

        <div className={styles.actions}>
          <LoadingButton
            loading={submitLoading}
            variant="contained"
            className={styles.submit}
            color="primary"
            size="large"
            type="submit"
            disabled={!(email && password)}
            onClick={handleSubmit}
            id="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </LoadingButton>
          {isLogin && (
            <LoadingButton
              loading={resetLoading}
              variant="text"
              className={styles.submit}
              color={theme.palette.mode == "dark" ? "secondary" : "primary"}
              sx={{
                backgroundColor: altBackground,
                // fontWeight: 400,
                "&:hover": {
                  backgroundColor: altBackgroundHover,
                },
              }}
              size="large"
              id="forgot"
              disabled={!email}
              onClick={async () => {
                try {
                  setResetLoading(true);
                  await sendPasswordResetEmail(auth, email);
                  setSnackbarMessage(
                    `If you signed up with email, a password reset email was sent to ${email}`
                  );
                  setSnackbarSeverity("success");
                } catch (e) {
                  setSnackbarMessage(formatErrorCode(e.code));
                  setSnackbarSeverity("error");
                }
                setSnackbarIsOpen(true);
                setResetLoading(false);
              }}
            >
              Forgot Password
            </LoadingButton>
          )}
        </div>

        <Box
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
          sx={{
            backgroundColor: altBackground,
            "&:hover": {
              backgroundColor: altBackgroundHover,
            },
          }}
        >
          <img src="/images/google.png" />
          <p
            style={{
              color:
                theme.palette.mode == "dark"
                  ? "white"
                  : theme.palette.primary.main,
            }}
          >
            Continue with Google
          </p>
        </Box>
        <p className={styles.consent}>
          By logging in or signing up, you indicate agreement with our{" "}
          <Link href="/terms">Terms and Conditions</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
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
