import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
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

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence with better error handling
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence enabled');
  })
  .catch((error) => {
    console.warn('Failed to enable auth persistence:', error);
  });

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}

// Initialize Storage
export const storage = getStorage(app);

// Log Firebase initialization
console.log('Firebase initialized successfully');
