// Import the functions you need from the SDKs you need
import ***REMOVED*** initializeApp ***REMOVED*** from "firebase/app";
import ***REMOVED*** getAuth ***REMOVED*** from "firebase/auth";
import ***REMOVED***
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
***REMOVED*** from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = ***REMOVED***
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
***REMOVED***;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
module.exports.auth = getAuth();

const formatErrorCode = (code) => ***REMOVED***
  return code
    .split("/")[1]
    .split("-")
    .map((word) => ***REMOVED***
      return word.charAt(0).toUpperCase() + word.substring(1);
    ***REMOVED***)
    .join(" ");
***REMOVED***;

// connectFunctionsEmulator(getFunctions(), "localhost", 5001);

const getFunction = (func) => ***REMOVED***
  return httpsCallable(getFunctions(), func);
***REMOVED***;

module.exports = ***REMOVED***
  formatErrorCode,
  auth: getAuth(),
  getFunction: getFunction,
***REMOVED***;
