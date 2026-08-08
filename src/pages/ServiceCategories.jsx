import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, MoreVertical, Loader2, AlertCircle, X, Edit2, Trash2, Tag } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/serviceCategoryService';

const ServiceCategories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);

  const menuRef = useRef(null);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('ServiceCategory load error:', err);
      setError('Could not load service categories from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setShowModal(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name || '');
    setOpenMenuId(null);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? Active bookings using this category may be affected.')) return;
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      console.error('Delete category error:', err);
      alert('Could not delete category. Please try again.');
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        // Update
        const updated = await updateCategory(editingCategory.id, { name: categoryName.trim() });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, name: updated.name } : c))
        );
      } else {
        // Create
        const created = await createCategory({ name: categoryName.trim() });
        setCategories((prev) => [created, ...prev]);
      }
      setShowModal(false);
      setCategoryName('');
      setEditingCategory(null);
    } catch (err) {
      console.error('Save category error:', err);
      alert('Failed to save service category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Service Categories</h1>
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

        {/* Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 border border-white/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFB84D]/10 flex items-center justify-center text-[#E69A30]">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A253F]">{loading ? '—' : categories.length}</p>
              <p className="text-xs text-gray-500">Active Service Categories</p>
            </div>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="glass rounded-2xl p-4 border border-white/50 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 transition-all duration-300"
              />
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-[#1A253F] rounded-xl font-medium hover:shadow-lg hover:shadow-[#FFB84D]/25 transition-all duration-300"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="glass rounded-2xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
              <Loader2 size={20} className="animate-spin" />
              Loading categories…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#FFB84D]/5 to-[#E69A30]/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-white/20 transition-all duration-300">
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">
                        {category.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FFB84D]/10 flex items-center justify-center text-sm">
                            🛠️
                          </div>
                          <span className="text-sm font-semibold text-[#1A253F]">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-300"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                        {openMenuId === category.id && (
                          <div ref={menuRef} className="absolute right-6 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <button
                              onClick={() => handleOpenEditModal(category)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No service categories found.</div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#1A253F] mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Repairs"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB84D]/50 text-sm outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-[#FFB84D] text-[#1A253F] font-medium text-sm hover:brightness-105 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategories;