import { dataConnect } from "../dataconnect";
import {
  listBookings,
  getBooking,
  updateBookingStatus as updateBookingStatusMutation,
  deleteBooking as deleteBookingMutation,
} from "@dataconnect/admin-generated";

/**
 * Data Connect returns client/provider/category as nested objects.
 * We flatten the response here and normalize `status` to lowercase for frontend components.
 */
const flattenBooking = (b) => ({
  id: b.id,
  status: b.status ? b.status.toLowerCase() : "open",
  startTime: b.startTime,
  endTime: b.endTime,
  totalDurationSeconds: b.totalDurationSeconds,
  serviceLocation: b.serviceLocation,
  client: b.client?.name || "Unknown",
  clientId: b.client?.id,
  provider: b.provider?.name || null,
  providerId: b.provider?.id || null,
  providerHourlyRate: b.provider?.hourlyRate ?? 0,
  category: b.category?.name || null,
  categoryId: b.category?.id || null,
});

/**
 * Fetch all bookings.
 * Note: sorting is done client-side since the ListBookings query doesn't
 * declare an orderBy — add one in queries.gql if you want server-side sort.
 */
export const getBookings = async () => {
  try {
    const { data } = await listBookings(dataConnect);
    return (data?.bookings || [])
      .map(flattenBooking)
      .sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
  } catch (error) {
    console.error("bookingService.getBookings error:", error);
    throw error;
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const { data } = await getBooking(dataConnect, { id: bookingId });
    return data?.booking ? flattenBooking(data.booking) : null;
  } catch (error) {
    console.error("bookingService.getBookingById error:", error);
    throw error;
  }
};

/**
 * Convenience wrapper for updating status.
 * Accepts lowercase string from client and converts to Uppercase Enum format required by GraphQL schema.
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const formattedStatus = status.toUpperCase();
    await updateBookingStatusMutation(dataConnect, {
      id: bookingId,
      status: formattedStatus,
    });
    return { id: bookingId, status: status.toLowerCase() };
  } catch (error) {
    console.error("bookingService.updateBookingStatus error:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    await deleteBookingMutation(dataConnect, { id: bookingId });
    return true;
  } catch (error) {
    console.error("bookingService.deleteBooking error:", error);
    throw error;
  }
};