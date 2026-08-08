import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, CheckCircle, Plus, Briefcase, Loader2, AlertCircle, MapPin } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getBookings, updateBookingStatus } from '../services/bookingService';
import { formatDate } from '../utils/formatters';

const Jobs = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Bookings load error:', err);
      setError('Could not load bookings from Firebase Data Connect.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(bookings.map((b) => b.category).filter(Boolean))],
    [bookings]
  );

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.provider || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || booking.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const applyStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error('Update booking status error:', err);
      alert('Could not update this booking status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const durationLabel = (booking) => {
    if (!booking.totalDurationSeconds) return '—';
    const hours = booking.totalDurationSeconds / 3600;
    return `${hours.toFixed(1)}h`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Jobs</h1>
          <p className="text-gray-500">Manage bookings, matching, and assignments</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          Post Job
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by category, client, or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
          <Loader2 size={20} className="animate-spin" />
          Loading bookings…
        </div>
      ) : (
        <>
          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy truncate">
                      {booking.category || 'Booking'}
                    </h3>
                    <p className="text-xs text-gray-500">{booking.id}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                {booking.serviceLocation && (
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{booking.serviceLocation}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Client:</span>
                    <span className="font-medium truncate">{booking.client || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Provider:</span>
                    <span className="truncate">{booking.provider || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Start:</span>
                    <span>{formatDate(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Duration:</span>
                    <span>{durationLabel(booking)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {booking.categoryId ? `Category ID: ${booking.categoryId}` : ''}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} className="text-gray-400" />
                    </button>
                    {booking.status === 'open' && (
                      <button
                        disabled={updatingId === booking.id}
                        onClick={() => applyStatusChange(booking.id, 'in_progress')}
                        className="flex items-center gap-1 text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {updatingId === booking.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        <span className="text-xs font-medium">Assign</span>
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        disabled={updatingId === booking.id}
                        onClick={() => applyStatusChange(booking.id, 'completed')}
                        className="flex items-center gap-1 text-success hover:bg-success/10 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {updatingId === booking.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        <span className="text-xs font-medium">Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found matching your filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;