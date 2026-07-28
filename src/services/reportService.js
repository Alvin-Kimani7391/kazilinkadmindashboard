import { db } from "../firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

const usersRef = collection(db, "User");
const bookingsRef = collection(db, "Booking");
const reviewsRef = collection(db, "Review");
const sessionsRef = collection(db, "WorkSession");

const PERIOD_TO_DAYS = { daily: 1, weekly: 7, monthly: 30 };

const startOfPeriod = (period) => {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return Timestamp.fromDate(date);
};

/**
 * Builds the Reports page data for a given period: 'daily' | 'weekly' | 'monthly'.
 * Mirrors the shape the Reports.jsx UI expects: { users, jobs, revenue, activeUsers }
 * plus a ratings breakdown and total completed work sessions for the period.
 */
export const generateReport = async (period = "weekly") => {
  try {
    const since = startOfPeriod(period);

    const [newUsersSnap, newBookingsSnap, completedBookingsSnap, reviewsSnap, sessionsSnap] =
      await Promise.all([
        getDocs(query(usersRef, where("createdAt", ">=", since))),
        getDocs(query(bookingsRef, where("startTime", ">=", since))),
        getDocs(
          query(
            bookingsRef,
            where("status", "==", "completed"),
            where("startTime", ">=", since)
          )
        ),
        getDocs(query(reviewsRef, where("createdAt", ">=", since))),
        getDocs(query(sessionsRef, where("startTimestamp", ">=", since))),
      ]);

    const completedBookings = completedBookingsSnap.docs.map((d) => d.data());
    const reviews = reviewsSnap.docs.map((d) => d.data());

    // Revenue isn't an explicit field on Booking in this schema, so it's derived
    // from totalDurationSeconds x hourlyRate where available.
    const revenue = completedBookings.reduce((sum, booking) => {
      const hours = (booking.totalDurationSeconds || 0) / 3600;
      const rate = booking.hourlyRate || 0;
      return sum + hours * rate;
    }, 0);

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    // Unique clients+providers active in the period's bookings, as a stand-in
    // for "active users" since there's no dedicated activity/session log for users.
    const activeUserIds = new Set();
    newBookingsSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.clientId) activeUserIds.add(data.clientId);
      if (data.providerId) activeUserIds.add(data.providerId);
    });

    return {
      period,
      users: newUsersSnap.size,
      jobs: newBookingsSnap.size,
      completedJobs: completedBookings.length,
      revenue: `KES ${Math.round(revenue).toLocaleString()}`,
      activeUsers: activeUserIds.size,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      completedWorkSessions: sessionsSnap.size,
    };
  } catch (error) {
    console.error("reportService.generateReport error:", error);
    throw error;
  }
};

/**
 * Rating distribution (count of 1-5 star reviews) for the "Rating Distribution" chart.
 */
export const getRatingDistribution = async () => {
  try {
    const snapshot = await getDocs(reviewsRef);
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    snapshot.docs.forEach((docSnap) => {
      const rating = docSnap.data().rating;
      if (counts[rating] !== undefined) counts[rating] += 1;
    });
    return counts;
  } catch (error) {
    console.error("reportService.getRatingDistribution error:", error);
    throw error;
  }
};