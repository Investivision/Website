import firebase, { getApp, initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/functions";
import { production } from "./production";

const config = {
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(config);
} else {
  app = firebase.app(); // if already initialized, use that one
}

if (!production) {
  firebase.functions().useEmulator("localhost", 5001);
}

module.exports = {
  auth: firebase.auth(),
  db: firebase.database(),
  firestore: firebase.firestore(),
  functions: firebase.functions(),
};
