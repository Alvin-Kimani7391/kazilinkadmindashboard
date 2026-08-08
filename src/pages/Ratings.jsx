import { useState, useEffect, useMemo } from 'react';
import { Search, Star, ThumbsUp, MessageSquare, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { getReviews, deleteReview } from '../services/reviewService';
import { getBookings } from '../services/bookingService';
import { formatDate } from '../utils/formatters';

const Ratings = () => {
  const [reviews, setReviews] = useState([]);
  const [bookingsById, setBookingsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reviewData, bookingData] = await Promise.all([getReviews(), getBookings()]);
      setReviews(reviewData);
      const map = {};
      bookingData.forEach((b) => {
        map[b.id] = b;
      });
      setBookingsById(map);
    } catch (err) {
      console.error('Ratings load error:', err);
      setError('Could not load reviews from Firebase Data Connect.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Display names prioritize flattened review fields with booking doc fallbacks
  const enrichedReviews = useMemo(
    () =>
      reviews.map((r) => {
        const booking = bookingsById[r.bookingId];
        return {
          ...r,
          employer: r.client !== 'Unknown client' ? r.client : (booking?.client || 'Unknown client'),
          worker: r.provider || booking?.provider || 'Unknown provider',
        };
      }),
    [reviews, bookingsById]
  );

  const filteredRatings = enrichedReviews.filter((r) => {
    const matchesSearch =
      r.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.worker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === parseInt(filterRating, 10);
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Delete review error:', err);
      alert('Could not delete review. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Ratings</h1>
          <p className="text-gray-500">Manage reviews and ratings from employers</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center min-w-[110px]">
            <p className="text-xs text-gray-500">Average Rating</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="text-primary fill-primary" size={20} />
              <span className="text-xl font-bold text-navy">
                {loading ? '—' : averageRating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center min-w-[110px]">
            <p className="text-xs text-gray-500">Total Reviews</p>
            <p className="text-xl font-bold text-navy mt-1">{loading ? '—' : reviews.length}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h4 className="font-semibold text-navy mb-4">Rating Distribution</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star size={14} className="text-primary fill-primary" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 w-12 text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by employer, worker, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Ratings List */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
          <Loader2 size={20} className="animate-spin" />
          Loading reviews…
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < rating.rating ? 'text-primary fill-primary' : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-navy">{rating.rating}.0</span>
                    {rating.bookingId && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">Booking: {rating.bookingId}</span>
                      </>
                    )}
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 mt-2">{rating.comment}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <ThumbsUp size={14} className="text-gray-400" />
                      Employer: {rating.employer}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <MessageSquare size={14} className="text-gray-400" />
                      Worker: {rating.worker}
                    </span>
                    <span>{formatDate(rating.createdAt)}</span>
                  </div>
                </div>
                <button
                  disabled={deletingId === rating.id}
                  onClick={() => handleDelete(rating.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:underline whitespace-nowrap ml-4 disabled:opacity-50"
                >
                  {deletingId === rating.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredRatings.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No reviews match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ratings;