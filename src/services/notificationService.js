import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const notificationsRef = collection(db, "Notification");

/**
 * Subscribes to real-time notifications, newest first.
 * @param {(notifications: Array) => void} callback
 * @param {string} [recipientId] optional filter to a single recipient
 * @returns {() => void} unsubscribe function
 */
export const getNotifications = (callback, recipientId = null) => {
  try {
    const constraints = [orderBy("createdAt", "desc")];
    if (recipientId) constraints.unshift(where("recipientId", "==", recipientId));

    const q = query(notificationsRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifications = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(notifications);
      },
      (error) => {
        console.error("notificationService.getNotifications snapshot error:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("notificationService.getNotifications error:", error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, "Notification", notificationId), { isRead: true });
    return true;
  } catch (error) {
    console.error("notificationService.markAsRead error:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, "Notification", notificationId));
    return true;
  } catch (error) {
    console.error("notificationService.deleteNotification error:", error);
    throw error;
  }
};