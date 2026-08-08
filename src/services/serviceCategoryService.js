import { dataConnect } from "../dataconnect";
import * as generatedSDK from "@dataconnect/admin-generated";

// Safely destructure generated functions
const {
  listServiceCategories,
  createServiceCategory: createCategoryMutation,
  updateServiceCategory: updateCategoryMutation,
  deleteServiceCategory: deleteCategoryMutation,
} = generatedSDK;

/**
 * Fetch all service categories.
 */
export const getCategories = async () => {
  try {
    if (!listServiceCategories) {
      console.warn("listServiceCategories GQL query is not available.");
      return [];
    }
    const { data } = await listServiceCategories(dataConnect);
    return data?.serviceCategories || [];
  } catch (error) {
    console.error("serviceCategoryService.getCategories error:", error);
    throw error;
  }
};

/**
 * Create a new service category.
 */
export const createCategory = async (categoryData) => {
  try {
    if (!createCategoryMutation) {
      throw new Error("createServiceCategory mutation is not defined in GraphQL files.");
    }
    const { data } = await createCategoryMutation(dataConnect, categoryData);
    const generatedId =
      data?.serviceCategory_insert?.id ||
      data?.serviceCategory?.id ||
      crypto.randomUUID();
    return { id: generatedId, ...categoryData };
  } catch (error) {
    console.error("serviceCategoryService.createCategory error:", error);
    throw error;
  }
};

/**
 * Update an existing service category name.
 */
export const updateCategory = async (categoryId, updates) => {
  try {
    if (!updateCategoryMutation) {
      throw new Error("updateServiceCategory mutation is not defined in GraphQL files.");
    }
    await updateCategoryMutation(dataConnect, { id: categoryId, ...updates });
    return { id: categoryId, ...updates };
  } catch (error) {
    console.error("serviceCategoryService.updateCategory error:", error);
    throw error;
  }
};

/**
 * Delete a service category.
 */
export const deleteCategory = async (categoryId) => {
  try {
    if (!deleteCategoryMutation) {
      throw new Error("deleteServiceCategory mutation is not defined in GraphQL files.");
    }
    await deleteCategoryMutation(dataConnect, { id: categoryId });
    return true;
  } catch (error) {
    console.error("serviceCategoryService.deleteCategory error:", error);
    throw error;
  }
};