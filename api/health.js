const { firestore } = require('./_lib/firebaseAdmin.js');

module.exports = async function handler(req, res) {
  const info = { ok: true, service: 'shevoo-vercel-api', time: new Date().toISOString() };
  try {
    // Try a lightweight Firestore op
    const snap = await firestore.collection('products').limit(1).get();
    info.firestore = { reachable: true, count: snap.size };
  } catch (e) {
    console.error('Health Firestore check failed:', e);
    info.firestore = { reachable: false, error: e.message };
  }
  res.status(200).json(info);
}
