import { dataConnect } from "../dataconnect";
import {
  listUsers,
  getUser,
  createUser as createUserMutation,
  updateUser as updateUserMutation,
  deleteUser as deleteUserMutation,
} from "@dataconnect/admin-generated";

/**
 * Fetch all users.
 */
export const getUsers = async () => {
  try {
    const { data } = await listUsers(dataConnect);
    return data?.users || [];
  } catch (error) {
    console.error("userService.getUsers error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const { data } = await getUser(dataConnect, { id: userId });
    return data?.user || null;
  } catch (error) {
    console.error("userService.getUserById error:", error);
    throw error;
  }
};

/**
 * Creates a User record with all backend-supported fields.
 */
export const createUser = async (userData) => {
  try {
    const { data } = await createUserMutation(dataConnect, userData);
    const generatedId = data?.user_insert?.id || data?.user?.id || crypto.randomUUID();
    return { id: generatedId, ...userData };
  } catch (error) {
    console.error("userService.createUser error:", error);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    await updateUserMutation(dataConnect, { id: userId, ...updates });
    return { id: userId, ...updates };
  } catch (error) {
    console.error("userService.updateUser error:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteUserMutation(dataConnect, { id: userId });
    return true;
  } catch (error) {
    console.error("userService.deleteUser error:", error);
    throw error;
  }
};