/*
 Usage:
   node scripts/grantAdmin.cjs user@example.com
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
    const passwordArg = process.argv[3];
    const saPathArg = process.argv[4];
    if (!email) {
      console.error('ERROR: Provide user email. Example: node scripts/grantAdmin.cjs admin@example.com');
      process.exit(1);
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const gappCred = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!admin.apps.length) {
      // Priority 1: explicit path arg
      if (saPathArg) {
        const abs = path.isAbsolute(saPathArg) ? saPathArg : path.resolve(process.cwd(), saPathArg);
        if (!fs.existsSync(abs)) {
          console.error(`ERROR: Service account JSON not found at ${abs}`);
          process.exit(1);
        }
        const creds = JSON.parse(fs.readFileSync(abs, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(creds),
          projectId: projectId || creds.project_id,
        });
      } else if (gappCred) {
        // Priority 2: GOOGLE_APPLICATION_CREDENTIALS path
        const resolved = path.isAbsolute(gappCred) ? gappCred : path.resolve(__dirname, '..', gappCred);
        if (fs.existsSync(resolved)) {
          const creds = JSON.parse(fs.readFileSync(resolved, 'utf8'));
          admin.initializeApp({
            credential: admin.credential.cert(creds),
            projectId: projectId || creds.project_id,
          });
        } else {
          // Fall back to ADC which may still use system-level env var
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId,
          });
        }
      } else if (saJson) {
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
        console.error('ERROR: Missing Firebase credentials. Provide path arg to service account JSON, or set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
        process.exit(1);
      }
    }

    const auth = admin.auth();

    // Ensure user exists; if not, create if password provided
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (e) {
      if (e && (e.code === 'auth/user-not-found' || String(e.message).includes('no user record'))) {
        if (!passwordArg) {
          console.error('ERROR: User not found. Provide a password to create the user: node scripts/grantAdmin.cjs <email> <password> [serviceAccountPath]');
          process.exit(1);
        }
        userRecord = await auth.createUser({ email, password: passwordArg, emailVerified: true });
        console.log(`Created user ${email} (uid: ${userRecord.uid}).`);
      } else {
        throw e;
      }
    }
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    await auth.revokeRefreshTokens(userRecord.uid);

    console.log(`SUCCESS: Granted admin claim to ${email} (uid: ${userRecord.uid}).`);
    console.log('Note: Sign out and sign in again, or call getIdToken(true) to refresh claims.');
  } catch (err) {
    console.error('FAILED:', err?.message || err);
    process.exit(1);
  }
})();
