import { auth } from '../firebase/config';

// Base API URL
let API_BASE = process.env.REACT_APP_API_BASE || '/api';
// If running in production and someone accidentally set a localhost API, fall back to same-origin /api
if (process.env.NODE_ENV === 'production') {
  const raw = process.env.REACT_APP_API_BASE || '';
  if (raw.includes('localhost') || raw.includes('127.0.0.1')) {
    API_BASE = '/api';
  }
}

async function withAuthHeaders(options = {}, { forceRefresh = false } = {}) {
  const user = auth.currentUser;
  if (!user) return options;
  const token = await user.getIdToken(forceRefresh);
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

async function request(path, { requireAuth = false, retryOn401 = true, ...options } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  let opts = options;
  // Default to no-store to avoid stale data in all environments
  opts = {
    cache: 'no-store',
    ...opts,
  };
  // Keep any provided headers; avoid sending Cache-Control/Pragma from client to prevent CORS issues
  opts.headers = {
    ...(opts.headers || {}),
  };
  if (requireAuth) opts = await withAuthHeaders(opts, { forceRefresh: true });

  let res = await fetch(url, opts);
  if (res.status === 401 && requireAuth && retryOn401 && auth.currentUser) {
    // force refresh token and retry once
    try {
      await auth.currentUser.getIdToken(true);
      const retryOpts = await withAuthHeaders(options, { forceRefresh: true });
      res = await fetch(url, retryOpts);
    } catch {}
  }
  return res;
}

export const api = {
  get: (path, opts) => request(path, { method: 'GET', ...(opts || {}) }),
  post: (path, body, opts) => request(path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...(opts || {}) }),
  put: (path, body, opts) => request(path, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...(opts || {}) }),
  patch: (path, body, opts) => request(path, { method: 'PATCH', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...(opts || {}) }),
  del: (path, opts) => request(path, { method: 'DELETE', ...(opts || {}) }),
  // Form/multipart helpers (pass FormData directly)
  postForm: (path, formData, opts) => request(path, { method: 'POST', body: formData, ...(opts || {}) }),
  putForm: (path, formData, opts) => request(path, { method: 'PUT', body: formData, ...(opts || {}) }),
};
