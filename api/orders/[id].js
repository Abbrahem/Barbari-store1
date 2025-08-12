const { firestore } = require('../_lib/firebaseAdmin.js');
const { requireAuth } = require('../_lib/auth.js');
const { handleCors, setCors } = require('../_lib/cors.js');

const col = firestore.collection('orders');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  const { id } = req.query;

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    const user = await requireAuth(req, res);
    if (!user) return;
    const doc = await col.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  }

  if (req.method === 'DELETE') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      res.setHeader('Cache-Control', 'no-store');
      await col.doc(id).delete();
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
