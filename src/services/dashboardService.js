import { db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore";

/**
 * Returns quick counts for the dashboard's stat cards.
 * Uses getCountFromServer so it doesn't pull full documents just to count them.
 */
export const getDashboardStats = async () => {
  try {
    const [usersSnap, bookingsSnap, reviewsSnap, notificationsSnap] = await Promise.all([
      getCountFromServer(collection(db, "User")),
      getCountFromServer(collection(db, "Booking")),
      getCountFromServer(collection(db, "Review")),
      getCountFromServer(collection(db, "Notification")),
    ]);

    return {
      users: usersSnap.data().count,
      bookings: bookingsSnap.data().count,
      reviews: reviewsSnap.data().count,
      notifications: notificationsSnap.data().count,
    };
  } catch (error) {
    console.error("dashboardService.getDashboardStats error:", error);
    throw error;
  }
};