import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment from server/.env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ESM dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve service account JSON located in server/
function resolveServiceAccountPath() {
  // 1) Respect explicit env var if provided
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envPath) {
    const p = path.isAbsolute(envPath) ? envPath : path.resolve(process.cwd(), envPath);
    if (fs.existsSync(p)) return p;
    console.warn('[Firebase] GOOGLE_APPLICATION_CREDENTIALS set but file not found at:', p);
  }

  // 2) Try known filenames in server/ directory
  const candidates = [
    'shevoo-store-firebase-adminsdk-fbsvc-339b2c15a9.json', // new key
    'shevoo-store-firebase-adminsdk-fbsvc-0f464cc77a.json', // old key
  ].map((f) => path.resolve(__dirname, `../${f}`));

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  // 3) As a last resort, scan server/ for any service account file that matches pattern
  try {
    const serverDir = path.resolve(__dirname, '..');
    const files = fs.readdirSync(serverDir).filter((f) => f.includes('firebase-adminsdk') && f.endsWith('.json'));
    if (files.length) {
      // Pick the most recently modified
      const sorted = files
        .map((f) => ({ f, m: fs.statSync(path.join(serverDir, f)).mtimeMs }))
        .sort((a, b) => b.m - a.m);
      return path.join(serverDir, sorted[0].f);
    }
  } catch {}

  return null;
}

const serviceAccountPath = resolveServiceAccountPath();
console.log('[Firebase] Service account path:', serviceAccountPath || '(not found)');

try {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Service account file not found at ${serviceAccountPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`
    });
    console.log(`[Firebase] Admin SDK initialized for project ${serviceAccount.project_id}`);
  }

} catch (err) {
  console.error('[Firebase] Failed to initialize Admin SDK:', err.message);
  // Fail fast so we fix credentials rather than silently using mocks
  throw err;
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
