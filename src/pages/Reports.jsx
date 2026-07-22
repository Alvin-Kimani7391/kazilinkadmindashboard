import { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { reports, dashboardStats } from '../data/mockData';

const Reports = () => {
  const [period, setPeriod] = useState('weekly');

  const data = reports[period];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports</h1>
          <p className="text-gray-500">View analytics and generate reports</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                period === p
                  ? 'bg-primary text-navy'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Calendar size={16} />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Users</p>
              <p className="text-2xl font-bold text-navy">{data.users}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users size={24} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Jobs</p>
              <p className="text-2xl font-bold text-navy">{data.jobs}</p>
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
              <p className="text-2xl font-bold text-primary">{data.revenue}</p>
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
              <p className="text-2xl font-bold text-navy">{data.activeUsers}</p>
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
          <h4 className="font-semibold text-navy mb-4">Quick Stats</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total Users</span>
              <span className="font-semibold text-navy">{dashboardStats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Verified Users</span>
              <span className="font-semibold text-success">{dashboardStats.verifiedUsers}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Pending Verification</span>
              <span className="font-semibold text-warning">{dashboardStats.pendingVerification}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total Jobs</span>
              <span className="font-semibold text-navy">{dashboardStats.totalJobs}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Average Rating</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">{dashboardStats.averageRating}</span>
                <span className="text-xs text-gray-400">⭐</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="font-semibold text-navy mb-4">Growth Indicators</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">User Growth</span>
                <span className="flex items-center gap-1 text-success text-sm font-semibold">
                  <TrendingUp size={16} />
                  +12.5%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Job Completion Rate</span>
                <span className="flex items-center gap-1 text-success text-sm font-semibold">
                  <TrendingUp size={16} />
                  +8.3%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Revenue Growth</span>
                <span className="flex items-center gap-1 text-success text-sm font-semibold">
                  <TrendingUp size={16} />
                  +15.2%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Active Users</span>
                <span className="flex items-center gap-1 text-success text-sm font-semibold">
                  <TrendingUp size={16} />
                  +5.7%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-info rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;