import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const sessionsRef = collection(db, "WorkSession");
const bookingsRef = collection(db, "Booking");

/**
 * Fetch all work sessions, most recently started first.
 */
export const getWorkSessions = async () => {
  try {
    const q = query(sessionsRef, orderBy("startTimestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("workSessionService.getWorkSessions error:", error);
    throw error;
  }
};

/**
 * Fetch all work sessions belonging to a specific provider.
 * WorkSession only stores bookingId, so we first find that provider's
 * bookings, then match sessions to those booking IDs.
 * Firestore 'in' queries are capped at 10 values, so we batch if needed.
 */
export const getProviderSessions = async (providerId) => {
  try {
    const bookingsQuery = query(bookingsRef, where("providerId", "==", providerId));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookingIds = bookingsSnapshot.docs.map((docSnap) => docSnap.id);

    if (bookingIds.length === 0) return [];

    const batches = [];
    for (let i = 0; i < bookingIds.length; i += 10) {
      batches.push(bookingIds.slice(i, i + 10));
    }

    const results = await Promise.all(
      batches.map(async (batch) => {
        const sessionsQuery = query(sessionsRef, where("bookingId", "in", batch));
        const snapshot = await getDocs(sessionsQuery);
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      })
    );

    return results.flat();
  } catch (error) {
    console.error("workSessionService.getProviderSessions error:", error);
    throw error;
  }
};