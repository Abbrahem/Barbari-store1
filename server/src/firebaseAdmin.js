import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';

// Load .env file from the current working directory (should be /server)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// TEMPORARY FIX: Set hardcoded values for development if .env fails to load
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log('[Firebase] .env file not loaded properly. Using hardcoded development values.');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = './shevoo-store-firebase-adminsdk-fbsvc-0f464cc77a.json';
  process.env.FIREBASE_PROJECT_ID = 'shevoo-store';
  process.env.FIREBASE_STORAGE_BUCKET = 'shevoo-store.appspot.com';
  process.env.PORT = '5000';
  process.env.CORS_ORIGIN = 'http://localhost:3000';
}

// Strict check for environment variables. The server will not start without them.
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('FATAL ERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
  process.exit(1);
}
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('FATAL ERROR: FIREBASE_PROJECT_ID environment variable is not set.');
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

console.log(`[Firebase] Initializing with service account: ${serviceAccountPath}`);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // This is optional
  });
  console.log(`[Firebase] Successfully initialized for project: ${process.env.FIREBASE_PROJECT_ID}`);
} catch (error) {
  console.error(`[Firebase] CRITICAL: Failed to initialize with service account file at '${serviceAccountPath}'.`);
  console.error('[Firebase] Please ensure the path in your server/.env file is correct and the JSON file exists.');
  console.error(`[Firebase] Underlying error: ${error.message}`);
  process.exit(1); // Stop the server if initialization fails
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const auth = admin.auth();
const storage = admin.storage();

// Export the initialized services
export { admin, db, auth, storage };
