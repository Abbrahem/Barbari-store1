const admin = require('firebase-admin');

let app;
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  // In serverless/production, require explicit credentials to avoid ADC failures
  if (!serviceJson || !projectId) {
    throw new Error('Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON in environment.');
  }

  const creds = admin.credential.cert(JSON.parse(serviceJson));
  const initOptions = { credential: creds, projectId };
  if (process.env.FIREBASE_STORAGE_BUCKET) initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  app = admin.initializeApp(initOptions);
} else {
  app = admin.app();
}

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { firestore, auth };
