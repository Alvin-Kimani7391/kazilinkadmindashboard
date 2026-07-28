import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, CreditCard, Star,
  TrendingUp, Zap, CheckCircle, ArrowRight,
  UserPlus, PlusCircle, Wallet, Award, AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { getBookings } from '../services/bookingService';
import { getReviews } from '../services/reviewService';
import { getUsers } from '../services/userService';
import { timeAgo } from '../utils/formatters';

const ICONS = {
  open: '📋',
  in_progress: '🛠️',
  completed: '✅',
  cancelled: '❌',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good Morning');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [counts, setCounts] = useState({ users: 0, bookings: 0, reviews: 0, notifications: 0 });
  const [revenue, setRevenue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topWorkers, setTopWorkers] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [stats, bookings, reviews, users] = await Promise.all([
          getDashboardStats(),
          getBookings(),
          getReviews(),
          getUsers(),
        ]);

        if (cancelled) return;

        setCounts(stats);

        // Build a providerId -> hourlyRate lookup so completed bookings can
        // be turned into a revenue figure (Booking itself has no amount field).
        const rateByProviderId = {};
        users.forEach((u) => {
          if (u.id) rateByProviderId[u.id] = u.hourlyRate || 0;
        });

        const completed = bookings.filter((b) => b.status === 'completed');
        const totalRevenue = completed.reduce((sum, b) => {
          const hours = (b.totalDurationSeconds || 0) / 3600;
          const rate = rateByProviderId[b.providerId] ?? 0;
          return sum + hours * rate;
        }, 0);
        setRevenue(totalRevenue);

        const avgRating = reviews.length
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
          : 0;
        setAverageRating(avgRating);

        // Recent activity: latest 4 bookings, described by their status.
        const sortedBookings = [...bookings].sort((a, b) => {
          const aTime = a.startTime?.toDate ? a.startTime.toDate() : new Date(a.startTime || 0);
          const bTime = b.startTime?.toDate ? b.startTime.toDate() : new Date(b.startTime || 0);
          return bTime - aTime;
        });

        const activity = sortedBookings.slice(0, 4).map((b) => ({
          user: b.client || 'Client',
          action:
            b.status === 'completed'
              ? `Completed a ${b.category || 'job'} booking`
              : b.status === 'in_progress'
              ? `${b.category || 'Job'} in progress with ${b.provider || 'provider'}`
              : b.status === 'cancelled'
              ? `Cancelled a ${b.category || 'job'} booking`
              : `Posted a ${b.category || 'job'} booking`,
          time: timeAgo(b.startTime),
          icon: ICONS[b.status] || '📋',
        }));
        setRecentActivity(activity);

        // Top workers: rank providers by completed booking count, with
        // average rating pulled from reviews on their bookings.
        const bookingById = {};
        bookings.forEach((b) => { bookingById[b.id] = b; });

        const providerStats = {};
        completed.forEach((b) => {
          if (!b.providerId) return;
          if (!providerStats[b.providerId]) {
            providerStats[b.providerId] = { name: b.provider || 'Provider', jobs: 0, ratings: [] };
          }
          providerStats[b.providerId].jobs += 1;
        });

        reviews.forEach((r) => {
          const booking = bookingById[r.bookingId];
          if (booking?.providerId && providerStats[booking.providerId]) {
            providerStats[booking.providerId].ratings.push(r.rating || 0);
          }
        });

        const ranked = Object.values(providerStats)
          .map((p) => ({
            name: p.name,
            jobs: p.jobs,
            rating: p.ratings.length
              ? (p.ratings.reduce((s, r) => s + r, 0) / p.ratings.length).toFixed(1)
              : '—',
          }))
          .sort((a, b) => b.jobs - a.jobs)
          .slice(0, 3);
        setTopWorkers(ranked);
      } catch (err) {
        console.error('Dashboard load error:', err);
        if (!cancelled) setError('Could not load live dashboard data. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const stats = [
    { title: 'Total Users', value: counts.users.toLocaleString(), icon: Users, color: 'from-[#FFB84D] to-[#E69A30]', bg: 'from-[#FFB84D]/10 to-[#E69A30]/10', path: '/users' },
    { title: 'Total Jobs', value: counts.bookings.toLocaleString(), icon: Briefcase, color: 'from-blue-500 to-blue-600', bg: 'from-blue-500/10 to-blue-600/10', path: '/jobs' },
    { title: 'Revenue', value: `KES ${Math.round(revenue).toLocaleString()}`, icon: CreditCard, color: 'from-green-500 to-green-600', bg: 'from-green-500/10 to-green-600/10', path: '/payments' },
    { title: 'Rating', value: `${averageRating.toFixed(1)} ★`, icon: Star, color: 'from-purple-500 to-purple-600', bg: 'from-purple-500/10 to-purple-600/10', path: '/reviews' },
  ];

  const quickActions = [
    { title: 'Add User', icon: UserPlus, color: 'from-[#FFB84D] to-[#E69A30]', path: '/users' },
    { title: 'Post Job', icon: PlusCircle, color: 'from-blue-500 to-blue-600', path: '/jobs' },
    { title: 'Payments', icon: Wallet, color: 'from-green-500 to-green-600', path: '/payments' },
    { title: 'Reviews', icon: Award, color: 'from-purple-500 to-purple-600', path: '/reviews' },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8 p-6 sm:p-8 glass rounded-2xl glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFB84D]/5 to-[#E69A30]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A253F]">
                {greeting}, Admin! 👋
              </h2>
              <p className="text-gray-500 mt-1">Here's what's happening on KaziLink today</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 rounded-xl text-sm font-medium text-[#1A253F]">
                <Zap size={16} className="inline mr-1 text-[#FFB84D]" />
                Live Data
              </span>
              <span className="px-4 py-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl text-sm font-medium text-green-600">
                <CheckCircle size={16} className="inline mr-1" />
                Firestore connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(stat.path)}
            className={`relative overflow-hidden animated-card cursor-pointer rounded-2xl p-6 bg-gradient-to-br ${stat.bg} border border-white/50 hover:border-[#FFB84D]/30`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon size={18} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A253F]">
                {loading ? '—' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#1A253F] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#FFB84D] to-[#E69A30] rounded-full"></span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(action.path)}
              className="group relative overflow-hidden p-6 glass rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative z-10 text-center">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <action.icon size={24} className="text-white" />
                </div>
                <p className="text-sm font-medium text-[#1A253F]">{action.title}</p>
                <ArrowRight size={16} className="mx-auto mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-[#1A253F] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-[#FFB84D] to-[#E69A30] rounded-full"></span>
            Recent Activity
            <span className="ml-auto text-xs text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full">Live</span>
          </h3>
          <div className="space-y-4">
            {loading && <p className="text-sm text-gray-400">Loading recent activity…</p>}
            {!loading && recentActivity.length === 0 && (
              <p className="text-sm text-gray-400">No bookings yet.</p>
            )}
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-lg shadow-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A253F]">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.action}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Workers */}
        <div className="glass rounded-2xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-[#1A253F] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-[#FFB84D] to-[#E69A30] rounded-full"></span>
            Top Workers
            <span className="ml-auto text-xs text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full">⭐</span>
          </h3>
          <div className="space-y-4">
            {loading && <p className="text-sm text-gray-400">Loading top workers…</p>}
            {!loading && topWorkers.length === 0 && (
              <p className="text-sm text-gray-400">No completed bookings yet.</p>
            )}
            {topWorkers.map((worker, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-2xl">
                    🧰
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A253F]">{worker.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{worker.jobs} jobs</span>
                    <span className="flex items-center gap-1 text-xs text-[#FFB84D]">
                      <Star size={12} className="fill-[#FFB84D]" />
                      {worker.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
