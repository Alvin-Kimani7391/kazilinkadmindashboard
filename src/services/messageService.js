import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const messagesRef = collection(db, "Message");
const conversationsRef = collection(db, "Conversation");

/**
 * Subscribes to real-time messages for a conversation, oldest first.
 * @param {string} conversationId
 * @param {(messages: Array) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const getMessages = (conversationId, callback) => {
  try {
    const q = query(
      messagesRef,
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(messages);
      },
      (error) => {
        console.error("messageService.getMessages snapshot error:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("messageService.getMessages error:", error);
    throw error;
  }
};

/**
 * Sends a message and updates the parent conversation's preview/timestamp.
 */
export const sendMessage = async (conversationId, senderId, content) => {
  try {
    const docRef = await addDoc(messagesRef, {
      conversationId,
      senderId,
      content,
      timestamp: serverTimestamp(),
    });

    await updateDoc(doc(conversationsRef, conversationId), {
      lastMessagePreview: content,
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, conversationId, senderId, content };
  } catch (error) {
    console.error("messageService.sendMessage error:", error);
    throw error;
  }
};