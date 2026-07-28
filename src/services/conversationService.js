import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

const conversationsRef = collection(db, "Conversation");

/**
 * Fetch all conversations, most recently updated first.
 */
export const getConversations = async () => {
  try {
    const q = query(conversationsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("conversationService.getConversations error:", error);
    throw error;
  }
};

export const getConversationById = async (conversationId) => {
  try {
    const snap = await getDoc(doc(db, "Conversation", conversationId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("conversationService.getConversationById error:", error);
    throw error;
  }
};