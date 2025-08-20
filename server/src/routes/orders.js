import { Router } from 'express';
import { db as firestore } from '../firebaseAdmin.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = Router();
const col = firestore.collection('orders');

// Create order (public)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const payload = {
      items: data.items || [],
      total: Number(data.total) || 0,
      customer: data.customer || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const doc = await col.add(payload);
    res.json({ id: doc.id, ...payload });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List orders (admin)
router.get('/', verifyFirebaseToken, async (_req, res) => {
  try {
    const snap = await col.orderBy('createdAt', 'desc').limit(100).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get order by id (admin)
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update order status (admin)
router.put('/:id/status', verifyFirebaseToken, async (req, res) => {
  try {
    const { status } = req.body; // e.g., 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled'
    const id = req.params.id;
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });

    await docRef.update({ status, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    res.json({ id, ...updated.data() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete order (admin)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    await col.doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
