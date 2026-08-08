import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, MoreVertical, Loader2, AlertCircle, X } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getUsers, deleteUser, createUser } from '../services/userService';
import { formatDate } from '../utils/formatters';

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
  
  // Add User Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Initialized with all backend-supported fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'provider',
    phoneNumber: '',
    profilePicture: '',
    bio: '',
    hourlyRate: '',
  });

  const menuRef = useRef(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Users load error:', err);
      setError('Could not load users from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Close open action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture.trim() || null,
        bio: formData.bio.trim() || null,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
      };

      const newUser = await createUser(payload);
      setUsers((prev) => [newUser, ...prev]);
      setShowAddModal(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'provider',
        phoneNumber: '',
        profilePicture: '',
        bio: '',
        hourlyRate: '',
      });
    } catch (err) {
      console.error('Create user error:', err);
      alert('Failed to create user. Ensure required fields (Name, Email, Role, Phone) are provided.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
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

      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-[#1A253F]">{loading ? '—' : users.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-green-600">
              {loading ? '—' : ((roleCounts.provider || 0) + (roleCounts.worker || 0))}
            </p>
            <p className="text-xs text-gray-500">Providers / Workers</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/50">
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? '—' : ((roleCounts.client || 0) + (roleCounts.employer || 0))}
            </p>
            <p className="text-xs text-gray-500">Clients / Employers</p>
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
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 transition-all duration-300"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-[#1A253F] rounded-xl font-medium hover:shadow-lg hover:shadow-[#FFB84D]/25 transition-all duration-300"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email & Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/20 transition-all duration-300">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB84D]/10 to-[#E69A30]/10 flex items-center justify-center text-xl overflow-hidden shrink-0">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              ROLE_ICON[(user.role || '').toLowerCase()] || '👤'
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#1A253F] block">{user.name || 'Unnamed'}</span>
                            {user.bio && <span className="text-xs text-gray-400 line-clamp-1">{user.bio}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{user.email || '—'}</div>
                        <div className="text-xs text-gray-400">{user.phoneNumber || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFB84D]/10 text-[#FFB84D] capitalize">
                          {user.role || 'unspecified'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.hourlyRate ? `KES ${user.hourlyRate.toLocaleString()}/hr` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {user.createdAt ? formatDate(user.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-300"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                        {openMenuId === user.id && (
                          <div ref={menuRef} className="absolute right-4 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#1A253F] mb-4">Add New User</h2>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flex Otieno"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. flex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +254712345678"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none bg-white"
                  >
                    <option value="provider">Provider (Worker)</option>
                    <option value="client">Client (Employer)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hourly Rate (KES)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2500"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Profile Picture URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/profiles/avatar.jpg"
                  value={formData.profilePicture}
                  onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bio / Description</label>
                <textarea
                  rows="2"
                  placeholder="Short description or bio..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-[#FFB84D] text-[#1A253F] font-medium text-sm hover:brightness-105 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;