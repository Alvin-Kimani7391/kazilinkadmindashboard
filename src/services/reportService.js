import { dataConnect } from "../dataconnect";
import {
  listUsers,
  listBookings,
  listReviews,
  listWorkSessions,
} from "@dataconnect/admin-generated";

const PERIOD_TO_DAYS = { daily: 1, weekly: 7, monthly: 30 };

const getCutoffDate = (period) => {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Builds the Reports page data for a given period: 'daily' | 'weekly' | 'monthly'.
 */
export const generateReport = async (period = "weekly") => {
  try {
    const cutoffDate = getCutoffDate(period);

    // Fetch collections via Firebase Data Connect
    const [usersRes, bookingsRes, reviewsRes, sessionsRes] = await Promise.all([
      listUsers(dataConnect),
      listBookings(dataConnect),
      listReviews(dataConnect),
      listWorkSessions(dataConnect),
    ]);

    const allUsers = usersRes.data?.users || [];
    const allBookings = bookingsRes.data?.bookings || [];
    const allReviews = reviewsRes.data?.reviews || [];
    const allSessions = sessionsRes.data?.workSessions || [];

    // Filter by timestamp thresholds
    const newUsers = allUsers.filter(
      (u) => u.createdAt && new Date(u.createdAt) >= cutoffDate
    );

    const periodBookings = allBookings.filter(
      (b) => b.startTime && new Date(b.startTime) >= cutoffDate
    );

    const completedBookings = periodBookings.filter(
      (b) => b.status === "completed"
    );

    const periodReviews = allReviews.filter(
      (r) => r.createdAt && new Date(r.createdAt) >= cutoffDate
    );

    const periodSessions = allSessions.filter(
      (s) => s.startTimestamp && new Date(s.startTimestamp) >= cutoffDate
    );

    // Calculate revenue (totalDurationSeconds * hourlyRate)
    const revenueSum = completedBookings.reduce((sum, b) => {
      const hours = (b.totalDurationSeconds || 0) / 3600;
      const rate = b.hourlyRate || 0;
      return sum + hours * rate;
    }, 0);

    // Calculate average rating for the period
    const averageRating =
      periodReviews.length > 0
        ? periodReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          periodReviews.length
        : 0;

    // Track active user IDs (clients + providers)
    const activeUserIds = new Set();
    periodBookings.forEach((b) => {
      if (b.client?.id) activeUserIds.add(b.client.id);
      if (b.provider?.id) activeUserIds.add(b.provider.id);
    });

    return {
      period,
      users: newUsers.length,
      jobs: periodBookings.length,
      completedJobs: completedBookings.length,
      revenue: `KES ${Math.round(revenueSum).toLocaleString()}`,
      activeUsers: activeUserIds.size,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: periodReviews.length,
      completedWorkSessions: periodSessions.length,
    };
  } catch (error) {
    console.error("reportService.generateReport error:", error);
    throw error;
  }
};

/**
 * Calculates rating distribution across all reviews.
 */
export const getRatingDistribution = async () => {
  try {
    const { data } = await listReviews(dataConnect);
    const reviews = data?.reviews || [];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((r) => {
      const rating = r.rating;
      if (counts[rating] !== undefined) counts[rating] += 1;
    });

    return counts;
  } catch (error) {
    console.error("reportService.getRatingDistribution error:", error);
    throw error;
  }
};