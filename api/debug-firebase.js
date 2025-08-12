module.exports = async function handler(req, res) {
  const info = { ok: true };
  try {
    const projectIdEnv = process.env.FIREBASE_PROJECT_ID || null;
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || null;
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 || null;

    info.env = {
      hasProjectId: !!projectIdEnv,
      hasJson: !!rawJson,
      hasB64: !!b64,
      node: process.version,
    };

    let jsonStr = rawJson;
    if (!jsonStr && b64) {
      try {
        jsonStr = Buffer.from(b64, 'base64').toString('utf8');
      } catch (e) {
        info.decode = { ok: false, error: e.message };
      }
    }

    if (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        const privateKey = typeof parsed.private_key === 'string' ? parsed.private_key : '';
        info.parsed = {
          hasProjectIdField: !!parsed.project_id,
          projectIdMatchesEnv: projectIdEnv ? parsed.project_id === projectIdEnv : null,
          hasClientEmail: !!parsed.client_email,
          hasPrivateKey: !!privateKey,
          privateKeyLength: privateKey ? privateKey.length : 0,
          privateKeyContainsEscapedNewlines: privateKey.includes('\\n'),
          privateKeyContainsRealNewlines: privateKey.includes('\n'),
        };
      } catch (e) {
        info.parse = { ok: false, error: e.message };
      }
    } else {
      info.parse = { ok: false, error: 'No JSON available from envs' };
    }
  } catch (e) {
    info.ok = false;
    info.error = e.message;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(info);
}
