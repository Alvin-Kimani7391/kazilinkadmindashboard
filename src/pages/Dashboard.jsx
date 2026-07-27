import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, CreditCard, Star,
  TrendingUp, Zap, CheckCircle, ArrowRight,
  UserPlus, PlusCircle, Wallet, Award
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from "../firebase";

console.log("Firestore:", db);

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const stats = [
    { title: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, color: 'from-[#FFB84D] to-[#E69A30]', bg: 'from-[#FFB84D]/10 to-[#E69A30]/10', path: '/users' },
    { title: 'Total Jobs', value: '1,243', change: '+8.3%', icon: Briefcase, color: 'from-blue-500 to-blue-600', bg: 'from-blue-500/10 to-blue-600/10', path: '/jobs' },
    { title: 'Revenue', value: 'KES 425K', change: '+15.2%', icon: CreditCard, color: 'from-green-500 to-green-600', bg: 'from-green-500/10 to-green-600/10', path: '/payments' },
    { title: 'Rating', value: '4.7 ★', change: '+0.3%', icon: Star, color: 'from-purple-500 to-purple-600', bg: 'from-purple-500/10 to-purple-600/10', path: '/reviews' },
  ];

  const quickActions = [
    { title: 'Add User', icon: UserPlus, color: 'from-[#FFB84D] to-[#E69A30]', path: '/users' },
    { title: 'Post Job', icon: PlusCircle, color: 'from-blue-500 to-blue-600', path: '/jobs' },
    { title: 'Payments', icon: Wallet, color: 'from-green-500 to-green-600', path: '/payments' },
    { title: 'Reviews', icon: Award, color: 'from-purple-500 to-purple-600', path: '/reviews' },
  ];

  const recentActivity = [
    { user: 'John Kamau', action: 'Registered as a worker', time: '2 min ago', icon: '👤', color: 'from-[#FFB84D] to-[#E69A30]' },
    { user: 'Jane Muthoni', action: 'Posted a plumbing job', time: '15 min ago', icon: '💼', color: 'from-blue-500 to-blue-600' },
    { user: 'Sarah Wanjau', action: 'Completed a cleaning job', time: '1 hour ago', icon: '✅', color: 'from-green-500 to-green-600' },
    { user: 'Peter Ochieng', action: 'Requested withdrawal', time: '3 hours ago', icon: '💰', color: 'from-purple-500 to-purple-600' },
  ];

  const topWorkers = [
    { name: 'Sarah Wanjiku', jobs: 78, rating: 4.9, icon: '🧹' },
    { name: 'John Kamau', jobs: 45, rating: 4.8, icon: '👨‍🔧' },
    { name: 'Peter Ochieng', jobs: 32, rating: 4.5, icon: '🔨' },
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
                Live Updates
              </span>
              <span className="px-4 py-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl text-sm font-medium text-green-600">
                <CheckCircle size={16} className="inline mr-1" />
                All systems go
              </span>
            </div>
          </div>
        </div>
      </div>

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
              <p className="text-2xl font-bold text-[#1A253F]">{stat.value}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
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
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-all duration-300 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg shadow-lg flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A253F]">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.action}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{item.time}</p>
                  <div className="w-1.5 h-1.5 bg-[#FFB84D] rounded-full ml-auto mt-1 animate-pulse"></div>
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
            {topWorkers.map((worker, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-2xl">
                    {worker.icon}
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
                <button className="text-xs text-[#FFB84D] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
