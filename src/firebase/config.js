import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAq2Tlp8Wy-tjleciZZZCT7cfvRaov4AMY",
  authDomain: "shevoo-store.firebaseapp.com",
  projectId: "shevoo-store",
  storageBucket: "shevoo-store.appspot.com",
  messagingSenderId: "301845318717",
  appId: "1:301845318717:web:7ba290a077650cb9e26e54"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Persist auth state across reloads
setPersistence(auth, browserLocalPersistence).catch(() => {
  // ignore persistence errors silently
});

// Expose auth in development for console debugging
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.auth = auth;
}
export const storage = getStorage(app);
