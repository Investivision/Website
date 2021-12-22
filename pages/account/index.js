import styles from "./index.module.css";
import TextField from "@mui/material/TextField";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import MuiPhoneNumber from "material-ui-phone-number";
import { auth, formatErrorCode, getFunction } from "../../firebase";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const googleIsConnected = (currentUser) => {
  if (!currentUser) return false;
  for (const provider of currentUser.providerData) {
    if (provider.providerId === "google.com") {
      return provider.email;
    }
  }
  return false;
};

export default function Account() {
  // console.log(auth);
  // if (!auth.currentUser) {
  //   // window.location.hef = "/login";
  //   // return null;
  // }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(undefined);
  const [extStatus, setExtStatus] = useState(undefined);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState(false);

  const [role, setRole] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setName(user.displayName || "");
        setEmail(user.email);
        // setPhoneNumber(user.phoneNumber || "");
        console.log(user);
        try {
          chrome.runtime.sendMessage(extId, { uid: user.uid }, function (res) {
            setExtStatus(res.synced ? "synced" : "not synced");
          });
        } catch (e) {
          setExtStatus("not installed");
        }
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  const googleEmail = googleIsConnected(auth.currentUser);

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      {!user ? (
        <>
          <Skeleton
            variant="text"
            animation="wave"
            height={60}
            style={{
              width: "100%",
              maxWidth: 300,
              marginTop: 20,
            }}
            sx={{
              transform: "none",
            }}
          />
          {[1, 1, 1].map((e, i) => (
            <div className={styles.skeletonGroup} key={i}>
              <Skeleton
                variant="text"
                animation="wave"
                height={30}
                style={{
                  width: "100%",
                  maxWidth: 400,
                }}
                sx={{
                  transform: "none",
                }}
              />
              <Skeleton
                animation="wave"
                height={160}
                style={{
                  width: "100%",
                  maxWidth: 900,
                }}
                sx={{
                  transform: "none",
                }}
              />
            </div>
          ))}
        </>
      ) : (
        <>
          <h1 className="pageHeader">Account</h1>
          <div className={styles.content}>
            <h2>Profile</h2>
            <h3>You know, the basics</h3>
            <div>
              <div>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className={styles.textInput}
                  color="primary"
                  onBlur={async () => {
                    const trimmed = name ? name.trim() : "";
                    if (trimmed) {
                      if (trimmed != user.displayName) {
                        try {
                          await updateProfile(user, {
                            displayName: trimmed,
                          });
                          setSnackbarSeverity("success");
                          setSnackbarMessage(`Changed Full Name to ${name}`);
                        } catch (e) {
                          setSnackbarSeverity("error");
                          setSnackbarMessage(formatErrorCode(e.code));
                        }
                        setSnackbarIsOpen(true);
                      }
                      // think about case with oringal + spaces, still need to trim
                      if (trimmed.length != name.length) {
                        setName(trimmed);
                      }
                    } else {
                      setName(user.displayName);
                    }
                  }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className={styles.textInput}
                  color="primary"
                  onBlur={async () => {
                    const trimmed = email.trim();
                    if (trimmed) {
                      if (trimmed != user.email) {
                        try {
                          await updateEmail(user, email);
                          setSnackbarSeverity("success");
                          setSnackbarMessage(`Changed email to ${email}`);
                        } catch (e) {
                          setSnackbarSeverity("error");
                          setSnackbarMessage(formatErrorCode(e.code));
                          setEmail(user.email);
                        }
                        setSnackbarIsOpen(true);
                      }
                      if (trimmed.length != email.length) {
                        setEmail(trimmed);
                      }
                    } else {
                      setEmail(user.email);
                    }
                  }}
                />
                {/* <MuiPhoneNumber
              defaultCountry={"us"}
              onChange={setPhoneNumber}
              value={phoneNumber}
              variant="outlined"
              label="Phone Number"
              onBlur={async () => {
                await updateProfile(user, {
                  phoneNumber: phoneNumber,
                });
                alert("changed phone number");
              }}
            /> */}
              </div>
              <div>
                {user?.emailVerified ? (
                  <Alert severity="success">Email Verified</Alert>
                ) : (
                  <Alert
                    severity="warning"
                    action={
                      <LoadingButton
                        loading={verifyLoading}
                        color="inherit"
                        size="medium"
                        onClick={async () => {
                          setVerifyLoading(true);
                          try {
                            await sendEmailVerification(user);
                            setSnackbarSeverity("success");
                            setSnackbarMessage("Sent verification email");
                          } catch (e) {
                            setSnackbarSeverity("warning");
                            setSnackbarMessage(formatErrorCode(e.code));
                          }
                          setVerifyLoading(false);
                          setSnackbarIsOpen(true);
                        }}
                      >
                        Verify
                      </LoadingButton>
                    }
                  >
                    Email not Verified
                  </Alert>
                )}
              </div>
              <div>
                <LoadingButton
                  variant="contained"
                  loading={resetLoading}
                  onClick={async () => {
                    setResetLoading(true);
                    await sendPasswordResetEmail(auth, user.email);
                    setResetLoading(false);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Sent password reset email");
                    setSnackbarIsOpen(true);
                  }}
                >
                  Reset Password
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  loading={signOutLoading}
                  onClick={() => {
                    setSignOutLoading(true);
                    chrome.runtime.sendMessage(
                      extId,
                      { message: "signOut" },
                      function (res) {
                        signOut(auth);
                      }
                    );
                  }}
                >
                  Sign Out
                </LoadingButton>
              </div>
            </div>
            {/* <h2>Subscription</h2>
            <div>
              <div>
                <Alert
                  severity="warning"
                  action={
                    <Button color="inherit" size="medium">
                      Subscribe now
                    </Button>
                  }
                >
                  Currently not subscribed
                </Alert>
                <Alert
                  severity="success"
                  action={
                    <>
                      <Button color="inherit" size="medium">
                        View Plans
                      </Button>
                      <Button color="inherit" size="medium">
                        Manage subscription on Stripe
                      </Button>
                    </>
                  }
                >
                  Subscribed
                </Alert>
              </div>
              <div>
                <Button variant="contained">View Pricing</Button>
              </div>
            </div> */}
            <h2>Google Integration</h2>
            <h3>For smooth interaction with third-party tools</h3>
            <div>
              {googleEmail ? (
                <Alert
                  severity="success"
                  action={
                    user.providerData.length == 1 &&
                    user.providerData[0].providerId === "google.com" ? null : (
                      <LoadingButton
                        loading={unlinkLoading}
                        color="inherit"
                        size="medium"
                        onClick={async () => {
                          setUnlinkLoading(true);
                          try {
                            const result = await unlink(user, "google.com");
                            console.log(result);
                            setSnackbarMessage(
                              `Unlinked Google account: ${googleEmail}`
                            );
                            setSnackbarSeverity("success");
                            setSnackbarIsOpen(true);
                          } catch (e) {
                            setSnackbarMessage(formatErrorCode(e.code));
                            setSnackbarSeverity("error");
                            setSnackbarIsOpen(true);
                          }
                          setUnlinkLoading(false);
                        }}
                      >
                        Unlink Account
                      </LoadingButton>
                    )
                  }
                >
                  {`Linked to ${googleEmail}`}
                </Alert>
              ) : (
                <Alert
                  severity="warning"
                  action={
                    <LoadingButton
                      loading={googleLoading}
                      color="inherit"
                      size="medium"
                      onClick={async () => {
                        setGoogleLoading(true);
                        try {
                          const result = await linkWithPopup(
                            user,
                            new GoogleAuthProvider()
                          );
                          console.log(result);
                          setSnackbarMessage(
                            `Linked Google account: ${googleIsConnected(
                              result.user
                            )}`
                          );
                          setSnackbarSeverity("success");
                          setSnackbarIsOpen(true);
                        } catch (e) {
                          setSnackbarMessage(formatErrorCode(e.code));
                          setSnackbarSeverity("error");
                          setSnackbarIsOpen(true);
                        }
                        setGoogleLoading(false);
                      }}
                    >
                      Link Account
                    </LoadingButton>
                  }
                >
                  Not linked to a Google account
                </Alert>
              )}
            </div>
            <h2>Chrome Extension</h2>
            <h3>Activate your assistant</h3>
            <div>
              <div>
                {!extStatus ? (
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={50}
                    style={{
                      width: 300,
                      marginTop: 20,
                    }}
                    sx={{
                      transform: "none",
                    }}
                  />
                ) : extStatus == "not installed" ? (
                  <Alert
                    severity="warning"
                    action={
                      <Button color="inherit" size="medium">
                        Install now
                      </Button>
                    }
                  >
                    Browser Extension not installed
                  </Alert>
                ) : extStatus == "synced" ? (
                  <Alert severity="success">
                    Browser Extension installed and synced
                  </Alert>
                ) : (
                  <Alert
                    severity="warning"
                    action={
                      <LoadingButton
                        loading={syncLoading}
                        color="inherit"
                        size="medium"
                        onClick={async () => {
                          setSyncLoading(true);
                          try {
                            const { token } = (
                              await getFunction("generateToken")({})
                            ).data;
                            chrome.runtime.sendMessage(
                              extId,
                              { token: token },
                              function (res) {
                                setExtStatus(
                                  res.synced ? "synced" : "not synced"
                                );
                                setSnackbarSeverity("success");
                                setSnackbarMessage(
                                  "Synced Account with Extension"
                                );
                                setSnackbarIsOpen(true);
                              }
                            );
                          } catch (e) {
                            console.error(e);
                          }
                          setSyncLoading(false);
                        }}
                      >
                        Sync Now
                      </LoadingButton>
                    }
                  >
                    Browser Extension not synced
                  </Alert>
                )}
              </div>
            </div>
            <h2>Danger Zone</h2>
            <h3>Be very, very careful</h3>
            <div>
              <div>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
          <Snackbar
            open={snackbarIsOpen}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
              zIndex: 9999,
            }}
            onClose={() => {
              setSnackbarIsOpen(false);
            }}
            autoHideDuration={3000}
          >
            <Alert severity={snackbarSeverity} sx={{ zIndex: 99999 }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </HeaderAndFooter>
  );
}
