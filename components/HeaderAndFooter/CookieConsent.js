import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import { getAuth } from "firebase/auth";

let stage = 1;
const localStorageKey = "cookieConsentExp";
const originalSnackbarText =
  "We use cookies for secure authentication and analytics.";

export default function CookieConsent() {
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState(originalSnackbarText);
  const [signedIn, setSignedIn] = useState(undefined);
  const [tokenExpired, setTokenExpired] = useState(undefined);

  getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      setSignedIn(true);
      window.localStorage.removeItem(localStorageKey);
    } else {
      if (signedIn) {
        // if just signed out, check token (will not exist) and then snackbar will appear
        checkToken();
      }
      setSignedIn(false);
    }
  });

  const checkToken = () => {
    const stored = window.localStorage.getItem(localStorageKey);
    console.log("stored cookie token", new Date(stored), "now", new Date());
    if (stored) {
      const exp = new Date(stored);
      setTokenExpired(new Date() > exp);
    } else {
      setTokenExpired(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (signedIn === undefined || signedIn || !tokenExpired) {
    return null;
  }

  return (
    <Snackbar
      open={snackbarIsOpen}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
        zIndex: 9999,
      }}
      //   onClose={() => {
      //     setSnackbarIsOpen(false);
      //   }}
      //   autoHideDuration={3000}
    >
      <Alert
        severity={"warning"}
        sx={{ zIndex: 99999 }}
        className={styles.cookieConsent}
        action={
          stage == 1 ? (
            <>
              <Button
                size="small"
                // color="warning"
                variant="contained"
                onClick={() => {
                  setSnackbarIsOpen(false);
                  window.localStorage.setItem(
                    localStorageKey,
                    new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
                  ); // 24 hrs
                }}
              >
                Accept All
              </Button>
              <Button
                size="small"
                // color="warning"
                onClick={() => {
                  stage = 2;
                  setSnackbarMessage(
                    "Since you rejected our cookies, you cannot sign up."
                  );
                }}
              >
                Reject All
              </Button>
            </>
          ) : (
            <>
              <Button
                size="small"
                // color="warning"
                variant="contained"
                onClick={() => {
                  setSnackbarIsOpen(false);
                  window.localStorage.setItem(
                    localStorageKey,
                    new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
                  ); // 24 hrs
                }}
              >
                I understand
              </Button>
              <Button
                size="small"
                // color="warning"
                onClick={() => {
                  stage = 1;
                  setSnackbarMessage(originalSnackbarText);
                }}
              >
                Back
              </Button>
            </>
          )
        }
      >
        {snackbarMessage}
        <a href="/privacy"> Privacy Policy</a>
      </Alert>
    </Snackbar>
  );
}
