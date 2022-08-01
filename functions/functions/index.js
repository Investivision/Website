const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { logger } = functions;
const Stripe = require("stripe");
const fs = require("fs");

const isLocal = false;
try {
  if (fs.existsSync("./.env")) {
    require("dotenv").config();
    isLocal = true;
  }
} catch {}
logger.log("isLocal:", isLocal);

admin.initializeApp();

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

const apiVersion = "2020-08-27";
// logger.log(process.env);
const stripeSecret = isLocal
  ? process.env.stripe_secret
  : functions.config().stripe.stripe_secret;
logger.log(`stripe secret: ${stripeSecret}`);
const stripe = new Stripe(stripeSecret, {
  apiVersion,
});

const setCustomClaims = async (uid, claims) => {
  let oldClaims = (await admin.auth().getUser(uid)).customClaims || {};
  logger.log("claims before overwriting", oldClaims);
  const newClaims = { ...oldClaims, ...claims };
  const withoutNulls = Object.fromEntries(
    Object.entries(newClaims).filter(([_, v]) => v != null)
  );
  await admin.auth().setCustomUserClaims(uid, withoutNulls);
  logger.log(`set custom claims for ${uid}`, withoutNulls);
  return withoutNulls;
};

const createCustomerRecord = async (email, uid, affiliate) => {
  try {
    logger.log(`will create customer record for ${uid}`);
    const customerData = {
      metadata: {
        firebaseUID: uid,
      },
    };
    if (affiliate) {
      customerData.metadata.affiliate = affiliate;
    }
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    const claims = await setCustomClaims(uid, {
      stripeId: customer.id,
      stripeLive: customer.livemode,
    });
    logger.log(
      `created customer record for ${uid}, customer id: ${customer.id}`
    );
    return claims;
  } catch (error) {
    logger.log(`failed to create customer record for ${uid}, ${error}`);
    throw error;
  }
};

exports.createCheckoutSession = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }
    logger.log("101", await admin.auth().getUser(context.auth.uid));
    let { customClaims } = await admin.auth().getUser(context.auth.uid);

    if (customClaims && customClaims.role) {
      return (
        await stripe.billingPortal.sessions.create({
          customer: customClaims.stripeId,
          return_url: data.successUrl,
        })
      ).url;
    }

    if (!customClaims || !customClaims.stripeId) {
      logger.log("creating customer record");
      customClaims = await createCustomerRecord(
        context.auth.email,
        context.auth.uid
      );
    }

    const session = await stripe.checkout.sessions.create({
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer: customClaims.stripeId,
      line_items: [{ price: data.priceId, quantity: 1 }],
      mode: "subscription",
    });

    logger.log(
      `created checkout session for user ${context.auth.uid}, ${session}`
    );

    return session.url;
  }
);

exports.createPortalLink = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  logger.log("token from client", JSON.stringify(context.auth, null, "  "));
  let { stripeId } = context.auth.token;
  if (!stripeId) {
    stripeId = (
      await createCustomerRecord(context.auth.email, context.auth.uid)
    ).stripeId;
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: data.returnUrl,
  });

  logger.log(`created portal session for user ${context.auth.uid}, ${session}`);

  return session.url;
});

// const unsubscribed = async (customerId) => {
//   const customer = await stripe.customers.retrieve(customerId);
//   await setCustomClaims(customer.metadata.firebaseUID, {
//     role: null,
//   });
// };

const handleSubscriptionUpdate = async (subscriptionId, status, customerId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  const { firebaseRole } = subscription.items.data[0].price.product.metadata;

  const customer = await stripe.customers.retrieve(customerId);
  logger.log(JSON.stringify(subscription, null, " "));
  const role = ["active", "trialing"].includes(status) ? firebaseRole : null;
  await setCustomClaims(customer.metadata.firebaseUID, {
    role: role,
  });
  logger.log(`set role to ${role} for ${customer.metadata.firebaseUID}`);
};

const handleUpdatedSubscriptionObject = async (subscription) => {
  await handleSubscriptionUpdate(
    subscription.id,
    subscription.status,
    subscription.customer
  );
};

exports.hooks = functions.https.onRequest(async (req, resp) => {
  let event;
  try {
    const secret = isLocal
      ? process.env.stripe_signing_secret
      : functions.config().stripe.stripe_signing_secret;
    logger.log("signing secret is", secret);
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      secret
    );
  } catch (error) {
    logger.log(`bad webhood request: ${error}`);
    resp.status(401).send("Webhook Error: Invalid Secret");
    return;
  }

  logger.log(`start processing event: ${event.id}, ${event.type}`);
  try {
    switch (event.type) {
      case "customer.subscription.created":
        // await handleUpdatedSubscriptionObject(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleUpdatedSubscriptionObject(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleUpdatedSubscriptionObject(event.data.object);
        break;
      case "checkout.session.completed":
        let { subscription, customer } = event.data.object;
        handleSubscriptionUpdate(subscription, "active", customer);
        break;
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.async_payment_failed":
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
      default:
        logger.log(`unknown event type: ${event.type}`);
    }
    logger.log(`finished processing event: ${event.id}, ${event.type}`);
  } catch (error) {
    logger.log(`failed to process event: ${event.id}, ${event.type}`, error);
    return resp.status(500).json({
      error: "Webhook handler failed. View function logs in Firebase.",
    });
  }
  resp.json({ received: true });
});

exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  await stripe.customers.del(user.customClaims.stripeId);
  await admin
    .firestore()
    .collection("notes")
    .where("uid", "==", user.uid)
    .delete();
  await admin
    .firestore()
    .collection("configs")
    .where("uid", "==", user.uid)
    .delete();
  logger.log(
    `deleted user ${user.uid} stripe information, stripeId: ${user.customClaims.stripeId}. Removed notes.`
  );
});
