import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users as UsersIcon, Search, Filter, UserPlus, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'John Kamau', email: 'john@example.com', role: 'Worker', status: 'Verified', joined: '2024-01-15', icon: '👨‍🔧' },
    { id: 2, name: 'Jane Muthoni', email: 'jane@example.com', role: 'Employer', status: 'Verified', joined: '2024-02-01', icon: '👩‍💼' },
    { id: 3, name: 'Peter Ochieng', email: 'peter@example.com', role: 'Worker', status: 'Pending', joined: '2024-03-10', icon: '🔨' },
    { id: 4, name: 'Sarah Wanjiku', email: 'sarah@example.com', role: 'Worker', status: 'Verified', joined: '2023-12-20', icon: '🧹' },
    { id: 5, name: 'Michael Njoroge', email: 'michael@example.com', role: 'Employer', status: 'Pending', joined: '2024-03-12', icon: '👔' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    if (status === 'Verified') return <CheckCircle size={16} className="text-green-500" />;
    if (status === 'Pending') return <Clock size={16} className="text-yellow-500" />;
    return <XCircle size={16} className="text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Users</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-[#1A253F] transition-colors px-4 py-2 hover:bg-white/20 rounded-xl"
        >
          Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-[#1A253F]">2,847</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-green-600">2,134</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-yellow-600">713</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-[#1A253F]">45</p>
            <p className="text-xs text-gray-500">New Today</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="glass rounded-2xl p-4 border border-white/50 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 transition-all duration-300"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/70 transition-all duration-300">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-[#1A253F] rounded-xl font-medium hover:shadow-lg hover:shadow-[#FFB84D]/25 transition-all duration-300">
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FFB84D]/5 to-[#E69A30]/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/20 transition-all duration-300 group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-xl">
                          {user.icon}
                        </div>
                        <span className="text-sm font-medium text-[#1A253F]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Worker' ? 'bg-[#FFB84D]/10 text-[#FFB84D]' : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Verified' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.joined}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;