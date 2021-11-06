const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

try {
  var serviceAccount = require("../serviceAccount.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch {
  admin.initializeApp();
}

const decodeUser = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split(" ")[1];
    return await admin.auth().verifyIdToken(idToken);
  }
  return undefined;
};

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.generateToken = functions.https.onRequest((req, res) => {
//   // const decoded = await firebase.auth().verifyIdToken(idToken)
//   cors(req, res, () => {
//     // const user = await decodeUser(req);
//     res.json({
//       token: "this is the result token",
//     });
//   });
// });

exports.generateToken = functions.https.onCall(async (data, context) => {
  return {
    token: await admin.auth().createCustomToken(context.auth.uid), //await admin.auth().createCustomToken(context.auth.uid),
  };
});

// exports.generateToken = functions.https.onCall((uid) =>
//   admin.auth().createCustomToken(uid)
// );
