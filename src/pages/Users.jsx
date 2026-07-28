import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, UserPlus, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import { formatDate } from '../utils/formatters';

// Emoji avatar fallback keyed by role, since User docs don't store an icon.
const ROLE_ICON = {
  worker: '👨‍🔧',
  provider: '👨‍🔧',
  employer: '👩‍💼',
  client: '👩‍💼',
  admin: '🛡️',
};

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Users load error:', err);
      setError('Could not load users from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User schema has no verified/pending status field — these counts are
  // grouped by `role` instead, which is what's actually available.
  const roleCounts = useMemo(() => {
    return users.reduce((acc, u) => {
      const role = (u.role || 'unspecified').toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Could not delete user. Please try again.');
    } finally {
      setOpenMenuId(null);
    }
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
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Stats — grouped by role, since that's what the User schema actually has */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-[#1A253F]">{loading ? '—' : users.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-green-600">
              {loading ? '—' : (roleCounts.worker || roleCounts.provider || 0)}
            </p>
            <p className="text-xs text-gray-500">Workers</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? '—' : (roleCounts.employer || roleCounts.client || 0)}
            </p>
            <p className="text-xs text-gray-500">Employers</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-[#1A253F]">{loading ? '—' : (roleCounts.admin || 0)}</p>
            <p className="text-xs text-gray-500">Admins</p>
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
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
              <Loader2 size={20} className="animate-spin" />
              Loading users…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#FFB84D]/5 to-[#E69A30]/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hourly Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/20 transition-all duration-300 group relative">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-xl overflow-hidden">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              ROLE_ICON[(user.role || '').toLowerCase()] || '👤'
                            )}
                          </div>
                          <span className="text-sm font-medium text-[#1A253F]">{user.name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFB84D]/10 text-[#FFB84D] capitalize">
                          {user.role || 'unspecified'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.hourlyRate ? `KES ${user.hourlyRate.toLocaleString()}/hr` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.phoneNumber || '—'}</td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-300"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                        {openMenuId === user.id && (
                          <div className="absolute right-4 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No users match your search.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;