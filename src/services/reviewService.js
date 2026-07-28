import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const reviewsRef = collection(db, "Review");

/**
 * Fetch all reviews, newest first.
 */
export const getReviews = async () => {
  try {
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("reviewService.getReviews error:", error);
    throw error;
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const snap = await getDoc(doc(db, "Review", reviewId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("reviewService.getReviewById error:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, "Review", reviewId));
    return true;
  } catch (error) {
    console.error("reviewService.deleteReview error:", error);
    throw error;
  }
};