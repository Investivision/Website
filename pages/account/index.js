import styles from "./index.module.css";
import TextField from "@mui/material/TextField";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import Skeleton from "@mui/material/Skeleton";
import MuiPhoneNumber from "material-ui-phone-number";
import ***REMOVED*** auth, formatErrorCode, getFunction ***REMOVED*** from "../../firebase";
import ***REMOVED***
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
***REMOVED*** from "firebase/auth";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

export default function Account() ***REMOVED***
  // console.log(auth);
  // if (!auth.currentUser) ***REMOVED***
  //   // window.location.hef = "/login";
  //   // return null;
  // ***REMOVED***

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

  useEffect(() => ***REMOVED***
    onAuthStateChanged(auth, (user) => ***REMOVED***
      if (user) ***REMOVED***
        setUser(user);
        setName(user.displayName || "");
        setEmail(user.email);
        // setPhoneNumber(user.phoneNumber || "");
        console.log(user);
        try ***REMOVED***
          chrome.runtime.sendMessage(extId, ***REMOVED*** uid: user.uid ***REMOVED***, function (res) ***REMOVED***
            setExtStatus(res.synced ? "synced" : "not synced");
          ***REMOVED***);
        ***REMOVED*** catch (e) ***REMOVED***
          setExtStatus("not installed");
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        window.location.href = "/login";
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***, []);

  return (
    <HeaderAndFooter bodyClassName=***REMOVED***styles.body***REMOVED***>
      ***REMOVED***!user ? (
        <>
          <Skeleton
            variant="text"
            animation="wave"
            height=***REMOVED***60***REMOVED***
            style=***REMOVED******REMOVED***
              width: 300,
              marginTop: 20,
            ***REMOVED******REMOVED***
            sx=***REMOVED******REMOVED***
              transform: "none",
            ***REMOVED******REMOVED***
          />
          ***REMOVED***[1, 1, 1].map((e, i) => (
            <div className=***REMOVED***styles.skeletonGroup***REMOVED*** key=***REMOVED***i***REMOVED***>
              <Skeleton
                variant="text"
                animation="wave"
                height=***REMOVED***30***REMOVED***
                style=***REMOVED******REMOVED***
                  width: 400,
                ***REMOVED******REMOVED***
                sx=***REMOVED******REMOVED***
                  transform: "none",
                ***REMOVED******REMOVED***
              />
              <Skeleton
                animation="wave"
                height=***REMOVED***160***REMOVED***
                style=***REMOVED******REMOVED***
                  width: "100%",
                  maxWidth: 900,
                ***REMOVED******REMOVED***
                sx=***REMOVED******REMOVED***
                  transform: "none",
                ***REMOVED******REMOVED***
              />
            </div>
          ))***REMOVED***
        </>
      ) : (
        <>
          <h1 className="pageHeader">Account</h1>
          <div className=***REMOVED***styles.content***REMOVED***>
            <h2>Profile</h2>
            <div>
              <div>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  value=***REMOVED***name***REMOVED***
                  onChange=***REMOVED***(e) => ***REMOVED***
                    setName(e.target.value);
                  ***REMOVED******REMOVED***
                  className=***REMOVED***styles.textInput***REMOVED***
                  color="primary"
                  onBlur=***REMOVED***async () => ***REMOVED***
                    const trimmed = name.trim();
                    if (trimmed) ***REMOVED***
                      if (trimmed != user.displayName) ***REMOVED***
                        try ***REMOVED***
                          await updateProfile(user, ***REMOVED***
                            displayName: trimmed,
                          ***REMOVED***);
                          setSnackbarSeverity("success");
                          setSnackbarMessage(`Changed Full Name to $***REMOVED***name***REMOVED***`);
                        ***REMOVED*** catch (e) ***REMOVED***
                          setSnackbarSeverity("error");
                          setSnackbarMessage(formatErrorCode(e.code));
                        ***REMOVED***
                        setSnackbarIsOpen(true);
                      ***REMOVED***
                      // think about case with oringal + spaces, still need to trim
                      if (trimmed.length != name.length) ***REMOVED***
                        setName(trimmed);
                      ***REMOVED***
                    ***REMOVED*** else ***REMOVED***
                      setName(user.displayName);
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  value=***REMOVED***email***REMOVED***
                  onChange=***REMOVED***(e) => ***REMOVED***
                    setEmail(e.target.value);
                  ***REMOVED******REMOVED***
                  className=***REMOVED***styles.textInput***REMOVED***
                  color="primary"
                  onBlur=***REMOVED***async () => ***REMOVED***
                    const trimmed = email.trim();
                    if (trimmed) ***REMOVED***
                      if (trimmed != user.email) ***REMOVED***
                        try ***REMOVED***
                          await updateEmail(user, email);
                          setSnackbarSeverity("success");
                          setSnackbarMessage(`Changed email to $***REMOVED***email***REMOVED***`);
                        ***REMOVED*** catch (e) ***REMOVED***
                          setSnackbarSeverity("error");
                          setSnackbarMessage(formatErrorCode(e.code));
                          setEmail(user.email);
                        ***REMOVED***
                        setSnackbarIsOpen(true);
                      ***REMOVED***
                      if (trimmed.length != email.length) ***REMOVED***
                        setEmail(trimmed);
                      ***REMOVED***
                    ***REMOVED*** else ***REMOVED***
                      setEmail(user.email);
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                />
                ***REMOVED***/* <MuiPhoneNumber
              defaultCountry=***REMOVED***"us"***REMOVED***
              onChange=***REMOVED***setPhoneNumber***REMOVED***
              value=***REMOVED***phoneNumber***REMOVED***
              variant="outlined"
              label="Phone Number"
              onBlur=***REMOVED***async () => ***REMOVED***
                await updateProfile(user, ***REMOVED***
                  phoneNumber: phoneNumber,
                ***REMOVED***);
                alert("changed phone number");
              ***REMOVED******REMOVED***
            /> */***REMOVED***
              </div>
              <div>
                ***REMOVED***user?.emailVerified ? (
                  <Alert severity="success">Email Verified</Alert>
                ) : (
                  <Alert
                    severity="warning"
                    action=***REMOVED***
                      <LoadingButton
                        loading=***REMOVED***verifyLoading***REMOVED***
                        color="inherit"
                        size="medium"
                        onClick=***REMOVED***async () => ***REMOVED***
                          setVerifyLoading(true);
                          try ***REMOVED***
                            await sendEmailVerification(user);
                            setSnackbarSeverity("success");
                            setSnackbarMessage("Sent verification email");
                          ***REMOVED*** catch (e) ***REMOVED***
                            setSnackbarSeverity("warning");
                            setSnackbarMessage(formatErrorCode(e.code));
                          ***REMOVED***
                          setVerifyLoading(false);
                          setSnackbarIsOpen(true);
                        ***REMOVED******REMOVED***
                      >
                        Verify
                      </LoadingButton>
                    ***REMOVED***
                  >
                    Email not Verified
                  </Alert>
                )***REMOVED***
              </div>
              <div>
                <LoadingButton
                  variant="contained"
                  loading=***REMOVED***resetLoading***REMOVED***
                  onClick=***REMOVED***async () => ***REMOVED***
                    setResetLoading(true);
                    await sendPasswordResetEmail(auth, user.email);
                    setResetLoading(false);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Sent password reset email");
                    setSnackbarIsOpen(true);
                  ***REMOVED******REMOVED***
                >
                  Reset Password
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  loading=***REMOVED***signOutLoading***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED***
                    setSignOutLoading(true);
                    signOut(auth);
                  ***REMOVED******REMOVED***
                >
                  Sign Out
                </LoadingButton>
              </div>
            </div>
            ***REMOVED***/* <h2>Subscription</h2>
            <div>
              <div>
                <Alert
                  severity="warning"
                  action=***REMOVED***
                    <Button color="inherit" size="medium">
                      Subscribe now
                    </Button>
                  ***REMOVED***
                >
                  Currently not subscribed
                </Alert>
                <Alert
                  severity="success"
                  action=***REMOVED***
                    <>
                      <Button color="inherit" size="medium">
                        View Plans
                      </Button>
                      <Button color="inherit" size="medium">
                        Manage subscription on Stripe
                      </Button>
                    </>
                  ***REMOVED***
                >
                  Subscribed
                </Alert>
              </div>
              <div>
                <Button variant="contained">View Pricing</Button>
              </div>
            </div> */***REMOVED***
            <h2>Extension</h2>
            <div>
              <div>
                ***REMOVED***!extStatus ? (
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height=***REMOVED***50***REMOVED***
                    style=***REMOVED******REMOVED***
                      width: 300,
                      marginTop: 20,
                    ***REMOVED******REMOVED***
                    sx=***REMOVED******REMOVED***
                      transform: "none",
                    ***REMOVED******REMOVED***
                  />
                ) : extStatus == "not installed" ? (
                  <Alert
                    severity="warning"
                    action=***REMOVED***
                      <Button color="inherit" size="medium">
                        Install now
                      </Button>
                    ***REMOVED***
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
                    action=***REMOVED***
                      <LoadingButton
                        loading=***REMOVED***syncLoading***REMOVED***
                        color="inherit"
                        size="medium"
                        onClick=***REMOVED***async () => ***REMOVED***
                          setSyncLoading(true);
                          try ***REMOVED***
                            const ***REMOVED*** token ***REMOVED*** = (
                              await getFunction("generateToken")(***REMOVED******REMOVED***)
                            ).data;
                            chrome.runtime.sendMessage(
                              extId,
                              ***REMOVED*** token: token ***REMOVED***,
                              function (res) ***REMOVED***
                                setExtStatus(
                                  res.synced ? "synced" : "not synced"
                                );
                                setSnackbarSeverity("success");
                                setSnackbarMessage(
                                  "Synced Account with Extension"
                                );
                                setSnackbarIsOpen(true);
                              ***REMOVED***
                            );
                          ***REMOVED*** catch (e) ***REMOVED***
                            console.error(e);
                          ***REMOVED***
                          setSyncLoading(false);
                        ***REMOVED******REMOVED***
                      >
                        Sync Now
                      </LoadingButton>
                    ***REMOVED***
                  >
                    Browser Extension not synced
                  </Alert>
                )***REMOVED***
              </div>
            </div>
            <h2>Danger Zone</h2>
            <div>
              <div>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
          <Snackbar
            open=***REMOVED***snackbarIsOpen***REMOVED***
            anchorOrigin=***REMOVED******REMOVED***
              vertical: "top",
              horizontal: "right",
              zIndex: 9999,
            ***REMOVED******REMOVED***
            onClose=***REMOVED***() => ***REMOVED***
              setSnackbarIsOpen(false);
            ***REMOVED******REMOVED***
            autoHideDuration=***REMOVED***3000***REMOVED***
          >
            <Alert severity=***REMOVED***snackbarSeverity***REMOVED*** sx=***REMOVED******REMOVED*** zIndex: 99999 ***REMOVED******REMOVED***>
              ***REMOVED***snackbarMessage***REMOVED***
            </Alert>
          </Snackbar>
        </>
      )***REMOVED***
    </HeaderAndFooter>
  );
***REMOVED***
