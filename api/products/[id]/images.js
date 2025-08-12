const { firestore } = require('../../_lib/firebaseAdmin.js');
const { requireAuth } = require('../../_lib/auth.js');

const col = firestore.collection('products');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    const data = req.body || {};
    const images = Array.isArray(data.images) ? data.images : [];
    await docRef.update({ images, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    return res.status(200).json({ id, ...updated.data() });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
