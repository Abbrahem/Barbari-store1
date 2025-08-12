const { firestore } = require('../_lib/firebaseAdmin.js');
const { requireAuth } = require('../_lib/auth.js');
const { handleCors, setCors } = require('../_lib/cors.js');

const col = firestore.collection('orders');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  if (req.method === 'POST') {
    try {
      res.setHeader('Cache-Control', 'no-store');
      const data = req.body || {};
      const payload = {
        items: data.items || [],
        total: Number(data.total) || 0,
        customer: data.customer || {},
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const ref = await col.add(payload);
      return res.status(201).json({ id: ref.id, ...payload });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      res.setHeader('Cache-Control', 'no-store');
      const snap = await col.orderBy('createdAt', 'desc').limit(100).get();
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ items });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
