const { firestore } = require('./_lib/firebaseAdmin.js');
const { requireAuth } = require('./_lib/auth.js');
const { handleCors, setCors } = require('./_lib/cors.js');

const productsCol = firestore.collection('products');
const ordersCol = firestore.collection('orders');

async function readBody(req) {
  let data = req.body;
  if (data && typeof data === 'object') return data;
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return {}; }
  }
  // Try to accumulate raw body if framework didn't parse
  return {};
}

function parsePath(req) {
  // req.url like /api/products/123/soldout
  const base = 'http://localhost';
  const url = new URL(req.url, base);
  const parts = url.pathname.replace(/^\/?api\/?/, '').split('/').filter(Boolean);
  return { parts, query: Object.fromEntries(url.searchParams) };
}

async function listProducts(req, res, query) {
  try {
    const limit = Number(query.limit || 20);
    const snap = await productsCol.limit(limit).get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ items, nextCursor: snap.docs.at(-1)?.id || null });
  } catch (e) {
    console.error('products list error', e);
    return res.status(500).json({ error: e.message });
  }
}

async function createProduct(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    let data = await readBody(req);
    const priceNum = Number(data.price);
    if (!data.name || !Number.isFinite(priceNum) || !data.category) {
      return res.status(400).json({ error: 'Missing required fields: name, price, category' });
    }
    if (!Array.isArray(data.sizes) || !Array.isArray(data.colors)) {
      return res.status(400).json({ error: 'Invalid sizes or colors (must be arrays)' });
    }
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
    if (data.originalPrice !== undefined && data.originalPrice !== null && data.originalPrice !== '') {
      payload.originalPrice = Number(data.originalPrice);
    }
    Object.keys(payload).forEach((k) => { if (payload[k] === undefined) delete payload[k]; });
    const ref = await productsCol.add(payload);
    return res.status(201).json({ id: ref.id, ...payload });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function getProduct(req, res, id) {
  try {
    const doc = await productsCol.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function deleteProduct(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await productsCol.doc(id).delete();
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function toggleSoldOut(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    let body = await readBody(req);
    if (typeof body.soldOut !== 'boolean') {
      return res.status(400).json({ error: 'soldOut must be boolean' });
    }
    await productsCol.doc(id).set({ soldOut: body.soldOut, updatedAt: new Date().toISOString() }, { merge: true });
    return res.status(200).json({ id, soldOut: body.soldOut });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function listOrders(req, res, query) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    const limit = Number(query.limit || 50);
    const snap = await ordersCol.orderBy('createdAt', 'desc').limit(limit).get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function createOrder(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    let data = await readBody(req);
    if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Invalid JSON body' });
    const payload = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const ref = await ordersCol.add(payload);
    return res.status(201).json({ id: ref.id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function getOrder(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    const doc = await ordersCol.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function deleteOrder(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await ordersCol.doc(id).delete();
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCors(res, req.headers.origin || '');
  res.setHeader('Cache-Control', 'no-store');

  const { parts, query } = parsePath(req);
  const [resource, id, sub] = parts; // e.g., ['products', 'abc', 'soldout']

  try {
    if (!resource) {
      return res.status(200).json({ ok: true, api: 'root' });
    }

    // PRODUCTS
    if (resource === 'products') {
      if (!id) {
        if (req.method === 'GET') return listProducts(req, res, query);
        if (req.method === 'POST') return createProduct(req, res);
      } else {
        if (!sub) {
          if (req.method === 'GET') return getProduct(req, res, id);
          if (req.method === 'DELETE') return deleteProduct(req, res, id);
        } else if (sub === 'soldout' && req.method === 'PATCH') {
          return toggleSoldOut(req, res, id);
        }
      }
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ORDERS
    if (resource === 'orders') {
      if (!id) {
        if (req.method === 'GET') return listOrders(req, res, query);
        if (req.method === 'POST') return createOrder(req, res);
      } else {
        if (req.method === 'GET') return getOrder(req, res, id);
        if (req.method === 'DELETE') return deleteOrder(req, res, id);
      }
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // HEALTH/DEBUG minimal fallbacks
    if (resource === 'health') {
      return res.status(200).json({ ok: true, ts: Date.now() });
    }

    return res.status(404).json({ error: 'Not Found' });
  } catch (e) {
    console.error('router error', e);
    return res.status(500).json({ error: e.message });
  }
};
