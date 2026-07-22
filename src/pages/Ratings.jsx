import { useState } from 'react';
import { Search, Star, Filter, ThumbsUp, MessageSquare } from 'lucide-react';
import { ratings } from '../data/mockData';

const Ratings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const filteredRatings = ratings.filter(r => {
    const matchesSearch = r.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const ratingCounts = ratings.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Ratings</h1>
          <p className="text-gray-500">Manage reviews and ratings from employers</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-500">Average Rating</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="text-primary fill-primary" size={20} />
              <span className="text-xl font-bold text-navy">{averageRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total Reviews</p>
            <p className="text-xl font-bold text-navy">{ratings.length}</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h4 className="font-semibold text-navy mb-4">Rating Distribution</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{star}</span>
                  <Star size={14} className="text-primary fill-primary" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 w-12 text-right">
                  {count}
                </div>
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
              placeholder="Search ratings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
      <div className="space-y-4">
        {filteredRatings.map((rating) => (
          <div key={rating.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < rating.rating ? 'text-primary fill-primary' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-navy">{rating.rating}.0</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">Job: {rating.jobId}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{rating.comment}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    Employer: {rating.employer}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    Worker: {rating.worker}
                  </span>
                  <span>{rating.date}</span>
                </div>
              </div>
              <button className="text-xs text-primary hover:underline whitespace-nowrap ml-4">
                View Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ratings;