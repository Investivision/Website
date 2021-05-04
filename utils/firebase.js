import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const config = ***REMOVED***
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
***REMOVED***;

if (!firebase.apps.length) ***REMOVED***
  firebase.initializeApp(config);
***REMOVED*** else ***REMOVED***
  firebase.app(); // if already initialized, use that one
***REMOVED***

module.exports = ***REMOVED***
  auth: firebase.auth(),
  db: firebase.database(),
  firestore: firebase.firestore(),
***REMOVED***;
