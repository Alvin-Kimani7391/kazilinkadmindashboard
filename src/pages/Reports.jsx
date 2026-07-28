import { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { generateReport, getRatingDistribution } from '../services/reportService';
import { getDashboardStats } from '../services/dashboardService';

const Reports = () => {
  const [period, setPeriod] = useState('weekly');
  const [report, setReport] = useState(null);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [reportData, distributionData, statsData] = await Promise.all([
          generateReport(period),
          getRatingDistribution(),
          getDashboardStats(),
        ]);
        if (cancelled) return;
        setReport(reportData);
        setDistribution(distributionData);
        setOverview(statsData);
      } catch (err) {
        console.error('Reports load error:', err);
        if (!cancelled) setError('Could not generate report from Firestore.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [period]);

  const totalReviewsInDistribution = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports</h1>
          <p className="text-gray-500">Live analytics generated from Firestore</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                period === p ? 'bg-primary text-navy' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Calendar size={16} />
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading || !report ? (
        <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
          <Loader2 size={20} className="animate-spin" />
          Generating report…
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Users</p>
                  <p className="text-2xl font-bold text-navy">{report.users}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users size={24} className="text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Bookings</p>
                  <p className="text-2xl font-bold text-navy">{report.jobs}</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <Briefcase size={24} className="text-info" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-primary">{report.revenue}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CreditCard size={24} className="text-success" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-navy">{report.activeUsers}</p>
                </div>
                <div className="p-3 bg-navy/10 rounded-lg">
                  <Users size={24} className="text-navy" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-navy mb-4">All-Time Overview</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Users</span>
                  <span className="font-semibold text-navy">{overview?.users ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Bookings</span>
                  <span className="font-semibold text-navy">{overview?.bookings ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Completed This Period</span>
                  <span className="font-semibold text-success">{report.completedJobs}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Reviews</span>
                  <span className="font-semibold text-navy">{overview?.reviews ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Average Rating (period)</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">{report.averageRating}</span>
                    <Star size={14} className="text-primary fill-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-navy mb-4">Rating Distribution (all-time)</h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star] || 0;
                  const percentage = totalReviewsInDistribution
                    ? (count / totalReviewsInDistribution) * 100
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-14">
                        <span className="text-sm">{star}</span>
                        <Star size={14} className="text-primary fill-primary" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500 w-10 text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;