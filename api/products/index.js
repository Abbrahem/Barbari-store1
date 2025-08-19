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
      const { limit = 20 } = req.query;
      // Simple query without orderBy to avoid index issues in new Firestore
      const snap = await col.limit(Number(limit)).get();
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ items, nextCursor: snap.docs.at(-1)?.id || null });
    } catch (e) {
      console.error('GET /products error:', e);
      return res.status(500).json({ error: e.message, stack: e.stack });
    }
  }

  if (req.method === 'POST') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      res.setHeader('Cache-Control', 'no-store');
      let data = req.body || {};
      // In some runtimes body might be a JSON string; try to parse
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch {}
      }
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      // Validate required fields
      const priceNum = Number(data.price);
      if (!data.name || !Number.isFinite(priceNum) || !data.category) {
        return res.status(400).json({ error: 'Missing required fields: name, price, category' });
      }
      if (!Array.isArray(data.sizes) || !Array.isArray(data.colors)) {
        return res.status(400).json({ error: 'Invalid sizes or colors (must be arrays)' });
      }
      // images optional but ensure array; client should upload to storage and send URLs
      const images = Array.isArray(data.images) ? data.images : [];
      const payload = {
        name: String(data.name || '').trim(),
        description: data.description ? String(data.description) : '',
        price: priceNum,
        category: data.category || null,
        sizes: data.sizes || [],
        colors: data.colors || [],
        images,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Include originalPrice only if provided
      if (data.originalPrice !== undefined && data.originalPrice !== null && data.originalPrice !== '') {
        payload.originalPrice = Number(data.originalPrice);
      }
      // Remove any undefined values defensively
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      const ref = await col.add(payload);
      return res.status(201).json({ id: ref.id, ...payload });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
