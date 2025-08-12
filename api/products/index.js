const { firestore } = require('../_lib/firebaseAdmin.js');
const { requireAuth } = require('../_lib/auth.js');
const { handleCors, setCors } = require('../_lib/cors.js');

const col = firestore.collection('products');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store');
      const { limit = 20, cursor } = req.query;
      let query = col.orderBy('createdAt', 'desc').limit(Number(limit));
      if (cursor) {
        const cursorDoc = await col.doc(cursor).get();
        if (cursorDoc.exists) query = query.startAfter(cursorDoc);
      }
      const snap = await query.get();
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ items, nextCursor: snap.docs.at(-1)?.id || null });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      res.setHeader('Cache-Control', 'no-store');
      const data = req.body || {};
      const images = Array.isArray(data.images) ? data.images : [];
      const payload = {
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        category: data.category || null,
        sizes: data.sizes || [],
        colors: data.colors || [],
        images,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const ref = await col.add(payload);
      return res.status(201).json({ id: ref.id, ...payload });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
