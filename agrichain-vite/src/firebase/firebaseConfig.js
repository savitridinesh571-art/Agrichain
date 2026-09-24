import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDHtG6ZUa4YqgbOPclU3ZCr94ugKBYO54g",
    authDomain: "agrichain-a3e6a.firebaseapp.com",
    projectId: "agrichain-a3e6a",
    storageBucket: "agrichain-a3e6a.firebasestorage.app",
    messagingSenderId: "629437856772",
    appId: "1:629437856772:web:37e5300867c5a461500951"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);