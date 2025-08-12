import { Router } from 'express';
import multer from 'multer';
import { db as firestore } from '../firebaseAdmin.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
// Storage utils removed; we'll store images as base64 in Firestore

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const col = firestore.collection('products');

// List products (with optional pagination)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, cursor } = req.query;
    let items = [];
    let nextCursor = null;

    try {
      // Primary: order by createdAt desc
      let query = col.orderBy('createdAt', 'desc').limit(Number(limit));
      if (cursor) {
        const cursorDoc = await col.doc(cursor).get();
        if (cursorDoc.exists) query = query.startAfter(cursorDoc);
      }
      const snap = await query.get();
      items = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          id: d.id,
          name: data.name,
          price: data.price,
          category: data.category,
          thumbnail: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null,
          imageCount: Array.isArray(data.images) ? data.images.length : 0,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
        };
      });
      const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
      nextCursor = lastDoc ? lastDoc.id : null;
    } catch (err) {
      // Fallback: no ordering (handles collections with mixed createdAt types)
      console.warn('[products] Fallback listing without createdAt order:', err?.message || err);
      const snap = await col.limit(Number(limit)).get();
      items = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          id: d.id,
          name: data.name,
          price: data.price,
          category: data.category,
          thumbnail: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null,
          imageCount: Array.isArray(data.images) ? data.images.length : 0,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
        };
      });
      nextCursor = null; // basic fallback without pagination cursor
    }

    res.json({ items, nextCursor });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  const doc = await col.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc.id, ...doc.data() });
});

// Create product (admin)
router.post('/', verifyFirebaseToken, upload.array('images', 6), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const files = req.files || [];
    // Convert images to base64 data URLs and store directly in Firestore
    const images = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    const payload = {
      name: data.name,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      category: data.category || null,
      images: Array.isArray(images) ? images : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colors: Array.isArray(data.colors) ? data.colors : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: data.active !== false,
    };

    const ref = await col.add(payload);
    res.status(201).json({ id: ref.id, ...payload });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

// Update product (admin)
router.put('/:id', verifyFirebaseToken, upload.array('images', 6), async (req, res) => {
  try {
    const id = req.params.id;
    const data = JSON.parse(req.body.data || '{}');

    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    const existing = doc.data();

    const files = req.files || [];
    let newImages = Array.isArray(existing.images) ? existing.images : [];
    if (files.length) {
      const base64New = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);
      newImages = [...newImages, ...base64New];
    }

    const payload = {
      ...existing,
      ...data,
      price: data.price !== undefined ? Number(data.price) : existing.price,
      originalPrice:
        data.originalPrice !== undefined ? Number(data.originalPrice) : existing.originalPrice,
      images: newImages,
      sizes: Array.isArray(data.sizes) ? data.sizes : (Array.isArray(existing.sizes) ? existing.sizes : []),
      colors: Array.isArray(data.colors) ? data.colors : (Array.isArray(existing.colors) ? existing.colors : []),
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(payload);
    res.json({ id, ...payload });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Replace images (admin)
router.put('/:id/images', verifyFirebaseToken, upload.array('images', 6), async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });

    const files = req.files || [];
    const images = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    await docRef.update({ images, updatedAt: new Date().toISOString() });
    res.json({ id, ...(await docRef.get()).data() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete product (admin)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const id = req.params.id;
    await col.doc(id).delete();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
