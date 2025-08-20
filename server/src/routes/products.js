import { Router } from 'express';
import multer from 'multer';
import { db as firestore } from '../firebaseAdmin.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
// Storage utils removed; we'll store images as base64 in Firestore

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const col = firestore.collection('products');

// Test endpoint to check Firestore connection
router.get('/test', async (req, res) => {
  try {
    console.log('[products/test] Testing Firebase Web SDK connection...');
    
    // Try to get products collection with Admin SDK
    const snap = await col.get();
    console.log(`[products/test] Found ${snap.docs.length} documents in collection`);
    
    if (snap.empty) {
      console.log('[products/test] Products collection is empty, creating test product...');
      const testProduct = {
        name: 'منتج اختبار',
        price: 150,
        category: 'اختبار',
        images: [],
        sizes: ['S', 'M', 'L'],
        colors: ['أحمر', 'أزرق'],
        active: true,
        soldOut: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await col.add(testProduct);
      console.log(`[products/test] Created test product with ID: ${docRef.id}`);
      
      return res.json({ 
        success: true, 
        message: 'Created test product with Firebase Admin SDK',
        productId: docRef.id,
        sdk: 'Firebase Admin SDK'
      });
    }
    
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    res.json({ 
      success: true, 
      message: 'Firebase Admin SDK connection working',
      productsCount: docs.length,
      products: docs,
      sdk: 'Firebase Admin SDK'
    });
  } catch (e) {
    console.error('[products/test] Error:', e);
    res.status(500).json({ 
      success: false, 
      error: e.message,
      code: e.code 
    });
  }
});

// List products (with optional pagination)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, cursor } = req.query;
    
    console.log('[products] Attempting to fetch from Firebase Web SDK...');
    
    // Try to get real data from Firestore using Admin SDK
    const snap = await col.limit(Number(limit)).get();
    
    console.log(`[products] Found ${snap.docs.length} documents in collection`);
    
    if (snap.empty) {
      console.log('[products] Collection is empty, returning empty array');
      return res.json({ items: [], nextCursor: null });
    }
    
    const items = snap.docs.map((d) => {
      const data = d.data() || {};
      console.log(`[products] Processing document ${d.id}:`, data.name);
      return {
        id: d.id,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        thumbnail: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null,
        images: Array.isArray(data.images) ? data.images : [],
        imageCount: Array.isArray(data.images) ? data.images.length : 0,
        soldOut: data.soldOut === true,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
        active: data.active !== false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        description: data.description
      };
    });

    const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
    const nextCursor = lastDoc ? lastDoc.id : null;

    console.log(`[products] Returning ${items.length} products`);
    res.json({ items, nextCursor });
  } catch (e) {
    console.error('[products] Error fetching from Firebase Web SDK:', e?.code, e?.message || e);
    console.error('[products] Full error:', e);
    
    // Return empty array when Firebase fails
    res.json({ items: [], nextCursor: null });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error('[products/:id] Error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (admin) — supports JSON (no images) and multipart/form-data (with images)
async function createProductFromJson(req, res) {
  const data = req.body || {};
  const payload = {
    name: data.name,
    price: Number(data.price),
    originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
    category: data.category || null,
    images: Array.isArray(data.images) ? data.images : [],
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    soldOut: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: data.active !== false,
    description: data.description || null,
  };
  const ref = await col.add(payload);
  return res.status(201).json({ id: ref.id, ...payload });
}

async function createProductFromMultipart(req, res) {
  const data = JSON.parse(req.body.data || '{}');
  const files = req.files || [];
  const images = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);
  const payload = {
    name: data.name,
    price: Number(data.price),
    originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
    category: data.category || null,
    images: Array.isArray(images) ? images : [],
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    soldOut: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: data.active !== false,
    description: data.description || null,
  };
  const ref = await col.add(payload);
  return res.status(201).json({ id: ref.id, ...payload });
}

router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) {
      console.log('[products POST] Handling as JSON body');
      return await createProductFromJson(req, res);
    }
    console.log('[products POST] Handling as multipart/form-data');
    return upload.array('images', 6)(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        await createProductFromMultipart(req, res);
      } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message });
      }
    });
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
      soldOut: typeof data.soldOut === 'boolean' ? data.soldOut : (typeof existing.soldOut === 'boolean' ? existing.soldOut : false),
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

// Toggle Sold Out (admin) - lightweight PATCH for status only
router.patch('/:id/soldout', verifyFirebaseToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { soldOut } = req.body || {};
    if (typeof soldOut !== 'boolean') return res.status(400).json({ error: 'soldOut boolean required' });

    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });

    await docRef.update({ soldOut, updatedAt: new Date().toISOString() });
    const updated = (await docRef.get()).data();
    res.json({ id, ...updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
