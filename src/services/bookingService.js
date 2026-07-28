import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const bookingsRef = collection(db, "Booking");

/**
 * Fetch all bookings, most recently started first.
 */
export const getBookings = async () => {
  try {
    const q = query(bookingsRef, orderBy("startTime", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("bookingService.getBookings error:", error);
    throw error;
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const snap = await getDoc(doc(db, "Booking", bookingId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("bookingService.getBookingById error:", error);
    throw error;
  }
};

/**
 * Generic update for any Booking fields
 * (client, provider, category, times, serviceLocation, etc).
 */
export const updateBooking = async (bookingId, updates) => {
  try {
    await updateDoc(doc(db, "Booking", bookingId), updates);
    return { id: bookingId, ...updates };
  } catch (error) {
    console.error("bookingService.updateBooking error:", error);
    throw error;
  }
};

/**
 * Convenience wrapper for just changing a booking's status
 * (e.g. 'open' -> 'in_progress' -> 'completed' / 'cancelled').
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    await updateDoc(doc(db, "Booking", bookingId), { status });
    return { id: bookingId, status };
  } catch (error) {
    console.error("bookingService.updateBookingStatus error:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, "Booking", bookingId));
    return true;
  } catch (error) {
    console.error("bookingService.deleteBooking error:", error);
    throw error;
  }
};