import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
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

// Initialize Firestore with offline persistence disabled to avoid auth issues
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence but don't fail if it doesn't work
setPersistence(auth, browserLocalPersistence).catch(() => {
  console.log('Auth persistence not available');
});

// Skip anonymous auth to avoid 400 Bad Request errors
// Firebase project may not have anonymous auth enabled

export const storage = getStorage(app);
