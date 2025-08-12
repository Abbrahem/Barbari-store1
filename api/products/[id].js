const { firestore } = require('../_lib/firebaseAdmin.js');
const { requireAuth } = require('../_lib/auth.js');
const { handleCors, setCors } = require('../_lib/cors.js');

const col = firestore.collection('products');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  const { id } = req.query;

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    const doc = await col.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  }

  if (req.method === 'PUT') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      res.setHeader('Cache-Control', 'no-store');
      const docRef = col.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Not found' });
      const existing = doc.data();
      const data = req.body || {};
      const images = Array.isArray(data.images) ? data.images : existing.images || [];
      const payload = {
        ...existing,
        ...data,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : existing.originalPrice,
        images,
        updatedAt: new Date().toISOString(),
      };
      await docRef.set(payload);
      return res.status(200).json({ id, ...payload });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
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

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
