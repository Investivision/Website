// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
module.exports.auth = getAuth();

const formatErrorCode = (code) => {
  return code
    .split("/")[1]
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substring(1);
    })
    .join(" ");
};

// connectFunctionsEmulator(getFunctions(), "localhost", 5001);

const getFunction = (func) => {
  return httpsCallable(getFunctions(), func);
};

module.exports = {
  firebase,
  formatErrorCode,
  auth: getAuth(),
  getFunction: getFunction,
};
