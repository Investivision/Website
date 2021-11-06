const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")(***REMOVED*** origin: true ***REMOVED***);

try ***REMOVED***
  var serviceAccount = require("../serviceAccount.json");
  admin.initializeApp(***REMOVED***
    credential: admin.credential.cert(serviceAccount),
  ***REMOVED***);
***REMOVED*** catch ***REMOVED***
  admin.initializeApp();
***REMOVED***

const decodeUser = async (req) => ***REMOVED***
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) ***REMOVED***
    const idToken = req.headers.authorization.split(" ")[1];
    return await admin.auth().verifyIdToken(idToken);
  ***REMOVED***
  return undefined;
***REMOVED***;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.generateToken = functions.https.onRequest((req, res) => ***REMOVED***
//   // const decoded = await firebase.auth().verifyIdToken(idToken)
//   cors(req, res, () => ***REMOVED***
//     // const user = await decodeUser(req);
//     res.json(***REMOVED***
//       token: "this is the result token",
//     ***REMOVED***);
//   ***REMOVED***);
// ***REMOVED***);

exports.generateToken = functions.https.onCall(async (data, context) => ***REMOVED***
  return ***REMOVED***
    token: await admin.auth().createCustomToken(context.auth.uid), //await admin.auth().createCustomToken(context.auth.uid),
  ***REMOVED***;
***REMOVED***);

// exports.generateToken = functions.https.onCall((uid) =>
//   admin.auth().createCustomToken(uid)
// );
