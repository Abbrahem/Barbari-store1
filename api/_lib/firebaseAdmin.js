const admin = require('firebase-admin');

let app;
if (!admin.apps.length) {
  const serviceJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const creds = serviceJson ? admin.credential.cert(JSON.parse(serviceJson)) : admin.credential.applicationDefault();
  const initOptions = { credential: creds };
  if (process.env.FIREBASE_PROJECT_ID) initOptions.projectId = process.env.FIREBASE_PROJECT_ID;
  if (process.env.FIREBASE_STORAGE_BUCKET) initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  app = admin.initializeApp(initOptions);
} else {
  app = admin.app();
}

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { firestore, auth };
