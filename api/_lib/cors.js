'use strict';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_ORIGIN || ''
].filter(Boolean);

function setCors(res, origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '*';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '600');
}

function handleCors(req, res) {
  setCors(res, req.headers.origin || '');
  if (req.method === 'OPTIONS') {
    // Preflight
    res.status(204).end();
    return true; // handled
  }
  return false;
}

module.exports = { handleCors, setCors };
