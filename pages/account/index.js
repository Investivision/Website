import styles from "./index.module.css";
import TextField from "@mui/material/TextField";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import SnackbarContent from "@mui/material/SnackbarContent";
import MuiPhoneNumber from "material-ui-phone-number";
import { auth, formatErrorCode, getFunction } from "../../firebase";
import { useTheme } from "@mui/styles";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
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

  const [role, setRole] = useState(undefined);

  const [portalLoading, setPortalLoading] = useState(false);

  const theme = useTheme();

  const router = useRouter();

  const updateRole = async (user, remaining) => {
    remaining = remaining || 0;
    if (user) {
      await user.getIdToken(true);
      const token = await user.getIdTokenResult(true);
      console.log("found token", token);
      if (token.claims.role) {
        setRole(token.claims.role);
      } else {
        setRole(undefined);
        if (remaining == 0) {
          router.push(`/account`, undefined, {
            shallow: true,
          });
        }
        console.log("query", router.query);
        if (remaining > 0 && router.query.success) {
          setTimeout(function () {
            updateRole(user, remaining - 1);
          }, 1500);
        }
      }
    } else {
      setRole(undefined);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateRole(user, 3);
        setUser(user);
        setName(user.displayName || "");
        setEmail(user.email);
        // setPhoneNumber(user.phoneNumber || "");
        console.log(user);

        try {
          console.log("ext: trying to send message");
          chrome.runtime.sendMessage(extId, { uid: user.uid }, function (res) {
            console.log("ext: ext response", res);
            setExtStatus(res.synced ? "synced" : "not synced");
          });
        } catch (e) {
          console.log("ext: error", e);
          setExtStatus(
            window.chrome ? "not installed" : "incompatible browser"
          );
        }
      } else {
        router.push("/login");
        // window.location.href = "/login";
      }
    });
    const port = chrome.runtime.connect(extId, { name: "" + Math.random() });
    port.onMessage.addListener(function (data) {
      if (data.removeName) {
        setExtStatus("not synced");
      }
    });
  }, []);

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      <NextSeo title="Account" />
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
            <h2 id="profile">Profile</h2>
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
                  label={`Email${
                    user.providerData.length &&
                    user.providerData[0].providerId != "password"
                      ? ` - via ${capitalize(
                          user.providerData[0].providerId.split(".")[0]
                        )}`
                      : ""
                  }`}
                  variant="outlined"
                  type="email"
                  disabled={
                    user.providerData.length >= 1 &&
                    user.providerData[0].providerId != "password"
                  }
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
                {user.providerData.length &&
                user.providerData[0].providerId == "password" ? (
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
                ) : null}
                <LoadingButton
                  variant="contained"
                  loading={signOutLoading}
                  onClick={() => {
                    setSignOutLoading(true);
                    if (window.chrome) {
                      chrome.runtime.sendMessage(
                        extId,
                        { message: "signOut" },
                        function (res) {
                          signOut(auth);
                        }
                      );
                    } else {
                      signOut(auth);
                    }
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
            <h2 id="subscription">Subscription</h2>
            <h3>Your access, your way</h3>
            <div>
              <div>
                {role ? (
                  <Alert
                    severity="success"
                    action={
                      <>
                        <Button
                          color="inherit"
                          size="medium"
                          onClick={() => router.push("/pricing")}
                        >
                          View Plans
                        </Button>

                        <LoadingButton
                          color="inherit"
                          size="medium"
                          loading={portalLoading}
                          onClick={async () => {
                            setPortalLoading(true);
                            const res = await getFunction("createPortalLink")({
                              returnUrl:
                                window.location.origin +
                                "/account?success=true",
                            });
                            router.push(res.data);
                          }}
                        >
                          Manage Subscription
                        </LoadingButton>
                      </>
                    }
                  >
                    {`Current Plan: `}
                    <span
                      style={{
                        backgroundColor:
                          theme.palette.mode == "dark"
                            ? "#00000040"
                            : "#00990030",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 16,
                        // fontWeight: "bold",
                      }}
                    >
                      {capitalize(role)}
                    </span>
                  </Alert>
                ) : router.query.success ? (
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={100}
                    style={{
                      width: 300,
                    }}
                    sx={{
                      transform: "none",
                    }}
                  />
                ) : (
                  <Alert
                    severity="warning"
                    action={
                      <Button
                        color="inherit"
                        size="medium"
                        onClick={() => router.push("/pricing")}
                      >
                        View Plans
                      </Button>
                    }
                  >
                    Not Subscribed
                  </Alert>
                )}
              </div>
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
                ) : extStatus == "incompatible browser" ? (
                  <Alert severity="warning">Incompatible Browser</Alert>
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
                                console.log("got res", res);
                                setExtStatus(
                                  res.synced ? "synced" : "not synced"
                                );
                                setSnackbarSeverity("success");
                                setSnackbarMessage(
                                  "Synced Account with Extension"
                                );
                                setSnackbarIsOpen(true);
                                setSyncLoading(false);
                              }
                            );
                          } catch (e) {
                            console.error(e);
                            setSyncLoading(false);
                          }
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
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSnackbarMessage(
                      "Are you sure you want to delete your account?"
                    );
                    setSnackbarSeverity("delete");
                    setSnackbarIsOpen(true);
                  }}
                >
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
            {snackbarSeverity == "delete" ? (
              <SnackbarContent
                sx={{
                  backgroundImage: "none",
                  backgroundColor:
                    theme.palette.mode == "dark" ? "#ffffff20" : "#00000008",
                  backdropFilter: "blur(10px)",
                  color: theme.palette.mode == "dark" ? "#ffffff" : "#000000",
                }}
                message="Are you sure you want to delete your account?"
                action={
                  <LoadingButton
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {}}
                  >
                    Yes, Delete
                  </LoadingButton>
                }
              />
            ) : (
              <Alert severity={snackbarSeverity} sx={{ zIndex: 99999 }}>
                {snackbarMessage}
              </Alert>
            )}
          </Snackbar>
        </>
      )}
    </HeaderAndFooter>
  );
}
