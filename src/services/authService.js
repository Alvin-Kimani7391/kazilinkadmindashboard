// src/services/authService.js
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Logs in an admin using Firebase Email/Password Auth.
 * Attempts to retrieve profile from Firestore 'User' or 'users' collection.
 */
export const login = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Check 'User' collection first, fallback to 'users'
    let profileData = null;
    let userDoc = await getDoc(doc(db, "User", uid));

    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "users", uid));
    }

    if (userDoc.exists()) {
      profileData = { id: userDoc.id, ...userDoc.data() };
    } else {
      profileData = {
        id: uid,
        email: credential.user.email,
        name: credential.user.displayName || email.split("@")[0],
        role: "admin",
      };
    }

    return {
      uid,
      email: credential.user.email,
      profile: profileData,
    };
  } catch (error) {
    console.error("authService.login error:", error);
    throw error;
  }
};

/**
 * Logs the current user out of Firebase Auth and clears local storage.
 */
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("adminUser");
    return true;
  } catch (error) {
    console.error("authService.logout error:", error);
    throw error;
  }
};

/**
 * Returns the currently signed-in Firebase user (synchronously from cache).
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribes to Firebase Auth state changes.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};