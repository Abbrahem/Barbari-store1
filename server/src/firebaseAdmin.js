import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env file from the current working directory (should be /server)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ESM dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Resolve service account path robustly: if relative, resolve from server/ directory
const rawCredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccountPath = path.isAbsolute(rawCredPath)
  ? rawCredPath
  : path.resolve(path.join(__dirname, '..'), rawCredPath);

console.log(`[Firebase] Initializing with credentials @ ${serviceAccountPath} (from env: ${rawCredPath})`);

try {
  let credential;
  // Prefer explicit service account JSON to avoid picking up user ADC that can cause UNAUTHENTICATED
  let resolvedProjectId = process.env.FIREBASE_PROJECT_ID;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(serviceAccountPath)) {
    const json = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    credential = admin.credential.cert(json);
    resolvedProjectId = json.project_id || resolvedProjectId;
    console.log(`[Firebase] Using service account JSON via credential.cert (project_id: ${resolvedProjectId}, client_email: ${json.client_email})`);
  } else {
    console.warn('[Firebase] GOOGLE_APPLICATION_CREDENTIALS not set or file missing; using in-memory fallback JSON if provided');
    const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    if (!jsonRaw) throw new Error('No service account JSON available');
    const json = JSON.parse(jsonRaw);
    credential = admin.credential.cert(json);
    resolvedProjectId = json.project_id || resolvedProjectId;
  }

  admin.initializeApp({
    credential,
    projectId: resolvedProjectId,
  });
  console.log(`[Firebase] Successfully initialized for project: ${resolvedProjectId}`);
} catch (error) {
  console.error(`[Firebase] CRITICAL: Failed to initialize Firebase Admin.`);
  console.error(`[Firebase] Underlying error: ${error.message}`);
  process.exit(1);
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const auth = admin.auth();
const storage = admin.storage();

// Export the initialized services
export { admin, db, auth, storage };
