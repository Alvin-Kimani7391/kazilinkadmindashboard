import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const usersRef = collection(db, "User");

/**
 * Fetch all users, newest first (falls back gracefully if no createdAt field).
 */
export const getUsers = async () => {
  try {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("userService.getUsers error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const snap = await getDoc(doc(db, "User", userId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("userService.getUserById error:", error);
    throw error;
  }
};

/**
 * Creates a User document.
 * @param {{ name, email, role, phoneNumber, profilePicture, bio, hourlyRate }} userData
 */
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(usersRef, userData);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error("userService.createUser error:", error);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    await updateDoc(doc(db, "User", userId), updates);
    return { id: userId, ...updates };
  } catch (error) {
    console.error("userService.updateUser error:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "User", userId));
    return true;
  } catch (error) {
    console.error("userService.deleteUser error:", error);
    throw error;
  }
};