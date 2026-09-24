import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "./firebaseConfig";

// Register user
export const registerUser = async (email, password, userData) => {
    try {
        // Create Firebase Authentication account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Create Firestore user profile
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return user;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// Logout
export const logoutUser = async () => {
    await signOut(auth);
};