import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const categoriesRef = collection(db, "ServiceCategory");

export const getCategories = async () => {
  try {
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("serviceCategoryService.getCategories error:", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(categoriesRef, categoryData);
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("serviceCategoryService.createCategory error:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId, updates) => {
  try {
    await updateDoc(doc(db, "ServiceCategory", categoryId), updates);
    return { id: categoryId, ...updates };
  } catch (error) {
    console.error("serviceCategoryService.updateCategory error:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "ServiceCategory", categoryId));
    return true;
  } catch (error) {
    console.error("serviceCategoryService.deleteCategory error:", error);
    throw error;
  }
};