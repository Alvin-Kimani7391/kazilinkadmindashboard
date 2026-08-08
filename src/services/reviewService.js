import { dataConnect } from "../dataconnect";
import { listReviews, deleteReview as deleteReviewMutation } from "@dataconnect/admin-generated";

const flattenReview = (r) => ({
  id: r.id,
  rating: r.rating ?? 0,
  comment: r.comment || "",
  createdAt: r.createdAt,
  bookingId: r.booking?.id || null,
  client: r.client?.name || r.booking?.client?.name || "Unknown client",
  category: r.booking?.category?.name || null,
  provider: r.booking?.provider?.name || null,
});

/**
 * Fetch all reviews sorted newest first.
 */
export const getReviews = async () => {
  try {
    const { data } = await listReviews(dataConnect);
    return (data?.reviews || [])
      .map(flattenReview)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (error) {
    console.error("reviewService.getReviews error:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await deleteReviewMutation(dataConnect, { id: reviewId });
    return true;
  } catch (error) {
    console.error("reviewService.deleteReview error:", error);
    throw error;
  }
};