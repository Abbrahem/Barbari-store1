const admin = require('firebase-admin');

let app;
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  let serviceJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!serviceJson && serviceB64) {
    try {
      serviceJson = Buffer.from(serviceB64, 'base64').toString('utf8');
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON_BASE64: ' + e.message);
    }
  }

  // In serverless/production, require explicit credentials to avoid ADC failures
  if (!serviceJson || !projectId) {
    throw new Error('Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON in environment.');
  }

  let parsed;
  try {
    parsed = JSON.parse(serviceJson);
  } catch (e) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: ' + e.message);
  }
  if (parsed.private_key && typeof parsed.private_key === 'string') {
    // Normalize escaped newlines
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  const creds = admin.credential.cert(parsed);
  const initOptions = { credential: creds, projectId };
  if (process.env.FIREBASE_STORAGE_BUCKET) initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  app = admin.initializeApp(initOptions);
} else {
  app = admin.app();
}

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { firestore, auth };
