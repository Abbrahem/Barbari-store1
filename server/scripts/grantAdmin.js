/*
 Usage:
   node scripts/grantAdmin.js user@example.com
 Requires:
   server/.env with either:
     - GOOGLE_APPLICATION_CREDENTIALS path (preferred locally), or
     - FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_PROJECT_ID
*/

const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load env from server/.env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('ERROR: Provide user email. Example: node scripts/grantAdmin.js admin@example.com');
      process.exit(1);
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const gappCred = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!projectId && !saJson && !gappCred) {
      console.error('ERROR: Missing Firebase credentials. Ensure server/.env contains FIREBASE_PROJECT_ID and either FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
      process.exit(1);
    }

    if (!admin.apps.length) {
      if (saJson) {
        let creds;
        try {
          creds = JSON.parse(saJson);
        } catch (e) {
          console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
          process.exit(1);
        }
        admin.initializeApp({
          credential: admin.credential.cert(creds),
          projectId: projectId || creds.project_id,
        });
      } else {
        // Use Application Default Credentials via GOOGLE_APPLICATION_CREDENTIALS
        if (gappCred && !fs.existsSync(path.resolve(__dirname, '..', gappCred))) {
          // also accept absolute path
          if (!fs.existsSync(gappCred)) {
            console.warn('WARNING: GOOGLE_APPLICATION_CREDENTIALS file path not found. Proceeding; ADC may still work if set globally.');
          }
        }
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId,
        });
      }
    }

    const auth = admin.auth();

    const userRecord = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    // Force token refresh for the user on next sign-in
    await auth.revokeRefreshTokens(userRecord.uid);

    console.log(`SUCCESS: Granted admin claim to ${email} (uid: ${userRecord.uid}).`);
    console.log('Note: Ask the user to sign out and sign in again, or call getIdToken(true) to refresh claims.');
  } catch (err) {
    console.error('FAILED:', err?.message || err);
    process.exit(1);
  }
})();
