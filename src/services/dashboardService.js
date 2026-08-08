import { dataConnect } from "../dataconnect";
import {
  listUsers,
  listBookings,
  listReviews,
  listNotifications,
  listServiceCategories,
} from "../dataconnect-generated";
import { timeAgo } from "../utils/formatters";

const ICONS = {
  open: '📋',
  in_progress: '🛠️',
  completed: '✅',
  cancelled: '❌',
};

/**
 * Returns basic entity counts for dashboard metrics.
 */
export const getDashboardStats = async () => {
  try {
    const [usersRes, bookingsRes, reviewsRes, notificationsRes, categoriesRes] = await Promise.all([
      listUsers(dataConnect).catch(() => null),
      listBookings(dataConnect).catch(() => null),
      listReviews(dataConnect).catch(() => null),
      listNotifications(dataConnect).catch(() => null),
      listServiceCategories(dataConnect).catch(() => null),
    ]);

    return {
      users: usersRes?.data?.users?.length || 0,
      bookings: bookingsRes?.data?.bookings?.length || 0,
      reviews: reviewsRes?.data?.reviews?.length || 0,
      notifications: notificationsRes?.data?.notifications?.length || 0,
      categories: categoriesRes?.data?.serviceCategories?.length || 0,
    };
  } catch (error) {
    console.error("dashboardService.getDashboardStats error:", error);
    return { users: 0, bookings: 0, reviews: 0, notifications: 0, categories: 0 };
  }
};

/**
 * Aggregates complete summary data for the Admin Dashboard view.
 */
export const getDashboardSummary = async () => {
  try {
    const [usersRes, bookingsRes, reviewsRes, notificationsRes, categoriesRes] = await Promise.all([
      listUsers(dataConnect).catch(() => null),
      listBookings(dataConnect).catch(() => null),
      listReviews(dataConnect).catch(() => null),
      listNotifications(dataConnect).catch(() => null),
      listServiceCategories(dataConnect).catch(() => null),
    ]);

    const users = usersRes?.data?.users || [];
    const bookings = bookingsRes?.data?.bookings || [];
    const reviews = reviewsRes?.data?.reviews || [];
    const notifications = notificationsRes?.data?.notifications || [];
    const categories = categoriesRes?.data?.serviceCategories || [];

    // 1. Build rate map by provider ID
    const rateByProviderId = {};
    users.forEach((u) => {
      if (u.id) rateByProviderId[u.id] = u.hourlyRate || 0;
    });

    // 2. Calculate Revenue from completed bookings
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const totalRevenue = completedBookings.reduce((sum, b) => {
      const hours = (b.totalDurationSeconds || 0) / 3600;
      const rate = rateByProviderId[b.providerId || b.provider?.id] ?? 0;
      return sum + hours * rate;
    }, 0);

    // 3. Compute overall review average
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

    // 4. Format Recent Activity (Top 4 recent bookings)
    const sortedBookings = [...bookings].sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime) : new Date(0);
      const bTime = b.startTime ? new Date(b.startTime) : new Date(0);
      return bTime - aTime;
    });

    const recentActivity = sortedBookings.slice(0, 4).map((b) => ({
      id: b.id,
      user: b.client?.name || "Client",
      action:
        b.status === "completed"
          ? `Completed a ${b.category?.name || "job"} booking`
          : b.status === "in_progress"
          ? `${b.category?.name || "Job"} in progress with ${b.provider?.name || "provider"}`
          : b.status === "cancelled"
          ? `Cancelled a ${b.category?.name || "job"} booking`
          : `Posted a ${b.category?.name || "job"} booking`,
      time: timeAgo(b.startTime),
      icon: ICONS[b.status] || "📋",
    }));

    // 5. Compute Top Workers ranking
    const bookingById = {};
    bookings.forEach((b) => {
      bookingById[b.id] = b;
    });

    const providerStats = {};
    completedBookings.forEach((b) => {
      const provId = b.providerId || b.provider?.id;
      if (!provId) return;
      if (!providerStats[provId]) {
        providerStats[provId] = {
          name: b.provider?.name || "Provider",
          jobs: 0,
          ratings: [],
        };
      }
      providerStats[provId].jobs += 1;
    });

    reviews.forEach((r) => {
      const booking = bookingById[r.bookingId];
      const provId = booking?.providerId || booking?.provider?.id;
      if (provId && providerStats[provId]) {
        providerStats[provId].ratings.push(r.rating || 0);
      }
    });

    const topWorkers = Object.values(providerStats)
      .map((p) => ({
        name: p.name,
        jobs: p.jobs,
        rating: p.ratings.length
          ? (p.ratings.reduce((s, r) => s + r, 0) / p.ratings.length).toFixed(1)
          : "—",
      }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 3);

    return {
      counts: {
        users: users.length,
        bookings: bookings.length,
        categories: categories.length,
        reviews: reviews.length,
        notifications: notifications.length,
      },
      revenue: totalRevenue,
      averageRating: avgRating,
      recentActivity,
      topWorkers,
    };
  } catch (error) {
    console.error("dashboardService.getDashboardSummary error:", error);
    return {
      counts: { users: 0, bookings: 0, categories: 0, reviews: 0, notifications: 0 },
      revenue: 0,
      averageRating: 0,
      recentActivity: [],
      topWorkers: [],
    };
  }
};