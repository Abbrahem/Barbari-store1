const admin = require('firebase-admin');

let app;
try {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    let serviceJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
    if (!serviceJson && serviceB64) {
      try {
        serviceJson = Buffer.from(serviceB64, 'base64').toString('utf8');
      } catch (e) {
        console.error('Base64 decode error:', e);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON_BASE64: ' + e.message);
      }
    }

    // In serverless/production, require explicit credentials to avoid ADC failures
    if (!serviceJson || !projectId) {
      console.error('Firebase Admin config missing:', { 
        hasServiceJson: !!serviceJson, 
        hasProjectId: !!projectId,
        hasServiceB64: !!serviceB64 
      });
      throw new Error('Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON in environment.');
    }

    let parsed;
    try {
      parsed = JSON.parse(serviceJson);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: ' + e.message);
    }
    if (parsed.private_key && typeof parsed.private_key === 'string') {
      // Normalize escaped newlines and CRLF to LF
      let pk = parsed.private_key;
      pk = pk.replace(/\\n/g, '\n');
      pk = pk.replace(/\r\n/g, '\n');
      pk = pk.trim();
      // Ensure final newline (some parsers require it)
      if (!pk.endsWith('\n')) pk += '\n';
      parsed.private_key = pk;
    }
    let creds;
    try {
      creds = admin.credential.cert(parsed);
    } catch (pemErr) {
      console.error('Credential cert creation failed:', pemErr);
      throw pemErr;
    }
    const initOptions = { credential: creds, projectId };
    if (process.env.FIREBASE_STORAGE_BUCKET) initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    console.log('Initializing Firebase Admin with project:', projectId);
    app = admin.initializeApp(initOptions);
  } else {
    app = admin.app();
  }
} catch (e) {
  console.error('Firebase Admin initialization failed:', e);
  throw e;
}

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { firestore, auth };
