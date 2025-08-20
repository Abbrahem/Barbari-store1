import { auth } from '../firebaseAdmin.js';

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;

  if (!token) {
    console.log(`[AUTH] Blocked ${req.method} ${req.path}: Missing token`);
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  // For development: accept dev-admin-token
  if (token === 'dev-admin-token') {
    req.user = { uid: 'admin-user', email: 'admin@shevoo.com' };
    console.log(`[AUTH] Allowed ${req.method} ${req.path} for admin user`);
    return next();
  }

  // Try to verify Firebase token with Admin SDK
  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    console.log(`[AUTH] Allowed ${req.method} ${req.path} for user ${decoded.uid}`);
    next();
  } catch (err) {
    console.error(`[AUTH] Blocked ${req.method} ${req.path}: Invalid token. Error:`, err.code, err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
