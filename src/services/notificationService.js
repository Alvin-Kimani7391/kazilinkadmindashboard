import { dataConnect } from "../dataconnect";
import {
  listNotifications,
  markNotificationRead,
  deleteNotification as deleteNotificationMutation,
} from "@dataconnect/admin-generated";

const flattenNotification = (n) => ({
  id: n.id,
  title: n.title || "",
  message: n.message || "",
  isRead: Boolean(n.isRead),
  createdAt: n.createdAt,
  recipientId: n.recipient?.id,
  recipient: n.recipient?.name || null,
});

const POLL_INTERVAL_MS = 15000;

/**
 * Data Connect polling implementation.
 * Returns an unsubscribe function and passes an optional `refetch` trigger to the callback runner.
 * @param {(notifications: Array) => void} callback
 * @param {string} [recipientId] optional client-side filter
 * @returns {() => void} unsubscribe function
 */
export const getNotifications = (callback, recipientId = null) => {
  let cancelled = false;

  const fetchAndEmit = async () => {
    try {
      const { data } = await listNotifications(dataConnect);
      if (cancelled) return;

      let notifications = (data?.notifications || []).map(flattenNotification);
      
      // Sort newest first
      notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      if (recipientId) {
        notifications = notifications.filter((n) => n.recipientId === recipientId);
      }

      callback(notifications);
    } catch (error) {
      console.error("notificationService.getNotifications poll error:", error);
    }
  };

  fetchAndEmit();
  const intervalId = setInterval(fetchAndEmit, POLL_INTERVAL_MS);

  return () => {
    cancelled = true;
    clearInterval(intervalId);
  };
};

export const markAsRead = async (notificationId) => {
  try {
    await markNotificationRead(dataConnect, { id: notificationId });
    return true;
  } catch (error) {
    console.error("notificationService.markAsRead error:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await deleteNotificationMutation(dataConnect, { id: notificationId });
    return true;
  } catch (error) {
    console.error("notificationService.deleteNotification error:", error);
    throw error;
  }
};