import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDsh36JtqHCOf9RoE8W_IHEyiDt0vOBTQc",
  authDomain: "investivision2.firebaseapp.com",
  projectId: "investivision2",
  storageBucket: "investivision2.appspot.com",
  messagingSenderId: "483289225168",
  appId: "1:483289225168:web:f27b4ec55d028a184d4bd5",
  measurementId: "G-1KW4VBZRH8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}

module.exports = {
  auth: firebase.auth(),
  db: firebase.database(),
  firestore: firebase.firestore(),
};
