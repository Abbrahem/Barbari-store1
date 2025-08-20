const { auth } = require('./firebaseAdmin.js');

async function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization token' });
    return null;
  }
  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded;
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

module.exports = { requireAuth };
