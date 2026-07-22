import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { notifications } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

const Topbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users, jobs, payments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-error text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-30">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-semibold text-navy">Notifications</h4>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-navy">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-gray-100">
                <button className="text-sm text-primary hover:underline">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-navy font-bold">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-navy">Admin</p>
              <p className="text-xs text-gray-500">admin@kazilink.com</p>
            </div>
            <ChevronDown size={18} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-30">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-navy font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-navy">Admin User</p>
                    <p className="text-xs text-gray-500">admin@kazilink.com</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm">
                  <User size={18} className="text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-error"
                >
                  <LogOut size={18} className="text-error" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;