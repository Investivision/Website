import firebase, ***REMOVED*** getApp, initializeApp ***REMOVED*** from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/functions";
import ***REMOVED*** production ***REMOVED*** from "./production";

const config = ***REMOVED***
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
***REMOVED***;

let app;
if (!firebase.apps.length) ***REMOVED***
  app = firebase.initializeApp(config);
***REMOVED*** else ***REMOVED***
  app = firebase.app(); // if already initialized, use that one
***REMOVED***

if (!production) ***REMOVED***
  firebase.functions().useEmulator("localhost", 5001);
***REMOVED***

module.exports = ***REMOVED***
  auth: firebase.auth(),
  db: firebase.database(),
  firestore: firebase.firestore(),
  functions: firebase.functions(),
***REMOVED***;
