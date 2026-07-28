import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Logs in an admin using email/password.
 * Returns the Firebase auth user plus their Firestore profile (if it exists).
 */
export const login = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "User", credential.user.uid));

    return {
      uid: credential.user.uid,
      email: credential.user.email,
      profile: userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null,
    };
  } catch (error) {
    console.error("authService.login error:", error);
    throw error;
  }
};

/**
 * Logs the current user out.
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("authService.logout error:", error);
    throw error;
  }
};

/**
 * Returns the currently signed-in Firebase user (or null), synchronously
 * from the SDK's cached state. Use onAuthChange if you need to react to
 * the auth state resolving on first load.
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribes to auth state changes.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};