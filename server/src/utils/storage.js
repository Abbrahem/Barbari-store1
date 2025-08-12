import { bucket } from '../firebaseAdmin.js';
import path from 'path';

export async function uploadBufferToStorage(buffer, filename, mimetype) {
  const dest = `uploads/${Date.now()}-${filename}`;
  const file = bucket.file(dest);
  await file.save(buffer, {
    contentType: mimetype,
    public: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${dest}`;
  return { publicUrl, path: dest };
}

export async function deleteFromStorage(filePath) {
  if (!filePath) return;
  try {
    await bucket.file(filePath).delete({ ignoreNotFound: true });
  } catch (e) {
    console.warn('deleteFromStorage warning:', e?.message || e);
  }
}
