import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHtG6ZUa4YqgbOPclU3ZCr94ugKBYO54g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrichain-a3e6a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrichain-a3e6a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrichain-a3e6a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "629437856772",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:629437856772:web:37e5300867c5a461500951",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YK29DZ9B69"
};

// Initialize Firebase instance without duplicating initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug("Firebase Analytics is not supported in this environment:", err);
  });
}

export default app;
