import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Menu, X, Bell, Settings,
  LayoutDashboard, Users, Briefcase, CreditCard, Star,
  ChevronDown, Search
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';



const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const profileRef = useRef(null);

  // Pull the logged-in admin from wherever your auth actually stores it.
  // Falls back gracefully so the UI never shows broken/undefined text.
  const admin = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adminUser'));
      return {
        name: stored?.name || 'Admin',
        email: stored?.email || 'admin@kazilink.com',
      };
    } catch {
      return { name: 'Admin', email: 'admin@kazilink.com' };
    }
  }, []);

  const initial = admin.name.charAt(0).toUpperCase();

  // Example: fetch a real unread count instead of hardcoding "3".
  // Swap this stub for your actual API call.
  useEffect(() => {
    let cancelled = false;
    const fetchNotificationCount = async () => {
      try {
        // const res = await fetch('/api/notifications/unread-count');
        // const data = await res.json();
        // if (!cancelled) setNotificationCount(data.count);
        if (!cancelled) setNotificationCount(3); // placeholder until wired up
      } catch {
        if (!cancelled) setNotificationCount(0);
      }
    };
    fetchNotificationCount();
    return () => { cancelled = true; };
  }, []);

  // Close the profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Matches nested routes too: /jobs/123 still highlights "Jobs"
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/reviews', icon: Star, label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      {/* ===== TOP BAR - SHARED ACROSS ALL PAGES ===== */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} className="text-[#1A253F]" /> : <Menu size={24} className="text-[#1A253F]" />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFB84D]/25">
              <span className="text-xl">🔧</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">KaziLink</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
              className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 text-sm w-48 lg:w-64 transition-all duration-300"
            />
          </form>

          {/* Notifications */}
          <button
            onClick={() => handleNavigate('/notifications')}
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            className="relative p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            <Bell size={20} className="text-[#1A253F]" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavigate('/settings')}
            aria-label="Settings"
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            <Settings size={20} className="text-[#1A253F]" />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              aria-haspopup="true"
              aria-expanded={showProfile}
              className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-xl transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {initial}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-[#1A253F]">{admin.name}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#1A253F] truncate">{admin.name}</p>
                      <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { handleNavigate('/settings'); setShowProfile(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/20 rounded-xl transition-all duration-300 text-sm text-[#1A253F]"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-red-50 rounded-xl transition-all duration-300 text-sm text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-b border-white/20 p-4 space-y-2 animate-slideDown">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#FFB84D]/10 to-[#E69A30]/10 text-[#FFB84D]'
                  : 'text-[#1A253F] hover:bg-white/20'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== SIDEBAR + CONTENT ===== */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 glass border-r border-white/20 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-white shadow-lg shadow-[#FFB84D]/25'
                    : 'text-[#1A253F] hover:bg-white/20'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer - now flows naturally instead of absolute-overlapping nav items */}
          <div className="p-4 border-t border-white/10">
            <div className="glass rounded-xl p-3 border border-white/20">
              <p className="text-xs font-medium text-[#1A253F]">Need Help?</p>
              <p className="text-[10px] text-gray-400 mt-1">Contact support 24/7</p>
            </div>
          </div>
        </aside>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;