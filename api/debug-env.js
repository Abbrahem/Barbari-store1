module.exports = async function handler(req, res) {
  try {
    const present = {
      FIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_SERVICE_ACCOUNT_JSON: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
      FIREBASE_SERVICE_ACCOUNT_JSON_BASE64: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64),
      FIREBASE_STORAGE_BUCKET: Boolean(process.env.FIREBASE_STORAGE_BUCKET),
      NODE_VERSION: process.version,
    };
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok: true, present });
  } catch (e) {
    res.status(200).json({ ok: false, error: e.message });
  }
}
