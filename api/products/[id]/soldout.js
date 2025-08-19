const { firestore } = require('../../_lib/firebaseAdmin.js');
const { requireAuth } = require('../../_lib/auth.js');
const { handleCors, setCors } = require('../../_lib/cors.js');

const col = firestore.collection('products');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  const { id } = req.query;

  if (req.method !== 'PATCH' && req.method !== 'POST') {
    res.setHeader('Allow', ['PATCH', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });

    const existing = snap.data() || {};
    let soldOut;
    if (req.body && typeof req.body.soldOut === 'boolean') {
      soldOut = req.body.soldOut;
    } else {
      soldOut = !Boolean(existing.soldOut);
    }

    const update = { soldOut, updatedAt: new Date().toISOString() };

    // Use set to keep full document shape but ensure no undefined
    const payload = { ...existing, ...update };
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    await ref.set(payload);
    return res.status(200).json({ id, soldOut });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
